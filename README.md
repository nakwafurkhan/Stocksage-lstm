# 📈 StockSage — Learn & Predict NIFTY 50 Stocks

> A beginner-friendly web app to explore India's **NIFTY 50** stocks with
> interactive candlestick charts, plain-English AI insights, an AI chatbot, a
> watchlist & portfolio tracker, and **LSTM-powered price forecasts** — plus
> daily & weekly email reports on the stocks you care about.

> ⚠️ **Educational tool — not financial advice.** Forecasts are estimates from
> past patterns and can be wrong. Always do your own research. Indian markets
> are regulated by **SEBI**; stocks are listed on the **NSE/BSE**.

---

## ✨ What you can do

- 🔐 **Sign in with email & password** — or try the **demo account**, no signup needed
- 📊 **Interactive candlestick charts** for every NIFTY 50 stock, drawn from our
  own data (tap any chart to open it full-screen)
- 🔎 **Search** the NIFTY 50 and open rich **stock detail pages** (chart, key
  stats, AI news summary, forecast)
- ⭐ **Watchlist** your favourite stocks
- 💼 **Portfolio tracker** — record holdings and see live value & gain/loss
- 🤖 **AI chatbot** that explains the market in plain English
- 🧠 **LSTM forecasts** — where prices *might* head next, with a confidence band
- 📰 **News** for each stock, with AI summaries
- 📧 **Daily & weekly email reports** on the stocks you select

## 🧱 Tech stack

| Layer | What we use |
|---|---|
| **Web framework** | Next.js 15 (App Router) · React 19 · TypeScript |
| **Styling / UI** | Tailwind CSS 3.4 · shadcn-style primitives · lucide-react icons |
| **Animation** | Framer Motion (respects `prefers-reduced-motion`) |
| **Charts** | Dependency-free **SVG** candlesticks & sparklines, drawn from our own `/history` data (no third-party chart embeds) |
| **Auth** | Better Auth — **email + password**, sessions stored in MongoDB |
| **Database** | MongoDB Atlas (users, watchlist, portfolio, alerts) |
| **AI** | **Groq** LLM (`llama-3.3-70b-versatile`) for insights, news summaries & chatbot |
| **Email / jobs** | **Inngest** (cron schedules) + **Resend** (transactional email) |
| **Prediction API** | Python · **FastAPI** · **PyTorch** LSTM · pandas / numpy · yfinance |
| **Hosting** | **Vercel** (website) + **Render** (prediction API) — both free-tier friendly |

## 🏗️ Architecture

A monorepo with two parts that talk over a small HTTPS API:

```
Stocksage-lstm/
├── web/                 # Next.js 15 website (the app users see)
│   • TypeScript, Tailwind, shadcn/ui, Framer Motion
│   • Better Auth (email + password) + MongoDB
│   • Own-data SVG charts • Groq AI • Inngest + Resend email
│
└── prediction-service/  # Python LSTM API (the "prediction brain")
    • PyTorch LSTM trained on ~10 years of NIFTY 50 data
    • FastAPI endpoints the website calls for history & forecasts
```

**How they talk:** the website reads `NEXT_PUBLIC_PREDICTION_API_URL` and calls
the Python service for two things — daily price **history** (used to draw the
charts) and **forecasts**. Everything else (auth, watchlist, portfolio, AI,
email) lives in the Next.js app.

```
Browser ──▶ Next.js (web/) ──▶ MongoDB           (accounts, watchlist, portfolio)
                 │      └────▶ Groq               (AI insights / news / chatbot)
                 │      └────▶ Inngest + Resend   (scheduled email reports)
                 └──────────▶ FastAPI (prediction-service/) ──▶ PyTorch LSTM + cached models
```

## 🧠 How the forecast works

For each stock, the prediction service:

1. Downloads **~10 years** of daily OHLCV from Yahoo Finance (NSE `.NS` tickers).
2. Engineers **12 technical indicators** (SMA, EMA, MACD, RSI, Bollinger Bands,
   ATR, OBV, ROC) → **13 input features** (those + Close).
3. Trains a **2-layer LSTM** (hidden size 128) to predict the next day's close
   from a **60-day window**, with early stopping on a held-out split.
