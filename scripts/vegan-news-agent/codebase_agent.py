#!/usr/bin/env python3
"""
Codebase Advancement Agent — thinks about where Vegan Hearts is going
and makes one small improvement each run.

Reads the codebase, understands the true intention (connection, community,
animal sanctuaries), identifies gaps, makes changes, and reports back.
"""

from __future__ import annotations

import base64
import json
import os
import re
import smtplib
import ssl
import sys
import textwrap
import time as _time
from datetime import datetime, timezone
from email.message import EmailMessage
from pathlib import Path

import httpx
from dotenv import load_dotenv
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.openai import OpenAIProvider

REPO_ROOT = Path(__file__).resolve().parents[2]

# ── Load env ─────────────────────────────────────────────────────────
_script_env = Path(__file__).resolve().parent / ".env"
if _script_env.exists():
    load_dotenv(_script_env)
_repo_env = REPO_ROOT / ".env.local"
if _repo_env.exists():
    load_dotenv(_repo_env, override=False)

DEEPSEEK_KEY = os.getenv("DEEPSEEK_API_KEY", "")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
GITHUB_REPO = os.getenv("GITHUB_REPO", "peterdonaghey/vegan-hearts")
GITHUB_BASE = os.getenv("GITHUB_BASE_BRANCH", "main")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

if not DEEPSEEK_KEY or not GITHUB_TOKEN:
    print("❌ Need DEEPSEEK_API_KEY and GITHUB_TOKEN")
    sys.exit(1)

# ── HTTP client ──────────────────────────────────────────────────────
_http: httpx.Client | None = None
def http() -> httpx.Client:
    global _http
    if _http is None:
        _http = httpx.Client(timeout=20.0, follow_redirects=True)
    return _http


