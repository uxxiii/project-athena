import { isDiwaliSaleActive, getCurrentRegistrationFee, DIWALI_PRICING, DIWALI_SALE_DEADLINE_ISO, getRegistrationFeeForRecord } from "./diwali";
export { isDiwaliSaleActive, getCurrentRegistrationFee, DIWALI_PRICING, getRegistrationFeeForRecord } from "./diwali";

// Registration temporarily closed — reopens at 8:15 PM IST
export const REGISTRATION_OPEN_DATE_ISO = "2026-11-07T20:15:00+05:30";

// Diwali Special Sale Deadline: 9th Nov 12:00 PM (Noon) IST
export const EARLY_BIRD_DEADLINE_ISO = DIWALI_SALE_DEADLINE_ISO;
export const REGISTRATION_FEE = 1300;
export const DIWALI_DISCOUNTED_FEE = 1000;

export interface CommitteePricing {
  label: string;
  earlyBirdPrice: number;
  normalPrice: number;
  discountAmount: number;
  discountPercent: number;
}

export const PRICING_CONFIG: { normal: CommitteePricing; unsc: CommitteePricing } = {
  normal: {
    label: "Delegate Registration",
    earlyBirdPrice: DIWALI_DISCOUNTED_FEE,
    normalPrice: 1300,
    discountAmount: 300,
    discountPercent: 23,
  },
  unsc: {
    label: "UNSC Delegate Registration",
    earlyBirdPrice: DIWALI_DISCOUNTED_FEE,
    normalPrice: 1300,
    discountAmount: 300,
    discountPercent: 23,
  },
};

export function isRegistrationLaunched(): boolean {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_REGISTRATION_OPEN === "false") {
    return false;
  }
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_REGISTRATION_OPEN === "true") {
    return true;
  }
  return new Date().getTime() >= new Date(REGISTRATION_OPEN_DATE_ISO).getTime();
}

export function isEarlyBirdActive(): boolean {
  return isDiwaliSaleActive();
}

export function getPricing(isUnsc: boolean = false) {
  const config = isUnsc ? PRICING_CONFIG.unsc : PRICING_CONFIG.normal;
  const isFestiveOffer = isDiwaliSaleActive();
  return {
    ...config,
    isEarlyBird: isFestiveOffer,
    effectivePrice: isFestiveOffer ? config.earlyBirdPrice : config.normalPrice,
  };
}

export function calculateRegistrationLaunchTimeRemaining(targetIsoDate: string = REGISTRATION_OPEN_DATE_ISO) {
  const target = new Date(targetIsoDate).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  if (difference <= 0 || isRegistrationLaunched()) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isLaunched: true,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    isLaunched: false,
  };
}

export function calculateTimeRemaining(targetIsoDate: string = EARLY_BIRD_DEADLINE_ISO) {
  const target = new Date(targetIsoDate).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
}
