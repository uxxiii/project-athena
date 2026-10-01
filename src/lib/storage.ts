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

export async function readRegistrations(): Promise<Registration[]> {
  if (supabaseConfig.enabled && supabase) {
    try {
      const client = supabase as {
        from: (table: string) => {
          select: (columns: string) => Promise<{ data: unknown[] | null; error: unknown }>;
        };
      };

      const { data, error } = await client.from("registrations").select("*");
      if (!error && Array.isArray(data)) {
        // Exclude fallback donation records
        const list = data
          .filter((row: unknown) => (row as Record<string, unknown>).event_slug !== "donation")
          .map((row) => normalizeRegistrationRow(row as Record<string, unknown>));

        // Background sync to local JSON
        if (list.length > 0) {
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
  const registrations = await readRegistrations();
  registrations.push(registration);
  await writeRegistrations(registrations);
  return registration;
}

export async function getRegistrationById(
  id: string
): Promise<Registration | undefined> {
  const registrations = await readRegistrations();
  return registrations.find((r) => r.id === id);
}
