// Universal OmniRoute Bridge Driver for OpenMausBot with Full CUA Desktop & Tool Calling Loop
// Bridges any agent engine directly to OmniRoute (http://100.120.12.123:20300/v1)
import type {
  AnyProviderDriver,
  DriverCreateInput,
  EngineAccess,
  ModelCatalog,
  ProviderAdapter,
  ProviderInstance,
  ProviderSnapshot,
  RuntimeEvent,
  RuntimeEventListener,
  SendTurnInput,
  TurnStartResult,
} from "../contracts.ts";
import { newEventId } from "../contracts.ts";

const OMNIROUTE_URL = process.env.OMNIROUTE_BASE_URL || "http://100.120.12.123:20300/v1";
const OMNIROUTE_KEY = process.env.OMNIROUTE_API_KEY || "sk-14ef487ca3b809b2-1078fe-892750bf";
const RELAY_BASE = "http://127.0.0.1:8081";

export interface OmniRouteDriverOptions {
  driverKind: string;
  displayName: string;
  defaultModel?: string;
  models?: ModelCatalog;
  access?: EngineAccess;
}

const DESKTOP_TOOLS = [
  {
    type: "function",
    function: {
      name: "desktop_url",
      description: "Navigate to a URL or website (e.g. Google Search, news, portals) in Firefox on the agent's remote CUA desktop display.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "The full URL to open (e.g. https://www.google.com/search?q=ESG+Nachhaltigkeit)" },
        },
        required: ["url"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "desktop_click",
      description: "Click with the mouse at (x, y) coordinates on the remote desktop.",
      parameters: {
        type: "object",
        properties: {
          x: { type: "number", description: "X pixel coordinate (0-1280)" },
          y: { type: "number", description: "Y pixel coordinate (0-800)" },
          button: { type: "string", enum: ["left", "right", "middle"], default: "left" },
        },
        required: ["x", "y"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "desktop_type",
      description: "Type text into the currently active window or input field on the remote desktop.",
      parameters: {
        type: "object",
        properties: {
          text: { type: "string", description: "The text string to type" },
        },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "desktop_key",
      description: "Press a keyboard key or hotkey (e.g. Return, BackSpace, Tab, Escape, ctrl+a, ctrl+c, ctrl+v).",
      parameters: {
        type: "object",
        properties: {
          key: { type: "string", description: "Key name or hotkey combination" },
        },
        required: ["key"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "desktop_screenshot",
      description: "Capture a real-time screenshot of the agent's desktop to view current screen contents.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "desktop_exec",
      description: "Execute a bash shell command on the agent's Linux desktop environment.",
      parameters: {
        type: "object",
        properties: {
          command: { type: "string", description: "Bash shell command to run" },
        },
        required: ["command"],
      },
    },
  },
];

async function executeDesktopAction(botId: string, actionName: string, args: Record<string, any>): Promise<any> {
  const cleanAction = actionName.replace(/^desktop_/, "");
  try {
    if (cleanAction === "screenshot") {
      const res = await fetch(`${RELAY_BASE}/screenshot?desktop=${encodeURIComponent(botId)}`, {
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        return { ok: true, message: "Screenshot captured successfully" };
      }
      return { ok: false, error: `Screenshot HTTP ${res.status}` };
    }

    const res = await fetch(`${RELAY_BASE}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        desktop: botId,
        action: cleanAction,
        ...args,
      }),
      signal: AbortSignal.timeout(15000),
    });
    return await res.json();
  } catch (err: any) {
    return { ok: false, error: err.message || String(err) };
  }
}

export function createOmniRouteDriver(options: OmniRouteDriverOptions): AnyProviderDriver {
  const { driverKind, displayName, access = "subscription" } = options;

      const catalog: ModelCatalog = options.models ?? {
    default: options.defaultModel ?? "Paid Combo",
    options: [
      { id: "Paid Combo", label: "Paid Combo" },
      { id: "Free Combo", label: "Free Combo" },
      { id: "FreeBuff", label: "FreeBuff (Mac Mini)" },
      { id: "Claude Opus 5", label: "Claude Opus 5" },
      { id: "Claude Opus Thinking", label: "Claude Opus Thinking" },
      { id: "GPT-5.6 Sol Max", label: "GPT-5.6 Sol Max" },
      { id: "Grok 4.5", label: "Grok 4.5" },
      { id: "GLM 5.3", label: "GLM 5.3" },
      { id: "Gemini 3.7 Flash", label: "Gemini 3.7 Flash" },
      { id: "lumo/lumo", label: "Lumo Chat" },
      { id: "lumo/lumo-lite", label: "Lumo Lite" },
      { id: "lumo/lumo-max", label: "Lumo Max" },
      { id: "antseed/ox-alpha", label: "Ox Alpha" },
      { id: "antseed/deepseek-v4-flash", label: "DeepSeek V4 Flash" },
      { id: "antseed/nemotron-3-super-free", label: "Nemotron 3 Super" },
      { id: "antseed/minimax-m2.1", label: "MiniMax M2.1" },
      { id: "antseed/minimax-m2.5", label: "MiniMax M2.5" },
      { id: "antseed/minimax-m2.7", label: "MiniMax M2.7" },
      { id: "antseed/minimax-m3", label: "MiniMax M3" },
      { id: "antseed/stealth-ox-alpha", label: "Stealth Ox Alpha" },
      { id: "antseed/glm-4.5-flash", label: "GLM 4.5 Flash" },
      { id: "antseed/glm-4.7-flash", label: "GLM 4.7 Flash" },
      { id: "antseed/nemotron-120b-free", label: "Nemotron 120B" },
      { id: "antseed/nemotron-3-ultra-free", label: "Nemotron 3 Ultra" },
      { id: "antseed/qwen3-235b-instruct", label: "Qwen3 235B" },
      { id: "antseed/qwen35b", label: "Qwen 35B" },
      { id: "antseed/qwenCoder", label: "Qwen Coder" },
      { id: "antseed/codestral-latest", label: "Codestral" },
      { id: "antseed/haiku-4.5-coding-only", label: "Haiku 4.5 Coding" },
      { id: "antseed/llama70b", label: "LLaMA 70B" },
      { id: "antseed/mistral-large", label: "Mistral Large" },
      { id: "antseed/step-3.7-flash", label: "Step 3.7 Flash" },
      { id: "antseed/chroma", label: "Chroma Vision" },
      { id: "antseed/flux-2-max", label: "Flux 2 Max" },
      { id: "antseed/flux-2-pro", label: "Flux 2 Pro" },
      { id: "antseed/gpt-image-1-5", label: "GPT Image 1.5" },
      { id: "antseed/gpt-image-2", label: "GPT Image 2" },
      { id: "antseed/grok-4.5", label: "Grok 4.5 (AntSeed)" },
      { id: "antseed/grok-imagine-image", label: "Grok Imagine" },
      { id: "antseed/grok-imagine-image-2-0", label: "Grok Imagine 2.0" },
      { id: "antseed/grok-imagine-image-quality", label: "Grok Imagine Quality" },
      { id: "antseed/hunyuan-image-v3", label: "Hunyuan V3" },
      { id: "antseed/ideogram-v4", label: "Ideogram V4" },
      { id: "antseed/imagineart-1.5-pro", label: "ImagineArt Pro" },
      { id: "antseed/krea-2-turbo", label: "Krea 2 Turbo" },
      { id: "antseed/krea-v2-large", label: "Krea Large" },
      { id: "antseed/krea-v2-medium", label: "Krea Medium" },
      { id: "antseed/luma-uni-1", label: "Luma Uni 1" },
      { id: "antseed/luma-uni-1-max", label: "Luma Uni 1 Max" },
      { id: "antseed/lustify-sdxl", label: "Lustify SDXL" },
      { id: "antseed/lustify-v7", label: "Lustify V7" },
      { id: "antseed/lustify-v8", label: "Lustify V8" },
      { id: "antseed/nano-banana-2", label: "Nano Banana 2" },
      { id: "antseed/nano-banana-2-lite", label: "Nano Banana Lite" },
      { id: "antseed/nano-banana-pro", label: "Nano Banana Pro" },
      { id: "antseed/qwen-image", label: "Qwen Image" },
      { id: "antseed/qwen-image-2", label: "Qwen Image 2" },
      { id: "antseed/qwen-image-2-pro", label: "Qwen Image 2 Pro" },
      { id: "antseed/qwen-image-3", label: "Qwen Image 3" },
      { id: "antseed/qwen-image-3-pro", label: "Qwen Image 3 Pro" },
      { id: "antseed/recraft-v4", label: "Recraft V4" },
      { id: "antseed/recraft-v4-pro", label: "Recraft V4 Pro" },
      { id: "antseed/seedream-v4", label: "Seedream V4" },
      { id: "antseed/seedream-v5-lite", label: "Seedream V5 Lite" },
      { id: "antseed/seedream-v5-pro", label: "Seedream V5 Pro" },
      { id: "antseed/venice-sd35", label: "Venice SD3.5" },
      { id: "antseed/wai-Illustrious", label: "WAI Illustrious" },
      { id: "antseed/wan-2-7-pro-text-to-image", label: "WAN 2.7 Pro" },
      { id: "antseed/wan-2-7-text-to-image", label: "WAN 2.7" },
      { id: "antseed/z-image-turbo", label: "Z-Image Turbo" }
    ],
  };

  return {
    driverKind,
    metadata: { displayName, supportsMultipleInstances: true, access },
    decodeConfig(raw: unknown): any {
      return raw && typeof raw === "object" ? raw : {};
    },
    defaultConfig(): any {
      return { baseUrl: OMNIROUTE_URL };
    },
    models: catalog,

    async create(input: DriverCreateInput<any>): Promise<ProviderInstance> {
      const { instanceId } = input;
      const listeners = new Set<RuntimeEventListener>();
      const activeTurns = new Map<string, { abort: () => void }>();

      const emit = (e: RuntimeEvent) => {
        for (const l of [...listeners]) l(e);
      };

      const adapter: ProviderAdapter & {
    snapshot: () => Promise<ProviderSnapshot>;
    dispose: () => Promise<void>;
  } = {
        provider: driverKind,
        capabilities: {
          sessionModelSwitch: "in-session",
          computerMcp: true,
          localComputerMcp: true,
          composioMcp: true,
          phoneMcp: true,
        },

        onEvent(listener: RuntimeEventListener) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },

        async snapshot(): Promise<ProviderSnapshot> {
          return {
            state: "available",
            version: `${displayName} (OmniRoute Gateway)`,
            authenticated: true,
            billing: access === "subscription" ? "subscription" : undefined,
          };
        },

        async sendTurn(turnInput: SendTurnInput): Promise<TurnStartResult> {
          const turnId = `or-${newEventId()}`;
          const threadId = turnInput.threadId;
          const model = turnInput.model || catalog.default;

          const controller = new AbortController();
          activeTurns.set(threadId, { abort: () => controller.abort() });

          emit({
            eventId: newEventId(),
            provider: driverKind,
            providerInstanceId: instanceId,
            threadId,
            turnId,
            type: "turn.started",
            createdAt: new Date().toISOString(),
          } as unknown as RuntimeEvent);

          // Build messages array
          const messages: Array<any> = [];
          const systemContent = [
            turnInput.system || "You are an autonomous AI specialist in OpenMausBot.",
            "You have full access to your remote CUA desktop via desktop_* tools (desktop_url, desktop_click, desktop_type, desktop_key, desktop_screenshot, desktop_exec).",
            "When the user asks you to search the web, open a site, or interact with the desktop, ALWAYS call the appropriate desktop_* tools to execute the task directly on your screen.",
          ].filter(Boolean).join("\n\n");

          messages.push({ role: "system", content: systemContent });

          if (turnInput.transcript && Array.isArray(turnInput.transcript)) {
            for (const t of turnInput.transcript) {
              if (t.text) {
                messages.push({
                  role: t.role === "assistant" ? "assistant" : "user",
                  content: t.text,
                });
              }
            }
          }
          messages.push({ role: "user", content: turnInput.text });

          void (async () => {
            try {
              let totalInput = 0;
              let totalOutput = 0;
              let finalReplyText = "";
              let stepCount = 0;
              const maxSteps = 8;

              // Tool loop
              while (stepCount < maxSteps) {
                stepCount++;
                const res = await fetch(`${OMNIROUTE_URL}/chat/completions`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OMNIROUTE_KEY}`,
                  },
                  body: JSON.stringify({
                    model,
                    messages,
                    tools: DESKTOP_TOOLS,
                    temperature: 0.5,
                  }),
                  signal: controller.signal,
                });

                if (!res.ok) {
                  const errText = await res.text().catch(() => "");
                  throw new Error(`OmniRoute error (HTTP ${res.status}): ${errText.slice(0, 200)}`);
                }

                const data = (await res.json()) as {
                  choices?: Array<{ message?: { content?: string; tool_calls?: unknown } }>;
                  usage?: { prompt_tokens?: number; completion_tokens?: number };
                };
                const choice = data.choices?.[0];
                const msg = choice?.message || {};
                const usage = data.usage;
                if (usage) {
                  totalInput += usage.prompt_tokens ?? 0;
                  totalOutput += usage.completion_tokens ?? 0;
                }

                const toolCalls = msg.tool_calls;
                const content = msg.content || "";

                if (toolCalls && Array.isArray(toolCalls) && toolCalls.length > 0) {
                  messages.push(msg);

                  for (const tc of toolCalls) {
                    const fnName = tc.function?.name || "unknown_tool";
                    let fnArgs: Record<string, any> = {};
                    try {
                      fnArgs = JSON.parse(tc.function?.arguments || "{}");
                    } catch {}

                    const toolItemId = tc.id || newEventId();
                    const actionLabel =
                      fnName === "desktop_url"
                        ? `Navigating to ${fnArgs.url || "URL"}`
                        : fnName === "desktop_click"
                        ? `Clicking at (${fnArgs.x}, ${fnArgs.y})`
                        : fnName === "desktop_type"
                        ? `Typing: ${fnArgs.text || ""}`
                        : fnName === "desktop_key"
                        ? `Key: ${fnArgs.key || ""}`
                        : fnName === "desktop_exec"
                        ? `Executing: ${fnArgs.command || ""}`
                        : fnName;

                    emit({
                      eventId: newEventId(),
                      provider: driverKind,
                      providerInstanceId: instanceId,
                      threadId,
                      turnId,
                      type: "item.started",
                      itemType: "tool",
                      itemId: toolItemId,
                      title: actionLabel,
                      createdAt: new Date().toISOString(),
                    } as unknown as RuntimeEvent);

                    // Execute tool against CUA Relay
                    const result = await executeDesktopAction(threadId, fnName, fnArgs);

                    emit({
                      eventId: newEventId(),
                      provider: driverKind,
                      providerInstanceId: instanceId,
                      threadId,
                      turnId,
                      type: "item.completed",
                      itemType: "tool",
                      itemId: toolItemId,
                      ok: result.ok !== false,
                      createdAt: new Date().toISOString(),
                    } as unknown as RuntimeEvent);

                    messages.push({
                      role: "tool",
                      tool_call_id: tc.id,
                      content: JSON.stringify(result),
                    });
                  }
                  // Continue loop to get next assistant reasoning / actions
                  continue;
                }

                // Check if model returned a bash or URL command in raw text e.g. xdg-open "https://..."
                const xdgMatch = content.match(/xdg-open\s+"?([^"\s]+)"?/i);
                if (xdgMatch && xdgMatch[1]) {
                  const url = xdgMatch[1];
                  const toolItemId = newEventId();
                  emit({
                    eventId: newEventId(),
                    provider: driverKind,
                    providerInstanceId: instanceId,
                    threadId,
                    turnId,
                    type: "item.started",
                    itemType: "tool",
                    itemId: toolItemId,
                    title: `Navigating to ${url}`,
                    createdAt: new Date().toISOString(),
                  } as unknown as RuntimeEvent);

                  const result = await executeDesktopAction(threadId, "url", { url });
                  emit({
                    eventId: newEventId(),
                    provider: driverKind,
                    providerInstanceId: instanceId,
                    threadId,
                    turnId,
                    type: "item.completed",
                    itemType: "tool",
                    itemId: toolItemId,
                    ok: result.ok !== false,
                    createdAt: new Date().toISOString(),
                  } as unknown as RuntimeEvent);
                }

                // No more tool calls — final text response
                finalReplyText = content || (xdgMatch ? `Ich habe die Seite auf dem Desktop geöffnet.` : "Erledigt.");
                break;
              }

              if (finalReplyText) {
                emit({
                  eventId: newEventId(),
                  provider: driverKind,
                  providerInstanceId: instanceId,
                  threadId,
                  turnId,
                  type: "content.delta",
                  streamKind: "assistant_text",
                  delta: finalReplyText,
                  createdAt: new Date().toISOString(),
                } as unknown as RuntimeEvent);

                emit({
                  eventId: newEventId(),
                  provider: driverKind,
                  providerInstanceId: instanceId,
                  threadId,
                  turnId,
                  type: "item.completed",
                  itemType: "assistant_text",
                  text: finalReplyText,
                  createdAt: new Date().toISOString(),
                } as unknown as RuntimeEvent);
              }

              emit({
                eventId: newEventId(),
                provider: driverKind,
                providerInstanceId: instanceId,
                threadId,
                turnId,
                type: "turn.completed",
                ok: true,
                stopReason: "end_turn",
                cost: 0,
                usage: {
                  input: totalInput,
                  output: totalOutput,
                },
                createdAt: new Date().toISOString(),
              } as unknown as RuntimeEvent);
            } catch (err: any) {
              const message = err.name === "AbortError" ? "Turn interrupted by user" : err.message;
              emit({
                eventId: newEventId(),
                provider: driverKind,
                providerInstanceId: instanceId,
                threadId,
                turnId,
                type: "runtime.error",
                message,
                createdAt: new Date().toISOString(),
              } as unknown as RuntimeEvent);

              emit({
                eventId: newEventId(),
                provider: driverKind,
                providerInstanceId: instanceId,
                threadId,
                turnId,
                type: "turn.completed",
                ok: false,
                stopReason: "error",
                createdAt: new Date().toISOString(),
              } as unknown as RuntimeEvent);
            } finally {
              activeTurns.delete(threadId);
            }
          })();

          return { turnId };
        },

        respondToRequest: async () => "unavailable" as const,
        hasSession: () => activeTurns.size > 0,
        stopAll: async () => {
          for (const { abort } of activeTurns.values()) abort();
          activeTurns.clear();
        },

        async interruptTurn(threadId: string) {
          const t = activeTurns.get(threadId);
          if (t) {
            t.abort();
            activeTurns.delete(threadId);
          }
        },

        async dispose() {
          for (const { abort } of activeTurns.values()) abort();
          activeTurns.clear();
          listeners.clear();
        },
      };

      return {
        instanceId,
        driverKind,
        displayName: input.displayName ?? displayName,
        enabled: input.enabled ?? true,
        models: catalog,
        adapter,
        snapshot: () => adapter.snapshot(),
        dispose: () => adapter.dispose(),
      };
    },
  };
}
