
import { createClient } from "@supabase/supabase-js";
export const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } });
export async function getUserIdFromAuth(header){ if(!header) return null; const token = header.replace(/^Bearer\s+/i,""); const { data } = await supabaseAdmin.auth.getUser(token); return data?.user?.id || null; }