4. Reports accuracy as **MAE in rupees** (average error on unseen data).
5. Rolls the prediction forward **autoregressively** to produce a multi-day
   forecast (default 30 days) with a **widening confidence band** — the band
   grows further out because uncertainty compounds.

> A forecast is a *pattern-based estimate*, not a promise. The confidence band
> is intentionally honest about growing uncertainty. **Not financial advice.**

## 🚀 Quick start (run it locally)

You'll need **Node 18+** and **Python 3.10+**. First time? Read
**[SETUP.md](./SETUP.md)** to create the free accounts & keys.

### 1 · Prediction API (Python)

```bash
cd prediction-service
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Train one stock as a smoke test (~1–2 min), then run the API:
python -m src.train --ticker RELIANCE.NS
uvicorn app.main:app --reload --port 8000
# ✅ check: http://localhost:8000/health  → {"status":"ok"}
# 📚 docs:  http://localhost:8000/docs
```

Train the whole index once (cached afterwards) with
`python -m src.train --all`.

### 2 · Website (Next.js)

```bash
cd web
cp .env.example .env.local      # then fill in the values (see SETUP.md)
npm install
npm run dev
# open http://localhost:3000  →  click "Try the demo — no signup"
```

> The landing page and charts work as soon as the API is up. **Sign-in** needs
> `MONGODB_URI` + `BETTER_AUTH_SECRET`; **AI features** need `GROQ_API_KEY`;
> **email reports** need `RESEND_API_KEY`. You can add keys incrementally.

## 🔧 Environment variables

**`web/.env.local`** (see `web/.env.example`):

| Variable | What it's for | Required for |
|---|---|---|
| `MONGODB_URI` | User accounts, watchlist, portfolio, alerts | Sign-in & saved data |
| `BETTER_AUTH_SECRET` | Signs login sessions (`openssl rand -base64 32`) | Sign-in |
| `BETTER_AUTH_URL` | App base URL (`http://localhost:3000` locally) | Sign-in |
| `GROQ_API_KEY` | Groq LLM key (`gsk_…`) | AI insights / news / chatbot |
| `GROQ_MODEL` | *(optional)* override model — defaults to `llama-3.3-70b-versatile` | — |
| `RESEND_API_KEY` | Sends alert & report emails | Email reports |
| `NEXT_PUBLIC_PREDICTION_API_URL` | URL of the Python service (`http://localhost:8000`) | Charts & forecasts |
| `INNGEST_EVENT_KEY` / `INNGEST_SIGNING_KEY` | Scheduled jobs in production | Prod email schedules |

**`prediction-service/.env`:**

| Variable | What it's for |
|---|---|
| `ALLOWED_ORIGINS` | CORS — your website origin (`http://localhost:3000`, then your Vercel URL) |
| `PORT` | Port the API listens on (default `8000`) |

> 🔒 `.env` files are git-ignored. **Never** paste real keys into chat,
> screenshots, or commits.

## 🗂️ Project structure

```
web/
├── app/
│   ├── layout.tsx              # root layout (navbar + footer, Inter, light theme)
│   ├── page.tsx                # animated landing page
│   ├── globals.css             # Apple-style theme tokens
│   ├── dashboard/page.tsx      # in-app dashboard (index chart, featured grid)
│   ├── stock/[symbol]/page.tsx # stock detail (chart, key stats, AI, forecast)
│   ├── watchlist/page.tsx      # saved stocks
│   ├── portfolio/page.tsx      # holdings + gain/loss
│   └── api/                    # route handlers (auth, AI, chat, inngest)
├── components/
│   ├── Navbar.tsx · Footer.tsx · MobileNav.tsx
│   ├── auth/SignInForm.tsx     # email/password + demo
│   ├── motion/Reveal.tsx       # Framer Motion scroll-reveal
│   ├── landing/                # Hero, Features, HowItWorks, CTA
│   ├── charts/                 # own-data SVG: CandleChart, Sparkline, StockChart, …
│   ├── ExpandableWidget.tsx    # full-screen modal for any chart
│   └── ui/                     # button, card
└── lib/
    ├── auth.ts · auth-client.ts · demo.ts
    ├── api.ts                  # prediction-service client
    ├── llm.ts                  # Groq client
    ├── constants.ts            # NIFTY 50 list (edit me)
    └── utils.ts

prediction-service/
├── src/
│   ├── config.py        # NIFTY 50 list, features, hyperparameters  <-- edit me
│   ├── data_loader.py   # Yahoo download + cache + retry/backoff
│   ├── indicators.py    # the 12 technical indicators
│   ├── dataset.py       # scaling + sliding windows
│   ├── model.py         # StockLSTM (PyTorch)
│   ├── train.py         # training loop + early stopping + MAE metric
│   └── predict.py       # autoregressive forecast
├── app/main.py          # FastAPI service
├── models/saved/        # trained weights, scalers, metrics (generated)
└── requirements.txt
```

