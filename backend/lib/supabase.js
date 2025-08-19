import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default supabase;

export async function requireUser(req, res) {
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(401).json({ error: 'missing_auth' });
    return null;
  }
  const token = auth.replace('Bearer ', '').trim();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    res.status(401).json({ error: 'invalid_token' });
    return null;
  }
  return user;
}
