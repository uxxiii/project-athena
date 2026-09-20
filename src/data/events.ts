import type { SummitEvent } from "@/lib/types";
import { committees } from "./committees";
import { isRegistrationLaunched } from "@/lib/pricing";

export const events: SummitEvent[] = [
  {
    slug: "athena-summit",
    title: "Athena Summit",
    subtitle: "Where Diplomacy Meets Excellence",
    date: "October 2026",
    location: "TBA",
    description:
      "Project Athena's flagship summit: a distinguished diplomatic experience bringing together delegates from across institutions.",
    longDescription:
      "The Athena Summit represents the pinnacle of collegiate diplomacy, offering a carefully curated summit experience designed for delegates who seek intellectual rigour, procedural excellence, and meaningful debate on pressing global issues. From crisis committees to specialized agencies, every session is crafted to challenge, inspire, and transform.",
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
        name: "Saanwi Gupta",
        role: "Secretary General",
        image: "/Saanwi.jpeg",
      },
      {
        id: "high-table-4",
        name: "Siddhant Gautam",
        role: "Chief Advisor",
        image: "/Siddhant.jpeg",
      },
    ],
    get registrationOpen() {
      return isRegistrationLaunched();
    },
  },
  {
    slug: "mun-picnic",
    title: "Athena MUN Picnic",
    subtitle: "Training Workshop • Potluck • Diplomatic Games",
    date: "27th September",
    time: "12:00 PM – 5:00 PM",
    location: "Buddha Smriti Park, Patna",
    description:
      "An immersive diplomatic gathering featuring a high-impact MUN training workshop, community potluck lunch, and interactive diplomacy simulation games.",
    longDescription:
      "Project Athena cordially invites delegates, MUN enthusiasts, and aspiring diplomats to our MUN Picnic at Buddha Smriti Park, Patna. This special one-day experience blends intensive procedural training, resolution drafting tactics, and unmoderated caucus simulations with a delightful shared community potluck and lively diplomatic games. Strictly capped at 100 seats to ensure close mentorship and personal interaction.",
    committees: [],
    price: 100,
    capacity: 100,
    features: [
      "Hands-on MUN Training & Strategy Workshop",
      "Interactive Diplomacy & Crisis Simulation Games",
      "Delightful Community Potluck Lunch & Networking",
      "Mentorship from Seasoned Executive Board Members",
      "Official Project Athena Delegate Participation Pass",
    ],
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Buddha+Smriti+Park+Patna&t=&z=15&ie=UTF8&iwloc=&output=embed",
    mapDirectionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Buddha+Smriti+Park+Patna",
    team: [
      {
        id: "picnic-team-1",
        name: "Devpreeti Mukherji",
        role: "Founder",
        image: "/devpreeti.jpeg",
      },
      {
        id: "picnic-team-2",
        name: "Saanwi Gupta",
        role: "Secretary General",
        image: "/Saanwi.jpeg",
      },
      {
        id: "picnic-team-4",
        name: "Siddhant Gautam",
        role: "Chief Advisor",
        image: "/Siddhant.jpeg",
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
