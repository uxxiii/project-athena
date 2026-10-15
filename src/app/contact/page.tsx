"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, Clock, Camera, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

const InstagramIcon = ({ size = 22, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const contactChannels: { icon: typeof Mail | typeof InstagramIcon; title: string; detail: string; sub: string; href?: string }[] = [
  {
    icon: Mail,
    title: "Secretariat Email",
    detail: "project.athena03@gmail.com",
    sub: "Official inquiries & delegate support",
    href: "mailto:project.athena03@gmail.com",
  },
  {
    icon: MessageSquare,
    title: "Delegate Helpline",
    detail: "Available via WhatsApp",
    sub: "Direct line during registration window",
  },
  {
    icon: Clock,
    title: "Response Window",
    detail: "24 Hours Priority",
    sub: "Prompt resolution for all queries",
  },
  {
    icon: InstagramIcon,
    title: "Follow Us",
    detail: "@athena.summit",
    sub: "Updates, announcements & behind the scenes",
    href: "https://www.instagram.com/athena.summit/",
  },
];

export default function ContactPage() {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("Message received by the Secretariat. We’ll respond promptly within 24 hours.");
  };

  return (
    <div className="pt-32 sm:pt-40 pb-24 neo-grid-bg relative overflow-hidden">
      {/* Corner Architectural Brackets */}
      <div className="absolute top-0 left-0 w-32 sm:w-44 h-32 sm:h-44 border-l-2 border-t-2 border-white/15 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 sm:w-44 h-32 sm:h-44 border-r-2 border-t-2 border-white/15 pointer-events-none" />

      <div className="mx-auto max-w-5xl px-6 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-block transform -rotate-1">
            <div className="px-5 py-2 bg-gold border-2 border-black text-[#0b0714] font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000]">
              Secretariat Concierge
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-cream">
            Contact <span className="text-gold">Project Athena</span>
          </h1>

          <p className="text-cream/75 max-w-lg mx-auto text-sm sm:text-base font-normal leading-relaxed">
            Have questions regarding committee agendas, portfolio allocation, payment verification, or institutional delegation partnerships?
          </p>
        </motion.div>

        {/* Contact Channels Grid (Neo-Brutalist Cards) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactChannels.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#140b24] border-2 border-white/15 hover:border-gold/60 p-6 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 transition-all group"
            >
              <div className="flex h-12 w-12 items-center justify-center bg-[#1f1238] border border-white/20 shadow-[2px_2px_0px_0px_#000000] mb-4 group-hover:border-gold transition-all">
                <item.icon size={22} className="text-gold" />
              </div>
              <h3 className="font-heading text-lg font-extrabold text-cream mb-1 uppercase tracking-wider">
                {item.title}
              </h3>
              <p className="text-sm font-mono font-bold text-cream/90">{item.detail}</p>
              <p className="text-xs text-cream/50 mt-1 font-sans">{item.sub}</p>
              {item.href && (
                <a
                  href={item.href}
                  target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-gold hover:underline transition-colors"
                >
                  <span>{item.href.startsWith("mailto:") ? "Send Email" : "Visit Profile"}</span>
                  <ArrowRight size={10} />
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {/* Form Container (Neo-Brutalist Frame) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-[#140b24] border-2 border-white/20 p-8 md:p-12 shadow-[6px_6px_0px_0px_#000000] relative">
            <div className="text-center mb-8 border-b border-white/10 pb-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold/90 block mb-1">
                DISPATCH TO SECRETARIAT
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-cream tracking-tight">
                Send An <span className="text-gold">Official Message</span>
              </h3>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Full Name" placeholder="Rahul Sharma" required />
                <Input label="Email Address" type="email" placeholder="rahul@example.com" required />
              </div>

              <Input label="Subject / Delegation" placeholder="Query regarding UNCSW portfolio allocation" required />

              <Textarea
                label="Message Details"
                placeholder="Specify your institution, committee preference, or query details..."
                className="min-h-35"
                required
              />

              {feedback && (
                <div className="p-4 bg-emerald-950/60 border-2 border-emerald-400 text-xs sm:text-sm text-emerald-300 font-mono shadow-[3px_3px_0px_0px_#000000]">
                  ✓ {feedback}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gold text-[#0b0714] font-extrabold text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={15} />
                  <span>Dispatch Message</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
