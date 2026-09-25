import type { Registration } from "@/lib/types";

/**
 * Maps an event slug to its canonical uppercase ID prefix
 */
export function getEventPrefix(eventSlug: string): string {
  switch (eventSlug) {
    case "mun-picnic":
      return "ATH-PICNIC";
    case "athena-summit":
      return "ATH-SUMMIT";
    default: {
      const cleanSlug = eventSlug
        .replace(/^athena-?/, "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "-");
      return `ATH-${cleanSlug || "REG"}`;
    }
  }
}

/**
 * Generates a unique sequential registration ID (e.g. ATH-PICNIC-001, ATH-PICNIC-002).
 * Finds the highest sequential number previously assigned for this event,
 * increments by 1, and pads with zeros (at least 3 digits).
 */
export function generateSequentialRegistrationId(
  eventSlug: string,
  existingRegistrations: Registration[] = []
): string {
  const prefix = getEventPrefix(eventSlug);
  const regex = new RegExp(`^${prefix}-(\\d+)$`, "i");

  let maxNum = 0;
  for (const reg of existingRegistrations) {
    if (reg.id) {
      const match = reg.id.match(regex);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  }

  const eventRegCount = existingRegistrations.filter((r) => r.eventSlug === eventSlug).length;
  let nextNum = Math.max(maxNum + 1, eventRegCount + 1);

  // Guarantee uniqueness
  let candidateId = `${prefix}-${String(nextNum).padStart(3, "0")}`;
  while (existingRegistrations.some((r) => r.id === candidateId)) {
    nextNum++;
    candidateId = `${prefix}-${String(nextNum).padStart(3, "0")}`;
  }

  return candidateId;
}
