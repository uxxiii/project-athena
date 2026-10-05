"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Shield,
  Award,
  Sparkles,
  GitBranch,
  Grid,
  UserCheck,
  Compass,
} from "lucide-react";
import type { EventTeamMember } from "@/lib/types";

interface TeamSectionProps {
  team: EventTeamMember[];
}

interface TierConfig {
  tierName: string;
  badge: string;
  icon: typeof Crown;
  color: string;
  borderClass: string;
}

function getTierConfig(role: string): TierConfig {
  const normalized = role.toLowerCase();
  if (normalized.includes("founder")) {
    return {
      tierName: "Apex Leadership",
      badge: "Founder & High Patron",
      icon: Crown,
      color: "text-amber-300 bg-amber-400/10 border-amber-400/30",
      borderClass: "border-gold/40 shadow-[0_0_30px_rgba(212,175,55,0.15)]",
    };
  }
  if (normalized.includes("president")) {
    return {
      tierName: "Executive Secretariat",
      badge: "Presidential Office",
      icon: Shield,
      color: "text-purple-300 bg-purple-400/10 border-purple-400/30",
      borderClass: "border-purple-light/40 shadow-[0_0_25px_rgba(124,75,185,0.12)]",
    };
  }
  if (normalized.includes("secretary general")) {
    return {
      tierName: "Executive Secretariat",
      badge: "Secretariat Chief",
      icon: Award,
      color: "text-gold bg-gold/10 border-gold/30",
      borderClass: "border-gold/30 shadow-[0_0_25px_rgba(212,175,55,0.12)]",
    };
  }
  if (normalized.includes("chief advisor")) {
    return {
      tierName: "Advisory Board",
      badge: "Chief Advisor",
      icon: Compass,
      color: "text-emerald-300 bg-emerald-400/10 border-emerald-400/30",
      borderClass: "border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.1)]",
    };
  }
  return {
    tierName: "Advisory Board",
    badge: "Senior Advisor",
    icon: UserCheck,
    color: "text-sky-300 bg-sky-400/10 border-sky-400/30",
    borderClass: "border-sky-500/30 shadow-[0_0_25px_rgba(56,189,248,0.1)]",
  };
}

