import {
  isDiwaliSaleActive,
  isChildrensDaySaleActive,
  isRegistrationPausedForChildrensDaySale,
  isChildrensDaySaleRecord,
  getCurrentRegistrationFee,
  DIWALI_PRICING,
  DIWALI_SALE_DEADLINE_ISO,
  CHILDRENS_DAY_PAUSE_START_ISO,
  CHILDRENS_DAY_PAUSE_END_ISO,
  CHILDRENS_DAY_SALE_START_ISO,
  CHILDRENS_DAY_SALE_END_ISO,
  CHILDRENS_DAY_SALE_FEE,
  getRegistrationFeeForRecord,
} from "./diwali";
export {
  isDiwaliSaleActive,
  isChildrensDaySaleActive,
  isRegistrationPausedForChildrensDaySale,
  isChildrensDaySaleRecord,
  getCurrentRegistrationFee,
  DIWALI_PRICING,
  CHILDRENS_DAY_PAUSE_START_ISO,
  CHILDRENS_DAY_PAUSE_END_ISO,
  CHILDRENS_DAY_SALE_START_ISO,
  CHILDRENS_DAY_SALE_END_ISO,
  CHILDRENS_DAY_SALE_FEE,
  getRegistrationFeeForRecord,
} from "./diwali";

// Registration temporarily closed from 8:50 PM – 9:00 PM IST on Nov 14, reopens at 9:00 PM IST for Children's Day Sale
export const REGISTRATION_OPEN_DATE_ISO = CHILDRENS_DAY_PAUSE_END_ISO;

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
  // Closed for 10 minutes from 8:50 PM to 9:00 PM IST on Nov 14 before Children's Day Sale opens at 9:00 PM
  if (isRegistrationPausedForChildrensDaySale()) {
    return false;
  }
  return true;
}

export function isEarlyBirdActive(): boolean {
  return isDiwaliSaleActive() || isChildrensDaySaleActive();
}

export function getPricing(isUnsc: boolean = false) {
  const config = isUnsc ? PRICING_CONFIG.unsc : PRICING_CONFIG.normal;
  const isChildrensSale = isChildrensDaySaleActive();
  const isFestiveOffer = isDiwaliSaleActive();
  const effectivePrice = isChildrensSale
    ? CHILDRENS_DAY_SALE_FEE
    : isFestiveOffer
      ? config.earlyBirdPrice
      : config.normalPrice;
  return {
    ...config,
    isEarlyBird: isFestiveOffer || isChildrensSale,
    effectivePrice,
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

export function calculateTimeRemaining(targetIsoDate: string = CHILDRENS_DAY_SALE_END_ISO) {
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
