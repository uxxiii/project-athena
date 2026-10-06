import { promises as fs } from "fs";
import path from "path";
import type { Registration } from "@/lib/types";
import { supabase, supabaseConfig } from "@/lib/supabase-client";

const DATA_DIR = path.join(process.cwd(), "data");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json");

let cachedSupportsExtendedColumns: boolean | null = null;

function toThreeTuple(value: unknown): [string, string, string] {
  const arr = Array.isArray(value) ? value : [];
  return [String(arr[0] ?? ""), String(arr[1] ?? ""), String(arr[2] ?? "")] as [string, string, string];
}

function parseJsonIfNeeded(val: unknown): unknown {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
}

function normalizeRegistrationRow(row: Record<string, unknown>): Registration {
  const value = row ?? {};

  const rawCommPrefs = parseJsonIfNeeded(value.committeePreferences ?? value.committee_preferences);
  const committeePreferences: [string, string, string] = Array.isArray(rawCommPrefs)
    ? toThreeTuple(rawCommPrefs)
    : ["", "", ""];

  const rawPortPrefs = parseJsonIfNeeded(value.portfolioPreferences ?? value.portfolio_preferences);
  let meta: Record<string, unknown> | undefined;
  let portfolioPreferences: Record<string, [string, string, string]> = {};

  if (typeof rawPortPrefs === "object" && rawPortPrefs) {
    const obj = rawPortPrefs as Record<string, unknown>;
    if ("_meta" in obj && typeof obj._meta === "object" && obj._meta) {
      meta = obj._meta as Record<string, unknown>;
    }
    const cleanObj = { ...obj };
    delete cleanObj._meta;
    portfolioPreferences = Object.fromEntries(
      Object.entries(cleanObj).map(([key, pref]) => [
        key,
        toThreeTuple(parseJsonIfNeeded(pref)),
      ])
    );
  }

  const rawUnscPortPrefs = parseJsonIfNeeded(
    value.unscDelegatePortfolioPreferences ?? value.unsc_delegate_portfolio_preferences
  );
  const unscDelegatePortfolioPreferences = Array.isArray(rawUnscPortPrefs)
    ? toThreeTuple(rawUnscPortPrefs)
    : undefined;

  const rawUnscDelegate = parseJsonIfNeeded(value.unscDelegate ?? value.unsc_delegate);
  const unscDelegate =
    rawUnscDelegate && typeof rawUnscDelegate === "object"
      ? (rawUnscDelegate as Registration["unscDelegate"])
      : null;

  // Restore sequential formatted string ID (e.g. ATH-PICNIC-001) if preserved in _meta
  const restoredId = meta?.registrationCode
    ? String(meta.registrationCode)
    : String(value.id ?? "");

  const foodPreference =
    value.foodPreference !== undefined
      ? String(value.foodPreference)
      : value.food_preference !== undefined
        ? String(value.food_preference)
        : meta?.foodPreference !== undefined
          ? String(meta.foodPreference)
          : undefined;

  const notes =
    value.notes !== undefined
      ? String(value.notes)
      : value.notes_text !== undefined
        ? String(value.notes_text)
        : meta?.notes !== undefined
          ? String(meta.notes)
          : undefined;

  const rejectionReason =
    value.rejectionReason !== undefined
      ? String(value.rejectionReason)
      : value.rejection_reason !== undefined
        ? String(value.rejection_reason)
        : meta?.rejectionReason !== undefined
          ? String(meta.rejectionReason)
          : undefined;

  return {
    id: restoredId,
    eventSlug: String(value.eventSlug ?? value.event_slug ?? ""),
    name: String(value.name ?? ""),
    phone: String(value.phone ?? value.whatsapp ?? ""),
    email: String(value.email ?? ""),
    classYear: String(value.classYear ?? value.class_year ?? value.year ?? ""),
    institution: String(value.institution ?? ""),
    committeePreferences,
    portfolioPreferences,
    munExperience: String(value.munExperience ?? value.mun_experience ?? ""),
    reference: String(value.reference ?? ""),
    paymentScreenshot: value.paymentScreenshot
      ? String(value.paymentScreenshot)
      : value.payment_screenshot
        ? String(value.payment_screenshot)
        : undefined,
    isUnscRegistration: Boolean(
      value.isUnscRegistration ?? value.is_unsc_registration ?? false
    ),
    unscDelegate,
    unscDelegatePortfolioPreferences,
    createdAt: String(value.createdAt ?? value.created_at ?? new Date().toISOString()),
    status: (value.status as Registration["status"]) ?? "pending",
    assignedCommittee:
      value.assignedCommittee !== undefined
        ? String(value.assignedCommittee)
        : value.assigned_committee !== undefined
          ? String(value.assigned_committee)
          : undefined,
    assignedPortfolio:
      value.assignedPortfolio !== undefined
        ? String(value.assignedPortfolio)
        : value.assigned_portfolio !== undefined
          ? String(value.assigned_portfolio)
          : undefined,
    assignedAgenda:
      value.assignedAgenda !== undefined
        ? String(value.assignedAgenda)
        : value.assigned_agenda !== undefined
          ? String(value.assigned_agenda)
          : undefined,
    rejectionReason,
    foodPreference,
    notes,
  };
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readLocalRegistrations(): Promise<Registration[]> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(REGISTRATIONS_FILE, "utf-8");
    return JSON.parse(raw) as Registration[];
  } catch {
    return [];
  }
}

