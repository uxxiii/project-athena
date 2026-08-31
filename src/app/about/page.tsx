"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Target, Eye, Heart, Quote, Shield } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Intellectual Rigour",
    desc: "Every committee, agenda, and document is crafted to challenge delegates to engage in deep analytical debate.",
  },
  {
    icon: Eye,
    title: "Procedural Excellence",
    desc: "Authentic rules of procedure that maintain parliamentary decorum while encouraging creative resolution drafting.",
  },
  {
    icon: Heart,
    title: "Inclusive Leadership",
    desc: "A summit that welcomes first-time debaters alongside veteran delegates in an atmosphere of mutual respect.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* ─── Hero Header ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-5 mb-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-purple-deep/80 px-4 py-1.5 backdrop-blur-md">
            <span className="text-gold text-xs font-heading tracking-[0.25em] uppercase">
              The Institution & Ethos
            </span>
          </div>

          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-cream leading-tight">
            About <span className="text-gradient-gold italic font-normal">Project Athena</span>
          </h1>
          <div className="filigree-divider max-w-xs mx-auto" />
          <p className="text-cream/65 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-sans font-light">
            Named after the goddess of wisdom and strategic council, Athena represents
            intellectual fortitude, procedural clarity, and diplomatic grace.
          </p>
        </motion.div>

        {/* ─── Framed Banner Image ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mb-24 flex justify-center"
        >
          <div className="relative rounded-2xl overflow-hidden p-2 bg-gradient-to-br from-gold/30 via-purple-mid/40 to-gold/20 border border-gold/40 shadow-2xl shadow-purple-deep/90 max-w-3xl w-full">
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src="/full-logo.jpeg"
                alt="Athena Summit Banner"
                width={900}
                height={380}
                className="w-full h-auto object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0714] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-cream/70 font-heading">
                <span>PROJECT ATHENA CONCLAVE</span>
                <span className="text-gold font-medium">POWERED BY ELDR.</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Mission & Vision Grid ────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-10 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 space-y-4 relative"
          >
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-gold" />
              <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">Our Mission</span>
            </div>
            <h2 className="font-heading text-3xl text-cream">
              Fostering Diplomatic <span className="text-gold italic font-normal">Excellence</span>
            </h2>
            <p className="text-cream/60 text-sm leading-relaxed font-sans font-light">
              Project Athena was founded to elevate the standards of collegiate diplomacy conferences.
              We construct agendas that mirror complex real-world dynamics, encouraging delegates to negotiate beyond rhetoric and arrive at actionable resolutions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 space-y-4 relative"
          >
            <div className="flex items-center gap-3">
              <Target size={20} className="text-gold" />
              <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">Our Vision</span>
            </div>
            <h2 className="font-heading text-3xl text-cream">
              Shaping Tomorrow&apos;s <span className="text-gold italic font-normal">Statespeople</span>
            </h2>
            <p className="text-cream/60 text-sm leading-relaxed font-sans font-light">
              We envision a community of analytical, empathetic, and articulate leaders.
              Whether deliberating global migration at UNHRC or regional accountability at BLA, delegates leave Athena equipped with profound global perspectives.
            </p>
          </motion.div>
        </div>

        {/* ─── Quote Card ───────────────────────────────────────────── */}
        <div className="velvet-card rounded-2xl p-10 md:p-14 text-center mb-24 relative overflow-hidden">
          <Quote size={36} className="mx-auto text-gold/40 mb-4" />
          <blockquote className="font-heading text-2xl sm:text-3xl text-cream italic max-w-2xl mx-auto leading-relaxed">
            &ldquo;In an era of fragmenting consensus, the ability to listen, synthesize, and lead is the ultimate power.&rdquo;
          </blockquote>
          <p className="mt-4 text-xs tracking-[0.25em] uppercase text-gold">Project Athena Executive Board</p>
        </div>

        {/* ─── Core Values ──────────────────────────────────────────── */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14 space-y-2"
          >
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-medium">Core Pillars</p>
            <h2 className="font-heading text-4xl text-cream">
              The Athena <span className="text-gradient-gold italic font-normal">Pillars</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="glass-card rounded-xl p-7 text-center group"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 ring-1 ring-gold/30 mb-5 group-hover:ring-gold transition-all">
                  <v.icon size={22} className="text-gold" />
                </div>
                <h3 className="font-heading text-xl text-cream mb-2 group-hover:text-gold transition-colors">
                  {v.title}
                </h3>
                <p className="text-xs text-cream/50 leading-relaxed font-sans font-light">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="filigree-divider" />
      </div>
    </div>
  );
}
