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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className={`bg-[#140b24] border-2 border-white/15 hover:border-gold/60 p-6 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 transition-all flex flex-col justify-between group ${
        isFull ? "opacity-75" : ""
      }`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-cream group-hover:text-gold transition-colors uppercase tracking-tight">
                {committee.name}
              </h3>
              {isFull ? (
                <span className="inline-flex items-center gap-1 bg-rose-500 text-white border border-rose-700 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider uppercase shadow-[2px_2px_0px_0px_#000000]">
                  <Lock size={10} /> FULL
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-[#1f1238] text-gold border border-gold/40 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider uppercase shadow-[2px_2px_0px_0px_#000000]">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-cream/70 font-sans leading-snug">{committee.fullName}</p>
          </div>

          <div className="flex items-center gap-1.5 text-cream/80 bg-[#0b0714] px-2.5 py-1 border border-white/15 shadow-[2px_2px_0px_0px_#000000] shrink-0">
            <Users size={12} className="text-gold" />
            <span className="text-[11px] font-mono font-bold">{isUnlimited ? "Unlimited" : `${available}/${total}`}</span>
          </div>
        </div>

        {/* Agenda Box */}
        <div className="text-xs text-cream/75 leading-relaxed font-sans mb-5 bg-[#0b0714] p-3.5 border border-white/10 shadow-[2px_2px_0px_0px_#000000]">
          <span className="text-gold/90 font-bold block mb-1 text-[10px] font-mono uppercase tracking-wider">
            AGENDA STUDY TOPIC:
          </span>
          {committee.agenda}
        </div>
      </div>

      {/* Neo Availability Meter */}
      <div className="space-y-2 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-cream/50 font-mono font-bold uppercase tracking-wider">Matrix Fill</span>
          <span className={isFull ? "text-rose-400 font-mono font-bold" : "text-gold font-mono font-bold"}>
            {taken} of {isUnlimited ? "Unlimited" : total} Claimed ({Math.round(fillPercent)}%)
          </span>
        </div>
        <div className="h-2.5 bg-[#0b0714] border border-white/15 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${fillPercent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.03 + 0.1 }}
            className={`h-full transition-all ${
              isFull ? "bg-rose-500" : "bg-gold"
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
}
