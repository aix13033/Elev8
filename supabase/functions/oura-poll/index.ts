import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OURA_TOKEN = Deno.env.get("OURA_API_TOKEN") ?? Deno.env.get("OURA_ACCESS_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  throw new Error("Missing Supabase env vars");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function fetchDailySleep(start: string, end: string) {
  if (!OURA_TOKEN) return [];
  const url = new URL("https://api.ouraring.com/v2/usercollection/daily_sleep");
  url.searchParams.set("start_date", start);
  url.searchParams.set("end_date", end);
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${OURA_TOKEN}` }
  });
  if (!resp.ok) {
    console.error("Oura API error", await resp.text());
    return [];
  }
  const json = await resp.json();
  return json?.data || [];
}

serve(async (req) => {
  try {
    const { user_id, start, end } = await req.json();
    if (!user_id || !start || !end) {
      return new Response("Missing parameters", { status: 400 });
    }

    const sleeps = await fetchDailySleep(start, end);
    for (const s of sleeps) {
      await supabase.from("wearable_daily").upsert({
        user_id,
        date: s.day,
        sleep_score: s.score ?? null,
        payload: s
      }, { onConflict: "user_id,date" });
    }

    return new Response(JSON.stringify({ ok: true, count: sleeps.length }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error(err);
    return new Response("Server error", { status: 500 });
  }
});
