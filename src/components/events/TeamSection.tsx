"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import type { EventTeamMember } from "@/lib/types";

interface TeamSectionProps {
  team: EventTeamMember[];
}

export function TeamSection({ team }: TeamSectionProps) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {team.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-6 text-center group transition-all duration-300 hover:border-gold/50 hover:-translate-y-1"
            >
              <div className="mx-auto mb-5 flex h-32 w-32 items-center justify-center rounded-full border-2 border-gold/25 bg-linear-to-br from-gold/15 via-purple-mid/20 to-purple-deep/30 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] ring-1 ring-gold/20 group-hover:ring-gold/80 transition-all duration-300 overflow-hidden sm:h-36 sm:w-36">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
                    style={{ objectPosition: 'center 35%' }}
                  />
                ) : (
                  <User size={28} className="text-gold/50 group-hover:text-gold/70 transition-colors" />
                )}
              </div>
              <h3 className="font-heading text-lg text-cream group-hover:text-gold transition-colors">
                {member.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-gold/55">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
