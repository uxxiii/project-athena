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

// Common styles & design tokens for high-fidelity dark-mode email rendering across Gmail, Apple Mail & Outlook
const emailStyles = `
  /* Global Resets */
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
  body { margin: 0 !important; padding: 0 !important; width: 100% !important; min-width: 100%; }

  /* Responsive Rules */
  @media only screen and (max-width: 620px) {
    .email-container { width: 100% !important; max-width: 100% !important; }
    .email-wrapper { padding: 12px 8px !important; }
    .content-box { padding: 20px 16px !important; }
    .header-logo { font-size: 22px !important; letter-spacing: 2px !important; }
    .badge-pill { font-size: 10px !important; padding: 4px 10px !important; }
    .stack-col { display: block !important; width: 100% !important; }
    .btn-block { display: block !important; width: 100% !important; text-align: center !important; }
  }
`;

/**
 * Generates an executive-tier confirmation email for Athena Summit with styled resource cards
 */
export function generateApprovalEmailHtml(registration: Registration): string {
  const portfolioName = getPortfolioName(registration);
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Athena Summit: Official Delegate Allocation</title>
  <style type="text/css">
    ${emailStyles}
  </style>
</head>
<body style="background-color: #080410; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Outer Background Table -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080410; min-height: 100%;">
    <tr>
      <td align="center" style="padding: 32px 12px;" class="email-wrapper">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background: #130a21 linear-gradient(180deg, #1b0e33 0%, #10061e 100%); border: 1px solid #4a3469; border-top: 4px solid #d4af37; border-radius: 18px; box-shadow: 0 16px 44px rgba(0,0,0,0.5); overflow: hidden;">
          
          <!-- Top Brand Header -->
          <tr>
            <td align="center" style="padding: 36px 28px 24px; text-align: center; border-bottom: 1px solid rgba(212,175,55,0.18);">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color: #271442; border: 1px solid #c8a24a; border-radius: 999px; padding: 5px 16px; margin-bottom: 12px; display: inline-block;">
                    <span style="font-size: 11px; font-weight: 700; color: #f0d48c; letter-spacing: 2px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;">
                      🏛️ ATHENA SUMMIT • OFFICIAL ALLOCATION
                    </span>
                  </td>
                </tr>
              </table>
              <h1 class="header-logo" style="margin: 14px 0 6px; font-size: 28px; font-weight: 800; letter-spacing: 3px; color: #fdf5e2; text-transform: uppercase;">
                PROJECT ATHENA
              </h1>
              <p style="margin: 0; font-size: 13px; color: #b7a9ce; letter-spacing: 0.5px;">
                Diplomatic Allocation Confirmation & Delegate Dossier
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 30px;" class="content-box">
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5; color: #f7f2fc;">
                Distinguished Delegate, <strong style="color: #ffffff;">${registration.name}</strong>,
              </p>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.7; color: #d6cced;">
                We are proud to inform you that your registration and delegate credentials for <strong>Athena Summit</strong> have been officially verified and confirmed by the Executive Secretariat.
              </p>

              <!-- Committee & Portfolio Allocation Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1c0e33; border: 1px solid rgba(212,175,55,0.3); border-radius: 14px; margin: 0 0 26px; overflow: hidden;">
                <tr>
                  <td style="padding: 20px 22px;">
                    <!-- Registration Pass ID -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px;">
                      <tr>
                        <td align="left">
                          <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #b7a9ce;">Delegate Pass ID</span>
                        </td>
                        <td align="right">
                          <span style="font-family: 'JetBrains Mono', Consolas, monospace; font-size: 13px; font-weight: 700; color: #10b981; background: #06291a; border: 1px solid #059669; padding: 2px 8px; border-radius: 6px;">
                            ${registration.id}
                          </span>
                        </td>
                      </tr>
                    </table>

                    <!-- Committee Row -->
                    <div style="margin-bottom: 14px;">
                      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #d4af37; margin-bottom: 4px;">
                        Assigned Committee
                      </div>
                      <div style="font-size: 17px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px;">
                        ${registration.assignedCommittee?.toUpperCase() ?? "TO BE ASSIGNED"}
                      </div>
                    </div>

                    <!-- Portfolio Row -->
                    <div style="margin-bottom: 14px;">
                      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #d4af37; margin-bottom: 4px;">
                        Assigned Portfolio / Country
                      </div>
                      <div style="font-size: 16px; font-weight: 600; color: #fdf5e2;">
                        ${portfolioName}
                      </div>
                    </div>

                    <!-- Agenda Box -->
                    <div>
                      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #d4af37; margin-bottom: 6px;">
                        Committee Agenda
                      </div>
                      <div style="background-color: #10061e; border-left: 3px solid #d4af37; border-radius: 6px; padding: 12px 14px; font-size: 13px; line-height: 1.6; color: #ede3fd;">
                        ${registration.assignedAgenda ?? "Your committee background guide and agenda dossier will be dispatched by the Executive Board shortly."}
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Interactive Resource Cards -->
              <h3 style="margin: 0 0 14px; font-size: 15px; font-weight: 700; color: #f0d48c; letter-spacing: 0.8px; text-transform: uppercase;">
                Delegate Preparation & Resources
              </h3>
              
              <!-- Resource 1: Committee Mandates -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #190b2e; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; margin-bottom: 10px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="left" style="font-size: 13px; color: #ffffff; font-weight: 600;">
                          📜 Official Committee Mandates
                          <span style="display: block; font-size: 11px; color: #b7a9ce; font-weight: 400; margin-top: 2px;">
                            Portfolios, scope of debate, and procedural directives
                          </span>
                        </td>
                        <td align="right" style="padding-left: 10px;">
                          <a href="https://docs.google.com/document/d/1JfSyC2axjha6tuEcZWAUmx7H89vBKMiB/edit?usp=sharing&ouid=107176384204003614650&rtpof=true&sd=true" target="_blank" style="background-color: #2e174e; border: 1px solid #d4af37; color: #f0d48c; font-size: 12px; font-weight: 700; text-decoration: none; padding: 7px 14px; border-radius: 6px; display: inline-block; white-space: nowrap;">
                            View Mandates →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Resource 2: Rules of Procedure -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #190b2e; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="left" style="font-size: 13px; color: #ffffff; font-weight: 600;">
                          ⚖️ Official Rules of Procedure (RoPs)
                          <span style="display: block; font-size: 11px; color: #b7a9ce; font-weight: 400; margin-top: 2px;">
                            Points, motions, voting decorum & resolution drafting rules
                          </span>
                        </td>
                        <td align="right" style="padding-left: 10px;">
                          <a href="https://drive.google.com/file/d/1LAKqRpIpe-p48llbc92m8jHwtT9fFdTF/view?usp=sharing" target="_blank" style="background-color: #2e174e; border: 1px solid #d4af37; color: #f0d48c; font-size: 12px; font-weight: 700; text-decoration: none; padding: 7px 14px; border-radius: 6px; display: inline-block; white-space: nowrap;">
                            Download RoPs →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding: 6px 0 10px;">
                    <a href="https://projectathena.site/events/athena-summit" target="_blank" style="background: #d4af37 linear-gradient(135deg, #e5c158 0%, #c49a2a 100%); color: #0f061d; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 999px; display: inline-block; letter-spacing: 0.8px; text-transform: uppercase; box-shadow: 0 6px 20px rgba(212,175,55,0.35);">
                      Open Conference Portal
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #0b0416; padding: 22px 24px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #a497bd;">
                © ${currentYear} Project Athena. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 11px; font-family: monospace; color: #7f709a;">
                Assigned Registration ID: ${registration.id}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Generates a high-contrast, prestigious Boarding Pass Ticket email for the Athena MUN Picnic
 */
export function generatePicnicApprovalEmailHtml(registration: Registration): string {
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Athena MUN Picnic: Official Delegate Entry Pass</title>
  <style type="text/css">
    ${emailStyles}
  </style>
</head>
<body style="background-color: #080410; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Outer Table Wrapper -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080410; min-height: 100%;">
    <tr>
      <td align="center" style="padding: 32px 12px;" class="email-wrapper">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background: #130a21 linear-gradient(180deg, #1d0f36 0%, #10061e 100%); border: 1px solid #4a3469; border-top: 4px solid #d4af37; border-radius: 18px; box-shadow: 0 16px 44px rgba(0,0,0,0.5); overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" style="padding: 34px 28px 22px; text-align: center; border-bottom: 1px solid rgba(212,175,55,0.18);">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color: #06291a; border: 1px solid #059669; border-radius: 999px; padding: 5px 16px; margin-bottom: 12px; display: inline-block;">
                    <span style="font-size: 11px; font-weight: 700; color: #34d399; letter-spacing: 1.8px; text-transform: uppercase; font-family: monospace;">
                      ✅ OFFICIAL ENTRY PASS • ₹100 VERIFIED
                    </span>
                  </td>
                </tr>
              </table>
              <h1 class="header-logo" style="margin: 14px 0 6px; font-size: 28px; font-weight: 800; letter-spacing: 3px; color: #fdf5e2; text-transform: uppercase;">
                PROJECT ATHENA
              </h1>
              <p style="margin: 0; font-size: 13px; color: #b7a9ce; letter-spacing: 0.5px;">
                Athena MUN Picnic: Training Workshop • Potluck • Diplomatic Games
              </p>
            </td>
          </tr>

          <!-- Pass Content -->
          <tr>
            <td style="padding: 30px 28px;" class="content-box">
              <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.5; color: #ffffff;">
                Greetings, <strong>${registration.name}</strong>,
              </p>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.7; color: #d6cced;">
                Your registration and ₹100 payment receipt for the <strong>Athena MUN Picnic</strong> have been verified by the Secretariat. Your official delegate entry pass is active below:
              </p>

              <!-- Digital Ticket / Boarding Pass Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1a0c30; border: 2px dashed #d4af37; border-radius: 14px; margin-bottom: 26px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.35);">
                <!-- Ticket Header -->
                <tr>
                  <td style="background-color: #271444; padding: 14px 20px; border-bottom: 1px solid rgba(212,175,55,0.25);">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="left">
                          <span style="font-size: 11px; font-weight: 700; color: #f0d48c; letter-spacing: 1.5px; text-transform: uppercase; font-family: monospace;">
                            DELEGATE ADMISSION PASS
                          </span>
                        </td>
                        <td align="right">
                          <span style="font-size: 11px; font-weight: 700; color: #34d399; font-family: monospace;">
                            CONFIRMED & ACTIVE
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Ticket Details -->
                <tr>
                  <td style="padding: 22px 22px 18px;">
                    <!-- Row 1: Delegate Name & Pass ID -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 14px;">
                      <tr>
                        <td align="left" style="vertical-align: top;">
                          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #a497bd; margin-bottom: 4px;">
                            Delegate Name
                          </div>
                          <div style="font-size: 17px; font-weight: 700; color: #ffffff;">
                            ${registration.name}
                          </div>
                        </td>
                        <td align="right" style="vertical-align: top;">
                          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #a497bd; margin-bottom: 4px;">
                            Registration Pass ID
                          </div>
                          <div style="font-family: 'JetBrains Mono', Consolas, monospace; font-size: 15px; font-weight: 700; color: #f0d48c; background: #0c0417; border: 1px solid #c8a24a; padding: 4px 10px; border-radius: 6px; display: inline-block;">
                            ${registration.id}
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Row 2: Date & Time -->
                    <div style="margin-bottom: 14px;">
                      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #d4af37; margin-bottom: 4px;">
                        📅 Event Date & Time
                      </div>
                      <div style="font-size: 15px; font-weight: 600; color: #ffffff;">
                        Sunday, 11th October | 12:00 PM to 5:00 PM IST
                      </div>
                    </div>

                    <!-- Row 3: Venue & Detailed Address -->
                    <div style="margin-bottom: 14px;">
                      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #d4af37; margin-bottom: 4px;">
                        📍 Venue Location
                      </div>
                      <div style="font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 2px;">
                        Energy Park, Patna
                      </div>
                      <div style="font-size: 12px; line-height: 1.5; color: #d3c7eb;">
                        Road No. 1, North Patel Nagar, East Patel Nagar, Adarsh Colony, Rajbansi Nagar, Patna, Bihar 800023
                      </div>
                    </div>

                    ${
                      registration.foodPreference
                        ? `
                    <!-- Row 4: Potluck & Food Preference -->
                    <div style="margin-bottom: 14px; background: #0c0417; border-left: 3px solid #10b981; padding: 10px 14px; border-radius: 6px;">
                      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #34d399; margin-bottom: 2px;">
                        🍱 Potluck Contribution / Dietary Note
                      </div>
                      <div style="font-size: 13px; font-weight: 500; color: #ede3fd;">
                        ${registration.foodPreference}
                      </div>
                    </div>
                    `
                        : ""
                    }

                    <!-- Map CTA Button Inside Pass -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 18px;">
                      <tr>
                        <td align="center">
                          <a href="https://www.google.com/maps/search/?api=1&query=Energy+Park+Patna" target="_blank" style="background-color: #271444; border: 1px solid #d4af37; color: #f0d48c; font-size: 13px; font-weight: 700; text-decoration: none; padding: 10px 22px; border-radius: 999px; display: inline-block;">
                            📍 Get Directions to Energy Park (Google Maps) →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Detailed Itinerary Schedule -->
              <h3 style="margin: 0 0 12px; font-size: 15px; font-weight: 700; color: #f0d48c; letter-spacing: 0.8px; text-transform: uppercase;">
                Picnic Day Timeline
              </h3>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #160a2b; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; margin-bottom: 24px; padding: 14px 18px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #ede3fd; line-height: 1.6;">
                    <strong style="color: #f0d48c;">12:00 PM – 2:00 PM:</strong> Clause 4: Learn — Training Workshop by Eldr Education<br/>
                    <strong style="color: #f0d48c;">2:00 PM – 3:00 PM:</strong> Clause 1: Eat — Community Potluck Lunch<br/>
                    <strong style="color: #f0d48c;">3:00 PM – 4:30 PM:</strong> Clause 2: Play & Clause 3: Network — Interactive Games & Crisis Scenarios<br/>
                    <strong style="color: #f0d48c;">4:30 PM – 5:00 PM:</strong> Signatories & Wrap-up: Photos, Official Passes & Awards (No vetoes accepted!)
                  </td>
                </tr>
              </table>

              <!-- Entry Protocol -->
              <h3 style="margin: 0 0 10px; font-size: 14px; font-weight: 700; color: #d4af37; letter-spacing: 0.5px;">
                Gate Entry & Guidelines
              </h3>
              <ul style="margin: 0 0 20px; padding-left: 20px; font-size: 13px; color: #d6cced; line-height: 1.7;">
                <li>Please show this pass email or state your <strong>Pass ID (${registration.id})</strong> at the Energy Park entrance.</li>
                <li>Bring a notebook/pen or tablet for the interactive training workshop.</li>
                <li>Bring your potluck contribution (snack or dish) to share with fellow delegates.</li>
                <li>Attire: Smart Casual / Comfortable Picnic Outfits.</li>
              </ul>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #0b0416; padding: 22px 24px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
              <p style="margin: 0 0 4px; font-size: 12px; color: #a497bd;">
                © ${currentYear} Project Athena. Powered by Eldr.
              </p>
              <p style="margin: 0; font-size: 11px; color: #7f709a;">
                Energy Park, Patna • Sunday, 11th October 2026 • 12:00 PM – 5:00 PM
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Generates an instantaneous receipt email upon picnic registration submission (Under Verification)
 */
export function generatePicnicSubmissionEmailHtml(registration: Registration): string {
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Athena MUN Picnic: Registration Received</title>
  <style type="text/css">
    ${emailStyles}
  </style>
</head>
<body style="background-color: #080410; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080410; min-height: 100%;">
    <tr>
      <td align="center" style="padding: 32px 12px;" class="email-wrapper">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background: #130a21 linear-gradient(180deg, #1b0e33 0%, #10061e 100%); border: 1px solid #4a3469; border-top: 4px solid #f59e0b; border-radius: 18px; box-shadow: 0 16px 44px rgba(0,0,0,0.5); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 34px 28px 22px; text-align: center; border-bottom: 1px solid rgba(245,158,11,0.2);">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color: #2b1b06; border: 1px solid #d97706; border-radius: 999px; padding: 5px 16px; margin-bottom: 12px; display: inline-block;">
                    <span style="font-size: 11px; font-weight: 700; color: #fbbf24; letter-spacing: 1.8px; text-transform: uppercase; font-family: monospace;">
                      ⏳ PAYMENT UNDER REVIEW
                    </span>
                  </td>
                </tr>
              </table>
              <h1 class="header-logo" style="margin: 14px 0 6px; font-size: 28px; font-weight: 800; letter-spacing: 3px; color: #fdf5e2; text-transform: uppercase;">
                PROJECT ATHENA
              </h1>
              <p style="margin: 0; font-size: 13px; color: #b7a9ce;">
                Athena MUN Picnic Registration Acknowledgment
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px 28px;" class="content-box">
              <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.5; color: #ffffff;">
                Dear <strong>${registration.name}</strong>,
              </p>
              <p style="margin: 0 0 22px; font-size: 14px; line-height: 1.7; color: #d6cced;">
                Thank you for registering for the <strong>Athena MUN Picnic</strong> on <strong>Sunday, 11th October</strong> at <strong>Energy Park, Patna</strong>. We have successfully logged your application and ₹100 payment receipt.
              </p>

              <!-- Summary Receipt Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #190c2e; border: 1px solid rgba(245,158,11,0.3); border-radius: 12px; margin-bottom: 24px; padding: 18px 20px;">
                <tr>
                  <td>
                    <div style="margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 10px;">
                      <span style="font-size: 11px; text-transform: uppercase; color: #a497bd; letter-spacing: 1px;">Registration ID</span>
                      <div style="font-family: 'JetBrains Mono', Consolas, monospace; font-size: 15px; font-weight: 700; color: #fbbf24; margin-top: 2px;">
                        ${registration.id}
                      </div>
                    </div>
                    <div style="margin-bottom: 12px;">
                      <span style="font-size: 11px; text-transform: uppercase; color: #a497bd; letter-spacing: 1px;">Event & Date</span>
                      <div style="font-size: 14px; font-weight: 600; color: #ffffff; margin-top: 2px;">
                        Athena MUN Picnic • 11th October 2026 (12:00 PM – 5:00 PM)
                      </div>
                    </div>
                    <div style="margin-bottom: 12px;">
                      <span style="font-size: 11px; text-transform: uppercase; color: #a497bd; letter-spacing: 1px;">Venue</span>
                      <div style="font-size: 14px; font-weight: 600; color: #ffffff; margin-top: 2px;">
                        Energy Park, Patna
                      </div>
                    </div>
                    <div>
                      <span style="font-size: 11px; text-transform: uppercase; color: #a497bd; letter-spacing: 1px;">Status</span>
                      <div style="font-size: 13px; font-weight: 700; color: #fbbf24; margin-top: 2px;">
                        Screenshot Submitted (Pending Secretariat Approval)
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- What happens next -->
              <h3 style="margin: 0 0 10px; font-size: 14px; font-weight: 700; color: #f0d48c; letter-spacing: 0.5px;">
                What Happens Next?
              </h3>
              <p style="margin: 0 0 18px; font-size: 13px; line-height: 1.7; color: #d6cced;">
                Our Secretariat team is cross-verifying your UPI transaction ID. Once approved, your official digital entry pass with gate verification credentials and potluck details will be sent directly to <strong>${registration.email}</strong>.
              </p>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://projectathena.site/events/mun-picnic" target="_blank" style="background-color: #271444; border: 1px solid #d4af37; color: #f0d48c; font-size: 13px; font-weight: 700; text-decoration: none; padding: 11px 24px; border-radius: 999px; display: inline-block;">
                      View Event Page & Details →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #0b0416; padding: 22px 24px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
              <p style="margin: 0 0 4px; font-size: 12px; color: #a497bd;">
                © ${currentYear} Project Athena. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 11px; color: #7f709a;">
                Need help? Contact project.athena03@gmail.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Generates an action-required payment clarification / rejection email
 */
export function generateRejectionEmailHtml(registration: Registration, reason?: string): string {
  const currentYear = new Date().getFullYear();
  const isPicnic = registration.eventSlug === "mun-picnic";
  const eventName = isPicnic ? "Athena MUN Picnic" : "Athena Summit 2026";
  const resubmitUrl = isPicnic
    ? "https://projectathena.site/events/mun-picnic"
    : "https://projectathena.site/events/athena-summit";

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${eventName}: Payment Verification Update</title>
  <style type="text/css">
    ${emailStyles}
  </style>
</head>
<body style="background-color: #080410; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080410; min-height: 100%;">
    <tr>
      <td align="center" style="padding: 32px 12px;" class="email-wrapper">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background: #130a21 linear-gradient(180deg, #1b0c2a 0%, #10061e 100%); border: 1px solid #5a2838; border-top: 4px solid #ef4444; border-radius: 18px; box-shadow: 0 16px 44px rgba(0,0,0,0.5); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 34px 28px 22px; text-align: center; border-bottom: 1px solid rgba(239,68,68,0.2);">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color: #280e14; border: 1px solid #dc2626; border-radius: 999px; padding: 5px 16px; margin-bottom: 12px; display: inline-block;">
                    <span style="font-size: 11px; font-weight: 700; color: #f87171; letter-spacing: 1.8px; text-transform: uppercase; font-family: monospace;">
                      ⚠️ ACTION REQUIRED • PAYMENT VERIFICATION
                    </span>
                  </td>
                </tr>
              </table>
              <h1 class="header-logo" style="margin: 14px 0 6px; font-size: 28px; font-weight: 800; letter-spacing: 3px; color: #fdf5e2; text-transform: uppercase;">
                PROJECT ATHENA
              </h1>
              <p style="margin: 0; font-size: 13px; color: #b7a9ce;">
                ${eventName} Registration Update
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px 28px;" class="content-box">
              <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.5; color: #ffffff;">
                Dear <strong>${registration.name}</strong>,
              </p>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.7; color: #d6cced;">
                Thank you for applying for <strong>${eventName}</strong>. During verification of your registration details, our Secretariat team was unable to validate your payment receipt screenshot.
              </p>

              <!-- Reason Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1c0b16; border: 1px solid rgba(239,68,68,0.35); border-left: 4px solid #ef4444; border-radius: 10px; margin-bottom: 22px; padding: 16px 18px;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #f87171; margin-bottom: 4px;">
                      Verification Note
                    </div>
                    <div style="font-size: 14px; line-height: 1.6; color: #fecdd3;">
                      ${reason || "The uploaded payment screenshot could not be confirmed or the UPI reference number was illegible."}
                    </div>
                  </td>
                </tr>
              </table>

              <h3 style="margin: 0 0 10px; font-size: 14px; font-weight: 700; color: #f0d48c; letter-spacing: 0.5px;">
                How to Resolve This:
              </h3>
              <ol style="margin: 0 0 24px; padding-left: 20px; font-size: 13px; color: #d6cced; line-height: 1.7;">
                <li>Reply directly to this email with your transaction ID / screenshot.</li>
                <li>Or write to our Secretariat team at <a href="mailto:project.athena03@gmail.com" style="color: #f0d48c; text-decoration: underline;">project.athena03@gmail.com</a> with your <strong>Registration ID (${registration.id})</strong>.</li>
                <li>Alternatively, you can re-upload your screenshot via the official event portal.</li>
              </ol>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${resubmitUrl}" target="_blank" style="background: #ef4444 linear-gradient(135deg, #f87171 0%, #dc2626 100%); color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 13px 28px; border-radius: 999px; display: inline-block; box-shadow: 0 6px 20px rgba(239,68,68,0.3);">
                      Visit Registration Portal →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #0b0416; padding: 22px 24px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
              <p style="margin: 0 0 4px; font-size: 12px; color: #a497bd;">
                © ${currentYear} Project Athena. Registration ID: ${registration.id}
              </p>
              <p style="margin: 0; font-size: 11px; color: #7f709a;">
                Secretariat Desk: project.athena03@gmail.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
