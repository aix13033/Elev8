import { createClient } from '@supabase/supabase-js';

export async function getSupabaseClient(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    return { error: 'missing_token' };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return { error: 'invalid_token' };
  }
  return { supabase, user: data.user };
}
export default getSupabaseClient;
