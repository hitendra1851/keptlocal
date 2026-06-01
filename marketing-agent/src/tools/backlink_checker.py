"""Check if previously submitted directories have published the keptlocal.com listing."""
from __future__ import annotations

import asyncio

from playwright.async_api import async_playwright

from config import KNOWN_DIRECTORIES


async def check_submitted_backlinks() -> str:
    results: list[str] = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        for directory in KNOWN_DIRECTORIES:
            listed = await _is_listed(page, directory["url"])
            status = "Listed" if listed else "Not yet listed"
            results.append(f"| {directory['name']} | {status} |")

        await browser.close()

    header = "| Directory | Status |\n|-----------|--------|"
    return header + "\n" + "\n".join(results)


async def _is_listed(page, directory_url: str) -> bool:
    """Return True if keptlocal.com appears anywhere on the directory page."""
    try:
        await page.goto(directory_url, wait_until="domcontentloaded", timeout=20000)
        await asyncio.sleep(1)
        content = await page.content()
        return "keptlocal" in content.lower()
    except Exception:
        return False
