# 🛠️ Setup & Accounts Guide

This guide gets your machine ready and walks you through creating the **free
accounts and API keys** StockSage uses. You don't need them all at once — the
table shows which feature each one unlocks. Take it one step at a time. 🙂

> 🔒 **Never commit secrets.** All keys go in `.env` files, which are git-ignored.
> Never paste real keys into chat, screenshots, or commits. If a key ever leaks,
> rotate it in that service's dashboard.

---

## 1. Install the basics (do this first)

| Tool | Why | Check it's installed |
|---|---|---|
| **Node.js 18+** | Runs the website | `node -v` |
| **Python 3.10+** | Runs the LSTM service | `python --version` |
| **Git** | Version control | `git --version` |
| A code editor | Editing code (VS Code recommended) | — |

- Node.js: https://nodejs.org (pick the **LTS** version)
- Python: https://www.python.org/downloads (on Windows, tick **"Add Python to PATH"**)
- Git: https://git-scm.com/downloads

Then clone the repo:

```bash
git clone https://github.com/nakwafurkhan/Stocksage-lstm.git
cd Stocksage-lstm
```

> 💡 **Python tip:** always work inside a **virtual environment** so the LSTM
> dependencies don't clash with anything else on your machine:
> ```bash
> cd prediction-service
> python -m venv .venv
> source .venv/bin/activate        # Windows: .venv\Scripts\activate
> ```
> If you use **conda**, deactivate the `base` env first (`conda deactivate`) to
> avoid a slow/confusing mix of conda + venv.

---

## 2. Accounts & keys checklist

| # | Service | What it's for | Unlocks | Cost |
|---|---|---|---|---|
| 1 | **GitHub** | Stores the code (you have it ✅) | now | Free |
| 2 | **MongoDB Atlas** | User accounts, watchlist, portfolio | Sign-in & saved data | Free (M0) |
| 3 | **Auth secret** | Signs login sessions — just a random string, no account | Sign-in | Free |
| 4 | **Groq** | AI insights, news summaries, chatbot | AI features | Free |
| 5 | **Resend** | Sends alert & report emails | Email reports | Free tier |
| 6 | **Vercel** | Hosts the website (live URL) | Deploy | Free (Hobby) |
| 7 | **Render** *(or Hugging Face Spaces)* | Hosts the Python LSTM API | Deploy | Free tier |

You can add them as you go — the app runs locally with just Node + Python; each
key simply switches on the matching feature.

---

## 3. Step-by-step (create the accounts & keys)

### MongoDB Atlas (database)
1. Sign up at https://www.mongodb.com/cloud/atlas/register
2. Create a **free M0 cluster** (any cloud/region near you).
3. **Database Access → Add New Database User** (username + password). Save these.
4. **Network Access → Add IP Address → Allow access from anywhere** (`0.0.0.0/0`)
   for development (this also lets Vercel connect later).
5. **Connect → Drivers** → copy the **connection string** (looks like
   `mongodb+srv://user:pass@cluster.xxxx.mongodb.net/stocksage`).
   → this becomes `MONGODB_URI`. Replace `<password>` with the user password you
   set, and add a database name (e.g. `/stocksage`) before the `?`.

### Auth secret (no account needed)
Login uses **email + password**, with users stored in your MongoDB — so there's
**no third-party OAuth** to set up. You just need one random secret to sign
sessions:
```bash
openssl rand -base64 32
```
Put the output in `BETTER_AUTH_SECRET`. (No `openssl`? Any long random string of
32+ characters works.)

### Groq (AI)
1. Sign up at https://console.groq.com
2. **API Keys → Create API Key** → copy it (starts with `gsk_`). → `GROQ_API_KEY`.
3. Groq offers fast, free LLM inference. The app defaults to
   `llama-3.3-70b-versatile`; override with `GROQ_MODEL` if you like.

### Resend (email)
1. Sign up at https://resend.com
2. **API Keys → Create** → copy it. → `RESEND_API_KEY`.
3. For testing you can send from Resend's `onboarding@resend.dev`; for
   production, **verify your own domain** so emails come from your address.

### Vercel (website hosting) — for deploy
1. Sign up at https://vercel.com with your **GitHub** account.
2. You'll import the repo and set environment variables when you deploy — see
   **[DEPLOY.md](./DEPLOY.md)** (set the project **Root Directory** to `web`).

