import { promises as fs } from "fs";
import path from "path";
import { supabase, supabaseConfig } from "@/lib/supabase-client";

export interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  transactionRef: string;
  screenshot: string | null;
  message: string;
  createdAt: string;
  status: string;
}

export interface DonationInput {
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount?: number;
  transactionRef: string;
  screenshot?: string | null;
  message?: string;
}

type DonationRow = {
  id: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  amount: number;
  transaction_ref: string;
  screenshot: string | null;
  message: string;
  created_at: string;
  status: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DONATIONS_FILE = path.join(DATA_DIR, "donations.json");

function toDonation(row: DonationRow): Donation {
  return {
    id: row.id,
    donorName: row.donor_name,
    donorEmail: row.donor_email,
    donorPhone: row.donor_phone,
    amount: row.amount,
    transactionRef: row.transaction_ref,
    screenshot: row.screenshot,
    message: row.message,
    createdAt: row.created_at,
    status: row.status,
  };
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readLocalDonations(): Promise<Donation[]> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(DONATIONS_FILE, "utf-8");
    return JSON.parse(raw) as Donation[];
  } catch {
    return [];
  }
}

export async function writeLocalDonations(donations: Donation[]): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(
      DONATIONS_FILE,
      JSON.stringify(donations, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.warn("Local donations JSON store write skipped (serverless).", err);
  }
}

function stringToNumericId(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

export async function readDonations(): Promise<Donation[]> {
  const donationsMap = new Map<string, Donation>();

  // 1. Try querying official 'donations' table in Supabase
  if (supabaseConfig.enabled && supabase) {
    try {
      const client = supabase as unknown as {
        from: (table: string) => {
          select: (columns: string) => Promise<{ data: DonationRow[] | null; error: unknown }>;
        };
      };
      const { data, error } = await client.from("donations").select("*");
      if (!error && Array.isArray(data)) {
        for (const row of data) {
          const d = toDonation(row);
          donationsMap.set(d.id, d);
        }
      }
    } catch {
      // Ignored if table does not exist
    }

    // 2. Also query any fallback records saved in 'registrations' with event_slug = 'donation'
    try {
      const client = supabase as unknown as {
        from: (table: string) => {
          select: (columns: string) => {
            eq: (col: string, val: string) => Promise<{ data: Array<Record<string, unknown>> | null; error: unknown }>;
          };
        };
      };
      const { data, error } = await client
        .from("registrations")
        .select("*")
        .eq("event_slug", "donation");

      if (!error && Array.isArray(data)) {
        for (const row of data) {
          const prefs = (row.portfolio_preferences ?? {}) as Record<string, unknown>;
          const donId = String(prefs.donationId || row.reference || `DON-${row.id}`);
          if (!donationsMap.has(donId)) {
            donationsMap.set(donId, {
              id: donId,
              donorName: String(row.name || "Anonymous Donor"),
              donorEmail: String(row.email || ""),
              donorPhone: String(row.phone || ""),
              amount: Number(prefs.amount ?? 0),
              transactionRef: String(row.reference || ""),
              screenshot: row.payment_screenshot ? String(row.payment_screenshot) : null,
              message: String(row.assigned_agenda || ""),
              createdAt: String(row.created_at || new Date().toISOString()),
              status: String(row.status || "pending"),
            });
          }
        }
      }
    } catch {
      // Ignored
    }
  }

  // 3. Merge local file store
  const localList = await readLocalDonations();
  for (const d of localList) {
    if (!donationsMap.has(d.id)) {
      donationsMap.set(d.id, d);
    }
  }

  const result = Array.from(donationsMap.values());
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return result;
}

export async function addDonation(input: DonationInput): Promise<Donation> {
  const donationId = `DON-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const donation: Donation = {
    id: donationId,
    donorName: input.donorName.trim(),
    donorEmail: input.donorEmail.trim().toLowerCase(),
    donorPhone: input.donorPhone ? input.donorPhone.trim() : "",
    amount: input.amount ? Number(input.amount) : 0,
    transactionRef: input.transactionRef.trim(),
    screenshot: input.screenshot || null,
    message: input.message ? input.message.trim() : "",
    createdAt: new Date().toISOString(),
    status: "pending",
  };

  // 1. Always append to local JSON store
  const currentLocal = await readLocalDonations();
  currentLocal.unshift(donation);
  await writeLocalDonations(currentLocal);

  // 2. Try writing to Supabase
  if (supabaseConfig.enabled && supabase) {
    let writeSuccess = false;

    // Try official 'donations' table
    try {
      const client = supabase as unknown as {
        from: (table: string) => {
          insert: (rows: DonationRow[]) => Promise<{ error: unknown }>;
        };
      };
      const row: DonationRow = {
        id: donation.id,
        donor_name: donation.donorName,
        donor_email: donation.donorEmail,
        donor_phone: donation.donorPhone,
        amount: donation.amount,
        transaction_ref: donation.transactionRef,
        screenshot: donation.screenshot,
        message: donation.message,
        created_at: donation.createdAt,
        status: donation.status,
      };
      const { error } = await client.from("donations").insert([row]);
      if (!error) {
        writeSuccess = true;
      }
    } catch {
      writeSuccess = false;
    }

    // If 'donations' table is not yet created in Supabase, store in registrations table with event_slug: 'donation'
    if (!writeSuccess) {
      try {
        const client = supabase as unknown as {
          from: (table: string) => {
            insert: (rows: Array<Record<string, unknown>>) => Promise<{ error: unknown }>;
          };
        };

        const numericId = Math.abs(stringToNumericId(donation.id)) % 2000000000 || Math.floor(Math.random() * 800000) + 100000;
        const fallbackRow = {
          id: numericId,
          event_slug: "donation",
          name: donation.donorName,
          email: donation.donorEmail,
          phone: donation.donorPhone,
          reference: donation.transactionRef,
          payment_screenshot: donation.screenshot,
          assigned_agenda: donation.message,
          status: donation.status,
          created_at: donation.createdAt,
          portfolio_preferences: {
            _isDonation: true,
            donationId: donation.id,
            amount: donation.amount,
          },
        };

        await client.from("registrations").insert([fallbackRow]);
      } catch (err) {
        console.warn("Fallback donation write to registrations table also failed:", err);
      }
    }
  }

  return donation;
}
