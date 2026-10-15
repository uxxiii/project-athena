import { NextResponse } from "next/server";
import { addDonation, type DonationInput } from "@/lib/donations-storage";

export async function POST(req: Request) {
  try {
    const body: DonationInput & { isWaitlist?: boolean; causeInterest?: string } = await req.json();

    if (!body.donorName || !body.donorEmail) {
      return NextResponse.json(
        { error: "Donor name and email are required." },
        { status: 400 }
      );
    }

    const isWaitlist = Boolean(body.isWaitlist || !body.transactionRef);

    if (isWaitlist) {
      const fullMessage = body.causeInterest
        ? `[Interest: ${body.causeInterest}] ${body.message || ""}`.trim()
        : (body.message || "");

      const waitlistEntry = await addDonation({
        ...body,
        transactionRef: "WAITLIST",
        status: "waitlist",
        isWaitlist: true,
        message: fullMessage,
      });

      return NextResponse.json({
        success: true,
        isWaitlist: true,
        message: "You have been successfully added to the donation waitlist! We will notify you when donations reopen.",
        donation: waitlistEntry,
      });
    }

    // Direct donation submission (when open)
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
