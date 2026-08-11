import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-24">
      <div className="max-w-xl rounded-3xl border border-gold/20 bg-purple-deep/80 p-10 text-center shadow-2xl shadow-black/20">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold">
          <Compass size={28} />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">404 • Page Missing</p>
        <h1 className="mt-3 font-heading text-4xl text-cream">This page seems to have drifted.</h1>
        <p className="mt-4 text-sm leading-relaxed text-cream/60">
          The route you requested could not be found. Return to the main summit portal and continue exploring Athena’s experience.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-gold-light"
        >
          <ArrowLeft size={16} />
          Return Home
        </Link>
      </div>
    </div>
  );
}
