import { LogIn, Search, Sparkles } from "lucide-react";
import Reveal from "@/components/motion/Reveal";

const STEPS = [
  {
    icon: LogIn,
    step: "01",
    title: "Sign in or try the demo",
    body: "One click with Google — or jump straight into the demo account, no signup needed.",
  },
  {
    icon: Search,
    step: "02",
    title: "Explore any NIFTY 50 stock",
    body: "Search, open a stock, and see its live chart, news, financials and forecast on one page.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Learn, track & get alerts",
    body: "Build a watchlist and portfolio, ask the AI anything, and get daily & weekly email reports.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="section-muted scroll-mt-20 border-y border-border">
      <div className="container py-24">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tightest sm:text-5xl">
            From zero to insight in three steps.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-border bg-card p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <span className="text-2xl font-semibold text-muted-foreground/40">
                    {s.step}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
