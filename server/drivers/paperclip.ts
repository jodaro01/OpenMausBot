// Paperclip mirror driver — turns an OMB mirror bot chat into a delegated
// Paperclip issue and streams the assigned agent's comments back as
// assistant_text events. Rebuilt after a git pull wiped the original.
import { readFileSync, existsSync } from "node:fs";
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
import { newEventId, newId } from "../contracts.ts";

const DRIVER_KIND = "paperclip";

const BASE = (process.env.PAPERCLIP_API_URL || "http://127.0.0.1:3100").replace(/\/+$/, "");
const KEY = process.env.PAPERCLIP_API_KEY || "pcp_board_6fd4a2d936105ea200485b4fe0343b599bdc77281c78ce3f";
const BOTS_FILE = "/root/.openmausbot/bots.json";

const MODELS: ModelCatalog = {
  default: "paperclip-agent",
  options: [{ id: "paperclip-agent", label: "Paperclip · zugewiesener Agent" }],
};

async function api(path: string, init?: RequestInit): Promise<any> {
  const r = await fetch(BASE + path, {
    ...init,
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      ...((init?.headers as Record<string, string>) ?? {}),
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!r.ok) throw new Error(`${path} -> HTTP ${r.status}`);
  const text = await r.text();
  return text ? JSON.parse(text) : null;
}

function botNameForThread(threadId: string): string | null {
  try {
    if (!existsSync(BOTS_FILE)) return null;
    const raw = JSON.parse(readFileSync(BOTS_FILE, "utf8"));
    const bots: any[] = Array.isArray(raw) ? raw : (raw.bots ?? []);
    const b = bots.find((x) => x.threadId === threadId);
    return b?.name ?? null;
  } catch {
    return null;
  }
}

let cachedCompanyId = "";
async function resolveCompanyId(): Promise<string> {
  if (process.env.PAPERCLIP_COMPANY_ID) return process.env.PAPERCLIP_COMPANY_ID;
  if (cachedCompanyId) return cachedCompanyId;
  try {
    const companies: any = await api("/api/companies");
    const list: any[] = Array.isArray(companies) ? companies : (companies?.companies ?? []);
    cachedCompanyId = list[0]?.id ?? "";
  } catch {
    cachedCompanyId = "";
  }
  return cachedCompanyId;
}

/** Finds the ACTIVE agent (idle/…) for a bot name — old terminated
 * duplicates from earlier imports must never swallow the delegation. */
async function findAgentByName(name: string): Promise<{ id: string } | null> {
  const companyId = await resolveCompanyId();
  if (!companyId) return null;
  const resp = await api(`/api/companies/${companyId}/agents`);
  const agents: any[] = Array.isArray(resp) ? resp : (resp?.agents ?? []);
  const active = agents.filter((a) => a.name === name && a.status !== "terminated");
  active.sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")));
  return active[0] ? { id: active[0].id } : null;
}

export const PaperclipDriver: AnyProviderDriver = {
  driverKind: DRIVER_KIND,
  metadata: { displayName: "Paperclip Division", supportsMultipleInstances: false, access: "custom" },
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
    const active = new Map<string, { turnId: string; stopped: boolean }>();

    const emit = (e: RuntimeEvent) => {
      for (const l of [...listeners]) l(e);
    };
    const ev = (threadId: string, turnId: string) => ({
      eventId: newEventId(),
      provider: DRIVER_KIND,
      threadId,
      turnId,
      createdAt: new Date().toISOString(),
    });

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
        try {
          await api(`/api/health`);
          return { state: "available", version: "Paperclip Mirror v2", authenticated: true };
        } catch {
          return { state: "unavailable", reason: "Paperclip API nicht erreichbar" };
        }
      },

      async sendTurn(turn: SendTurnInput): Promise<TurnStartResult> {
        const { threadId } = turn;
        if (active.has(threadId)) throw new Error("a turn is already running on this thread");
        const turnId = `pc-${newId().slice(0, 8)}`;
        active.set(threadId, { turnId, stopped: false });

        emit({ ...ev(threadId, turnId), type: "turn.started" } as unknown as RuntimeEvent);

        (async () => {
          try {
            const botName = botNameForThread(threadId);
            if (!botName) throw new Error("Kein Bot für diesen Thread gefunden (bots.json)");
            const agent = await findAgentByName(botName);
            if (!agent) throw new Error(`Kein aktiver Paperclip-Agent '${botName}'`);

            const issue = await api(`/api/companies/${await resolveCompanyId()}/issues`, {
              method: "POST",
              body: JSON.stringify({
                title: turn.text.slice(0, 120) || "OMB-Delegation",
                description: turn.text,
                assigneeAgentId: agent.id,
                priority: "high",
              }),
            });

            emit({
              ...ev(threadId, turnId),
              type: "item.completed",
              itemType: "assistant_text",
              text: `📋 An ${botName} delegiert — Issue ${issue.identifier} erstellt. Die Antwort des Agenten erscheint hier, sobald er sie im Issue schreibt.`,
            } as unknown as RuntimeEvent);

            // Sofortigen Agenten-Start anstossen (wartet nicht auf den Heartbeat-Takt).
            try {
              await api(`/api/agents/${agent.id}/wakeup`, {
                method: "POST",
                body: JSON.stringify({ reason: "omb-delegation" }),
              });
            } catch {
              /* Wakeup ist Best-Effort — der Heartbeat holt das Issue ohnehin. */
            }

            // Poll the issue for the agent's comments and completion.
            const seen = new Set<string>();
            const deadline = Date.now() + 30 * 60 * 1000; // 30 min cap
            while (Date.now() < deadline) {
              await new Promise((r) => setTimeout(r, 5000));
              if (active.get(threadId)?.stopped) break;

              let detail: any;
              try {
                detail = await api(`/api/issues/${issue.id}`);
              } catch {
                continue;
              }
              let comments: any[] = [];
              try {
                const c = await api(`/api/issues/${issue.id}/comments`);
                comments = Array.isArray(c) ? c : (c?.comments ?? []);
              } catch {
                /* comments endpoint optional */
              }
              for (const c of comments) {
                const cid = String(c.id ?? c.createdAt ?? "");
                if (!cid || seen.has(cid)) continue;
                // Only the assigned agent's own words come back as bot text.
                if (c.authorAgentId && c.authorAgentId === agent.id) {
                  seen.add(cid);
                  emit({
                    ...ev(threadId, turnId),
                    type: "item.completed",
                    itemType: "assistant_text",
                    text: String(c.body ?? c.text ?? ""),
                  } as unknown as RuntimeEvent);
                }
              }
              const status = String(detail?.status ?? "");
              if (["done", "cancelled", "blocked"].includes(status)) {
                if (status === "blocked" && detail?.blockedReason) {
                  emit({
                    ...ev(threadId, turnId),
                    type: "item.completed",
                    itemType: "assistant_text",
                    text: `⚠️ Issue ${issue.identifier} ist blockiert: ${detail.blockedReason}`,
                  } as unknown as RuntimeEvent);
                }
                break;
              }
            }

            emit({
              ...ev(threadId, turnId),
              type: "turn.completed",
              stopReason: "end_turn",
              usage: { inputTokens: 0, outputTokens: 0 },
            } as unknown as RuntimeEvent);
          } catch (e: any) {
            emit({
              ...ev(threadId, turnId),
              type: "item.completed",
              itemType: "assistant_text",
              text: `❌ Paperclip-Delegation fehlgeschlagen: ${e?.message ?? e}`,
            } as unknown as RuntimeEvent);
            emit({
              ...ev(threadId, turnId),
              type: "turn.completed",
              stopReason: "error",
              usage: { inputTokens: 0, outputTokens: 0 },
            } as unknown as RuntimeEvent);
          } finally {
            active.delete(threadId);
          }
        })();

        return { turnId };
      },

      async interruptTurn(threadId: string) {
        const t = active.get(threadId);
        if (t) t.stopped = true;
      },
      async respondToRequest(): Promise<"unavailable"> {
        return "unavailable";
      },
      hasSession(threadId: string) {
        return active.has(threadId);
      },
      async stopAll() {
        for (const t of active.values()) t.stopped = true;
      },
      async dispose() {
        listeners.clear();
      },
    };

    return {
      instanceId,
      driverKind: DRIVER_KIND,
      displayName: input.displayName ?? "Paperclip Division",
      enabled: input.enabled ?? true,
      models: MODELS,
      adapter,
      snapshot: () => adapter.snapshot(),
      dispose: () => adapter.dispose(),
    };
  },
};
