// Hermes Agent harness support — Nous Research's `hermes acp` CLI
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

import type { ModelCatalog } from "../../contracts.ts";
import { decodeInjectId, hostApiKey, localHost, mergeLocalInject } from "../local-inject.ts";
import { createAcpDriver, type AcpSupport } from "./core.ts";

const STATIC_HERMES_MODELS: ModelCatalog = {
  default: "hermes-3-llama-3.1-70b",
  options: [
    { id: "hermes-3-llama-3.1-405b", label: "Hermes 3 · 405B" },
    { id: "hermes-3-llama-3.1-70b", label: "Hermes 3 · 70B" },
    { id: "hermes-3-llama-3.1-8b", label: "Hermes 3 · 8B" },
    { id: "nous-hermes-2-mixtral-8x7b", label: "Nous Hermes 2 Mixtral 8x7B" },
    { id: "hermes-agent", label: "Hermes Agent Gateway" },
  ],
};

function hermesHome(env: Record<string, string | undefined>): string {
  return env.HERMES_HOME || join(env.HOME || env.USERPROFILE || homedir(), ".hermes");
}

function quoteYaml(value: string): string {
  if (/^[\w./:+-]+$/.test(value)) return value;
  return JSON.stringify(value);
}

function upsertHermesProvider(text: string, hostId: string, baseUrl: string, apiKey: string): string {
  const block = [`  ${hostId}:`, `    base_url: ${quoteYaml(baseUrl)}`, `    api_key: ${quoteYaml(apiKey)}`, ""].join("\n");
  if (/^providers:\s*$/m.test(text)) {
    const replaced = replaceHermesHostBlock(text, hostId, block);
    if (replaced !== null) return replaced;
    return text.replace(/^providers:\s*$/m, `providers:\n${block.trimEnd()}`);
  }
  const prefix = text && !text.endsWith("\n") ? `${text}\n` : text;
  return `${prefix}\nproviders:\n${block}`;
}

function replaceHermesHostBlock(text: string, hostId: string, block: string): string | null {
  const lines = text.split(/\r?\n/);
  const targetPrefix = `  ${hostId}:`;
  const start = lines.findIndex((l) => l === targetPrefix || l.startsWith(`  ${hostId} `));
  if (start === -1) return null;
  let end = start + 1;
  while (end < lines.length) {
    const line = lines[end]!;
    if (line.length === 0) {
      end += 1;
      continue;
    }
    if (/^\s{2}\S/.test(line) && !line.startsWith("    ")) break;
    if (/^\S/.test(line)) break;
    end += 1;
  }
  const before = lines.slice(0, start).join("\n");
  const after = lines.slice(end).join("\n");
  const prefix = before ? `${before}\n` : "";
  const suffix = after ? `\n${after}` : "";
  return `${prefix}${block.trimEnd()}${suffix}`;
}

export function ensureHermesInjectProvider(
  modelId: string,
  env: Record<string, string | undefined> = process.env,
): void {
  const inject = decodeInjectId(modelId);
  if (!inject) return;
  const host = localHost(inject.host);
  if (!host) return;

  const dir = hermesHome(env);
  mkdirSync(dir, { recursive: true });
  const path = join(dir, "config.yaml");
  let text = "";
  try {
    text = readFileSync(path, "utf8");
  } catch {
    text = "";
  }

  const updated = upsertHermesProvider(text, inject.host, host.baseUrl, hostApiKey(host, env));
  writeFileSync(path, updated);
}

export function hermesAcpModelId(modelId: string | null | undefined): string | null {
  const inject = decodeInjectId(modelId);
  if (!inject) return null;
  return `custom:${inject.host}:${inject.model}`;
}

async function resolveModels(env: Record<string, string | undefined>): Promise<ModelCatalog> {
  const catalog = await mergeLocalInject(STATIC_HERMES_MODELS, env);
  return { default: catalog.options[0]?.id ?? STATIC_HERMES_MODELS.default, options: catalog.options };
}

const support: AcpSupport = {
  driverKind: "hermesAgent",
  displayName: "Hermes",
  access: "subscription",
  models: STATIC_HERMES_MODELS,
  resolveModels,
  resolveTurnModel: (model, env) => {
    if (!model) return model;
    ensureHermesInjectProvider(model, env);
    return model;
  },
  defaultCli: "hermes",
  nativeSource: "hermes.acp",
  loginNote: "Hermes CLI is not installed",
  install: {
    command: {
      darwin: "curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash",
      linux: "curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash",
      win32: "iex (irm https://hermes-agent.nousresearch.com/install.ps1)",
    },
    docsUrl: "https://hermes-agent.nousresearch.com/docs/getting-started/quickstart",
    signInCommand: "hermes setup",
  },
  spawnArgs: (_config, turn) => ["acp", ...(turn.model ? ["-m", turn.model] : [])],
  pickAuthMethod: () => null,
  authFailure: "continue",
  isAuthenticated: () => true,
  buildPromptText: (turn) => (turn.system ? `${turn.system}\n\n${turn.text}` : turn.text),
};

export const HermesAgentDriver = createAcpDriver(support);
