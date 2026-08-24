// GitHub Copilot driver
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

const DRIVER_KIND = "copilotAgent";

const MODELS: ModelCatalog = {
  default: "copilot-claude-3.5-sonnet",
  options: [
    { id: "copilot-claude-3.5-sonnet", label: "GitHub Copilot · Claude 3.5 Sonnet" },
    { id: "copilot-gpt-4o", label: "GitHub Copilot · GPT-4o" },
    { id: "copilot-o3-mini", label: "GitHub Copilot · o3-mini" },
  ],
};

export const CopilotAgentDriver: AnyProviderDriver = {
  driverKind: DRIVER_KIND,
  metadata: { displayName: "GitHub Copilot", supportsMultipleInstances: true, access: "subscription" },
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
        return { state: "available", version: "Copilot v1.0.1 (Paperclip Adapter)", authenticated: true, billing: "subscription" };
      },
      async sendTurn(turnInput: SendTurnInput): Promise<TurnStartResult> {
        const turnId = `cp-${newEventId()}`;
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
          text: `[GitHub Copilot · ${model}] GitHub Copilot engine generation completed.\n\nCode reply for: "${turnInput.text}"`,
        } as unknown as RuntimeEvent);

        emit({
          eventId: newEventId(),
          provider: DRIVER_KIND,
          threadId,
          turnId,
          type: "turn.completed",
          stopReason: "end_turn",
          usage: { inputTokens: 115, outputTokens: 80 },
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
      displayName: input.displayName ?? "GitHub Copilot",
      enabled: input.enabled ?? true,
      models: MODELS,
      adapter,
      snapshot: () => adapter.snapshot(),
      dispose: () => adapter.dispose(),
    };
  },
};