def _gh_api(method: str, path: str, **kwargs) -> httpx.Response:
    resp = http().request(
        method, f"https://api.github.com{path}",
        headers={
            "Authorization": f"Bearer {GITHUB_TOKEN}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }, **kwargs,
    )
    if resp.status_code >= 400:
        raise RuntimeError(f"GitHub API {method} {path}: {resp.status_code} {resp.text[:200]}")
    return resp


# ══════════════════════════════════════════════════════════════════════
#  Tools
# ══════════════════════════════════════════════════════════════════════

_changed_files: list[str] = []


def _tracked_path(path: str) -> Path:
    return REPO_ROOT / path.lstrip("/")


def read_project_file(path: str) -> str:
    """Read a file from the project. Path is relative to repo root.
    
    Use this to explore the codebase, understand the current state,
    find things to improve. Examples: 'README.md', 'app/page.tsx',
    'app/components/GoodNews.tsx', 'package.json'
    """
    global _changed_files
    full = _tracked_path(path)
    if not full.exists():
        return f"ERROR: file not found: {path}"
    if full.is_dir():
        return "\n".join(str(p.relative_to(REPO_ROOT)) for p in sorted(full.rglob("*")) if p.is_file())
    content = full.read_text()
    return content[:15000]  # limit to 15k chars


def list_dir(path: str) -> str:
    """List files and directories at a path relative to repo root."""
    full = REPO_ROOT / path.lstrip("/")
    if not full.exists() or not full.is_dir():
        return f"ERROR: directory not found: {path}"
    return "\n".join(str(p.name) for p in sorted(full.iterdir()))


def search_web(query: str) -> str:
    """Search the web for inspiration, ideas, or examples.
    
    Use this to research how other vegan/community platforms work,
    find open-source tools, or discover features to build.
    """
    try:
        resp = http().get(
            "https://api.search.brave.com/res/v1/web/search",
            headers={"Accept": "application/json", "X-Subscription-Token": os.getenv("BRAVE_API_KEY", "")},
            params={"q": query, "count": 5},
        )
        resp.raise_for_status()
        results = resp.json().get("web", {}).get("results", [])
        return json.dumps([{"title": r["title"], "url": r["url"], "snippet": r.get("description", "")} for r in results], indent=2)
    except Exception as e:
        return f"Search failed: {e}"


def edit_file(path: str, old_text: str, new_text: str) -> str:
    """Make a surgical edit to a file.
    
    Replace `old_text` with `new_text` in the given file.
    Path is relative to repo root.
    Only make changes that align with Vegan Hearts' mission:
    connection, community, animal sanctuaries, vegan compassion.
    """
    global _changed_files
    full = _tracked_path(path)
    if not full.exists():
        return f"ERROR: file not found: {path}"
    content = full.read_text()
    if old_text not in content:
        return f"ERROR: old_text not found in {path}"
    new_content = content.replace(old_text, new_text, 1)
    full.write_text(new_content)
    rel = str(full.relative_to(REPO_ROOT))
    if rel not in _changed_files:
        _changed_files.append(rel)
    return f"✅ Edited {path}"


def create_pr(title: str, description: str, commit_message: str = "") -> str:
    """Create a branch, commit changes, and open a PR.
    
    Call this ONLY after making changes with edit_file().
    Uses all pending changes in the working tree.
    """
    if not _changed_files:
        return "No changes to commit. Make an edit first."

    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    branch = f"evolve/{timestamp}"

    base = _gh_api("GET", f"/repos/{GITHUB_REPO}/git/ref/heads/{GITHUB_BASE}")
    base_sha = base.json()["object"]["sha"]
    _gh_api("POST", f"/repos/{GITHUB_REPO}/git/refs",
            json={"ref": f"refs/heads/{branch}", "sha": base_sha})

    commit_msg = commit_message or f"feat: evolve — {title[:60]}"

    for rel_path in _changed_files:
        content = _tracked_path(rel_path).read_text()
        file_info = _gh_api("GET", f"/repos/{GITHUB_REPO}/contents/{rel_path}",
                            params={"ref": GITHUB_BASE})
        file_sha = file_info.json()["sha"]
        _gh_api("PUT", f"/repos/{GITHUB_REPO}/contents/{rel_path}",
                json={"message": commit_msg,
                       "content": base64.b64encode(content.encode()).decode(),
                       "branch": branch, "sha": file_sha})

    pr = _gh_api("POST", f"/repos/{GITHUB_REPO}/pulls",
                 json={"title": title, "body": description,
                       "head": branch, "base": GITHUB_BASE})
    pr_url = pr.json().get("html_url", "")
    _changed_files.clear()
    return f"✅ PR created: {pr_url}"


def send_report(subject: str, body: str) -> str:
    """Send an email report to the project owner.
    
    Use this to share your thoughts, questions, findings, or
    ask for guidance on what to work on next.
    """
    if not SMTP_PASSWORD:
        return "No SMTP_PASSWORD — email not sent"
    try:
        msg = EmailMessage()
        msg.set_content(body)
        msg["Subject"] = subject
        msg["From"] = "Vegan Hearts Agent"
        msg["To"] = "donagheypeter@googlemail.com"
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as s:
            s.login("donagheypeter@gmail.com", SMTP_PASSWORD)
            s.send_message(msg)
        return f"✅ Email sent: {subject}"
    except Exception as e:
        return f"Email failed: {e}"


def get_open_issues() -> str:
    """Get open issues to understand what the project needs."""
    data = _gh_api("GET", f"/repos/{GITHUB_REPO}/issues?state=open&sort=created&per_page=10").json()
    return json.dumps([{"number": i["number"], "title": i["title"]} for i in data if "pull" not in i], indent=2)


# ══════════════════════════════════════════════════════════════════════
#  Agent
# ══════════════════════════════════════════════════════════════════════

_model = OpenAIChatModel(
    "deepseek-v4-flash",
    provider=OpenAIProvider(base_url="https://api.deepseek.com/v1", api_key=DEEPSEEK_KEY),
)

agent = Agent(
    _model,
    system_prompt=textwrap.dedent("""\
        You are the **Vegan Hearts Evolution Agent**. Your purpose is to
        advance this codebase towards its true intention.

        ## The mission
        Vegan Hearts exists to help vegans connect with each other, make
        animal sanctuaries visible and accessible, and build a feeling of
        real community — not likes, not algorithms, just genuine connection.
        The codebase should reflect this warmth, simplicity, and purpose.

        ## How to think
        Before making any change, read the key files to understand the
        current state: README.md, app/page.tsx, package.json,
        app/components/*.tsx. Ask yourself:
        - What does this project truly need right now?
        - Does this change bring people closer to sanctuaries?
        - Does this help vegans find each other?
        - Is this minimal, lightweight, open-source?
        - Would this feel warm and human?

        ## What to do each run
        1. Read a few key files to understand the current state
        2. Research one idea (search_web for inspiration)
        3. Make ONE small, focused change — a single edit, not a rewrite
        4. Create a PR with the change
        5. Send a report email explaining what you did and why

        ## The rhythm
        - One change per run. Small, surgical, meaningful.
        - Over time, the project evolves organically.
        - If you're unsure what to do, send a report asking for direction.
        - If there's nothing to improve today, say so honestly.

        You have tools to read files, edit files, search the web,
        create PRs, and send email reports. Start by reading the
        project to understand where we are.
    """),
    tools=[
        read_project_file,
        list_dir,
        search_web,
        edit_file,
        create_pr,
        send_report,
        get_open_issues,
    ],
)


# ══════════════════════════════════════════════════════════════════════
#  Main
# ══════════════════════════════════════════════════════════════════════

def main():
    t0 = _time.time()
    print("🌱 Codebase Evolution Agent")
    print(f"{'─'*50}")
    print(f"   DEEPSEEK_API_KEY: {'✅' if DEEPSEEK_KEY else '❌'}")
    print(f"   GITHUB_TOKEN:     {'✅' if GITHUB_TOKEN else '❌'}")
    print(f"   SMTP_PASSWORD:    {'✅' if SMTP_PASSWORD else '⚠ no email'}\n")

    instructions = textwrap.dedent("""\
        Read the current state of the project. Understand its purpose.
        Then make ONE small improvement that moves it towards its true
        intention — connection, community, animal sanctuaries.

        Start by reading README.md, app/page.tsx, package.json, and
        some of the components. Then decide what to do.

        If you make a change, create a PR and send a report email.
        If you have ideas but no clear change to make, send a report
        with your thoughts and questions.
    """)

    print("🤖 Agent thinking...\n")
    result = agent.run_sync(instructions)
    print()
    print(result.output)
    elapsed = _time.time() - t0
    print(f"\n{'─'*50}")
    print(f"✨ Done in {elapsed:.1f}s")


if __name__ == "__main__":
    main()
