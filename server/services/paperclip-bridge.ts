// Paperclip live background bridge — Ultra-Fast Real-Time Bi-Directional Sync Daemon
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { DATA_DIR } from "../config.ts";
import type { EventBus } from "../harness/bus.ts";
import { newEventId, type RuntimeEvent } from "../contracts.ts";

type AgentMeta = {
  id: string;
  name: string;
  role: string;
  title: string;
  reportsTo: string | null;
  botId: string | null;
  threadId: string | null;
  section: string | null;
};

type Division = {
  botName: string;
  dmAgentId: string;
  threadId: string | null;
  specialists: Map<string, string>;
};

export function startPaperclipBridge(bus: EventBus) {
  const base = (process.env.PAPERCLIP_API_URL || "http://127.0.0.1:3100").replace(/\/+$/, "");
  const key = process.env.PAPERCLIP_API_KEY || "pcp_board_6fd4a2d936105ea200485b4fe0343b599bdc77281c78ce3f";
  let companyId = process.env.PAPERCLIP_COMPANY_ID || "";

  const divisions = new Map<string, Division>();
  const agentById = new Map<string, AgentMeta>();
  const agentByName = new Map<string, AgentMeta>();
  const groupThreadByBotId = new Map<string, string>();
  const groupThreadBySection = new Map<string, string>();
  const threadToAgentId = new Map<string, string>();
  let groupRecords: any[] = [];
  const seenComments = new Set<string>();
  const seenIssues = new Set<string>();
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let routineTimer: ReturnType<typeof setInterval> | null = null;
  let isPolling = false;
  let pollErrors = 0;

  const api = async (path: string, init?: RequestInit) => {
    const r = await fetch(base + path, {
      ...init,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        ...((init?.headers as Record<string, string>) ?? {}),
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) throw new Error(`${path} -> HTTP ${r.status}`);
    const text = await r.text();
    return text ? JSON.parse(text) : null;
  };

  const publishText = (threadId: string, text: string) => {
    const turnId = `pc-${newEventId()}`;
    bus.publish({
      type: "item.completed",
      threadId,
      turnId,
      itemType: "assistant_text",
      text,
    });
    bus.publish({
      type: "turn.completed",
      threadId,
      turnId,
    });
  };

  const bootstrap = async () => {
    try {
      if (!companyId) {
        const companies = await api("/api/companies");
        const list = Array.isArray(companies) ? companies : (companies?.companies ?? []);
        const s2 = list.find((c: any) => c.name?.includes("S2") || c.name?.includes("Back Office")) || list[0];
        if (s2?.id) companyId = s2.id;
        else return;
      }

      const agentsResp = await api(`/api/companies/${companyId}/agents`);
      const agents: any[] = Array.isArray(agentsResp)
        ? agentsResp
        : (agentsResp?.agents ?? agentsResp?.items ?? []);

      const botsFile = join(DATA_DIR, "bots.json");
      const groupsFile = join(DATA_DIR, "groups.json");
      let diskBots: any[] = [];
      if (existsSync(botsFile)) {
        try {
          const parsed = JSON.parse(readFileSync(botsFile, "utf8"));
          diskBots = Array.isArray(parsed) ? parsed : (parsed.bots || []);
        } catch {}
      }

      const botByAgentId = new Map<string, any>();
      const botByName = new Map<string, any>();
      for (const b of diskBots) {
        if (b.description?.includes(b.name)) botByName.set(b.name, b);
        botByName.set(b.name, b);
      }

      if (existsSync(groupsFile)) {
        try {
          groupRecords = JSON.parse(readFileSync(groupsFile, "utf8"));
        } catch {}
        for (const g of groupRecords) {
          for (const mid of g.memberIds) {
            groupThreadByBotId.set(mid, g.threadId);
          }
          if (g.name) {
            const cleanSec = g.name.replace(/ team room$/i, "").trim();
            groupThreadBySection.set(cleanSec, g.threadId);
          }
        }
      }

      agentById.clear();
      agentByName.clear();
      divisions.clear();
      threadToAgentId.clear();

      for (const a of agents) {
        const matchBot = botByAgentId.get(a.id) || botByName.get(a.name);
        const meta: AgentMeta = {
          id: a.id,
          name: a.name,
          role: a.role ?? "specialist",
          title: a.title ?? a.name,
          reportsTo: a.reportsTo ?? null,
          botId: matchBot?.id ?? null,
          threadId: matchBot?.threadId ?? null,
          section: matchBot?.section ?? null,
        };
        agentById.set(a.id, meta);
        agentByName.set(a.name, meta);
        if (meta.threadId) {
          threadToAgentId.set(meta.threadId, a.id);
          divisions.set(a.id, {
            botName: a.name,
            dmAgentId: a.id,
            threadId: meta.threadId,
            specialists: new Map(),
          });
        }
      }

      for (const a of agents) {
        for (const d of divisions.values()) {
          if (a.reportsTo === d.dmAgentId) d.specialists.set(a.id, a.name);
        }
      }

      console.log(
        `[paperclip-bridge] bootstrap ok: ${agents.length} agents mapped, ${divisions.size} agent threads, ${groupRecords.length} group rooms ready`,
      );
    } catch (e: any) {
      console.error("[paperclip-bridge] bootstrap error:", e?.message ?? e);
    }
  };

  const divisionOfAgent = (agentId: string): Division | null => {
    if (divisions.has(agentId)) return divisions.get(agentId)!;
    for (const d of divisions.values()) if (d.specialists.has(agentId)) return d;
    return null;
  };

  /** Ultra-fast real-time issue and cross-talk stream (runs every 500ms) */
  const pollActivity = async () => {
    if (!companyId || isPolling) return;
    if (agentById.size === 0) {
      await bootstrap();
    }
    isPolling = true;
    try {
      const issuesResp = await api(`/api/companies/${companyId}/issues?limit=50`);
      const issues: any[] = Array.isArray(issuesResp)
        ? issuesResp
        : (issuesResp?.issues ?? issuesResp?.items ?? []);

      for (const it of issues) {
        if (!it?.id) continue;
        const assigneeMeta = it.assigneeAgentId ? agentById.get(it.assigneeAgentId) : null;
        const creatorMeta = it.createdByAgentId ? agentById.get(it.createdByAgentId) : null;
        const div = it.assigneeAgentId ? divisionOfAgent(it.assigneeAgentId) : null;
        const groupThread = (assigneeMeta?.botId && groupThreadByBotId.get(assigneeMeta.botId)) ||
                            (assigneeMeta?.section && groupThreadBySection.get(assigneeMeta.section)) || null;

        if (!seenIssues.has(it.id)) {
          seenIssues.add(it.id);
          const badge = `📋 Issue ${it.identifier ?? it.id.slice(0, 8)} [${it.status ?? "open"}] — ${it.title ?? ""}`;
          if (assigneeMeta?.threadId) publishText(assigneeMeta.threadId, badge);
          if (creatorMeta?.threadId && creatorMeta.threadId !== assigneeMeta?.threadId) {
            publishText(creatorMeta.threadId, badge);
          }
          if (div?.threadId && div.threadId !== assigneeMeta?.threadId && div.threadId !== creatorMeta?.threadId) {
            publishText(div.threadId, badge);
          }
          if (groupThread && groupThread !== assigneeMeta?.threadId && groupThread !== div?.threadId) {
            publishText(groupThread, badge);
          }
          continue;
        }

        // Fetch new comments on this issue
        try {
          const det = await api(`/api/issues/${it.id}/comments`);
          const comments: any[] = Array.isArray(det)
            ? det
            : (det?.comments ?? det?.items ?? []);

          for (const c of comments) {
            const cid = String(c.id ?? c.createdAt ?? "");
            if (!cid || seenComments.has(cid)) continue;
            seenComments.add(cid);

            const authorMeta = c.authorAgentId ? agentById.get(c.authorAgentId) : null;
            const authorName = authorMeta?.name ?? c.authorName ?? "Board";
            const targetName = assigneeMeta?.name ?? "Team";
            const rawBody = String(c.body ?? c.text ?? c.content ?? "").slice(0, 1000);
            if (!rawBody) continue;

            const broadcastText = `💬 [${authorName}${targetName !== authorName ? ` → ${targetName}` : ""}] ${rawBody}`;

            if (assigneeMeta?.threadId) publishText(assigneeMeta.threadId, broadcastText);
            if (authorMeta?.threadId && authorMeta.threadId !== assigneeMeta?.threadId) {
              publishText(authorMeta.threadId, broadcastText);
            }
            if (div?.threadId && div.threadId !== assigneeMeta?.threadId && div.threadId !== authorMeta?.threadId) {
              publishText(div.threadId, broadcastText);
            }
            if (groupThread && groupThread !== assigneeMeta?.threadId && groupThread !== div?.threadId) {
              publishText(groupThread, broadcastText);
            }
          }
        } catch {
          /* skip */
        }
      }
    } catch (e: any) {
      pollErrors++;
      if (pollErrors % 30 === 1) {
        console.error(`[paperclip-bridge] poll error (${pollErrors}x):`, e?.message ?? e);
      }
    } finally {
      isPolling = false;
    }
  };

  /** Bi-directional Routine & Automation Synchronization (runs every 3s) */
  const syncRoutines = async () => {
    if (!companyId) return;
    try {
      const routinesResp = await api(`/api/companies/${companyId}/routines`);
      const pRoutines: any[] = Array.isArray(routinesResp)
        ? routinesResp
        : (routinesResp?.routines ?? routinesResp?.items ?? []);

      const routinesFile = join(DATA_DIR, "routines.json");
      let diskRoutines: any[] = [];
      let diskRuns: any[] = [];
      if (existsSync(routinesFile)) {
        try {
          const parsed = JSON.parse(readFileSync(routinesFile, "utf8"));
          diskRoutines = Array.isArray(parsed.routines) ? parsed.routines : [];
          diskRuns = Array.isArray(parsed.runs) ? parsed.runs : [];
        } catch {}
      }

      let updated = false;

      for (const pr of pRoutines) {
        if (!pr?.id) continue;
        const assignedMeta = pr.assigneeAgentId ? agentById.get(pr.assigneeAgentId) : null;
        const botId = assignedMeta?.botId || "52377432-d9d9-42bb-867e-c163e703f45c";
        const trigger = pr.triggers?.[0];
        const cron = trigger?.cronExpression || "0 8 * * *";
        const enabled = pr.status === "active" || trigger?.enabled === true;

        const matchIdx = diskRoutines.findIndex((r) => r.id === pr.id || r.name === pr.title);
        const schedule = { type: "daily", time: "08:00", weekdays: [0, 1, 2, 3, 4, 5, 6] };
        if (cron.startsWith("0 9 * * 1")) {
          schedule.time = "09:00";
          schedule.weekdays = [1];
        }

        const routineRecord = {
          id: pr.id,
          name: pr.title || "Paperclip Automation",
          prompt: pr.description || "Run scheduled Paperclip routine",
          botId,
          runOn: "cloud",
          enabled,
          schedule,
          durationMinutes: 30,
          nextRunAt: Date.now() + 3600000,
          createdAt: pr.createdAt ? new Date(pr.createdAt).getTime() : Date.now(),
          updatedAt: Date.now(),
        };

        if (matchIdx >= 0) {
          diskRoutines[matchIdx] = { ...diskRoutines[matchIdx], ...routineRecord };
        } else {
          diskRoutines.push(routineRecord);
        }
        updated = true;
      }

      if (updated) {
        writeFileSync(routinesFile, JSON.stringify({ routines: diskRoutines, runs: diskRuns }, null, 2));
      }
    } catch (e: any) {
      /* skip */
    }
  };

  setTimeout(() => {
    bootstrap().then(() => {
      pollActivity();
      syncRoutines();
    });
  }, 500);

  // High-Frequency Real-Time Sync (500ms cycle)
  pollTimer = setInterval(pollActivity, 500);
  routineTimer = setInterval(syncRoutines, 3_000);

  return {
    stop() {
      if (pollTimer) clearInterval(pollTimer);
      if (routineTimer) clearInterval(routineTimer);
    },
  };
}
