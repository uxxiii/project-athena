"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Lock,
  Trophy,
  Search,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Users,
  Sparkles,
  FileSpreadsheet,
} from "lucide-react";
import type {
  ScorecardVisibility,
  ScoreColumn,
  AttendanceRecord,
} from "@/lib/scorecard-storage";

interface PublicDelegate {
  id: string;
  name: string;
  committeeId: string;
  committeeName: string;
  portfolioName: string;
  institution: string;
}

interface PublicCommitteeSheet {
  committeeId: string;
  day1Columns: ScoreColumn[];
  day2Columns: ScoreColumn[];
  photographerDay1Columns?: ScoreColumn[];
  photographerDay2Columns?: ScoreColumn[];
  scores: Record<
    string,
    {
      day1: Record<string, string>;
      day2: Record<string, string>;
      remarks?: string;
      award?: string;
    }
  >;
}

function sumCols(
  dayObj: Record<string, string> | undefined,
  cols: ScoreColumn[]
): number {
  if (!dayObj) return 0;
  let sum = 0;
  for (const col of cols) {
    const raw = String(dayObj[col.id] ?? "").trim();
    if (!raw) continue;
    const n = parseFloat(raw);
    if (!isNaN(n) && isFinite(n)) sum += n;
  }
  return Math.round(sum * 100) / 100;
}

