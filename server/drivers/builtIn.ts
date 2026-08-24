// Built-in driver registration — Full 25 CLI Fleet powered by OmniRoute & Native CLI Engines
import type { AnyProviderDriver } from "../contracts.ts";
import { BoxAgentDriver } from "./boxagent.ts";
import { OpenAICompatDriver } from "./openai-compat.ts";
import { createOmniRouteDriver } from "./omniroute-bridge.ts";
import { PaperclipDriver } from "./paperclip.ts";

export const ClaudeDriver = createOmniRouteDriver({ driverKind: "claudeAgent", displayName: "Claude Code" });
export const CodexDriver = createOmniRouteDriver({ driverKind: "codex", displayName: "OpenAI Codex" });
export const AntigravityDriver = createOmniRouteDriver({ driverKind: "antigravityAgent", displayName: "Google Antigravity" });

export const GrokDriver = createOmniRouteDriver({ driverKind: "grok", displayName: "Grok CLI" });
export const GrokAgentDriver = createOmniRouteDriver({ driverKind: "grokAgent", displayName: "Grok Build" });
export const GeminiAgentDriver = createOmniRouteDriver({ driverKind: "geminiAgent", displayName: "Gemini CLI" });
export const KimiAgentDriver = createOmniRouteDriver({ driverKind: "kimiAgent", displayName: "Kimi Code" });
export const DroidAgentDriver = createOmniRouteDriver({ driverKind: "droidAgent", displayName: "Factory Droid" });
export const OpenCodeGoDriver = createOmniRouteDriver({ driverKind: "opencodeGo", displayName: "OpenCode Go" });
export const QwenAgentDriver = createOmniRouteDriver({ driverKind: "qwenAgent", displayName: "Qwen Code" });
export const HermesAgentDriver = createOmniRouteDriver({ driverKind: "hermesAgent", displayName: "Hermes Agent" });
export const LettaAgentDriver = createOmniRouteDriver({ driverKind: "lettaAgent", displayName: "Letta Code" });
export const ClineAgentDriver = createOmniRouteDriver({ driverKind: "clineAgent", displayName: "Cline Autonomous" });
export const KiroAgentDriver = createOmniRouteDriver({ driverKind: "kiroAgent", displayName: "Kiro Code" });
export const CopilotAgentDriver = createOmniRouteDriver({ driverKind: "copilotAgent", displayName: "GitHub Copilot" });
export const OpenClawDriver = createOmniRouteDriver({ driverKind: "openclawAgent", displayName: "OpenClaw Gateway" });
export const OllamaDriver = createOmniRouteDriver({ driverKind: "ollamaAgent", displayName: "Ollama Local", access: "custom" });
export const OpenRouterDriver = createOmniRouteDriver({ driverKind: "openrouterAgent", displayName: "OpenRouter Gateway", access: "custom" });
export const MiniMaxDriver = createOmniRouteDriver({ driverKind: "minimaxAgent", displayName: "MiniMax Engine", access: "custom" });

export const PiAgentDriver = createOmniRouteDriver({ driverKind: "piAgent", displayName: "Pi Code" });
export const CursorAgentDriver = createOmniRouteDriver({ driverKind: "cursorAgent", displayName: "Cursor CLI" });

export const OmpDriver = createOmniRouteDriver({ driverKind: "ompAgent", displayName: "Open Model Protocol" });
export const ZihinDriver = createOmniRouteDriver({ driverKind: "zihinAgent", displayName: "Zihin Cognitive" });
export const AgrentingDriver = createOmniRouteDriver({ driverKind: "agrentingAgent", displayName: "Agrenting Agency" });
export const ErrandDriver = createOmniRouteDriver({ driverKind: "errandAgent", displayName: "Errand Automation" });
export const MnemopayDriver = createOmniRouteDriver({ driverKind: "mnemopayAgent", displayName: "Mnemopay Web3" });

export const BUILT_IN_DRIVERS: readonly AnyProviderDriver[] = [
  PaperclipDriver,
  ClaudeDriver,
  CodexDriver,
  AntigravityDriver,
  BoxAgentDriver,

  GrokDriver,
  GrokAgentDriver,
  GeminiAgentDriver,
  KimiAgentDriver,
  DroidAgentDriver,
  OpenCodeGoDriver,
  QwenAgentDriver,
  HermesAgentDriver,
  LettaAgentDriver,
  ClineAgentDriver,
  KiroAgentDriver,
  CopilotAgentDriver,
  OpenClawDriver,
  OllamaDriver,
  OpenRouterDriver,
  MiniMaxDriver,
  PiAgentDriver,
  OpenAICompatDriver,
  CursorAgentDriver,
  OmpDriver,
  ZihinDriver,
  AgrentingDriver,
  ErrandDriver,
  MnemopayDriver,
];
