
import withAuth from "../../lib/withAuth.js";
import withOptions from "../../lib/withOptions.js";
import { openai, OPENAI_MODEL } from "../../lib/openai.js";
import { ok, bad, boom } from "../../lib/response.js";

export default withOptions(withAuth(async ({ req }) => {
  try {
    if (req.method !== "POST") return bad("Method not allowed", 405);
    const { message } = await req.json();
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: "You are HealthGPT, a helpful wellness guide. Keep it non-medical." },
        { role: "user", content: message || "" }
      ],
      temperature: 0.3
    });
    return ok({ answer: completion.choices?.[0]?.message?.content || "" });
  } catch (e) { return boom(e); }
}));
