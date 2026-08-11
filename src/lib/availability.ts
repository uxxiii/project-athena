import { committees, getCommitteeById } from "@/data/committees";
import type { AvailabilitySnapshot, Registration } from "@/lib/types";
import { readRegistrations } from "@/lib/storage";

export function buildAvailabilityFromRegistrations(
  registrations: Registration[]
): AvailabilitySnapshot {
  const approvedOrPending = registrations.filter(
    (r) => r.status !== "rejected" && r.assignedCommittee && r.assignedPortfolio
  );

  const committeesAvailability: AvailabilitySnapshot["committees"] = {};
  const portfoliosAvailability: AvailabilitySnapshot["portfolios"] = {};

  for (const committee of committees) {
    const takenInCommittee = approvedOrPending.filter(
      (r) => r.assignedCommittee === committee.id
    ).length;

    committeesAvailability[committee.id] = {
      total: committee.maxDelegates,
      taken: takenInCommittee,
      available: committee.maxDelegates - takenInCommittee,
      isFull: takenInCommittee >= committee.maxDelegates,
    };

    portfoliosAvailability[committee.id] = {};
    for (const portfolio of committee.portfolios) {
      const isTaken = approvedOrPending.some(
        (r) =>
          r.assignedCommittee === committee.id &&
          r.assignedPortfolio === portfolio.id
      );
      portfoliosAvailability[committee.id][portfolio.id] = {
        taken: isTaken,
      };
    }
  }

  return {
    committees: committeesAvailability,
    portfolios: portfoliosAvailability,
  };
}

export async function getAvailability(): Promise<AvailabilitySnapshot> {
  const registrations = await readRegistrations();
  return buildAvailabilityFromRegistrations(registrations);
}

export function isCommitteeAvailable(
  availability: AvailabilitySnapshot,
  committeeId: string
): boolean {
  return !availability.committees[committeeId]?.isFull;
}

export function isPortfolioAvailable(
  availability: AvailabilitySnapshot,
  committeeId: string,
  portfolioId: string
): boolean {
  return !availability.portfolios[committeeId]?.[portfolioId]?.taken;
}

export function getAvailablePortfolios(
  availability: AvailabilitySnapshot,
  committeeId: string
): string[] {
  const committee = getCommitteeById(committeeId);
  if (!committee) return [];

  return committee.portfolios
    .filter((p) => isPortfolioAvailable(availability, committeeId, p.id))
    .map((p) => p.id);
}
