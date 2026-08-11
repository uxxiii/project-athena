"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import type { EventTeamMember } from "@/lib/types";

interface TeamSectionProps {
  team: EventTeamMember[];
}

export function TeamSection({ team }: TeamSectionProps) {
  return (
    <section className="py-20 relative">
      <div className="section-divider" />
      <div className="mx-auto max-w-7xl px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-gold/60 text-xs tracking-[0.3em] uppercase mb-4">
            High Table
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-cream">
            Organising <span className="text-gradient-gold">Committee</span>
          </h2>
          <p className="mt-3 text-cream/40 text-sm max-w-md mx-auto">
            The core leadership and institutional vision behind Athena Summit
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {team.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-lg p-6 text-center group transition-all duration-300 hover:border-gold/50"
            >
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gold/15 to-purple-mid/20 ring-1 ring-gold/15 group-hover:ring-gold/60 transition-all duration-300 overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt=""
                    className="h-full w-full object-cover"
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
