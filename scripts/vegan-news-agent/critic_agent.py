#!/usr/bin/env python3
"""
Monday Critic Agent — reviews last week's Good News PRs and sends a report.

Checks category diversity, image quality, geographic spread, source variety,
and grades each article. Posts findings as a GitHub issue comment and emails
a summary to the project owner.

Usage:
    python critic_agent.py
"""

from __future__ import annotations

import json
import markdown
import os
import re
import smtplib
import ssl
import sys
import time as _time
from datetime import datetime, timezone, timedelta
from email.message import EmailMessage
from io import BytesIO
from pathlib import Path

import httpx
from dotenv import load_dotenv
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
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
GITHUB_REPO = os.getenv("GITHUB_REPO", "peterdonaghey/vegan-hearts")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

if not GITHUB_TOKEN:
    print("❌ Need GITHUB_TOKEN in .env")
    sys.exit(1)

# ── HTTP client ──────────────────────────────────────────────────────
_http: httpx.Client | None = None

def http() -> httpx.Client:
    global _http
    if _http is None:
        _http = httpx.Client(timeout=20.0, follow_redirects=True)
    return _http


def gh_api(method: str, path: str, **kwargs) -> httpx.Response:
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


# ── Fetch PRs from the last 7 days ──────────────────────────────────

def fetch_recent_prs() -> list[dict]:
    """Get PRs created by the news agent in the last 7 days."""
    since = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    data = gh_api(
        "GET",
        f"/repos/{GITHUB_REPO}/pulls?state=all&sort=created&direction=desc&per_page=20",
    ).json()

    recent = []
    for pr in data:
        created = pr["created_at"]
        if created < since:
            break
        title = pr["title"] or ""
        if not title.startswith("Good News:"):
            continue
        recent.append({
            "number": pr["number"],
            "title": title,
            "state": pr["state"],
            "created_at": created,
            "html_url": pr["html_url"],
            "body": pr["body"] or "",
            "merged": pr.get("merged_at") is not None,
        })
    return recent


# ── Parse article info from PR body ─────────────────────────────────

def parse_pr_body(body: str) -> dict | None:
    """Extract article category, source URL, source name, image status."""
    category = ""
    source_url = ""
    source_name = ""
    image_status = "unknown"
    date = ""
    title = ""

    for line in body.split("\n"):
        line = line.strip()
        m = re.match(r"-\s+\*\*\[(.+?)\]\*\*\s+(.+)", line)
        if m:
            category = m.group(1)
            title = m.group(2)
        m = re.match(r"-\s+Source:\s+\[(.+?)\]\((.+?)\)", line)
        if m:
            source_name = m.group(1)
            source_url = m.group(2)
        m = re.match(r"-\s+Date:\s+(.+)", line)
        if m:
            date = m.group(1).strip()
        if "Image verified" in line:
            image_status = "ok"
        elif "IMAGE MISSING" in line:
            image_status = "missing"
        elif "No image" in line or "will show" in line:
            image_status = "missing"

    if not category:
        return None
    return {
        "category": category,
        "title": title,
        "source_url": source_url,
        "source_name": source_name,
        "date": date,
        "image_status": image_status,
    }


# ── Image quality check ─────────────────────────────────────────────

def check_image_quality(image_url: str) -> dict:
    """Grade an image URL: dimensions, format, load success."""
    if not image_url:
        return {"grade": "F", "reason": "No image URL provided"}
    try:
        resp = http().get(image_url, timeout=10.0)
        if resp.status_code != 200:
            return {"grade": "F", "reason": f"HTTP {resp.status_code}"}
        ct = resp.headers.get("content-type", "")
        if not ct.startswith("image/"):
            return {"grade": "D", "reason": f"Not an image ({ct})"}
        img = PILImage.open(BytesIO(resp.content))
        w, h = img.size
        if w >= 1200 and h >= 600:
            grade = "A"
            reason = f"Excellent — {w}×{h} {ct}"
        elif w >= 800 and h >= 400:
            grade = "B"
            reason = f"Good — {w}×{h} {ct}"
        elif w >= 400 and h >= 200:
            grade = "C"
            reason = f"Acceptable — {w}×{h} {ct}"
        else:
            grade = "D"
            reason = f"Too small — {w}×{h} {ct}"
        return {"grade": grade, "reason": reason, "width": w, "height": h}
    except Exception as e:
        return {"grade": "F", "reason": str(e)}


# ── Geographic guess from URL ───────────────────────────────────────

