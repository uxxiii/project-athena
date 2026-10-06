"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Landmark,
  Users,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import type { EventTeamMember } from "@/lib/types";

interface TeamSectionProps {
  team: EventTeamMember[];
}

type FilterCategory = "all" | "secretariat" | "advisory";

export function TeamSection({ team }: TeamSectionProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");

  const secretariatCount = team.filter(
    (m) => m.department === "Secretariat" || !m.role.toLowerCase().includes("advisor")
  ).length;

  const advisoryCount = team.filter(
    (m) => m.department === "Advisory Board" || m.role.toLowerCase().includes("advisor")
  ).length;

  const filteredTeam = team.filter((member) => {
    if (activeFilter === "secretariat") {
      return member.department === "Secretariat" || !member.role.toLowerCase().includes("advisor");
    }
    if (activeFilter === "advisory") {
      return member.department === "Advisory Board" || member.role.toLowerCase().includes("advisor");
    }
    return true;
  });

  return (
    <section className="py-6 relative">
      {/* Subtle Ambient Grain & Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-b from-purple-light/10 via-gold/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Editorial Filter Navigation */}
      <div className="flex justify-center mb-12 relative z-10">
        <div className="inline-flex items-center p-1.5 rounded-full border border-gold/20 bg-purple-deep/80 backdrop-blur-xl shadow-lg">
          <button
            onClick={() => setActiveFilter("all")}
            className={`relative px-5 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
              activeFilter === "all"
                ? "text-purple-deep font-semibold"
                : "text-cream/60 hover:text-cream"
            }`}
          >
            {activeFilter === "all" && (
              <motion.div
                layoutId="activeFilterPill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-gold to-amber-300 shadow-md"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">All Members ({team.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter("secretariat")}
            className={`relative px-5 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
              activeFilter === "secretariat"
                ? "text-purple-deep font-semibold"
                : "text-cream/60 hover:text-cream"
            }`}
          >
            {activeFilter === "secretariat" && (
              <motion.div
                layoutId="activeFilterPill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-gold to-amber-300 shadow-md"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">Secretariat ({secretariatCount})</span>
          </button>

          <button
            onClick={() => setActiveFilter("advisory")}
            className={`relative px-5 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
              activeFilter === "advisory"
                ? "text-purple-deep font-semibold"
                : "text-cream/60 hover:text-cream"
            }`}
          >
            {activeFilter === "advisory" && (
              <motion.div
                layoutId="activeFilterPill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-gold to-amber-300 shadow-md"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">Advisory Board ({advisoryCount})</span>
          </button>
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 justify-center"
        >
          <AnimatePresence mode="popLayout">
            {filteredTeam.map((member, index) => (
              <motion.div
                layout
                key={member.id || member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="h-full"
              >
                <EditorialMemberCard member={member} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EDITORIAL MEMBER CARD
   Clean portrait window, human typography rhythm, subtle hover interactions
   ───────────────────────────────────────────────────────────────────────────── */
interface EditorialMemberCardProps {
  member: EventTeamMember;
}

function EditorialMemberCard({ member }: EditorialMemberCardProps) {
  const isAdvisory =
    member.department === "Advisory Board" || member.role.toLowerCase().includes("advisor");

  return (
    <div className="group relative rounded-2xl bg-gradient-to-b from-purple-dark/60 via-purple-deep/70 to-purple-deep/90 border border-gold/15 hover:border-gold/45 p-4 sm:p-5 transition-all duration-500 hover:shadow-[0_16px_40px_rgba(212,175,55,0.08)] flex flex-col justify-between h-full overflow-hidden">
      {/* Ambient hover light corner */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gold/0 group-hover:bg-gold/10 rounded-full blur-2xl transition-all duration-500 pointer-events-none" />

      <div>
        {/* Portrait Container */}
        <div className="relative aspect-[3/3.7] w-full rounded-xl overflow-hidden bg-purple-dark border border-white/10 group-hover:border-gold/30 transition-colors duration-500 mb-5">
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ objectPosition: "center 22%" }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-purple-dark text-gold/40">
              <Users size={36} />
            </div>
          )}

          {/* Gentle cinematic vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/20 pointer-events-none" />

          {/* Department Tag Floating on Image */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider backdrop-blur-md border ${
                isAdvisory
                  ? "bg-emerald-950/70 border-emerald-400/30 text-emerald-300"
                  : "bg-purple-deep/80 border-gold/30 text-gold"
              }`}
            >
              {isAdvisory ? <Compass size={10} /> : <Landmark size={10} />}
              <span>{isAdvisory ? "Advisory" : "Secretariat"}</span>
            </span>
          </div>
        </div>

        {/* Identity & Role */}
        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold/90 font-semibold block">
            {member.role}
          </span>
          <h3 className="font-heading text-2xl sm:text-[26px] text-cream font-medium tracking-tight group-hover:text-gold transition-colors leading-snug">
            {member.name}
          </h3>
        </div>
      </div>

      {/* Card Footer: Subtle Institutional Tag */}
      <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-cream/45">
        <span>Project Athena</span>
        <span className="text-gold/40 flex items-center gap-0.5 group-hover:text-gold transition-colors">
          <span>2026</span>
          <ArrowUpRight size={11} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </span>
      </div>
    </div>
  );
}

