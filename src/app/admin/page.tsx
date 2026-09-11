"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Shield, CreditCard, Mail, Users, CheckCircle, Clock, XCircle, ArrowRight, RefreshCw, Heart } from "lucide-react";
import type { Registration, AvailabilitySnapshot } from "@/lib/types";
import { committees } from "@/data/committees";

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
      setLoginError("Incorrect password. Try again.");
    }
  };

  const pendingCount = registrations.filter((r) => r.status === "pending").length;
  const approvedCount = registrations.filter((r) => r.status === "approved").length;
  const rejectedCount = registrations.filter((r) => r.status === "rejected").length;

  if (!authenticated) {
    return (
      <div className="pt-32 pb-20">
        <div className="mx-auto max-w-md px-6">
          <div className="glass-card rounded-3xl border border-white/10 bg-purple-deep/80 p-10 text-center">
            <div className="mb-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gold/10 text-gold">
                <Shield size={28} className="text-gold" />
              </div>
            </div>
            <h1 className="font-heading text-3xl text-cream mb-2">Admin Login</h1>
            <p className="text-sm text-cream/55 mb-6">
              Enter the admin password to access the Athena Secretariat Dashboard.
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block text-left text-sm text-cream/60">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-navy-light/50 px-4 py-3 text-cream outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                />
              </label>
              {loginError && <p className="text-xs text-red-400">{loginError}</p>}
              <button
                type="submit"
                className="w-full rounded-2xl bg-gold px-4 py-3 text-sm font-semibold text-navy hover:bg-gold-light transition-colors"
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 ring-1 ring-gold/30">
              <Shield size={24} className="text-gold" />
            </div>
            <div>
              <h1 className="font-heading text-4xl text-cream">
                Admin <span className="text-gradient-gold">Dashboard</span>
              </h1>
              <p className="text-xs text-cream/40 mt-0.5">Project Athena Secretariat Management Portal</p>
            </div>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-purple-deep/60 px-4 py-2 text-xs font-medium text-gold hover:bg-gold/10 transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-cream/40 uppercase tracking-wider">Total Registrations</span>
              <Users size={18} className="text-gold" />
            </div>
            <p className="font-heading text-4xl text-cream font-bold">{registrations.length}</p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-amber-400/80 uppercase tracking-wider">Pending Payment</span>
              <Clock size={18} className="text-amber-400" />
            </div>
            <p className="font-heading text-4xl text-amber-400 font-bold">{pendingCount}</p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-emerald-400/80 uppercase tracking-wider">Approved</span>
              <CheckCircle size={18} className="text-emerald-400" />
            </div>
            <p className="font-heading text-4xl text-emerald-400 font-bold">{approvedCount}</p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-red-400/80 uppercase tracking-wider">Rejected</span>
              <XCircle size={18} className="text-red-400" />
            </div>
            <p className="font-heading text-4xl text-red-400 font-bold">{rejectedCount}</p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gold/80 uppercase tracking-wider">Donations Logged</span>
              <Heart size={18} className="text-gold" />
            </div>
            <p className="font-heading text-4xl text-gold font-bold">{donations.length}</p>
          </div>
        </div>

        {/* Action Quick Links */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Link
            href="/admin/payments"
            className="glass-card rounded-xl p-8 hover:border-gold/40 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 ring-1 ring-gold/20 mb-4 group-hover:ring-gold/40">
                <CreditCard size={24} className="text-gold" />
              </div>
              {pendingCount > 0 && (
                <span className="inline-flex items-center rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs text-amber-400 font-medium">
                  {pendingCount} Pending Action
                </span>
              )}
            </div>
            <h3 className="font-heading text-2xl text-cream group-hover:text-gold transition-colors">
              Payment Verification
            </h3>
            <p className="text-sm text-cream/50 mt-2 leading-relaxed">
              Review delegate payment screenshots, verify UPI transactions, and approve or reject submissions with instant email dispatch.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-gold group-hover:translate-x-1 transition-transform">
              Review Payments <ArrowRight size={14} />
            </div>
          </Link>

          <div className="glass-card rounded-xl p-8 relative overflow-hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-light/20 ring-1 ring-purple-light/40 mb-4">
              <Mail size={24} className="text-purple-glow" />
            </div>
            <h3 className="font-heading text-2xl text-cream">
              Email Automation Engine
            </h3>
            <p className="text-sm text-cream/50 mt-2 leading-relaxed">
              Automated dispatch of official committee assignment, portfolio details, Rules of Procedure (RoPs), and study guidelines upon payment approval.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-emerald-400">
              <CheckCircle size={14} /> Active & Automated on Approval
            </div>
          </div>
        </div>

        {/* Donation Records */}
        <div className="glass-card rounded-xl p-6 sm:p-8 mb-12">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h3 className="font-heading text-2xl text-gold">Donation Records</h3>
              <p className="text-xs text-cream/40 mt-1">Live contribution details submitted through the donation page</p>
            </div>
            <span className="shrink-0 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-mono text-gold">
              {donations.length} total
            </span>
          </div>

          {loading ? (
            <p className="text-sm text-cream/40">Loading donation records...</p>
          ) : donations.length === 0 ? (
            <p className="text-sm text-cream/40">No donations have been submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-xs">
                <thead className="border-b border-white/10 text-[10px] uppercase tracking-wider text-cream/40">
                  <tr>
                    <th className="pb-3 pr-4 font-medium">Donor</th>
                    <th className="pb-3 pr-4 font-medium">Contact</th>
                    <th className="pb-3 pr-4 font-medium">Amount</th>
                    <th className="pb-3 pr-4 font-medium">Transaction Ref</th>
                    <th className="pb-3 pr-4 font-medium">Message</th>
                    <th className="pb-3 pr-4 font-medium">Receipt</th>
                    <th className="pb-3 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-cream/70">
                  {donations.map((donation) => (
                    <tr key={donation.id}>
                      <td className="py-4 pr-4 font-medium text-cream">{donation.donorName}</td>
                      <td className="py-4 pr-4 leading-relaxed">
                        <span className="block">{donation.donorEmail}</span>
                        {donation.donorPhone && <span className="text-cream/40">{donation.donorPhone}</span>}
                      </td>
                      <td className="py-4 pr-4 font-mono text-gold">₹{Number(donation.amount).toLocaleString("en-IN")}</td>
                      <td className="py-4 pr-4 font-mono text-cream/80">{donation.transactionRef}</td>
                      <td className="max-w-52 py-4 pr-4 text-cream/50">{donation.message || "—"}</td>
                      <td className="py-4 pr-4">
                        {donation.screenshot ? (
                          <a href={donation.screenshot} target="_blank" rel="noreferrer" className="text-gold hover:text-gold-light">View</a>
                        ) : "—"}
                      </td>
                      <td className="py-4 whitespace-nowrap text-cream/50">{new Date(donation.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Committee Fill Rates */}
        <div className="glass-card rounded-xl p-8 space-y-6">
          <div>
            <h3 className="font-heading text-2xl text-gold">Committee Fill Rates</h3>
            <p className="text-xs text-cream/40 mt-1">Live seat allocation statistics across all 11 committees</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {committees.map((c) => {
              const commAvail = availability?.committees[c.id];
              const taken = commAvail?.taken ?? 0;
              const total = commAvail?.total ?? c.maxDelegates;
              const isUnlimited = c.maxDelegates === Number.MAX_SAFE_INTEGER;
              const fillPct = total > 0 ? Math.round((taken / total) * 100) : 0;

              return (
                <div key={c.id} className="rounded-lg border border-white/5 bg-purple-deep/40 p-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-heading text-gold text-base">{c.name}</span>
                    <span className="text-xs text-cream/50">{isUnlimited ? `${taken} filled` : `${taken}/${total} filled`}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-gold to-gold-light rounded-full transition-all duration-500"
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-cream/30">
                    <span>{c.fullName}</span>
                    <span>{fillPct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
