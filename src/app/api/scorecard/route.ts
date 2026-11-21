import { NextResponse } from "next/server";
import { readRegistrations } from "@/lib/storage";
import { committees, getCommitteeById } from "@/data/committees";
import {
  readScorecardState,
  writeScorecardState,
  ADMIN_MASTER_PASSWORD,
  type ScorecardVisibility,
  type ScoreColumn,
} from "@/lib/scorecard-storage";

export const dynamic = "force-dynamic";

export interface DelegateRosterItem {
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

function getPortfolioDisplayName(committeeId: string, portfolioId: string): string {
  const c = getCommitteeById(committeeId);
  const found = c?.portfolios.find((p) => p.id === portfolioId);
  return found?.name ?? portfolioId ?? "Assigned Portfolio";
}

async function getSummitDelegates(): Promise<DelegateRosterItem[]> {
  const all = await readRegistrations({ includeScreenshots: false });
  return all
    .filter(
      (r) =>
        r.eventSlug === "athena-summit" &&
        r.status !== "rejected" &&
        Boolean(r.assignedCommittee)
    )
    .map((r) => {
      const commId = String(r.assignedCommittee || "").toLowerCase().trim();
      const comm = getCommitteeById(commId);
      const portId = String(r.assignedPortfolio || "");
      return {
        id: r.id,
        name: r.name,
        committeeId: commId,
        committeeName: comm?.name ?? commId.toUpperCase(),
        portfolioId: portId,
        portfolioName: getPortfolioDisplayName(commId, portId),
        institution: r.institution,
        classYear: r.classYear,
        phone: r.phone,
        status: r.status,
      };
    });
}

function isAuthorizedChair(
  committeeId: string,
  passcode: string | undefined,
  adminPassword: string | undefined,
  passcodes: Record<string, string>
): boolean {
  if (adminPassword && adminPassword === ADMIN_MASTER_PASSWORD) return true;
  if (!passcode) return false;
  const expected = passcodes[committeeId];
  return (
    Boolean(expected) &&
    passcode.trim().toUpperCase() === expected.trim().toUpperCase()
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") || "public";
    const committeeId = (searchParams.get("committeeId") || "").toLowerCase().trim();
    const passcode = searchParams.get("passcode") || undefined;
    const adminPassword = searchParams.get("adminPassword") || undefined;

    const [state, delegates] = await Promise.all([
      readScorecardState(),
      getSummitDelegates(),
    ]);

    if (mode === "admin") {
      if (adminPassword !== ADMIN_MASTER_PASSWORD) {
        return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
      }
      return NextResponse.json({
        state,
        delegates,
        committees: committees.map((c) => ({
          id: c.id,
          name: c.name,
          fullName: c.fullName,
          maxDelegates: c.maxDelegates,
        })),
      });
    }

    if (mode === "chair") {
      if (!committeeId || !getCommitteeById(committeeId)) {
        return NextResponse.json({ error: "Invalid committee selected" }, { status: 400 });
      }
      if (!isAuthorizedChair(committeeId, passcode, adminPassword, state.passcodes)) {
        return NextResponse.json(
          { error: "Invalid committee passcode. Please verify with the Secretariat." },
          { status: 401 }
        );
      }

      const comm = getCommitteeById(committeeId)!;
      const commDelegates = delegates.filter((d) => d.committeeId === committeeId);
      const sheet = state.committees[committeeId];

      // Filter attendance for this committee's delegates
      const commAttendance: Record<string, (typeof state.attendance)[string]> = {};
      for (const d of commDelegates) {
        if (state.attendance[d.id]) {
          commAttendance[d.id] = state.attendance[d.id];
        }
      }

      return NextResponse.json({
        committee: {
          id: comm.id,
          name: comm.name,
          fullName: comm.fullName,
          agenda: comm.agenda,
        },
        visibility: state.visibility,
        sheet,
        delegates: commDelegates,
        attendance: commAttendance,
        updatedAt: state.updatedAt,
      });
    }

    if (mode === "checkin") {
      return NextResponse.json({
        delegates: delegates.map((d) => ({
          id: d.id,
          name: d.name,
          committeeId: d.committeeId,
          committeeName: d.committeeName,
          portfolioName: d.portfolioName,
          day2Present: Boolean(state.attendance[d.id]?.day2),
          day2Time: state.attendance[d.id]?.day2Time ?? null,
        })),
        committees: committees.map((c) => ({
          id: c.id,
          name: c.name,
        })),
        updatedAt: state.updatedAt,
      });
    }

    // Public Mode
    const attendanceSummary: Record<
      string,
      { total: number; day1Present: number; day2Present: number }
    > = {};

    for (const c of committees) {
      const cDels = delegates.filter((d) => d.committeeId === c.id);
      let d1 = 0;
      let d2 = 0;
      for (const d of cDels) {
        if (state.attendance[d.id]?.day1) d1++;
        if (state.attendance[d.id]?.day2) d2++;
      }
      attendanceSummary[c.id] = {
        total: cDels.length,
        day1Present: d1,
        day2Present: d2,
      };
    }

    if (state.visibility === "private") {
      return NextResponse.json({
        visibility: "private",
        attendanceSummary,
        committees: committees.map((c) => ({
          id: c.id,
          name: c.name,
          fullName: c.fullName,
        })),
        updatedAt: state.updatedAt,
      });
    }

    // If day1_published or final_published, include allowed score data
    const publicCommittees: Record<string, unknown> = {};
    for (const c of committees) {
      const sheet = state.committees[c.id];
      const sanitizedScores: Record<string, unknown> = {};
      for (const [delId, rec] of Object.entries(sheet?.scores || {})) {
        sanitizedScores[delId] = {
          day1: rec.day1 || {},
          day2: state.visibility === "final_published" ? rec.day2 || {} : {},
          remarks: rec.remarks || "",
          award: state.visibility === "final_published" ? rec.award || "" : "",
        };
      }
      publicCommittees[c.id] = {
        committeeId: c.id,
        day1Columns: sheet?.day1Columns || [],
        day2Columns: state.visibility === "final_published" ? sheet?.day2Columns || [] : [],
        scores: sanitizedScores,
        updatedAt: sheet?.updatedAt,
      };
    }

    return NextResponse.json({
      visibility: state.visibility,
      attendanceSummary,
      attendance: state.attendance,
      delegates: delegates.map((d) => ({
        id: d.id,
        name: d.name,
        committeeId: d.committeeId,
        committeeName: d.committeeName,
        portfolioName: d.portfolioName,
        institution: d.institution,
      })),
      committees: publicCommittees,
      committeeMeta: committees.map((c) => ({
        id: c.id,
        name: c.name,
        fullName: c.fullName,
      })),
      updatedAt: state.updatedAt,
    });
  } catch (error) {
    console.error("GET /api/scorecard error:", error);
    return NextResponse.json({ error: "Failed to load scorecard state" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body as { action?: string };

    const state = await readScorecardState();

    if (action === "self_checkin_day2") {
      const delegateId = String(body.delegateId || "").trim();
      if (!delegateId) {
        return NextResponse.json({ error: "Delegate ID is required" }, { status: 400 });
      }
      const existing = state.attendance[delegateId] || { day1: false, day2: false };
      if (!existing.day2) {
        existing.day2 = true;
        existing.day2Time = new Date().toISOString();
        state.attendance[delegateId] = existing;
        await writeScorecardState(state);
      }
      return NextResponse.json({
        success: true,
        delegateId,
        attendance: existing,
      });
    }

    if (action === "verify_chair") {
      const committeeId = String(body.committeeId || "").toLowerCase().trim();
      const passcode = String(body.passcode || "");
      const ok = isAuthorizedChair(committeeId, passcode, body.adminPassword, state.passcodes);
      if (!ok) {
        return NextResponse.json(
          { error: "Invalid passcode for this committee." },
          { status: 401 }
        );
      }
      return NextResponse.json({ success: true, committeeId });
    }

    if (action === "update_cell") {
      const committeeId = String(body.committeeId || "").toLowerCase().trim();
      if (!isAuthorizedChair(committeeId, body.passcode, body.adminPassword, state.passcodes)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const delegateId = String(body.delegateId || "");
      const day = body.day === "day2" ? "day2" : "day1";
      const colId = String(body.colId || "");
      const value = String(body.value ?? "");

      const sheet = state.committees[committeeId];
      if (!sheet) {
        return NextResponse.json({ error: "Committee not found" }, { status: 404 });
      }
      if (!sheet.scores[delegateId]) {
        sheet.scores[delegateId] = { day1: {}, day2: {} };
      }
      sheet.scores[delegateId][day][colId] = value;
      sheet.scores[delegateId].updatedAt = new Date().toISOString();
      sheet.updatedAt = new Date().toISOString();

      await writeScorecardState(state);
      return NextResponse.json({
        success: true,
        updatedAt: sheet.updatedAt,
        delegateScore: sheet.scores[delegateId],
      });
    }

    if (action === "update_delegate_meta") {
      const committeeId = String(body.committeeId || "").toLowerCase().trim();
      if (!isAuthorizedChair(committeeId, body.passcode, body.adminPassword, state.passcodes)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const delegateId = String(body.delegateId || "");
      const sheet = state.committees[committeeId];
      if (!sheet) {
        return NextResponse.json({ error: "Committee not found" }, { status: 404 });
      }
      if (!sheet.scores[delegateId]) {
        sheet.scores[delegateId] = { day1: {}, day2: {} };
      }
      if (body.remarks !== undefined) {
        sheet.scores[delegateId].remarks = String(body.remarks);
      }
      if (body.award !== undefined) {
        sheet.scores[delegateId].award = String(body.award);
      }
      sheet.scores[delegateId].updatedAt = new Date().toISOString();
      sheet.updatedAt = new Date().toISOString();

      await writeScorecardState(state);
      return NextResponse.json({
        success: true,
        updatedAt: sheet.updatedAt,
        delegateScore: sheet.scores[delegateId],
      });
    }

    if (action === "update_columns") {
      const committeeId = String(body.committeeId || "").toLowerCase().trim();
      if (!isAuthorizedChair(committeeId, body.passcode, body.adminPassword, state.passcodes)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const day = body.day === "day2" ? "day2" : "day1";
      const columns = Array.isArray(body.columns) ? (body.columns as ScoreColumn[]) : [];
      if (columns.length === 0) {
        return NextResponse.json(
          { error: "At least one scoring column is required" },
          { status: 400 }
        );
      }

      const sheet = state.committees[committeeId];
      if (!sheet) {
        return NextResponse.json({ error: "Committee not found" }, { status: 404 });
      }

      const cleanCols = columns.map((c, idx) => ({
        id: String(c.id || `col-${idx + 1}`),
        label: String(c.label ?? `Column ${idx + 1}`),
      }));

      if (day === "day2") {
        sheet.day2Columns = cleanCols;
      } else {
        sheet.day1Columns = cleanCols;
      }
      sheet.updatedAt = new Date().toISOString();

      await writeScorecardState(state);
      return NextResponse.json({
        success: true,
        sheet,
      });
    }

    // Admin-only actions below
    if (body.adminPassword !== ADMIN_MASTER_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized admin action" }, { status: 401 });
    }

    if (action === "update_attendance") {
      const delegateId = String(body.delegateId || "");
      const day = body.day === "day2" ? "day2" : "day1";
      const present = Boolean(body.present);
      const existing = state.attendance[delegateId] || { day1: false, day2: false };
      const nowIso = new Date().toISOString();

      if (day === "day2") {
        existing.day2 = present;
        existing.day2Time = present ? nowIso : undefined;
      } else {
        existing.day1 = present;
        existing.day1Time = present ? nowIso : undefined;
      }
      state.attendance[delegateId] = existing;

      await writeScorecardState(state);
      return NextResponse.json({
        success: true,
        delegateId,
        attendance: existing,
      });
    }

    if (action === "bulk_attendance") {
      const delegateIds = Array.isArray(body.delegateIds) ? (body.delegateIds as string[]) : [];
      const day = body.day === "day2" ? "day2" : "day1";
      const present = Boolean(body.present);
      const nowIso = new Date().toISOString();

      for (const delId of delegateIds) {
        const existing = state.attendance[delId] || { day1: false, day2: false };
        if (day === "day2") {
          existing.day2 = present;
          existing.day2Time = present ? nowIso : undefined;
        } else {
          existing.day1 = present;
          existing.day1Time = present ? nowIso : undefined;
        }
        state.attendance[delId] = existing;
      }

      await writeScorecardState(state);
      return NextResponse.json({
        success: true,
        attendance: state.attendance,
      });
    }

    if (action === "update_visibility") {
      const vis = body.visibility as ScorecardVisibility;
      if (!["private", "day1_published", "final_published"].includes(vis)) {
        return NextResponse.json({ error: "Invalid visibility mode" }, { status: 400 });
      }
      state.visibility = vis;
      await writeScorecardState(state);
      return NextResponse.json({
        success: true,
        visibility: state.visibility,
      });
    }

    if (action === "update_passcode") {
      const committeeId = String(body.committeeId || "").toLowerCase().trim();
      const newPasscode = String(body.newPasscode || "").trim();
      if (!committeeId || !newPasscode) {
        return NextResponse.json({ error: "Committee and passcode required" }, { status: 400 });
      }
      state.passcodes[committeeId] = newPasscode;
      await writeScorecardState(state);
      return NextResponse.json({
        success: true,
        passcodes: state.passcodes,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/scorecard error:", error);
    return NextResponse.json({ error: "Failed to update scorecard" }, { status: 500 });
  }
}
