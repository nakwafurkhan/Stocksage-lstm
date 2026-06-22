# 📈 StockSage — Learn & Predict NIFTY 50 Stocks

> A beginner-friendly web app to explore India's **NIFTY 50** stocks with live
> charts, plain-English AI insights, an AI chatbot, a portfolio tracker, and
> **LSTM-powered price forecasts** — plus daily & weekly email reports on the
> stocks you care about.

> ⚠️ **Educational tool — not financial advice.** Forecasts are estimates from
> past patterns and can be wrong. Always do your own research.

---

## ✨ What you can do

- 🔐 **Sign in with one click** (Google) — or try the **demo account**, no signup needed
- 📊 **Live, professional charts** for every NIFTY 50 stock (TradingView)
- 🔎 **Search** the NIFTY 50 and open rich **stock detail pages** (chart + news + financials)
- ⭐ **Watchlist** your favourite stocks
- 💼 **Portfolio tracker** — record holdings and see live value & gain/loss
- 🤖 **AI chatbot** that explains the market in plain English
- 🧠 **LSTM forecasts** — where prices *might* head next, with a confidence band
- 📰 **News** for each stock, with AI summaries
- 📧 **Daily & weekly email reports** on the stocks you select

## 🏗️ Architecture

A monorepo with two parts that talk over a simple API:

```
Stocksage-lstm/
├── web/                 # Next.js 15 website (the app users see)
│   • TypeScript, Tailwind, shadcn/ui, Framer Motion
│   • Better Auth (Google sign-in) + MongoDB
│   • TradingView charts • Gemini AI • Inngest + Resend email
│
└── prediction-service/  # Python LSTM API (the "prediction brain")
    • PyTorch LSTM trained on ~10 years of NIFTY 50 data
    • FastAPI endpoints the website calls for forecasts
```

## 🗺️ Roadmap (built in phases)

- [ ] **Phase 0** — Project setup & accounts guide  ← *you are here*
- [ ] **Phase 1** — Python LSTM prediction service (NIFTY 50)
- [ ] **Phase 2** — Design system, animated landing page & dashboard
- [ ] **Phase 3** — Google one-click sign-in + demo login
- [ ] **Phase 4** — Search, stock detail + news, watchlist, portfolio
- [ ] **Phase 5** — Wire LSTM forecasts into stock pages
- [ ] **Phase 6** — AI insights, news summaries & chatbot
- [ ] **Phase 7** — Price/volume alerts + daily & weekly email reports
- [ ] **Phase 8** — Deploy live (Vercel + Python host)

Each phase ships as its own **branch + pull request** for review.

## 🚀 Getting started

1. Read **[SETUP.md](./SETUP.md)** to create the free accounts & API keys you'll need.
2. Each part has its own README with run instructions (added as phases land):
   - `web/README.md` — the website
   - `prediction-service/README.md` — the LSTM API

## 📜 License

MIT — see [LICENSE](./LICENSE).

---

*StockSage is for learning about markets and machine learning. It is not
investment advice. Stocks are regulated by SEBI and listed on the NSE/BSE.*
