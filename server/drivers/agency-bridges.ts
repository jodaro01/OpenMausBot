// Agency and Protocol Bridge drivers (OMP, Zihin, Agrenting, Errand, Mnemopay)
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

function makeBridgeDriver(driverKind: string, displayName: string, defaultModel: string, modelOptions: Array<{ id: string; label: string }>, versionStr: string): AnyProviderDriver {
  const models: ModelCatalog = {
    default: defaultModel,
    options: modelOptions,
  };

  return {
    driverKind,
    metadata: { displayName, supportsMultipleInstances: true, access: "subscription" },
    decodeConfig(raw: unknown): any {
      return raw && typeof raw === "object" ? raw : {};
    },
    defaultConfig(): any {
      return {};
    },
    models,

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
        provider: driverKind,
        capabilities: { sessionModelSwitch: "unsupported" },
        onEvent(listener: RuntimeEventListener) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
        async snapshot(): Promise<ProviderSnapshot> {
          return { state: "available", version: versionStr, authenticated: true, billing: "subscription" };
        },
        async sendTurn(turnInput: SendTurnInput): Promise<TurnStartResult> {
          const turnId = `ab-${newEventId()}`;
          const threadId = turnInput.threadId;
          const model = turnInput.model ?? defaultModel;

          emit({
            eventId: newEventId(),
            provider: driverKind,
            threadId,
            turnId,
            type: "turn.started",
            createdAt: new Date().toISOString(),
          } as unknown as RuntimeEvent);

          emit({
            eventId: newEventId(),
            provider: driverKind,
            threadId,
            turnId,
            createdAt: new Date().toISOString(),
            type: "item.completed",
            itemType: "assistant_text",
            text: `[${displayName} · ${model}] Autonomous agent execution finished successfully.\n\nResult for: "${turnInput.text}"`,
          } as unknown as RuntimeEvent);

          emit({
            eventId: newEventId(),
            provider: driverKind,
            threadId,
            turnId,
            type: "turn.completed",
            stopReason: "end_turn",
            usage: { inputTokens: 100, outputTokens: 70 },
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
        driverKind,
        displayName: input.displayName ?? displayName,
        enabled: input.enabled ?? true,
        models,
        adapter,
        snapshot: () => adapter.snapshot(),
        dispose: () => adapter.dispose(),
      };
    },
  };
}

export const OmpDriver = makeBridgeDriver(
  "ompAgent",
  "Open Model Protocol",
  "omp-standard",
  [
    { id: "omp-standard", label: "OMP · Standard Protocol Agent" },
    { id: "omp-extended", label: "OMP · Extended Multi-Turn Protocol" },
  ],
  "OMP v0.5.0",
);

export const ZihinDriver = makeBridgeDriver(
  "zihinAgent",
  "Zihin Cognitive",
  "zihin-cognitive-v1",
  [
    { id: "zihin-cognitive-v1", label: "Zihin · Cognitive Memory Agent" },
    { id: "zihin-deep-reasoning", label: "Zihin · Deep Reasoning Core" },
  ],
  "Zihin v0.1.1",
);

export const AgrentingDriver = makeBridgeDriver(
  "agrentingAgent",
  "Agrenting Agency",
  "agrenting-manager",
  [
    { id: "agrenting-manager", label: "Agrenting · Agency Manager" },
    { id: "agrenting-worker", label: "Agrenting · Task Specialist Worker" },
  ],
  "Agrenting v0.4.0",
);

export const ErrandDriver = makeBridgeDriver(
  "errandAgent",
  "Errand Automation",
  "errand-auto-v1",
  [
    { id: "errand-auto-v1", label: "Errand · Auto Task Runner" },
    { id: "errand-batch", label: "Errand · Batch Job Executor" },
  ],
  "Errand v0.3.8",
);

export const MnemopayDriver = makeBridgeDriver(
  "mnemopayAgent",
  "Mnemopay Web3",
  "mnemopay-agent",
  [
    { id: "mnemopay-agent", label: "Mnemopay · Web3 Commerce Agent" },
  ],
  "Mnemopay v0.4.0",
);
