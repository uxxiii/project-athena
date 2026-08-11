import { promises as fs } from "fs";
import path from "path";
import type { Registration } from "@/lib/types";
import { supabase, supabaseConfig } from "@/lib/supabase-client";

interface SupabaseRegistrationRow {
  id: string;
  data: Registration;
}

const DATA_DIR = path.join(process.cwd(), "data");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json");

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
  await ensureDataDir();
  await fs.writeFile(
    REGISTRATIONS_FILE,
    JSON.stringify(registrations, null, 2),
    "utf-8"
  );
}

export async function readRegistrations(): Promise<Registration[]> {
  if (supabaseConfig.enabled && supabase) {
    const client = supabase as {
      from: (table: string) => {
        select: (columns: string) => Promise<{ data: unknown; error: unknown }>;
      };
    };
    const { data, error } = await client.from("registrations").select("id, data");
    if (!error && data) {
      return (data as SupabaseRegistrationRow[]).map((row) => row.data);
    }
  }

  return readLocalRegistrations();
}

export async function writeRegistrations(
  registrations: Registration[]
): Promise<void> {
  if (supabaseConfig.enabled && supabase) {
    const client = supabase as {
      from: (table: string) => {
        upsert: (
          rows: Array<{ id: string; data: Registration }>,
          options: { onConflict: string; ignoreDuplicates: boolean }
        ) => Promise<{ error: unknown }>;
      };
    };
    const rows: Array<{ id: string; data: Registration }> = registrations.map((registration) => ({
      id: registration.id,
      data: registration,
    }));

    const { error } = await client.from("registrations").upsert(rows, {
      onConflict: "id",
      ignoreDuplicates: false,
    });

    if (!error) {
      return;
    }
  }

  await writeLocalRegistrations(registrations);
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
