import { promises as fs } from "fs";
import path from "path";
import { supabase, supabaseConfig } from "@/lib/supabase-client";
import { committees } from "@/data/committees";

const DATA_DIR = path.join(process.cwd(), "data");
const SCORECARD_FILE = path.join(DATA_DIR, "scorecard.json");
const SCORECARD_ROW_ID = 999999;

export type ScorecardVisibility = "private" | "day1_published" | "final_published";

export interface ScoreColumn {
  id: string;
  label: string;
}

export interface DelegateScoreRecord {
  day1: Record<string, string>;
  day2: Record<string, string>;
  remarks?: string;
  award?: string;
  updatedAt?: string;
}

export interface CommitteeScoreSheet {
  committeeId: string;
  day1Columns: ScoreColumn[];
  day2Columns: ScoreColumn[];
  scores: Record<string, DelegateScoreRecord>;
  updatedAt: string;
}

export interface AttendanceRecord {
  day1: boolean;
  day2: boolean;
  day1Time?: string;
  day2Time?: string;
}

export interface ScorecardSystemState {
  visibility: ScorecardVisibility;
  passcodes: Record<string, string>;
  attendance: Record<string, AttendanceRecord>;
  committees: Record<string, CommitteeScoreSheet>;
  updatedAt: string;
}

export const DEFAULT_COMMITTEE_PASSCODES: Record<string, string> = {
  ipl: "ATH-IPL-8821",
  "lok-sabha": "ATH-LS-4910",
  jpc: "ATH-JPC-7304",
  unsc: "ATH-UNSC-6192",
  unw: "ATH-UNW-3587",
  ip: "ATH-IP-9426",
};

export const ADMIN_MASTER_PASSWORD = "athena-portal";

function createDefaultColumns(): ScoreColumn[] {
  return [
    { id: "col-1", label: "Criteria 1" },
    { id: "col-2", label: "Criteria 2" },
    { id: "col-3", label: "Criteria 3" },
    { id: "col-4", label: "Criteria 4" },
    { id: "col-5", label: "Criteria 5" },
  ];
}

