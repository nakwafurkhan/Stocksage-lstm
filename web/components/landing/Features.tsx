import {
  LineChart,
  BrainCircuit,
  MessagesSquare,
  Wallet,
  Newspaper,
  Mail,
} from "lucide-react";
import Reveal from "@/components/motion/Reveal";

const FEATURES = [
  {
    icon: LineChart,
    title: "Live, professional charts",
    body: "The same interactive candlestick charts the pros use, for every NIFTY 50 stock — powered by TradingView.",
  },
  {
    icon: BrainCircuit,
    title: "AI price forecasts",
    body: "An LSTM trained on ~10 years of data projects where prices may head next, with an honest confidence band.",
  },
  {
    icon: MessagesSquare,
    title: "Ask the AI chatbot",
    body: "Confused by a term or a chart? Ask in plain English and get a beginner-friendly answer in seconds.",
  },
  {
    icon: Wallet,
    title: "Portfolio tracker",
    body: "Record what you own and watch your live value, gains and losses update automatically.",
  },
  {
    icon: Newspaper,
    title: "News, summarized",
    body: "The latest headlines for each stock, distilled into a quick plain-language summary.",
  },
  {
    icon: Mail,
    title: "Daily & weekly reports",
    body: "Pick your stocks and get a tidy email digest — every morning and every week.",
  },
];

export default function Features() {
  return (
    <section id="features" className="container scroll-mt-20 py-24">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Everything in one place
        </p>
        <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tightest sm:text-5xl">
          Powerful tools, made simple.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={(i % 3) * 0.08}>
            <div className="group h-full rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.25)]">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">
                {f.title}
              </h3>
              <p className="mt-2 text-muted-foreground">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
