// Gemini CLI harness support — Google's `gemini` CLI over ACP stdio
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

import { createAcpDriver, type AcpSupport } from "./core.ts";

const AUTH_PREFERENCE = ["gemini-api-key", "oauth-personal", "vertex-ai"];

function liveOauthCredential(): boolean {
  try {
    const creds = JSON.parse(readFileSync(join(homedir(), ".gemini", "oauth_creds.json"), "utf8")) as {
      access_token?: unknown;
      refresh_token?: unknown;
      expiry_date?: unknown;
    };
    if (typeof creds.access_token !== "string" || creds.access_token.trim().length === 0) return false;
    const hasRefresh = typeof creds.refresh_token === "string" && creds.refresh_token.trim().length > 0;
    if (creds.expiry_date !== undefined) {
      if (typeof creds.expiry_date !== "number" || !Number.isFinite(creds.expiry_date)) return false;
      return Date.now() < creds.expiry_date || hasRefresh;
    }
    return true;
  } catch {
    return false;
  }
}

const nonBlank = (value: string | undefined): boolean => Boolean(value?.trim());

export function geminiIsAuthenticated(env: Record<string, string | undefined>): boolean {
  return (
    nonBlank(env.GEMINI_API_KEY) ||
    nonBlank(env.GOOGLE_API_KEY) ||
    (existsSync(join(homedir(), ".gemini", "oauth_creds.json")) && liveOauthCredential())
  );
}

const support: AcpSupport = {
  driverKind: "geminiAgent",
  displayName: "Gemini",
  access: "subscription",
  models: {
    default: "gemini-2.5-pro",
    options: [
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
      { id: "gemini-2.5-flash-thinking", label: "Gemini 2.5 Flash (Thinking)" },
      { id: "gemini-3.1-pro", label: "Gemini 3.1 Pro" },
      { id: "gemini-3.6-flash", label: "Gemini 3.6 Flash" },
    ],
  },
  defaultCli: "gemini",
  nativeSource: "gemini.acp",
  loginNote:
    "Gemini CLI needs a GEMINI_API_KEY, a Vertex AI setup, or an enterprise Code Assist login",

  spawnArgs: (_config, turn) => ["--acp", ...(turn.model ? ["-m", turn.model] : [])],
  credentialEnv: ["GEMINI_API_KEY", "GOOGLE_API_KEY"],

  pickAuthMethod: (methods) => {
    const ids = methods.map((m) => m.id).filter((id): id is string => typeof id === "string");
    for (const pref of AUTH_PREFERENCE) if (ids.includes(pref)) return pref;
    return ids[0] ?? null;
  },
  authFailure: "continue",

  isAuthenticated: geminiIsAuthenticated,

  buildPromptText: (turn) => (turn.system ? `${turn.system}

${turn.text}` : turn.text),
};

export const GeminiAgentDriver = createAcpDriver(support);
