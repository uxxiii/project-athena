import { notFound } from "next/navigation";
import { getEventBySlug } from "@/data/events";
import { committees } from "@/data/committees";
import { getAvailability } from "@/lib/availability";
import { EventHero } from "@/components/events/EventHero";
import { BrochureDownload } from "@/components/events/BrochureDownload";
import { CommitteeCard } from "@/components/events/CommitteeCard";
import { PicnicMapSection } from "@/components/events/PicnicMapSection";
import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { PicnicRegistrationForm } from "@/components/registration/PicnicRegistrationForm";
import { ScrollToRegister } from "@/components/registration/ScrollToRegister";
import { BookOpen, Utensils, Trophy, Users } from "lucide-react";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: `${event.title} | Project Athena`,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) notFound();

  // MUN Picnic Experience
  if (event.slug === "mun-picnic") {
    return (
      <>
        <ScrollToRegister />
        <EventHero event={event} />

        {/* Picnic Overview & Key Features */}
        <section className="py-20 relative">
          <div className="section-divider" />
          <div className="mx-auto max-w-7xl px-6 pt-20">
            <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs text-emerald-300 font-mono tracking-widest uppercase shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Official Notice • The Picnic Accord</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-cream">
                We&apos;re Touching <span className="text-gradient-gold">Grass</span> 🌿
              </h2>
              <p className="text-gold/90 font-heading text-lg sm:text-xl font-medium tracking-wide">
                MUN Picnic + Training Workshop
              </p>
              <p className="text-cream/70 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto">
                {event.longDescription}
              </p>

              {/* Treaty Notice Tagline */}
              <div className="inline-flex flex-wrap items-center justify-center gap-3 pt-3 text-xs font-mono text-gold/90 bg-gold/10 px-5 py-2.5 rounded-full border border-gold/30 shadow-md">
                <span>11th Oct · 12 to 5 pm · Energy Park</span>
                <span className="text-gold/40">•</span>
                <span>Sponsors: all of us</span>
                <span className="text-gold/40">•</span>
                <span>Signatories: you, hopefully</span>
                <span className="text-gold/40">•</span>
                <span className="text-cream font-bold">No vetoes accepted</span>
              </div>
            </div>

            {/* The 4 Non-Negotiable Clauses */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
              {/* Clause 1: Eat */}
              <div className="glass-card rounded-2xl p-6 border border-gold/20 space-y-3 relative overflow-hidden group hover:border-gold/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/30">
                    <Utensils size={24} />
                  </div>
                  <span className="font-mono text-[10px] text-gold/60 uppercase tracking-widest bg-gold/5 px-2 py-0.5 rounded border border-gold/15">
                    Clause 01
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-xl text-cream group-hover:text-gold transition-colors">
                    Clause 1: Eat
                  </h3>
                  <span className="text-xs text-gold font-mono font-semibold block mt-0.5">
                    Potluck, 2 to 3 pm
                  </span>
                </div>
                <p className="text-xs text-cream/60 leading-relaxed">
                  Bring dishes, snacks, or refreshing drinks to share. An open-air potluck feast in the park with your fellow delegates.
                </p>
              </div>

              {/* Clause 2: Play */}
              <div className="glass-card rounded-2xl p-6 border border-gold/20 space-y-3 relative overflow-hidden group hover:border-gold/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/30">
                    <Trophy size={24} />
                  </div>
                  <span className="font-mono text-[10px] text-gold/60 uppercase tracking-widest bg-gold/5 px-2 py-0.5 rounded border border-gold/15">
                    Clause 02
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-xl text-cream group-hover:text-gold transition-colors">
                    Clause 2: Play
                  </h3>
                  <span className="text-xs text-gold font-mono font-semibold block mt-0.5">
                    Games, obviously
                  </span>
                </div>
                <p className="text-xs text-cream/60 leading-relaxed">
                  Fast-paced simulation challenges, crisis games, and quick-thinking diplomacy activities designed to test your instincts and make you laugh.
                </p>
              </div>

              {/* Clause 3: Network */}
              <div className="glass-card rounded-2xl p-6 border border-gold/20 space-y-3 relative overflow-hidden group hover:border-gold/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/30">
                    <Users size={24} />
                  </div>
                  <span className="font-mono text-[10px] text-gold/60 uppercase tracking-widest bg-gold/5 px-2 py-0.5 rounded border border-gold/15">
                    Clause 03
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-xl text-cream group-hover:text-gold transition-colors">
                    Clause 3: Network
                  </h3>
                  <span className="text-xs text-gold font-mono font-semibold block mt-0.5">
                    Be normal about it
                  </span>
                </div>
                <p className="text-xs text-cream/60 leading-relaxed">
                  Mingle, make friends, and connect with premier delegates, debaters, and mentors across institutions without the formal caucus pressure.
                </p>
              </div>

              {/* Clause 4: Learn */}
              <div className="glass-card rounded-2xl p-6 border border-gold/20 space-y-3 relative overflow-hidden group hover:border-gold/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/30">
                    <BookOpen size={24} />
                  </div>
                  <span className="font-mono text-[10px] text-gold/60 uppercase tracking-widest bg-gold/5 px-2 py-0.5 rounded border border-gold/15">
                    Clause 04
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-xl text-cream group-hover:text-gold transition-colors">
                    Clause 4: Learn
                  </h3>
                  <span className="text-xs text-gold font-mono font-semibold block mt-0.5">
                    Training by Eldr Education
                  </span>
                </div>
                <p className="text-xs text-cream/60 leading-relaxed">
                  High-impact training masterclass by Eldr Education covering rules of procedure (ROPs), resolution tactics, lobbying, and committee dynamics.
                </p>
              </div>
            </div>

            {/* Itinerary Schedule */}
            <div className="max-w-4xl mx-auto rounded-3xl glass-card border border-gold/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-10 space-y-2">
                <p className="text-gold/70 text-xs font-mono tracking-widest uppercase">The Official Order of the Day</p>
                <h3 className="font-heading text-2xl sm:text-3xl text-cream">
                  Schedule for <span className="text-gradient-gold">11th October</span> (12:00 PM – 5:00 PM)
                </h3>
                <p className="text-xs text-cream/60">
                  Energy Park, Patna • 100 Seats Cap • Strictly No Vetoes Accepted
                </p>
              </div>

              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 sm:before:left-7 before:w-0.5 before:bg-gold/20">
                <div className="flex items-start gap-4 sm:gap-6 relative">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-purple-deep font-bold text-xs">
                    1
                  </div>
                  <div>
                    <span className="text-xs font-mono text-gold font-semibold">12:00 PM – 2:00 PM</span>
                    <h4 className="text-base font-heading text-cream">Clause 4: Learn — Training Workshop by Eldr Education</h4>
                    <p className="text-xs text-cream/60 mt-1">
                      Deep-dive primer by Eldr Education on Parliamentary Procedures, Points & Motions, Working Papers, Resolution structure, and speech delivery.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 sm:gap-6 relative">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-purple-deep font-bold text-xs">
                    2
                  </div>
                  <div>
                    <span className="text-xs font-mono text-gold font-semibold">2:00 PM – 3:00 PM</span>
                    <h4 className="text-base font-heading text-cream">Clause 1: Eat — Community Potluck Lunch</h4>
                    <p className="text-xs text-cream/60 mt-1">
                      Unmoderated caucus in the park! Unpack potluck contributions, taste dishes brought by delegates, and touch grass together.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 sm:gap-6 relative">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-purple-deep font-bold text-xs">
                    3
                  </div>
                  <div>
                    <span className="text-xs font-mono text-gold font-semibold">3:00 PM – 4:30 PM</span>
                    <h4 className="text-base font-heading text-cream">Clause 2: Play & Clause 3: Network</h4>
                    <p className="text-xs text-cream/60 mt-1">
                      Games, obviously! Interactive diplomacy simulation games, treaty negotiation challenge, and casual networking (be normal about it).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 sm:gap-6 relative">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-purple-deep font-bold text-xs">
                    4
                  </div>
                  <div>
                    <span className="text-xs font-mono text-gold font-semibold">4:30 PM – 5:00 PM</span>
                    <h4 className="text-base font-heading text-cream">Signatories & Wrap-up: Photos, Passes & Awards</h4>
                    <p className="text-xs text-cream/60 mt-1">
                      Group photos, distribution of official Project Athena verification passes and certificates, spot prizes, and closing remarks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Energy Park Location & Map */}
        <PicnicMapSection
          venueName="Energy Park"
          address="Road No. 1, North Patel Nagar, East Patel Nagar, Adarsh Colony, Rajbansi Nagar, Patna, Bihar 800023"
          mapEmbedUrl={event.mapEmbedUrl}
          mapDirectionsUrl={event.mapDirectionsUrl}
          date={`Sunday, ${event.date}`}
          time={event.time}
        />

        {/* Dedicated MUN Picnic Registration Form */}
        <PicnicRegistrationForm />
      </>
    );
  }

  // Athena Summit Flagship Conference Experience
  const availability = await getAvailability();
  const eventCommittees = committees.filter((c) =>
    event.committees.includes(c.id)
  );

  return (
    <>
      <ScrollToRegister />
      <EventHero event={event} />

      <section className="py-20 relative">
        <div className="section-divider" />
        <div className="mx-auto max-w-7xl px-6 pt-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="text-gold/60 text-xs tracking-[0.3em] uppercase">
              Conference Overview
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-cream">
              About the <span className="text-gradient-gold">Conference</span>
            </h2>
            <p className="text-cream/60 leading-relaxed text-base">
              {event.longDescription}
            </p>
          </div>
        </div>
      </section>

      <section id="committees" className="py-20 relative scroll-mt-20">
        <div className="section-divider" />
        <div className="mx-auto max-w-7xl px-6 pt-20">
          <div className="text-center mb-14 space-y-3">
            <p className="text-gold/60 text-xs tracking-[0.3em] uppercase">
              Live Allocation Status
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-cream">
              Committees & <span className="text-gradient-gold">Agendas</span>
            </h2>
            <p className="text-cream/45 text-sm max-w-lg mx-auto">
              Real-time seat availability across all {eventCommittees.length} committees. Select your top 3 preferences during registration.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {eventCommittees.map((committee, idx) => (
              <CommitteeCard
                key={committee.id}
                committee={committee}
                availability={availability.committees[committee.id]}
                index={idx}
              />
            ))}
          </div>
        </div>
      </section>

      <BrochureDownload
        brochureUrl={event.brochureUrl}
        eventTitle={event.title}
      />

      <RegistrationForm eventSlug={event.slug} />
    </>
  );
}

