import { NextResponse } from "next/server";
import { readRegistrations } from "@/lib/storage";
import { getEventBySlug } from "@/data/events";
import { committees } from "@/data/committees";
import { getAvailability } from "@/lib/availability";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const event = getEventBySlug("athena-summit");
    const allRegistrations = await readRegistrations();
    const summitRegistrations = allRegistrations.filter(
      (r) => r.eventSlug === "athena-summit"
    );

    const approvedCount = summitRegistrations.filter((r) => r.status === "approved").length;
    const pendingCount = summitRegistrations.filter((r) => r.status === "pending").length;
    const registeredCount = approvedCount + pendingCount;

    const totalCapacity = committees.reduce((sum, c) => {
      // Exclude unlimited/IP capacity from numeric sum
      if (c.id === "ip") return sum;
      return sum + c.maxDelegates;
    }, 0);

    const seatsRemaining = Math.max(0, totalCapacity - registeredCount);
    const availability = await getAvailability();

    return NextResponse.json({
      eventSlug: "athena-summit",
      title: event?.title ?? "Athena Summit",
      totalCommittees: committees.length,
      totalCapacity,
      registeredCount,
      approvedCount,
      pendingCount,
      seatsRemaining,
      registrationOpen: Boolean(event?.registrationOpen),
      date: event?.date ?? "October 2026",
      location: event?.location ?? "TBA",
      availability: availability.committees,
    });
  } catch (error) {
    console.error("Error getting summit stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch event statistics" },
      { status: 500 }
    );
  }
}
