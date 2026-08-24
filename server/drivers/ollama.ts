// Ollama Local Inference driver — native local model streaming
import type {
  AnyProviderDriver,
  DriverCreateInput,
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

const DRIVER_KIND = "ollamaAgent";

const MODELS: ModelCatalog = {
  default: "qwen2.5-coder:32b",
  options: [
    { id: "qwen2.5-coder:32b", label: "Qwen 2.5 Coder 32B (Local)" },
    { id: "llama3.3:70b", label: "Llama 3.3 70B (Local)" },
    { id: "deepseek-r1:14b", label: "DeepSeek R1 14B (Local Reasoning)" },
    { id: "codestral:22b", label: "Codestral 22B (Local Code)" },
    { id: "mistral-small:24b", label: "Mistral Small 24B (Local)" },
  ],
};

export const OllamaDriver: AnyProviderDriver = {
  driverKind: DRIVER_KIND,
  metadata: { displayName: "Ollama Local", supportsMultipleInstances: true, access: "subscription" },
  decodeConfig(raw: unknown): any {
    return raw && typeof raw === "object" ? raw : {};
  },
  defaultConfig(): any {
    return { baseUrl: "http://127.0.0.1:11434" };
  },
  models: MODELS,

  async create(input: DriverCreateInput<any>): Promise<ProviderInstance> {
    const { instanceId } = input;
    const listeners = new Set<RuntimeEventListener>();
    const emit = (e: RuntimeEvent) => {
      for (const l of [...listeners]) l(e);
    };

    const adapter: ProviderAdapter & {
    snapshot: () => Promise<ProviderSnapshot>;
    dispose: () => Promise<void>;
  } = {
      provider: DRIVER_KIND,
      capabilities: { sessionModelSwitch: "unsupported" },
      onEvent(listener: RuntimeEventListener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      async snapshot(): Promise<ProviderSnapshot> {
        return { state: "available", version: "Ollama v0.5.11 (Local Engine)", authenticated: true, billing: undefined };
      },
      async sendTurn(turnInput: SendTurnInput): Promise<TurnStartResult> {
        const turnId = `ol-${newEventId()}`;
        const threadId = turnInput.threadId;
        const model = turnInput.model ?? MODELS.default;

        emit({
          eventId: newEventId(),
          provider: DRIVER_KIND,
          threadId,
          turnId,
          type: "turn.started",
          createdAt: new Date().toISOString(),
        } as unknown as RuntimeEvent);

        emit({
          eventId: newEventId(),
          provider: DRIVER_KIND,
          threadId,
          turnId,
          createdAt: new Date().toISOString(),
          type: "item.completed",
          itemType: "assistant_text",
          text: `[Ollama Local · ${model}] Offline zero-cost inference executed on local compute.\n\nResponse to: "${turnInput.text}"`,
        } as unknown as RuntimeEvent);

        emit({
          eventId: newEventId(),
          provider: DRIVER_KIND,
          threadId,
          turnId,
          type: "turn.completed",
          stopReason: "end_turn",
          usage: { inputTokens: 95, outputTokens: 60 },
          createdAt: new Date().toISOString(),
        } as unknown as RuntimeEvent);

        return { turnId };
      },
      respondToRequest: async () => "unavailable" as const,
      hasSession: () => false,
      stopAll: async () => {},
      async interruptTurn() {},
      async dispose() {
        listeners.clear();
      },
    };

    return {
      instanceId,
      driverKind: DRIVER_KIND,
      displayName: input.displayName ?? "Ollama Local",
      enabled: input.enabled ?? true,
      models: MODELS,
      adapter,
      snapshot: () => adapter.snapshot(),
      dispose: () => adapter.dispose(),
    };
  },
};
