"use client";

import { motion } from "framer-motion";
import { Users, Lock } from "lucide-react";
import type { Committee, AvailabilitySnapshot } from "@/lib/types";

interface CommitteeCardProps {
  committee: Committee;
  availability?: AvailabilitySnapshot["committees"][string];
  index?: number;
}

export function CommitteeCard({ committee, availability, index = 0 }: CommitteeCardProps) {
  const total = availability?.total ?? committee.maxDelegates;
  const taken = availability?.taken ?? 0;
  const available = availability?.available ?? total;
  const isFull = availability?.isFull ?? false;
  const isUnlimited = committee.maxDelegates === Number.MAX_SAFE_INTEGER;
  const fillPercent = total > 0 ? (taken / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className={`glass-card rounded-xl p-6 group transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
        isFull ? "opacity-70 border-red-500/20" : ""
      }`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl group-hover:bg-gold/15 transition-colors" />

      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-heading text-2xl text-gold group-hover:text-gold-light transition-colors font-normal">
                {committee.name}
              </h3>
              {isFull ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[9px] text-red-400 font-mono tracking-wider font-semibold uppercase">
                  <Lock size={10} /> FULL
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] text-emerald-400 font-mono tracking-wider uppercase">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-cream/45 font-sans leading-snug">{committee.fullName}</p>
          </div>

          <div className="flex items-center gap-1.5 text-cream/40 bg-purple-deep/60 px-2.5 py-1 rounded-lg border border-white/5 shrink-0">
            <Users size={13} className="text-gold/70" />
            <span className="text-xs font-mono font-medium">{isUnlimited ? "Unlimited" : `${available}/${total}`}</span>
          </div>
        </div>

        {/* Agenda */}
        <p className="text-xs text-cream/65 leading-relaxed font-sans font-light mb-6 bg-purple-deep/40 p-3 rounded-lg border border-white/5">
          {committee.agenda}
        </p>
      </div>

      {/* Availability Meter */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-cream/40 font-mono uppercase tracking-wider">Seat Allocation</span>
          <span className={isFull ? "text-red-400 font-mono" : "text-gold font-mono"}>
            {taken} of {isUnlimited ? "Unlimited" : total} Claimed ({Math.round(fillPercent)}%)
          </span>
        </div>
        <div className="h-2 rounded-full bg-purple-deep/90 overflow-hidden p-0.5 border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${fillPercent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.04 + 0.2 }}
            className={`h-full rounded-full transition-all ${
              isFull
                ? "bg-red-500"
                : fillPercent > 75
                  ? "bg-gradient-to-r from-amber-500 to-red-400"
                  : "bg-gradient-to-r from-gold-dark via-gold to-gold-light shadow-sm shadow-gold/30"
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
}