export default function PublicScorecardPage() {
  const [visibility, setVisibility] = useState<ScorecardVisibility>("private");
  const [attendanceSummary, setAttendanceSummary] = useState<
    Record<string, { total: number; day1Present: number; day2Present: number }>
  >({});
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [delegates, setDelegates] = useState<PublicDelegate[]>([]);
  const [committeesData, setCommitteesData] = useState<
    Record<string, PublicCommitteeSheet>
  >({});
  const [committeeMeta, setCommitteeMeta] = useState<
    Array<{ id: string; name: string; fullName: string }>
  >([]);
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string>("ipl");
  const [ipSection, setIpSection] = useState<"journalist" | "photographer">("journalist");
  const [activeDayTab, setActiveDayTab] = useState<"day1" | "day2" | "combined">(
    "day1"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPublicScorecard = useCallback(async () => {
    try {
      const res = await fetch("/api/scorecard?mode=public", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setVisibility(data.visibility || "private");
      setAttendanceSummary(data.attendanceSummary || {});
      if (data.visibility !== "private") {
        setDelegates(data.delegates || []);
        setCommitteesData(data.committees || {});
        setAttendance(data.attendance || {});
        setCommitteeMeta(data.committeeMeta || []);
      } else {
        setCommitteeMeta(data.committees || []);
      }
    } catch (err) {
      console.error("Error loading public scorecard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicScorecard();
    const timer = setInterval(fetchPublicScorecard, 8000);
    return () => clearInterval(timer);
  }, [fetchPublicScorecard]);

  const activeSheet = committeesData[selectedCommitteeId];
  const isIpCommittee = selectedCommitteeId === "ip";
  const isPhotographerView = isIpCommittee && ipSection === "photographer";

  const activeDay1Cols = useMemo(() => {
    if (!activeSheet) return [];
    if (isPhotographerView) {
      return activeSheet.photographerDay1Columns || activeSheet.day1Columns || [];
    }
    return activeSheet.day1Columns || [];
  }, [activeSheet, isPhotographerView]);

  const activeDay2Cols = useMemo(() => {
    if (!activeSheet) return [];
    if (isPhotographerView) {
      return activeSheet.photographerDay2Columns || activeSheet.day2Columns || [];
    }
    return activeSheet.day2Columns || [];
  }, [activeSheet, isPhotographerView]);

  const rows = useMemo(() => {
    if (visibility === "private" || !activeSheet) return [];
    const commDels = delegates.filter((d) => {
      if (d.committeeId !== selectedCommitteeId) return false;
      if (isIpCommittee) {
        const isPhoto = d.portfolioName.toLowerCase().includes("photographer");
        return isPhotographerView ? isPhoto : !isPhoto;
      }
      return true;
    });
    const list = commDels.map((d) => {
      const rec = activeSheet.scores?.[d.id];
      const d1Total = sumCols(rec?.day1, activeDay1Cols);
      const d2Total =
        visibility === "final_published"
          ? sumCols(rec?.day2, activeDay2Cols)
          : 0;
      const grandTotal =
        visibility === "final_published"
          ? Math.round((d1Total + d2Total) * 100) / 100
          : d1Total;
      return {
        ...d,
        d1Total,
        d2Total,
        grandTotal,
        day1Cells: rec?.day1 || {},
        day2Cells: rec?.day2 || {},
        award: rec?.award || "",
        remarks: rec?.remarks || "",
        att: attendance[d.id] || { day1: false, day2: false },
      };
    });

    const sorted = [...list].sort((a, b) => b.grandTotal - a.grandTotal);
    const rankMap = new Map<string, number>();
    sorted.forEach((item, idx) => {
      if (item.grandTotal > 0) rankMap.set(item.id, idx + 1);
    });

    return sorted
      .map((item) => ({
        ...item,
        rank: rankMap.get(item.id) || null,
      }))
      .filter((item) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          item.id.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.portfolioName.toLowerCase().includes(q)
        );
      });
  }, [
    visibility,
    activeSheet,
    delegates,
    selectedCommitteeId,
    attendance,
    searchQuery,
    isIpCommittee,
    isPhotographerView,
    activeDay1Cols,
    activeDay2Cols,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-cream/70 font-mono text-sm">
        Loading Official Athena Summit Scorecard...
      </div>
    );
  }

  // ============================================================================
  // LOCKED STATE (Minimal Black Screen While Committee Sessions Are Running)
  // ============================================================================
  if (visibility === "private") {
    return (
      <div className="min-h-screen bg-black text-cream flex items-center justify-center px-6 pt-28 pb-20">
        <div className="max-w-2xl w-full text-center space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center bg-gold/10 border border-gold/40 text-gold">
            <Lock size={24} />
          </div>

          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-gold/80 font-bold">
            Athena Summit 2026 • Official Scorecard
          </p>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-cream leading-tight">
            Committee Deliberations{" "}
            <span className="text-gold">In Progress...</span>
          </h1>

          <p className="text-sm sm:text-base text-cream/55 max-w-xl mx-auto leading-relaxed">
            Executive Board evaluations are strictly encrypted while committees are in session. Official scores will be published on this page once Day 1 deliberations adjourn.
          </p>

          <div className="pt-2 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-cream/40">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <span>Scores Locked by Secretariat</span>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // PUBLISHED SCORECARD STATE (Day 1 Published or Final Published)
  // ============================================================================
  const activeCols =
    activeDayTab === "day2" && visibility === "final_published"
      ? activeDay2Cols
      : activeDay1Cols;

  return (
    <div className="pt-28 pb-24 min-h-screen neo-grid-bg bg-[#0b0714] text-cream px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-[#140b24] border-2 border-gold p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold text-[#0b0714] font-mono font-black text-xs uppercase border border-black">
              <Trophy size={13} />
              <span>
                {visibility === "final_published"
                  ? "OFFICIAL FINAL SCORECARD & STANDINGS (DAY 1 + DAY 2)"
                  : "OFFICIAL DAY 1 SCORECARD & STANDINGS"}
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black uppercase text-cream">
              Athena Summit 2026 <span className="text-gold">Live Scorecard</span>
            </h1>
            <p className="text-xs sm:text-sm text-cream/70">
              Verified Executive Board evaluations released by the Project Athena Secretariat.
            </p>
          </div>

          {visibility === "final_published" && (
            <div className="inline-flex border-2 border-white/20 bg-[#0b0714] self-start">
              <button
                type="button"
                onClick={() => setActiveDayTab("day1")}
                className={`px-3.5 py-2 text-xs font-mono font-bold uppercase cursor-pointer ${
                  activeDayTab === "day1"
                    ? "bg-gold text-[#0b0714] font-black"
                    : "text-cream/70"
                }`}
              >
                Day 1 Breakdown
              </button>
              <button
                type="button"
                onClick={() => setActiveDayTab("day2")}
                className={`px-3.5 py-2 text-xs font-mono font-bold uppercase cursor-pointer ${
                  activeDayTab === "day2"
                    ? "bg-gold text-[#0b0714] font-black"
                    : "text-cream/70"
                }`}
              >
                Day 2 Breakdown
              </button>
            </div>
          )}
        </div>

        {/* Committee Selector Tabs & Search */}
        <div className="bg-[#140b24] border-2 border-white/15 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            {committeeMeta.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCommitteeId(c.id)}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase border-2 transition-all cursor-pointer ${
                  selectedCommitteeId === c.id
                    ? "bg-gold text-[#0b0714] border-black font-black shadow-[3px_3px_0px_0px_#000]"
                    : "bg-[#0b0714] text-cream/75 border-white/15 hover:border-gold/50"
                }`}
              >
                {c.name}
              </button>
            ))}

            {isIpCommittee && (
              <div className="inline-flex border-2 border-gold bg-[#0b0714] ml-1">
                <button
                  type="button"
                  onClick={() => setIpSection("journalist")}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase cursor-pointer ${
                    ipSection === "journalist"
                      ? "bg-sky-400 text-[#051424] font-black"
                      : "text-cream/75"
                  }`}
                >
                  📰 Journalists
                </button>
                <button
                  type="button"
                  onClick={() => setIpSection("photographer")}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase cursor-pointer ${
                    ipSection === "photographer"
                      ? "bg-amber-400 text-[#1c1004] font-black"
                      : "text-cream/75"
                  }`}
                >
                  📸 Photographers
                </button>
              </div>
            )}
          </div>

          <div className="relative min-w-[240px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your Name, Pass ID, or Portfolio..."
              className="w-full bg-[#0b0714] border border-white/20 pl-9 pr-3 py-2 text-xs font-mono text-cream outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* Scorecard Table */}
        <div className="bg-[#110920] border-2 border-white/20 shadow-[6px_6px_0px_0px_#000000] overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#1d1036] border-b-2 border-gold/40 text-[11px] uppercase text-gold">
                <th className="py-3 px-3 border-r border-white/15 w-16 text-center">
                  RANK
                </th>
                <th className="py-3 px-3 border-r border-white/15 w-28">PASS ID</th>
                <th className="py-3 px-3 border-r border-white/15 min-w-[160px]">
                  DELEGATE NAME
                </th>
                <th className="py-3 px-3 border-r border-white/15 min-w-[180px]">
                  PORTFOLIO
                </th>
                {activeCols.map((col) => (
                  <th
                    key={col.id}
                    className="py-3 px-3 border-r border-white/15 text-center bg-[#231242]"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="py-3 px-3 border-r border-white/15 text-center bg-[#180c2e]">
                  DAY 1 TOT
                </th>
                {visibility === "final_published" && (
                  <th className="py-3 px-3 border-r border-white/15 text-center bg-[#180c2e]">
                    DAY 2 TOT
                  </th>
                )}
                <th className="py-3 px-3 border-r border-white/15 text-center bg-gold/15 text-gold font-black">
                  {visibility === "final_published" ? "FINAL TOTAL" : "DAY 1 TOTAL"}
                </th>
                {visibility === "final_published" && (
                  <th className="py-3 px-3 min-w-[150px]">AWARD</th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const cells =
                  activeDayTab === "day2" && visibility === "final_published"
                    ? row.day2Cells
                    : row.day1Cells;
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-white/10 ${
                      idx % 2 === 0 ? "bg-[#0d0718]" : "bg-[#130a22]"
                    } hover:bg-[#1e1136]`}
                  >
                    <td className="py-2.5 px-3 border-r border-white/10 text-center">
                      {row.rank ? (
                        <span
                          className={`inline-flex px-2 py-0.5 text-[10px] font-black border ${
                            row.rank === 1
                              ? "bg-gold text-[#0b0714] border-black"
                              : row.rank === 2
                                ? "bg-slate-300 text-[#0b0714] border-black"
                                : row.rank === 3
                                  ? "bg-amber-600 text-white border-black"
                                  : "bg-white/5 text-cream/70 border-white/15"
                          }`}
                        >
                          #{row.rank}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-2.5 px-3 border-r border-white/10 font-bold text-gold/90">
                      {row.id.replace("ATH-SUMMIT-", "#")}
                    </td>
                    <td className="py-2.5 px-3 border-r border-white/10 font-sans font-semibold text-cream">
                      {row.name}
                    </td>
                    <td className="py-2.5 px-3 border-r border-white/10 font-sans text-cream/80">
                      {row.portfolioName}
                    </td>
                    {activeCols.map((col) => (
                      <td
                        key={col.id}
                        className="py-2.5 px-3 border-r border-white/10 text-center font-bold text-cream"
                      >
                        {cells[col.id] || "—"}
                      </td>
                    ))}
                    <td className="py-2.5 px-3 border-r border-white/10 text-center font-bold text-cream/80 bg-[#150a26]">
                      {row.d1Total}
                    </td>
                    {visibility === "final_published" && (
                      <td className="py-2.5 px-3 border-r border-white/10 text-center font-bold text-cream/80 bg-[#150a26]">
                        {row.d2Total}
                      </td>
                    )}
                    <td className="py-2.5 px-3 border-r border-white/10 text-center font-black text-sm text-gold bg-gold/10">
                      {row.grandTotal}
                    </td>
                    {visibility === "final_published" && (
                      <td className="py-2.5 px-3 font-bold text-emerald-300">
                        {row.award || "—"}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
