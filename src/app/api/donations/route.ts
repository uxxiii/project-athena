import { NextResponse } from "next/server";
import { addDonation, type DonationInput } from "@/lib/donations-storage";

export async function POST(req: Request) {
  try {
    const body: DonationInput = await req.json();

    if (!body.donorName || !body.donorEmail || !body.transactionRef) {
      return NextResponse.json(
        { error: "Donor name, email, and transaction reference ID are required." },
        { status: 400 }
      );
    }

    const donation = await addDonation(body);

    return NextResponse.json({
      success: true,
      message: "Donation receipt submitted successfully! Thank you for supporting the cause.",
      donation,
    });
  } catch (error) {
    console.error("Donation submission error:", error);
    return NextResponse.json(
      { error: "Internal server error while processing donation submission." },
      { status: 500 }
    );
  }
}
