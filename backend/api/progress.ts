
import withAuth from "../lib/withAuth.js";
import withOptions from "../lib/withOptions.js";
import { supabaseAdmin } from "../lib/supabase.js";
import { ok, bad, boom } from "../lib/response.js";

export default withOptions(withAuth(async ({ userId, req }) => {
  try {
    if (req.method !== "POST") return bad("Method not allowed", 405);
    const [wd, labs, meals] = await Promise.all([
      supabaseAdmin.from("wearable_daily").select("id").eq("user_id", userId).limit(1),
      supabaseAdmin.from("labs").select("id").eq("user_id", userId).limit(1),
      supabaseAdmin.from("meals").select("id").eq("user_id", userId).limit(1)
    ]);
    const breakdown = { oura: wd.data?.length ? 100 : 0, labs: labs.data?.length ? 100 : 0, meals: meals.data?.length ? 100 : 0, survey: 100, supplements: 0 };
    const score = Math.round(breakdown.oura*0.3 + breakdown.labs*0.2 + breakdown.meals*0.2 + breakdown.survey*0.3);
    await supabaseAdmin.from("data_progress").upsert({ user_id: userId, score, breakdown, updated_at: new Date().toISOString() });
    return ok({ score, breakdown });
  } catch (e) { return boom(e); }
}));
