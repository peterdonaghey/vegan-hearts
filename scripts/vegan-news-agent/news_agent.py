#!/usr/bin/env python3
"""
Vegan News Agent — one article at a time.

The agent searches the web, validates links & images, reads the current feed,
generates the updated TypeScript, writes it, and opens a PR — all through
tools, just like a human assistant would.

Usage:
    ./news_agent.py                          # normal run
    ./news_agent.py --note "extra context"   # add a note for the agent
"""

from __future__ import annotations

import base64
import json
import os
import re
import sys
import textwrap
import time as _time
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path

import httpx
from dotenv import load_dotenv
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.openai import OpenAIProvider
from PIL import Image as PILImage

# ── Paths ────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).resolve().parents[2]
GOODNEWS_PATH = REPO_ROOT / "app" / "components" / "GoodNews.tsx"

# ── Load env ─────────────────────────────────────────────────────────
_script_env = Path(__file__).resolve().parent / ".env"
if _script_env.exists():
    load_dotenv(_script_env)
_repo_env = REPO_ROOT / ".env.local"
if _repo_env.exists():
    load_dotenv(_repo_env, override=False)

# ── Secrets ──────────────────────────────────────────────────────────
BRAVE_KEY = os.getenv("BRAVE_API_KEY", "")
DEEPSEEK_KEY = os.getenv("DEEPSEEK_API_KEY", "")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
GITHUB_REPO = os.getenv("GITHUB_REPO", "peterdonaghey/vegan-hearts")
GITHUB_BASE = os.getenv("GITHUB_BASE_BRANCH", "main")

if not DEEPSEEK_KEY or not BRAVE_KEY:
    print("❌ Need BRAVE_API_KEY and DEEPSEEK_API_KEY in .env or .env.local")
    sys.exit(1)

# ── HTTP client (shared, lazy) ──────────────────────────────────────
_http: httpx.Client | None = None

def http() -> httpx.Client:
    global _http
    if _http is None:
        _http = httpx.Client(timeout=20.0, follow_redirects=True)
    return _http


# ══════════════════════════════════════════════════════════════════════
#  Tools  (registered with the agent below)
# ══════════════════════════════════════════════════════════════════════

def _brave_search(query: str, count: int = 10) -> list[dict]:
    """Low-level Brave Web Search call."""
    resp = http().get(
        "https://api.search.brave.com/res/v1/web/search",
        headers={"Accept": "application/json", "X-Subscription-Token": BRAVE_KEY},
        params={"q": query, "count": count, "freshness": "pm"},
    )
    resp.raise_for_status()
    return resp.json().get("web", {}).get("results", [])


def _gh_api(method: str, path: str, **kwargs) -> httpx.Response:
    """Low-level GitHub API call."""
    resp = http().request(
        method,
        f"https://api.github.com{path}",
        headers={
            "Authorization": f"Bearer {GITHUB_TOKEN}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
        **kwargs,
    )
    if resp.status_code >= 400:
        raise RuntimeError(f"GitHub API {method} {path}: {resp.status_code} {resp.text[:200]}")
    return resp


def _slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:50]


# ── Tool: web search ─────────────────────────────────────────────────

def search_vegan_news() -> str:
    """Search the web for uplifting, positive vegan / plant-based news from the past month.

    Returns a JSON list of results with title, url, and description.
    The agent should call this first to find candidate articles.
    """
    print(f"       🔍 Searching Brave for compassionate vegan news...", flush=True)
    results = _brave_search("farm animal sanctuary rescue story compassion 2026 heartwarming")
    print(f"       → {len(results)} results found", flush=True)
    return json.dumps(
        [{"title": r["title"], "url": r["url"], "description": r.get("description", "")}
         for r in results],
        indent=2,
    )


# ── Tool: fetch a URL ───────────────────────────────────────────────

def fetch_page(url: str) -> str:
    """Fetch a URL and return its content as text.

    Use this to:
    - Verify a news article link works (returns 200)
    - Read the article to write a good summary
    - Find image URLs on the page
    """
    print(f"       📄 Fetching {url[:80]}...", end=" ", flush=True)
    try:
        resp = http().get(url)
        if resp.status_code != 200:
            print(f"HTTP {resp.status_code} ❌", flush=True)
            return f"ERROR: HTTP {resp.status_code}"
        print(f"200 OK ✅", flush=True)
        return resp.text[:8000]
    except Exception as e:
        print(f"{e} ❌", flush=True)
        return f"ERROR: {e}"


# ── Tool: validate an image ─────────────────────────────────────────

