import type { SummitEvent } from "@/lib/types";
import { committees } from "./committees";

export const events: SummitEvent[] = [
  {
    slug: "athena-summit",
    title: "Athena Summit",
    subtitle: "Where Diplomacy Meets Excellence",
    date: "October 2026",
    location: "TBA",
    description:
      "Project Athena's flagship summit — a distinguished diplomatic experience bringing together delegates from across institutions.",
    longDescription:
      "The Athena Summit represents the pinnacle of collegiate diplomacy — a carefully curated summit experience designed for delegates who seek intellectual rigour, procedural excellence, and meaningful debate on pressing global issues. From crisis committees to specialized agencies, every session is crafted to challenge, inspire, and transform.",
    committees: committees.map((c) => c.id),
    brochureUrl: "/brochure/athena-summit.pdf",
    team: [
      {
        id: "high-table-1",
        name: "Devpreeti Mukherji",
        role: "Founder",
        image: "/devpreeti.jpeg",
      },
      {
        id: "high-table-2",
        name: "Aparna Sharma",
        role: "Secretary General",
        image: "/Aparna.jpeg",
      },
      {
        id: "high-table-3",
        name: "Anila Fatima",
        role: "Deputy Secretary General",
        image: "/images/team/placeholder.png",
      },
      {
        id: "high-table-4",
        name: "Siddhant Gautam",
        role: "Chief Advisor",
        image: "/images/team/placeholder.png",
      },
      {
        id: "high-table-5",
        name: "Vaishnavi Singh",
        role: "Director General",
        image: "/Vaishnavi.jpeg",
      },
    ],
    registrationOpen: true,
  },
];

export function getEventBySlug(slug: string): SummitEvent | undefined {
  return events.find((e) => e.slug === slug);
}

export function getLatestUpcomingEvent(): SummitEvent | undefined {
  return events[0];
}
