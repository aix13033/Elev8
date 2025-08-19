import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  const token =
    process.env.OURA_API_TOKEN ||
    process.env.OURA_ACCESS_TOKEN ||
    process.env.OURA_TOKEN ||
    process.env.EXPO_PUBLIC_OURA_API_TOKEN ||
    process.env.NEXT_PUBLIC_OURA_API_TOKEN;
  if (!token) {
    res.status(500).json({ error: 'Missing Oura API token' });
    return;
  }

  const now = new Date();
  const { end_date, start_date } = req.query || {};
  const end = end_date || now.toISOString().slice(0, 10);
  const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const start = start_date || startDate.toISOString().slice(0, 10);

  // Heart rate uses datetime params while most other endpoints use dates
  const startDateTime = new Date(`${start}T00:00:00Z`).toISOString();
  const endDateTime = new Date(`${end}T23:59:59Z`).toISOString();

  const endpoints = {
    dailyActivity: { path: '/daily_activity', params: { start_date: start, end_date: end } },
    dailyCardiovascularAge: { path: '/daily_cardiovascular_age', params: { start_date: start, end_date: end } },
    dailyReadiness: { path: '/daily_readiness', params: { start_date: start, end_date: end } },
    dailyResilience: { path: '/daily_resilience', params: { start_date: start, end_date: end } },
    dailySleep: { path: '/daily_sleep', params: { start_date: start, end_date: end } },
    dailySpO2: { path: '/daily_spo2', params: { start_date: start, end_date: end } },
    heartRate: { path: '/heartrate', params: { start_datetime: startDateTime, end_datetime: endDateTime } },
    personalInfo: { path: '/personal_info' },
    restModePeriod: { path: '/rest_mode_period', params: { start_date: start, end_date: end } },
    ringConfiguration: { path: '/ring_configuration' },
    session: { path: '/session', params: { start_date: start, end_date: end } },
    sleep: { path: '/sleep', params: { start_date: start, end_date: end } },
    sleepTime: { path: '/sleep_time', params: { start_date: start, end_date: end } },
    vo2Max: { path: '/vo2_max', params: { start_date: start, end_date: end } },
    workout: { path: '/workout', params: { start_date: start, end_date: end } },
  };

  try {
    const client = axios.create({
      baseURL: 'https://api.ouraring.com/v2/usercollection',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const results = await Promise.all(
      Object.entries(endpoints).map(async ([key, { path, params }]) => {
        try {
          const response = await client.get(path, { params });
          return [key, response.data?.data || response.data];
        } catch (err) {
          console.error(`Failed to fetch ${key}:`, err.message);
          return [key, null];
        }
      })
    );

    const metrics = results.reduce((acc, [key, data]) => {
      acc[key] = data;
      return acc;
    }, {});

    res.status(200).json(metrics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
}
