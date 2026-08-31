"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, Clock } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

const contactChannels = [
  {
    icon: Mail,
    title: "Secretariat Email",
    detail: "project.athena03@gmail.com",
    sub: "Official inquiries & delegate support",
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
];

export default function ContactPage() {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("Message received by the Secretariat. We’ll respond shortly.");
  };

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-purple-deep/80 px-4 py-1.5 backdrop-blur-md">
            <span className="text-gold text-xs font-heading tracking-[0.25em] uppercase">
              Secretariat Concierge
            </span>
          </div>

          <h1 className="font-heading text-5xl sm:text-6xl text-cream">
            Contact <span className="text-gradient-gold italic font-normal">Us</span>
          </h1>
          <div className="filigree-divider max-w-xs mx-auto" />
          <p className="text-cream/60 max-w-lg mx-auto text-sm font-sans font-light leading-relaxed">
            Have questions regarding committee agendas, portfolio allocation, payment verification, or delegation partnerships?
          </p>
        </motion.div>

        {/* Contact Channels */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {contactChannels.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 ring-1 ring-gold/25 mb-4 group-hover:ring-gold transition-all">
                <item.icon size={20} className="text-gold" />
              </div>
              <h3 className="font-heading text-lg text-cream mb-1">{item.title}</h3>
              <p className="text-sm text-gold font-medium">{item.detail}</p>
              <p className="text-xs text-cream/40 mt-1">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="velvet-card rounded-2xl p-8 md:p-12 shadow-2xl relative">
            <div className="text-center mb-8 border-b border-gold/15 pb-6">
              <h3 className="font-heading text-2xl text-cream">
                Send an <span className="text-gradient-gold italic font-normal">Official Message</span>
              </h3>
              <p className="text-xs text-cream/40 mt-1 font-sans font-light">
                Direct dispatch to the Executive Secretariat
              </p>
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
                <p className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  {feedback}
                </p>
              )}

              <div className="pt-2 flex justify-end">
                <Button type="submit" size="lg" className="rounded-full px-8 uppercase tracking-wider text-xs font-semibold">
                  <Send size={14} />
                  <span>Dispatch Message</span>
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