export function createDefaultScorecardState(): ScorecardSystemState {
  const commMap: Record<string, CommitteeScoreSheet> = {};
  for (const c of committees) {
    commMap[c.id] = {
      committeeId: c.id,
      day1Columns: createDefaultColumns(),
      day2Columns: createDefaultColumns(),
      scores: {},
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    visibility: "private",
    passcodes: { ...DEFAULT_COMMITTEE_PASSCODES },
    attendance: {},
    committees: commMap,
    updatedAt: new Date().toISOString(),
  };
}

function normalizeState(raw: unknown): ScorecardSystemState {
  const def = createDefaultScorecardState();
  if (!raw || typeof raw !== "object") return def;
  const obj = raw as Partial<ScorecardSystemState>;

  const visibility: ScorecardVisibility =
    obj.visibility === "day1_published" || obj.visibility === "final_published"
      ? obj.visibility
      : "private";

  const passcodes: Record<string, string> = {
    ...DEFAULT_COMMITTEE_PASSCODES,
    ...(obj.passcodes && typeof obj.passcodes === "object" ? obj.passcodes : {}),
  };

  const attendance: Record<string, AttendanceRecord> =
    obj.attendance && typeof obj.attendance === "object" ? { ...obj.attendance } : {};

  const commMap: Record<string, CommitteeScoreSheet> = { ...def.committees };
  if (obj.committees && typeof obj.committees === "object") {
    for (const c of committees) {
      const existing = obj.committees[c.id];
      if (existing && typeof existing === "object") {
        commMap[c.id] = {
          committeeId: c.id,
          day1Columns:
            Array.isArray(existing.day1Columns) && existing.day1Columns.length > 0
              ? existing.day1Columns
              : createDefaultColumns(),
          day2Columns:
            Array.isArray(existing.day2Columns) && existing.day2Columns.length > 0
              ? existing.day2Columns
              : createDefaultColumns(),
          scores:
            existing.scores && typeof existing.scores === "object" ? existing.scores : {},
          updatedAt: existing.updatedAt || new Date().toISOString(),
        };
      }
    }
  }

  return {
    visibility,
    passcodes,
    attendance,
    committees: commMap,
    updatedAt: obj.updatedAt || new Date().toISOString(),
  };
}

async function readLocalScorecard(): Promise<ScorecardSystemState | null> {
  try {
    const raw = await fs.readFile(SCORECARD_FILE, "utf-8");
    return normalizeState(JSON.parse(raw));
  } catch {
    return null;
  }
}

async function writeLocalScorecard(state: ScorecardSystemState): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(SCORECARD_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch {
    // Ignore read-only filesystem on Vercel serverless
  }
}

export async function readScorecardState(): Promise<ScorecardSystemState> {
  if (supabaseConfig.enabled && supabase) {
    try {
      const client = supabase as unknown as {
        from: (table: string) => {
          select: (cols: string) => {
            eq: (col: string, val: unknown) => {
              single: () => Promise<{ data: Record<string, unknown> | null; error: unknown }>;
            };
          };
        };
      };

      const res = await client
        .from("registrations")
        .select("id, portfolio_preferences")
        .eq("id", SCORECARD_ROW_ID)
        .single();

      if (!res.error && res.data && res.data.portfolio_preferences) {
        const parsed =
          typeof res.data.portfolio_preferences === "string"
            ? JSON.parse(res.data.portfolio_preferences)
            : res.data.portfolio_preferences;
        const state = normalizeState(parsed);
        writeLocalScorecard(state).catch(() => {});
        return state;
      }
    } catch (err) {
      console.warn("Supabase scorecard read fallback:", err);
    }
  }

  const local = await readLocalScorecard();
  return local ?? createDefaultScorecardState();
}

export async function writeScorecardState(
  state: ScorecardSystemState
): Promise<ScorecardSystemState> {
  state.updatedAt = new Date().toISOString();
  await writeLocalScorecard(state);

  if (supabaseConfig.enabled && supabase) {
    try {
      const client = supabase as unknown as {
        from: (table: string) => {
          upsert: (
            rows: Array<Record<string, unknown>>,
            options: { onConflict: string; ignoreDuplicates: boolean }
          ) => Promise<{ error: unknown }>;
        };
      };

      const row: Record<string, unknown> = {
        id: SCORECARD_ROW_ID,
        event_slug: "scorecard-system",
        name: "__SCORECARD_SYSTEM_STATE__",
        phone: "0000000000",
        email: "scorecard-system@projectathena.site",
        class_year: "SYSTEM",
        institution: "Project Athena Secretariat",
        committee_preferences: ["", "", ""],
        portfolio_preferences: state,
        mun_experience: "SYSTEM",
        reference: "SYSTEM",
        payment_screenshot: null,
        is_unsc_registration: false,
        unsc_delegate: null,
        unsc_delegate_portfolio_preferences: null,
        created_at: state.updatedAt,
        status: "rejected",
        assigned_committee: null,
        assigned_portfolio: null,
        assigned_agenda: null,
      };

      const { error } = await client.from("registrations").upsert([row], {
        onConflict: "id",
        ignoreDuplicates: false,
      });

      if (error) {
        console.warn("Supabase writeScorecardState error:", error);
      }
    } catch (err) {
      console.warn("Supabase writeScorecardState exception:", err);
    }
  }

  return state;
}

export function calculateDayTotal(
  dayScores: Record<string, string> | undefined,
  columns: ScoreColumn[]
): number {
  if (!dayScores) return 0;
  let sum = 0;
  for (const col of columns) {
    const raw = String(dayScores[col.id] ?? "").trim();
    if (!raw) continue;
    const num = parseFloat(raw);
    if (!isNaN(num) && isFinite(num)) {
      sum += num;
    }
  }
  return Math.round(sum * 100) / 100;
}
