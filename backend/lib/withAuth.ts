
import { bad } from "./response.js";
import { getUserIdFromAuth } from "./supabase.js";
export default (fn) => async (req) => { const uid = await getUserIdFromAuth(req.headers.get("authorization")); if(!uid) return bad("Unauthorized", 401); return fn({ req, userId: uid }); };
