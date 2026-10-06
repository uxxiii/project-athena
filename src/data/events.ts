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
        department: "Secretariat",
      },
      {
        id: "high-table-2",
        name: "Aparna Sharma",
        role: "President",
        image: "/aparna-sharma.jpeg",
        department: "Secretariat",
      },
      {
        id: "high-table-3",
        name: "Saanwi Gupta",
        role: "Secretary General",
        image: "/Saanwi.jpeg",
        department: "Secretariat",
      },
      {
        id: "high-table-4",
        name: "Anushka Raj",
        role: "Director General",
        image: "/Anushka Raj.jpeg",
        department: "Secretariat",
      },
      {
        id: "high-table-5",
        name: "Siddhant Gautam",
        role: "Chief Advisor",
        image: "/Siddhant.jpeg",
        department: "Advisory Board",
      },
      {
        id: "high-table-6",
        name: "Manav Mitra",
        role: "Advisor",
        image: "/manav-mitra.jpeg",
        department: "Advisory Board",
      },
      {
        id: "high-table-7",
        name: "Swara Sinha",
        role: "Advisor",
        image: "/Swara Sinha.jpeg",
        department: "Advisory Board",
      },
    ],
    get registrationOpen() {
      return isRegistrationLaunched();
    },
  },
  {
    slug: "mun-picnic",
    title: "Athena MUN Picnic",
    subtitle: "Official notice: we're touching grass. 🌿",
    date: "11th October",
    time: "12:00 PM – 5:00 PM",
    location: "Energy Park, Patna",
    description:
      "Official notice: we're touching grass. 🌿 MUN picnic + training workshop by Eldr Education. Sponsors: all of us. Signatories: you, hopefully. No vetoes accepted.",
    longDescription:
      "Official notice: we're touching grass. 🌿 Project Athena invites you to the MUN Picnic + Training Workshop at Energy Park, Patna. Clause 1: Eat (potluck, 2 to 3 pm) • Clause 2: Play (games, obviously) • Clause 3: Network (be normal about it) • Clause 4: Learn (training by Eldr Education). 11th Oct · 12 to 5 pm · Energy Park. Sponsors: all of us. Signatories: you, hopefully. No vetoes accepted.",
    committees: [],
    price: 100,
    capacity: 100,
    features: [
      "Clause 1: Eat — Community Potluck (2:00 PM to 3:00 PM)",
      "Clause 2: Play — Interactive Diplomacy Games (obviously)",
      "Clause 3: Network — Connect with Fellow Delegates (be normal about it)",
      "Clause 4: Learn — Training Workshop by Eldr Education",
      "Official notice: we're touching grass 🌿 (No vetoes accepted)",
    ],
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Energy+Park+Patna&t=&z=15&ie=UTF8&iwloc=&output=embed",
    mapDirectionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Energy+Park+Patna",
    team: [
      {
        id: "picnic-team-1",
        name: "Devpreeti Mukherji",
        role: "Founder",
        image: "/devpreeti.jpeg",
        department: "Secretariat",
      },
      {
        id: "picnic-team-2",
        name: "Aparna Sharma",
        role: "President",
        image: "/aparna-sharma.jpeg",
        department: "Secretariat",
      },
      {
        id: "picnic-team-3",
        name: "Saanwi Gupta",
        role: "Secretary General",
        image: "/Saanwi.jpeg",
        department: "Secretariat",
      },
      {
        id: "picnic-team-4",
        name: "Anushka Raj",
        role: "Director General",
        image: "/Anushka Raj.jpeg",
        department: "Secretariat",
      },
      {
        id: "picnic-team-5",
        name: "Siddhant Gautam",
        role: "Chief Advisor",
        image: "/Siddhant.jpeg",
        department: "Advisory Board",
      },
      {
        id: "picnic-team-6",
        name: "Manav Mitra",
        role: "Advisor",
        image: "/manav-mitra.jpeg",
        department: "Advisory Board",
      },
      {
        id: "picnic-team-7",
        name: "Swara Sinha",
        role: "Advisor",
        image: "/Swara Sinha.jpeg",
        department: "Advisory Board",
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
