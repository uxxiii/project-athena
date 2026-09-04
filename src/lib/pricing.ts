export const REGISTRATION_OPEN_DATE_ISO = "2026-09-05T17:00:00+05:30";
export const EARLY_BIRD_DEADLINE_ISO = "2026-09-10T23:59:59+05:30";

export interface CommitteePricing {
  label: string;
  earlyBirdPrice: number;
  normalPrice: number;
  discountAmount: number;
  discountPercent: number;
}

export const PRICING_CONFIG: { normal: CommitteePricing; unsc: CommitteePricing } = {
  normal: {
    label: "Normal Committee",
    earlyBirdPrice: 1600,
    normalPrice: 1600,
    discountAmount: 0,
    discountPercent: 0,
  },
  unsc: {
    label: "UNSC Double Delegation",
    earlyBirdPrice: 3200,
    normalPrice: 3200,
    discountAmount: 0,
    discountPercent: 0,
  },
};

export function isRegistrationLaunched(): boolean {
  return false;
}

export function isEarlyBirdActive(): boolean {
  return false;
}

export function getPricing(isUnsc: boolean) {
  const config = isUnsc ? PRICING_CONFIG.unsc : PRICING_CONFIG.normal;
  return {
    ...config,
    isEarlyBird: false,
    effectivePrice: config.normalPrice,
  };
}

export function calculateRegistrationLaunchTimeRemaining(targetIsoDate: string = REGISTRATION_OPEN_DATE_ISO) {
  const target = new Date(targetIsoDate).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  if (difference <= 0) {
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
