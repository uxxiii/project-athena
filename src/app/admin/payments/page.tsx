"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  Phone,
  Mail,
  School,
  FileText,
  Search,
} from "lucide-react";
import type { Registration } from "@/lib/types";
import { getCommitteeById } from "@/data/committees";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AdminPaymentsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [eventFilter, setEventFilter] = useState<"all" | "mun-picnic" | "athena-summit">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const ev = urlParams.get("event");
      if (ev === "mun-picnic" || ev === "athena-summit") {
        setEventFilter(ev);
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
        setRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
    let reason = "";
    if (status === "rejected") {
      const inputReason = prompt("Reason for rejection (optional, will be included in email):");
      if (inputReason === null) return; // User cancelled
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
        fetchRegistrations();
        if (selectedRegistration?.id === id) {
          const updated = await res.json();
          setSelectedRegistration(updated.registration);
        }
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating status", err);
    } finally {
      setActionId(null);
    }
  };

  const filteredRegistrations = registrations.filter((r) => {
    if (eventFilter === "mun-picnic" && r.eventSlug !== "mun-picnic") return false;
    if (eventFilter === "athena-summit" && r.eventSlug === "mun-picnic") return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.institution.toLowerCase().includes(q) ||
      (r.foodPreference && r.foodPreference.toLowerCase().includes(q))
    );
  });

  const picnicCount = registrations.filter((r) => r.eventSlug === "mun-picnic").length;
  const summitCount = registrations.filter((r) => r.eventSlug !== "mun-picnic").length;

  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-cream/50 hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to Admin Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-heading text-4xl text-cream">
              Payment <span className="text-gradient-gold">Verification</span>
            </h1>
            <p className="text-sm text-cream/40 mt-1">Review uploaded UPI screenshots, verify payments & trigger passes</p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-2 rounded-lg bg-purple-deep/60 p-1 border border-white/5">
            {(["pending", "approved", "rejected", "all"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                  filter === tab
                    ? "bg-gold text-purple-deep shadow font-semibold"
                    : "text-cream/60 hover:text-cream"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Event Filter & Search Bar Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Event Filter Pills */}
          <div className="flex items-center gap-2 bg-purple-deep/40 p-1 rounded-xl border border-gold/15 text-xs">
            <button
              onClick={() => setEventFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-mono ${
                eventFilter === "all"
                  ? "bg-gold/20 text-gold border border-gold/40 font-semibold"
                  : "text-cream/60 hover:text-cream"
              }`}
            >
              All Events ({registrations.length})
            </button>
            <button
              onClick={() => setEventFilter("mun-picnic")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-mono flex items-center gap-1.5 ${
                eventFilter === "mun-picnic"
                  ? "bg-gold text-purple-deep font-bold"
                  : "text-gold/80 hover:text-gold"
              }`}
            >
              <span>🌳 MUN Picnic ₹100</span>
              <span className="text-[10px] bg-purple-dark/60 px-1.5 py-0.2 rounded font-bold">
                {picnicCount}/100
              </span>
            </button>
            <button
              onClick={() => setEventFilter("athena-summit")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-mono ${
                eventFilter === "athena-summit"
                  ? "bg-gold text-purple-deep font-bold"
                  : "text-cream/60 hover:text-cream"
              }`}
            >
              Athena Summit ({summitCount})
            </button>
          </div>

          {/* Search Bar */}
          <div className="max-w-md w-full sm:w-80 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" />
            <input
              type="text"
              placeholder="Search delegate, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-purple-deep/40 pl-10 pr-4 py-2 text-xs text-cream outline-none focus:border-gold/50"
            />
          </div>
        </div>

        {/* Main Grid: Registrations List + Detail Drawer */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Table / List View */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="glass-card rounded-xl p-12 text-center text-cream/40 flex flex-col items-center">
                <Loader2 size={32} className="animate-spin text-gold mb-3" />
                Loading registrations...
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="glass-card rounded-xl p-12 text-center text-cream/40">
                No registrations found for status &quot;{filter}&quot; in event &quot;{eventFilter}&quot;.
              </div>
            ) : (
              filteredRegistrations.map((reg) => {
                const isSelected = selectedRegistration?.id === reg.id;
                const isPicnic = reg.eventSlug === "mun-picnic";
                const committee = getCommitteeById(reg.assignedCommittee ?? "");
                const portfolioName =
                  committee?.portfolios.find((p) => p.id === reg.assignedPortfolio)?.name ??
                  reg.assignedPortfolio;

                return (
                  <div
                    key={reg.id}
                    className={`glass-card rounded-xl p-5 transition-all duration-200 cursor-pointer ${
                      isSelected ? "border-gold/50 ring-1 ring-gold/30 bg-purple-dark/80" : "hover:border-white/15"
                    }`}
                    onClick={() => setSelectedRegistration(reg)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading text-lg text-cream">{reg.name}</h3>
                          {isPicnic ? (
                            <span className="text-[10px] font-mono uppercase bg-gold/15 text-gold px-2 py-0.5 rounded border border-gold/30 font-bold">
                              🌳 Picnic • ₹100
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono uppercase bg-purple-deep text-cream/60 px-2 py-0.5 rounded border border-white/10">
                              Conference
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-cream/40 flex items-center gap-2 mt-0.5">
                          <Mail size={12} className="text-gold/60" /> {reg.email}
                          <span className="text-white/10">•</span>
                          <Phone size={12} className="text-gold/60" /> {reg.phone}
                        </p>
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

                    {isPicnic ? (
                      <div className="grid sm:grid-cols-2 gap-3 text-xs bg-purple-deep/40 p-3 rounded-lg border border-gold/10 mb-4">
                        <div>
                          <span className="text-cream/40">Event / Venue:</span>{" "}
                          <span className="text-gold font-mono font-medium block">
                            Buddha Smriti Park (4 Oct)
                          </span>
                        </div>
                        <div>
                          <span className="text-cream/40">Potluck / Food:</span>{" "}
                          <span className="text-cream font-medium block truncate">
                            {reg.foodPreference || "Community Potluck"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-3 text-xs bg-purple-deep/40 p-3 rounded-lg border border-white/5 mb-4">
                        <div>
                          <span className="text-cream/35">Committee:</span>{" "}
                          <span className="text-gold font-heading text-sm font-medium">
                            {committee?.name ?? reg.assignedCommittee}
                          </span>
                        </div>
                        <div>
                          <span className="text-cream/35">Portfolio:</span>{" "}
                          <span className="text-cream font-medium">
                            {portfolioName}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 text-xs border-t border-white/5">
                      <span className="text-cream/30 text-[10px]">
                        Submitted: {new Date(reg.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {reg.paymentScreenshot && (
                          <button
                            onClick={() => setPreviewImage(reg.paymentScreenshot || null)}
                            className="inline-flex items-center gap-1 text-gold hover:text-gold-light transition-colors px-2 py-1 rounded bg-gold/10 text-[11px]"
                          >
                            <Eye size={12} /> View Receipt
                          </button>
                        )}

                        {reg.status !== "approved" && (
                          <Button
                            size="sm"
                            disabled={actionId === reg.id}
                            onClick={() => handleUpdateStatus(reg.id, "approved")}
                            className="text-xs py-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-white"
                          >
                            {actionId === reg.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                            Approve
                          </Button>
                        )}

                        {reg.status !== "rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={actionId === reg.id}
                            onClick={() => handleUpdateStatus(reg.id, "rejected")}
                            className="text-xs py-1 px-3 text-red-400 border-red-500/30 hover:bg-red-500/10"
                          >
                            <XCircle size={12} />
                            Reject
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Details Sidebar / Drawer */}
          <div className="space-y-4">
              {selectedRegistration ? (
              <div className="glass-card rounded-xl p-6 sticky top-28 space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <span className="text-[10px] uppercase tracking-wider text-gold">Delegate Details</span>
                  <h3 className="font-heading text-2xl text-cream mt-1">{selectedRegistration.name}</h3>
                  <p className="text-xs text-cream/40">{selectedRegistration.institution} • {selectedRegistration.classYear}</p>
                </div>

                {selectedRegistration.eventSlug === "mun-picnic" ? (
                  <div className="rounded-lg border border-gold/20 bg-purple-deep/60 p-4 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-gold font-mono">
                      🌳 MUN Picnic Entry Pass (₹100)
                    </span>
                    <p className="text-sm font-heading text-gold">
                      Buddha Smriti Park, Patna
                    </p>
                    <div className="text-[11px] text-cream/75 leading-relaxed bg-purple-deep p-2.5 rounded space-y-1">
                      <div>
                        <strong className="text-cream">Potluck Dish / Food:</strong>{" "}
                        <span className="text-gold">{selectedRegistration.foodPreference || "Community Potluck"}</span>
                      </div>
                      <div>
                        <strong className="text-cream">Time:</strong> 12:00 PM – 5:00 PM (4th Oct)
                      </div>
                    </div>
                  </div>
                ) : (() => {
                  const selectedCommittee = getCommitteeById(selectedRegistration.assignedCommittee ?? "");
                  const selectedPortfolioName =
                    selectedCommittee?.portfolios.find(
                      (p) => p.id === selectedRegistration.assignedPortfolio
                    )?.name ?? selectedRegistration.assignedPortfolio;

                  return (
                    <div className="rounded-lg border border-gold/20 bg-purple-deep/60 p-4 space-y-2">
                      <span className="text-[10px] uppercase tracking-wider text-gold/60">Allocation</span>
                      <p className="text-sm font-heading text-gold">
                        {selectedRegistration.assignedCommittee?.toUpperCase()} : {selectedPortfolioName}
                      </p>
                      <p className="text-[11px] text-cream/60 leading-relaxed bg-purple-deep p-2 rounded">
                        {selectedRegistration.assignedAgenda}
                      </p>
                    </div>
                  );
                })()}

                {selectedRegistration.assignedCommittee === "unsc" && selectedRegistration.unscDelegate && (
                  <div className="rounded-lg border border-gold/20 bg-gold/5 p-4 space-y-3">
                    <span className="text-[10px] uppercase tracking-wider text-gold/70">UNSC Companion Profile</span>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-cream/40 block">Delegate Name:</span>
                        <span className="text-cream font-medium">{selectedRegistration.unscDelegate.name}</span>
                      </div>
                      <div>
                        <span className="text-cream/40 block">Email:</span>
                        <span className="text-cream font-medium">{selectedRegistration.unscDelegate.email}</span>
                      </div>
                      <div>
                        <span className="text-cream/40 block">Phone:</span>
                        <span className="text-cream font-medium">{selectedRegistration.unscDelegate.phone}</span>
                      </div>
                      <div>
                        <span className="text-cream/40 block">Institution:</span>
                        <span className="text-cream font-medium">
                          {selectedRegistration.unscDelegate.institution} ({selectedRegistration.unscDelegate.classYear})
                        </span>
                      </div>
                      {Array.isArray(selectedRegistration.unscDelegatePortfolioPreferences) &&
                        selectedRegistration.unscDelegatePortfolioPreferences.some(Boolean) && (
                          <div>
                            <span className="text-cream/40 block">Shared UNSC Portfolio Preferences:</span>
                            <span className="text-gold font-medium">
                              {selectedRegistration.unscDelegatePortfolioPreferences
                                .filter(Boolean)
                                .map((prefId) => {
                                  const committee = getCommitteeById("unsc");
                                  const portfolio = committee?.portfolios.find(
                                    (p: { id: string; name: string }) => p.id === prefId
                                  );
                                  return portfolio?.name ?? prefId;
                                })
                                .join(" → ")}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-cream/70">
                    <Mail size={14} className="text-gold" />
                    <span>{selectedRegistration.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-cream/70">
                    <Phone size={14} className="text-gold" />
                    <span>{selectedRegistration.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-cream/70">
                    <School size={14} className="text-gold" />
                    <span>{selectedRegistration.institution} ({selectedRegistration.classYear})</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-cream/40 block">Summit Experience:</span>
                  <p className="text-cream/70 bg-purple-deep/40 p-3 rounded border border-white/5 leading-relaxed">
                    {selectedRegistration.munExperience}
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-cream/40">Reference:</span>
                  <p className="text-cream/80 font-medium">{selectedRegistration.reference}</p>
                </div>

                {selectedRegistration.paymentScreenshot && (
                  <div className="space-y-2">
                    <span className="text-xs text-cream/40 block">Uploaded Payment Receipt:</span>
                    <div
                      className="relative rounded-lg overflow-hidden border border-white/10 cursor-pointer group"
                      onClick={() => setPreviewImage(selectedRegistration.paymentScreenshot || null)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedRegistration.paymentScreenshot}
                        alt="Receipt"
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-purple-deep/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-xs text-gold flex items-center gap-1 font-medium">
                          <Eye size={14} /> Click to Enlarge
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card rounded-xl p-8 text-center text-cream/40 sticky top-28">
                <FileText size={32} className="mx-auto text-gold/30 mb-3" />
                Select a delegate registration from the list to view detailed profile, experience & payment screenshot.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Screenshot Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-xl border border-gold/30 bg-purple-deep p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="Payment Screenshot Preview"
              className="max-h-[80vh] w-auto object-contain rounded"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 rounded-full bg-purple-deep/80 text-cream p-2 hover:bg-gold hover:text-purple-deep transition-colors"
            >
              <XCircle size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
