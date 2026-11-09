import React from "react";
import { Phone, MessageCircle } from "lucide-react";

export const SUMMIT_INQUIRY_CONTACTS = [
  { name: "Helpline 1", phone: "+91 87972 28078", raw: "918797228078" },
  { name: "Helpline 2", phone: "+91 93116 79175", raw: "919311679175" },
  { name: "Helpline 3", phone: "+91 92149 72080", raw: "919214972080" },
  { name: "Helpline 4", phone: "+91 99422 03720", raw: "919942203720" },
];

export function RegistrationHelpline() {
  return (
    <div className="mt-8 border-2 border-gold/30 bg-[#0b0714] p-5 shadow-[4px_4px_0px_0px_#000000]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-gold font-mono text-[11px] font-bold uppercase tracking-wider">
            <Phone className="w-3.5 h-3.5" />
            <span>Need Help With Registration / Allotment?</span>
          </div>
          <p className="text-xs text-cream/60 font-sans mt-0.5">
            Reach out directly to the Athena Summit Secretariat helpline team:
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5">
          Call or WhatsApp
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SUMMIT_INQUIRY_CONTACTS.map((c) => (
          <div
            key={c.phone}
            className="border border-white/10 bg-[#140b24] p-3 flex items-center justify-between hover:border-gold/50 transition-colors shadow-[2px_2px_0px_0px_#000000]"
          >
            <div>
              <span className="font-heading text-sm text-cream font-bold block">{c.name}</span>
              <a
                href={`tel:${c.phone.replace(/\s+/g, "")}`}
                className="text-xs font-mono text-cream/70 hover:text-gold block mt-0.5 transition-colors"
              >
                {c.phone}
              </a>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={`https://wa.me/${c.raw}?text=${encodeURIComponent("Hi! I have an inquiry regarding Athena Summit registration.")}`}
                target="_blank"
                rel="noreferrer"
                title={`Chat with ${c.name} on WhatsApp`}
                className="h-8 w-8 rounded-none border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-colors"
              >
                <MessageCircle size={15} />
              </a>
              <a
                href={`tel:${c.phone.replace(/\s+/g, "")}`}
                title={`Call ${c.name}`}
                className="h-8 w-8 rounded-none border border-gold/40 bg-gold/10 hover:bg-gold/20 text-gold flex items-center justify-center transition-colors"
              >
                <Phone size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