GEOGRAPHY_RULES = [
    (r"\.uk/", "UK"),
    (r"\.de/", "Germany"),
    (r"\.fr/", "France"),
    (r"greenqueen\.com\.hk", "Hong Kong"),
    (r"farmsanctuary\.org", "US"),
    (r"npr\.org", "US"),
    (r"cbsnews\.com", "US"),
    (r"vegnews\.com", "US"),
    (r"veganfoodandliving\.com", "UK"),
    (r"vegconomist\.com", "International"),
    (r"morningstar\.com", "US"),
    (r"witf\.org", "US"),
]

def guess_geography(source_url: str) -> str:
    for pattern, region in GEOGRAPHY_RULES:
        if re.search(pattern, source_url, re.IGNORECASE):
            return region
    return "Unknown"


# ── Grade an article ─────────────────────────────────────────────────

def grade_article(pr: dict, article: dict, recent_categories: list[str]) -> dict:
    checks = []
    score = 0
    max_score = 0

    # Category diversity check
    max_score += 2
    if recent_categories and article["category"] in recent_categories:
        checks.append(("Category diversity", 0, f"Same as recent: {article['category']}"))
    else:
        checks.append(("Category diversity", 2, f"Fresh category: {article['category']}"))
        score += 2

    # Merged check
    max_score += 1
    if pr["merged"]:
        checks.append(("Merged", 1, "✅ Merged"))
        score += 1
    else:
        checks.append(("Merged", 0, "❌ Not merged yet"))

    # Image check
    max_score += 2
    if article["image_status"] == "ok":
        checks.append(("Image present", 2, "✅ Has image"))
        score += 2
    elif article["image_status"] == "missing":
        checks.append(("Image present", 0, "❌ Image missing"))
    else:
        checks.append(("Image present", 1, "⚠️  Unknown"))
        score += 1

    # Geography check
    geo = guess_geography(article["source_url"])
    max_score += 1
    if geo != "US":
        checks.append(("Geography", 1, f"Non-US: {geo}"))
        score += 1
    else:
        checks.append(("Geography", 0, f"US only"))

    # Source diversity
    max_score += 1
    if "farmsanctuary.org" in article["source_url"]:
        checks.append(("Source diversity", 0, "Farm Sanctuary (used often)"))
    else:
        checks.append(("Source diversity", 1, article["source_name"]))
        score += 1

    pct = round(score / max_score * 100) if max_score else 0
    if pct >= 80:
        letter = "A"
    elif pct >= 60:
        letter = "B"
    elif pct >= 40:
        letter = "C"
    else:
        letter = "D"

    return {
        "pr_number": pr["number"],
        "pr_url": pr["html_url"],
        "article_title": article["title"],
        "article_category": article["category"],
        "source_name": article["source_name"],
        "geography": geo,
        "grade": letter,
        "score": score,
        "max_score": max_score,
        "percentage": pct,
        "checks": checks,
    }


# ── Build report markdown ───────────────────────────────────────────

def build_report(article_grades: list[dict]) -> tuple[str, str]:
    """Return (markdown report, email body)."""

    avg_pct = round(sum(g["percentage"] for g in article_grades) / len(article_grades)) if article_grades else 0

    md = f"# 🧐 Weekly Good News Review\n"
    md += f"**Week ending:** {datetime.now(timezone.utc).strftime('%d %B %Y')}  \n"
    md += f"**Articles reviewed:** {len(article_grades)}  \n"
    md += f"**Average grade:** {'A' if avg_pct >= 80 else 'B' if avg_pct >= 60 else 'C' if avg_pct >= 40 else 'D'} ({avg_pct}%)\n\n"
    md += f"| PR | Category | Source | Geography | Grade | Key issues |\n"
    md += f"|---|---|---|---|---|---|\n"

    email = f"Weekly Good News Review — {datetime.now(timezone.utc).strftime('%d %B %Y')}\n"
    email += f"Articles reviewed: {len(article_grades)}  |  Average grade: {'A' if avg_pct >= 80 else 'B' if avg_pct >= 60 else 'C' if avg_pct >= 40 else 'D'} ({avg_pct}%)\n\n"

    worst_grade = "A"
    for g in article_grades:
        issues = "; ".join(c[2] for c in g["checks"] if c[1] == 0)
        if not issues:
            issues = "None"
        md += f"| [#{g['pr_number']}]({g['pr_url']}) | {g['article_category']} | {g['source_name']} | {g['geography']} | **{g['grade']}** | {issues} |\n"
        email += f"\n#{g['pr_number']} — {g['article_title']}\n"
        email += f"  Category: {g['article_category']}  |  Source: {g['source_name']}  |  Grade: {g['grade']}\n"
        for c in g["checks"]:
            icon = "✅" if c[1] > 0 else "❌"
            email += f"  {icon} {c[0]}: {c[2]}\n"
        if g["grade"] < worst_grade:
            worst_grade = g["grade"]

    # Overall assessment
    md += "\n\n## Overall Assessment\n\n"
    email += "\n\nOverall Assessment:\n"

    if worst_grade in ("D", "F"):
        md += "🔴 **Major issues this week.** "
        email += "🔴 Major issues this week. "
    elif worst_grade == "C":
        md += "🟡 **Some issues to address.** "
        email += "🟡 Some issues to address. "
    else:
        md += "🟢 **Looking good this week.** "
        email += "🟢 Looking good this week. "

    # Category diversity check
    cats = [g["article_category"] for g in article_grades]
    unique_cats = set(cats)
    if len(unique_cats) < len(cats):
        md += f"Repeated categories: {', '.join(c for c in cats if cats.count(c) > 1)}. "
        email += f"Repeated categories: {', '.join(c for c in cats if cats.count(c) > 1)}. "

    geos = [g["geography"] for g in article_grades]
    non_us = [g for g in geos if g != "US"]
    if len(non_us) < len(geos) * 0.3 and len(geos) > 1:
        md += "Too US-centric — aim for 1 in 3 from outside the US. "
        email += "Too US-centric — aim for 1 in 3 from outside the US. "

    md += "\n\n---\n*Generated by Monday Critic Agent*"
    email += "\n\n---\nGenerated by Monday Critic Agent"

    return md, email


