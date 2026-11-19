"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DiwaliDecor } from "@/components/festive/DiwaliDecor";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandaloneApp =
    pathname?.startsWith("/admin") || pathname?.startsWith("/chair-scoring");

  if (isStandaloneApp) {
    return (
      <main id="main-content" className="flex-1 min-h-screen">
        {children}
      </main>
    );
  }

  return (
    <>
      <DiwaliDecor />
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
