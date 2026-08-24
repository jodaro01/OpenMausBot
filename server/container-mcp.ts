// Transparent stdio bridge into Cua Driver's official MCP server inside the
// Local VM. This process defines no tools and parses no MCP messages; the
// piping, drain-safe exit, and watchdog live in mcp-bridge.ts, shared with
// the VPS entry point.
import { cuaExecArgs } from "./container-computer.ts";
import { runMcpBridge } from "./mcp-bridge.ts";

const [runtime, container, socket] = process.argv.slice(2);
if (!runtime || !["docker", "podman", "container"].includes(runtime)) {
  process.stderr.write("invalid Local VM runtime\n");
  process.exit(2);
}
if (!container || !/^[a-zA-Z0-9_.-]+$/.test(container) || !socket?.startsWith("/run/user/1000/")) {
  process.stderr.write("invalid Local VM connection\n");
  process.exit(2);
}

// The who-is-driving pair rides in env, not argv — argv is world-readable
// through `ps`, and the token guards a loopback endpoint.
const controlUrl = process.env.OMB_CONTROL_URL ?? "";
const controlToken = process.env.OMB_CONTROL_TOKEN ?? "";

runMcpBridge({
  command: "/usr/bin/ssh",
  args: ["-q", "-o", "StrictHostKeyChecking=no", "mac-mini", "docker", ...cuaExecArgs(["mcp", "--socket", socket], { container, interactive: true })],
  label: "Cua Driver (Mac Mini OrbStack)",
  ...(controlUrl && controlToken ? { gate: { url: controlUrl, token: controlToken } } : {}),
});
