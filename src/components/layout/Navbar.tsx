"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/donate", label: "Societal Mission", badge: "Waitlist" },
  { href: "/teams", label: "Teams" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  const bgOpacity = useTransform(scrollY, [0, 80], [0.85, 0.98]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-3 left-0 right-0 z-50 px-4 sm:px-6 transition-all duration-300 pointer-events-none"
    >
      <div
        className="mx-auto max-w-7xl border-2 border-white/20 bg-[#120a1f]/95 backdrop-blur-xl shadow-[4px_4px_0px_0px_#000000] transition-all duration-200 pointer-events-auto"
      >
        <nav className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center">
              <Image
                src="/logo.jpeg"
                alt="Project Athena"
                width={40}
                height={40}
                className="rounded-none border-2 border-white/30 shadow-[2px_2px_0px_0px_#000000] group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-cream group-hover:text-gold transition-colors font-sans uppercase">
                Project <span className="text-gold">Athena</span>
              </span>
              <span className="text-[9px] tracking-[0.2em] text-cream/50 uppercase font-mono font-bold -mt-0.5">
                Diplomacy For All
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Clean Behes Style) */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-1.5 border-2",
                    isActive
                      ? "bg-gold text-[#0b0714] border-black shadow-[2px_2px_0px_0px_#000000]"
                      : "text-cream/80 border-transparent hover:border-white/25 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={cn(
                        "text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-none font-black border",
                        isActive
                          ? "bg-purple-deep text-gold border-black"
                          : "bg-gold text-[#0b0714] border-black shadow-[1px_1px_0px_0px_#000]"
                      )}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA & Mobile Trigger */}
          <div className="flex items-center space-x-3">
            <Link href="/events/athena-summit#register" className="hidden sm:inline-flex">
              <Button size="sm" className="font-extrabold text-xs uppercase px-5 py-2 shadow-[3px_3px_0px_0px_#000000] hover:shadow-[5px_5px_0px_0px_#000000]">
                <span>Register</span>
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </Link>

            <button
              className="lg:hidden flex items-center gap-2 px-3 py-2 text-cream hover:text-white bg-purple-dark border-2 border-white/20 shadow-[2px_2px_0px_0px_#000000] transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              <span className="font-bold text-xs uppercase font-mono">Menu</span>
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t-2 border-white/10 bg-[#140b24] px-6 py-5"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-2 flex items-center justify-between",
                    pathname === link.href
                      ? "bg-gold text-[#0b0714] border-black shadow-[3px_3px_0px_0px_#000000]"
                      : "text-cream/80 border-white/15 hover:border-white/40 hover:text-white hover:bg-white/5"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {link.label}
                    {link.badge && (
                      <span className="text-[9px] font-mono uppercase bg-gold text-[#0b0714] px-1.5 py-0.5 border border-black font-black shadow-[1px_1px_0px_0px_#000]">
                        {link.badge}
                      </span>
                    )}
                  </span>
                  <ArrowRight size={14} />
                </Link>
              ))}
              <div className="pt-3 border-t border-white/10">
                <Link href="/events/athena-summit#register" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full text-xs font-extrabold uppercase py-3 shadow-[4px_4px_0px_0px_#000000]">
                    Register for Summit
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
