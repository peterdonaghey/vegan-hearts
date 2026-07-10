#!/usr/bin/env python3
"""
Vegan Hearts Dreamer Agent — researches, reflects, and sends ideas.

No code changes. No PRs. Just thinking about how to build a platform
that helps people find their vegan heart and connect with each other,
with sanctuaries, and with a kinder world.
"""

from __future__ import annotations

import base64
import json
import markdown
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
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

if not DEEPSEEK_KEY:
    print("❌ Need DEEPSEEK_API_KEY")
    sys.exit(1)

_http: httpx.Client | None = None
def http() -> httpx.Client:
    global _http
    if _http is None:
        _http = httpx.Client(timeout=20.0, follow_redirects=True)
    return _http


# ══════════════════════════════════════════════════════════════════════
#  Tools
# ══════════════════════════════════════════════════════════════════════

def read_mission() -> str:
    """Read the project's README and core files to understand the mission."""
    readme = (REPO_ROOT / "README.md").read_text()
    package = (REPO_ROOT / "package.json").read_text()
    landing = (REPO_ROOT / "app" / "page.tsx").read_text()[:3000]
    feed = (REPO_ROOT / "app" / "components" / "GoodNews.tsx").read_text()[:2000]
    return textwrap.dedent(f"""\
    ## README
    {readme[:2000]}

    ## package.json
    {package[:800]}

    ## Homepage (first 3k)
    {landing}

    ## GoodNews component (first 2k)
    {feed}
    """)


def browse_web(query: str) -> str:
    """Search the web for inspiration, sanctuary databases,
    volunteer platforms, community-building tools, or anything
    that could help connect people with compassion.
    """
    try:
        resp = http().get(
            "https://api.search.brave.com/res/v1/web/search",
            headers={"Accept": "application/json", "X-Subscription-Token": os.getenv("BRAVE_API_KEY", "")},
            params={"q": query, "count": 8},
        )
        resp.raise_for_status()
        results = resp.json().get("web", {}).get("results", [])
        return json.dumps([{"title": r["title"], "url": r["url"], "snippet": r.get("description", "")} for r in results], indent=2)
    except Exception as e:
        return f"Search failed: {e}"


def fetch_page(url: str) -> str:
    """Read a web page to research sanctuaries, platforms, or ideas."""
    try:
        resp = http().get(url)
        if resp.status_code != 200:
            return f"ERROR: HTTP {resp.status_code}"
        return resp.text[:6000]
    except Exception as e:
        return f"ERROR: {e}"


