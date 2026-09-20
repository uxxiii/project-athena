import type { Registration } from "@/lib/types";
import { getCommitteeById } from "@/data/committees";
import {
  generateApprovalEmailHtml,
  generateRejectionEmailHtml,
  generatePicnicApprovalEmailHtml,
  generatePicnicSubmissionEmailHtml,
} from "./email-templates";

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

const getSenderAddress = () => process.env.EMAIL_FROM ?? "Project Athena <notifications@projectathena.org>";

function getDisplayPortfolioName(registration: Registration): string {
  const committee = getCommitteeById(registration.assignedCommittee ?? "");
  return (
    committee?.portfolios.find((p) => p.id === registration.assignedPortfolio)?.name ??
    registration.assignedPortfolio ??
    "To be assigned"
  );
}

export async function sendApprovalEmail(registration: Registration): Promise<EmailResult> {
  const isPicnic = registration.eventSlug === "mun-picnic";
  const html = isPicnic
    ? generatePicnicApprovalEmailHtml(registration)
    : generateApprovalEmailHtml(registration);

  const subject = isPicnic
    ? `Athena MUN Picnic: Official Delegate Entry Pass Confirmed (Buddha Smriti Park)`
    : `Athena Summit: Registration Approved (${registration.assignedCommittee?.toUpperCase()} / ${getDisplayPortfolioName(registration)})`;

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[EMAIL SIMULATION] Sending Approval Email to ${registration.email}`);
    if (isPicnic) {
      console.log(`Event: MUN Picnic, Venue: Buddha Smriti Park, Time: 12PM-5PM, Date: 27 Sept`);
    } else {
      console.log(`Committee: ${registration.assignedCommittee}, Portfolio: ${getDisplayPortfolioName(registration)}`);
    }
    return {
      success: true,
      messageId: `simulated-${Date.now()}`,
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: getSenderAddress(),
        to: [registration.email],
        subject,
        html,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.message ?? "Failed to send email" };
    }

    return { success: true, messageId: json.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    return { success: false, error: message };
  }
}

export async function sendRejectionEmail(registration: Registration, reason?: string): Promise<EmailResult> {
  const isPicnic = registration.eventSlug === "mun-picnic";
  const html = generateRejectionEmailHtml(registration, reason);
  const subject = isPicnic
    ? `Athena MUN Picnic: Payment Verification Action Required`
    : `Athena Summit: Payment Verification Action Required`;

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[EMAIL SIMULATION] Sending Rejection Email to ${registration.email}`);
    return {
      success: true,
      messageId: `simulated-${Date.now()}`,
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: getSenderAddress(),
        to: [registration.email],
        subject,
        html,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.message ?? "Failed to send email" };
    }

    return { success: true, messageId: json.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    return { success: false, error: message };
  }
}

export async function sendPicnicSubmissionEmail(registration: Registration): Promise<EmailResult> {
  const html = generatePicnicSubmissionEmailHtml(registration);
  const subject = `Athena MUN Picnic: Registration Received (27th Sept, Buddha Smriti Park)`;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[EMAIL SIMULATION] Sending Picnic Submission Receipt to ${registration.email}`);
    return {
      success: true,
      messageId: `simulated-${Date.now()}`,
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: getSenderAddress(),
        to: [registration.email],
        subject,
        html,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.message ?? "Failed to send email" };
    }

    return { success: true, messageId: json.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    return { success: false, error: message };
  }
}
