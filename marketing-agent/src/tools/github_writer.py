"""Write the daily report and screenshots to the GitHub repo via the Contents API."""
from __future__ import annotations

import base64
import json
import urllib.error
import urllib.request
from pathlib import Path

from config import Config


def write_report_to_github(config: Config, date: str, content: str) -> None:
    _put_file(config, f"marketing/reports/{date}.md", content.encode())

    # Upload any screenshots taken today
    screenshot_dir = Path("marketing/screenshots") / date
    if screenshot_dir.exists():
        for img in sorted(screenshot_dir.glob("*.png")):
            _put_file(config, f"marketing/screenshots/{date}/{img.name}", img.read_bytes())
            print(f"  Screenshot uploaded: {img.name}")


def _put_file(config: Config, path: str, data: bytes) -> None:
    url = f"https://api.github.com/repos/{config.github_repo}/contents/{path}"
    headers = {
        "Authorization": f"Bearer {config.github_token}",
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    sha = _get_sha(url, headers)
    body: dict = {
        "message": f"chore: playwright marketing report {path.split('/')[-1]}",
        "content": base64.b64encode(data).decode(),
    }
    if sha:
        body["sha"] = sha

    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=headers, method="PUT")
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read())
        print(f"Uploaded: {result['content']['html_url']}")


def _get_sha(url: str, headers: dict) -> str | None:
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read()).get("sha")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        raise
