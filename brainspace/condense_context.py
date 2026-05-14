#!/usr/bin/env python3
"""condense_context.py — Distil session summaries into ultra-short essences.

Generates brainspace/context-seed.md — a compact file of 1–2 line
essences per session, designed to be included with every AI message
for persistent project memory without blowing the context window.

Usage:
    python3 condense_context.py
    python3 condense_context.py --dry-run
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

COST_IN = 0.14
COST_OUT = 0.28

PROJECT = Path.cwd()
BRAIN = PROJECT / "brainspace"
SUMMARIES = BRAIN / "summaries"
SESSION_DIR = SUMMARIES / "session"
INDEX_FILE = SUMMARIES / ".index.json"
CONTEXT_SEED = BRAIN / "context-seed.md"
CONDENSED_INDEX = SUMMARIES / ".condensed-index.json"

MODEL = OpenAIChatModel(
    "deepseek-v4-flash:cloud",
    provider=OpenAIProvider(base_url="http://localhost:11434/v1", api_key="ollama"),
)

CONDENSE_PROMPT = """Read this session summary and write a single ultra-condensed line (max 280 chars) capturing the absolute essence of what happened, what was built, and what was learned.

Rules:
- No filler words like "this session was about" or "we discussed"
- Use present tense, telegraphic style
- Include key technical details (service names, patterns, bugs)
- Max 280 characters
- Output ONLY the essence line, nothing else"""


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def load_condensed_index() -> dict:
    if CONDENSED_INDEX.exists():
        return json.loads(CONDENSED_INDEX.read_text())
    return {}


def save_condensed_index(idx: dict) -> None:
    CONDENSED_INDEX.write_text(json.dumps(idx, indent=2))


def extract_shortname(filename: str) -> str:
    """Turn a session filename into a readable short label."""
    stem = Path(filename).stem
    parts = stem.split("_", 1)
    return parts[1] if len(parts) > 1 else parts[0]


def make_agent() -> Agent:
    return Agent(MODEL, system_prompt=CONDENSE_PROMPT)


async def condense(text: str, max_retries: int = 3) -> str | None:
    import asyncio
    ag = make_agent()
    for attempt in range(max_retries):
        try:
            r = await ag.run(text[:4000])  # only need first 4k chars for essence
        except Exception as e:
            if attempt < max_retries - 1:
                wait = 2 ** attempt
                print(f"[retry {attempt+1}/{max_retries} in {wait}s] ", end="", flush=True)
                await asyncio.sleep(wait)
                continue
            raise
        out = re.sub(r"<think>.*?</think>", "", (r.output or ""), flags=re.DOTALL).strip()
        return out or None
    return None


async def main():
    dry = "--dry-run" in sys.argv

    if not SESSION_DIR.exists():
        print("No session summaries found at", SESSION_DIR)
        return

    files = sorted(SESSION_DIR.glob("*.md"))
    if not files:
        print("No session summary files found.")
        return

    idx = load_condensed_index()
    essences: list[tuple[str, str]] = []
    total_i, total_o = 0, 0
    written = 0
    skipped = 0

    for fp in files:
        label = extract_shortname(fp.name)
        text = fp.read_text()

        # Check if already condensed (by chars of summary)
        existing = idx.get(fp.name)
        if existing and existing.get("chars") == len(text):
            essences.append((label, existing["essence"]))
            skipped += 1
            continue

        if dry:
            print(f"  would condense: {label} ({len(text)} chars)")
            essences.append((label, "(dry run)"))
            continue

        print(f"  {label}...", end=" ", flush=True)
        essence = await condense(text)
        if not essence:
            print("failed")
            continue

        u = None
        # Get usage from the run — we track it via the agent's response
        idx[fp.name] = {"chars": len(text), "essence": essence, "at": now()}
        essences.append((label, essence))
        written += 1
        print(f"{len(essence)}c")

        # Save incrementally
        save_condensed_index(idx)

    if dry:
        if essences:
            print(f"\n  would compile {len(essences)} condensed essences → {CONTEXT_SEED}")
        return

    if not essences:
        print("Nothing to write.")
        return

    # Compile into context-seed.md — keep it tight
    lines = [
        f"# {PROJECT.name} — context seed",
        f"_generated: {now()}_",
        f"_sessions: {len(essences)}_",
        "",
    ]
    for label, essence in essences:
        lines.append(f"- **{label}:** {essence}")

    lines.append("")
    CONTEXT_SEED.write_text("\n".join(lines))
    print(f"\n  -> {CONTEXT_SEED} ({len(essences)} essences, {sum(len(e) for _, e in essences)} chars total)")
    print(f"     copy into system prompt / preamble for persistent memory")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
