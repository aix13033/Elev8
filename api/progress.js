import { getSupabaseClient } from '../lib/withAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const { supabase, user, error } = await getSupabaseClient(req);
  if (error) {
    res.status(401).json({ error });
    return;
  }

  const breakdown = { oura: false, labs: false, survey: false, supp: false, meals: false };

  const { count: ouraCount } = await supabase
    .from('wearable_daily')
    .select('id', { count: 'exact', head: true });
  breakdown.oura = (ouraCount || 0) > 0;

  const { count: labCount } = await supabase.from('labs').select('id', { count: 'exact', head: true });
  breakdown.labs = (labCount || 0) > 0;

  try {
    const { count: surveyCount } = await supabase
      .from('user_profile')
      .select('id', { count: 'exact', head: true });
    breakdown.survey = (surveyCount || 0) > 0;
  } catch (e) {
    breakdown.survey = false;
  }

  try {
    const { count: suppCount } = await supabase
      .from('supp_log')
      .select('id', { count: 'exact', head: true });
    breakdown.supp = (suppCount || 0) > 0;
  } catch (e) {
    breakdown.supp = false;
  }

  const { count: mealCount } = await supabase
    .from('meals')
    .select('id', { count: 'exact', head: true });
  breakdown.meals = (mealCount || 0) > 0;

  const score = Math.round(
    (
      (breakdown.oura ? 0.3 : 0) +
      (breakdown.labs ? 0.2 : 0) +
      (breakdown.survey ? 0.1 : 0) +
      (breakdown.supp ? 0.2 : 0) +
      (breakdown.meals ? 0.2 : 0)
    ) * 100
  );

  await supabase.from('data_progress').upsert({
    user_id: user.id,
    score,
    breakdown,
    updated_at: new Date().toISOString(),
  });

  res.status(200).json({ score, breakdown });
}
