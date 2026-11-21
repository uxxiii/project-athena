"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  CheckCircle2,
  UserCheck,
  MapPin,
  Sparkles,
} from "lucide-react";

interface CheckinDelegate {
  id: string;
  name: string;
  committeeId: string;
  committeeName: string;
  portfolioName: string;
  day2Present: boolean;
  day2Time: string | null;
}

export default function Day2SelfCheckinPage() {
  const [delegates, setDelegates] = useState<CheckinDelegate[]>([]);
  const [committeeList, setCommitteeList] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedComm, setSelectedComm] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [justCheckedIn, setJustCheckedIn] = useState<CheckinDelegate | null>(null);

  const fetchRoster = useCallback(async () => {
    try {
      const res = await fetch("/api/scorecard?mode=checkin", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setDelegates(data.delegates || []);
      setCommitteeList(data.committees || []);
    } catch (err) {
      console.error("Failed to load Day 2 check-in roster:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  const handleCheckIn = async (del: CheckinDelegate) => {
    if (del.day2Present || markingId) return;
    setMarkingId(del.id);

    // Optimistic update
    const nowIso = new Date().toISOString();
    setDelegates((prev) =>
      prev.map((d) =>
        d.id === del.id ? { ...d, day2Present: true, day2Time: nowIso } : d
      )
    );

    try {
      const res = await fetch("/api/scorecard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "self_checkin_day2",
          delegateId: del.id,
        }),
      });
      if (res.ok) {
        setJustCheckedIn({ ...del, day2Present: true, day2Time: nowIso });
      }
    } catch (err) {
      console.error("Self check-in error:", err);
    } finally {
      setMarkingId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return delegates.filter((d) => {
      if (selectedComm !== "all" && d.committeeId !== selectedComm) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.portfolioName.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.committeeName.toLowerCase().includes(q)
      );
    });
  }, [delegates, selectedComm, search]);

  const checkedInCount = useMemo(
    () => delegates.filter((d) => d.day2Present).length,
    [delegates]
  );

  return (
    <div className="min-h-screen bg-[#0b0714] text-cream neo-grid-bg px-4 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-[#140b24] border-2 border-gold p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000] space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.jpeg"
                alt="Project Athena"
                width={44}
                height={44}
                className="border-2 border-gold shadow-[2px_2px_0px_0px_#000]"
              />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold font-bold block">
                  Athena Summit 2026 • Day 2 Check-In
                </span>
                <h1 className="font-heading text-xl sm:text-2xl font-black uppercase text-cream">
                  Delegate Attendance <span className="text-gold">Self Check-In</span>
                </h1>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
              <UserCheck size={14} />
              <span>{checkedInCount} Checked In</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cream/70 bg-[#0b0714] border border-white/10 px-3.5 py-2.5">
            <MapPin size={14} className="text-gold shrink-0" />
            <span>
              <strong className="text-gold">Day 2 (21 Nov 2026):</strong> Chanakya National Law University (CNLU), Patna
            </span>
          </div>

          <p className="text-xs sm:text-sm text-cream/75 leading-relaxed">
            Search your <strong className="text-white">Name</strong>,{" "}
            <strong className="text-white">Portfolio</strong>, or{" "}
            <strong className="text-white">Pass ID</strong> below and tap{" "}
            <strong className="text-emerald-300">Mark Present</strong> to record your Day 2 attendance directly with your Committee Chair.
          </p>
        </div>

        {/* Success Confirmation Banner */}
        {justCheckedIn && (
          <div className="bg-emerald-500/15 border-2 border-emerald-400 p-5 shadow-[4px_4px_0px_0px_#000] flex items-start gap-3.5">
            <CheckCircle2 size={24} className="text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-heading text-base sm:text-lg font-black uppercase text-emerald-300 flex items-center gap-1.5">
                <span>Day 2 Attendance Confirmed!</span>
                <Sparkles size={15} />
              </p>
              <p className="text-xs sm:text-sm text-cream">
                <strong>{justCheckedIn.name}</strong> ({justCheckedIn.id}) —{" "}
                <span className="text-gold font-semibold">
                  {justCheckedIn.committeeName} · {justCheckedIn.portfolioName}
                </span>{" "}
                has been marked <strong>PRESENT</strong> for Day 2 and synced to your Executive Board sheet.
              </p>
            </div>
          </div>
        )}

        {/* Search & Committee Filter Bar */}
        <div className="bg-[#140b24] border-2 border-white/20 p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] space-y-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type your Name, Portfolio (e.g. India, CSK), or Pass ID..."
              autoFocus
              className="w-full bg-[#0b0714] border-2 border-gold/50 focus:border-gold pl-11 pr-4 py-3.5 text-sm font-mono text-cream outline-none shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedComm("all")}
              className={`px-3 py-1.5 text-[11px] font-mono font-bold uppercase border cursor-pointer ${
                selectedComm === "all"
                  ? "bg-gold text-[#0b0714] border-black font-black"
                  : "bg-[#0b0714] text-cream/70 border-white/15 hover:border-gold/50"
              }`}
            >
              All Committees
            </button>
            {committeeList.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedComm(c.id)}
                className={`px-3 py-1.5 text-[11px] font-mono font-bold uppercase border cursor-pointer ${
                  selectedComm === c.id
                    ? "bg-gold text-[#0b0714] border-black font-black"
                    : "bg-[#0b0714] text-cream/70 border-white/15 hover:border-gold/50"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Delegate Results List */}
        <div className="space-y-2.5">
          {loading ? (
            <div className="bg-[#140b24] border-2 border-white/15 p-10 text-center font-mono text-xs text-cream/50">
              Loading Delegate Roster...
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-[#140b24] border-2 border-white/15 p-10 text-center font-mono text-xs text-cream/50">
              No delegate found matching &ldquo;{search}&rdquo;. Try searching by your first name or portfolio.
            </div>
          ) : (
            filtered.map((del) => (
              <div
                key={del.id}
                className={`p-4 border-2 shadow-[3px_3px_0px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  del.day2Present
                    ? "bg-[#0e1f18] border-emerald-500/50"
                    : "bg-[#140b24] border-white/15 hover:border-gold/60"
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading text-base font-extrabold text-cream">
                      {del.name}
                    </span>
                    <span className="px-2 py-0.5 bg-[#0b0714] border border-gold/40 text-gold text-[10px] font-mono font-bold">
                      {del.id}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-cream/75">
                    <strong className="text-gold">{del.committeeName}</strong> ·{" "}
                    <span>{del.portfolioName}</span>
                  </div>
                </div>

                {del.day2Present ? (
                  <div className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 text-xs font-mono font-black uppercase shrink-0">
                    <CheckCircle2 size={15} />
                    <span>Present (Day 2)</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={markingId === del.id}
                    onClick={() => handleCheckIn(del)}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-gold hover:bg-gold-light text-[#0b0714] border-2 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer shrink-0"
                  >
                    <UserCheck size={15} />
                    <span>
                      {markingId === del.id ? "Marking..." : "Mark Present"}
                    </span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