### Render / Hugging Face (Python API hosting) — for deploy
1. Render: https://render.com — sign up with GitHub. (Or Hugging Face Spaces.)
2. The repo ships a **`render.yaml`** blueprint, so deploying
   `prediction-service/` is mostly clicks — see **[DEPLOY.md](./DEPLOY.md)**.

---

## 4. Where each key lives (environment variables)

**The website** — copy `web/.env.example` to `web/.env.local` and fill in:

```bash
# Database
MONGODB_URI=

# Auth (Better Auth — email + password)
BETTER_AUTH_SECRET=                 # any long random string (openssl rand -base64 32)
BETTER_AUTH_URL=http://localhost:3000

# AI (Groq)
GROQ_API_KEY=
# GROQ_MODEL=llama-3.3-70b-versatile  # optional override

# Email
RESEND_API_KEY=

# Link to the Python prediction API
NEXT_PUBLIC_PREDICTION_API_URL=http://localhost:8000

# Scheduled email jobs (only needed in production)
# INNGEST_EVENT_KEY=
# INNGEST_SIGNING_KEY=
```

**The prediction service** (`prediction-service/.env`):

```bash
ALLOWED_ORIGINS=http://localhost:3000   # your website origin (comma-separate for more)
PORT=8000
```

> Tip: generate `BETTER_AUTH_SECRET` with `openssl rand -base64 32`.
> In production, set `BETTER_AUTH_URL` to your Vercel URL and add it to the
> prediction service's `ALLOWED_ORIGINS`.

---

## 5. First local run (end-to-end smoke test)

Do this once to confirm everything is wired up. Two terminals:

**Terminal A — prediction API**
```bash
cd prediction-service
source .venv/bin/activate                 # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m src.train --ticker RELIANCE.NS   # train one stock (~1–2 min)
uvicorn app.main:app --reload --port 8000
```
Check http://localhost:8000/health → `{"status":"ok"}`, and
http://localhost:8000/docs for the interactive API.

**Terminal B — website**
```bash
cd web
cp .env.example .env.local                 # fill in MONGODB_URI + BETTER_AUTH_SECRET at minimum
npm install
npm run dev
```
Open http://localhost:3000 and click **"Try the demo — no signup"**. Then open a
stock (e.g. Reliance) — if you trained it, the **forecast** will render.

> Want every stock's forecast to work? Train them all once (cached afterwards):
> `python -m src.train --all`. Training all 50 takes a while; do it on a home
> connection to avoid Yahoo rate limits.

---

## 6. Troubleshooting

| Symptom | Fix |
|---|---|
| **Yahoo `YFRateLimitError`** during training | Shared/cloud IPs get throttled. Re-run (the loader retries with backoff and caches to `data/raw/`), or train on a home connection. |
| **numpy fails to build on Python 3.13** | `requirements.txt` pins `numpy>=1.26`. Recreate the venv and `pip install -r requirements.txt` again. |
| **First import of pandas/torch seems frozen** | It's just slow the first time (worse when conda `base` overlaps your venv). Wait ~30s; activate only the `.venv`. |
| **`{"detail":"Not Found"}` from the API** | You hit the root `/`. Use `/health`, `/docs`, `/tickers`, `/history/{ticker}`, or `/predict/{ticker}`. |
| **Forecast shows "unavailable" on the site** | Confirm the API is running, `NEXT_PUBLIC_PREDICTION_API_URL` matches it, and that ticker was trained. |
| **Can't sign in / demo fails** | Set `MONGODB_URI` + `BETTER_AUTH_SECRET`, confirm Atlas Network Access allows your IP, and restart `npm run dev`. |
| **CORS error in the browser console** | Add your website origin to the prediction service's `ALLOWED_ORIGINS` and restart it. |
| **Port already in use** | Run on another port: `--port 8001` (API) or `next dev -p 3001` (web), and update `NEXT_PUBLIC_PREDICTION_API_URL`. |

---

## 7. What's next

- Run everything locally with the **[main README](./README.md)** quick-start.
- Go live with **[DEPLOY.md](./DEPLOY.md)** — Render (prediction API) + Vercel
  (website), plus optional Inngest for scheduled emails. ✅

> ⚠️ Educational tool — **not financial advice.**
