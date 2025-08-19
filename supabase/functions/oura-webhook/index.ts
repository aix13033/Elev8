import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { HmacSha256 } from "https://deno.land/std@0.224.0/hash/sha256.ts";

const SECRET = Deno.env.get("OURA_WEBHOOK_SECRET") || "";
const FUNCTIONS_URL = Deno.env.get("SUPABASE_FUNCTIONS_URL");

async function queuePoll(user_id: string, start: string, end: string) {
  if (!FUNCTIONS_URL) return;
  await fetch(`${FUNCTIONS_URL}/oura-poll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, start, end })
  });
}

function verifySignature(body: string, signature: string | null): boolean {
  if (!SECRET || !signature) return false;
  const hmac = new HmacSha256(SECRET);
  hmac.update(body);
  const digest = "sha256=" + hmac.hex();
  return digest === signature;
}

serve(async (req) => {
  const signature = req.headers.get("x-oura-signature");
  const body = await req.text();
  if (!verifySignature(body, signature)) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(body);
  const userId = event?.user_id;
  const start = event?.start_datetime || event?.data?.start_date;
  const end = event?.end_datetime || event?.data?.end_date || start;

  if (userId && start && end) {
    await queuePoll(userId, start, end);
  }

  return new Response("ok", { status: 200 });
});
