import { NextResponse } from "next/server";
import { readRegistrations } from "@/lib/storage";
import { getEventBySlug } from "@/data/events";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const event = getEventBySlug("mun-picnic");
    const totalCapacity = event?.capacity ?? 100;

    const allRegistrations = await readRegistrations();
    const picnicRegistrations = allRegistrations.filter(
      (r) => r.eventSlug === "mun-picnic"
    );

    const registeredCount = picnicRegistrations.length;
    const approvedCount = picnicRegistrations.filter((r) => r.status === "approved").length;
    const pendingCount = picnicRegistrations.filter((r) => r.status === "pending").length;
    const seatsRemaining = Math.max(0, totalCapacity - registeredCount);
    const isFull = registeredCount >= totalCapacity;

    return NextResponse.json({
      totalCapacity,
      registeredCount,
      approvedCount,
      pendingCount,
      seatsRemaining,
      isFull,
      registrationOpen: Boolean(event?.registrationOpen) && !isFull,
      date: event?.date ?? "4th October",
      time: event?.time ?? "12:00 PM – 5:00 PM",
      location: event?.location ?? "Buddha Smriti Park, Patna",
      price: event?.price ?? 100,
    });
  } catch (error) {
    console.error("Error getting picnic stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch event statistics" },
      { status: 500 }
    );
  }
}
