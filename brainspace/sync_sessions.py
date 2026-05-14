#!/usr/bin/env python3
"""sync_sessions.py — Import Zed chat sessions for this project into brainspace/.

Usage (from project root):
    python3 /path/to/brainspace/sync_sessions.py

Reads ~/Library/Application Support/Zed/threads/threads.db,
finds threads matching current project, writes to brainspace/sessions/
with tool results truncated inline (full copies saved to brainspace/results/).
Idempotent — re-run anytime.
"""

from __future__ import annotations

import json
import os
import re
import sqlite3
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

ZED_DB = Path.home() / "Library/Application Support/Zed/threads/threads.db"
MAX_RESULT_INLINE = 2000
PROJECT_ROOT = Path.cwd()
BRAIN = PROJECT_ROOT / "brainspace"
SESSIONS_DIR = BRAIN / "sessions"
RESULTS_DIR = BRAIN / "results"
INDEX_FILE = SESSIONS_DIR / ".index.json"


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def ensure_dirs() -> None:
    for d in [SESSIONS_DIR, RESULTS_DIR]:
        d.mkdir(parents=True, exist_ok=True)


def load_index() -> dict:
    if INDEX_FILE.exists():
        return json.loads(INDEX_FILE.read_text())
    return {}


def save_index(index: dict) -> None:
    INDEX_FILE.write_text(json.dumps(index, indent=2, default=str))


def slugify(text: str, max_len: int = 55) -> str:
    text = re.sub(r"[^a-z0-9\s-]", "", text.lower().strip())
    text = re.sub(r"[\s-]+", "-", text)
    return text[:max_len].rstrip("-") or "untitled"


def decompress(data: bytes) -> dict | None:
    import zstd
    try:
        return json.loads(zstd.decompress(data).decode("utf-8"))
    except Exception:
        pass
    try:
        with tempfile.NamedTemporaryFile(suffix=".zst", delete=False) as tmp:
            tmp.write(data)
            p = tmp.name
        r = subprocess.run(["unzstd", "--stdout", p], capture_output=True, timeout=15)
        os.unlink(p)
        if r.returncode == 0:
            return json.loads(r.stdout.decode("utf-8"))
    except Exception:
        pass
    return None


def get_project_threads() -> list[dict]:
    if not ZED_DB.exists():
        print(f"Zed DB not found at {ZED_DB}")
        return []
    conn = sqlite3.connect(str(ZED_DB))
    rows = conn.execute(
        "SELECT id, summary, updated_at, data, folder_paths, created_at FROM threads"
    ).fetchall()
    conn.close()

    project_path = str(PROJECT_ROOT)
    threads = []
    for row in rows:
        if project_path not in (row[4] or ""):
            continue
        data = decompress(row[3])
        if not data:
            continue
        threads.append({
            "id": row[0],
            "title": row[1] or data.get("title", ""),
            "created_at": row[5] or "",
            "updated_at": row[2] or "",
            "folder_paths": row[4],
            "data": data,
        })
    return threads


def extract_text(content_list: list) -> str:
    texts = []
    for item in content_list:
        if not isinstance(item, dict):
            continue
        if "Text" in item:
            texts.append(item["Text"])
        if "ToolUse" in item:
            t = item["ToolUse"]
            name = t.get("name", "?")
            inp = t.get("raw_input", "") or json.dumps(t.get("input", {}))
            if len(inp) > 200:
                inp = inp[:200] + "..."
            texts.append(f"[TOOL: {name}] {inp}")
        if "Image" in item:
            texts.append("[Image]")
    return "\n".join(texts).strip()


def format_thread(thread: dict) -> tuple[str, list[tuple[str, str]]]:
    data = thread["data"]
    msgs = data.get("messages", [])
    title = thread["title"] or slugify(thread["id"])[:40]
    created = thread["created_at"]
    ts = created.replace(":", "-").split(".")[0] if created else "unknown"

    lines = [f"# {title}", f"source: zed", f"created: {created}",
             f"updated: {thread['updated_at']}", f"session_id: {thread['id']}",
             f"project: {thread['folder_paths']}", ""]

    result_files = []

    for msg in msgs:
        if not isinstance(msg, dict):
            continue
        for role, value in msg.items():
            lines.append("")
            if role == "User":
                cl = value.get("content", [])
                if isinstance(cl, list):
                    lines.append(f"[USER]: {extract_text(cl)}")
            elif role == "Agent":
                cl = value.get("content", [])
                if isinstance(cl, list):
                    lines.append(f"[AGENT]: {extract_text(cl)}")
                tr = value.get("tool_results", {})
                if isinstance(tr, dict):
                    for tool_id, result in tr.items():
                        name = result.get("tool_name", "?")
                        is_error = result.get("is_error", False)
                        content = result.get("content", {})
                        if isinstance(content, dict):
                            rt = content.get("Text", "") or content.get("output", "")
                        elif isinstance(content, str):
                            rt = content
                        else:
                            rt = str(content)
                        result_files.append((f"{tool_id}.txt", rt))
                        err_mark = " [ERROR]" if is_error else ""
                        if len(rt) > MAX_RESULT_INLINE:
                            lines.append(f"  \u2190 [{name}{err_mark}] {len(rt)} chars (truncated)")
                            lines.append(f"     full: results/{tool_id}.txt")
                            lines.append(f"     {rt[:MAX_RESULT_INLINE]}")
                        else:
                            lines.append(f"  \u2190 [{name}{err_mark}]")
                            if rt.strip():
                                lines.append(f"     {rt[:MAX_RESULT_INLINE]}")

    lines.append("")
    transcript = "\n".join(lines)

    for fname, fcontent in result_files:
        (RESULTS_DIR / fname).write_text(fcontent)

    return transcript, result_files


def main():
    ensure_dirs()
    index = load_index()
    threads = get_project_threads()

    if not threads:
        print("No Zed threads found for this project.")
        return

    added = 0
    updated = 0
    results_count = 0

    for thread in threads:
        tid = thread["id"]
        existing = index.get(tid)
        if existing and existing.get("updated_at") == thread["updated_at"]:
            continue

        transcript, result_files = format_thread(thread)
        ts = thread["created_at"].replace(":", "-").split(".")[0] if thread["created_at"] else "unknown"
        fname = f"{ts}_{slugify(thread['title'])}.md"
        (SESSIONS_DIR / fname).write_text(transcript)

        if not existing:
            index[tid] = {"file": fname, "first_seen": now(), "updated_at": thread["updated_at"],
                          "result_count": len(result_files)}
            added += 1
        else:
            existing["updated_at"] = thread["updated_at"]
            existing["result_count"] = len(result_files)
            updated += 1
        results_count += len(result_files)

    save_index(index)
    print(f"brainspace: {added} new, {updated} updated, {results_count} tool results synced")
    if added or updated:
        print(f"  sessions: {SESSIONS_DIR}")
        print(f"  results:  {RESULTS_DIR}")


if __name__ == "__main__":
    main()
