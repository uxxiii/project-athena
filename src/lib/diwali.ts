/**
 * Festive & Special Day Configuration
 * Controls the Children's Day (14th November) revamp, festive decorations, and special celebrations.
 * Automatically reverts to default theme at 12:00 midnight tonight (2026-11-14T23:59:59+05:30).
 */

export const DIWALI_FESTIVE_END_ISO = "2026-11-14T23:59:59+05:30";
export const CHILDRENS_DAY_START_ISO = "2026-11-14T00:00:00+05:30";
export const CHILDRENS_DAY_END_ISO = "2026-11-14T23:59:59+05:30";
export const DIWALI_SALE_DEADLINE_ISO = "2026-11-09T12:00:00+05:30";

// Children's Day Flash Sale Schedule (14th November 2026)
// 8:50 PM – 9:00 PM IST: Registration paused for 10 minutes
// 9:00 PM – 9:30 PM IST: Children's Day Flash Sale live at ₹1,100 per delegate
export const CHILDRENS_DAY_PAUSE_START_ISO = "2026-11-14T20:50:00+05:30";
export const CHILDRENS_DAY_PAUSE_END_ISO = "2026-11-14T21:00:00+05:30";
export const CHILDRENS_DAY_SALE_START_ISO = "2026-11-14T21:00:00+05:30";
export const CHILDRENS_DAY_SALE_END_ISO = "2026-11-14T21:30:00+05:30";
export const CHILDRENS_DAY_SALE_RECORD_GRACE_END_ISO = "2026-11-14T21:30:59+05:30";
export const CHILDRENS_DAY_SALE_FEE = 1100;

export const DIWALI_PRICING = {
  originalFee: 1300,
  festiveFee: 1000,
  SALE_FEE: 1000,
  childrensDayFee: 1100,
  discount: 300,
  discountPercent: 23,
  validUntilFormatted: "9th November, 12:00 PM (Noon)",
};

/**
 * Checks if today is Children's Day (14th November 2026, until 11:59:59 PM IST).
 */
export function isChildrensDay(): boolean {
  const now = new Date().getTime();
  const start = new Date(CHILDRENS_DAY_START_ISO).getTime();
  const end = new Date(CHILDRENS_DAY_END_ISO).getTime();
  return now >= start && now <= end;
}

/**
 * Milliseconds remaining until Children's Day ends at 12:00 midnight IST.
 */
export function getMsUntilChildrensDayEnd(): number {
  return Math.max(0, new Date(CHILDRENS_DAY_END_ISO).getTime() - Date.now());
}

/**
 * Checks if the festive/special-day theme decorations should be displayed.
 * Automatically expires at 2026-11-14T23:59:59+05:30 (12:00 midnight tonight).
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
 * Checks if registration is currently in the 10-minute pre-sale pause window
 * (8:50 PM to 9:00 PM IST on 14th November 2026).
 */
export function isRegistrationPausedForChildrensDaySale(): boolean {
  const now = Date.now();
  const pauseStart = new Date(CHILDRENS_DAY_PAUSE_START_ISO).getTime();
  const pauseEnd = new Date(CHILDRENS_DAY_PAUSE_END_ISO).getTime();
  return now >= pauseStart && now < pauseEnd;
}

/**
 * Checks if the Children's Day Flash Sale (₹1,100 from 9:00 PM to 9:30 PM IST on 14th Nov) is currently active.
 */
export function isChildrensDaySaleActive(): boolean {
  const now = Date.now();
  const start = new Date(CHILDRENS_DAY_SALE_START_ISO).getTime();
  const end = new Date(CHILDRENS_DAY_SALE_END_ISO).getTime();
  return now >= start && now <= end;
}

/**
 * True before or during the 9:00–9:30 PM Children's Day Sale; false after 9:30 PM IST.
 */