def check_image(url: str) -> str:
    """Check if an image URL is valid, what type it is, and its dimensions.

    Returns a report like: 'OK — 1200×630 image/jpeg' or 'ERROR: ...'
    """
    print(f"       🖼️  Checking image {url[:60]}...", end=" ", flush=True)
    if not url:
        print("skipped (no URL)", flush=True)
        return "SKIPPED: no URL"
    try:
        resp = http().get(url)
        if resp.status_code != 200:
            print(f"HTTP {resp.status_code} ❌", flush=True)
            return f"ERROR: HTTP {resp.status_code}"
        ct = resp.headers.get("content-type", "")
        if not ct.startswith("image/"):
            print(f"not an image ({ct}) ❌", flush=True)
            return f"ERROR: not an image ({ct})"
        img = PILImage.open(BytesIO(resp.content))
        w, h = img.size
        if w < 200 or h < 120:
            print(f"{w}×{h} {ct} (small) ⚠", flush=True)
            return f"WARN: very small ({w}×{h})"
        print(f"{w}×{h} {ct} ✅", flush=True)
        return f"OK — {w}×{h} {ct}"
    except Exception as e:
        print(f"{e} ❌", flush=True)
        return f"ERROR: {e}"


# ── Tool: read current feed ─────────────────────────────────────────

def read_feed() -> str:
    """Read the current GoodNews.tsx file and return the existing defaultGoodNews array.

    Use this to check existing article IDs so you don't add duplicates.
    """
    print(f"       📖 Reading current feed...", end=" ", flush=True)
    content = GOODNEWS_PATH.read_text()
    ids = re.findall(r'id:\s*["\']([^"\']+)["\']', content)
    print(f"{len(ids)} existing articles", flush=True)
    return json.dumps({"existing_ids": ids, "count": len(ids)}, indent=2)


# ── Tool: write updated feed & create PR ────────────────────────────

def publish_article(
    article_id: str,
    title: str,
    summary: str,
    source_url: str,
    source_name: str,
    date: str,
    category: str,
    image_url: str = "",
) -> str:
    """Add ONE new article to the GoodNews feed and open a GitHub PR.

    Call this ONLY after you have validated the article link returns 200
    and the image URL (if any) is OK.

    !!! IMPORTANT !!!
    This tool handles ALL file manipulation internally.  Do NOT generate
    TypeScript code yourself.  Just pass the validated fields and this
    tool will:
      - Read the current file
      - Insert the new article at the top (newest first)
      - Write the file
      - Create a branch + commit + PR on GitHub

    Parameters:
        article_id: kebab-case slug, unique ID for this article
        title: article headline
        summary: 1-2 sentence summary
        source_url: URL to the full article
        source_name: publication name (e.g. "VegNews")
        date: month + year, e.g. "June 2026"
        category: one of Policy Win, Price Win, Market Growth, Innovation,
                 Sanctuary, Health Policy, Food Service, Media, Community, Science
        image_url: optional validated image URL
    """
    # Build the TS item block programmatically (safe string building)
    def _ts_val(s: str) -> str:
        return '"' + s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n") + '"'

    lines = ["  {"]
    for key, val in [
        ("id", article_id),
        ("title", title),
        ("summary", summary),
        ("sourceUrl", source_url),
        ("sourceName", source_name),
    ]:
        lines.append(f"    {key}: {_ts_val(val)},")
    if image_url:
        lines.append(f"    imageUrl: {_ts_val(image_url)},")
    lines.append(f"    date: {_ts_val(date)},")
    lines.append(f"    category: {_ts_val(category)},")
    lines.append("  },")
    new_block = "\n".join(lines)

    # Read current file, find insertion point after opening bracket
    old = GOODNEWS_PATH.read_text()
    marker = "defaultGoodNews: GoodNewsItem[] = ["
    idx = old.find(marker)
    if idx == -1:
        return "ERROR: could not find the GoodNews array declaration"
    bracket = idx + len(marker) - 1  # position of '['

    # Insert after the '[' with a newline and date comment
    date_comment = f"\n  // ── {date} ──\n"
    new_content = old[: bracket + 1] + date_comment + new_block + "\n" + old[bracket + 1 :]

    # Write locally
    GOODNEWS_PATH.write_text(new_content)
    print(f"       📝 Wrote update to {GOODNEWS_PATH}")

    # Create branch + PR
    if not GITHUB_TOKEN:
        return (
            f"✅ File updated locally (dry run — no GITHUB_TOKEN).\n"
            f"   Article: {title}\n"
            f"   File: {GOODNEWS_PATH}"
        )

    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    branch = f"vegan-news/{timestamp}"

    base = _gh_api("GET", f"/repos/{GITHUB_REPO}/git/ref/heads/{GITHUB_BASE}")
    base_sha = base.json()["object"]["sha"]
    _gh_api("POST", "/repos/" + GITHUB_REPO + "/git/refs",
            json={"ref": f"refs/heads/{branch}", "sha": base_sha})
    file_info = _gh_api("GET", f"/repos/{GITHUB_REPO}/contents/app/components/GoodNews.tsx",
                        params={"ref": GITHUB_BASE})
    file_sha = file_info.json()["sha"]
    _gh_api("PUT", f"/repos/{GITHUB_REPO}/contents/app/components/GoodNews.tsx",
            json={
                "message": f"feat: add good-news article — {title[:60]}",
                "content": base64.b64encode(new_content.encode()).decode(),
                "branch": branch,
                "sha": file_sha,
            })
    pr_body = (
        f"## New good-news article\n\n"
        f"- **[{category}] {title}**\n"
        f"- Source: [{source_name}]({source_url})\n"
        f"- Date: {date}\n\n"
        f"### Validation\n"
        f"- ✅ Source link verified (200 OK)\n"
        f"- {'✅ Image verified' if image_url else '❌ IMAGE MISSING — agent should not have published'}\n"
        f"- ✅ No duplicate with existing articles\n\n"
        f"_Automated by Vegan News Agent_"
    )
    pr = _gh_api("POST", f"/repos/{GITHUB_REPO}/pulls",
                 json={"title": f"Good News: {title[:72]}", "body": pr_body,
                       "head": branch, "base": GITHUB_BASE})
    pr_url = pr.json().get("html_url", f"https://github.com/{GITHUB_REPO}/pull/new/{branch}")
    return f"✅ PR created: {pr_url}"


