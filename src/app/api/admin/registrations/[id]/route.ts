import { NextResponse } from "next/server";
import { readRegistrations, updateRegistrationStatus } from "@/lib/storage";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/email";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { status, rejectionReason } = body as {
      status?: "approved" | "rejected" | "pending";
      rejectionReason?: string;
    };

    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value. Must be 'approved', 'rejected', or 'pending'." },
        { status: 400 }
      );
    }

    const registration = await updateRegistrationStatus(id, status, rejectionReason);

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    // Trigger Email Automation
    let emailStatus = null;
    if (status === "approved") {
      emailStatus = await sendApprovalEmail(registration);
    } else if (status === "rejected") {
      emailStatus = await sendRejectionEmail(registration, rejectionReason);
    }

    return NextResponse.json({
      registration,
      emailStatus,
      message: `Registration ${status} successfully.`,
    });
  } catch (error) {
    console.error("Admin update registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
