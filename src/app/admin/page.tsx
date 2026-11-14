"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Shield,
  CreditCard,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Download,
  ExternalLink,
  ChevronRight,
  Eye,
  Search,
} from "lucide-react";
import type { Registration, AvailabilitySnapshot } from "@/lib/types";
import { committees, getCommitteeById } from "@/data/committees";
import {
  getCurrentRegistrationFee,
  isDiwaliSaleActive,
  isChildrensDaySaleActive,
  isChildrensDaySaleRecord,
  getRegistrationFeeForRecord,
  extractSummitNumber,
  isSpecialEarlyBirdRegistration,
} from "@/lib/diwali";

const ADMIN_PASSWORD = "athena-portal";

type Donation = {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  transactionRef: string;
  screenshot: string | null;
  message: string;
  createdAt: string;
  status: string;
};

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [recentFilter, setRecentFilter] = useState<"all" | "athena-summit" | "mun-picnic">("all");
  const [recentSearch, setRecentSearch] = useState("");

  const fetchData = useCallback(async () => {
    if (!authenticated) return;
    setLoading(true);
    try {
      const [regRes, availRes, donationRes] = await Promise.all([
        fetch("/api/admin/registrations"),
        fetch("/api/availability"),
        fetch("/api/admin/donations"),
      ]);

      if (regRes.ok) {
        const regData = await regRes.json();
        setRegistrations(regData.registrations || []);
      }

      if (availRes.ok) {
        const availData = await availRes.json();
        setAvailability(availData);
      }

      if (donationRes.ok) {
        const donationData = await donationRes.json();
        setDonations(donationData.donations || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin dashboard data", err);
    } finally {
      setLoading(false);
    }
  }, [authenticated]);

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated, fetchData]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Incorrect password. Please try again.");
    }
  };

  // Stats Calculations
  const summitRegs = useMemo(
    () => registrations.filter((r) => r.eventSlug !== "mun-picnic"),
    [registrations]
  );
  const picnicRegs = useMemo(
    () => registrations.filter((r) => r.eventSlug === "mun-picnic"),
    [registrations]
  );

  const pendingCount = registrations.filter((r) => r.status === "pending").length;
  const approvedCount = registrations.filter((r) => r.status === "approved").length;
  const rejectedCount = registrations.filter((r) => r.status === "rejected").length;

  const summitApproved = summitRegs.filter((r) => r.status === "approved").length;
  const picnicApproved = picnicRegs.filter((r) => r.status === "approved").length;

  const currentSummitFee = getCurrentRegistrationFee();
  const isSale = isDiwaliSaleActive();
  const isChildrensSale = isChildrensDaySaleActive();

  // Revenue calculation:
  // - First 75 summit approved delegates + Founder's Offer = ₹1,000 each (Early-Bird)
  // - Children's Day Flash Sale (Nov 14, 9:00 PM – 9:30 PM IST) = ₹1,100 each
  // - Regular summit approved delegates = ₹1,300 each
  // - All picnic approved delegates = ₹100 each
  const {
    confirmedRevenue,
    earlyBirdSummitApproved,
    childrensDaySummitApproved,
    regularFeeSummitApproved,
  } = useMemo(() => {
    const approvedSummit = registrations
      .filter((r) => r.status === "approved" && r.eventSlug !== "mun-picnic")
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    let earlyBird = 0;
    let childrensDay = 0;
    let regular = 0;
    let summitRev = 0;

    approvedSummit.forEach((r, index) => {
      const feeByRecord = getRegistrationFeeForRecord({
        eventSlug: r.eventSlug,
        createdAt: r.createdAt,
        id: r.id,
        name: r.name,
      });
      // The first 75 delegates are strictly Early Bird (₹1,000), plus special Founder's Offers (Reg IDs 100087, 100089, 100093, 100117, 100119, 100126)
      const isEarlyBird = (index < 75 && feeByRecord === 1000) || isSpecialEarlyBirdRegistration(r.id, r.name);
      if (isEarlyBird) {
        earlyBird++;
        summitRev += 1000;
      } else if (feeByRecord === 1100 || isChildrensDaySaleRecord(r)) {
        childrensDay++;
        summitRev += 1100;
      } else {
        regular++;
        summitRev += 1300;
      }
    });

    const approvedPicnicCount = registrations.filter(
      (r) => r.status === "approved" && r.eventSlug === "mun-picnic"
    ).length;
    const picnicRev = approvedPicnicCount * 100;

    return {
      confirmedRevenue: summitRev + picnicRev,
      earlyBirdSummitApproved: earlyBird,
      childrensDaySummitApproved: childrensDay,
      regularFeeSummitApproved: regular,
    };
  }, [registrations]);
  const totalSummitCapacity = 260;

  // Filtered recent registrations
  const filteredRecent = useMemo(() => {
    return registrations.filter((r) => {
      if (recentFilter === "athena-summit" && r.eventSlug === "mun-picnic") return false;
      if (recentFilter === "mun-picnic" && r.eventSlug !== "mun-picnic") return false;
      if (!recentSearch.trim()) return true;
      const q = recentSearch.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        (r.assignedCommittee && r.assignedCommittee.toLowerCase().includes(q))
      );
    });
  }, [registrations, recentFilter, recentSearch]);

  // Export to CSV Function
  const exportToCSV = () => {
    if (registrations.length === 0) return;
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
      "Created At",
    ];

    const rows = registrations.map((r) => [
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
      `"${new Date(r.createdAt).toISOString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `athena_delegates_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!authenticated) {
    return (
      <div className="pt-36 pb-24 min-h-[90vh] flex items-center justify-center neo-grid-bg">
        <div className="mx-auto max-w-md w-full px-6">
          <div className="bg-[#140b24] border-2 border-gold/40 p-8 sm:p-10 shadow-[8px_8px_0px_0px_#000000] relative">
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/15 border border-gold/40 text-gold mb-3">
                <Shield size={30} className="text-gold" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-mono font-bold">
                Project Athena Secretariat
              </span>
              <h1 className="font-heading text-3xl text-cream font-bold mt-1">
                Executive Portal
              </h1>
              <p className="text-xs text-cream/60 mt-1">
                Enter your administrative key to unlock delegate matrix and verification controls.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-cream/70 font-mono mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full rounded-none border-2 border-white/20 bg-[#0b0714] px-4 py-3 text-cream outline-none focus:border-gold focus:ring-1 focus:ring-gold text-sm font-mono shadow-[2px_2px_0px_0px_#000]"
                />
              </div>

              {loginError && (
                <div className="text-xs text-red-400 font-mono bg-red-500/10 p-2.5 border border-red-500/30">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gold py-3 text-sm font-bold uppercase tracking-wider text-[#0b0714] hover:bg-gold-light transition-all shadow-[3px_3px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
              >
                Access Secretariat Terminal
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 neo-grid-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-6 space-y-8">
        {/* Top Executive Command Bar */}
        <div className="bg-[#140b24] border-2 border-white/15 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 bg-gold text-[#0b0714] text-[10px] font-mono font-black uppercase tracking-wider border border-black shadow-[2px_2px_0px_0px_#000]">
                  Secretariat Command Hub
                </span>
                <span className="px-3 py-1 bg-[#0b0714] text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
                <span className="px-3 py-1 bg-[#0b0714] text-gold text-[10px] font-mono font-bold uppercase tracking-wider border border-gold/30">
                  Athena Summit Fee: ₹{currentSummitFee.toLocaleString("en-IN")}
                  {isChildrensSale ? " (Children's Day Sale)" : ""} • Cap: 260
                </span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl text-cream font-extrabold uppercase tracking-tight">
                Athena <span className="text-gold">Secretariat</span> Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-cream/60 max-w-2xl font-sans">
                Real-time oversight for Athena Summit (260 seats across 6 committees) and event operations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/payments"
                className="inline-flex items-center gap-2 bg-gold px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0b0714] hover:bg-gold-light transition-all shadow-[3px_3px_0px_0px_#000000]"
              >
                <CreditCard size={15} />
                <span>Verify Payments ({pendingCount})</span>
              </Link>

              <button
                onClick={exportToCSV}
                className="inline-flex items-center gap-2 border-2 border-white/20 bg-[#0b0714] px-4 py-2.5 text-xs font-mono font-bold text-cream hover:border-gold hover:text-gold transition-colors shadow-[2px_2px_0px_0px_#000000]"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>

              <button
                onClick={fetchData}
                disabled={loading}
                className="inline-flex items-center gap-2 border-2 border-white/20 bg-[#0b0714] p-2.5 text-cream hover:border-gold hover:text-gold transition-colors shadow-[2px_2px_0px_0px_#000000]"
                title="Refresh Matrix Data"
              >
                <RefreshCw size={14} className={loading ? "animate-spin text-gold" : ""} />
              </button>
            </div>
          </div>
        </div>

        {/* Executive KPI Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Registrations */}
          <div className="bg-[#140b24] border-2 border-white/15 p-5 shadow-[4px_4px_0px_0px_#000000] relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-cream/50 uppercase tracking-widest font-mono font-bold">
                Total Dossiers
              </span>
              <Users size={16} className="text-gold" />
            </div>
            <p className="font-heading text-3xl sm:text-4xl text-cream font-black">
              {registrations.length}
            </p>
            <span className="text-[10px] text-cream/40 font-mono mt-1 block">
              Summit: {summitRegs.length} • Picnic: {picnicRegs.length}
            </span>
          </div>

          {/* Card 2: Pending Verification */}
          <Link
            href="/admin/payments?filter=pending"
            className="bg-[#140b24] border-2 border-amber-500/40 hover:border-amber-400 p-5 shadow-[4px_4px_0px_0px_#000000] transition-all group block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-amber-400 uppercase tracking-widest font-mono font-bold">
                Awaiting Review
              </span>
              <Clock size={16} className="text-amber-400 group-hover:animate-pulse" />
            </div>
            <p className="font-heading text-3xl sm:text-4xl text-amber-400 font-black">
              {pendingCount}
            </p>
            <span className="text-[10px] text-amber-300/60 font-mono mt-1 flex items-center gap-1">
              Verify Receipts <ArrowRight size={10} />
            </span>
          </Link>

          {/* Card 3: Approved & Allocated */}
          <div className="bg-[#140b24] border-2 border-white/15 p-5 shadow-[4px_4px_0px_0px_#000000]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono font-bold">
                Passes Issued
              </span>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <p className="font-heading text-3xl sm:text-4xl text-emerald-400 font-black">
              {approvedCount}
            </p>
            <span className="text-[10px] text-cream/40 font-mono mt-1 block">
              Summit: {summitApproved} • Picnic: {picnicApproved}
            </span>
          </div>

          {/* Card 4: Verified Revenue */}
          <div className="bg-[#140b24] border-2 border-white/15 p-5 shadow-[4px_4px_0px_0px_#000000]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gold uppercase tracking-widest font-mono font-bold">
                Revenue In
              </span>
              <TrendingUp size={16} className="text-gold" />
            </div>
            <p className="font-heading text-3xl sm:text-4xl text-gold font-black">
              ₹{confirmedRevenue.toLocaleString("en-IN")}
            </p>
            <span className="text-[10px] text-cream/40 font-mono mt-1 block">
              {earlyBirdSummitApproved} Early-Bird (₹1,000) + {childrensDaySummitApproved} Children&apos;s Day Sale (₹1,100) + {regularFeeSummitApproved} Regular (₹1,300) + {picnicApproved} Picnic (₹100)
            </span>
          </div>

          {/* Card 5: Flagged / Rejected */}
          <div className="bg-[#140b24] border-2 border-white/15 p-5 shadow-[4px_4px_0px_0px_#000000] col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-rose-400 uppercase tracking-widest font-mono font-bold">
                Rejected
              </span>
              <XCircle size={16} className="text-rose-400" />
            </div>
            <p className="font-heading text-3xl sm:text-4xl text-rose-400 font-black">
              {rejectedCount}
            </p>
            <span className="text-[10px] text-cream/40 font-mono mt-1 block">
              Invalid or flagged receipts
            </span>
          </div>
        </div>

        {/* 6-Committee Allocation Matrix Hub */}
        <div className="bg-[#140b24] border-2 border-white/15 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-gold/15 text-gold border border-gold/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Athena Summit 2026
                </span>
                <span className="text-xs text-cream/50 font-mono">
                  Total Capacity: {totalSummitCapacity} Seats
                </span>
              </div>
              <h2 className="font-heading text-2xl text-cream font-bold mt-1">
                Committee Allocation Matrix (6 Active Assemblies)
              </h2>
            </div>

            <Link
              href="/events/athena-summit"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold-light font-mono"
            >
              <span>View Public Summit Page</span>
              <ExternalLink size={12} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {committees.map((c) => {
              const commAvail = availability?.committees[c.id];
              const taken = commAvail?.taken ?? 0;
              const total = commAvail?.total ?? c.maxDelegates;
              const available = commAvail?.available ?? (total - taken);
              const fillPct = total > 0 ? Math.round((taken / total) * 100) : 0;
              const isFull = taken >= total;

              return (
                <div
                  key={c.id}
                  className="bg-[#0b0714] border-2 border-white/10 p-5 space-y-3 shadow-[3px_3px_0px_0px_#000000] hover:border-gold/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-heading text-xl text-gold font-bold block">
                        {c.name}
                      </span>
                      <span className="text-xs text-cream/70 font-sans line-clamp-1">
                        {c.fullName}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 border font-bold ${
                        isFull
                          ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                          : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {isFull ? "CAP REACHED" : `${available} LEFT`}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-cream/50">Seats Claimed:</span>
                      <span className="text-cream font-bold">
                        {taken} / {total} ({fillPct}%)
                      </span>
                    </div>

                    <div className="h-2 bg-purple-deep border border-white/10 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isFull ? "bg-rose-500" : "bg-gold"
                        }`}
                        style={{ width: `${Math.min(100, fillPct)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono">
                    <span className="text-cream/40">Fee: ₹1,300</span>
                    <Link
                      href={`/admin/payments?committee=${c.id}`}
                      className="text-gold hover:text-gold-light inline-flex items-center gap-1 font-bold"
                    >
                      View Allocations <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Registrations Table with Search & Fast Filtering */}
        <div className="bg-[#140b24] border-2 border-white/15 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <h2 className="font-heading text-2xl text-cream font-bold">
                Delegate Master Register
              </h2>
              <p className="text-xs text-cream/50 mt-0.5">
                Quick inspection and status overview of delegate submissions
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Event Filter */}
              <div className="flex items-center bg-[#0b0714] border border-white/15 p-1 text-xs font-mono">
                {(["all", "athena-summit", "mun-picnic"] as const).map((filterOpt) => (
                  <button
                    key={filterOpt}
                    onClick={() => setRecentFilter(filterOpt)}
                    className={`px-3 py-1 font-bold uppercase transition-colors ${
                      recentFilter === filterOpt
                        ? "bg-gold text-[#0b0714]"
                        : "text-cream/60 hover:text-cream"
                    }`}
                  >
                    {filterOpt === "all" ? "All" : filterOpt === "athena-summit" ? `Summit (₹${currentSummitFee.toLocaleString("en-IN")})` : "Picnic (₹100)"}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" />
                <input
                  type="text"
                  placeholder="Search delegate, email..."
                  value={recentSearch}
                  onChange={(e) => setRecentSearch(e.target.value)}
                  className="w-full bg-[#0b0714] border border-white/20 pl-9 pr-3 py-1.5 text-xs text-cream font-mono outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-cream/40 font-mono text-xs">
              Loading delegate registry...
            </div>
          ) : filteredRecent.length === 0 ? (
            <div className="text-center py-12 text-cream/40 font-mono text-xs">
              No delegates match the active filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-xs font-sans">
                <thead className="border-b border-white/10 text-[10px] uppercase font-mono font-bold tracking-wider text-cream/50">
                  <tr>
                    <th className="pb-3 pr-4">Delegate Pass ID</th>
                    <th className="pb-3 pr-4">Delegate Name</th>
                    <th className="pb-3 pr-4">Event</th>
                    <th className="pb-3 pr-4">Allocation</th>
                    <th className="pb-3 pr-4">Institution</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Receipt</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-cream/80">
                  {filteredRecent.slice(0, 15).map((reg) => {
                    const isPicnic = reg.eventSlug === "mun-picnic";
                    const comm = getCommitteeById(reg.assignedCommittee ?? "");
                    const portfolioName =
                      comm?.portfolios.find((p) => p.id === reg.assignedPortfolio)?.name ??
                      reg.assignedPortfolio ??
                      "—";

                    return (
                      <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 pr-4 font-mono text-[11px] text-gold font-bold">
                          {reg.id}
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className="font-bold text-cream block">{reg.name}</span>
                          <span className="text-[10px] text-cream/40 font-mono">{reg.email}</span>
                        </td>
                        <td className="py-3.5 pr-4">
                          {isPicnic ? (
                            <span className="inline-block bg-purple-deep border border-gold/30 text-gold px-2 py-0.5 text-[10px] font-mono font-bold">
                              Picnic (₹100)
                            </span>
                          ) : (
                            <span className="inline-block bg-gold/15 border border-gold/30 text-gold px-2 py-0.5 text-[10px] font-mono font-bold">
                              Summit (₹1,300)
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 pr-4">
                          {isPicnic ? (
                            <span className="text-xs text-cream/80 font-mono">Energy Park</span>
                          ) : (
                            <div>
                              <span className="font-bold text-gold text-xs block font-mono">
                                {comm?.name ?? reg.assignedCommittee?.toUpperCase()}
                              </span>
                              <span className="text-[11px] text-cream/60 line-clamp-1">
                                {portfolioName}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 pr-4 text-cream/70 max-w-44 truncate">
                          {reg.institution}
                        </td>
                        <td className="py-3.5 pr-4">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${
                              reg.status === "approved"
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : reg.status === "rejected"
                                ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                                : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                            }`}
                          >
                            {reg.status}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4">
                          {reg.paymentScreenshot || reg.hasScreenshot ? (
                            <Link
                              href={`/admin/payments?search=${encodeURIComponent(reg.id)}`}
                              className="text-gold hover:text-gold-light inline-flex items-center gap-1 font-mono text-[11px]"
                            >
                              <Eye size={12} /> View
                            </Link>
                          ) : (
                            <span className="text-cream/30 font-mono text-[11px]">—</span>
                          )}
                        </td>
                        <td className="py-3.5">
                          <Link
                            href={`/admin/payments?search=${encodeURIComponent(reg.id)}`}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-gold hover:text-gold-light font-bold"
                          >
                            Manage <ArrowRight size={11} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {filteredRecent.length > 15 && (
            <div className="pt-3 border-t border-white/5 text-center">
              <Link
                href="/admin/payments"
                className="text-xs font-mono text-gold hover:text-gold-light font-bold inline-flex items-center gap-1.5"
              >
                <span>View all {filteredRecent.length} delegate records in Payment Manager</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          )}
        </div>

        {/* Donations Log */}
        <div className="bg-[#140b24] border-2 border-white/15 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000] space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="font-heading text-2xl text-cream font-bold">
                Donation & Sponsorship Log
              </h2>
              <p className="text-xs text-cream/50 mt-0.5">
                Community contributions and solidarity pledges logged through the donation portal
              </p>
            </div>
            <span className="font-mono text-xs text-gold border border-gold/30 bg-[#0b0714] px-3 py-1 font-bold">
              {donations.length} Contributions
            </span>
          </div>

          {donations.length === 0 ? (
            <p className="text-xs text-cream/40 font-mono py-6 text-center">
              No donation records logged yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-xs font-sans">
                <thead className="border-b border-white/10 text-[10px] uppercase font-mono font-bold tracking-wider text-cream/50">
                  <tr>
                    <th className="pb-3 pr-4">Donor</th>
                    <th className="pb-3 pr-4">Contact</th>
                    <th className="pb-3 pr-4">Amount</th>
                    <th className="pb-3 pr-4">Transaction Ref</th>
                    <th className="pb-3 pr-4">Message</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-cream/80">
                  {donations.map((d) => (
                    <tr key={d.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 pr-4 font-bold text-cream">{d.donorName}</td>
                      <td className="py-3 pr-4 font-mono text-[11px]">
                        <div>{d.donorEmail}</div>
                        {d.donorPhone && <div className="text-cream/40">{d.donorPhone}</div>}
                      </td>
                      <td className="py-3 pr-4 font-mono text-gold font-bold">
                        ₹{Number(d.amount).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 pr-4 font-mono text-[11px] text-cream/70">
                        {d.transactionRef}
                      </td>
                      <td className="py-3 pr-4 text-cream/60 max-w-56 truncate">
                        {d.message || "—"}
                      </td>
                      <td className="py-3 font-mono text-[11px] text-cream/40 whitespace-nowrap">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
