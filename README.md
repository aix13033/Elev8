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

The application uses the following environment variables:

- `EXPO_PUBLIC_SUPABASE_URL`: Public URL of your Supabase instance for the client
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Anonymous public API key for the Supabase project
- `SUPABASE_URL`: Server-side Supabase instance URL
- `SUPABASE_SERVICE_ROLE`: Service role key for privileged Supabase access on the server
- `OPENAI_API_KEY`: API key used to authenticate with OpenAI services
- `OPENAI_MODEL`: *(Optional)* model name to override the default OpenAI model
 
### API

- `POST /api/calculate-score` – accepts metrics such as HRV, RHR, sleep score, lab values, and nutrition adherence and returns a 0–100 inflammation score with component breakdown.
