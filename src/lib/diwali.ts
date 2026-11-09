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
 * Helper to extract the numeric summit sequence number from any delegate ID.
 * Handles:
 * - "ATH-SUMMIT-079" -> 79
 * - "ATH-SUMMIT-081" -> 81
 * - 100079 -> 79
 * - 100081 -> 81
 * - "100081" -> 81
 * - 81 -> 81
 */
export function extractSummitNumber(id: string | number | undefined): number {
  if (id === undefined || id === null) return 0;
  if (typeof id === "number") {
    if (id >= 100000 && id < 200000) return id - 100000;
    return id;
  }
  const str = String(id).trim();
  const match = str.match(/ATH-SUMMIT-(\d+)/i);
  if (match) return parseInt(match[1], 10);
  const digits = parseInt(str.replace(/\D/g, ""), 10);
  if (isNaN(digits)) return 0;
  if (digits >= 100000 && digits < 200000) return digits - 100000;
  return digits;
}

/**
 * Calculates the exact fee for a specific registration.
 * - Picnic registrations: ₹100
 * - First 75 Summit registrations (IDs <= ATH-SUMMIT-079 / 100079 or registered <= Nov 9 12:00 PM IST): ₹1,000 (Early Bird)
 * - Registrations after the 75th (IDs >= ATH-SUMMIT-081 / 100081 / registered after 12:00 PM IST): ₹1,300 (Regular Price)
 */
export function getRegistrationFeeForRecord(reg: {
  eventSlug?: string;
  createdAt?: string;
  id?: string | number;
}): number {
  if (reg.eventSlug === "mun-picnic") {
    return 100;
  }

  // The 75th approved summit delegate was ATH-SUMMIT-079 (numeric 79 / 100079),
  // submitted at 11:59:54 AM IST (just before the 12:00 PM IST deadline).
  // First 75 summit delegates are strictly capped up to summit #79.
  const summitNum = extractSummitNumber(reg.id);
  if (summitNum > 0 && summitNum <= 79) {
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

  // From registration #76 onwards after deadline (ATH-SUMMIT-081+ / after 12:00 PM)
  return DIWALI_PRICING.originalFee; // 1300
}
