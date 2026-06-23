# web — StockSage Website

A beautiful, beginner-friendly **Next.js 15** app for exploring India's
**NIFTY 50** stocks. Apple-inspired design, smooth Framer Motion animations, and
live TradingView charts.

> ⚠️ Educational tool — **not financial advice.**

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS** + shadcn-style UI primitives
- **Framer Motion** for animation
- **TradingView** embeddable widgets (charts, ticker, market overview)
- **lucide-react** icons

*(Later phases add: Better Auth email + password, MongoDB, Groq AI,
Inngest + Resend email.)*

## What's in this phase (Phase 2)

- **Apple-style design system** — light, airy, refined typography, frosted nav
- **Animated landing page** (`/`) — hero with a live chart, feature grid,
  how-it-works, and CTA, all with scroll-reveal motion (respects reduced-motion)
- **Dashboard** (`/dashboard`) — live NIFTY 50 index chart, featured-stock grid,
  sector market overview, and a forecast teaser
- Reusable `lib/constants.ts` (NIFTY 50 universe) and `lib/api.ts` (typed client
  for the Phase 1 prediction service)

## Run it locally

```bash
cd web
cp .env.example .env.local
npm install
npm run dev
# open http://localhost:3000
```

No API keys are needed for this phase — TradingView widgets load in the browser.

## Structure

```
web/
├── app/
│   ├── layout.tsx          # root layout (navbar + footer, Inter, light theme)
│   ├── page.tsx            # animated landing page
│   ├── dashboard/page.tsx  # the in-app dashboard
│   └── globals.css         # Apple-style theme tokens
├── components/
│   ├── Navbar.tsx, Footer.tsx
│   ├── motion/Reveal.tsx           # Framer Motion scroll-reveal
│   ├── landing/                    # Hero, Features, HowItWorks, CTA
│   ├── widgets/                    # TradingView: TickerTape, AdvancedChart, …
│   ├── TradingViewWidget.tsx       # generic widget loader
│   └── ui/                         # button, card
└── lib/
    ├── constants.ts        # NIFTY 50 list (edit me)
    ├── api.ts              # prediction-service client
    └── utils.ts
```

## Next phases

- **Phase 3** — Email & password sign-in + demo login
- **Phase 4** — search, stock detail + news, watchlist, portfolio
- **Phase 5** — wire LSTM forecast charts into stock pages
- **Phase 6** — AI insights, news summaries & chatbot
- **Phase 7** — alerts + daily/weekly email reports
- **Phase 8** — deploy to Vercel
