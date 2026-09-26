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
import { BookOpen, Utensils, Trophy, Users, Award, Clock } from "lucide-react";

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
              <p className="text-gold/60 text-xs tracking-[0.3em] uppercase font-mono">
                Exclusive Event Experience
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-cream">
                Diplomacy in the <span className="text-gradient-gold">Park</span>
              </h2>
              <p className="text-cream/60 leading-relaxed text-base">
                {event.longDescription}
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
              <div className="glass-card rounded-2xl p-6 border border-gold/20 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <BookOpen size={24} />
                </div>
                <h3 className="font-heading text-xl text-cream">Hands-on Training Workshop</h3>
                <p className="text-xs text-cream/60 leading-relaxed">
                  Master parliamentary rules of procedure (ROPs), resolution drafting, and lobbying strategies directly from experienced MUN chairs.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6 border border-gold/20 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <Utensils size={24} />
                </div>
                <h3 className="font-heading text-xl text-cream">Community Delegate Potluck</h3>
                <p className="text-xs text-cream/60 leading-relaxed">
                  Share homemade dishes, snacks, and refreshing drinks in a relaxed outdoor atmosphere while bonding with peers across institutions.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6 border border-gold/20 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <Trophy size={24} />
                </div>
                <h3 className="font-heading text-xl text-cream">Diplomacy & Crisis Games</h3>
                <p className="text-xs text-cream/60 leading-relaxed">
                  Engage in fast-paced simulation games, unmoderated crisis challenges, and trivia designed to sharpen your extempore instincts.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6 border border-gold/20 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <Users size={24} />
                </div>
                <h3 className="font-heading text-xl text-cream">Capped at 100 Seats</h3>
                <p className="text-xs text-cream/60 leading-relaxed">
                  Strictly limited cohort ensures high-quality mentor-to-delegate interaction, individual speaking practice, and meaningful feedback.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6 border border-gold/20 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <Award size={24} />
                </div>
                <h3 className="font-heading text-xl text-cream">Official Delegate Pass</h3>
                <p className="text-xs text-cream/60 leading-relaxed">
                  Every attendee receives an official Project Athena verification pass, registration ID, and recognized certificate of participation.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6 border border-gold/20 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <Clock size={24} />
                </div>
                <h3 className="font-heading text-xl text-cream">5 Hours of Action</h3>
                <p className="text-xs text-cream/60 leading-relaxed">
                  Packed schedule from 12:00 PM to 5:00 PM on Sunday, 4th October at the iconic Buddha Smriti Park, Patna.
                </p>
              </div>
            </div>

            {/* Itinerary Schedule */}
            <div className="max-w-4xl mx-auto rounded-3xl glass-card border border-gold/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-10 space-y-2">
                <p className="text-gold/70 text-xs font-mono tracking-widest uppercase">Event Timeline</p>
                <h3 className="font-heading text-2xl sm:text-3xl text-cream">
                  Schedule for <span className="text-gradient-gold">4th October</span>
                </h3>
              </div>

              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 sm:before:left-7 before:w-0.5 before:bg-gold/20">
                <div className="flex items-start gap-4 sm:gap-6 relative">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-purple-deep font-bold text-xs">
                    1
                  </div>
                  <div>
                    <span className="text-xs font-mono text-gold font-semibold">12:00 PM – 1:30 PM</span>
                    <h4 className="text-base font-heading text-cream">MUN Training & Parliamentary Procedures</h4>
                    <p className="text-xs text-cream/60 mt-1">
                      Comprehensive primer on Points & Motions, Working Papers, Resolution structure, and committee speeches.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 sm:gap-6 relative">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-purple-deep font-bold text-xs">
                    2
                  </div>
                  <div>
                    <span className="text-xs font-mono text-gold font-semibold">1:30 PM – 2:45 PM</span>
                    <h4 className="text-base font-heading text-cream">Community Potluck Lunch & Networking</h4>
                    <p className="text-xs text-cream/60 mt-1">
                      Unmoderated caucus in the park. Delegates unpack their potluck contributions, socialize, and discuss diplomacy.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 sm:gap-6 relative">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-purple-deep font-bold text-xs">
                    3
                  </div>
                  <div>
                    <span className="text-xs font-mono text-gold font-semibold">2:45 PM – 4:30 PM</span>
                    <h4 className="text-base font-heading text-cream">Diplomacy Games & Crisis Simulation</h4>
                    <p className="text-xs text-cream/60 mt-1">
                      Hands-on crisis simulation game, treaty negotiation challenge, and diplomacy quiz with spot prizes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 sm:gap-6 relative">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-purple-deep font-bold text-xs">
                    4
                  </div>
                  <div>
                    <span className="text-xs font-mono text-gold font-semibold">4:30 PM – 5:00 PM</span>
                    <h4 className="text-base font-heading text-cream">Delegate Recognition, Feedback & Photos</h4>
                    <p className="text-xs text-cream/60 mt-1">
                      Group photos, distribution of certificates and materials, and official closing remarks by Secretariat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Buddha Smriti Park Location & Map */}
        <PicnicMapSection
          venueName="Buddha Smriti Park"
          address="Frazer Road, Near Patna Junction, Patna, Bihar 800001"
          mapEmbedUrl={event.mapEmbedUrl}
          mapDirectionsUrl={event.mapDirectionsUrl}
          date={event.date}
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

