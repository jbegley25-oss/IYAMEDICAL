#!/usr/bin/env python3
"""
IYA Medical / Cyanide AI health monitor.

Pings each tracked service. If a service stays DOWN for >= ALERT_AFTER_MIN
minutes, sends one iMessage alert via the local `imsg` CLI to ALERT_CONTACT,
then waits ALERT_COOLDOWN_MIN minutes before re-alerting on the same service.
Sends a single recovery message when a previously-alerted service comes back.

Designed to be invoked once per minute by a launchd LaunchAgent.

State is persisted to ~/.health-monitor-state.json so consecutive failure
counts and alert state survive across runs.

This script intentionally does NOT touch the Leila bridge process. It uses
the same `imsg` CLI that bb-poll-bridge uses internally.
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

import urllib.request
import urllib.error

# ── Configuration ──────────────────────────────────────────────────────
ALERT_CONTACT = os.environ.get("HEALTH_MONITOR_CONTACT", "+14803993910")
STATE_PATH = Path(os.environ.get(
    "HEALTH_MONITOR_STATE",
    os.path.expanduser("~/.health-monitor-state.json"),
))
LOG_PATH = Path(os.environ.get(
    "HEALTH_MONITOR_LOG",
    os.path.expanduser("~/Library/Logs/health-monitor.log"),
))

# When run every 60s, ALERT_AFTER_MIN=5 → 5 consecutive failures.
INTERVAL_SECONDS = int(os.environ.get("HEALTH_MONITOR_INTERVAL_S", "60"))
ALERT_AFTER_MIN = int(os.environ.get("HEALTH_MONITOR_ALERT_AFTER_MIN", "5"))
ALERT_COOLDOWN_MIN = int(os.environ.get("HEALTH_MONITOR_COOLDOWN_MIN", "30"))
HTTP_TIMEOUT = int(os.environ.get("HEALTH_MONITOR_TIMEOUT_S", "8"))

FAILURE_THRESHOLD = max(1, (ALERT_AFTER_MIN * 60) // INTERVAL_SECONDS)

# ── Service definitions ────────────────────────────────────────────────
SERVICES = [
    {
        "name": "DGX cyanide-api (public tunnel)",
        "url": "https://elsewhere-thousand-shall-consolidated.trycloudflare.com/health",
        "expect": [200],
    },
    # OpenEMR public tunnel intentionally taken down — skip
    {
        "name": "DGX cyanide-api (Tailscale)",
        "url": "http://100.79.44.77:8888/health",
        "expect": [200],
    },
    {
        "name": "AI Lab Analyzer",
        "url": "http://100.79.44.77:8001/health",
        "expect": [200],
    },
    {
        "name": "SOAP Note Pipeline",
        "url": "http://100.79.44.77:8002/health",
        "expect": [200],
    },
    {
        "name": "DGX HIPAA Audio API",
        "url": "http://100.79.44.77:12500/api/v1/health",
        "expect": [200],
    },
    # iyamedical-v2 dev server only runs when actively developing — skip
]


# ── Helpers ────────────────────────────────────────────────────────────
def log(msg: str) -> None:
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    line = f"{time.strftime('%Y-%m-%d %H:%M:%S')} {msg}\n"
    with LOG_PATH.open("a") as f:
        f.write(line)


def load_state() -> dict:
    if not STATE_PATH.exists():
        return {}
    try:
        return json.loads(STATE_PATH.read_text())
    except Exception:
        return {}


def save_state(state: dict) -> None:
    STATE_PATH.write_text(json.dumps(state, indent=2))


def probe(url: str, expect: list[int]) -> tuple[bool, str]:
    req = urllib.request.Request(url, method="GET", headers={"User-Agent": "health-monitor/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT) as r:
            code = r.getcode()
            if code in expect:
                return True, f"HTTP {code}"
            return False, f"HTTP {code}"
    except urllib.error.HTTPError as e:
        if e.code in expect:
            return True, f"HTTP {e.code}"
        return False, f"HTTP {e.code}"
    except Exception as e:
        return False, f"{type(e).__name__}: {e}"


def send_imsg(text: str) -> bool:
    imsg = shutil.which("imsg") or "/opt/homebrew/bin/imsg"
    if not Path(imsg).exists():
        log(f"imsg not found at {imsg}; cannot alert")
        return False
    try:
        subprocess.run(
            [imsg, "send", "--to", ALERT_CONTACT, "--text", text],
            check=True,
            timeout=20,
            capture_output=True,
        )
        return True
    except subprocess.CalledProcessError as e:
        log(f"imsg send failed: {e.stderr.decode(errors='replace')[:200]}")
        return False
    except Exception as e:
        log(f"imsg send exception: {e}")
        return False


# ── Main loop (single pass per launchd invocation) ─────────────────────
def main() -> int:
    state = load_state()
    now = int(time.time())

    for svc in SERVICES:
        key = svc["name"]
        s = state.setdefault(
            key,
            {"fail_count": 0, "alerted": False, "last_alert": 0, "last_status": "init"},
        )

        ok, detail = probe(svc["url"], svc["expect"])
        s["last_check"] = now
        s["last_detail"] = detail

        if ok:
            if s.get("alerted"):
                # Recovered — send ONE recovery message
                recovered_msg = (
                    f"✅ RECOVERED: {key}\n"
                    f"Status: {detail}\n"
                    f"After {s.get('fail_count', 0)} failed checks"
                )
                if send_imsg(recovered_msg):
                    log(f"recovery alert sent for {key}")
            s["fail_count"] = 0
            s["alerted"] = False
            s["last_status"] = "ok"
        else:
            s["fail_count"] = int(s.get("fail_count", 0)) + 1
            s["last_status"] = "down"
            log(f"DOWN ({s['fail_count']}/{FAILURE_THRESHOLD}) {key}: {detail}")

            should_alert = s["fail_count"] >= FAILURE_THRESHOLD and (
                not s.get("alerted")
                or (now - int(s.get("last_alert", 0))) >= ALERT_COOLDOWN_MIN * 60
            )
            if should_alert:
                msg = (
                    f"⚠️ DOWN: {key}\n"
                    f"URL: {svc['url']}\n"
                    f"Reason: {detail}\n"
                    f"Failed {s['fail_count']} consecutive checks "
                    f"(~{(s['fail_count'] * INTERVAL_SECONDS) // 60} min)"
                )
                if send_imsg(msg):
                    s["alerted"] = True
                    s["last_alert"] = now
                    log(f"alert sent for {key}")

    save_state(state)
    return 0


if __name__ == "__main__":
    sys.exit(main())
