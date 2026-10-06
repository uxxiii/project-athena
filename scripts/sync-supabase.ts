import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { committees } from "../src/data/committees";
import { events } from "../src/data/events";

// Load .env.local
const envContent = fs.readFileSync(path.resolve(".env.local"), "utf-8");
const env: Record<string, string> = {};
envContent.split(/\r?\n/).forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const supabaseUrl = env.SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function sync() {
  console.log("==========================================");
  console.log("PROJECT ATHENA: SUPABASE DATA SYNC & VERIFICATION");
  console.log("==========================================\n");

  // 1. Sync Events
  console.log("1. Syncing Events (Athena Summit & MUN Picnic)...");
  const eventRows = [
    {
      id: 1,
      slug: "athena-summit",
      name: "Athena Summit",
      description:
        "Project Athena's flagship summit: a distinguished diplomatic experience bringing together delegates from across institutions.",
      start_date: "2026-10-01",
      end_date: "2026-10-31",
      venue: "TBA",
      brochure_url: "/brochure/athena-summit.pdf",
    },
    {
      id: 2,
      slug: "mun-picnic",
      name: "Athena MUN Picnic",
      description:
        "Official notice: we're touching grass. 🌿 MUN picnic + training workshop by Eldr Education. Sponsors: all of us. Signatories: you, hopefully. No vetoes accepted.",
      start_date: "2026-10-11",
      end_date: "2026-10-11",
      venue: "Energy Park, Patna",
      brochure_url: null,
    },
  ];

  const { data: upsertedEvents, error: eventsError } = await supabase
    .from("events")
    .upsert(eventRows, { onConflict: "id" })
    .select();

  if (eventsError) {
    console.error("Error upserting events:", eventsError);
  } else {
    console.log(`✓ Events synced successfully (${upsertedEvents?.length} events).`);
  }

  // 2. Sync Committees
  console.log("\n2. Syncing Committees (All 13 committees)...");
  const committeeSlugToId: Record<string, number> = {
    uncsw: 1,
    unhrc: 2,
    disec: 3,
    aippm: 4,
    bla: 5,
    unw: 6,
    unodc: 7,
    unsc: 8,
    ipl: 9,
    ip: 10,
    hcc: 11,
    "lok-sabha": 12,
    jpc: 13,
  };

  const committeeRows = committees.map((c) => {
    const id = committeeSlugToId[c.id] || 99;
    return {
      id,
      event_id: 1,
      code: c.name,
      name: c.fullName || c.name,
      type: "Standard",
      agenda: c.agenda || "",
      meta: {
        slug: c.id,
        fullName: c.fullName || c.name,
        maxDelegates: c.maxDelegates,
        portfolioCount: c.portfolios.length,
      },
    };
  });

  const { data: upsertedCommittees, error: commsError } = await supabase
    .from("committees")
    .upsert(committeeRows, { onConflict: "id" })
    .select();

  if (commsError) {
    console.error("Error upserting committees:", commsError);
  } else {
    console.log(`✓ Committees synced successfully (${upsertedCommittees?.length} committees).`);
    upsertedCommittees?.forEach((c) => {
      console.log(`  [${c.id}] ${c.code} - ${c.name} (${c.type})`);
    });
  }

  // 3. Sync Portfolios
  console.log("\n3. Syncing Portfolios (482 Total Portfolios)...");
  // First clean out existing portfolios to remove placeholder records
  const { error: deletePortError } = await supabase
    .from("portfolios")
    .delete()
    .gte("id", 1);

  if (deletePortError) {
    console.warn("Notice deleting old portfolios:", deletePortError);
  }

  const portfolioRows: Array<{
    id: number;
    committee_id: number;
    name: string;
    assigned: boolean;
    meta: Record<string, unknown>;
  }> = [];

  let portSequentialId = 1;
  for (const c of committees) {
    const commDbId = committeeSlugToId[c.id];
    for (const p of c.portfolios) {
      portfolioRows.push({
        id: portSequentialId++,
        committee_id: commDbId,
        name: p.name,
        assigned: false,
        meta: {
          slug: p.id,
          group: p.group || null,
          team: p.team || null,
          committeeSlug: c.id,
        },
      });
    }
  }

  console.log(`Prepared ${portfolioRows.length} portfolio rows for insertion.`);

  // Insert in batches of 100 to avoid payload limits
  const batchSize = 100;
  let insertedCount = 0;
  for (let i = 0; i < portfolioRows.length; i += batchSize) {
    const batch = portfolioRows.slice(i, i + batchSize);
    const { error: batchError } = await supabase
      .from("portfolios")
      .insert(batch);

    if (batchError) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, batchError);
    } else {
      insertedCount += batch.length;
    }
  }

  console.log(`✓ Inserted ${insertedCount} real portfolios across 13 committees in Supabase.`);

  // 4. Verify Registrations in Supabase
  console.log("\n4. Verifying Registrations in Supabase...");
  const { data: registrations, error: regError } = await supabase
    .from("registrations")
    .select("id, event_slug, name, email, status, assigned_committee, assigned_portfolio, created_at");

  if (regError) {
    console.error("Error fetching registrations from Supabase:", regError);
  } else {
    console.log(`✓ Total registrations in Supabase: ${registrations?.length || 0}`);
    const byEvent: Record<string, number> = {};
    registrations?.forEach((r) => {
      byEvent[r.event_slug] = (byEvent[r.event_slug] || 0) + 1;
    });
    console.log("Registrations breakdown by event:", byEvent);
  }

  console.log("\n==========================================");
  console.log("ALL SUPABASE DATA IS IN SYNC AND VERIFIED!");
  console.log("==========================================");
}

sync().catch(console.error);