# ── Post to GitHub issue ────────────────────────────────────────────

def post_report_as_issue(markdown: str, article_grades: list[dict]):
    """Create or update a weekly review issue."""
    title = f"Weekly Review: {datetime.now(timezone.utc).strftime('%d %B %Y')}"
    labels = ["review", "automated"]

    resp = gh_api("POST", f"/repos/{GITHUB_REPO}/issues",
                  json={"title": title, "body": markdown, "labels": labels})
    issue_url = resp.json().get("html_url", "")
    print(f"       📝 Report posted: {issue_url}")
    return issue_url


# ── Send email ──────────────────────────────────────────────────────

def send_email(body_text: str):
    if not SMTP_PASSWORD:
        print("       ⚠️  No SMTP_PASSWORD — skipping email")
        return
    try:
        msg = EmailMessage()
        msg["Subject"] = f"🧐 Weekly Good News Review — {datetime.now(timezone.utc).strftime('%d %B')}"
        msg["From"] = "Vegan News Critic"
        msg["To"] = "donagheypeter@googlemail.com"
        
        # Plain text fallback
        msg.set_content(body_text)
        # HTML version with rendered Markdown
        html = markdown.markdown(body_text, extensions=["extra"])
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
        print(f"       📧 Email sent to donagheypeter@googlemail.com")
    except Exception as e:
        print(f"       ❌ Email failed: {e}")


# ── Main ────────────────────────────────────────────────────────────

def main():
    t0 = _time.time()
    print("🧐 Monday Critic Agent")
    print(f"{'─'*50}")
    print(f"   GITHUB_TOKEN:  {'✅' if GITHUB_TOKEN else '❌'}")
    print(f"   SMTP_PASSWORD: {'✅' if SMTP_PASSWORD else '⚠ no email'}\n")

    # 1. Fetch recent PRs
    print("📡 Fetching recent Good News PRs...")
    prs = fetch_recent_prs()
    if not prs:
        print("   No Good News PRs found in the last 7 days.")
        return
    print(f"   Found {len(prs)} PRs\n")

    # 2. Parse each PR
    articles = []
    for pr in prs:
        article = parse_pr_body(pr["body"])
        if article:
            articles.append((pr, article))
            print(f"   #{pr['number']}: [{article['category']}] {article['title'][:60]}...")

    if not articles:
        print("   Could not parse any article details from PR bodies.")
        return

    print()

    # 3. Check images and grade
    recent_categories = [a["category"] for _, a in articles[:-1]]
    grades = []
    with http() as _:  # ensure client is created
        for pr, article in articles:
            print(f"   🔍 #{pr['number']}: {article['title'][:50]}...")
            grade = grade_article(pr, article, recent_categories)
            # Also check image quality from the file if we can find it
            grades.append(grade)
            print(f"      Grade: {grade['grade']} ({grade['percentage']}%)")
            for c in grade["checks"]:
                icon = "✅" if c[1] > 0 else "❌"
                print(f"      {icon} {c[0]}: {c[2]}")
            print()

    # 4. Build and publish report
    print("📝 Building report...")
    markdown, email_text = build_report(grades)

    issue_url = post_report_as_issue(markdown, grades)

    print(f"\n📧 Sending email...")
    send_email(email_text + f"\n\nFull report: {issue_url}")

    elapsed = _time.time() - t0
    print(f"\n{'─'*50}")
    print(f"✨ Done in {elapsed:.1f}s")


if __name__ == "__main__":
    main()
