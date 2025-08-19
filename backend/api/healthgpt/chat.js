import openai, { MODEL } from '../../lib/openai.js';
import supabase, { requireUser } from '../../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const user = await requireUser(req, res);
  if (!user) return;

  const { message } = req.body || {};
  if (!message) {
    res.status(400).json({ error: 'missing_message' });
    return;
  }

  // fetch latest score
  const { data: scoreRow } = await supabase
    .from('scores')
    .select('score, date')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(1)
    .single();

  const systemPrompt = `You are HealthGPT, a personal health assistant. The user's latest inflammation score is ${scoreRow ? scoreRow.score : 'unknown'}.
Provide non-diagnostic, concise guidance.`;

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ]
  });

  res.status(200).json({ reply: completion.choices[0].message.content });
}
