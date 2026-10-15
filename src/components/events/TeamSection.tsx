"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Landmark, Users, Compass, ArrowUpRight } from "lucide-react";
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
    <section className="py-8 relative neo-grid-bg">
      {/* Neo Brutalist Filter Tabs */}
      <div className="flex justify-center mb-12 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#140b24] border-2 border-white/15 shadow-[4px_4px_0px_0px_#000000]">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-all border-2 cursor-pointer ${
              activeFilter === "all"
                ? "bg-gold text-[#0b0714] border-black shadow-[3px_3px_0px_0px_#000000] -translate-y-0.5"
                : "text-cream/80 border-transparent hover:text-white hover:border-white/20"
            }`}
          >
            All Members ({team.length})
          </button>

          <button
            onClick={() => setActiveFilter("secretariat")}
            className={`px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-all border-2 cursor-pointer ${
              activeFilter === "secretariat"
                ? "bg-gold text-[#0b0714] border-black shadow-[3px_3px_0px_0px_#000000] -translate-y-0.5"
                : "text-cream/80 border-transparent hover:text-white hover:border-white/20"
            }`}
          >
            Secretariat ({secretariatCount})
          </button>

          <button
            onClick={() => setActiveFilter("advisory")}
            className={`px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-all border-2 cursor-pointer ${
              activeFilter === "advisory"
                ? "bg-gold text-[#0b0714] border-black shadow-[3px_3px_0px_0px_#000000] -translate-y-0.5"
                : "text-cream/80 border-transparent hover:text-white hover:border-white/20"
            }`}
          >
            Advisory Board ({advisoryCount})
          </button>
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center"
        >
          <AnimatePresence mode="popLayout">
            {filteredTeam.map((member, index) => (
              <motion.div
                layout
                key={member.id || member.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
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

function EditorialMemberCard({ member }: { member: EventTeamMember }) {
  const isAdvisory =
    member.department === "Advisory Board" || member.role.toLowerCase().includes("advisor");

  return (
    <div className="bg-[#140b24] border-2 border-white/15 hover:border-gold/60 p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 transition-all flex flex-col justify-between h-full group">
      <div>
        {/* Portrait Container with Frame */}
        <div className="relative aspect-[3/3.7] w-full border-2 border-white/15 overflow-hidden bg-[#1f1238] mb-4 shadow-[3px_3px_0px_0px_#000000]">
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ objectPosition: "center 22%" }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#1f1238] text-cream/40">
              <Users size={36} />
            </div>
          )}

          {/* Department Sticker Tag */}
          <div className="absolute top-2.5 left-2.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider uppercase border ${
                isAdvisory
                  ? "bg-[#0b0714] text-cream/90 border-white/30 shadow-[2px_2px_0px_0px_#000000]"
                  : "bg-gold text-[#0b0714] border-black shadow-[2px_2px_0px_0px_#000000]"
              }`}
            >
              {isAdvisory ? <Compass size={10} /> : <Landmark size={10} />}
              <span>{isAdvisory ? "Advisory" : "Secretariat"}</span>
            </span>
          </div>
        </div>

        {/* Identity & Role */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold/80 font-bold block">
            {member.role}
          </span>
          <h3 className="font-heading text-xl sm:text-2xl text-cream font-extrabold group-hover:text-gold transition-colors leading-snug">
            {member.name}
          </h3>
        </div>
      </div>

      {/* Footer Tag */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-cream/50">
        <span>Athena 2026</span>
        <ArrowUpRight size={13} className="text-cream/40 group-hover:text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
    </div>
  );
}
