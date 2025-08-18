
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, content-type",
  "access-control-allow-methods": "GET,POST,OPTIONS"
};
export const ok = (body, init=200) => new Response(JSON.stringify(body), { status: init, headers: { "content-type":"application/json", ...CORS } });
export const bad = (msg="Bad Request", code=400) => ok({ error: msg }, code);
export const boom = (e) => ok({ error: (e && e.message) || "Server error" }, 500);
export const preflight = () => new Response(null, { status: 204, headers: CORS });
