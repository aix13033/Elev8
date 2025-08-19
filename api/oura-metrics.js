export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }
  // Placeholder metrics normally fetched from Oura API
  const metrics = {
    hrv: 38, // ms
    rhr: 57, // bpm
    sleepScore: 82, // 0-100
    steps: 7500, // steps
  };
  res.status(200).json(metrics);
}
