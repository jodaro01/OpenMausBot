// Letta Code harness support — Letta Memory-First Agent CLI over ACP stdio
import { createAcpDriver, type AcpSupport } from "./core.ts";
import type { ModelCatalog } from "../../contracts.ts";
import { mergeLocalInject } from "../local-inject.ts";

const STATIC_LETTA_MODELS: ModelCatalog = {
  default: "letta-mem-claude-3-7-sonnet",
  options: [
    { id: "letta-mem-claude-3-7-sonnet", label: "Letta + Claude 3.7 Sonnet (Memory)" },
    { id: "letta-mem-gpt-4o", label: "Letta + GPT-4o (Memory)" },
    { id: "letta-mem-deepseek-r1", label: "Letta + DeepSeek R1 (Memory)" },
    { id: "letta-mem-llama-3.3-70b", label: "Letta + Llama 3.3 70B (Memory)" },
  ],
};

const support: AcpSupport = {
  driverKind: "lettaAgent",
  displayName: "Letta Code",
  access: "subscription",
  models: STATIC_LETTA_MODELS,
  resolveModels: async (env) => mergeLocalInject(STATIC_LETTA_MODELS, env),
  defaultCli: "letta",
  nativeSource: "letta.acp",
  loginNote: "Letta Code CLI is available via Paperclip adapters",
  spawnArgs: (_config, turn) => ["acp", ...(turn.model ? ["-m", turn.model] : [])],
  pickAuthMethod: () => null,
  authFailure: "continue",
  isAuthenticated: () => true,
  buildPromptText: (turn) => (turn.system ? `${turn.system}\n\n${turn.text}` : turn.text),
};

export const LettaAgentDriver = createAcpDriver(support);
