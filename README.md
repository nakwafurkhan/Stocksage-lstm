# 📈 StockSage — Learn & Predict NIFTY 50 Stocks

> A beginner-friendly web app to explore India's **NIFTY 50** stocks with live
> charts, plain-English AI insights, an AI chatbot, a portfolio tracker, and
> **LSTM-powered price forecasts** — plus daily & weekly email reports on the
> stocks you care about.

> ⚠️ **Educational tool — not financial advice.** Forecasts are estimates from
> past patterns and can be wrong. Always do your own research.

---

## ✨ What you can do

- 🔐 **Sign in with email & password** — or try the **demo account**, no signup needed
- 📊 **Interactive candlestick charts** for every NIFTY 50 stock (drawn from our own data)
- 🔎 **Search** the NIFTY 50 and open rich **stock detail pages** (chart, AI news summary, forecast)
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
│   • Better Auth (email + password) + MongoDB
│   • Own-data SVG charts • Groq AI • Inngest + Resend email
│
└── prediction-service/  # Python LSTM API (the "prediction brain")
    • PyTorch LSTM trained on ~10 years of NIFTY 50 data
    • FastAPI endpoints the website calls for forecasts
```

## 🗺️ Roadmap (built in phases)

- [x] **Phase 0** — Project setup & accounts guide
- [x] **Phase 1** — Python LSTM prediction service (NIFTY 50)
- [x] **Phase 2** — Design system, animated landing page & dashboard
- [x] **Phase 3** — Email & password sign-in + demo login
- [x] **Phase 4** — Search, stock detail + news, watchlist, portfolio
- [x] **Phase 5** — Wire LSTM forecasts into stock pages
- [x] **Phase 6** — AI insights, news summaries & chatbot
- [x] **Phase 7** — Price/volume alerts + daily & weekly email reports
- [x] **Phase 8** — Deploy live (Vercel + Python host)

Each phase shipped as its own **branch + pull request**. 🎉 All phases complete.

## 🚀 Getting started

1. Read **[SETUP.md](./SETUP.md)** to create the free accounts & API keys you'll need.
2. Run each part locally (see its README):
   - `prediction-service/README.md` — train a model & start the LSTM API
   - `web/README.md` — start the website (`npm install && npm run dev`)
3. Go live with **[DEPLOY.md](./DEPLOY.md)** — Vercel (website) + Render (prediction API).

## 📜 License

MIT — see [LICENSE](./LICENSE).

---

*StockSage is for learning about markets and machine learning. It is not
investment advice. Stocks are regulated by SEBI and listed on the NSE/BSE.*
