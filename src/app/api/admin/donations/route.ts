import { NextResponse } from "next/server";
import { readDonations } from "@/lib/donations-storage";

export async function GET() {
  try {
    const donations = await readDonations();
    return NextResponse.json({ success: true, donations });
  } catch (error) {
    console.error("Admin donation read error:", error);
    return NextResponse.json({ error: "Unable to retrieve donations." }, { status: 500 });
  }
}
