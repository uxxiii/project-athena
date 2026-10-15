import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Heart, ArrowRight } from "lucide-react";

function InstagramIcon({ size = 15, className = "" }: { size?: number; className?: string }) {
  return (
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
}

export function Footer() {
  return (
    <footer className="border-t-2 border-white/10 bg-[#0b0714] text-cream relative overflow-hidden neo-grid-bg">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] xl:grid-cols-[1.3fr_0.9fr] items-start">
          
          {/* Left Column: Brand & Mission */}
          <div className="space-y-6">
            <div className="inline-block transform -rotate-1">
              <div className="px-4 py-1.5 bg-gold border-2 border-black text-[#0b0714] font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000]">
                Collegiate Diplomacy For All
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Image
                src="/logo.jpeg"
                alt="Project Athena"
                width={48}
                height={48}
                className="border-2 border-white/20 shadow-[2px_2px_0px_0px_#000000]"
              />
              <div>
                <p className="font-heading text-2xl sm:text-3xl text-cream font-extrabold uppercase tracking-tight">Project Athena</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-cream/60 font-mono font-bold">
                  Summit For Student Diplomacy
                </p>
              </div>
            </div>

            <p className="max-w-xl text-sm text-cream/70 leading-relaxed font-sans font-normal">
              For leaders, debaters, and delegates across the nation. Project Athena brings together premier institutions for rigorous diplomatic discourse, authentic crisis simulations, and 100% direct societal aid.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 bg-[#140b24] border-2 border-white/15 shadow-[3px_3px_0px_0px_#000000]">
                <p className="font-bold text-xs uppercase text-gold/90 font-mono tracking-wider">Summit Convening</p>
                <p className="text-sm text-cream font-medium mt-0.5">Athena Summit • Nov 2026</p>
              </div>
              <div className="p-4 bg-[#140b24] border-2 border-white/15 shadow-[3px_3px_0px_0px_#000000]">
                <p className="font-bold text-xs uppercase text-gold/90 font-mono tracking-wider">Societal Mission</p>
                <p className="text-sm text-cream font-medium mt-0.5 flex items-center gap-1.5">
                  <Heart size={14} className="text-gold fill-gold/20" /> 100% NGO Remittance
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Links & Contact */}
          <div className="grid gap-8 sm:grid-cols-2">
            {/* Quick Links */}
            <div className="space-y-4">
              <div className="inline-block">
                <span className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-cream/80 border-b-2 border-white/20 pb-1 block">
                  EXPLORE SUMMIT
                </span>
              </div>
              <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-cream/70">
                <li>
                  <Link href="/" className="hover:text-gold hover:underline flex items-center gap-1 transition-colors">
                    <ArrowRight size={12} className="text-cream/40" /> Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-gold hover:underline flex items-center gap-1 transition-colors">
                    <ArrowRight size={12} className="text-cream/40" /> About Athena
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="hover:text-gold hover:underline flex items-center gap-1 transition-colors">
                    <ArrowRight size={12} className="text-cream/40" /> Events
                  </Link>
                </li>
                <li>
                  <Link href="/teams" className="hover:text-gold hover:underline flex items-center gap-1 transition-colors">
                    <ArrowRight size={12} className="text-cream/40" /> Secretariat & Team
                  </Link>
                </li>
                <li>
                  <Link href="/donate" className="hover:text-gold hover:underline flex items-center gap-1 transition-colors">
                    <ArrowRight size={12} className="text-cream/40" /> Societal Mission & Waitlist
                  </Link>
                </li>
                <li>
                  <Link href="/events/athena-summit#register" className="text-gold hover:underline flex items-center gap-1 transition-colors">
                    <ArrowRight size={12} className="text-gold" /> Summit Registration
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <div className="inline-block">
                <span className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-cream/80 border-b-2 border-white/20 pb-1 block">
                  SECRETARIAT HQ
                </span>
              </div>
              <div className="space-y-2.5 text-xs text-cream/70">
                <a
                  href="mailto:project.athena03@gmail.com"
                  className="flex items-center gap-2.5 p-2.5 bg-[#140b24] border border-white/15 hover:border-gold/50 transition-colors group"
                >
                  <Mail size={15} className="text-gold shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-cream/90 group-hover:text-gold transition-colors">project.athena03@gmail.com</span>
                </a>
                <div className="flex items-center gap-2.5 p-2.5 bg-[#140b24] border border-white/15">
                  <MapPin size={15} className="text-gold shrink-0" />
                  <span className="font-mono text-cream/90">India (Collegiate Circuit)</span>
                </div>
                <a
                  href="https://www.instagram.com/athena.summit/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2.5 bg-[#140b24] border border-white/15 hover:border-gold/50 transition-colors group"
                >
                  <InstagramIcon size={15} className="text-gold shrink-0" />
                  <span className="font-mono text-cream/90 group-hover:text-gold transition-colors">@athena.summit</span>
                </a>
              </div>

              <div className="pt-2">
                <Link
                  href="/events/athena-summit#register"
                  className="inline-flex items-center justify-center w-full px-4 py-3 bg-gold text-[#0b0714] font-extrabold text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[5px_5px_0px_0px_#000000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  Join Delegation Registry
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-white/10 text-xs text-cream/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-mono">
          <p>© {new Date().getFullYear()} Project Athena. All rights reserved. Built for collegiate delegates.</p>
          <div className="flex items-center gap-4 text-cream/60">
            <span className="font-bold">Athena Summit • &ldquo;We debate, therefore we lead.&rdquo;</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