# ══════════════════════════════════════════════════════════════════════
#  Agent setup
# ══════════════════════════════════════════════════════════════════════

_model = OpenAIChatModel(
    "deepseek-v4-flash",
    provider=OpenAIProvider(base_url="https://api.deepseek.com/v1", api_key=DEEPSEEK_KEY),
)

agent = Agent(
    _model,
    system_prompt=textwrap.dedent("""\
        You are the Vegan News Curator for the VeganHearts website.

        Your job: find ONE uplifting positive vegan news article and add it
        to the site's GoodNews feed.  Work step by step:

        1. Call search_vegan_news() to find candidate articles.
        2. Pick the best one that is NOT already in the feed (check read_feed()).
        3. Call fetch_page() on the article URL to verify it loads and to
           read the full article so you can write a good 1-2 sentence summary.
        4. Find an image on the page (look for <img> tags or og:image meta).
           Call check_image() on the URL to verify it loads and is a real image.
        5. Call read_feed() again to check existing article IDs.
        6. Call publish_article() with all the details.

        RULES (most important):
        - Only add ONE article per run.
        - The article must be recent (past month or so).
        - ONLY pick stories about: animal rescues and sanctuary stories,
          community gardens and food-sharing initiatives, educators teaching
          compassion, grassroots movements, people helping animals and each other,
          acts of kindness, vegan community building,
          or other genuinely heartwarming human-interest stories.
        - DO NOT pick stories about: market data, product launches, corporate
          milestones, investment figures, supermarket sales, price comparisons,
          industry forecasts, or any "market capitalist" framed news.
          We are painting a picture of a new world, not tracking an industry.
        - Avoid celebrity gossip, opinion pieces, or fluff.
        - The summary should be 1-2 sentences, warm and informative.
        - Category must be one of: Sanctuary, Community, Food Service, Media,
          Health Policy, Innovation.  (Avoid Market Growth, Price Win unless
          the story is truly about people, not markets.)
        - The date should be the current month + year, e.g. "June 2026".
        - The id should be a short kebab-case slug from the title.
        - DO NOT add an article if its ID already exists in the feed.
        - DO NOT add an article if the link doesn't return 200.
        - DO NOT add an article if the image is broken.
        - **MANDATORY: Every article MUST have a working image.** Never use
          the fallback. If the article page doesn't have a usable image, find
          one by searching the source site or choose a different article.
          No image = no publish.

        You have all the tools you need.  Go ahead.
    """),
    tools=[
        search_vegan_news,
        fetch_page,
        check_image,
        read_feed,
        publish_article,
    ],
)


# ══════════════════════════════════════════════════════════════════════
#  Main
# ══════════════════════════════════════════════════════════════════════

def main() -> None:
    t0 = _time.time()
    print("🌱 Vegan News Agent")
    print(f"{'─'*50}")
    print(f"   BRAVE_API_KEY:     {'✅' if BRAVE_KEY else '❌'}")
    print(f"   DEEPSEEK_API_KEY:  {'✅' if DEEPSEEK_KEY else '❌'}")
    print(f"   GITHUB_TOKEN:      {'✅' if GITHUB_TOKEN else '⚠ dry-run'}")
    print(f"   Model:             deepseek-v4-flash\n")

    note = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1].startswith("--note=") else ""
    note_text = note.split("=", 1)[1] if note else ""

    instructions = "Find one good vegan news article and add it to the feed."
    if note_text:
        instructions += f"\n\nAdditional note from user: {note_text}"

    print("🤖 Agent working...\n")
    result = agent.run_sync(instructions)
    print()
    print(result.output)
    print(f"\n{'─'*50}")
    print(f"✨ Done in {_time.time() - t0:.1f}s")


if __name__ == "__main__":
    main()
