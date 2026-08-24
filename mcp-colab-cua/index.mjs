#!/usr/bin/env node
/**
 * CUA Desktop MCP Bridge Server
 * Exposes VOIP VPS Remote Desktop & Computer Control to AI Agents in OpenMausBot / Claude Code.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const RELAY_HOST = process.env.COLAB_HOST || "127.0.0.1";
const RELAY_PORT = process.env.COLAB_PORT || "8081";
const RELAY_BASE = `http://${RELAY_HOST}:${RELAY_PORT}`;

const server = new Server(
  {
    name: "cua-desktop-mcp",
    version: "1.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const TOOLS = [
  {
    name: "screenshot",
    description: "Capture a real-time screenshot of the VOIP VPS desktop screen (:11). Returns PNG image.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "click",
    description: "Click at specific (x, y) pixel coordinates on the remote desktop.",
    inputSchema: {
      type: "object",
      properties: {
        x: { type: "number", description: "X coordinate (0-1280)" },
        y: { type: "number", description: "Y coordinate (0-800)" },
        button: { type: "string", enum: ["left", "right", "middle"], default: "left" },
        clickCount: { type: "number", default: 1, description: "1 for single click, 2 for double click" },
      },
      required: ["x", "y"],
    },
  },
  {
    name: "mouse_move",
    description: "Move the mouse cursor to specific (x, y) coordinates.",
    inputSchema: {
      type: "object",
      properties: {
        x: { type: "number", description: "X coordinate (0-1280)" },
        y: { type: "number", description: "Y coordinate (0-800)" },
      },
      required: ["x", "y"],
    },
  },
  {
    name: "type",
    description: "Type text into the currently focused window on the remote desktop.",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string", description: "Text to type" },
        delay: { type: "number", default: 30, description: "Delay in ms between keystrokes" },
      },
      required: ["text"],
    },
  },
  {
    name: "key",
    description: "Press a keyboard key or hotkey combination (e.g. Return, Tab, BackSpace, Escape, ctrl+c, alt+F4).",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Key or key combination name" },
      },
      required: ["key"],
    },
  },
  {
    name: "url",
    description: "Open a URL in Firefox on the remote desktop display.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "URL to open" },
      },
      required: ["url"],
    },
  },
  {
    name: "exec",
    description: "Execute a bash shell command in the remote desktop environment (with DISPLAY=:11).",
    inputSchema: {
      type: "object",
      properties: {
        command: { type: "string", description: "Bash command to run" },
        timeout: { type: "number", default: 30, description: "Timeout in seconds" },
      },
      required: ["command"],
    },
  },
  {
    name: "scroll",
    description: "Scroll the mouse wheel up or down.",
    inputSchema: {
      type: "object",
      properties: {
        deltaY: { type: "number", description: "Positive to scroll down, negative to scroll up" },
      },
      required: ["deltaY"],
    },
  },
  {
    name: "status",
    description: "Check health and status of the CUA Desktop pool.",
    inputSchema: { type: "object", properties: {} },
  },
  // Legacy / Colab aliases
  {
    name: "colab_screenshot",
    description: "Capture screenshot alias",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "colab_click",
    description: "Click alias",
    inputSchema: {
      type: "object",
      properties: {
        x: { type: "number" },
        y: { type: "number" },
        button: { type: "string" },
      },
      required: ["x", "y"],
    },
  },
  {
    name: "colab_type",
    description: "Type alias",
    inputSchema: {
      type: "object",
      properties: { text: { type: "string" } },
      required: ["text"],
    },
  },
  {
    name: "colab_key",
    description: "Key alias",
    inputSchema: {
      type: "object",
      properties: { key: { type: "string" } },
      required: ["key"],
    },
  },
  {
    name: "colab_exec",
    description: "Exec alias",
    inputSchema: {
      type: "object",
      properties: { command: { type: "string" } },
      required: ["command"],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    if (name === "screenshot" || name === "colab_screenshot") {
      const res = await fetch(`${RELAY_BASE}/screenshot`, { signal: AbortSignal.timeout(12000) });
      const arrayBuffer = await res.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      return {
        content: [
          {
            type: "image",
            data: base64,
            mimeType: "image/png",
          },
        ],
      };
    }

    if (name === "click" || name === "colab_click") {
      const res = await fetch(`${RELAY_BASE}/click`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
        signal: AbortSignal.timeout(8000),
      });
      const data = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }

    if (name === "mouse_move") {
      const res = await fetch(`${RELAY_BASE}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
        signal: AbortSignal.timeout(8000),
      });
      const data = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }

    if (name === "type" || name === "colab_type") {
      const res = await fetch(`${RELAY_BASE}/type`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
        signal: AbortSignal.timeout(8000),
      });
      const data = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }

    if (name === "key" || name === "colab_key") {
      const res = await fetch(`${RELAY_BASE}/key`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
        signal: AbortSignal.timeout(8000),
      });
      const data = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }

    if (name === "url") {
      const res = await fetch(`${RELAY_BASE}/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
        signal: AbortSignal.timeout(8000),
      });
      const data = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }

    if (name === "scroll") {
      const res = await fetch(`${RELAY_BASE}/scroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
        signal: AbortSignal.timeout(8000),
      });
      const data = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }

    if (name === "exec" || name === "colab_exec") {
      const res = await fetch(`${RELAY_BASE}/exec`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
        signal: AbortSignal.timeout(45000),
      });
      const data = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    if (name === "status" || name === "colab_status") {
      const res = await fetch(`${RELAY_BASE}/health`, { signal: AbortSignal.timeout(5000) });
      const data = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error calling ${name}: ${error.message}` }],
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
