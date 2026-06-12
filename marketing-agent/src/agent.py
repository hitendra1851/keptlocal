#!/usr/bin/env python3
"""
keptlocal.com daily Playwright marketing agent.
Collects ranking data, competitor activity, backlink status,
and directory submission results. No external AI API calls.
"""

import asyncio
import datetime
import logging
import sys

from config import Config
from tools.competitor_monitor import monitor_competitors
from tools.directory_submitter import find_and_submit_directories
from tools.serp_tracker import track_keyword_rankings
from tools.backlink_checker import check_submitted_backlinks
from tools.github_writer import write_report_to_github

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)


async def run(config: Config) -> None:
    today = datetime.date.today().isoformat()
    log.info("Marketing agent starting for %s", today)

    log.info("[1/4] Tracking keyword rankings...")
    rankings = await track_keyword_rankings(config.github_token, config.github_repo)

    log.info("[2/4] Monitoring competitors...")
    competitors = await monitor_competitors()

    log.info("[3/4] Checking submitted backlinks...")
    backlinks = await check_submitted_backlinks()

    log.info("[4/4] Submitting to directories...")
    directories = await find_and_submit_directories(config.github_token, config.github_repo)

    report = _build_report(today, rankings, competitors, backlinks, directories)

    log.info("Writing report to GitHub...")
    write_report_to_github(config, today, report)
    # GitHub Actions emails the report when the commit lands on main

    log.info("Done.")


def _build_report(
    today: str,
    rankings: str,
    competitors: str,
    backlinks: str,
    directories: str,
) -> str:
    return f"""# Marketing Report — {today}

## Keyword Rankings
{rankings}

## Competitor Activity
{competitors}

## Backlink Status
{backlinks}

## Directory Submissions
{directories}

## Actions for Hiten
{_extract_actions(directories, competitors)}

---
_Generated: {today} | Tools live: 12 | keptlocal.com_
"""


def _extract_actions(directories: str, competitors: str) -> str:
    lines = []
    # Pull out any "submit manually" lines from directory tool output
    for line in directories.splitlines():
        if "submit manually" in line.lower():
            lines.append(f"- [ ] {line.strip()}")
    # Flag competitor keywords worth targeting
    for line in competitors.splitlines():
        if line.strip().startswith("-"):
            lines.append(f"- [ ] Review competitor content: {line.strip()[2:]}")
    return "\n".join(lines) if lines else "- [ ] No manual actions today."


if __name__ == "__main__":
    try:
        config = Config.from_env()
        asyncio.run(run(config))
    except KeyError as e:
        log.error("Missing required environment variable: %s", e)
        sys.exit(1)
    except Exception:
        log.exception("Agent failed")
        sys.exit(1)
