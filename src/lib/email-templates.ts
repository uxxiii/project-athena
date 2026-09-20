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
  <title>Athena Summit: Registration Approved & Committee Assignment</title>
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
      <p>Athena Summit 2026: Official Delegate Allocation Confirmation</p>
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
  <title>Athena Summit: Payment Verification Status</title>
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
      <p>Athena Summit 2026: Payment Verification Update</p>
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

export function generatePicnicApprovalEmailHtml(registration: Registration): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Athena MUN Picnic: Official Delegate Entry Pass</title>
  <style>
    body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background-color: #0f0b1d; color: #f7f2e8; margin: 0; padding: 24px; }
    .container { max-width: 640px; margin: 0 auto; background: linear-gradient(135deg, #22143a 0%, #140d24 100%); border: 1px solid #c8a24a; border-radius: 16px; padding: 32px; box-shadow: 0 12px 36px rgba(0,0,0,0.35); }
    .header { text-align: center; border-bottom: 1px solid rgba(200,162,74,0.3); padding-bottom: 20px; margin-bottom: 24px; }
    .badge { display: inline-block; background: rgba(200,162,74,0.15); border: 1px solid #c8a24a; color: #f0d48c; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 4px 14px; border-radius: 999px; margin-bottom: 12px; }
    .header h1 { color: #f0d48c; font-size: 28px; margin: 0; letter-spacing: 1.5px; }
    .header p { color: #d9d0bd; font-size: 14px; margin-top: 6px; }
    .pass-card { background: rgba(255,255,255,0.05); border: 2px dashed rgba(200,162,74,0.4); border-radius: 14px; padding: 24px; margin: 24px 0; text-align: left; }
    .item { margin-bottom: 14px; }
    .label { color: #bfb59b; font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 2px; }
    .val { color: #ffffff; font-size: 16px; font-weight: 700; }
    .accent { color: #f0d48c; }
    .schedule-box { background: #0f0b1d; border-left: 4px solid #c8a24a; padding: 14px 16px; margin-top: 8px; border-radius: 8px; font-size: 13px; color: #efe8d8; line-height: 1.7; }
    .btn { display: inline-block; background: #c8a24a; color: #130d20; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-weight: 700; margin-top: 18px; font-size: 14px; }
    .footer { text-align: center; margin-top: 28px; font-size: 12px; color: #bdb3a1; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; }
    ul { padding-left: 18px; color: #efe8d8; }
    li { margin: 8px 0; font-size: 13px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">Official Entry Pass • ₹100 Verified</div>
      <h1>PROJECT ATHENA</h1>
      <p>Athena MUN Picnic: Training Workshop + Potluck + Games</p>
    </div>

    <p>Dear <strong>${registration.name}</strong>,</p>

    <p style="color: #fdf7eb; line-height: 1.7;">
      Congratulations! Your registration and payment for the <strong>Athena MUN Picnic</strong> have been officially verified. Your delegate pass is confirmed below:
    </p>

    <div class="pass-card">
      <div class="item">
        <div class="label">Attendee Name</div>
        <div class="val accent">${registration.name}</div>
      </div>
      <div class="item">
        <div class="label">Pass / Registration ID</div>
        <div class="val" style="font-family: monospace; font-size: 14px;">${registration.id}</div>
      </div>
      <div class="item">
        <div class="label">Event Date & Time</div>
        <div class="val">Sunday, 27th September | 12:00 PM to 5:00 PM</div>
      </div>
      <div class="item">
        <div class="label">Venue Location</div>
        <div class="val">Buddha Smriti Park, Near Patna Junction, Fraser Road, Patna, Bihar</div>
      </div>
      ${
        registration.foodPreference
          ? `
      <div class="item">
        <div class="label">Potluck / Dietary Preference</div>
        <div class="val" style="font-size: 14px; font-weight: 500;">${registration.foodPreference}</div>
      </div>
      `
          : ""
      }
    </div>

    <h3 style="margin-bottom: 8px; color: #f0d48c;">Picnic Itinerary</h3>
    <div class="schedule-box">
      <strong>12:00 PM – 1:30 PM:</strong> Hands-on MUN Training & Strategy Workshop<br/>
      <strong>1:30 PM – 2:45 PM:</strong> Delegate Networking & Community Potluck Lunch<br/>
      <strong>2:45 PM – 4:30 PM:</strong> Diplomacy Simulation Games & Crisis Scenarios<br/>
      <strong>4:30 PM – 5:00 PM:</strong> Group Photos, Feedback & Delegate Certificates
    </div>

    <h3 style="margin-top: 20px; margin-bottom: 8px; color: #f0d48c;">What to Bring & Instructions</h3>
    <ul>
      <li>Show this confirmation email or your Registration ID at the park entrance.</li>
      <li>Bring a notebook/pen or tablet for the interactive training workshop.</li>
      <li>Bring your potluck snack or dish to share with fellow delegates.</li>
      <li>Dress code: Smart Casual / Comfortable Picnic Attire.</li>
    </ul>

    <p style="text-align: center; margin-top: 24px;">
      <a href="https://maps.google.com/?q=Buddha+Smriti+Park+Patna" class="btn" target="_blank">📍 Get Directions to Buddha Smriti Park</a>
    </p>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Project Athena. Powered by Eldr.</p>
      <p>Buddha Smriti Park, Patna • 27th September, 12:00 PM – 5:00 PM</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generatePicnicSubmissionEmailHtml(registration: Registration): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Athena MUN Picnic: Registration Received</title>
  <style>
    body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background-color: #0f0b1d; color: #f7f2e8; margin: 0; padding: 24px; }
    .container { max-width: 640px; margin: 0 auto; background: linear-gradient(135deg, #22143a 0%, #140d24 100%); border: 1px solid #c8a24a; border-radius: 16px; padding: 32px; }
    .header { text-align: center; border-bottom: 1px solid rgba(200,162,74,0.3); padding-bottom: 18px; margin-bottom: 20px; }
    .header h1 { color: #f0d48c; font-size: 26px; margin: 0; }
    .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(200,162,74,0.25); border-radius: 12px; padding: 20px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #bdb3a1; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PROJECT ATHENA</h1>
      <p>Athena MUN Picnic Registration Received</p>
    </div>

    <p>Dear <strong>${registration.name}</strong>,</p>

    <p>We have successfully received your registration details and payment screenshot (₹100) for the <strong>Athena MUN Picnic</strong> on 27th September at Buddha Smriti Park.</p>

    <div class="card">
      <p style="margin: 4px 0;"><strong>Registration ID:</strong> ${registration.id}</p>
      <p style="margin: 4px 0;"><strong>Payment Status:</strong> Pending Verification</p>
      <p style="margin: 4px 0;"><strong>Venue:</strong> Buddha Smriti Park, Patna</p>
      <p style="margin: 4px 0;"><strong>Date & Time:</strong> 27th September, 12:00 PM – 5:00 PM</p>
    </div>

    <p>Our Secretariat team will verify your payment and send your official entry pass shortly.</p>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Project Athena.</p>
    </div>
  </div>
</body>
</html>
  `;
}

