import { calculateScore } from '../lib/score.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const result = calculateScore(req.body || {});
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'invalid_input' });
  }
}
