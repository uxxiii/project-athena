"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  Phone,
  Mail,
  FileText,
  Search,
  Download,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Copy,
  MessageCircle,
} from "lucide-react";
import type { Registration } from "@/lib/types";
import { committees, getCommitteeById } from "@/data/committees";
import { Badge } from "@/components/ui/Badge";

type SortOption = "date-desc" | "date-asc" | "name-asc" | "name-desc" | "pending-first";

export default function AdminPaymentsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [eventFilter, setEventFilter] = useState<"all" | "mun-picnic" | "athena-summit">("all");
  const [committeeFilter, setCommitteeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [loadingScreenshot, setLoadingScreenshot] = useState(false);

  // Lazy-fetch full screenshot when delegate is selected
  const handleSelectRegistration = useCallback(async (reg: Registration) => {
    setSelectedRegistration(reg);
    if (!reg.paymentScreenshot && reg.hasScreenshot) {
      setLoadingScreenshot(true);
      try {
        const res = await fetch(`/api/admin/registrations/${encodeURIComponent(reg.id)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.registration?.paymentScreenshot) {
            setSelectedRegistration((prev) =>
              prev?.id === reg.id
                ? { ...prev, paymentScreenshot: data.registration.paymentScreenshot }
                : prev
            );
            setRegistrations((prev) =>
              prev.map((r) =>
                r.id === reg.id
                  ? { ...r, paymentScreenshot: data.registration.paymentScreenshot }
                  : r
              )
            );
          }
        }
      } catch (err) {
        console.error("Failed to load payment screenshot:", err);
      } finally {
        setLoadingScreenshot(false);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const ev = urlParams.get("event");
      const comm = urlParams.get("committee");
      const q = urlParams.get("search");
      const statusParam = urlParams.get("filter");

      if (ev === "mun-picnic" || ev === "athena-summit") {
        setEventFilter(ev);
      }
      if (comm) {
        setCommitteeFilter(comm);
      }
      if (q) {
        setSearch(q);
      }
      if (statusParam && ["pending", "approved", "rejected", "all"].includes(statusParam)) {
        setFilter(statusParam as "pending" | "approved" | "rejected" | "all");
      }
    }
  }, []);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter === "all" ? "/api/admin/registrations" : `/api/admin/registrations?status=${filter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const regs: Registration[] = data.registrations || [];
        setRegistrations(regs);
        if (selectedRegistration) {
          const updated = regs.find((r) => r.id === selectedRegistration.id);
          if (updated) setSelectedRegistration(updated);
        }
      }
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    } finally {
      setLoading(false);
    }
  }, [filter, selectedRegistration]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
    let reason = "";
    if (status === "rejected") {
      const inputReason = prompt("Reason for rejection (optional, included in delegate email):");
      if (inputReason === null) return;
      reason = inputReason;
    }

    setActionId(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionReason: reason }),
      });

      if (res.ok) {
        const data = await res.json();
        // Optimistic update without refetching entire table
        setRegistrations((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, status, rejectionReason: reason || r.rejectionReason } : r
          )
        );
        if (selectedRegistration?.id === id) {
          setSelectedRegistration((prev) =>
            prev ? { ...prev, status, rejectionReason: reason || prev.rejectionReason } : null
          );
        }

        if (data.emailStatus?.success) {
          alert(`Success: Registration ${status}. Official email dispatched to delegate.`);
        } else if (data.emailStatus?.error) {
          alert(`Registration marked as ${status}, but email delivery note: ${data.emailStatus.error}`);
        } else {
          alert(`Registration marked as ${status} successfully.`);
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(`Failed to update status: ${errJson.error || res.statusText}`);
      }
    } catch (err) {
      console.error("Error updating status", err);
    } finally {
      setActionId(null);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(`${label} copied!`);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  // Filtered & Sorted Registrations
  const filteredRegistrations = useMemo(() => {
    const list = registrations.filter((r) => {
      // Event filter
      if (eventFilter === "mun-picnic" && r.eventSlug !== "mun-picnic") return false;
      if (eventFilter === "athena-summit" && r.eventSlug === "mun-picnic") return false;

      // Committee filter
      if (committeeFilter !== "all") {
        if (r.assignedCommittee !== committeeFilter) return false;
      }

      // Search filter
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.institution.toLowerCase().includes(q) ||
        (r.assignedCommittee && r.assignedCommittee.toLowerCase().includes(q)) ||
        (r.assignedPortfolio && r.assignedPortfolio.toLowerCase().includes(q)) ||
        (r.notes && r.notes.toLowerCase().includes(q))
      );
    });

    // Sort
    list.sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "date-asc") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === "pending-first") {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return list;
  }, [registrations, eventFilter, committeeFilter, search, sortBy]);

  // Export to CSV
  const exportToCSV = () => {
    if (filteredRegistrations.length === 0) return;
    const headers = [
      "ID",
      "Event",
      "Name",
      "Email",
      "Phone",
      "Institution",
      "Class/Year",
      "Status",
      "Assigned Committee",
      "Assigned Portfolio",
      "Experience",
      "Reference",
      "Created At",
    ];

    const rows = filteredRegistrations.map((r) => [
      `"${r.id}"`,
      `"${r.eventSlug}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.institution.replace(/"/g, '""')}"`,
      `"${r.classYear}"`,
      `"${r.status}"`,
      `"${r.assignedCommittee ?? ""}"`,
      `"${r.assignedPortfolio ?? ""}"`,
      `"${(r.munExperience ?? "").replace(/"/g, '""')}"`,
      `"${(r.reference ?? "").replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toISOString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `athena_payments_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const picnicCount = registrations.filter((r) => r.eventSlug === "mun-picnic").length;
  const summitCount = registrations.filter((r) => r.eventSlug !== "mun-picnic").length;

  return (
    <div className="pt-28 pb-20 neo-grid-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-6 space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cream/60 hover:text-gold transition-colors border border-white/15 bg-[#140b24] px-3.5 py-1.5 shadow-[2px_2px_0px_0px_#000]"
          >
            <ArrowLeft size={14} />
            Secretariat Dashboard
          </Link>

          {copyFeedback && (
            <div className="bg-gold text-[#0b0714] text-xs font-mono font-bold px-3 py-1 shadow-[2px_2px_0px_0px_#000]">
              {copyFeedback}
            </div>
          )}
        </div>

        {/* Header Bar */}
        <div className="bg-[#140b24] border-2 border-white/15 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-gold/15 text-gold border border-gold/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Payment Verification Unit
                </span>
                <span className="text-xs text-cream/50 font-mono">
                  Showing {filteredRegistrations.length} of {registrations.length} registrations
                </span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl text-cream font-extrabold uppercase tracking-tight">
                Delegate Payment & Allocation <span className="text-gold">Verification</span>
              </h1>
              <p className="text-xs sm:text-sm text-cream/60 mt-1 font-sans">
                Inspect uploaded UPI screenshots, verify payments (₹1,300 Summit / ₹100 Picnic), and dispatch confirmation passes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={exportToCSV}
                className="inline-flex items-center gap-2 border-2 border-white/20 bg-[#0b0714] px-4 py-2.5 text-xs font-mono font-bold text-cream hover:border-gold hover:text-gold transition-colors shadow-[2px_2px_0px_0px_#000000]"
              >
                <Download size={14} />
                <span>Export ({filteredRegistrations.length})</span>
              </button>

              <button
                onClick={fetchRegistrations}
                disabled={loading}
                className="inline-flex items-center gap-2 border-2 border-white/20 bg-[#0b0714] p-2.5 text-cream hover:border-gold hover:text-gold transition-colors shadow-[2px_2px_0px_0px_#000000]"
                title="Refresh registrations"
              >
                <RefreshCw size={14} className={loading ? "animate-spin text-gold" : ""} />
              </button>
            </div>
          </div>
        </div>

        {/* Powerful Filters & Sorting Control Hub */}
        <div className="bg-[#140b24] border-2 border-white/15 p-5 shadow-[4px_4px_0px_0px_#000000] space-y-4">
          {/* Row 1: Status Tabs + Event Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#0b0714] p-1 border border-white/15 text-xs font-mono">
              {(["pending", "approved", "rejected", "all"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3.5 py-1.5 font-bold uppercase transition-colors ${
                    filter === tab
                      ? "bg-gold text-[#0b0714] shadow-[1px_1px_0px_0px_#000]"
                      : "text-cream/60 hover:text-cream"
                  }`}
                >
                  {tab === "all" ? "All Statuses" : tab}
                </button>
              ))}
            </div>

            {/* Event Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#0b0714] p-1 border border-white/15 text-xs font-mono">
              <button
                onClick={() => setEventFilter("all")}
                className={`px-3 py-1 font-bold uppercase transition-colors ${
                  eventFilter === "all"
                    ? "bg-gold text-[#0b0714]"
                    : "text-cream/60 hover:text-cream"
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setEventFilter("athena-summit")}
                className={`px-3 py-1 font-bold uppercase transition-colors ${
                  eventFilter === "athena-summit"
                    ? "bg-gold text-[#0b0714]"
                    : "text-gold/80 hover:text-gold"
                }`}
              >
                Athena Summit (₹1,300) • {summitCount}
              </button>
              <button
                onClick={() => setEventFilter("mun-picnic")}
                className={`px-3 py-1 font-bold uppercase transition-colors ${
                  eventFilter === "mun-picnic"
                    ? "bg-gold text-[#0b0714]"
                    : "text-cream/60 hover:text-cream"
                }`}
              >
                MUN Picnic (₹100) • {picnicCount}
              </button>
            </div>
          </div>

          {/* Row 2: Committee Filter + Sort Dropdown + Search Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10">
            {/* Committee Filter */}
            <div className="flex items-center gap-2 bg-[#0b0714] border border-white/20 px-3 py-2">
              <Filter size={14} className="text-gold shrink-0" />
              <select
                value={committeeFilter}
                onChange={(e) => setCommitteeFilter(e.target.value)}
                className="w-full bg-transparent text-xs text-cream font-mono outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#140b24]">All Committees (6 Active)</option>
                {committees.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#140b24]">
                    {c.name} ({c.maxDelegates} Seats)
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-[#0b0714] border border-white/20 px-3 py-2">
              <ArrowUpDown size={14} className="text-gold shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-transparent text-xs text-cream font-mono outline-none cursor-pointer"
              >
                <option value="date-desc" className="bg-[#140b24]">Newest Submissions First</option>
                <option value="date-asc" className="bg-[#140b24]">Oldest Submissions First</option>
                <option value="pending-first" className="bg-[#140b24]">Pending Reviews First</option>
                <option value="name-asc" className="bg-[#140b24]">Delegate Name (A → Z)</option>
                <option value="name-desc" className="bg-[#140b24]">Delegate Name (Z → A)</option>
              </select>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" />
              <input
                type="text"
                placeholder="Search delegate, phone, pass ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0b0714] border border-white/20 pl-9 pr-3 py-2 text-xs text-cream font-mono outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* Main Grid: Delegate List + Sticky Detailed Dossier */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Delegate List (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            {loading ? (
              <div className="bg-[#140b24] border-2 border-white/15 p-12 text-center text-cream/40 flex flex-col items-center">
                <Loader2 size={32} className="animate-spin text-gold mb-3" />
                <span className="font-mono text-xs">Loading delegate records...</span>
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="bg-[#140b24] border-2 border-white/15 p-12 text-center text-cream/40 font-mono text-xs">
                No registrations match the selected filters.
              </div>
            ) : (
              filteredRegistrations.map((reg) => {
                const isSelected = selectedRegistration?.id === reg.id;
                const isPicnic = reg.eventSlug === "mun-picnic";
                const committee = getCommitteeById(reg.assignedCommittee ?? "");
                const portfolioName =
                  committee?.portfolios.find((p) => p.id === reg.assignedPortfolio)?.name ??
                  reg.assignedPortfolio ??
                  "Unassigned";

                return (
                  <div
                    key={reg.id}
                    onClick={() => handleSelectRegistration(reg)}
                    className={`bg-[#140b24] border-2 p-5 transition-all cursor-pointer shadow-[3px_3px_0px_0px_#000000] ${
                      isSelected
                        ? "border-gold bg-[#1c0f33]"
                        : "border-white/15 hover:border-gold/50"
                    }`}
                  >
                    {/* Top Row: Delegate Name, Pass ID & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-gold">
                            {reg.id}
                          </span>
                          <span className="text-white/20">•</span>
                          <h3 className="font-heading text-lg text-cream font-bold">
                            {reg.name}
                          </h3>
                          {isPicnic ? (
                            <span className="text-[10px] font-mono bg-purple-deep text-gold px-2 py-0.5 border border-gold/30 font-bold">
                              Picnic (₹100)
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono bg-gold/15 text-gold px-2 py-0.5 border border-gold/30 font-bold">
                              Summit (₹1,300)
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-cream/50 mt-1 font-mono">
                          <span className="flex items-center gap-1.5">
                            <Mail size={12} className="text-gold/70" />
                            {reg.email}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <Phone size={12} className="text-gold/70" />
                            {reg.phone}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant={
                          reg.status === "approved"
                            ? "success"
                            : reg.status === "rejected"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {reg.status}
                      </Badge>
                    </div>

                    {/* Middle Info Row: Allocation & College */}
                    <div className="grid sm:grid-cols-2 gap-3 text-xs bg-[#0b0714] p-3 border border-white/10 mb-3">
                      <div>
                        <span className="text-cream/40 font-mono text-[10px] uppercase block">
                          Allocation:
                        </span>
                        {isPicnic ? (
                          <span className="text-cream font-mono font-medium">Energy Park Pass</span>
                        ) : (
                          <span className="text-gold font-bold font-mono">
                            {committee?.name ?? reg.assignedCommittee?.toUpperCase()} :{" "}
                            <span className="text-cream font-normal">{portfolioName}</span>
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-cream/40 font-mono text-[10px] uppercase block">
                          Institution:
                        </span>
                        <span className="text-cream/80 truncate block">
                          {reg.institution} ({reg.classYear})
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Row */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono">
                      <span className="text-cream/40 text-[10px]">
                        Submitted: {new Date(reg.createdAt).toLocaleDateString()}
                      </span>

                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {(reg.paymentScreenshot || reg.hasScreenshot) && (
                          <button
                            onClick={async () => {
                              if (reg.paymentScreenshot) {
                                setPreviewImage(reg.paymentScreenshot);
                              } else {
                                await handleSelectRegistration(reg);
                                const res = await fetch(`/api/admin/registrations/${encodeURIComponent(reg.id)}`);
                                if (res.ok) {
                                  const data = await res.json();
                                  if (data.registration?.paymentScreenshot) {
                                    setPreviewImage(data.registration.paymentScreenshot);
                                  }
                                }
                              }
                            }}
                            className="inline-flex items-center gap-1 text-gold hover:text-gold-light px-2.5 py-1 bg-gold/10 border border-gold/30 text-[11px] font-bold"
                          >
                            <Eye size={12} /> View Receipt
                          </button>
                        )}

                        {reg.status !== "approved" ? (
                          <button
                            disabled={actionId === reg.id}
                            onClick={() => handleUpdateStatus(reg.id, "approved")}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-[2px_2px_0px_0px_#000]"
                          >
                            {actionId === reg.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <CheckCircle size={12} />
                            )}
                            Approve
                          </button>
                        ) : (
                          <button
                            disabled={actionId === reg.id}
                            onClick={() => handleUpdateStatus(reg.id, "approved")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-gold border border-gold/40 hover:bg-gold/10 text-xs font-bold"
                            title="Resend entry pass / confirmation email"
                          >
                            {actionId === reg.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Mail size={12} />
                            )}
                            Resend Email
                          </button>
                        )}

                        {reg.status !== "rejected" && (
                          <button
                            disabled={actionId === reg.id}
                            onClick={() => handleUpdateStatus(reg.id, "rejected")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 text-xs font-bold"
                          >
                            <XCircle size={12} /> Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed Delegate Dossier (Sticky) */}
          <div className="space-y-4">
            {selectedRegistration ? (
              <div className="bg-[#140b24] border-2 border-gold/40 p-6 sticky top-28 space-y-5 shadow-[6px_6px_0px_0px_#000000]">
                {/* Dossier Header */}
                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-gold font-mono font-bold">
                      Official Dossier
                    </span>
                    <span className="font-mono text-xs text-emerald-400 font-bold bg-[#0b0714] px-2 py-0.5 border border-emerald-500/30">
                      {selectedRegistration.id}
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl text-cream font-bold">
                    {selectedRegistration.name}
                  </h3>
                  <p className="text-xs text-cream/50 font-mono mt-0.5">
                    {selectedRegistration.institution} • {selectedRegistration.classYear}
                  </p>
                </div>

                {/* Allocation Box */}
                <div className="bg-[#0b0714] border border-gold/30 p-4 space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-gold font-mono font-bold block">
                    {selectedRegistration.eventSlug === "mun-picnic" ? "Event Pass" : "Committee Allocation"}
                  </span>
                  {selectedRegistration.eventSlug === "mun-picnic" ? (
                    <div>
                      <p className="font-heading text-lg text-cream font-bold">
                        Energy Park Pass (₹100)
                      </p>
                      <p className="text-xs text-cream/60 mt-1">
                        Food / Potluck: {selectedRegistration.foodPreference || "Community Potluck"}
                      </p>
                    </div>
                  ) : (() => {
                    const comm = getCommitteeById(selectedRegistration.assignedCommittee ?? "");
                    const portfolioName =
                      comm?.portfolios.find(
                        (p) => p.id === selectedRegistration.assignedPortfolio
                      )?.name ?? selectedRegistration.assignedPortfolio;

                    return (
                      <div>
                        <p className="font-heading text-lg text-gold font-bold">
                          {selectedRegistration.assignedCommittee?.toUpperCase()} :{" "}
                          <span className="text-cream">{portfolioName}</span>
                        </p>
                        {selectedRegistration.assignedAgenda && (
                          <p className="text-[11px] text-cream/60 mt-1 leading-relaxed bg-[#140b24] p-2 border border-white/5">
                            {selectedRegistration.assignedAgenda}
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Fast Contact & Coordination Buttons */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2.5 bg-[#0b0714] border border-white/10">
                    <span className="text-cream/50 flex items-center gap-1.5">
                      <Mail size={13} className="text-gold" />
                      {selectedRegistration.email}
                    </span>
                    <button
                      onClick={() => copyToClipboard(selectedRegistration.email, "Email")}
                      className="text-gold hover:text-gold-light"
                      title="Copy Email"
                    >
                      <Copy size={13} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#0b0714] border border-white/10">
                    <span className="text-cream/50 flex items-center gap-1.5">
                      <Phone size={13} className="text-gold" />
                      {selectedRegistration.phone}
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${selectedRegistration.phone.replace(/[^\d]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle size={14} />
                      </a>
                      <button
                        onClick={() => copyToClipboard(selectedRegistration.phone, "Phone")}
                        className="text-gold hover:text-gold-light"
                        title="Copy Phone"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Summit Experience & Reference */}
                <div className="space-y-2 text-xs">
                  <span className="text-cream/40 uppercase font-mono text-[10px] block">
                    Prior Summit Experience:
                  </span>
                  <p className="text-cream/70 bg-[#0b0714] p-3 border border-white/10 leading-relaxed font-sans max-h-32 overflow-y-auto">
                    {selectedRegistration.munExperience || "No previous experience recorded (First-time delegate)."}
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-cream/40 uppercase font-mono text-[10px] block">
                    Vouching Reference:
                  </span>
                  <p className="text-cream font-mono bg-[#0b0714] p-2 border border-white/10">
                    {selectedRegistration.reference || "Direct applicant"}
                  </p>
                </div>

                {/* Payment Receipt Image Box */}
                <div className="space-y-2">
                  <span className="text-xs text-cream/40 font-mono uppercase block">
                    Payment Receipt Screenshot:
                  </span>
                  {loadingScreenshot ? (
                    <div className="border-2 border-white/10 bg-[#0b0714] p-8 text-center text-cream/50 flex flex-col items-center justify-center gap-2">
                      <Loader2 size={24} className="animate-spin text-gold" />
                      <span className="text-xs font-mono">Loading full-res receipt from Supabase...</span>
                    </div>
                  ) : selectedRegistration.paymentScreenshot ? (
                    <div
                      className="relative border-2 border-white/20 bg-black cursor-pointer group overflow-hidden"
                      onClick={() => setPreviewImage(selectedRegistration.paymentScreenshot || null)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedRegistration.paymentScreenshot}
                        alt="Payment Receipt"
                        className="w-full h-44 object-contain group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs text-gold font-mono font-bold">
                        <Eye size={14} className="mr-1" /> Click to Enlarge
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-300 font-mono">
                      No screenshot attached with this submission.
                    </div>
                  )}
                </div>

                {/* Direct Action Control Footer */}
                <div className="pt-2 border-t border-white/10 flex gap-2">
                  {selectedRegistration.status !== "approved" ? (
                    <button
                      disabled={actionId === selectedRegistration.id}
                      onClick={() => handleUpdateStatus(selectedRegistration.id, "approved")}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-1.5"
                    >
                      {actionId === selectedRegistration.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <CheckCircle size={13} />
                      )}
                      Approve & Dispatch Pass
                    </button>
                  ) : (
                    <button
                      disabled={actionId === selectedRegistration.id}
                      onClick={() => handleUpdateStatus(selectedRegistration.id, "approved")}
                      className="flex-1 bg-gold text-[#0b0714] font-bold py-2.5 text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-1.5"
                    >
                      {actionId === selectedRegistration.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Mail size={13} />
                      )}
                      Resend Confirmation Email
                    </button>
                  )}

                  {selectedRegistration.status !== "rejected" && (
                    <button
                      disabled={actionId === selectedRegistration.id}
                      onClick={() => handleUpdateStatus(selectedRegistration.id, "rejected")}
                      className="border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 font-bold px-3 py-2.5 text-xs uppercase tracking-wider"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#140b24] border-2 border-white/15 p-8 text-center text-cream/40 sticky top-28 space-y-2">
                <FileText size={32} className="mx-auto text-gold/30 mb-2" />
                <h4 className="font-heading text-lg text-cream">No Delegate Selected</h4>
                <p className="text-xs text-cream/50 font-sans">
                  Click on any delegate card from the list to inspect their credentials, uploaded payment receipt, and trigger status updates.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Screenshot Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-[#140b24] border-2 border-gold/40 p-2 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="Payment Screenshot Zoom"
              className="max-h-[82vh] w-auto object-contain mx-auto"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 bg-gold text-[#0b0714] p-1.5 font-bold hover:bg-gold-light transition-colors shadow-[2px_2px_0px_0px_#000]"
            >
              <XCircle size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
