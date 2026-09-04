"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Users, Award, Gavel, Quote, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { committees as committeeData } from "@/data/committees";

const featuredCommittees = committeeData.map((committee) => ({
  name: committee.name,
  full: committee.fullName,
  seats: committee.maxDelegates === Number.MAX_SAFE_INTEGER ? "No Limit" : `${committee.maxDelegates} Seats`,
  category: committee.name === "UNSC"
    ? "Double Delegation"
    : committee.name === "IP"
      ? "Press Corps"
      : committee.name === "IPL"
        ? "Sports"
        : committee.name === "HCC"
          ? "Special Crisis"
          : committee.name === "UNCSW"
            ? "Global Human Rights"
            : committee.name === "UNHRC"
              ? "International Law"
              : committee.name === "DISEC"
                ? "Security Affairs"
                : committee.name === "AIPPM"
                  ? "Indian Governance"
                  : committee.name === "BLA"
                    ? "State Governance"
                    : committee.name === "UNW"
                      ? "Gender & Tech"
                      : "Transnational Crime",
}));

const pillars = [
  {
    number: "01",
    icon: Globe,
    title: "11 Specialized Assemblies",
    desc: "From sovereign UN organs to crisis councils and domestic Indian assemblies, structured for rigorous parliamentary debate.",
  },
  {
    number: "02",
    icon: Users,
    title: "Elite Delegation Cohort",
    desc: "Gathering premier delegates, scholars, and debaters across institutions in a competitive yet diplomatic arena.",
  },
  {
    number: "03",
    icon: Award,
    title: "Editorial & Procedural Rigour",
    desc: "Custom Rules of Procedure (RoPs), background guides, and transparent allocation algorithms crafted with precision.",
  },
  {
    number: "04",
    icon: Gavel,
    title: "Authentic Directives",
    desc: "Resolution drafting, dynamic crisis updates, and procedural voting that replicate real-world international diplomacy.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function HomePage() {
  const [selectedCommittee, setSelectedCommittee] = useState<(typeof committeeData)[number] | null>(null);
  const [delegationCount, setDelegationCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadRegistrationCount() {
      try {
        const response = await fetch("/api/admin/registrations");
        if (!response.ok) {
          throw new Error("Unable to fetch registrations");
        }

        const payload = await response.json();
        const count = Array.isArray(payload.registrations)
          ? payload.registrations.length
          : 0;

        if (!ignore) {
          setDelegationCount(count);
        }
      } catch {
        if (!ignore) {
          setDelegationCount(0);
        }
      }
    }

    loadRegistrationCount();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      {/* ─── Clean & Majestic Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-28 pb-20">
        {/* Subtle Ambient Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-mid/15 via-transparent to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 space-y-7 text-left"
            >
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-purple-dark/80 px-4 py-1.5 text-xs text-gold-light font-mono shadow-md">
                  <span>REGISTRATION CLOSED FOR NOW</span>
                </div>
              </div>

              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cream leading-[1.05] tracking-tight">
                Where Diplomacy
                <br />
                <span className="text-gradient-gold italic font-normal">Meets Excellence</span>
              </h1>

              <p className="text-cream/70 text-base sm:text-lg leading-relaxed max-w-xl font-sans font-light">
                Project Athena brings together the finest minds in collegiate diplomacy
                for an unparalleled summit experience.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button href="/events/athena-summit#register" size="lg" className="rounded-full px-8 text-xs tracking-wider uppercase font-semibold shadow-lg shadow-gold/15">
                  <span>View Details</span>
                  <ArrowRight size={16} />
                </Button>

                <Button href="/events" size="lg" variant="outline" className="rounded-full px-7 text-xs tracking-wider uppercase">
                  <span>View Events</span>
                </Button>
              </div>
            </motion.div>

            {/* Right Emblem Image (Clean & Framed) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="relative group max-w-md w-full">
                <div className="absolute inset-0 bg-gold/10 rounded-2xl blur-2xl group-hover:bg-gold/20 transition-all duration-500" />
                <div className="relative rounded-2xl overflow-hidden p-2 bg-gradient-to-b from-purple-dark/80 to-purple-deep border border-gold/30 shadow-2xl">
                  <Image
                    src="/logo.jpeg"
                    alt="Athena Summit"
                    width={440}
                    height={440}
                    className="rounded-xl object-cover ring-1 ring-gold/20 w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ───────────────────────────────────────────────────────────── */}
      <section className="py-10 border-y border-gold/15 bg-purple-deep/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="font-heading text-3xl sm:text-4xl text-gold">11</p>
              <p className="text-xs text-cream/50 uppercase tracking-widest mt-1">Committees</p>
            </div>
            <div>
              <p className="font-heading text-3xl sm:text-4xl text-cream">{delegationCount}+</p>
              <p className="text-xs text-cream/50 uppercase tracking-widest mt-1">Delegations</p>
            </div>
            <div>
              <p className="font-heading text-3xl sm:text-4xl text-gold">Oct 2026</p>
              <p className="text-xs text-cream/50 uppercase tracking-widest mt-1">Summit Date</p>
            </div>
            <div>
              <p className="font-heading text-3xl sm:text-4xl text-cream">Eldr.</p>
              <p className="text-xs text-cream/50 uppercase tracking-widest mt-1">Powered By</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Editorial Quote Banner ────────────────────────────────────────────────── */}
      <section className="py-16 relative">
        <div className="mx-auto max-w-4xl px-6 text-center relative">
          <Quote size={36} className="mx-auto text-gold/30 mb-4" />
          <blockquote className="font-heading text-2xl sm:text-3xl text-cream/90 italic leading-relaxed">
            &ldquo;Diplomacy is not merely the resolution of conflict; it is the art of giving shape to human destiny.&rdquo;
          </blockquote>
          <p className="mt-4 text-xs tracking-[0.3em] uppercase text-gold font-medium">
            Project Athena Secretariat
          </p>
        </div>
      </section>

      {/* ─── Pillars of Athena ────────────────────────────────────────────────────── */}
      <section className="py-20 relative">
        <div className="filigree-divider mb-20" />
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-3"
          >
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-medium">
              Why Project Athena
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl text-cream">
              Engineered for <span className="text-gradient-gold italic font-normal">Excellence</span>
            </h2>
            <p className="text-cream/50 text-sm max-w-lg mx-auto font-sans font-light">
              Crafted to provide delegates with an authentic, rigorous, and memorable diplomatic convening.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="glass-card rounded-xl p-7 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-heading text-2xl text-gold/40 group-hover:text-gold transition-colors">
                      {item.number}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 ring-1 ring-gold/20 group-hover:ring-gold/50 transition-all">
                      <item.icon size={20} className="text-gold" />
                    </div>
                  </div>

                  <h3 className="font-heading text-xl text-cream mb-3 group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-cream/50 leading-relaxed font-sans font-light">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Committees Showcase ──────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-transparent via-purple-deep/40 to-transparent">
        <div className="filigree-divider mb-20" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-3">
              <p className="text-gold text-xs tracking-[0.3em] uppercase font-medium">
                Athena Summit 2026
              </p>
              <h2 className="font-heading text-4xl sm:text-5xl text-cream">
                Featured <span className="text-gradient-gold italic font-normal">Committees</span>
              </h2>
              <p className="text-cream/50 text-sm max-w-xl font-sans font-light">
                11 prestigious committees spanning global security, human rights, national governance, and specialized press.
              </p>
            </div>

            <Link href="/events/athena-summit#committees">
              <Button variant="outline" className="rounded-full px-6 text-xs uppercase tracking-wider">
                <span>View Live Allocation Matrix</span>
                <ChevronRight size={14} />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {committeeData.map((c, i) => (
              <motion.div
                key={c.name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                onClick={() => setSelectedCommittee(c)}
                className="glass-card rounded-xl p-6 group cursor-pointer transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl group-hover:bg-gold/15 transition-colors" />

                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-gold/70 border border-gold/20 rounded-full px-2.5 py-0.5 bg-gold/5">
                    {featuredCommittees.find((item) => item.name === c.name)?.category}
                  </span>
                  <span className="text-xs text-cream/40 font-mono">
                    {c.maxDelegates === Number.MAX_SAFE_INTEGER ? "No Limit" : `${c.maxDelegates} Seats`}
                  </span>
                </div>

                <h3 className="font-heading text-2xl text-gold group-hover:text-gold-light transition-colors mb-1.5">
                  {c.name}
                </h3>
                <p className="text-xs text-cream/60 line-clamp-2 leading-relaxed">
                  {c.fullName}
                </p>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-cream/40 group-hover:text-gold transition-colors">
                  <span>View Agenda Details</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {selectedCommittee && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="relative w-full max-w-2xl rounded-2xl border border-gold/30 bg-purple-deep p-6 shadow-2xl">
            <button
              onClick={() => setSelectedCommittee(null)}
              className="absolute top-4 right-4 rounded-full p-2 text-cream/70 hover:bg-gold/20 hover:text-gold transition-colors"
              aria-label="Close agenda details"
            >
              <X size={16} />
            </button>
            <div className="pr-12">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold/70">Committee Agenda</span>
              <h3 className="font-heading text-3xl text-gold mt-2">{selectedCommittee.name}</h3>
              <p className="text-xs text-cream/50 mt-1">{selectedCommittee.fullName}</p>
              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-sm leading-relaxed text-cream/80 font-sans font-light">
                  {selectedCommittee.agenda}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Grand CTA Banner ─────────────────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="filigree-divider mb-20" />
        <div className="mx-auto max-w-5xl px-6">
          <div className="velvet-card rounded-2xl p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-glow/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1 text-gold text-xs font-heading tracking-widest uppercase">
                <span>Registration Opening Soon</span>
              </div>

              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-cream leading-tight">
                Athena Summit <span className="text-gradient-gold italic font-normal">Convening</span>
              </h2>

              <p className="text-cream/60 text-sm leading-relaxed font-sans font-light">
                Committees fill in real-time based on delegate portfolio preferences when registrations open.
              </p>

              <div className="pt-2">
                <Link href="/events/athena-summit#register">
                  <Button size="lg" className="rounded-full px-10 shadow-2xl shadow-gold/25 uppercase tracking-widest text-xs font-bold py-4">
                    <span>Registration Opening Soon</span>
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
