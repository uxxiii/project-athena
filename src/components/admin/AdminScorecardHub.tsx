"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  Trophy,
  Users,
  FileSpreadsheet,
  KeyRound,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Download,
} from "lucide-react";
import { committees } from "@/data/committees";
import type {
  ScorecardSystemState,
  ScorecardVisibility,
  ScoreColumn,
} from "@/lib/scorecard-storage";

const ADMIN_MASTER_PASSWORD = "athena-portal";

interface DelegateRosterItem {
  id: string;
  name: string;
  committeeId: string;
  committeeName: string;
  portfolioId: string;
  portfolioName: string;
  institution: string;
  classYear: string;
  phone: string;
  status: string;
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

export function AdminScorecardHub() {
  const [activeTab, setActiveTab] = useState<
    "attendance" | "scoring" | "passcodes"
  >("attendance");
  const [state, setState] = useState<ScorecardSystemState | null>(null);
  const [delegates, setDelegates] = useState<DelegateRosterItem[]>([]);
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string>("ipl");
  const [attendanceCommFilter, setAttendanceCommFilter] = useState<string>("all");
  const [activeDay, setActiveDay] = useState<"day1" | "day2">("day1");
  const [searchQuery, setSearchQuery] = useState("");
  const [syncPulse, setSyncPulse] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string>("");
  const [passcodeDrafts, setPasscodeDrafts] = useState<Record<string, string>>({});

  const localEditTimestampsRef = useRef<Record<string, number>>({});
  const saveTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const fetchAdminState = useCallback(async (isPoll = false) => {
    try {
      const res = await fetch(
        `/api/scorecard?mode=admin&adminPassword=${encodeURIComponent(
          ADMIN_MASTER_PASSWORD
        )}`,
        { cache: "no-store" }
      );
      if (!res.ok) return;
      const data = await res.json();
      setDelegates(data.delegates || []);
      setSyncPulse(new Date().toLocaleTimeString());

      const incoming: ScorecardSystemState = data.state;
      if (!isPoll) {
        setState(incoming);
        setPasscodeDrafts(incoming.passcodes || {});
        return;
      }

      setState((prev) => {
        if (!prev) return incoming;
        const now = Date.now();
        // Preserve recent local edits (<3.5s old) while streaming live chair changes
        const mergedCommittees = { ...incoming.committees };
        for (const c of committees) {
          const prevSheet = prev.committees?.[c.id];
          const incSheet = incoming.committees?.[c.id];
          if (!prevSheet || !incSheet) continue;
          const mergedScores = { ...incSheet.scores };
          for (const [delId, prevScore] of Object.entries(prevSheet.scores || {})) {
            if (now - (localEditTimestampsRef.current[`${c.id}-${delId}`] || 0) < 3500) {
              mergedScores[delId] = prevScore;
            }
          }
          mergedCommittees[c.id] = {
            ...incSheet,
            day1Columns:
              now - (localEditTimestampsRef.current[`cols-${c.id}`] || 0) < 3500
                ? prevSheet.day1Columns
                : incSheet.day1Columns,
            day2Columns:
              now - (localEditTimestampsRef.current[`cols-${c.id}`] || 0) < 3500
                ? prevSheet.day2Columns
                : incSheet.day2Columns,
            scores: mergedScores,
          };
        }
        return {
          ...incoming,
          committees: mergedCommittees,
        };
      });
    } catch (err) {
      console.error("Admin scorecard sync error:", err);
    }
  }, []);

  // Poll every 1.5 seconds for near-real-time live sync with chairs
  useEffect(() => {
    fetchAdminState(false);
    const interval = setInterval(() => {
      fetchAdminState(true);
    }, 1500);
    return () => clearInterval(interval);
  }, [fetchAdminState]);

  const handleToggleVisibility = async (newVis: ScorecardVisibility) => {
    if (!state) return;
    setState({ ...state, visibility: newVis });
    await fetch("/api/scorecard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_visibility",
        adminPassword: ADMIN_MASTER_PASSWORD,
        visibility: newVis,
      }),
    });
  };

  const handleToggleAttendance = async (
    delegateId: string,
    day: "day1" | "day2",
    present: boolean
  ) => {
    if (!state) return;
    const prevAtt = state.attendance[delegateId] || { day1: false, day2: false };
    const updatedAtt = {
      ...prevAtt,
      [day]: present,
      ...(day === "day1"
        ? { day1Time: present ? new Date().toISOString() : undefined }
        : { day2Time: present ? new Date().toISOString() : undefined }),
    };
    setState({
      ...state,
      attendance: {
        ...state.attendance,
        [delegateId]: updatedAtt,
      },
    });

    await fetch("/api/scorecard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_attendance",
        adminPassword: ADMIN_MASTER_PASSWORD,
        delegateId,
        day,
        present,
      }),
    });
  };

  const handleBulkAttendance = async (
    delegateIds: string[],
    day: "day1" | "day2",
    present: boolean
  ) => {
    if (!state || delegateIds.length === 0) return;
    const nextAttendance = { ...state.attendance };
    const nowIso = new Date().toISOString();
    for (const id of delegateIds) {
      const prevAtt = nextAttendance[id] || { day1: false, day2: false };
      nextAttendance[id] = {
        ...prevAtt,
        [day]: present,
        ...(day === "day1"
          ? { day1Time: present ? nowIso : undefined }
          : { day2Time: present ? nowIso : undefined }),
      };
    }
    setState({ ...state, attendance: nextAttendance });

    await fetch("/api/scorecard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_bulk_attendance",
        adminPassword: ADMIN_MASTER_PASSWORD,
        delegateIds,
        day,
        present,
      }).replace("update_bulk_attendance", "bulk_attendance"),
    });
  };

  // Admin Excel Scoring Overrides
  const activeSheet = state?.committees?.[selectedCommitteeId];
  const activeColumns = useMemo(() => {
    if (!activeSheet) return [];
    return activeDay === "day2" ? activeSheet.day2Columns : activeSheet.day1Columns;
  }, [activeSheet, activeDay]);

  const persistAdminColumns = async (day: "day1" | "day2", newCols: ScoreColumn[]) => {
    localEditTimestampsRef.current[`cols-${selectedCommitteeId}`] = Date.now();
    await fetch("/api/scorecard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_columns",
        adminPassword: ADMIN_MASTER_PASSWORD,
        committeeId: selectedCommitteeId,
        day,
        columns: newCols,
      }),
    });
  };

  const handleAdminRenameColumn = (colId: string, newLabel: string) => {
    if (!state || !activeSheet) return;
    const cols = activeDay === "day2" ? activeSheet.day2Columns : activeSheet.day1Columns;
    const updated = cols.map((c) => (c.id === colId ? { ...c, label: newLabel } : c));
    localEditTimestampsRef.current[`cols-${selectedCommitteeId}`] = Date.now();
    setState({
      ...state,
      committees: {
        ...state.committees,
        [selectedCommitteeId]: {
          ...activeSheet,
          ...(activeDay === "day2" ? { day2Columns: updated } : { day1Columns: updated }),
        },
      },
    });

    const tKey = `adm-col-${selectedCommitteeId}-${activeDay}-${colId}`;
    if (saveTimersRef.current[tKey]) clearTimeout(saveTimersRef.current[tKey]);
    saveTimersRef.current[tKey] = setTimeout(() => {
      persistAdminColumns(activeDay, updated);
    }, 350);
  };

  const handleAdminAddColumn = () => {
    if (!state || !activeSheet) return;
    const cols = activeDay === "day2" ? activeSheet.day2Columns : activeSheet.day1Columns;
    const updated = [
      ...cols,
      { id: `col-${Date.now().toString(36)}`, label: `Criteria ${cols.length + 1}` },
    ];
    setState({
      ...state,
      committees: {
        ...state.committees,
        [selectedCommitteeId]: {
          ...activeSheet,
          ...(activeDay === "day2" ? { day2Columns: updated } : { day1Columns: updated }),
        },
      },
    });
    persistAdminColumns(activeDay, updated);
  };

  const handleAdminRemoveColumn = (colId: string) => {
    if (!state || !activeSheet) return;
    const cols = activeDay === "day2" ? activeSheet.day2Columns : activeSheet.day1Columns;
    if (cols.length <= 1) return;
    const updated = cols.filter((c) => c.id !== colId);
    setState({
      ...state,
      committees: {
        ...state.committees,
        [selectedCommitteeId]: {
          ...activeSheet,
          ...(activeDay === "day2" ? { day2Columns: updated } : { day1Columns: updated }),
        },
      },
    });
    persistAdminColumns(activeDay, updated);
  };

  const handleAdminCellChange = (delegateId: string, colId: string, value: string) => {
    if (!state || !activeSheet) return;
    localEditTimestampsRef.current[`${selectedCommitteeId}-${delegateId}`] = Date.now();
    const prevRec = activeSheet.scores[delegateId] || { day1: {}, day2: {} };
    const updatedRec = {
      ...prevRec,
      [activeDay]: {
        ...(prevRec[activeDay] || {}),
        [colId]: value,
      },
    };
    setState({
      ...state,
      committees: {
        ...state.committees,
        [selectedCommitteeId]: {
          ...activeSheet,
          scores: {
            ...activeSheet.scores,
            [delegateId]: updatedRec,
          },
        },
      },
    });

    const tKey = `adm-cell-${selectedCommitteeId}-${delegateId}-${activeDay}-${colId}`;
    if (saveTimersRef.current[tKey]) clearTimeout(saveTimersRef.current[tKey]);
    saveTimersRef.current[tKey] = setTimeout(async () => {
      await fetch("/api/scorecard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_cell",
          adminPassword: ADMIN_MASTER_PASSWORD,
          committeeId: selectedCommitteeId,
          delegateId,
          day: activeDay,
          colId,
          value,
        }),
      });
    }, 250);
  };

  const handleAdminMetaChange = (
    delegateId: string,
    field: "award" | "remarks",
    value: string
  ) => {
    if (!state || !activeSheet) return;
    localEditTimestampsRef.current[`${selectedCommitteeId}-${delegateId}`] = Date.now();
    const prevRec = activeSheet.scores[delegateId] || { day1: {}, day2: {} };
    const updatedRec = {
      ...prevRec,
      [field]: value,
    };
    setState({
      ...state,
      committees: {
        ...state.committees,
        [selectedCommitteeId]: {
          ...activeSheet,
          scores: {
            ...activeSheet.scores,
            [delegateId]: updatedRec,
          },
        },
      },
    });

    const tKey = `adm-meta-${selectedCommitteeId}-${delegateId}-${field}`;
    if (saveTimersRef.current[tKey]) clearTimeout(saveTimersRef.current[tKey]);
    saveTimersRef.current[tKey] = setTimeout(async () => {
      await fetch("/api/scorecard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_delegate_meta",
          adminPassword: ADMIN_MASTER_PASSWORD,
          committeeId: selectedCommitteeId,
          delegateId,
          [field]: value,
        }),
      });
    }, 300);
  };

  const handleSavePasscode = async (committeeId: string) => {
    const newCode = (passcodeDrafts[committeeId] || "").trim();
    if (!newCode || !state) return;
    setState({
      ...state,
      passcodes: {
        ...state.passcodes,
        [committeeId]: newCode,
      },
    });
    await fetch("/api/scorecard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_passcode",
        adminPassword: ADMIN_MASTER_PASSWORD,
        committeeId,
        newPasscode: newCode,
      }),
    });
    setCopiedId(`saved-${committeeId}`);
    setTimeout(() => setCopiedId(""), 2000);
  };

  // Filtered Attendance List
  const filteredAttendanceDelegates = useMemo(() => {
    return delegates.filter((d) => {
      if (attendanceCommFilter !== "all" && d.committeeId !== attendanceCommFilter) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        d.id.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        d.portfolioName.toLowerCase().includes(q) ||
        d.phone.toLowerCase().includes(q)
      );
    });
  }, [delegates, attendanceCommFilter, searchQuery]);

  // Committee Scoring Rows
  const scoringRows = useMemo(() => {
    if (!activeSheet) return [];
    const commDels = delegates.filter((d) => d.committeeId === selectedCommitteeId);
    const list = commDels.map((d) => {
      const rec = activeSheet.scores[d.id];
      const d1Total = computeDaySum(rec?.day1, activeSheet.day1Columns);
      const d2Total = computeDaySum(rec?.day2, activeSheet.day2Columns);
      const grandTotal = Math.round((d1Total + d2Total) * 100) / 100;
      const att = state?.attendance[d.id] || { day1: false, day2: false };
      return {
        ...d,
        d1Total,
        d2Total,
        grandTotal,
        att,
        award: rec?.award || "",
        remarks: rec?.remarks || "",
        cells: (activeDay === "day2" ? rec?.day2 : rec?.day1) || {},
      };
    });

    const sorted = [...list].sort((a, b) => b.grandTotal - a.grandTotal);
    const rankMap = new Map<string, number>();
    sorted.forEach((item, idx) => {
      if (item.grandTotal > 0) rankMap.set(item.id, idx + 1);
    });

    return list
      .map((item) => ({
        ...item,
        rank: rankMap.get(item.id) || null,
      }))
      .filter((r) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          r.id.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.portfolioName.toLowerCase().includes(q)
        );
      });
  }, [activeSheet, delegates, selectedCommitteeId, state?.attendance, activeDay, searchQuery]);

  const totalDay1Present = useMemo(() => {
    if (!state) return 0;
    return delegates.filter((d) => state.attendance[d.id]?.day1).length;
  }, [delegates, state]);

  const totalDay2Present = useMemo(() => {
    if (!state) return 0;
    return delegates.filter((d) => state.attendance[d.id]?.day2).length;
  }, [delegates, state]);

  return (
    <div className="bg-[#140b24] border-2 border-gold/50 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000] space-y-6">
      {/* Top Bar: Title + Public Scorecard Master Switch */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-gold text-[#0b0714] text-[10px] font-mono font-black uppercase tracking-wider border border-black">
              CONFERENCE OPERATIONS • ATTENDANCE &amp; LIVE SCORING
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Chair Sync ({syncPulse || "Active"})
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl text-cream font-extrabold uppercase">
            Gate Attendance, <span className="text-gold">Chair Excel Sync</span> &amp; Public Scorecard
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1">
            <Link
              href="/chair-scoring"
              target="_blank"
              className="text-gold hover:underline inline-flex items-center gap-1 font-bold"
            >
              <FileSpreadsheet size={13} />
              <span>Open Chair Scoring Portal (/chair-scoring)</span>
              <ExternalLink size={11} />
            </Link>
            <Link
              href="/scorecard"
              target="_blank"
              className="text-emerald-300 hover:underline inline-flex items-center gap-1 font-bold"
            >
              <Trophy size={13} />
              <span>Open Public Scorecard Page (/scorecard)</span>
              <ExternalLink size={11} />
            </Link>
          </div>
        </div>

        {/* Master Public Scorecard Visibility Switch */}
        <div className="bg-[#0b0714] border-2 border-white/20 p-3 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-cream/60 font-bold flex items-center justify-between">
            <span>Public /scorecard Visibility Mode:</span>
            <span className="text-gold font-black">
              {state?.visibility === "private"
                ? "🔒 LOCKED (IN-SESSION)"
                : state?.visibility === "day1_published"
                  ? "🔓 DAY 1 LIVE"
                  : "🏆 FINAL LIVE"}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleToggleVisibility("private")}
              className={`px-3 py-1.5 text-[11px] font-mono font-bold uppercase border cursor-pointer flex items-center gap-1 ${
                state?.visibility === "private"
                  ? "bg-rose-500 text-white border-black font-black"
                  : "bg-[#140b24] text-cream/70 border-white/15 hover:border-rose-400"
              }`}
            >
              <Lock size={12} />
              <span>Private (In-Session)</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleVisibility("day1_published")}
              className={`px-3 py-1.5 text-[11px] font-mono font-bold uppercase border cursor-pointer flex items-center gap-1 ${
                state?.visibility === "day1_published"
                  ? "bg-emerald-400 text-[#041a10] border-black font-black"
                  : "bg-[#140b24] text-cream/70 border-white/15 hover:border-emerald-400"
              }`}
            >
              <Unlock size={12} />
              <span>Publish Day 1 Scores</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleVisibility("final_published")}
              className={`px-3 py-1.5 text-[11px] font-mono font-bold uppercase border cursor-pointer flex items-center gap-1 ${
                state?.visibility === "final_published"
                  ? "bg-gold text-[#0b0714] border-black font-black"
                  : "bg-[#140b24] text-cream/70 border-white/15 hover:border-gold"
              }`}
            >
              <Trophy size={12} />
              <span>Publish Final (Day 1+2)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase border-2 flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === "attendance"
                ? "bg-gold text-[#0b0714] border-black font-black shadow-[3px_3px_0px_0px_#000]"
                : "bg-[#0b0714] text-cream/75 border-white/15 hover:border-gold/50"
            }`}
          >
            <Users size={14} />
            <span>
              1. Morning Gate Attendance ({totalDay1Present} D1 / {totalDay2Present} D2)
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("scoring")}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase border-2 flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === "scoring"
                ? "bg-gold text-[#0b0714] border-black font-black shadow-[3px_3px_0px_0px_#000]"
                : "bg-[#0b0714] text-cream/75 border-white/15 hover:border-gold/50"
            }`}
          >
            <FileSpreadsheet size={14} />
            <span>2. Live Chair Excel Sheets &amp; Admin Override</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("passcodes")}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase border-2 flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === "passcodes"
                ? "bg-gold text-[#0b0714] border-black font-black shadow-[3px_3px_0px_0px_#000]"
                : "bg-[#0b0714] text-cream/75 border-white/15 hover:border-gold/50"
            }`}
          >
            <KeyRound size={14} />
            <span>3. Committee Chair Passcodes</span>
          </button>
        </div>

        {/* Search Input for Attendance & Scoring */}
        {activeTab !== "passcodes" && (
          <div className="relative min-w-[240px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Pass ID, Name, Portfolio, Phone..."
              className="w-full bg-[#0b0714] border border-white/25 pl-9 pr-3 py-2 text-xs font-mono text-cream outline-none focus:border-gold"
            />
          </div>
        )}
      </div>

      {/* ============================================================================
          TAB 1: MORNING GATE ATTENDANCE DESK
         ============================================================================ */}
      {activeTab === "attendance" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0b0714] border border-white/15 p-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setAttendanceCommFilter("all")}
                className={`px-3 py-1.5 text-xs font-mono uppercase border cursor-pointer ${
                  attendanceCommFilter === "all"
                    ? "bg-gold text-[#0b0714] border-black font-black"
                    : "bg-[#140b24] text-cream/70 border-white/15"
                }`}
              >
                All Committees ({delegates.length})
              </button>
              {committees.map((c) => {
                const count = delegates.filter((d) => d.committeeId === c.id).length;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setAttendanceCommFilter(c.id)}
                    className={`px-3 py-1.5 text-xs font-mono uppercase border cursor-pointer ${
                      attendanceCommFilter === c.id
                        ? "bg-gold text-[#0b0714] border-black font-black"
                        : "bg-[#140b24] text-cream/70 border-white/15"
                    }`}
                  >
                    {c.name} ({count})
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleBulkAttendance(
                    filteredAttendanceDelegates.map((d) => d.id),
                    "day1",
                    true
                  )
                }
                className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 text-[11px] font-mono font-bold uppercase cursor-pointer"
              >
                Mark Visible Day 1 Present
              </button>
              <button
                type="button"
                onClick={() =>
                  handleBulkAttendance(
                    filteredAttendanceDelegates.map((d) => d.id),
                    "day2",
                    true
                  )
                }
                className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/50 text-sky-300 text-[11px] font-mono font-bold uppercase cursor-pointer"
              >
                Mark Visible Day 2 Present
              </button>
            </div>
          </div>

          <div className="bg-[#0b0714] border-2 border-white/20 max-h-[540px] overflow-y-auto">
            <table className="w-full border-collapse text-left font-mono text-xs">
              <thead className="sticky top-0 bg-[#1d1036] border-b-2 border-gold/40 text-[11px] uppercase text-gold z-10">
                <tr>
                  <th className="py-2.5 px-3 border-r border-white/15">PASS ID</th>
                  <th className="py-2.5 px-3 border-r border-white/15">DELEGATE NAME</th>
                  <th className="py-2.5 px-3 border-r border-white/15">COMMITTEE</th>
                  <th className="py-2.5 px-3 border-r border-white/15">PORTFOLIO</th>
                  <th className="py-2.5 px-3 border-r border-white/15">CONTACT</th>
                  <th className="py-2.5 px-3 border-r border-white/15 text-center">
                    DAY 1 (20 NOV • BISHOP SCOTT)
                  </th>
                  <th className="py-2.5 px-3 text-center">DAY 2 (21 NOV • CNLU)</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendanceDelegates.map((d, idx) => {
                  const att = state?.attendance[d.id] || {
                    day1: false,
                    day2: false,
                  };
                  return (
                    <tr
                      key={d.id}
                      className={`border-b border-white/10 ${
                        idx % 2 === 0 ? "bg-[#0d0718]" : "bg-[#130a22]"
                      } hover:bg-[#1e1136]`}
                    >
                      <td className="py-2 px-3 border-r border-white/10 font-bold text-gold">
                        {d.id}
                      </td>
                      <td className="py-2 px-3 border-r border-white/10 font-sans font-semibold text-cream">
                        {d.name}
                      </td>
                      <td className="py-2 px-3 border-r border-white/10 text-gold/90 font-bold uppercase">
                        {d.committeeName}
                      </td>
                      <td className="py-2 px-3 border-r border-white/10 font-sans text-cream/80">
                        {d.portfolioName}
                      </td>
                      <td className="py-2 px-3 border-r border-white/10 text-cream/65">
                        {d.phone}
                      </td>
                      <td className="py-2 px-3 border-r border-white/10 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleAttendance(d.id, "day1", !att.day1)
                          }
                          className={`px-3 py-1 text-[11px] font-mono font-bold uppercase border cursor-pointer transition-all ${
                            att.day1
                              ? "bg-emerald-500 text-[#041a10] border-black font-black shadow-[2px_2px_0px_0px_#000]"
                              : "bg-white/5 text-cream/50 border-white/20 hover:border-emerald-400 hover:text-emerald-300"
                          }`}
                        >
                          {att.day1 ? "✓ PRESENT (DAY 1)" : "MARK PRESENT"}
                        </button>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleAttendance(d.id, "day2", !att.day2)
                          }
                          className={`px-3 py-1 text-[11px] font-mono font-bold uppercase border cursor-pointer transition-all ${
                            att.day2
                              ? "bg-emerald-500 text-[#041a10] border-black font-black shadow-[2px_2px_0px_0px_#000]"
                              : "bg-white/5 text-cream/50 border-white/20 hover:border-emerald-400 hover:text-emerald-300"
                          }`}
                        >
                          {att.day2 ? "✓ PRESENT (DAY 2)" : "MARK PRESENT"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================================
          TAB 2: LIVE CHAIR EXCEL SHEETS & ADMIN OVERRIDE
         ============================================================================ */}
      {activeTab === "scoring" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0b0714] border border-white/15 p-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {committees.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCommitteeId(c.id)}
                  className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase border cursor-pointer ${
                    selectedCommitteeId === c.id
                      ? "bg-gold text-[#0b0714] border-black font-black"
                      : "bg-[#140b24] text-cream/75 border-white/15 hover:border-gold/50"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex border border-white/20 bg-[#140b24]">
                <button
                  type="button"
                  onClick={() => setActiveDay("day1")}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase cursor-pointer ${
                    activeDay === "day1"
                      ? "bg-gold text-[#0b0714] font-black"
                      : "text-cream/70"
                  }`}
                >
                  Day 1 Sheet
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDay("day2")}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase cursor-pointer ${
                    activeDay === "day2"
                      ? "bg-gold text-[#0b0714] font-black"
                      : "text-cream/70"
                  }`}
                >
                  Day 2 Sheet
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdminAddColumn}
                className="inline-flex items-center gap-1 bg-emerald-500 text-[#041a10] border border-black px-3 py-1.5 text-xs font-mono font-black uppercase cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Column</span>
              </button>
            </div>
          </div>

          <div className="bg-[#0b0714] border-2 border-white/20 overflow-x-auto max-h-[560px]">
            <table className="w-full border-collapse text-left font-mono text-xs">
              <thead className="sticky top-0 bg-[#1d1036] border-b-2 border-gold/40 text-[11px] uppercase text-gold z-10">
                <tr>
                  <th className="py-2.5 px-2.5 border-r border-white/15 text-center">#</th>
                  <th className="py-2.5 px-3 border-r border-white/15">DEL ID</th>
                  <th className="py-2.5 px-3 border-r border-white/15 min-w-[150px]">
                    DELEGATE NAME
                  </th>
                  <th className="py-2.5 px-3 border-r border-white/15 min-w-[175px]">
                    PORTFOLIO
                  </th>
                  <th className="py-2.5 px-2.5 border-r-2 border-gold/40 text-center">
                    GATE
                  </th>

                  {activeColumns.map((col) => (
                    <th
                      key={col.id}
                      className="p-1.5 border-r border-white/15 min-w-[120px] bg-[#241344]"
                    >
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={col.label}
                          onChange={(e) =>
                            handleAdminRenameColumn(col.id, e.target.value)
                          }
                          className="w-full bg-[#120824] border border-gold/40 px-2 py-1 text-[11px] font-mono font-bold text-gold outline-none"
                        />
                        {activeColumns.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleAdminRemoveColumn(col.id)}
                            className="p-1 text-cream/40 hover:text-rose-400 cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}

                  <th className="py-2.5 px-3 border-r border-white/15 text-center bg-[#180c2e]">
                    D1 TOT
                  </th>
                  <th className="py-2.5 px-3 border-r border-white/15 text-center bg-[#180c2e]">
                    D2 TOT
                  </th>
                  <th className="py-2.5 px-3 border-r border-white/15 text-center bg-gold/15 text-gold font-black">
                    GRAND TOT
                  </th>
                  <th className="py-2.5 px-2.5 border-r border-white/15 text-center">
                    RANK
                  </th>
                  <th className="py-2.5 px-3 border-r border-white/15 min-w-[150px]">
                    AWARD
                  </th>
                  <th className="py-2.5 px-3 min-w-[170px]">REMARKS</th>
                </tr>
              </thead>
              <tbody>
                {scoringRows.map((row, rIdx) => {
                  const isPresent =
                    activeDay === "day2" ? row.att.day2 : row.att.day1;
                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-white/10 ${
                        rIdx % 2 === 0 ? "bg-[#0d0718]" : "bg-[#130a22]"
                      } hover:bg-[#1e1136]`}
                    >
                      <td className="py-2 px-2.5 border-r border-white/10 text-center text-cream/45">
                        {rIdx + 1}
                      </td>
                      <td className="py-2 px-3 border-r border-white/10 font-bold text-gold">
                        {row.id.replace("ATH-SUMMIT-", "#")}
                      </td>
                      <td className="py-2 px-3 border-r border-white/10 font-sans font-semibold text-cream">
                        {row.name}
                      </td>
                      <td className="py-2 px-3 border-r border-white/10 font-sans text-cream/80">
                        {row.portfolioName}
                      </td>
                      <td className="py-2 px-2.5 border-r-2 border-gold/30 text-center">
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-bold border ${
                            isPresent
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "bg-white/5 text-cream/40 border-white/10"
                          }`}
                        >
                          {isPresent ? "PRESENT" : "ABSENT"}
                        </span>
                      </td>

                      {activeColumns.map((col) => (
                        <td
                          key={col.id}
                          className="p-0 border-r border-white/15 focus-within:bg-gold/15"
                        >
                          <input
                            type="text"
                            value={row.cells[col.id] ?? ""}
                            onChange={(e) =>
                              handleAdminCellChange(row.id, col.id, e.target.value)
                            }
                            placeholder="—"
                            className="w-full px-2 py-2 bg-transparent text-center font-mono text-xs font-bold text-cream outline-none"
                          />
                        </td>
                      ))}

                      <td className="py-2 px-3 border-r border-white/10 text-center font-bold text-cream/80 bg-[#150a26]">
                        {row.d1Total}
                      </td>
                      <td className="py-2 px-3 border-r border-white/10 text-center font-bold text-cream/80 bg-[#150a26]">
                        {row.d2Total}
                      </td>
                      <td className="py-2 px-3 border-r border-white/10 text-center font-black text-gold bg-gold/10">
                        {row.grandTotal}
                      </td>
                      <td className="py-2 px-2.5 border-r border-white/10 text-center font-bold text-gold">
                        {row.rank ? `#${row.rank}` : "—"}
                      </td>
                      <td className="p-1 border-r border-white/10">
                        <select
                          value={row.award}
                          onChange={(e) =>
                            handleAdminMetaChange(row.id, "award", e.target.value)
                          }
                          className="w-full bg-[#0b0714] border border-white/15 px-2 py-1 text-[11px] font-mono text-gold outline-none"
                        >
                          {AWARD_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt || "— Award —"}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-0">
                        <input
                          type="text"
                          value={row.remarks}
                          onChange={(e) =>
                            handleAdminMetaChange(row.id, "remarks", e.target.value)
                          }
                          placeholder="Remarks..."
                          className="w-full px-2 py-2 bg-transparent font-sans text-xs text-cream outline-none"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================================
          TAB 3: COMMITTEE CHAIR PASSCODES & CREDENTIALS
         ============================================================================ */}
      {activeTab === "passcodes" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {committees.map((c) => {
            const currentCode = state?.passcodes?.[c.id] || "";
            const draftVal = passcodeDrafts[c.id] ?? currentCode;
            return (
              <div
                key={c.id}
                className="bg-[#0b0714] border-2 border-white/15 p-5 space-y-3 shadow-[3px_3px_0px_0px_#000]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-heading text-xl font-black text-gold block">
                      {c.name}
                    </span>
                    <span className="text-xs text-cream/60">{c.fullName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const msg = `Athena Summit 2026 — ${c.name} Chair Scoring Portal\nURL: https://projectathena.site/chair-scoring\nCommittee: ${c.name}\nPasscode: ${currentCode}`;
                      navigator.clipboard.writeText(msg);
                      setCopiedId(c.id);
                      setTimeout(() => setCopiedId(""), 2000);
                    }}
                    className="px-2.5 py-1.5 bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold text-[10px] font-mono font-bold uppercase flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === c.id ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedId === c.id ? "Copied" : "Copy Credentials"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={draftVal}
                    onChange={(e) =>
                      setPasscodeDrafts({
                        ...passcodeDrafts,
                        [c.id]: e.target.value,
                      })
                    }
                    className="flex-1 bg-[#140b24] border border-white/25 px-3 py-2 text-xs font-mono font-bold text-emerald-300 outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={() => handleSavePasscode(c.id)}
                    className="px-3 py-2 bg-gold text-[#0b0714] font-mono font-black text-xs uppercase border border-black cursor-pointer"
                  >
                    {copiedId === `saved-${c.id}` ? "Saved ✓" : "Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
