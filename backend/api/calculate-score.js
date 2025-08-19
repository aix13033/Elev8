import { calculateScore } from '../lib/score.js';
import supabase, { requireUser } from '../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const user = await requireUser(req, res);
  if (!user) return;

  try {
    const result = calculateScore(req.body || {});
    const today = new Date().toISOString().slice(0, 10);
    await supabase
      .from('scores')
      .upsert({ user_id: user.id, date: today, score: result.score, components: result.components }, { onConflict: 'user_id,date' });
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'invalid_input' });
  }
}
