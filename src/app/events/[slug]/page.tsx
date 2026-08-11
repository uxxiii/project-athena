import { notFound } from "next/navigation";
import { getEventBySlug } from "@/data/events";
import { committees } from "@/data/committees";
import { getAvailability } from "@/lib/availability";
import { EventHero } from "@/components/events/EventHero";
import { TeamSection } from "@/components/events/TeamSection";
import { BrochureDownload } from "@/components/events/BrochureDownload";
import { CommitteeCard } from "@/components/events/CommitteeCard";
import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { ScrollToRegister } from "@/components/registration/ScrollToRegister";

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
              Real-time seat availability across all 11 committees. Select your top 3 preferences during registration.
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

      <TeamSection team={event.team} />
      <BrochureDownload
        brochureUrl={event.brochureUrl}
        eventTitle={event.title}
      />

      {event.registrationOpen && <RegistrationForm eventSlug={event.slug} />}
    </>
  );
}
