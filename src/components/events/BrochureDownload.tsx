"use client";

import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface BrochureDownloadProps {
  brochureUrl?: string;
  eventTitle: string;
}

export function BrochureDownload({
  brochureUrl,
  eventTitle,
}: BrochureDownloadProps) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-xl border border-gold/15 bg-gradient-to-r from-purple-dark/60 to-purple-deep/40 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl" />

          <div className="relative flex items-start gap-5">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-gold/10 ring-1 ring-gold/20">
              <FileText size={24} className="text-gold" />
            </div>
            <div>
              <h3 className="font-heading text-2xl text-cream">
                Conference <span className="text-gold">Brochure</span>
              </h3>
              <p className="mt-1.5 text-sm text-cream/45 max-w-md">
                Download the official {eventTitle} brochure with committee details,
                schedules, and study guidelines.
              </p>
            </div>
          </div>

          {brochureUrl ? (
            <Button href={brochureUrl} download className="whitespace-nowrap relative flex-shrink-0">
              <Download size={16} />
              Download Brochure
            </Button>
          ) : (
            <Button disabled className="whitespace-nowrap opacity-50 flex-shrink-0">
              <Download size={16} />
              Coming Soon
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
