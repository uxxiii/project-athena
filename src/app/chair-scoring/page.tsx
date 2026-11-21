"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Shield,
  Lock,
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Download,
  Search,
  Trophy,
  LogOut,
  FileSpreadsheet,
  Users,
} from "lucide-react";
import { committees } from "@/data/committees";
import type {
  CommitteeScoreSheet,
  AttendanceRecord,
  ScoreColumn,
} from "@/lib/scorecard-storage";

interface DelegateRosterItem {
  id: string;
  name: string;
  committeeId: string;
  committeeName: string;
  portfolioId: string;
  portfolioName: string;
  institution: string;
  classYear: string;
}

const AWARD_OPTIONS = [
  "",
  "Best Delegate",
  "High Commendation",
  "Special Mention",
  "Verbal Mention",
  "Honorable Mention",
];

function computeDaySum(
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

export default function ChairScoringPage() {
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string>(
    committees[0]?.id || "ipl"
  );
  const [passcode, setPasscode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const [committeeInfo, setCommitteeInfo] = useState<{
    id: string;
    name: string;
    fullName: string;
    agenda: string;
  } | null>(null);
  const [sheet, setSheet] = useState<CommitteeScoreSheet | null>(null);
  const [delegates, setDelegates] = useState<DelegateRosterItem[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [activeDay, setActiveDay] = useState<"day1" | "day2">("day1");
  const [ipSection, setIpSection] = useState<"journalist" | "photographer">("journalist");
  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState<"all" | "present" | "absent">("all");
  const [sortBy, setSortBy] = useState<"id" | "rank" | "portfolio">("id");
  const [saveStatus, setSaveStatus] = useState<"synced" | "saving" | "error">("synced");
  const [lastSyncTime, setLastSyncTime] = useState<string>("");

  const cellTimestampsRef = useRef<Record<string, number>>({});
  const saveTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const fetchChairSheet = useCallback(
    async (isBackgroundPoll = false) => {
      if (!unlocked || !selectedCommitteeId || !passcode) return;
      if (!isBackgroundPoll) setLoading(true);
      try {
        const res = await fetch(
          `/api/scorecard?mode=chair&committeeId=${encodeURIComponent(
            selectedCommitteeId
          )}&passcode=${encodeURIComponent(passcode)}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          if (res.status === 401 && !isBackgroundPoll) {
            setUnlocked(false);
            setAuthError("Session expired or invalid passcode.");
          }
          return;
        }
        const data = await res.json();
        setCommitteeInfo(data.committee);
        setDelegates(data.delegates || []);
        setAttendance(data.attendance || {});
        setLastSyncTime(new Date().toLocaleTimeString());

        setSheet((prev) => {
          if (!prev || !isBackgroundPoll) return data.sheet;
          // Merge background updates without clobbering cells modified within the last 4 seconds locally
          const now = Date.now();
          const mergedScores = { ...data.sheet.scores };
          for (const [delId, prevRec] of Object.entries(prev.scores || {})) {
            if ((now - (cellTimestampsRef.current[delId] || 0)) < 4000) {
              mergedScores[delId] = prevRec;
            }
          }
          return {
            ...data.sheet,
            day1Columns:
              now - (cellTimestampsRef.current["__cols__"] || 0) < 4000
                ? prev.day1Columns
                : data.sheet.day1Columns,
            day2Columns:
              now - (cellTimestampsRef.current["__cols__"] || 0) < 4000
                ? prev.day2Columns
                : data.sheet.day2Columns,
            photographerDay1Columns:
              now - (cellTimestampsRef.current["__cols__"] || 0) < 4000
                ? prev.photographerDay1Columns
                : data.sheet.photographerDay1Columns,
            photographerDay2Columns:
              now - (cellTimestampsRef.current["__cols__"] || 0) < 4000
                ? prev.photographerDay2Columns
                : data.sheet.photographerDay2Columns,
            scores: mergedScores,
          };
        });
      } catch (err) {
        console.error("Failed to fetch chair scoring sheet:", err);
      } finally {
        if (!isBackgroundPoll) setLoading(false);
      }
    },
    [unlocked, selectedCommitteeId, passcode]
  );

  // Poll every 2.5 seconds for live attendance & multi-chair sync
  useEffect(() => {
    if (!unlocked) return;
    fetchChairSheet(false);
    const interval = setInterval(() => {
      fetchChairSheet(true);
    }, 2500);
    return () => clearInterval(interval);
  }, [unlocked, fetchChairSheet]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);
    try {
      const res = await fetch(
        `/api/scorecard?mode=chair&committeeId=${encodeURIComponent(
          selectedCommitteeId
        )}&passcode=${encodeURIComponent(passcode.trim())}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Invalid committee passcode.");
        setLoading(false);
        return;
      }
      setCommitteeInfo(data.committee);
      setSheet(data.sheet);
      setDelegates(data.delegates || []);
      setAttendance(data.attendance || []);
      setUnlocked(true);
      setLastSyncTime(new Date().toLocaleTimeString());
    } catch {
      setAuthError("Network error while verifying passcode.");
    } finally {
      setLoading(false);
    }
  };

  const isIpCommittee = selectedCommitteeId === "ip";
  const isPhotographerView = isIpCommittee && ipSection === "photographer";

  const activeDay1Cols = useMemo(() => {
    if (!sheet) return [];
    if (isPhotographerView) {
      return sheet.photographerDay1Columns || sheet.day1Columns;
    }
    return sheet.day1Columns;
  }, [sheet, isPhotographerView]);

  const activeDay2Cols = useMemo(() => {
    if (!sheet) return [];
    if (isPhotographerView) {
      return sheet.photographerDay2Columns || sheet.day2Columns;
    }
    return sheet.day2Columns;
  }, [sheet, isPhotographerView]);

  const activeColumns = useMemo(() => {
    return activeDay === "day2" ? activeDay2Cols : activeDay1Cols;
  }, [activeDay, activeDay1Cols, activeDay2Cols]);

  // Save column definitions (add / rename / delete column)
  const persistColumns = useCallback(
    async (
      day: "day1" | "day2",
      newCols: ScoreColumn[],
      section?: "journalist" | "photographer"
    ) => {
      cellTimestampsRef.current["__cols__"] = Date.now();
      setSaveStatus("saving");
      try {
        const res = await fetch("/api/scorecard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_columns",
            committeeId: selectedCommitteeId,
            passcode: passcode.trim(),
            day,
            section: section === "photographer" ? "photographer" : undefined,
            columns: newCols,
          }),
        });
        if (res.ok) {
          setSaveStatus("synced");
          setLastSyncTime(new Date().toLocaleTimeString());
        } else {
          setSaveStatus("error");
        }
      } catch {
        setSaveStatus("error");
      }
    },
    [selectedCommitteeId, passcode]
  );

  const setColumnsInSheet = (day: "day1" | "day2", updated: ScoreColumn[]) => {
    if (!sheet) return;
    if (isPhotographerView) {
      setSheet({
        ...sheet,
        ...(day === "day2"
          ? { photographerDay2Columns: updated }
          : { photographerDay1Columns: updated }),
      });
    } else {
      setSheet({
        ...sheet,
        ...(day === "day2" ? { day2Columns: updated } : { day1Columns: updated }),
      });
    }
  };

  const handleRenameColumn = (colId: string, newLabel: string) => {
    if (!sheet) return;
    const currentCols = activeColumns;
    const updated = currentCols.map((c) => (c.id === colId ? { ...c, label: newLabel } : c));
    cellTimestampsRef.current["__cols__"] = Date.now();
    setColumnsInSheet(activeDay, updated);

    const sec = isPhotographerView ? "photographer" : "journalist";
    const timerKey = `col-${sec}-${activeDay}-${colId}`;
    if (saveTimersRef.current[timerKey]) clearTimeout(saveTimersRef.current[timerKey]);
    saveTimersRef.current[timerKey] = setTimeout(() => {
      persistColumns(activeDay, updated, sec);
    }, 350);
  };

  const handleAddColumn = () => {
    if (!sheet) return;
    const currentCols = activeColumns;
    const prefix = isPhotographerView ? "pcol" : "col";
    const newId = `${prefix}-${Date.now().toString(36)}`;
    const updated = [
      ...currentCols,
      { id: newId, label: `Criteria ${currentCols.length + 1}` },
    ];
    setColumnsInSheet(activeDay, updated);
    persistColumns(activeDay, updated, isPhotographerView ? "photographer" : "journalist");
  };

  const handleRemoveColumn = (colId: string) => {
    if (!sheet) return;
    const currentCols = activeColumns;
    if (currentCols.length <= 1) return;
    const updated = currentCols.filter((c) => c.id !== colId);
    setColumnsInSheet(activeDay, updated);
    persistColumns(activeDay, updated, isPhotographerView ? "photographer" : "journalist");
  };

  const handleCellChange = (delegateId: string, colId: string, value: string) => {
    if (!sheet) return;
    cellTimestampsRef.current[delegateId] = Date.now();

    const prevRec = sheet.scores[delegateId] || { day1: {}, day2: {} };
    const updatedRec = {
      ...prevRec,
      [activeDay]: {
        ...(prevRec[activeDay] || {}),
        [colId]: value,
      },
    };

    setSheet({
      ...sheet,
      scores: {
        ...sheet.scores,
        [delegateId]: updatedRec,
      },
    });

    setSaveStatus("saving");
    const timerKey = `cell-${delegateId}-${activeDay}-${colId}`;
    if (saveTimersRef.current[timerKey]) clearTimeout(saveTimersRef.current[timerKey]);
    saveTimersRef.current[timerKey] = setTimeout(async () => {
      try {
        const res = await fetch("/api/scorecard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_cell",
            committeeId: selectedCommitteeId,
            passcode: passcode.trim(),
            delegateId,
            day: activeDay,
            colId,
            value,
          }),
        });
        if (res.ok) {
          setSaveStatus("synced");
          setLastSyncTime(new Date().toLocaleTimeString());
        } else {
          setSaveStatus("error");
        }
      } catch {
        setSaveStatus("error");
      }
    }, 250);
  };

  const handleMetaChange = (
    delegateId: string,
    field: "remarks" | "award",
    value: string
  ) => {
    if (!sheet) return;
    cellTimestampsRef.current[delegateId] = Date.now();
    const prevRec = sheet.scores[delegateId] || { day1: {}, day2: {} };
    const updatedRec = {
      ...prevRec,
      [field]: value,
    };

    setSheet({
      ...sheet,
      scores: {
        ...sheet.scores,
        [delegateId]: updatedRec,
      },
    });

    setSaveStatus("saving");
    const timerKey = `meta-${delegateId}-${field}`;
    if (saveTimersRef.current[timerKey]) clearTimeout(saveTimersRef.current[timerKey]);
    saveTimersRef.current[timerKey] = setTimeout(async () => {
      try {
        const res = await fetch("/api/scorecard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_delegate_meta",
            committeeId: selectedCommitteeId,
            passcode: passcode.trim(),
            delegateId,
            [field]: value,
          }),
        });
        if (res.ok) {
          setSaveStatus("synced");
          setLastSyncTime(new Date().toLocaleTimeString());
        } else {
          setSaveStatus("error");
        }
      } catch {
        setSaveStatus("error");
      }
    }, 300);
  };

  // Enrich delegates with calculated Day 1 Total, Day 2 Total, Grand Total, and Rank
  const sectionDelegates = useMemo(() => {
    if (!isIpCommittee) return delegates;
    return delegates.filter((d) => {
      const isPhoto = d.portfolioName.toLowerCase().includes("photographer");
      return isPhotographerView ? isPhoto : !isPhoto;
    });
  }, [delegates, isIpCommittee, isPhotographerView]);

  const enrichedRows = useMemo(() => {
    if (!sheet) return [];
    const list = sectionDelegates.map((d) => {
      const rec = sheet.scores[d.id];
      const d1Total = computeDaySum(rec?.day1, activeDay1Cols);
      const d2Total = computeDaySum(rec?.day2, activeDay2Cols);
      const grandTotal = Math.round((d1Total + d2Total) * 100) / 100;
      const att = attendance[d.id] || { day1: false, day2: false };
      return {
        ...d,
        d1Total,
        d2Total,
        grandTotal,
        att,
        remarks: rec?.remarks || "",
        award: rec?.award || "",
        cells: (activeDay === "day2" ? rec?.day2 : rec?.day1) || {},
      };
    });

    // Compute live rank by Grand Total descending (per section for IP)
    const sortedForRank = [...list].sort((a, b) => b.grandTotal - a.grandTotal);
    const rankMap = new Map<string, number>();
    sortedForRank.forEach((item, idx) => {
      if (item.grandTotal > 0) {
        rankMap.set(item.id, idx + 1);
      }
    });

    return list.map((item) => ({
      ...item,
      rank: rankMap.get(item.id) || null,
    }));
  }, [sectionDelegates, sheet, attendance, activeDay, activeDay1Cols, activeDay2Cols]);

  const filteredRows = useMemo(() => {
    return enrichedRows
      .filter((r) => {
        const isPresentToday = activeDay === "day2" ? r.att.day2 : r.att.day1;
        if (attendanceFilter === "present" && !isPresentToday) return false;
        if (attendanceFilter === "absent" && isPresentToday) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          r.id.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.portfolioName.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "rank") {
          if (b.grandTotal !== a.grandTotal) return b.grandTotal - a.grandTotal;
        }
        if (sortBy === "portfolio") {
          return a.portfolioName.localeCompare(b.portfolioName);
        }
        return a.id.localeCompare(b.id);
      });
  }, [enrichedRows, activeDay, attendanceFilter, searchQuery, sortBy]);

  const presentCount = useMemo(() => {
    return enrichedRows.filter((r) =>
      activeDay === "day2" ? r.att.day2 : r.att.day1
    ).length;
  }, [enrichedRows, activeDay]);

  const exportCommitteeCsv = () => {
    if (!sheet || !committeeInfo) return;
    const cols = activeColumns;
    const headers = [
      "Pass ID",
      "Delegate Name",
      "Portfolio",
      "Day 1 Attendance",
      "Day 2 Attendance",
      ...cols.map((c) => c.label),
      "Day 1 Total",
      "Day 2 Total",
      "Grand Total",
      "Rank",
      "Award",
      "Chair Remarks",
    ];
    const rows = enrichedRows.map((r) => [
      `"${r.id}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.portfolioName.replace(/"/g, '""')}"`,
      `"${r.att.day1 ? "PRESENT" : "ABSENT"}"`,
      `"${r.att.day2 ? "PRESENT" : "ABSENT"}"`,
      ...cols.map((c) => `"${String(r.cells[c.id] ?? "").replace(/"/g, '""')}"`),
      r.d1Total,
      r.d2Total,
      r.grandTotal,
      r.rank ? `#${r.rank}` : "—",
      `"${r.award}"`,
      `"${r.remarks.replace(/"/g, '""')}"`,
    ]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `Athena_${committeeInfo.name}_${activeDay}_Scoresheet.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Excel-like Enter / ArrowDown / ArrowUp navigation between rows
  const handleCellKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIdx: number,
    colIdx: number
  ) => {
    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextEl = document.querySelector<HTMLInputElement>(
        `[data-cell="${rowIdx + 1}-${colIdx}"]`
      );
      nextEl?.focus();
      nextEl?.select();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevEl = document.querySelector<HTMLInputElement>(
        `[data-cell="${rowIdx - 1}-${colIdx}"]`
      );
      prevEl?.focus();
      prevEl?.select();
    }
  };

  // ============================================================================
  // 1. CHAIR PASSCODE GATE
  // ============================================================================
  if (!unlocked) {
    return (
      <div className="py-12 min-h-screen flex items-center justify-center neo-grid-bg bg-[#0b0714] px-4">
        <div className="max-w-md w-full bg-[#140b24] border-2 border-gold/50 p-8 sm:p-10 shadow-[8px_8px_0px_0px_#000000] relative">
          <div className="text-center mb-6 space-y-2">
            <div className="mx-auto flex h-16 w-16 items-center justify-center bg-gold/15 border-2 border-gold text-gold shadow-[3px_3px_0px_0px_#000]">
              <FileSpreadsheet size={30} />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-gold block pt-1">
              Project Athena • Executive Board Terminal
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-cream uppercase">
              Chair Scoring Sheet
            </h1>
            <p className="text-xs text-cream/65">
              Select your committee and enter your private committee passcode to open your live Excel scoring sheet.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gold mb-1.5 font-bold">
                1. Select Your Committee
              </label>
              <select
                value={selectedCommitteeId}
                onChange={(e) => setSelectedCommitteeId(e.target.value)}
                className="w-full border-2 border-white/25 bg-[#0b0714] px-4 py-3 text-sm font-mono font-bold text-cream outline-none focus:border-gold shadow-[2px_2px_0px_0px_#000]"
              >
                {committees.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gold mb-1.5 font-bold">
                2. Committee Passcode
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/70"
                />
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter committee passcode..."
                  required
                  className="w-full border-2 border-white/25 bg-[#0b0714] pl-10 pr-4 py-3 text-sm font-mono text-cream outline-none focus:border-gold shadow-[2px_2px_0px_0px_#000]"
                />
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/40 text-xs font-mono text-rose-300">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold py-3.5 text-sm font-black uppercase tracking-wider text-[#0b0714] border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:bg-gold-light transition-all cursor-pointer"
            >
              {loading ? "Unlocking Committee Sheet..." : "Open Committee Excel Sheet →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. EXCEL-LIKE CHAIR SCORING SPREADSHEET
  // ============================================================================
  return (
    <div className="py-5 min-h-screen bg-[#0b0714] text-cream">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 space-y-4">
        {/* Top Command Header */}
        <div className="bg-[#140b24] border-2 border-gold/40 p-4 sm:p-5 shadow-[5px_5px_0px_0px_#000000] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-gold text-[#0b0714] font-mono font-black text-[10px] uppercase tracking-wider border border-black">
                EB SCORING TERMINAL • {committeeInfo?.name}
              </span>
              <span
                className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase border flex items-center gap-1.5 ${
                  saveStatus === "synced"
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                    : saveStatus === "saving"
                      ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                      : "bg-rose-500/15 text-rose-300 border-rose-500/40"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                {saveStatus === "synced"
                  ? `Live Synced (${lastSyncTime})`
                  : saveStatus === "saving"
                    ? "Saving to Cloud..."
                    : "Sync Retry"}
              </span>
              <span className="px-2.5 py-0.5 bg-[#0b0714] border border-white/15 text-[10px] font-mono text-cream/80 flex items-center gap-1">
                <Users size={11} className="text-gold" />
                Gate Attendance ({activeDay === "day1" ? "Day 1" : "Day 2"}):{" "}
                <strong className="text-emerald-400">{presentCount} Present</strong> /{" "}
                {sectionDelegates.length} Total
              </span>
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-cream uppercase">
              {committeeInfo?.fullName}
              {isIpCommittee
                ? isPhotographerView
                  ? " — Photographers Section"
                  : " — Journalists Section"
                : ""}{" "}
              (Live Evaluation Sheet)
            </h1>
            <p className="text-xs text-cream/60 font-mono">
              Tip: Click any <strong className="text-gold">Criteria Column Header</strong> to rename it, or click{" "}
              <strong className="text-gold">+ Add Marking Column</strong> to add new columns. Press{" "}
              <strong className="text-gold">Enter / Arrow Keys</strong> to move down rows like Excel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* IP Dual-Section Switcher: Journalists vs Photographers (Separate Criteria) */}
            {isIpCommittee && (
              <div className="inline-flex border-2 border-gold bg-[#0b0714] shadow-[2px_2px_0px_0px_#000]">
                <button
                  type="button"
                  onClick={() => setIpSection("journalist")}
                  className={`px-3.5 py-2 text-xs font-mono font-bold uppercase cursor-pointer transition-colors ${
                    ipSection === "journalist"
                      ? "bg-sky-400 text-[#051424] font-black"
                      : "text-cream/75 hover:text-sky-300"
                  }`}
                >
                  📰 Journalists (
                  {
                    delegates.filter(
                      (d) => !d.portfolioName.toLowerCase().includes("photographer")
                    ).length
                  }
                  )
                </button>
                <button
                  type="button"
                  onClick={() => setIpSection("photographer")}
                  className={`px-3.5 py-2 text-xs font-mono font-bold uppercase cursor-pointer transition-colors ${
                    ipSection === "photographer"
                      ? "bg-amber-400 text-[#1c1004] font-black"
                      : "text-cream/75 hover:text-amber-300"
                  }`}
                >
                  📸 Photographers (
                  {
                    delegates.filter((d) =>
                      d.portfolioName.toLowerCase().includes("photographer")
                    ).length
                  }
                  )
                </button>
              </div>
            )}

            {/* Day 1 / Day 2 Sheet Switcher */}
            <div className="inline-flex border-2 border-white/20 bg-[#0b0714]">
              <button
                type="button"
                onClick={() => setActiveDay("day1")}
                className={`px-3.5 py-2 text-xs font-mono font-bold uppercase cursor-pointer transition-colors ${
                  activeDay === "day1"
                    ? "bg-gold text-[#0b0714] font-black"
                    : "text-cream/70 hover:text-gold"
                }`}
              >
                Day 1 Sheet (20 Nov)
              </button>
              <button
                type="button"
                onClick={() => setActiveDay("day2")}
                className={`px-3.5 py-2 text-xs font-mono font-bold uppercase cursor-pointer transition-colors ${
                  activeDay === "day2"
                    ? "bg-gold text-[#0b0714] font-black"
                    : "text-cream/70 hover:text-gold"
                }`}
              >
                Day 2 Sheet (21 Nov)
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddColumn}
              className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-[#041a10] border-2 border-black px-3.5 py-2 text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Marking Column</span>
            </button>

            <button
              type="button"
              onClick={exportCommitteeCsv}
              className="inline-flex items-center gap-1.5 bg-[#0b0714] hover:border-gold text-cream border-2 border-white/20 px-3 py-2 text-xs font-mono font-bold uppercase cursor-pointer"
            >
              <Download size={13} className="text-gold" />
              <span>Export Excel CSV</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setUnlocked(false);
                setPasscode("");
              }}
              className="inline-flex items-center gap-1 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 px-3 py-2 text-xs font-mono font-bold uppercase cursor-pointer"
            >
              <LogOut size={13} />
              <span>Lock</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Search, Attendance Filter & Sort */}
        <div className="bg-[#140b24] border-2 border-white/15 p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Del ID, Name, or Portfolio..."
              className="w-full bg-[#0b0714] border border-white/20 pl-9 pr-3 py-1.5 text-xs font-mono text-cream outline-none focus:border-gold"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-cream/50">Attendance Filter:</span>
            {(["all", "present", "absent"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setAttendanceFilter(f)}
                className={`px-2.5 py-1 uppercase border cursor-pointer ${
                  attendanceFilter === f
                    ? "bg-gold text-[#0b0714] border-black font-black"
                    : "bg-[#0b0714] text-cream/70 border-white/15 hover:border-gold/50"
                }`}
              >
                {f === "all"
                  ? `All (${enrichedRows.length})`
                  : f === "present"
                    ? `Present (${presentCount})`
                    : `Absent (${enrichedRows.length - presentCount})`}
              </button>
            ))}

            <span className="text-cream/50 ml-2">Sort:</span>
            {(
              [
                { id: "id", label: "Del ID" },
                { id: "portfolio", label: "Portfolio" },
                { id: "rank", label: "Top Score" },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSortBy(s.id)}
                className={`px-2.5 py-1 uppercase border cursor-pointer ${
                  sortBy === s.id
                    ? "bg-purple-mid text-gold border-gold font-bold"
                    : "bg-[#0b0714] text-cream/70 border-white/15"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* EXCEL SPREADSHEET GRID */}
        <div className="bg-[#110920] border-2 border-white/25 shadow-[6px_6px_0px_0px_#000000] overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#1d1036] border-b-2 border-gold/40 text-[11px] uppercase text-gold">
                <th className="py-2.5 px-2.5 border-r border-white/15 w-9 text-center">#</th>
                <th className="py-2.5 px-3 border-r border-white/15 w-32">DEL ID</th>
                <th className="py-2.5 px-3 border-r border-white/15 min-w-[160px]">
                  DELEGATE NAME
                </th>
                <th className="py-2.5 px-3 border-r border-white/15 min-w-[190px]">
                  PORTFOLIO / ROLE
                </th>
                <th className="py-2.5 px-2.5 border-r-2 border-gold/40 w-28 text-center">
                  {activeDay === "day1" ? "DAY 1 GATE" : "DAY 2 GATE"}
                </th>

                {/* Dynamic Chair-Editable Columns */}
                {activeColumns.map((col) => (
                  <th
                    key={col.id}
                    className="p-1.5 border-r border-white/15 min-w-[125px] bg-[#241344]"
                  >
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={col.label}
                        onChange={(e) => handleRenameColumn(col.id, e.target.value)}
                        title="Click to rename this marking column"
                        className="w-full bg-[#120824] border border-gold/40 focus:border-gold px-2 py-1 text-[11px] font-mono font-bold text-gold outline-none"
                      />
                      {activeColumns.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveColumn(col.id)}
                          title="Remove column"
                          className="p-1 text-cream/40 hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </th>
                ))}

                <th className="py-2.5 px-3 border-r border-white/15 w-24 text-center bg-[#180c2e]">
                  DAY 1 TOT
                </th>
                <th className="py-2.5 px-3 border-r border-white/15 w-24 text-center bg-[#180c2e]">
                  DAY 2 TOT
                </th>
                <th className="py-2.5 px-3 border-r border-white/15 w-28 text-center bg-gold/15 text-gold font-black">
                  GRAND TOTAL
                </th>
                <th className="py-2.5 px-2.5 border-r border-white/15 w-16 text-center">
                  RANK
                </th>
                <th className="py-2.5 px-3 border-r border-white/15 min-w-[155px]">
                  AWARD TAG
                </th>
                <th className="py-2.5 px-3 min-w-[190px]">CHAIR REMARKS</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, rIdx) => {
                const isPresentToday =
                  activeDay === "day2" ? row.att.day2 : row.att.day1;

                return (
                  <tr
                    key={row.id}
                    className={`border-b border-white/10 transition-colors ${
                      rIdx % 2 === 0 ? "bg-[#0d0718]" : "bg-[#130a22]"
                    } hover:bg-[#1e1136]`}
                  >
                    {/* # */}
                    <td className="py-2 px-2.5 border-r border-white/10 text-center text-cream/45">
                      {rIdx + 1}
                    </td>

                    {/* DEL ID */}
                    <td className="py-2 px-3 border-r border-white/10 font-bold text-gold/90 whitespace-nowrap">
                      {row.id.replace("ATH-SUMMIT-", "#")}
                      <span className="block text-[9px] text-cream/40 font-normal">
                        {row.id}
                      </span>
                    </td>

                    {/* DELEGATE NAME */}
                    <td className="py-2 px-3 border-r border-white/10 font-sans font-semibold text-cream">
                      {row.name}
                    </td>

                    {/* PORTFOLIO */}
                    <td className="py-2 px-3 border-r border-white/10 font-sans text-cream/85">
                      {row.portfolioName}
                    </td>

                    {/* ATTENDANCE (Synced from Admin Morning Check-In) */}
                    <td className="py-2 px-2.5 border-r-2 border-gold/30 text-center">
                      {isPresentToday ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold">
                          <CheckCircle2 size={11} /> PRESENT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/5 border border-white/15 text-cream/40 text-[10px]">
                          ABSENT
                        </span>
                      )}
                    </td>

                    {/* Dynamic Editable Score Cells */}
                    {activeColumns.map((col, cIdx) => {
                      const val = row.cells[col.id] ?? "";
                      return (
                        <td
                          key={col.id}
                          className="p-0 border-r border-white/15 focus-within:bg-gold/15 focus-within:ring-2 focus-within:ring-gold"
                        >
                          <input
                            type="text"
                            inputMode="decimal"
                            data-cell={`${rIdx}-${cIdx}`}
                            value={val}
                            onChange={(e) =>
                              handleCellChange(row.id, col.id, e.target.value)
                            }
                            onKeyDown={(e) => handleCellKeyDown(e, rIdx, cIdx)}
                            placeholder="—"
                            className="w-full h-full px-2.5 py-2.5 bg-transparent text-center font-mono text-xs font-bold text-cream outline-none"
                          />
                        </td>
                      );
                    })}

                    {/* DAY 1 TOTAL */}
                    <td className="py-2 px-3 border-r border-white/10 text-center font-bold text-cream/80 bg-[#150a26]">
                      {row.d1Total}
                    </td>

                    {/* DAY 2 TOTAL */}
                    <td className="py-2 px-3 border-r border-white/10 text-center font-bold text-cream/80 bg-[#150a26]">
                      {row.d2Total}
                    </td>

                    {/* GRAND TOTAL */}
                    <td className="py-2 px-3 border-r border-white/10 text-center font-black text-sm text-gold bg-gold/10">
                      {row.grandTotal}
                    </td>

                    {/* RANK */}
                    <td className="py-2 px-2.5 border-r border-white/10 text-center">
                      {row.rank ? (
                        <span
                          className={`inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-black border ${
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
                        <span className="text-cream/30">—</span>
                      )}
                    </td>

                    {/* AWARD DROPDOWN */}
                    <td className="p-1 border-r border-white/10">
                      <select
                        value={row.award}
                        onChange={(e) =>
                          handleMetaChange(row.id, "award", e.target.value)
                        }
                        className="w-full bg-[#0b0714] border border-white/15 focus:border-gold px-2 py-1.5 text-[11px] font-mono text-gold outline-none"
                      >
                        {AWARD_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt || "— Select Award —"}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* CHAIR REMARKS */}
                    <td className="p-0 focus-within:bg-gold/10">
                      <input
                        type="text"
                        value={row.remarks}
                        onChange={(e) =>
                          handleMetaChange(row.id, "remarks", e.target.value)
                        }
                        placeholder="Add note / feedback..."
                        className="w-full px-2.5 py-2 bg-transparent font-sans text-xs text-cream outline-none"
                      />
                    </td>
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
