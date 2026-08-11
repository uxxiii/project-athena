"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Athena" },
  { href: "/events", label: "Committees & Events" },
  { href: "/contact", label: "Contact Us" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  const bgOpacity = useTransform(scrollY, [0, 80], [0.4, 0.95]);
  const backdropBlur = useTransform(scrollY, [0, 80], [8, 20]);
  const borderAlpha = useTransform(scrollY, [0, 80], [0.08, 0.2]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 transition-all duration-300 pointer-events-none"
    >
      <div
        className="mx-auto max-w-7xl rounded-3xl lg:rounded-full border transition-all duration-300 pointer-events-auto overflow-hidden"
        style={{
          backgroundColor: `rgba(20, 11, 36, ${bgOpacity.get()})`,
          backdropFilter: `blur(${backdropBlur.get()}px)`,
          borderColor: `rgba(212, 175, 55, ${borderAlpha.get()})`,
          boxShadow: scrollY.get() > 30 ? "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.1)" : "none",
        }}
      >
        <nav className="flex items-center justify-between px-6 py-3">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gold/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Image
                src="/logo.jpeg"
                alt="Project Athena"
                width={38}
                height={38}
                className="relative rounded-full ring-1 ring-gold/40 group-hover:ring-gold transition-all duration-500"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl tracking-wide text-cream group-hover:text-gold transition-colors">
                Project <span className="text-gold font-normal">Athena</span>
              </span>
              <span className="text-[9px] tracking-[0.2em] text-cream/40 uppercase font-sans font-medium -mt-1">
                Collegiate Diplomacy
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative text-xs tracking-wider uppercase font-medium transition-all duration-300 py-1 px-1",
                    isActive ? "text-gold font-semibold" : "text-cream/70 hover:text-gold"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-glow-bar"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA & Mobile Trigger */}
          <div className="flex items-center gap-4">
            <Link href="/events/athena-summit#register" className="hidden sm:block">
              <Button size="sm" className="rounded-full px-5 text-xs font-semibold uppercase tracking-wider shadow-md shadow-gold/15">
                <span>Register Now</span>
                <Sparkles size={13} className="text-purple-deep" />
              </Button>
            </Link>

            <button
              className="lg:hidden p-2 rounded-full text-cream/80 hover:text-gold hover:bg-gold/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
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
            className="lg:hidden border-t border-gold/15 bg-purple-deep/95 backdrop-blur-2xl px-6 py-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-sm tracking-wider uppercase font-medium transition-colors py-2 flex items-center justify-between border-b border-white/5",
                    pathname === link.href ? "text-gold" : "text-cream/70"
                  )}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight size={14} className="text-gold/40" />
                </Link>
              ))}
              <Link href="/events/athena-summit#register" onClick={() => setMobileOpen(false)} className="mt-2">
                <Button size="sm" className="w-full rounded-full uppercase tracking-wider text-xs">
                  Register for Summit
                  <Sparkles size={14} />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
