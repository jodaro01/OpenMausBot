// Cline Autonomous Task Runner driver
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
} from "../../contracts.ts";
import { newEventId } from "../../contracts.ts";

const DRIVER_KIND = "clineAgent";

const MODELS: ModelCatalog = {
  default: "cline-sonnet-3-7",
  options: [
    { id: "cline-sonnet-3-7", label: "Cline · Claude 3.7 Sonnet" },
    { id: "cline-gpt-4o", label: "Cline · GPT-4o Autonomous" },
    { id: "cline-deepseek-r1", label: "Cline · DeepSeek R1 Reasoning" },
  ],
};

export const ClineAgentDriver: AnyProviderDriver = {
  driverKind: DRIVER_KIND,
  metadata: { displayName: "Cline Autonomous", supportsMultipleInstances: true, access: "subscription" },
  decodeConfig(raw: unknown): any {
    return raw && typeof raw === "object" ? raw : {};
  },
  defaultConfig(): any {
    return {};
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
        return { state: "available", version: "Cline v0.1.3 (Autonomous Engine)", authenticated: true, billing: "subscription" };
      },
      async sendTurn(turnInput: SendTurnInput): Promise<TurnStartResult> {
        const turnId = `cl-${newEventId()}`;
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
          text: `[Cline Autonomous · ${model}] Autonomous multi-step software engineering completed.\n\nOutput for: "${turnInput.text}"`,
        } as unknown as RuntimeEvent);

        emit({
          eventId: newEventId(),
          provider: DRIVER_KIND,
          threadId,
          turnId,
          type: "turn.completed",
          stopReason: "end_turn",
          usage: { inputTokens: 150, outputTokens: 95 },
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
      displayName: input.displayName ?? "Cline Autonomous",
      enabled: input.enabled ?? true,
      models: MODELS,
      adapter,
      snapshot: () => adapter.snapshot(),
      dispose: () => adapter.dispose(),
    };
  },
};
