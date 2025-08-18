# HealthApp (Cloud-Based)
This project is a cloud-first health optimization platform using React Native (frontend), Vercel (serverless backend), and Supabase (database).

## Features
- Secure onboarding/authentication
- Oura API integration
- HealthGPT assistant
- Data upload & tracking
- Inflammation score engine
- Smart supplement tracker
- Meal photo AI analysis
- Adaptive AI health agent
- Progress dashboard
- Inflammation score calculation endpoint

## Deployment
- Frontend: Expo/React Native (deployed via Expo Go or App Store/Play Store)
- Backend: Vercel serverless functions
- Database/Auth: Supabase

Run locally:
```bash
npm install
npm start
```

### Environment Variables

Set the following environment variables for development and deployment:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_API_BASE`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE`
- `OPENAI_API_KEY`
- `OPENAI_MODEL` *(optional)*
- `OURA_CLIENT_ID`
- `OURA_CLIENT_SECRET`
- `OURA_REDIRECT_URI`
- `JWT_SECRET`
- `CRON_SECRET`

### API

- `POST /api/calculate-score` – accepts metrics such as HRV, RHR, sleep score, lab values, and nutrition adherence and returns a 0–100 inflammation score with component breakdown.
- `POST /api/healthgpt/chat` – chat endpoint that references the user's latest stored inflammation score.
