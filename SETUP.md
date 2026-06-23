# 🛠️ Setup & Accounts Guide (Phase 0)

This guide gets your machine ready and walks you through creating the **free
accounts and API keys** StockSage uses. You don't need them all at once — the
table shows which phase each one is for. Take it one step at a time. 🙂

> 🔒 **Never commit secrets.** All keys go in `.env` files, which are git-ignored.
> Never paste real keys into chat, screenshots, or commits.

---

## 1. Install the basics (do this first)

| Tool | Why | Check it's installed |
|---|---|---|
| **Node.js 18+** | Runs the website | `node -v` |
| **Python 3.10+** | Runs the LSTM service | `python --version` |
| **Git** | Version control | `git --version` |
| A code editor | Editing code (VS Code recommended) | — |

- Node.js: https://nodejs.org (pick the **LTS** version)
- Python: https://www.python.org/downloads
- Git: https://git-scm.com/downloads

Then clone your repo:

```bash
git clone https://github.com/nakwafurkhan/Stocksage-lstm.git
cd Stocksage-lstm
```

---

## 2. Accounts & keys checklist

| # | Service | What it's for | Needed by | Cost |
|---|---|---|---|---|
| 1 | **GitHub** | Stores the code (you have it ✅) | now | Free |
| 2 | **MongoDB Atlas** | User accounts, watchlist, portfolio | Phase 3 | Free (M0) |
| 3 | **Auth secret** | Signs login sessions — just a random string, no account | login | Free |
| 4 | **Groq** | AI insights, news summaries, chatbot | Phase 6 | Free |
| 5 | **Resend** | Sends alert & report emails | Phase 7 | Free tier |
| 6 | **Vercel** | Hosts the website (live URL) | Phase 8 | Free (Hobby) |
| 7 | **Render** or **Hugging Face Spaces** | Hosts the Python LSTM API | Phase 8 | Free tier |

You can set them up as we reach each phase — no rush.

---

## 3. Step-by-step

### 2 · MongoDB Atlas (database)
1. Sign up at https://www.mongodb.com/cloud/atlas/register
2. Create a **free M0 cluster** (any cloud/region near you).
3. **Database Access → Add New Database User** (username + password). Save these.
4. **Network Access → Add IP Address → Allow access from anywhere** (`0.0.0.0/0`) for development.
5. **Connect → Drivers** → copy the **connection string** (looks like
   `mongodb+srv://user:pass@cluster.xxxx.mongodb.net/stocksage`).
   → this becomes `MONGODB_URI`.

### 3 · Auth secret (no account needed)
Login uses **email + password**, with users stored in your MongoDB — so there's
no third-party OAuth to set up. You just need one random secret to sign sessions:
```bash
openssl rand -base64 32
```
Put the output in `BETTER_AUTH_SECRET`.

### 4 · Groq (AI)
1. Sign up at https://console.groq.com
2. **API Keys → Create API Key** → copy it (starts with `gsk_`). → `GROQ_API_KEY`.
   Groq offers fast, free LLM inference (Llama 3.3 and more).

### 5 · Resend (email)
1. Sign up at https://resend.com
2. **API Keys → Create** → copy it. → `RESEND_API_KEY`.
3. For testing you can send from Resend's `onboarding@resend.dev`; for production,
   verify your own domain.

### 6 · Vercel (website hosting) — Phase 8
1. Sign up at https://vercel.com with your **GitHub** account.
2. We'll import the repo and set environment variables when we deploy.

### 7 · Render / Hugging Face (Python API hosting) — Phase 8
1. Render: https://render.com — sign up with GitHub. (Or Hugging Face Spaces.)
2. We'll deploy `prediction-service/` here and point the website at its URL.

---

## 4. Where each key lives (environment variables)

The website (`web/.env.local`):

```bash
# Database
MONGODB_URI=

# Auth (Better Auth — email + password)
BETTER_AUTH_SECRET=        # any long random string
BETTER_AUTH_URL=http://localhost:3000

# AI
GROQ_API_KEY=

# Email (Phase 7)
RESEND_API_KEY=

# Link to the Python prediction API
NEXT_PUBLIC_PREDICTION_API_URL=http://localhost:8000
```

The prediction service (`prediction-service/.env`):

```bash
ALLOWED_ORIGINS=http://localhost:3000
PORT=8000
```

> Tip: generate `BETTER_AUTH_SECRET` with: `openssl rand -base64 32`

---

## 5. What's next

Phase 1 adds the **LSTM prediction service**. You don't need any of the keys
above to run it — only Python. We'll guide MongoDB setup when we
reach Phase 3. ✅