export function isChildrensDaySaleUpcomingOrActive(): boolean {
  return Date.now() <= new Date(CHILDRENS_DAY_SALE_END_ISO).getTime();
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
  if (isChildrensDaySaleActive()) {
    return CHILDRENS_DAY_SALE_FEE; // 1100
  }
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

// Special founder's offer exceptions: IDs granted early-bird price (₹1,000)
export const SPECIAL_EARLY_BIRD_SUMMIT_NUMBERS = new Set([87, 89, 93, 117, 119, 126]);

export function isSpecialEarlyBirdRegistration(
  id: string | number | undefined,
  name?: string
): boolean {
  const num = extractSummitNumber(id);
  if (SPECIAL_EARLY_BIRD_SUMMIT_NUMBERS.has(num)) return true;
  const str = String(id ?? "");
  if (
    str.includes("100087") ||
    str.includes("100089") ||
    str.includes("100093") ||
    str.includes("100117") ||
    str.includes("100119") ||
    str.includes("100126")
  ) {
    return true;
  }
  if (name && /tanya/i.test(name) && num === 117) {
    return true;
  }
  return false;
}

// Special Children's Day Sale exceptions: delegates who made payment within the 9:00–9:30 PM window (₹1,100)
export const SPECIAL_CHILDRENS_DAY_SALE_SUMMIT_NUMBERS = new Set([155, 156]);

/**
 * Checks whether a registration record was submitted during the Children's Day Sale window
 * (14th November 2026, 9:00 PM – 9:30 PM IST) or is an approved sale exception (155, 156).
 */
export function isChildrensDaySaleRecord(reg: {
  eventSlug?: string;
  createdAt?: string;
  id?: string | number;
}): boolean {
  if (reg.eventSlug === "mun-picnic") return false;

  const num = extractSummitNumber(reg.id);
  if (SPECIAL_CHILDRENS_DAY_SALE_SUMMIT_NUMBERS.has(num)) return true;
  const str = String(reg.id ?? "");
  if (str.includes("100155") || str.includes("100156")) return true;

  if (!reg.createdAt) return false;
  const normalized = /Z|[+-]\d{2}:?\d{2}$/.test(reg.createdAt)
    ? reg.createdAt
    : `${reg.createdAt}Z`;
  const createdTime = new Date(normalized).getTime();
  if (isNaN(createdTime)) return false;
  const saleStart = new Date(CHILDRENS_DAY_SALE_START_ISO).getTime();
  const saleEnd = new Date(CHILDRENS_DAY_SALE_RECORD_GRACE_END_ISO).getTime();
  return createdTime >= saleStart && createdTime <= saleEnd;
}

/**
 * Calculates the exact fee for a specific registration.
 * - Picnic registrations: ₹100
 * - First 75 Summit registrations (IDs <= ATH-SUMMIT-079 / 100079 or registered <= Nov 9 12:00 PM IST): ₹1,000 (Early Bird)
 * - Special exceptions: Reg IDs 100087, 100089, 100093, 100117, 100119, 100126 (Founder's Offer): ₹1,000 (Early Bird)
 * - Children's Day Flash Sale (Nov 14, 9:00 PM – 9:30 PM IST): ₹1,100
 * - Regular Summit registrations: ₹1,300 (Regular Price)
 */
export function getRegistrationFeeForRecord(reg: {
  eventSlug?: string;
  createdAt?: string;
  id?: string | number;
  name?: string;
}): number {
  if (reg.eventSlug === "mun-picnic") {
    return 100;
  }

  // Special founder's offer exceptions: Reg IDs 100087, 100089, 100093, 100117, 100119, 100126
  if (isSpecialEarlyBirdRegistration(reg.id, reg.name)) {
    return DIWALI_PRICING.festiveFee; // 1000
  }

  // The 75th approved summit delegate was ATH-SUMMIT-079 (numeric 79 / 100079),
  // submitted at 11:59:54 AM IST (just before the 12:00 PM IST deadline).
  // First 75 summit delegates are strictly capped up to summit #79.
  const summitNum = extractSummitNumber(reg.id);
  if (summitNum > 0 && summitNum <= 79) {
    return DIWALI_PRICING.festiveFee; // 1000
  }

  // Children's Day Flash Sale window (Nov 14, 9:00 PM – 9:30 PM IST): ₹1,100
  if (isChildrensDaySaleRecord(reg)) {
    return CHILDRENS_DAY_SALE_FEE; // 1100
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

  // Regular Price (₹1,300)
  return DIWALI_PRICING.originalFee; // 1300
}