## 🧪 Commands cheat-sheet

| Where | Command | Does |
|---|---|---|
| `prediction-service` | `python -m src.train --ticker RELIANCE.NS` | Train one stock |
| `prediction-service` | `python -m src.train --ticker RELIANCE.NS --epochs 5` | Fast smoke-test train |
| `prediction-service` | `python -m src.train --all` | Train all 50 (cached) |
| `prediction-service` | `python -m src.predict RELIANCE.NS` | Print a forecast in the terminal |
| `prediction-service` | `uvicorn app.main:app --reload --port 8000` | Run the API |
| `web` | `npm run dev` | Run the website (dev) |
| `web` | `npm run build && npm start` | Production build + serve |
| `web` | `npm run lint` | Lint |

## 🩺 Troubleshooting

| Symptom | Fix |
|---|---|
| **Yahoo `YFRateLimitError`** while training | Shared/cloud IPs get throttled. Re-run (it retries + caches), or train on a home connection and commit `models/saved/`. |
| **numpy build error on Python 3.13** | `requirements.txt` already pins `numpy>=1.26`; make sure your venv is fresh (`pip install -r requirements.txt`). |
| **First `import pandas/torch` seems to hang** | It's slow on first import (especially mixing conda `base` + a venv). Give it ~30s; activate only the `.venv`. |
| **Forecast says "unavailable"** on the site | Check the API is running, `NEXT_PUBLIC_PREDICTION_API_URL` is correct, and that ticker was trained. |
| **Can't sign in** | Confirm `MONGODB_URI` + `BETTER_AUTH_SECRET` are set and you restarted `npm run dev` after adding them. |
| **`npm install` flaky** | Retry; if a corporate proxy/registry is in the way, switch networks. |
| **Port already in use** | Use a different port: `--port 8001` (API) or `next dev -p 3001` (web). |

More per-part notes live in [`web/README.md`](./web/README.md) and
[`prediction-service/README.md`](./prediction-service/README.md).

## 🗺️ Roadmap (built in phases)

- [x] **Phase 0** — Project setup & accounts guide ([SETUP.md](./SETUP.md))
- [x] **Phase 1** — Python LSTM prediction service (NIFTY 50)
- [x] **Phase 2** — Design system, animated landing page & dashboard
- [x] **Phase 3** — Email & password sign-in + demo login
- [x] **Phase 4** — Search, stock detail + news, watchlist, portfolio
- [x] **Phase 5** — Wire LSTM forecasts into stock pages
- [x] **Phase 6** — AI insights, news summaries & chatbot
- [x] **Phase 7** — Price/volume alerts + daily & weekly email reports
- [x] **Phase 8** — Deploy live (Vercel + Render)

Each phase shipped as its own **branch + pull request**. 🎉 All phases complete.

## 🚀 Deploy

Going live? Follow **[DEPLOY.md](./DEPLOY.md)** — deploy the prediction API to
**Render** first (it ships with a `render.yaml` blueprint), then the website to
**Vercel**, then wire up CORS and (optionally) Inngest for scheduled emails.

## 📜 License

MIT — see [LICENSE](./LICENSE).

---

*StockSage is for learning about markets and machine learning. It is not
investment advice. Forecasts can be wrong. Stocks are regulated by SEBI and
listed on the NSE/BSE.*