async function writeLocalRegistrations(registrations: Registration[]): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(
      REGISTRATIONS_FILE,
      JSON.stringify(registrations, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.warn("Local JSON store write skipped (read-only environment / Vercel serverless).", err);
  }
}

export async function readRegistrations(
  options: { includeScreenshots?: boolean } = {}
): Promise<Registration[]> {
  const includeScreenshots = options.includeScreenshots ?? false;

  if (supabaseConfig.enabled && supabase) {
    try {
      const client = supabase as {
        from: (table: string) => {
          select: (columns: string) => Promise<{ data: unknown[] | null; error: unknown }>;
        };
      };

      let data: unknown[] | null = null;
      let error: unknown = null;

      if (includeScreenshots) {
        // Fetch all columns including heavy base64 screenshots (used by admin payment verification)
        const res = await client.from("registrations").select("*");
        data = res.data;
        error = res.error;
      } else {
        // Exclude payment_screenshot to save 99%+ bandwidth on public routes & stats
        const extendedColumns =
          "id, event_slug, name, phone, email, class_year, institution, committee_preferences, portfolio_preferences, mun_experience, reference, is_unsc_registration, unsc_delegate, unsc_delegate_portfolio_preferences, created_at, status, assigned_committee, assigned_portfolio, assigned_agenda, rejection_reason, food_preference, notes";
        const basicColumns =
          "id, event_slug, name, phone, email, class_year, institution, committee_preferences, portfolio_preferences, mun_experience, reference, is_unsc_registration, unsc_delegate, unsc_delegate_portfolio_preferences, created_at, status, assigned_committee, assigned_portfolio, assigned_agenda";

        const res = await client
          .from("registrations")
          .select(cachedSupportsExtendedColumns !== false ? extendedColumns : basicColumns);

        if (res.error && cachedSupportsExtendedColumns !== false) {
          // Fallback to basic columns if extended columns are not present in table
          const retryRes = await client.from("registrations").select(basicColumns);
          data = retryRes.data;
          error = retryRes.error;
          if (!retryRes.error) {
            cachedSupportsExtendedColumns = false;
          }
        } else {
          data = res.data;
          error = res.error;
          if (!res.error && cachedSupportsExtendedColumns === null) {
            cachedSupportsExtendedColumns = true;
          }
        }
      }

      if (!error && Array.isArray(data)) {
        // Exclude fallback donation records
        const list = data
          .filter((row: unknown) => (row as Record<string, unknown>).event_slug !== "donation")
          .map((row) => normalizeRegistrationRow(row as Record<string, unknown>));

        // Sync to local JSON store only when full records (including screenshots) are fetched
        if (list.length > 0 && includeScreenshots) {
          writeLocalRegistrations(list).catch(() => {});
        }
        return list;
      }

      console.warn("Supabase read failed; falling back to local JSON store.", error);
    } catch (error) {
      console.warn("Supabase read error; falling back to local JSON store.", error);
    }
  }

  const local = await readLocalRegistrations();
  return local.filter((r) => r.eventSlug !== "donation");
}