def check_replies() -> str:
    """Check the S3 inbox for replies from the project owner.

    Returns any unread replies found since the last check.
    Call this before thinking to see if there's feedback.
    """
    try:
        result = subprocess.run(
            ["aws", "s3", "ls", "s3://vegan-hearts-dreamer-mail/"],
            capture_output=True, text=True, timeout=15,
        )
        if not result.stdout.strip():
            return "No replies found."
        lines = result.stdout.strip().split("\n")
        # Get the most recent email
        latest = lines[-1].strip().split()[-1] if lines else ""
        if not latest:
            return "No replies found."
        result = subprocess.run(
            ["aws", "s3", "cp", f"s3://vegan-hearts-dreamer-mail/{latest}", "-"],
            capture_output=True, text=True, timeout=15,
        )
        if result.stdout:
            # Extract reply content (after the original message marker)
            body = result.stdout[:5000]
            # Mark as read by deleting or moving
            return f"Reply found:\n\n{body}"
        return "No replies found."
    except Exception as e:
        return f"Could not check replies: {e}"
    """Send an email to the project owner.

    Use this to share your ideas, questions, research findings,
    inspirations, or anything the project should consider.
    This is how you communicate — not through code changes.
    """
    if not SMTP_PASSWORD:
        return "⚠️  No SMTP_PASSWORD — email not sent (printed below)"
    try:
        msg = EmailMessage()
        msg["Subject"] = f"💚 {subject}"
        msg["From"] = "Vegan Hearts Dreamer <dreamer@veganhearts.org>"
        msg["Reply-To"] = "dreamer@veganhearts.org"
        msg["To"] = "donagheypeter@googlemail.com"
        
        # Plain text fallback
        msg.set_content(body)
        # HTML version with rendered Markdown
        html = markdown.markdown(body, extensions=["extra"])
        html_doc = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 600px; padding: 20px;">
{html}
</body>
</html>"""
        msg.add_alternative(html_doc, subtype="html")
        
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as s:
            s.login("donagheypeter@gmail.com", SMTP_PASSWORD)
            s.send_message(msg)
        return f"✅ Email sent: {subject}"
    except Exception as e:
        return f"Email failed: {e}"


def recent_news_prs() -> str:
    """Check what news articles were recently added."""
    try:
        data = httpx.get(
            f"https://api.github.com/repos/peterdonaghey/vegan-hearts/pulls?state=all&sort=created&direction=desc&per_page=10",
            headers={"Authorization": f"Bearer {GITHUB_TOKEN}"},
            timeout=10,
        ).json()
        lines = []
        for pr in data:
            title = pr.get("title", "")
            if title.startswith("Good News:"):
                created = pr["created_at"][:10]
                state = pr["state"]
                lines.append(f"  [{state}] {created} — {title[:80]}")
        return "\n".join(lines[:8]) or "No recent news PRs"
    except Exception as e:
        return f"Error: {e}"


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
        You are the **Vegan Hearts Dreamer**.

        Your purpose is not to write code. Your purpose is to think,
        to wonder, to research, and to send ideas.

        ## The truth this project is built on

        Everyone has a vegan heart deep down. A heart of compassion,
        kindness, and love. People forget it sometimes. They get busy,
        they get distracted, they get stuck in systems that feel
        impossible to change. But the heart is still there.

        Vegan Hearts exists to remind people. To help them find each
        other. To show them sanctuaries full of rescued animals who
        prove every day that compassion is real. To make visible all
        the people who are already choosing kindness.

        ## What the world needs

        There are animal sanctuaries everywhere, full of rescued cows,
        pigs, chickens, goats, turkeys — each one a story of someone
        who chose to help. And almost every sanctuary needs more help.
        More volunteers, more donations, more visitors, more people
        who know they exist.

        There are vegans everywhere who feel alone. Who wish they knew
        other people who think like them. Who want to help but don't
        know where to start.

        There isn't a platform that brings these together. Not one
        that's open, free, warm, and simple.

        ## Your job each week

        1. Check for replies from the project owner by calling
           check_replies(). If there's feedback, read it carefully —
           they're telling you what resonates and what doesn't.
           Let their words guide your thinking.
        2. Read the project to understand where it is right now.
        3. Research ONE topic deeply — sanctuaries that need
           volunteers, platforms that connect people, small features
           that could make a big difference, stories of connection.
        3. Think about what Vegan Hearts could offer. What would
           feel warm? What would feel simple? What would make someone
           open the page and feel less alone?
        4. Send a report email with your thoughts. Not a spec, not
           a PR — just ideas, questions, inspirations.

        ## What to research

        Rotate through these topics week by week:
        - Animal sanctuaries: where are they, what do they need,
          how can a simple website help them get visibility?
        - Community connection: how do vegans find each other today?
          What's missing? What would feel safe and warm?
        - Volunteer matching: what do sanctuaries actually need day
          to day? Could a simple board help?
        - Stories of compassion: what recent rescues, sanctuary
          stories, or acts of kindness could be shared?
        - Open-source tools: what already exists that we could use
          or learn from?
        - The feeling of the site: is it warm? Does it feel like
          a hug? What would make it feel more alive?

        ## Always remember

        You're not building a startup. You're not chasing growth.
        You're building a small, beautiful thing that helps people
        feel connected to their own compassion. That's it. That's
        enough.

        Send your report. Make it thoughtful, warm, and honest.
        If you're not sure what to say, say that. Just stay curious.
    """),
    tools=[
        read_mission,
        browse_web,
        fetch_page,
        check_replies,
        send_report,
        recent_news_prs,
    ],
)


# ══════════════════════════════════════════════════════════════════════
#  Main
# ══════════════════════════════════════════════════════════════════════

def main():
    t0 = _time.time()
    print("💚 Vegan Hearts Dreamer")
    print(f"{'─'*50}")
    print(f"   DEEPSEEK_API_KEY: {'✅' if DEEPSEEK_KEY else '❌'}")
    print(f"   SMTP_PASSWORD:    {'✅' if SMTP_PASSWORD else '⚠ no email'}\n")

    instructions = textwrap.dedent("""\
        Read the current state of the project. Look at what news
        articles have been added recently. Then research something
        that could help Vegan Hearts move towards its true purpose
        — connection, sanctuary visibility, community warmth.

        Then send a report with your thoughts. Be honest. Be warm.
        Don't suggest code changes unless they're truly tiny and
        obviously right. Instead, wonder about what the platform
        could become.
    """)

    print("💭 Dreaming...\n")
    result = agent.run_sync(instructions)
    print()
    print(result.output)
    elapsed = _time.time() - t0
    print(f"\n{'─'*50}")
    print(f"✨ Done in {elapsed:.1f}s")


if __name__ == "__main__":
    main()
