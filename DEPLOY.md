Deploying the Prep platform backend (recommended: Render)

This project uses a Node/Express backend (`server.js`) and a Vite React frontend. GitHub Pages serves only the static frontend; to enable the full app you must deploy the backend separately and set environment variables.

Recommended providers
- Render (easy GitHub integration, persistent services)
- Railway (quick deploy from repo)
- Heroku (simple, Procfile-based)

Quick Render guide (recommended)
1. Create a Render account and connect your GitHub repository.
2. Create a new "Web Service" and choose the `clean-main` branch (or whichever branch you want).
3. Set the build and start commands:
   - Build command: `npm run build`
   - Start command: `npm start`
4. Add environment variables in the Render dashboard (Environment → ENV Vars):
   - `MONGODB_URI` — your MongoDB connection string (e.g. `mongodb://user:pass@host:27017`)
   - `MONGODB_DB_NAME` (optional, default `prep_platform`)
   - `MONGODB_USERS_COLLECTION` (optional, default `users`)
   - `OPENAI_API_KEY` (optional, for AI features)
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, `ADMIN_COLLEGE`, `ADMIN_GRAD_YEAR` (optional)
5. Deploy. Render will build and expose a public URL (e.g. `https://prep-platform.onrender.com`).
6. Update your frontend (GitHub Pages or hosted static site) to point API calls to the Render URL (replace `/api` requests to `https://your-render-url/api` or set an env that the frontend reads).

Railway quick notes
- Create a Railway project → Deploy from GitHub → set `start` to `npm start`.
- Add same environment variables in Railway.

Heroku quick notes
- Create a Heroku app, connect GitHub repo, ensure a `Procfile` is present (`web: node server.js`).
- Set env vars in Heroku settings, then deploy.

Local test
- Copy `.env.example` → `.env` and fill values for local testing.
- Start locally:

```bash
# install deps (if not already)
npm install
# start backend
npm start
# start frontend (in another terminal)
npm run dev
```

If you want, I can:
- Attempt to deploy to Render for you (I’ll need access to a Render account or deployment token), or
- Produce a `render.yaml` manifest to automate the Render creation if you prefer to create the service yourself.

Which of these would you like me to prepare next?
