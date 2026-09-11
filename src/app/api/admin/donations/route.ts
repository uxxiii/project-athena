import { NextResponse } from "next/server";
import { supabase, supabaseConfig } from "@/lib/supabase-client";

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

function toDonation(row: DonationRow) {
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

export async function GET() {
  if (!supabaseConfig.enabled || !supabase) {
    return NextResponse.json({ error: "Donation storage is not configured." }, { status: 503 });
  }

  const client = supabase as unknown as {
    from: (table: string) => {
      select: (columns: string) => Promise<{ data: DonationRow[] | null; error: unknown }>;
    };
  };
  const { data, error } = await client.from("donations").select("*");

  if (error) {
    console.error("Admin donation read error:", error);
    return NextResponse.json({ error: "Unable to retrieve donations." }, { status: 500 });
  }

  const donations = (data ?? [])
    .map(toDonation)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ success: true, donations });
}
