"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowDown } from "lucide-react";
import type { SummitEvent } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface EventHeroProps {
  event: SummitEvent;
}

export function EventHero({ event }: EventHeroProps) {
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-end">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/full-logo.jpeg"
          alt=""
          fill
          className="object-cover object-center opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
      </div>

      {/* Purple glow effects */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-mid/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-40 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl space-y-6"
        >
          <Badge variant={event.registrationOpen ? "success" : "warning"}>
            {event.registrationOpen ? "Registration Open" : "Registration Closed"}
          </Badge>

          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-cream leading-[1.05]">
            {event.title.split(" ").map((word, i) => (
              <span key={i}>
                {i > 0 && " "}
                {i === event.title.split(" ").length - 1 ? (
                  <span className="text-gradient-gold">{word}</span>
                ) : (
                  word
                )}
              </span>
            ))}
          </h1>

          <p className="text-xl text-gold/70 font-heading tracking-wide">
            {event.subtitle}
          </p>

          <div className="flex flex-wrap gap-6 text-cream/55">
            <span className="flex items-center gap-2">
              <Calendar size={16} className="text-gold" />
              {event.date}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-gold" />
              {event.location}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            {event.registrationOpen && (
              <Button href="#register" size="lg">
                Register Now
                <ArrowDown size={16} />
              </Button>
            )}
            <Button href="#committees" size="lg" variant="outline">
              View Committees
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
