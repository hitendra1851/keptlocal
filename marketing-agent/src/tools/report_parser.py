"""
Fetch and parse the most recent previous marketing report from GitHub
to calculate keyword ranking deltas.
"""
from __future__ import annotations

import base64
import json
import re
import urllib.error
import urllib.request


def get_previous_rankings(github_token: str, github_repo: str) -> dict[str, int | None]:
    """Return {keyword: position} from the most recent existing report, or {} if none."""
    files = _list_report_files(github_token, github_repo)
    if not files:
        return {}

    latest = sorted(files)[-1]
    content = _fetch_file_content(github_token, github_repo, f"marketing/reports/{latest}")
    if not content:
        return {}

    return _parse_rankings_table(content)


def _list_report_files(github_token: str, github_repo: str) -> list[str]:
    url = f"https://api.github.com/repos/{github_repo}/contents/marketing/reports"
    req = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Bearer {github_token}",
            "Accept": "application/vnd.github+json",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            items = json.loads(resp.read())
            return [item["name"] for item in items if item["name"].endswith(".md")]
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return []
        raise


def _fetch_file_content(github_token: str, github_repo: str, path: str) -> str | None:
    url = f"https://api.github.com/repos/{github_repo}/contents/{path}"
    req = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Bearer {github_token}",
            "Accept": "application/vnd.github+json",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read())
            return base64.b64decode(data["content"]).decode()
    except Exception:
        return None


def _parse_rankings_table(content: str) -> dict[str, int | None]:
    """Parse the | Keyword | Position | table from a report."""
    rankings: dict[str, int | None] = {}
    in_table = False

    for line in content.splitlines():
        if "| Keyword" in line and "Position" in line:
            in_table = True
            continue
        if in_table:
            if not line.startswith("|"):
                in_table = False
                continue
            # Skip separator row
            if re.match(r"^\|[-| ]+\|$", line.strip()):
                continue
            parts = [p.strip() for p in line.strip().strip("|").split("|")]
            if len(parts) >= 2:
                keyword = parts[0]
                pos_str = parts[1]
                if pos_str.isdigit():
                    rankings[keyword] = int(pos_str)
                else:
                    rankings[keyword] = None

    return rankings
