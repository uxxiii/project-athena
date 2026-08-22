import { promises as fs } from "fs";
import path from "path";
import type { Registration } from "@/lib/types";
import { supabase, supabaseConfig } from "@/lib/supabase-client";

const DATA_DIR = path.join(process.cwd(), "data");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json");

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
  const portfolioPreferences =
    typeof rawPortPrefs === "object" && rawPortPrefs
      ? (Object.fromEntries(
          Object.entries(rawPortPrefs as Record<string, unknown>).map(([key, pref]) => [
            key,
            toThreeTuple(parseJsonIfNeeded(pref)),
          ])
        ) as Record<string, [string, string, string]>)
      : {};

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

  return {
    id: String(value.id ?? ""),
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
        return data.map((row) => normalizeRegistrationRow(row as Record<string, unknown>));
      }

      console.warn("Supabase read failed; falling back to local JSON store.", error);
    } catch (error) {
      console.warn("Supabase read error; falling back to local JSON store.", error);
    }
  }

  return readLocalRegistrations();
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

function mapRegistrationToRow(registration: Registration, useNumericId = false): Record<string, unknown> {
  let rawId: string | number = registration.id;
  if (useNumericId) {
    if (typeof rawId === "string" && !/^\d+$/.test(rawId)) {
      rawId = stringToNumericId(rawId);
    } else {
      rawId = Number(rawId) || stringToNumericId(String(rawId));
    }
  }

  return {
    id: rawId,
    event_slug: registration.eventSlug,
    name: registration.name,
    phone: registration.phone,
    email: registration.email,
    class_year: registration.classYear,
    institution: registration.institution,
    committee_preferences: registration.committeePreferences,
    portfolio_preferences: registration.portfolioPreferences,
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

      let rows = registrations.map((r) => mapRegistrationToRow(r, false));
      let { error } = await client.from("registrations").upsert(rows, {
        onConflict: "id",
        ignoreDuplicates: false,
      });

      // If Postgres returns 22P02 (invalid_text_representation for integer column), retry with numeric ID mapping
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code?: string }).code === "22P02"
      ) {
        console.warn("Supabase id column is INTEGER; converting string IDs to numeric for Supabase compatibility.");
        rows = registrations.map((r) => mapRegistrationToRow(r, true));
        const retry = await client.from("registrations").upsert(rows, {
          onConflict: "id",
          ignoreDuplicates: false,
        });
        error = retry.error;
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