export function TeamSection({ team }: TeamSectionProps) {
  const [viewMode, setViewMode] = useState<"tree" | "grid">("tree");

  // Segregate team members into tiers for the vertical tree hierarchy
  const founder = team.find((m) => m.role.toLowerCase().includes("founder"));
  const president = team.find((m) => m.role.toLowerCase() === "president");
  const secGen = team.find((m) => m.role.toLowerCase().includes("secretary general"));
  const chiefAdvisor = team.find((m) => m.role.toLowerCase().includes("chief advisor"));
  const advisor = team.find(
    (m) =>
      m.role.toLowerCase().includes("advisor") &&
      !m.role.toLowerCase().includes("chief")
  );

  // Grouped executive and advisory pairs
  const executiveTier = [president, secGen].filter(Boolean) as EventTeamMember[];
  const advisoryTier = [chiefAdvisor, advisor].filter(Boolean) as EventTeamMember[];

  return (
    <section className="py-8 relative">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-b from-purple-light/10 via-gold/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Mode Switcher Pill */}
      <div className="flex justify-center mb-16 relative z-10">
        <div className="inline-flex items-center p-1 rounded-full border border-gold/25 bg-purple-deep/70 backdrop-blur-xl shadow-xl">
          <button
            onClick={() => setViewMode("tree")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
              viewMode === "tree"
                ? "bg-gradient-to-r from-gold to-amber-400 text-purple-deep font-bold shadow-md shadow-gold/20"
                : "text-cream/60 hover:text-cream"
            }`}
          >
            <GitBranch size={14} />
            <span>Hierarchy Tree</span>
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
              viewMode === "grid"
                ? "bg-gradient-to-r from-gold to-amber-400 text-purple-deep font-bold shadow-md shadow-gold/20"
                : "text-cream/60 hover:text-cream"
            }`}
          >
            <Grid size={14} />
            <span>Mid-Aligned Grid</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "tree" ? (
          /* ═══════════════════════════════════════════════════════════════════
             VERTICAL HIERARCHY TREE VIEW
             ═══════════════════════════════════════════════════════════════════ */
          <motion.div
            key="tree-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto px-4 relative z-10"
          >
            {/* ─── TIER 1: APEX (FOUNDER) ─── */}
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[10px] font-mono uppercase tracking-widest mb-3">
                <Crown size={12} className="text-gold" />
                <span>Tier I • Founder</span>
              </div>

              {founder && <LeaderCard member={founder} size="lg" isApex />}

              {/* Connecting Vertical Stem */}
              <div className="relative flex flex-col items-center my-2">
                <div className="w-0.5 h-12 bg-gradient-to-b from-gold via-gold/60 to-purple-light/50" />
                <div className="w-3 h-3 rounded-full bg-gold ring-4 ring-gold/20 animate-pulse -my-1.5 z-20" />
                <div className="w-0.5 h-8 bg-gradient-to-b from-purple-light/50 to-purple-light/80" />
              </div>
            </div>

            {/* ─── TIER 2: EXECUTIVE SECRETARIAT (PRESIDENT & SEC GEN) ─── */}
            <div className="relative pt-2 pb-6">
              {/* Branching Crossbar (Desktop/Tablet) */}
              <div className="hidden sm:block absolute top-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-purple-light to-transparent" />

              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-light/15 border border-purple-light/30 text-purple-200 text-[10px] font-mono uppercase tracking-widest">
                  <Shield size={12} />
                  <span>Tier II • Executive Secretariat</span>
                </div>
              </div>

              {/* Symmetrical 2-Column Mid-Aligned Branch */}
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-2xl mx-auto">
                {executiveTier.map((member) => (
                  <LeaderCard key={member.id} member={member} size="md" />
                ))}
              </div>

              {/* Converging Vertical Stem */}
              <div className="relative flex flex-col items-center my-4">
                <div className="w-0.5 h-12 bg-gradient-to-b from-purple-light/80 via-gold/40 to-emerald-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20 animate-pulse -my-1 z-20" />
                <div className="w-0.5 h-8 bg-gradient-to-b from-emerald-400/60 to-emerald-400/30" />
              </div>
            </div>

            {/* ─── TIER 3: THE ADVISORY COUNCIL ─── */}
            <div className="relative pt-2">
              {/* Branching Crossbar (Desktop/Tablet) */}
              <div className="hidden sm:block absolute top-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono uppercase tracking-widest">
                  <Compass size={12} />
                  <span>Tier III • Advisory Council</span>
                </div>
              </div>

              {/* Symmetrical 2-Column Mid-Aligned Branch */}
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-2xl mx-auto">
                {advisoryTier.map((member) => (
                  <LeaderCard key={member.id} member={member} size="md" />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ═══════════════════════════════════════════════════════════════════
             MID-ALIGNED GRID VIEW (PERFECT SYMMETRY)
             ═══════════════════════════════════════════════════════════════════ */
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto px-4 relative z-10"
          >
            {/* Center Row 1: Founder */}
            <div className="flex justify-center mb-8">
              {founder && (
                <div className="w-full max-w-sm">
                  <LeaderCard member={founder} size="lg" isApex />
                </div>
              )}
            </div>

            {/* Center Row 2: 4 Leaders in Symmetrical Mid-Aligned Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
              {team
                .filter((m) => !m.role.toLowerCase().includes("founder"))
                .map((member) => (
                  <LeaderCard key={member.id} member={member} size="md" />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PREMIUM LEADER CARD COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */
interface LeaderCardProps {
  member: EventTeamMember;
  size?: "lg" | "md";
  isApex?: boolean;
}

function LeaderCard({ member, size = "md", isApex = false }: LeaderCardProps) {
  const config = getTierConfig(member.role);
  const IconComponent = config.icon;

  const avatarSize = isApex
    ? "h-36 w-36 sm:h-40 sm:w-40 ring-4 ring-gold/40"
    : "h-28 w-28 sm:h-32 sm:w-32 ring-2 ring-gold/25";

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`glass-card rounded-3xl p-6 sm:p-7 text-center relative overflow-hidden group transition-all duration-300 ${config.borderClass} ${
        isApex ? "max-w-md w-full mx-auto" : "w-full"
      }`}
    >
      {/* Subtle Ambient Corner Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none group-hover:bg-gold/15 transition-all duration-500" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-light/10 rounded-full blur-2xl pointer-events-none" />

      {/* Role Badge Pill */}
      <div className="flex justify-center mb-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold border ${config.color}`}
        >
          <IconComponent size={12} />
          <span>{member.role}</span>
        </span>
      </div>

      {/* Portrait Frame */}
      <div className="relative mx-auto mb-4 flex justify-center">
        <div
          className={`relative rounded-full overflow-hidden bg-gradient-to-br from-purple-dark via-purple-deep to-black shadow-2xl transition-transform duration-500 ease-out group-hover:ring-gold/70 ${avatarSize}`}
        >
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes="(max-width: 640px) 140px, 160px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              style={{ objectPosition: "center 28%" }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-purple-deep text-gold/60">
              <IconComponent size={36} />
            </div>
          )}

          {/* Golden Rim Reflection */}
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/15 pointer-events-none" />
        </div>

        {/* Live Diplomatic Status Node */}
        <div className="absolute bottom-1 right-1/2 translate-x-12 sm:translate-x-14 flex h-6 w-6 items-center justify-center rounded-full bg-purple-deep border border-gold/40 shadow-md">
          <Sparkles size={11} className="text-gold" />
        </div>
      </div>

      {/* Name & Identity */}
      <div className="space-y-1">
        <h3
          className={`font-heading text-cream group-hover:text-gold transition-colors tracking-tight ${
            isApex ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
          }`}
        >
          {member.name}
        </h3>
        <p className="text-xs font-mono text-gold/70 tracking-wide">
          {config.badge}
        </p>
      </div>

      {/* Project Athena High Table Ribbon */}
      <div className="mt-4 pt-3.5 border-t border-gold/15 flex items-center justify-center gap-2 text-[10px] font-mono text-cream/45 uppercase tracking-widest">
        <span>Project Athena</span>
        <span className="text-gold/40">•</span>
        <span>High Table</span>
      </div>
    </motion.div>
  );
}
