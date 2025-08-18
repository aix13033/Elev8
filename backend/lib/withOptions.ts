
import { preflight } from "./response.js";
export default (handler) => async (req) => req.method === "OPTIONS" ? preflight() : handler(req);
