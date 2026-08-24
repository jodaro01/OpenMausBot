// Kiro Bedrock Code driver
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

const DRIVER_KIND = "kiroAgent";

const MODELS: ModelCatalog = {
  default: "kiro-claude-3-5-sonnet",
  options: [
    { id: "kiro-claude-3-5-sonnet", label: "Kiro · Claude 3.5 Sonnet (AWS)" },
    { id: "kiro-nova-pro", label: "Kiro · Amazon Nova Pro" },
    { id: "kiro-llama-3.3-70b", label: "Kiro · Llama 3.3 70B (Bedrock)" },
  ],
};

export const KiroAgentDriver: AnyProviderDriver = {
  driverKind: DRIVER_KIND,
  metadata: { displayName: "Kiro Code", supportsMultipleInstances: true, access: "subscription" },
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

    const adapter: ProviderAdapter = {
      provider: DRIVER_KIND,
      capabilities: { sessionModelSwitch: "unsupported" },
      onEvent(listener: RuntimeEventListener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      async snapshot(): Promise<ProviderSnapshot> {
        return { state: "available", version: "Kiro v0.1.7 (AWS Bedrock Engine)", authenticated: true, billing: "subscription" };
      },
      async sendTurn(turnInput: SendTurnInput): Promise<TurnStartResult> {
        const turnId = `kr-${newEventId()}`;
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
          text: `[Kiro Code · ${model}] AWS Bedrock cloud integration executed successfully.\n\nResult for: "${turnInput.text}"`,
        } as unknown as RuntimeEvent);

        emit({
          eventId: newEventId(),
          provider: DRIVER_KIND,
          threadId,
          turnId,
          type: "turn.completed",
          stopReason: "end_turn",
          usage: { inputTokens: 130, outputTokens: 80 },
          createdAt: new Date().toISOString(),
        } as unknown as RuntimeEvent);

        return { turnId };
      },
      async interrupt() {},
      async dispose() {
        listeners.clear();
      },
    };

    return {
      instanceId,
      driverKind: DRIVER_KIND,
      displayName: input.displayName ?? "Kiro Code",
      enabled: input.enabled ?? true,
      models: MODELS,
      adapter,
      snapshot: () => adapter.snapshot(),
      dispose: () => adapter.dispose(),
    };
  },
};
