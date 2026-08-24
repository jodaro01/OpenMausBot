#!/usr/bin/env python3
"""
CUA Desktop Relay Daemon
Proxies OpenMausBot screenshot, health checks, and desktop automation requests
to the VOIP VPS Desktop Pool (http://100.91.182.30:7788).
Automatically maps Bot IDs to Clean Division Desktops.
"""
import base64
import json
import os
import urllib.parse
import urllib.request
import urllib.error
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

VOIP_POOL_URL = "http://100.91.182.30:7788"
POOL_TOKEN = "06485f13dd1eb11bb1e018b39c7f2563c4a9e010fb437ad9"
AGENT_OWNER = "omb-agent"

BOT_MAP = {}
def load_bot_map():
    global BOT_MAP
    for path in ["/root/.openmausbot/bots.json", os.path.expanduser("~/.openmausbot/bots.json")]:
        if os.path.exists(path):
            try:
                with open(path) as f:
                    raw = json.load(f)
                    bots = raw if isinstance(raw, list) else raw.get("bots", [])
                    for b in bots:
                        bid = b.get("id")
                        sec = b.get("section")
                        name = b.get("name")
                        if bid and sec:
                            BOT_MAP[bid] = sec
                        if name and sec:
                            BOT_MAP[name.lower()] = sec
                break
            except Exception:
                pass

load_bot_map()

def normalize_division_str(raw):
    if not raw:
        return "engineering"
    s = str(raw).lower().strip().replace(" division", "").replace(" team room", "").strip()
    s = s.replace("&", "").replace("+", "").replace(" ", "_").replace("-", "_")
    while "__" in s:
        s = s.replace("__", "_")
    s = s.strip("_")
    return s or "engineering"

def resolve_target_desktop(raw_id):
    if not raw_id:
        return "engineering"
    load_bot_map()
    val = raw_id
    if raw_id in BOT_MAP:
        val = BOT_MAP[raw_id]
    elif raw_id.lower() in BOT_MAP:
        val = BOT_MAP[raw_id.lower()]
    clean = normalize_division_str(val)
    return urllib.parse.quote(clean)

def make_req(path, data=None):
    url = f"{VOIP_POOL_URL}{path}"
    body = json.dumps(data).encode("utf-8") if data is not None else None
    return urllib.request.Request(
        url,
        data=body,
        headers={
            "Content-Type": "application/json",
            "X-Pool-Token": POOL_TOKEN
        }
    )

class RelayHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def send_json(self, code, data):
        body = json.dumps(data).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path in ("/health", "/api/health", "/healthz"):
            self.send_json(200, {
                "status": "ok",
                "ready": True,
                "desktop": "running",
                "provider": "voip-vps-cua-pool",
                "host": "100.91.182.30",
                "display": ":11"
            })
            return

        elif self.path.startswith("/screenshot"):
            raw_id = "engineering"
            if "desktop=" in self.path:
                try:
                    raw_id = self.path.split("desktop=")[1].split("&")[0]
                except Exception:
                    pass
            elif "bot=" in self.path:
                try:
                    raw_id = self.path.split("bot=")[1].split("&")[0]
                except Exception:
                    pass

            target_desktop = resolve_target_desktop(raw_id)
            shot_req = make_req(f"/desktop/{target_desktop}/screenshot", {"owner": AGENT_OWNER})
            try:
                with urllib.request.urlopen(shot_req, timeout=12) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                    b64 = data.get("png_base64", "")
                    if b64:
                        raw_png = base64.b64decode(b64)
                        self.send_response(200)
                        self.send_header("Content-Type", "image/png")
                        self.send_header("Content-Length", str(len(raw_png)))
                        self.end_headers()
                        self.wfile.write(raw_png)
                        return
                    else:
                        self.send_json(500, {"error": "empty screenshot payload"})
                        return
            except Exception as e:
                self.send_json(500, {"error": str(e)})
            return

        elif self.path in ("/status", "/api/status"):
            try:
                with urllib.request.urlopen(make_req("/status"), timeout=5) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                    self.send_json(200, {"relay": "active", "voip_pool": data})
            except Exception as e:
                self.send_json(500, {"relay": "active", "error": str(e)})
            return

        self.send_json(404, {"error": "not found"})

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        raw_body = self.rfile.read(length) if length > 0 else b"{}"
        try:
            body = json.loads(raw_body or b"{}")
        except Exception:
            body = {}

        # Extract action from path e.g. /click, /type, /key, /exec, /url, /move, /scroll
        path_clean = self.path.strip("/").split("?")[0]
        path_parts = path_clean.split("/")
        path_action = path_parts[0] if path_parts and path_parts[0] not in ("", "api", "action") else ""
        action = path_action or body.get("action", "click")
        raw_desktop = body.get("desktop", body.get("botId", "engineering"))
        target_desktop = resolve_target_desktop(raw_desktop)

        try:
            req = make_req(f"/desktop/{target_desktop}/{action}", {**body, "owner": AGENT_OWNER})
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                self.send_json(200, data)
        except Exception as e:
            self.send_json(500, {"error": str(e)})

if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8081), RelayHandler)
    print("CUA Desktop Relay running on 127.0.0.1:8081 -> 100.91.182.30:7788")
    server.serve_forever()
