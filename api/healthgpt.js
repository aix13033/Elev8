import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { message } = req.body;
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "You are HealthGPT, a personal health assistant." },
                 { role: "user", content: message }]
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } else {
    res.status(405).end();
  }
}
