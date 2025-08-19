# HealthApp (Cloud-Based)
This project is a cloud-first health optimization platform using React Native (frontend),
Vercel (serverless backend), and Supabase (database).

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

- `EXPO_PUBLIC_SUPABASE_URL`: Public URL of your Supabase instance for the Expo app
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Anonymous public API key for the Supabase project
- `EXPO_PUBLIC_API_BASE`: Base URL for backend API calls from the app
- `SUPABASE_URL`: Server-side Supabase instance URL
- `SUPABASE_ANON_KEY`: Anonymous API key for server-side operations
- `SUPABASE_SERVICE_ROLE`: Service role key for privileged Supabase access
- `OPENAI_API_KEY`: API key used to authenticate with OpenAI services
- `OPENAI_MODEL`: *(Optional)* model name to override the default OpenAI model
- `OURA_CLIENT_ID`: Oura OAuth client ID
- `OURA_CLIENT_SECRET`: Oura OAuth client secret
- `OURA_REDIRECT_URI`: Redirect URI for the Oura OAuth callback
- `JWT_SECRET`: Secret used to sign and verify JWT state parameters
- `CRON_SECRET`: Secret used to authenticate scheduled cron calls
 
### API

- `POST /api/calculate-score` – accepts metrics such as HRV, RHR, sleep score, lab values, and nutrition adherence and returns a 0–100 inflammation score with component breakdown.
- `POST /api/healthgpt/chat` – chat endpoint that references the user's latest stored inflammation score.
- `GET /api/oura-metrics` – returns latest wearable metrics (HRV, resting heart rate, sleep score, steps) used by the dashboard.
