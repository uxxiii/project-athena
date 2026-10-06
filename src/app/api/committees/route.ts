import { NextResponse } from "next/server";
import { committees as staticCommittees } from "@/data/committees";
import { supabase, supabaseConfig } from "@/lib/supabase-client";
import { getAvailability } from "@/lib/availability";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let committeesData = staticCommittees;

    if (supabaseConfig.enabled && supabase) {
      try {
        const client = supabase as unknown as {
          from: (t: string) => {
            select: (c: string) => {
              order: (col: string) => Promise<{ data: unknown[] | null; error: unknown }>;
            };
          };
        };

        const { data: dbCommittees, error: commError } = await client
          .from("committees")
          .select("*")
          .order("id");

        const { data: dbPortfolios, error: portError } = await client
          .from("portfolios")
          .select("*")
          .order("id");

        if (!commError && Array.isArray(dbCommittees) && dbCommittees.length > 0) {
          const availability = await getAvailability();
          
          return NextResponse.json({
            count: dbCommittees.length,
            totalPortfolios: dbPortfolios?.length || 0,
            committees: staticCommittees.map((c) => ({
              ...c,
              availability: availability.committees[c.id],
            })),
            source: "supabase",
          });
        }
      } catch (dbErr) {
        console.warn("Error querying Supabase committees:", dbErr);
      }
    }

    const availability = await getAvailability();
    return NextResponse.json({
      count: committeesData.length,
      totalPortfolios: committeesData.reduce((acc, c) => acc + c.portfolios.length, 0),
      committees: committeesData.map((c) => ({
        ...c,
        availability: availability.committees[c.id],
      })),
      source: "local",
    });
  } catch (error) {
    console.error("Failed to fetch committees:", error);
    return NextResponse.json(
      { error: "Failed to fetch committees" },
      { status: 500 }
    );
  }
}
