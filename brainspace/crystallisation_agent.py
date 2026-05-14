#!/usr/bin/env python3
"""crystallisation_agent.py — Summarise sessions using DeepSeek V4 Flash.

  1. Session summaries  → brainspace/summaries/session/
  2. Repo summary       → brainspace/summaries/repo-summary.md

Usage:
    python3 crystallisation_agent.py
    python3 crystallisation_agent.py --crystalisation "focus on technical decisions"
    python3 crystallisation_agent.py --dry-run
"""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.openai import OpenAIProvider

COST_IN = 0.14   # $/1M input tokens
COST_OUT = 0.28  # $/1M output tokens

DEFAULT_CRYSTALISATION = """As you summarise, keep these purposes in mind:

- Spread love and light in the universe
- Help the human have wonderful experiences building this vegan advocacy platform
- Provide meaningful insights about the VeganHearts codebase, infrastructure, and decisions
- Discover what tasks can automate or simplify the human's workflow
- Remind them of what matters — both technically (architecture, deployment, security) and mission-wise (compassionate world through vegan education)

Focus specifically on:
- AWS infrastructure decisions: Cognito auth, DynamoDB schemas, SES email flows, S3 asset handling, IAM permissions
- Authentication patterns: admin dashboard access, JWT verification, user management flows
- Email system architecture: transactional (SES), mailing list (SESv2), forwarding (WorkMail)
- Deployment configuration: Vercel serverless, environment variables, build pipeline
- UI/UX patterns: Tailwind styling, admin dashboard, event/news management
- Bugs encountered and how they were fixed
- Integration points between services (Next.js ↔ AWS)
- Any gotchas or lessons learned about the tech stack"""

PROJECT = Path.cwd()
BRAIN = PROJECT / "brainspace"
SESSIONS = BRAIN / "sessions"
SUMMARIES = BRAIN / "summaries"
SESSION_OUT = SUMMARIES / "session"
INDEX_FILE = SUMMARIES / ".index.json"
RESULTS = BRAIN / "results"

MODEL = OpenAIChatModel(
    "deepseek-v4-flash:cloud",
    provider=OpenAIProvider(base_url="http://localhost:11434/v1", api_key="ollama"),
)


def now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def read_index():
    if INDEX_FILE.exists():
        return json.loads(INDEX_FILE.read_text())
    return {}


def scope(fp: Path) -> dict:
    t = fp.read_text()
    return {
        "msgs": len(re.findall(r"^\[(USER|AGENT)\]", t, re.MULTILINE)),
        "tools": len(re.findall(r"\[TOOL:", t)),
        "chars": len(t),
    }


def load_session(fp: Path) -> str:
    t = fp.read_text()
    refs = re.findall(r"results/(toolu_\w+\.txt)", t)
    avail = [r for r in refs if (RESULTS / r).exists()]
    if avail:
        t += f"\n\n_Full tool results: {', '.join(avail[:3])}"
        if len(avail) > 3:
            t += f" and {len(avail) - 3} more"
    return t


def make_agent(c: str) -> Agent:
    return Agent(MODEL, system_prompt=(
        "You are an oracle that helps a human remember what matters.\n\n"
        f"{c}\n\nRead the session transcript and summarise what happened. "
        "Keep all valuable details. Don't skip specifics. "
        "Write in whatever form suits the content."
    ))


def make_rollup(c: str, level: str) -> Agent:
    return Agent(MODEL, system_prompt=(
        "You are an oracle synthesising many experiences into wisdom.\n\n"
        f"{c}\n\nRead these {level} summaries and write a higher-level summary. "
        "What patterns emerge? What matters most? Keep specific details. Write concisely."
    ))


async def run(agent, text: str, max_retries: int = 3) -> tuple[str | None, dict]:
    import asyncio
    for attempt in range(max_retries):
        try:
            r = await agent.run(text)
        except Exception as e:
            if attempt < max_retries - 1:
                wait = 2 ** attempt
                print(f"[retry {attempt+1}/{max_retries} in {wait}s] ", end="", flush=True)
                await asyncio.sleep(wait)
                continue
            raise
        t = re.sub(r"<think>.*?</think>", "", (r.output or ""), flags=re.DOTALL).strip()
        u = r.usage()
        return t or None, {"i": u.input_tokens, "o": u.output_tokens}
    return None, {"i": 0, "o": 0}


async def main():
    dry = "--dry-run" in sys.argv
    cx = DEFAULT_CRYSTALISATION
    for a in sys.argv[1:]:
        if a.startswith("--crystalisation="):
            cx = a.split("=", 1)[1]

    SUMMARIES.mkdir(parents=True, exist_ok=True)
    SESSION_OUT.mkdir(parents=True, exist_ok=True)
    idx = read_index()
    files = sorted(SESSIONS.glob("*.md"))
    if not files:
        print("No sessions. Run sync_sessions.py first.")
        return

    ag = make_agent(cx)
    total_i, total_o = 0, 0
    written = 0
    pairs: list[tuple[str, str]] = []

    for fp in files:
        o = SESSION_OUT / fp.name
        s = scope(fp)
        if o.exists() and idx.get(fp.name, {}).get("chars") == s["chars"]:
            pass
        else:
            if dry:
                print(f"  would summarise: {fp.name} ({s['msgs']} msgs, {s['chars']} chars)")
                continue
            print(f"  {fp.name} ({s['msgs']} msgs, {s['chars']} chars)...", end=" ", flush=True)
            summary, u = await run(ag, load_session(fp))
            if not summary:
                print("failed")
                continue
            total_i += u["i"]
            total_o += u["o"]
            o.write_text(summary)
            idx[fp.name] = {"chars": s["chars"], "at": now()}
            written += 1
            print(f"{len(summary.split())}w, {u['i']}i/{u['o']}o")
            with open(str(INDEX_FILE), "w") as f:
                json.dump(idx, f, indent=2)

        if o.exists():
            t = o.read_text()
            title = fp.stem.split("_", 1)[-1] if "_" in fp.stem else fp.stem
            pairs.append((title[:60], t))

    cost = total_i / 1e6 * COST_IN + total_o / 1e6 * COST_OUT

    if written:
        print(f"\n  -> {written} summaries, {total_i}i/{total_o}o = ${cost:.4f}")

    if dry or not pairs:
        return

    # Repo rollup
    ra = make_rollup(cx, "session")
    print(f"  rolling up {len(pairs)} sessions...", end=" ", flush=True)
    text, u = await run(ra, "\n\n".join(f"## {t}\n{s}" for t, s in pairs))
    if text:
        total_i += u["i"]
        total_o += u["o"]
        (SUMMARIES / "repo-summary.md").write_text(
            f"# {PROJECT.name}\n_scope: {len(pairs)} sessions_\n_crystalised: {now()}_\n\n{text}\n")
        print(f"{len(text.split())}w, {u['i']}i/{u['o']}o")

    cost = total_i / 1e6 * COST_IN + total_o / 1e6 * COST_OUT
    print(f"\n  total: {total_i}i/{total_o}o = ${cost:.4f} ({cost*100:.2f}¢)")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
