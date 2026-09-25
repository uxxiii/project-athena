import { NextResponse } from "next/server";
import { registrationApiSchema } from "@/lib/api-schemas";
import { getAvailability } from "@/lib/availability";
import { allocateDelegate } from "@/lib/allocation";
import { addRegistration, readRegistrations } from "@/lib/storage";
import { getCommitteeById } from "@/data/committees";
import { getEventBySlug } from "@/data/events";
import { generateSequentialRegistrationId } from "@/lib/registration-id";
import type { Registration } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registrationApiSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid registration data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const event = getEventBySlug(data.eventSlug);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!event.registrationOpen) {
      return NextResponse.json(
        { error: "Registration is closed for this event" },
        { status: 403 }
      );
    }

    const existingRegistrations = await readRegistrations();
    const duplicate = existingRegistrations.find(
      (r) =>
        r.eventSlug === data.eventSlug &&
        r.email.trim().toLowerCase() === data.email.trim().toLowerCase()
    );

    if (duplicate) {
      return NextResponse.json(
        { error: "A registration with this email address already exists for this event." },
        { status: 409 }
      );
    }

    // Specialized flow for MUN Picnic: Training Workshop + Potluck + Games
    if (data.eventSlug === "mun-picnic") {
      const picnicRegistrations = existingRegistrations.filter(
        (r) => r.eventSlug === "mun-picnic"
      );

      const capacity = event.capacity ?? 100;
      if (picnicRegistrations.length >= capacity) {
        return NextResponse.json(
          { error: `Registration is full! The ${capacity}-seat capacity limit has been reached.` },
          { status: 403 }
        );
      }

      const registration: Registration = {
        id: generateSequentialRegistrationId(data.eventSlug, existingRegistrations),
        eventSlug: data.eventSlug,
        name: data.name,
        phone: data.phone,
        email: data.email,
        classYear: data.classYear,
        institution: data.institution,
        munExperience: data.munExperience,
        reference: data.reference,
        paymentScreenshot: data.paymentScreenshot,
        foodPreference: data.foodPreference,
        notes: data.notes,
        createdAt: new Date().toISOString(),
        status: "pending",
        assignedCommittee: "Training Workshop & Potluck",
        assignedPortfolio: "Picnic Delegate Pass",
        assignedAgenda: "MUN Training Workshop, Diplomatic Games & Community Potluck",
      };

      await addRegistration(registration);

      // Trigger asynchronous/simulated submission receipt email
      try {
        const { sendPicnicSubmissionEmail } = await import("@/lib/email");
        await sendPicnicSubmissionEmail(registration);
      } catch (emailErr) {
        console.warn("Failed to send picnic submission email:", emailErr);
      }

      return NextResponse.json({ registration }, { status: 201 });
    }

    // Default flow for Athena Summit conference committees
    const availability = await getAvailability();
    const allocation = allocateDelegate(data, availability);

    if (!allocation) {
      return NextResponse.json(
        { error: "No available committees or portfolios matching your preferences." },
        { status: 409 }
      );
    }

    const committee = getCommitteeById(allocation.committeeId);

    const registration: Registration = {
      id: generateSequentialRegistrationId(data.eventSlug, existingRegistrations),
      eventSlug: data.eventSlug,
      name: data.name,
      phone: data.phone,
      email: data.email,
      classYear: data.classYear,
      institution: data.institution,
      committeePreferences: data.committeePreferences,
      portfolioPreferences: data.portfolioPreferences,
      munExperience: data.munExperience,
      reference: data.reference,
      paymentScreenshot: data.paymentScreenshot,
      isUnscRegistration: data.isUnscRegistration,
      unscDelegate: data.unscDelegate,
      unscDelegatePortfolioPreferences: data.unscDelegatePortfolioPreferences,
      createdAt: new Date().toISOString(),
      status: "pending",
      assignedCommittee: allocation.committeeId,
      assignedPortfolio: allocation.portfolioId,
      assignedAgenda: committee?.agenda ?? allocation.agenda,
    };

    await addRegistration(registration);

    return NextResponse.json({ registration }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
