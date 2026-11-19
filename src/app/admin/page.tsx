"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
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
  LayoutDashboard,
  UserCheck,
  FileSpreadsheet,
  KeyRound,
  Heart,
  LogOut,
  Menu,
  X,
  Trophy,
  Globe,
} from "lucide-react";
import type { Registration, AvailabilitySnapshot } from "@/lib/types";
import { committees, getCommitteeById } from "@/data/committees";
import {
  getCurrentRegistrationFee,
  isChildrensDaySaleActive,
  isChildrensDaySaleRecord,
  getRegistrationFeeForRecord,
  isSpecialEarlyBirdRegistration,
} from "@/lib/diwali";
import { AdminScorecardHub } from "@/components/admin/AdminScorecardHub";

const ADMIN_PASSWORD = "athena-portal";

type AdminSection =
  | "overview"
  | "attendance"
  | "scoring"
  | "passcodes"
  | "registry"
  | "donations";

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
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
  const isChildrensSale = isChildrensDaySaleActive();

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
      const isEarlyBird =
        (index < 75 && feeByRecord === 1000) ||
        isSpecialEarlyBirdRegistration(r.id, r.name);
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

  const totalSummitCapacity = 280;

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
    link.setAttribute(
      "download",
      `athena_delegates_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navItems: Array<{
    id: AdminSection;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    { id: "overview", label: "Overview & KPIs", icon: LayoutDashboard },
    { id: "attendance", label: "Gate Attendance", icon: UserCheck, badge: "Live" },
    { id: "scoring", label: "Live Chair Scoring", icon: FileSpreadsheet, badge: "Sync" },
    { id: "passcodes", label: "Chair Passcodes", icon: KeyRound },
    {
      id: "registry",
      label: "Delegate Registry",
      icon: Users,
      badge: String(registrations.length),
    },
    {
      id: "donations",
      label: "Donations Log",
      icon: Heart,
      badge: String(donations.length),
    },
  ];

  // ============================================================================
  // ADMIN LOGIN GATE (Full-Screen, No Web Navbar)
  // ============================================================================
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center neo-grid-bg bg-[#0b0714] px-4 py-12">
        <div className="mx-auto max-w-md w-full">
          <div className="bg-[#140b24] border-2 border-gold/50 p-8 sm:p-10 shadow-[8px_8px_0px_0px_#000000] relative">
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center bg-gold/15 border-2 border-gold text-gold mb-3 shadow-[3px_3px_0px_0px_#000]">
                <Shield size={30} className="text-gold" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-mono font-bold">
                Project Athena Secretariat OS
              </span>
              <h1 className="font-heading text-3xl text-cream font-black uppercase mt-1">
                Executive Portal
              </h1>
              <p className="text-xs text-cream/60 mt-1">
                Enter your administrative key to unlock attendance, live scoring, and payment controls.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gold font-mono font-bold mb-2">
                  Secretariat Password
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
                <div className="text-xs text-rose-300 font-mono bg-rose-500/15 p-2.5 border border-rose-500/40">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gold py-3.5 text-sm font-black uppercase tracking-wider text-[#0b0714] border-2 border-black hover:bg-gold-light transition-all shadow-[4px_4px_0px_0px_#000000] cursor-pointer"
              >
                Unlock Secretariat Terminal →
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <Link
                href="/"
                className="text-xs font-mono text-cream/50 hover:text-gold transition-colors"
              >
                ← Return to Project Athena Main Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // FULL-PAGE ADMIN WORKSPACE WITH LEFT SIDEBAR
  // ============================================================================
  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#120a1f] border-r-2 border-white/15 text-cream">
      {/* Brand Header */}
      <div className="p-5 border-b-2 border-white/15 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.jpeg"
            alt="Project Athena"
            width={38}
            height={38}
            className="border-2 border-gold shadow-[2px_2px_0px_0px_#000]"
          />
          <div>
            <span className="font-heading text-base font-black uppercase tracking-tight text-cream block leading-none">
              Project <span className="text-gold">Athena</span>
            </span>
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-gold/80 font-bold block mt-1">
              Secretariat Admin
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden p-1.5 text-cream/70 hover:text-gold border border-white/15"
        >
          <X size={16} />
        </button>
      </div>

      {/* Primary Sidebar Navigation */}
      <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
        <div className="px-2.5 pb-1.5 text-[10px] font-mono uppercase tracking-widest text-cream/40 font-bold">
          Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveSection(item.id);
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider border-2 transition-all cursor-pointer ${
                isActive
                  ? "bg-gold text-[#0b0714] border-black font-black shadow-[3px_3px_0px_0px_#000000]"
                  : "bg-[#140b24] text-cream/80 border-transparent hover:border-white/20 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={15} className={isActive ? "text-[#0b0714]" : "text-gold"} />
                <span>{item.label}</span>
              </span>
              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-black border ${
                    isActive
                      ? "bg-[#0b0714] text-gold border-black"
                      : "bg-[#0b0714] text-gold border-gold/30"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Dedicated Payment Verification Page Link */}
        <div className="pt-3 mt-3 border-t border-white/10 space-y-1.5">
          <div className="px-2.5 pb-1 text-[10px] font-mono uppercase tracking-widest text-cream/40 font-bold">
            Finance &amp; Portals
          </div>

          <Link
            href="/admin/payments"
            className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider border-2 border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all"
          >
            <span className="flex items-center gap-2.5">
              <CreditCard size={15} />
              <span>Verify Payments</span>
            </span>
            <span className="px-1.5 py-0.5 text-[10px] bg-amber-400 text-[#0b0714] font-black border border-black">
              {pendingCount}
            </span>
          </Link>

          <Link
            href="/chair-scoring"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-mono text-cream/75 hover:text-gold hover:bg-white/5 border border-white/10 transition-colors"
          >
            <span className="flex items-center gap-2">
              <FileSpreadsheet size={14} className="text-gold" />
              <span>Chair Scoring Portal</span>
            </span>
            <ExternalLink size={11} />
          </Link>

          <Link
            href="/scorecard"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-mono text-cream/75 hover:text-emerald-300 hover:bg-white/5 border border-white/10 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Trophy size={14} className="text-emerald-400" />
              <span>Public Scorecard</span>
            </span>
            <ExternalLink size={11} />
          </Link>

          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-mono text-cream/60 hover:text-cream hover:bg-white/5 border border-white/10 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Globe size={14} className="text-cream/60" />
              <span>Main Website</span>
            </span>
            <ExternalLink size={11} />
          </Link>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3.5 border-t-2 border-white/15 space-y-2 bg-[#0e071a]">
        <div className="flex items-center justify-between px-2 text-[10px] font-mono text-emerald-400 font-bold">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            SUPABASE LIVE SYNC
          </span>
          <span className="text-gold">CAP {totalSummitCapacity}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setAuthenticated(false);
            setPassword("");
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold uppercase cursor-pointer transition-colors"
        >
          <LogOut size={13} />
          <span>Lock Admin Panel</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#0b0714] text-cream neo-grid-bg">
      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="w-72 max-w-[85vw] h-full shadow-2xl">{sidebarContent}</div>
          <div
            className="flex-1 bg-black/75 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
        </div>
      )}

      {/* Full-Page Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Admin Workspace Header Bar */}
        <header className="sticky top-0 z-20 bg-[#120a1f]/95 backdrop-blur-md border-b-2 border-white/15 px-4 sm:px-7 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 bg-[#140b24] border-2 border-white/20 text-gold shadow-[2px_2px_0px_0px_#000]"
              aria-label="Open navigation menu"
            >
              <Menu size={18} />
            </button>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold block">
                Athena Summit 2026 • Secretariat Command Center
              </span>
              <h1 className="font-heading text-lg sm:text-xl font-black uppercase text-cream leading-tight">
                {navItems.find((i) => i.id === activeSection)?.label || "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={exportToCSV}
              className="hidden sm:inline-flex items-center gap-1.5 border-2 border-white/20 bg-[#0b0714] px-3.5 py-2 text-xs font-mono font-bold text-cream hover:border-gold hover:text-gold transition-colors shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 border-2 border-white/20 bg-[#0b0714] px-3 py-2 text-xs font-mono font-bold text-cream hover:border-gold hover:text-gold transition-colors shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw size={13} className={loading ? "animate-spin text-gold" : "text-gold"} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        {/* Active Section Full-Width Canvas */}
        <div className="flex-1 p-4 sm:p-7 space-y-6">
          {/* ================================================================
              VIEW 1: OVERVIEW & KPIs
             ================================================================ */}
          {activeSection === "overview" && (
            <>
              {/* Executive KPI Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                <div className="bg-[#140b24] border-2 border-white/15 p-5 shadow-[4px_4px_0px_0px_#000000]">
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
                    {earlyBirdSummitApproved} Early-Bird (₹1,000) + {childrensDaySummitApproved} Sale (₹1,100) + {regularFeeSummitApproved} Regular (₹1,300) + {picnicApproved} Picnic (₹100)
                  </span>
                </div>

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

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveSection("attendance")}
                      className="px-3.5 py-2 bg-gold text-[#0b0714] border-2 border-black text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                    >
                      Open Gate Attendance →
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection("scoring")}
                      className="px-3.5 py-2 bg-[#0b0714] text-gold border-2 border-gold/50 text-xs font-mono font-bold uppercase cursor-pointer"
                    >
                      Open Live Chair Scoring →
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {committees.map((c) => {
                    const commAvail = availability?.committees[c.id];
                    const taken = commAvail?.taken ?? 0;
                    const total = commAvail?.total ?? c.maxDelegates;
                    const available = commAvail?.available ?? total - taken;
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
                          <span className="text-cream/40">
                            Fee: ₹{currentSummitFee.toLocaleString("en-IN")}
                            {isChildrensSale ? " (Sale)" : ""}
                          </span>
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
            </>
          )}

          {/* ================================================================
              VIEW 2: MORNING GATE ATTENDANCE (Full Page)
             ================================================================ */}
          {activeSection === "attendance" && (
            <AdminScorecardHub forcedTab="attendance" />
          )}

          {/* ================================================================
              VIEW 3: LIVE CHAIR EXCEL SCORING & OVERRIDE (Full Page)
             ================================================================ */}
          {activeSection === "scoring" && (
            <AdminScorecardHub forcedTab="scoring" />
          )}

          {/* ================================================================
              VIEW 4: COMMITTEE CHAIR PASSCODES (Full Page)
             ================================================================ */}
          {activeSection === "passcodes" && (
            <AdminScorecardHub forcedTab="passcodes" />
          )}

          {/* ================================================================
              VIEW 5: DELEGATE MASTER REGISTRY (Full Page)
             ================================================================ */}
          {activeSection === "registry" && (
            <div className="bg-[#140b24] border-2 border-white/15 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000] space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <h2 className="font-heading text-2xl text-cream font-bold">
                    Delegate Master Register ({filteredRecent.length})
                  </h2>
                  <p className="text-xs text-cream/50 mt-0.5">
                    Complete searchable registry of all delegate submissions across events
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center bg-[#0b0714] border border-white/15 p-1 text-xs font-mono">
                    {(["all", "athena-summit", "mun-picnic"] as const).map((filterOpt) => (
                      <button
                        key={filterOpt}
                        onClick={() => setRecentFilter(filterOpt)}
                        className={`px-3 py-1 font-bold uppercase transition-colors cursor-pointer ${
                          recentFilter === filterOpt
                            ? "bg-gold text-[#0b0714]"
                            : "text-cream/60 hover:text-cream"
                        }`}
                      >
                        {filterOpt === "all"
                          ? "All"
                          : filterOpt === "athena-summit"
                            ? "Summit"
                            : "Picnic"}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40"
                    />
                    <input
                      type="text"
                      placeholder="Search delegate, email, ID..."
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
                <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
                  <table className="w-full min-w-[850px] text-left text-xs font-sans">
                    <thead className="sticky top-0 bg-[#140b24] border-b border-white/10 text-[10px] uppercase font-mono font-bold tracking-wider text-cream/50">
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
                      {filteredRecent.map((reg) => {
                        const isPicnic = reg.eventSlug === "mun-picnic";
                        const comm = getCommitteeById(reg.assignedCommittee ?? "");
                        const portfolioName =
                          comm?.portfolios.find((p) => p.id === reg.assignedPortfolio)?.name ??
                          reg.assignedPortfolio ??
                          "—";

                        return (
                          <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 pr-4 font-mono text-[11px] text-gold font-bold">
                              {reg.id}
                            </td>
                            <td className="py-3 pr-4">
                              <span className="font-bold text-cream block">{reg.name}</span>
                              <span className="text-[10px] text-cream/40 font-mono">
                                {reg.email}
                              </span>
                            </td>
                            <td className="py-3 pr-4">
                              {isPicnic ? (
                                <span className="inline-block bg-purple-deep border border-gold/30 text-gold px-2 py-0.5 text-[10px] font-mono font-bold">
                                  Picnic (₹100)
                                </span>
                              ) : (
                                <span className="inline-block bg-gold/15 border border-gold/30 text-gold px-2 py-0.5 text-[10px] font-mono font-bold">
                                  Summit
                                </span>
                              )}
                            </td>
                            <td className="py-3 pr-4">
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
                            <td className="py-3 pr-4 text-cream/70 max-w-44 truncate">
                              {reg.institution}
                            </td>
                            <td className="py-3 pr-4">
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
                            <td className="py-3 pr-4">
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
                            <td className="py-3">
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
            </div>
          )}

          {/* ================================================================
              VIEW 6: DONATIONS & FUNDRAISER LOG (Full Page)
             ================================================================ */}
          {activeSection === "donations" && (
            <div className="bg-[#140b24] border-2 border-white/15 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000] space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-heading text-2xl text-cream font-bold">
                    Donation &amp; Sponsorship Log
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
                            {d.donorPhone && (
                              <div className="text-cream/40">{d.donorPhone}</div>
                            )}
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
          )}
        </div>
      </div>
    </div>
  );
}
