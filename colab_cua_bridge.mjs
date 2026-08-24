import http from "http";
import { execFile } from "child_process";
import { promisify } from "util";

const run = promisify(execFile);
const PORT = 8081;

// Helper to run commands via colab-runner on Mac or local
async function runColabCode(pythonCode) {
  try {
    // If running on debian-vps, we can invoke via ssh to mac or direct if configured,
    // or execute via the colab-runner VM
    const res = await run("ssh", [
      "-o", "ConnectTimeout=5",
      "-o", "StrictHostKeyChecking=accept-new",
      "jodaro01@100.98.13.100", // Mac Mini via Tailscale
      `orb -m colab-runner python3 -c '
import urllib.request, json
try:
    code = """${pythonCode.replace(/"/g, '\\"')}"""
    # Execute on active Colab
    import os
    cfg = "/home/jodaro01/.config/colab-cli/pool_state.json"
    state = json.load(open(cfg)) if os.path.exists(cfg) else {}
    acc = state.get("active_account", "account1")
    sess = state.get("active_session", "sandbox")
    import subprocess
    p = subprocess.run(
        ["/home/jodaro01/.local/bin/colab", "exec", "-s", sess],
        env=dict(os.environ, COLAB_CONFIG_DIR=f"/home/jodaro01/.config/colab-cli/profiles/{acc}"),
        input=code,
        capture_output=True,
        text=True,
        timeout=15
    )
    print(p.stdout)
except Exception as e:
    print(f"ERR:{e}")
'
    `
    ]);
    return res.stdout.trim();
  } catch (err) {
    return `ERR:${err.message}`;
  }
}

// In-memory cached screenshot buffer
let lastScreenshot = null;
let lastScreenshotTime = 0;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  if (path === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      status: "ok",
      display: ":99",
      resolution: "1280x800",
      gpu: "NVIDIA T4",
      ready: true
    }));
  }

  if (path === "/screenshot") {
    const now = Date.now();
    if (lastScreenshot && now - lastScreenshotTime < 2000) {
      res.writeHead(200, { "Content-Type": "image/png" });
      return res.end(lastScreenshot);
    }

    const pyCode = `
import urllib.request, base64
try:
    with urllib.request.urlopen("http://127.0.0.1:8081/screenshot", timeout=5) as r:
        print("BASE64_IMG:" + base64.b64encode(r.read()).decode("ascii"))
except Exception:
    import mss, io
    from PIL import Image
    with mss.mss(display=":99") as sct:
        monitor = sct.monitors[1] if len(sct.monitors) > 1 else sct.monitors[0]
        sct_img = sct.grab(monitor)
        img = Image.frombytes("RGB", sct_img.size, sct_img.bgra, "raw", "BGRX")
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        print("BASE64_IMG:" + base64.b64encode(buf.getvalue()).decode("ascii"))
`;
    const out = await runColabCode(pyCode);
    const match = out.match(/BASE64_IMG:([A-Za-z0-9+/=]+)/);
    if (match) {
      lastScreenshot = Buffer.from(match[1], "base64");
      lastScreenshotTime = now;
      res.writeHead(200, { "Content-Type": "image/png" });
      return res.end(lastScreenshot);
    } else {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Could not capture screenshot", raw: out }));
    }
  }

  if (path === "/click" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      const { x = 640, y = 400, button = "left" } = JSON.parse(body || "{}");
      const pyCode = `
import os, pyautogui
os.environ["DISPLAY"] = ":99"
pyautogui.click(${x}, ${y}, button="${button}")
print("CLICK_OK")
`;
      await runColabCode(pyCode);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "clicked", x, y, button }));
    });
    return;
  }

  if (path === "/type" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      const { text = "" } = JSON.parse(body || "{}");
      const escaped = JSON.stringify(text);
      const pyCode = `
import os, pyautogui
os.environ["DISPLAY"] = ":99"
pyautogui.write(${escaped}, interval=0.02)
print("TYPE_OK")
`;
      await runColabCode(pyCode);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "typed" }));
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Colab CUA Bridge listening on http://127.0.0.1:${PORT}`);
});
