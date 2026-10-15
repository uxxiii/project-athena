"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Target, Eye, Heart, Quote, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: Target,
    title: "Intellectual Rigour",
    desc: "Every committee, agenda, and study guide is crafted to challenge delegates to engage in deep analytical debate.",
  },
  {
    icon: Eye,
    title: "Procedural Excellence",
    desc: "Authentic rules of procedure that maintain parliamentary decorum while encouraging bold, creative resolution drafting.",
  },
  {
    icon: Heart,
    title: "Inclusive Leadership",
    desc: "A summit that welcomes first-time debaters alongside veteran delegates in an atmosphere of mutual respect and empowerment.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function AboutPage() {
  return (
    <div className="pt-32 sm:pt-40 pb-24 neo-grid-bg relative overflow-hidden">
      {/* Corner Architectural Brackets */}
      <div className="absolute top-0 left-0 w-32 sm:w-44 h-32 sm:h-44 border-l-2 border-t-2 border-white/15 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 sm:w-44 h-32 sm:h-44 border-r-2 border-t-2 border-white/15 pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        
        {/* ─── Hero Header ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 mb-20"
        >
          <div className="inline-block transform -rotate-1">
            <div className="px-5 py-2 bg-gold border-2 border-black text-[#0b0714] font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000]">
              The Institution & Ethos
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-cream leading-tight">
            About <span className="text-gold">Project Athena</span>
          </h1>

          <p className="text-cream/75 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Named after the goddess of wisdom and strategic council, Athena represents intellectual fortitude, procedural clarity, and diplomatic grace across the collegiate circuit.
          </p>
        </motion.div>

        {/* ─── Framed Banner Image (Neo-Brutalist Frame) ────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mb-24 flex justify-center"
        >
          <div className="border-2 border-white/20 bg-[#140b24] p-3 shadow-[6px_6px_0px_0px_#000000] max-w-3xl w-full">
            <div className="relative border border-white/15 overflow-hidden bg-[#1f1238]">
              <Image
                src="/full-logo.jpeg"
                alt="Athena Summit Banner"
                width={900}
                height={380}
                className="w-full h-auto object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0714] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-cream font-mono font-bold">
                <span className="bg-[#0b0714] border border-white/20 px-2.5 py-1 text-cream/90 shadow-[2px_2px_0px_0px_#000]">PROJECT ATHENA CONCLAVE</span>
                <span className="bg-gold text-[#0b0714] px-2.5 py-1 border border-black shadow-[1px_1px_0px_0px_#000]">NOV 2026</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Mission & Vision Grid ────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#140b24] border-2 border-white/15 hover:border-gold/60 p-8 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 transition-all space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0b0714] text-cream font-mono font-bold text-xs uppercase tracking-wider border border-white/20 shadow-[2px_2px_0px_0px_#000000]">
              <Shield size={14} className="text-gold" />
              <span>Our Mission</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-cream tracking-tight">
              Fostering Diplomatic <span className="text-gold">Excellence</span>
            </h2>
            <p className="text-cream/75 text-sm leading-relaxed font-sans font-light">
              Project Athena was founded to elevate the standards of collegiate diplomacy conferences. We construct agendas that mirror complex real-world dynamics, encouraging delegates to negotiate beyond rhetoric and arrive at actionable resolutions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#140b24] border-2 border-white/15 hover:border-gold/60 p-8 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 transition-all space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0b0714] text-cream font-mono font-bold text-xs uppercase tracking-wider border border-white/20 shadow-[2px_2px_0px_0px_#000000]">
              <Target size={14} className="text-gold" />
              <span>Our Vision</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-cream tracking-tight">
              Shaping Tomorrow&apos;s <span className="text-gold">Statespeople</span>
            </h2>
            <p className="text-cream/75 text-sm leading-relaxed font-sans font-light">
              We envision a community of analytical, empathetic, and articulate leaders. Whether deliberating global migration at UNHRC or regional accountability at BLA, delegates leave Athena equipped with profound global perspectives.
            </p>
          </motion.div>
        </div>

        {/* ─── Quote Card ───────────────────────────────────────────── */}
        <div className="bg-[#140b24] border-2 border-white/20 p-10 md:p-14 text-center mb-24 shadow-[6px_6px_0px_0px_#000000] relative">
          <Quote size={36} className="mx-auto text-gold/80 mb-4" />
          <blockquote className="font-heading text-2xl sm:text-3xl text-cream font-bold italic max-w-2xl mx-auto leading-relaxed">
            &ldquo;In an era of fragmenting consensus, the ability to listen, synthesize, and lead is the ultimate power.&rdquo;
          </blockquote>
          <p className="mt-4 text-xs font-mono font-bold uppercase tracking-[0.25em] text-cream/60">
            Project Athena Executive Board
          </p>
        </div>

        {/* ─── Core Values ──────────────────────────────────────────── */}
        <div className="mb-20">
          <div className="text-center mb-14 space-y-3">
            <div className="inline-block transform -rotate-1">
              <span className="px-5 py-2 bg-gold border-2 border-black text-[#0b0714] font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000]">
                Guiding Principles
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-cream">
              The Athena <span className="text-gold">Pillars</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-[#140b24] border-2 border-white/15 hover:border-gold/60 p-7 text-center shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 transition-all group"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#1f1238] border border-white/20 shadow-[2px_2px_0px_0px_#000000] mb-5 group-hover:border-gold transition-all">
                  <v.icon size={22} className="text-gold" />
                </div>
                <h3 className="text-xl font-extrabold uppercase text-cream group-hover:text-gold transition-colors mb-2">
                  {v.title}
                </h3>
                <p className="text-xs text-cream/70 leading-relaxed font-sans font-light">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Closing Register CTA */}
        <div className="text-center pt-8">
          <Link href="/events/athena-summit#register">
            <button className="px-9 py-4 bg-gold text-[#0b0714] border-2 border-black font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer">
              <span>Register for the Summit</span>
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
