import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-purple-deep/95 text-cream">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] xl:grid-cols-[1.25fr_0.9fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.jpeg"
                alt="Project Athena"
                width={42}
                height={42}
                className="rounded-full ring-1 ring-gold/40"
              />
              <div>
                <p className="font-heading text-2xl text-cream">Project Athena</p>
                <p className="text-[11px] uppercase tracking-[0.25em] text-gold/70">
                  Summit for student diplomacy
                </p>
              </div>
            </div>

            <p className="max-w-lg text-sm text-cream/65 leading-relaxed">
              A focused platform for registration, committee updates, and event coordination across the Athena Summit.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 text-sm text-cream/60">
              <div>
                <p className="font-semibold text-cream">Summit</p>
                <p className="text-cream/60">Athena Summit • Oct 2026</p>
              </div>
              <div>
                <p className="font-semibold text-cream">Status</p>
                <p className="text-cream/60">Open for delegate registration</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h4 className="text-xs uppercase tracking-[0.3em] text-gold mb-4">
                Useful links
              </h4>
              <ul className="space-y-3 text-sm text-cream/65">
                <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-gold transition-colors">About</Link></li>
                <li><Link href="/events" className="hover:text-gold transition-colors">Committees</Link></li>
                <li><Link href="/events/athena-summit#register" className="hover:text-gold transition-colors">Register</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.3em] text-gold mb-4">
                Get in touch
              </h4>
              <div className="space-y-3 text-sm text-cream/65">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gold/70" />
                  <span>contact@projectathena.org</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-gold/70" />
                  <span>India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-gold/70" />
                  <span>@projectathena</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-cream/10">
                <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Quick links</p>
                <div className="flex items-center gap-4">
                  <Link href="/contact" className="text-cream/60 hover:text-gold transition-colors" aria-label="Contact the Secretariat">
                    <Mail size={16} />
                  </Link>
                  <Link href="/about" className="text-cream/60 hover:text-gold transition-colors" aria-label="Learn more about Athena">
                    <Globe size={16} />
                  </Link>
                  <Link href="/events" className="text-cream/60 hover:text-gold transition-colors" aria-label="Explore events">
                    <MapPin size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gold/10 pt-5 text-sm text-cream/55 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Project Athena • Designed for academic delegates</p>
          <p className="text-cream/60">Powered by Eldr.</p>
        </div>
      </div>
    </footer>
  );
}
