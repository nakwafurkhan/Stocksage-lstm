# 🚀 Deploying StockSage

StockSage has two parts that deploy separately and talk over HTTPS:

| Part | Folder | Host (free tier) |
|---|---|---|
| **Website** (Next.js) | `web/` | **Vercel** |
| **Prediction API** (Python/LSTM) | `prediction-service/` | **Render** (or Railway / Hugging Face Spaces) |

Deploy the **prediction API first**, then the **website** (the site needs the API's URL).

> ⚠️ Educational project — not financial advice.

---

## Part A — Prediction API on Render

The repo includes a **`render.yaml`** blueprint, so this is mostly clicks.

### 1. Train models first (recommended)
Render's free tier shouldn't train on boot (slow, and Yahoo rate-limits cloud IPs). Train locally and commit the results:

```bash
cd prediction-service
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m src.train --all          # trains NIFTY 50; writes models/saved/
```

`models/saved/*` is git-ignored by default. To ship the trained models, force-add them:
```bash
git add -f prediction-service/models/saved/*.pt prediction-service/models/saved/*.pkl prediction-service/models/saved/*_metrics.json
git commit -m "Add trained NIFTY 50 models"
git push
```

### 2. Create the service on Render
1. Go to https://render.com → **New → Blueprint** → connect this repo.
2. Render reads `render.yaml` and proposes the **stocksage-prediction** service. Click **Apply**.
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Root dir: `prediction-service`
3. After it goes live, note the URL, e.g. `https://stocksage-prediction.onrender.com`.
4. Test it: open `https://…onrender.com/health` → should return `{"status":"ok"}`.

> No blueprint? Create a **Web Service** manually, set **Root Directory** to `prediction-service`, and use the build/start commands above.

---

## Part B — Website on Vercel

### 1. Import the repo
1. Go to https://vercel.com → **Add New → Project** → import `Stocksage-lstm`.
2. **Set Root Directory to `web`** (important — the Next app lives there).
3. Framework preset: **Next.js** (auto-detected).

### 2. Add Environment Variables
In the Vercel project → **Settings → Environment Variables**, add:

```
MONGODB_URI                 = your MongoDB Atlas connection string
BETTER_AUTH_SECRET          = a long random string (openssl rand -base64 32)
BETTER_AUTH_URL             = https://YOUR-APP.vercel.app
GROQ_API_KEY                = from console.groq.com
RESEND_API_KEY              = from resend.com
NEXT_PUBLIC_PREDICTION_API_URL = https://stocksage-prediction.onrender.com   (Part A URL)
```

3. Click **Deploy**. You'll get `https://YOUR-APP.vercel.app`.

### 3. Two post-deploy wiring steps
- **Prediction API CORS:** in Render, set the service's `ALLOWED_ORIGINS` env var to
  `https://YOUR-APP.vercel.app` and redeploy.
- **MongoDB access:** Atlas → Network Access already allows `0.0.0.0/0` from setup, so Vercel can connect.

---

## Part C — Scheduled emails (Inngest) in production

The alert checker and daily/weekly digests run via Inngest.

1. Go to https://www.inngest.com → create an app, or use the **Vercel + Inngest integration** (recommended — it auto-syncs).
2. Add the keys to Vercel env vars:
   ```
   INNGEST_EVENT_KEY   = ...
   INNGEST_SIGNING_KEY = ...
   ```
3. In the Inngest dashboard, **sync** your app to `https://YOUR-APP.vercel.app/api/inngest`.
   Inngest will discover `daily-report`, `weekly-report`, and `alert-checker` and run them on schedule.

> Email also needs `RESEND_API_KEY` (Part B). For real "from" addresses, verify a domain in Resend; otherwise it uses the Resend sandbox sender.

---

## Quick checklist

- [ ] Prediction API live on Render; `/health` returns ok
- [ ] Models trained & committed (so forecasts work without on-boot training)
- [ ] Website live on Vercel with all env vars set
- [ ] `BETTER_AUTH_URL` = your Vercel URL
- [ ] `NEXT_PUBLIC_PREDICTION_API_URL` = your Render URL
- [ ] Render `ALLOWED_ORIGINS` = your Vercel URL
- [ ] (Optional) Inngest synced for emails/alerts

## Gotchas

- **Free tiers sleep.** Render's free service spins down when idle; the first forecast after a nap is slow. Upgrade or ping it to keep warm.
- **Yahoo rate limits.** Train locally and commit models; the deployed API then serves from cached models.
- **Forecast says "unavailable".** Check `NEXT_PUBLIC_PREDICTION_API_URL`, that the Render service is up, and that the ticker was trained.
- **Can't sign in.** Confirm `MONGODB_URI` and `BETTER_AUTH_SECRET` are set and the app was redeployed after adding them.
