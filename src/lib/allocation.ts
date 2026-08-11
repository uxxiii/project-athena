import { getCommitteeById } from "@/data/committees";
import type { AvailabilitySnapshot, RegistrationInput } from "@/lib/types";
import {
  getAvailablePortfolios,
  isCommitteeAvailable,
  isPortfolioAvailable,
} from "@/lib/availability";

export interface AllocationResult {
  committeeId: string;
  portfolioId: string;
  agenda: string;
}

export function allocateDelegate(
  input: RegistrationInput,
  availability: AvailabilitySnapshot
): AllocationResult | null {
  const unscLocked = Boolean(
    input.isUnscRegistration ||
      (input.unscDelegate &&
        input.unscDelegate.name?.trim() &&
        input.unscDelegate.phone?.trim() &&
        input.unscDelegate.email?.trim() &&
        input.unscDelegate.classYear?.trim() &&
        input.unscDelegate.institution?.trim())
  );

  const preferences = unscLocked
    ? ["unsc"]
    : input.committeePreferences.filter(Boolean);

  for (const committeeId of preferences) {
    if (!isCommitteeAvailable(availability, committeeId)) continue;

    const sharedPortfolioPrefs =
      committeeId === "unsc"
        ? (input.unscDelegatePortfolioPreferences?.filter(Boolean) ?? [])
        : [];
    const portfolioPrefs =
      sharedPortfolioPrefs.length > 0
        ? sharedPortfolioPrefs
        : (input.portfolioPreferences[committeeId]?.filter(Boolean) ?? []);
    const available = getAvailablePortfolios(availability, committeeId);

    for (const portfolioId of portfolioPrefs) {
      if (
        available.includes(portfolioId) &&
        isPortfolioAvailable(availability, committeeId, portfolioId)
      ) {
        const committee = getCommitteeById(committeeId);
        return {
          committeeId,
          portfolioId,
          agenda: committee?.agenda ?? "",
        };
      }
    }

    const firstAvailable = available.find((pid) =>
      isPortfolioAvailable(availability, committeeId, pid)
    );
    if (firstAvailable) {
      const committee = getCommitteeById(committeeId);
      return {
        committeeId,
        portfolioId: firstAvailable,
        agenda: committee?.agenda ?? "",
      };
    }
  }

  for (const committee of Object.keys(availability.committees)) {
    if (!isCommitteeAvailable(availability, committee)) continue;
    const available = getAvailablePortfolios(availability, committee);
    if (available.length > 0) {
      const c = getCommitteeById(committee);
      return {
        committeeId: committee,
        portfolioId: available[0],
        agenda: c?.agenda ?? "",
      };
    }
  }

  return null;
}

export function applyAllocationToAvailability(
  availability: AvailabilitySnapshot,
  allocation: AllocationResult
): AvailabilitySnapshot {
  const next: AvailabilitySnapshot = JSON.parse(JSON.stringify(availability));

  const committee = next.committees[allocation.committeeId];
  if (committee) {
    committee.taken += 1;
    committee.available = committee.total - committee.taken;
    committee.isFull = committee.taken >= committee.total;
  }

  if (next.portfolios[allocation.committeeId]?.[allocation.portfolioId]) {
    next.portfolios[allocation.committeeId][allocation.portfolioId].taken = true;
  }

  return next;
}
