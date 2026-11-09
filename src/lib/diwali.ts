/**
 * Diwali Festive Season Configuration
 * Controls the festive decorations, Diwali sale pricing, and kaju katli celebrations.
 * Automatically reverts to default theme when the festive season ends.
 */

export const DIWALI_FESTIVE_END_ISO = "2026-11-15T23:59:59+05:30";
export const DIWALI_SALE_DEADLINE_ISO = "2026-11-09T12:00:00+05:30";

export const DIWALI_PRICING = {
  originalFee: 1300,
  festiveFee: 1000,
  SALE_FEE: 1000,
  discount: 300,
  discountPercent: 23,
  validUntilFormatted: "9th November, 12:00 PM (Noon)",
};

/**
 * Checks if the Diwali festive theme decorations should be displayed.
 * Enabled through mid-November 2026 or via NEXT_PUBLIC_DIWALI_SEASON=true.
 */
export function isDiwaliSeason(): boolean {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_DIWALI_SEASON === "false") {
    return false;
  }
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_DIWALI_SEASON === "true") {
    return true;
  }
  const now = new Date().getTime();
  const end = new Date(DIWALI_FESTIVE_END_ISO).getTime();
  return now <= end;
}

/**
 * Checks if the early bird Diwali sale price (₹1,000) is currently active.
 * Valid until 9th November 12:00 PM.
 */
export function isDiwaliSaleActive(): boolean {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_DIWALI_SALE === "false") {
    return false;
  }
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_DIWALI_SALE === "true") {
    return true;
  }
  const now = new Date().getTime();
  const deadline = new Date(DIWALI_SALE_DEADLINE_ISO).getTime();
  return now <= deadline;
}

export function getCurrentRegistrationFee(): number {
  return isDiwaliSaleActive() ? DIWALI_PRICING.festiveFee : DIWALI_PRICING.originalFee;
}

/**
 * Calculates the exact fee for a specific registration.
 * - Picnic registrations: ₹100
 * - First 75 Summit registrations (IDs <= 100079 or created <= Nov 9 12:00 PM IST): ₹1,000 (Diwali Sale)
 * - Registrations after the 75th (IDs > 100079 / registered after 12:00 PM): ₹1,300 (Regular Price)
 */
export function getRegistrationFeeForRecord(reg: {
  eventSlug?: string;
  createdAt?: string;
  id?: string | number;
}): number {
  if (reg.eventSlug === "mun-picnic") {
    return 100;
  }

  // Parse numeric sequence from ID (e.g. 100045, "ATH-SUMMIT-045", 100079)
  // The 75th approved summit delegate was ATH-SUMMIT-079 (100079) registered at 11:59:54 AM IST.
  const numericId =
    typeof reg.id === "string"
      ? parseInt(reg.id.replace(/\D/g, ""), 10)
      : typeof reg.id === "number"
      ? reg.id
      : 0;

  // First 75 summit delegates capped up to ID 100079
  if (numericId > 0 && numericId <= 100079) {
    return DIWALI_PRICING.festiveFee; // 1000
  }

  // Check timestamp (normalize to UTC if lacking timezone offset from database)
  if (reg.createdAt) {
    const normalized = /Z|[+-]\d{2}:?\d{2}$/.test(reg.createdAt)
      ? reg.createdAt
      : `${reg.createdAt}Z`;
    const createdTime = new Date(normalized).getTime();
    const deadlineTime = new Date(DIWALI_SALE_DEADLINE_ISO).getTime();
    if (!isNaN(createdTime) && createdTime <= deadlineTime) {
      return DIWALI_PRICING.festiveFee; // 1000
    }
  }

  // From registration #76 onwards after deadline
  return DIWALI_PRICING.originalFee; // 1300
}
