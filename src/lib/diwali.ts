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
