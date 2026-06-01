"""Send the daily report email via Resend."""
from __future__ import annotations

import json
import urllib.error
import urllib.request

from config import Config


def send_report_email(config: Config, date: str, content: str) -> None:
    payload = {
        "from": "keptlocal Marketing <onboarding@resend.dev>",
        "to": [config.recipient_email],
        "subject": f"keptlocal Marketing Report — {date}",
        "html": _wrap_html(date, _md_to_html(content)),
        "text": content,
    }

    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {config.resend_api_key}",
            "Content-Type": "application/json",
        },
    )

    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read())
        print(f"Email sent: {result.get('id')}")


def _wrap_html(date: str, body: str) -> str:
    return f"""<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f9f7f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:680px;margin:32px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08)">
  <div style="background:#1a3d2b;padding:24px 32px">
    <p style="color:#a8c5b2;margin:0;font-size:12px;letter-spacing:1px;text-transform:uppercase">keptlocal.com</p>
    <h1 style="color:#fff;margin:4px 0 0;font-size:22px;font-weight:600">Marketing Report</h1>
    <p style="color:#a8c5b2;margin:4px 0 0;font-size:14px">{date}</p>
  </div>
  <div style="padding:24px 32px 32px">{body}</div>
  <div style="background:#f9f7f4;padding:16px 32px;border-top:1px solid #eee">
    <p style="color:#999;font-size:12px;margin:0">
      Sent by your keptlocal Playwright marketing agent &middot;
      <a href="https://github.com/hitendra1851/keptlocal/tree/main/marketing/reports" style="color:#1a3d2b">View all reports</a>
    </p>
  </div>
</div>
</body></html>"""


def _md_to_html(text: str) -> str:
    lines = text.split("\n")
    out: list[str] = []
    in_list = False

    for line in lines:
        if line.startswith("# "):
            if in_list: out.append("</ul>"); in_list = False
            out.append(f'<h1 style="color:#1a3d2b;margin-bottom:4px">{line[2:]}</h1>')
        elif line.startswith("## "):
            if in_list: out.append("</ul>"); in_list = False
            out.append(f'<h2 style="color:#1a3d2b;border-bottom:2px solid #e8e0d5;padding-bottom:4px;margin-top:28px">{line[3:]}</h2>')
        elif line.startswith("### "):
            if in_list: out.append("</ul>"); in_list = False
            out.append(f'<h3 style="color:#2d5a3d">{line[4:]}</h3>')
        elif line.startswith("- [ ] "):
            if not in_list: out.append('<ul style="list-style:none;padding-left:0">'); in_list = True
            out.append(f'<li style="padding:4px 0;color:#c0392b">&#9744; <strong>{line[6:]}</strong></li>')
        elif line.startswith("- "):
            if not in_list: out.append('<ul style="padding-left:20px">'); in_list = True
            out.append(f'<li style="padding:2px 0">{line[2:]}</li>')
        elif line.startswith("|"):
            if in_list: out.append("</ul>"); in_list = False
            out.append(f'<code style="display:block;font-size:12px;background:#f5f5f5;padding:2px 6px">{line}</code>')
        elif line.strip() == "---":
            if in_list: out.append("</ul>"); in_list = False
            out.append('<hr style="border:none;border-top:1px solid #e0e0e0;margin:16px 0">')
        elif line.strip() == "":
            if in_list: out.append("</ul>"); in_list = False
        else:
            if in_list: out.append("</ul>"); in_list = False
            out.append(f'<p style="margin:6px 0;line-height:1.5">{line}</p>')

    if in_list:
        out.append("</ul>")
    return "\n".join(out)
