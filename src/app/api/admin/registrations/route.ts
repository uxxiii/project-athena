import { NextResponse } from "next/server";
import { readRegistrations } from "@/lib/storage";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let registrations = await readRegistrations();

    if (status) {
      registrations = registrations.filter((r) => r.status === status);
    }

    // Sort newest first
    registrations.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error("Admin list registrations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
