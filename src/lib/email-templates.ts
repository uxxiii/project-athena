import type { Registration } from "@/lib/types";
import { getCommitteeById } from "@/data/committees";

function getPortfolioName(registration: Registration): string {
  const committee = getCommitteeById(registration.assignedCommittee ?? "");
  return (
    committee?.portfolios.find((p) => p.id === registration.assignedPortfolio)?.name ??
    registration.assignedPortfolio ??
    "To be assigned"
  );
}

export function generateApprovalEmailHtml(registration: Registration): string {
  const portfolioName = getPortfolioName(registration);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Athena Summit — Registration Approved & Committee Assignment</title>
  <style>
    body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background-color: #0f0b1d; color: #f7f2e8; margin: 0; padding: 24px; }
    .container { max-width: 640px; margin: 0 auto; background: linear-gradient(135deg, #22143a 0%, #140d24 100%); border: 1px solid #c8a24a; border-radius: 16px; padding: 32px; box-shadow: 0 12px 36px rgba(0,0,0,0.28); }
    .header { text-align: center; border-bottom: 1px solid rgba(200,162,74,0.22); padding-bottom: 18px; margin-bottom: 24px; }
    .header h1 { color: #f0d48c; font-size: 28px; margin: 0; letter-spacing: 1.4px; }
    .header p { color: #d9d0bd; font-size: 14px; margin-top: 6px; }
    .card { background: rgba(255,255,255,0.06); border: 1px solid rgba(200,162,74,0.22); border-radius: 12px; padding: 20px; margin: 20px 0; }
    .item { margin-bottom: 14px; }
    .label { color: #bfb59b; font-size: 12px; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 4px; }
    .val { color: #ffffff; font-size: 16px; font-weight: 700; }
    .accent { color: #f0d48c; }
    .agenda-box { background: #0f0b1d; border-left: 4px solid #c8a24a; padding: 12px 14px; margin-top: 6px; font-size: 13px; color: #efe8d8; line-height: 1.6; border-radius: 8px; }
    .btn { display: inline-block; background: #c8a24a; color: #130d20; text-decoration: none; padding: 12px 22px; border-radius: 999px; font-weight: 700; margin-top: 16px; font-size: 14px; }
    .footer { text-align: center; margin-top: 28px; font-size: 12px; color: #bdb3a1; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; }
    ul { padding-left: 18px; color: #efe8d8; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PROJECT ATHENA</h1>
      <p>Athena Summit 2026 — Official Delegate Allocation Confirmation</p>
    </div>

    <p>Dear <strong>${registration.name}</strong>,</p>

    <p style="color: #fdf7eb; line-height: 1.7;">We are pleased to inform you that your delegate registration and payment for <strong>Athena Summit 2026</strong> have been officially verified and approved by the Secretary General.</p>

    <div class="card">
      <div class="item">
        <div class="label">Assigned Committee</div>
        <div class="val accent">${registration.assignedCommittee?.toUpperCase() ?? "TO BE ASSIGNED"}</div>
      </div>
      <div class="item">
        <div class="label">Assigned Portfolio</div>
        <div class="val">${portfolioName}</div>
      </div>
      <div class="item">
        <div class="label">Committee Agenda</div>
        <div class="agenda-box">${registration.assignedAgenda ?? "Your committee agenda will be shared shortly."}</div>
      </div>
    </div>

    <h3 style="margin-bottom: 8px; color: #f0d48c;">Next Steps & Delegate Resources</h3>
    <ul>
      <li><strong>Mandates:</strong> https://docs.google.com/document/d/1JfSyC2axjha6tuEcZWAUmx7H89vBKMiB/edit?usp=sharing&ouid=107176384204003614650&rtpof=true&sd=true</li>
      <li><strong>Rules of Procedure (RoPs):</strong> https://drive.google.com/file/d/1LAKqRpIpe-p48llbc92m8jHwtT9fFdTF/view?usp=sharing</li>
      <li><strong>Study Guidelines & Background Guide:</strong> Research your assigned committee agenda thoroughly.</li>
    </ul>

    <p style="text-align: center; margin-top: 24px;">
      <a href="https://projectathena.site/events/athena-summit" class="btn">View Conference Portal</a>
    </p>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Project Athena. Powered by Eldr.</p>
      <p>Registration ID: ${registration.id}</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateRejectionEmailHtml(registration: Registration, reason?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Athena Summit — Payment Verification Status</title>
  <style>
    body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background-color: #0f0b1d; color: #f7f2e8; margin: 0; padding: 24px; }
    .container { max-width: 640px; margin: 0 auto; background: linear-gradient(135deg, #22143a 0%, #140d24 100%); border: 1px solid #e35a5a; border-radius: 16px; padding: 32px; box-shadow: 0 12px 36px rgba(0,0,0,0.28); }
    .header { text-align: center; border-bottom: 1px solid rgba(227,90,90,0.24); padding-bottom: 18px; margin-bottom: 24px; }
    .header h1 { color: #f08a8a; font-size: 26px; margin: 0; letter-spacing: 1.2px; }
    .header p { color: #d9d0bd; font-size: 14px; margin-top: 6px; }
    .card { background: rgba(255,255,255,0.06); border: 1px solid rgba(227,90,90,0.22); border-radius: 12px; padding: 18px; margin: 20px 0; color: #efe8d8; }
    .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #bdb3a1; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PROJECT ATHENA</h1>
      <p>Athena Summit 2026 — Payment Verification Update</p>
    </div>

    <p>Dear <strong>${registration.name}</strong>,</p>

    <p>Thank you for submitting your registration for Athena Summit 2026. During payment verification, our team encountered an issue with your payment screenshot upload.</p>

    <div class="card">
      <p><strong>Reason / Note:</strong> ${reason || "The uploaded payment screenshot could not be verified or appeared incomplete."}</p>
    </div>

    <p>Please contact the organizing team at <strong>project.athena03@gmail.com</strong> or resubmit your registration screenshot via the registration portal.</p>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Project Athena. Registration ID: ${registration.id}</p>
    </div>
  </div>
</body>
</html>
  `;
}
