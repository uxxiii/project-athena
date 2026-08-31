import type { Registration } from "@/lib/types";
import { getCommitteeById } from "@/data/committees";
import { generateApprovalEmailHtml, generateRejectionEmailHtml } from "./email-templates";

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
  const html = generateApprovalEmailHtml(registration);
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[EMAIL SIMULATION] Sending Approval Email to ${registration.email}`);
    console.log(`Committee: ${registration.assignedCommittee}, Portfolio: ${getDisplayPortfolioName(registration)}`);
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
        subject: `Athena Summit: Registration Approved (${registration.assignedCommittee?.toUpperCase()} / ${getDisplayPortfolioName(registration)})`,
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
  const html = generateRejectionEmailHtml(registration, reason);
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
        subject: `Athena Summit: Payment Verification Action Required`,
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
