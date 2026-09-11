import { NextResponse } from "next/server";
import { supabase, supabaseConfig } from "@/lib/supabase-client";

interface DonationInput {
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount?: number;
  transactionRef: string;
  screenshot?: string;
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

function unavailableResponse() {
  return NextResponse.json(
    { error: "Donation storage is not configured." },
    { status: 503 }
  );
}

export async function POST(req: Request) {
  try {
    if (!supabaseConfig.enabled || !supabase) return unavailableResponse();

    const body: DonationInput = await req.json();

    if (!body.donorName || !body.donorEmail || !body.transactionRef) {
      return NextResponse.json(
        { error: "Donor name, email, and transaction reference ID are required." },
        { status: 400 }
      );
    }

    const newDonation: DonationRow = {
      id: `DON-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      donor_name: body.donorName.trim(),
      donor_email: body.donorEmail.trim().toLowerCase(),
      donor_phone: body.donorPhone ? body.donorPhone.trim() : "",
      amount: body.amount ? Number(body.amount) : 0,
      transaction_ref: body.transactionRef.trim(),
      screenshot: body.screenshot || null,
      message: body.message ? body.message.trim() : "",
      created_at: new Date().toISOString(),
      status: "pending",
    };

    const client = supabase as unknown as {
      from: (table: string) => {
        insert: (rows: DonationRow[]) => Promise<{ error: unknown }>;
      };
    };
    const { error } = await client.from("donations").insert([newDonation]);
    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Donation receipt submitted successfully! Thank you for supporting the cause.",
      donation: toDonation(newDonation),
    });
  } catch (error) {
    console.error("Donation submission error:", error);
    return NextResponse.json(
      { error: "Internal server error while processing donation submission." },
      { status: 500 }
    );
  }
}