function stringToNumericId(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

export function registrationIdToInteger(id: string | number): number {
  if (typeof id === "number" && Number.isInteger(id)) return id;
  const strId = String(id);
  const match = strId.match(/^ATH-(?:(PICNIC|SUMMIT)|[A-Z0-9]+)-(\d+)$/i);
  if (match) {
    const isPicnic = /picnic/i.test(match[1] || strId);
    const num = parseInt(match[2], 10);
    return isPicnic ? 200000 + num : 100000 + num;
  }
  if (/^\d+$/.test(strId)) {
    const n = Number(strId);
    if (!isNaN(n) && n > 0 && n < 2147483647) return n;
  }
  return (stringToNumericId(strId) % 1000000000) || 1;
}

function mapRegistrationToRow(
  registration: Registration,
  includeExtendedColumns = true
): Record<string, unknown> {
  const numericId = registrationIdToInteger(registration.id);

  const existingPrefs =
    registration.portfolioPreferences && typeof registration.portfolioPreferences === "object"
      ? { ...registration.portfolioPreferences }
      : {};

  // Store metadata inside portfolio_preferences._meta so it is ALWAYS preserved in PostgreSQL
  // even if specific columns (food_preference, notes, rejection_reason) do not exist yet
  const meta: Record<string, unknown> = {
    registrationCode: registration.id,
    ...(registration.foodPreference ? { foodPreference: registration.foodPreference } : {}),
    ...(registration.notes ? { notes: registration.notes } : {}),
    ...(registration.rejectionReason ? { rejectionReason: registration.rejectionReason } : {}),
  };

  const row: Record<string, unknown> = {
    id: numericId,
    event_slug: registration.eventSlug,
    name: registration.name,
    phone: registration.phone,
    email: registration.email,
    class_year: registration.classYear,
    institution: registration.institution,
    committee_preferences: registration.committeePreferences,
    portfolio_preferences: {
      ...existingPrefs,
      _meta: meta,
    },
    mun_experience: registration.munExperience,
    reference: registration.reference,
    payment_screenshot: registration.paymentScreenshot ?? null,
    is_unsc_registration: Boolean(registration.isUnscRegistration),
    unsc_delegate: registration.unscDelegate ?? null,
    unsc_delegate_portfolio_preferences: registration.unscDelegatePortfolioPreferences ?? null,
    created_at: registration.createdAt,
    status: registration.status,
    assigned_committee: registration.assignedCommittee ?? null,
    assigned_portfolio: registration.assignedPortfolio ?? null,
    assigned_agenda: registration.assignedAgenda ?? null,
  };

  if (includeExtendedColumns) {
    row.rejection_reason = registration.rejectionReason ?? null;
    row.food_preference = registration.foodPreference ?? null;
    row.notes = registration.notes ?? null;
  }

  return row;
}

export async function writeRegistrations(
  registrations: Registration[]
): Promise<void> {
  // Always update local file as backup & immediate local sync
  await writeLocalRegistrations(registrations);

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

      const tryWithExtended = cachedSupportsExtendedColumns !== false;
      let rows = registrations.map((r) => mapRegistrationToRow(r, tryWithExtended));
      let { error } = await client.from("registrations").upsert(rows, {
        onConflict: "id",
        ignoreDuplicates: false,
      });

      // If PostgREST reports column missing (PGRST204), fallback to inserting without extended columns
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code?: string }).code === "PGRST204"
      ) {
        cachedSupportsExtendedColumns = false;
        rows = registrations.map((r) => mapRegistrationToRow(r, false));
        const retry = await client.from("registrations").upsert(rows, {
          onConflict: "id",
          ignoreDuplicates: false,
        });
        error = retry.error;
      } else if (!error && tryWithExtended) {
        cachedSupportsExtendedColumns = true;
      }

      if (!error) {
        return;
      }

      console.warn("Supabase write failed; falling back to local JSON store.", error);
    } catch (error) {
      console.warn("Supabase write error; falling back to local JSON store.", error);
    }
  }
}

export async function addRegistration(
  registration: Registration
): Promise<Registration> {
  // 1. Update local JSON backup
  const localList = await readLocalRegistrations();
  localList.push(registration);
  await writeLocalRegistrations(localList);

  // 2. Directly upsert only this single new registration into Supabase (instead of uploading all existing records)
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

      const tryWithExtended = cachedSupportsExtendedColumns !== false;
      let singleRow = mapRegistrationToRow(registration, tryWithExtended);
      let { error } = await client.from("registrations").upsert([singleRow], {
        onConflict: "id",
        ignoreDuplicates: false,
      });

      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code?: string }).code === "PGRST204"
      ) {
        cachedSupportsExtendedColumns = false;
        singleRow = mapRegistrationToRow(registration, false);
        const retry = await client.from("registrations").upsert([singleRow], {
          onConflict: "id",
          ignoreDuplicates: false,
        });
        error = retry.error;
      } else if (!error && tryWithExtended) {
        cachedSupportsExtendedColumns = true;
      }

      if (error) {
        console.warn("Supabase single registration insert failed; fallback to local.", error);
      }
    } catch (error) {
      console.warn("Supabase addRegistration error:", error);
    }
  }

  return registration;
}

export async function updateRegistrationStatus(
  id: string,
  status: "approved" | "rejected" | "pending",
  rejectionReason?: string
): Promise<Registration | null> {
  // 1. Update local JSON store
  const localList = await readLocalRegistrations();
  const index = localList.findIndex((r) => r.id === id);
  let updatedReg: Registration | null = null;
  if (index !== -1) {
    localList[index].status = status;
    if (rejectionReason !== undefined) {
      localList[index].rejectionReason = rejectionReason;
    }
    updatedReg = localList[index];
    await writeLocalRegistrations(localList);
  }

  // 2. Directly update only this specific row in Supabase (avoids touching other records or screenshots)
  if (supabaseConfig.enabled && supabase) {
    try {
      const numericId = registrationIdToInteger(id);
      const client = supabase as unknown as {
        from: (table: string) => {
          update: (payload: Record<string, unknown>) => {
            eq: (col: string, val: unknown) => Promise<{ error: unknown }>;
          };
        };
      };

      const updatePayload: Record<string, unknown> = {
        status,
      };
      if (rejectionReason !== undefined) {
        updatePayload.rejection_reason = rejectionReason;
      }

      const { error } = await client
        .from("registrations")
        .update(updatePayload)
        .eq("id", numericId);

      if (error) {
        console.warn("Supabase updateRegistrationStatus error:", error);
      }
    } catch (error) {
      console.warn("Supabase updateRegistrationStatus exception:", error);
    }
  }

  return updatedReg;
}

export async function getRegistrationById(
  id: string,
  options: { includeScreenshots?: boolean } = {}
): Promise<Registration | undefined> {
  const registrations = await readRegistrations(options);
  return registrations.find((r) => r.id === id);
}
