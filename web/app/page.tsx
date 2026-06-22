import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";
import Reveal from "@/components/motion/Reveal";
import TickerTape from "@/components/widgets/TickerTape";

const STATS = [
  { k: "50", v: "NIFTY stocks" },
  { k: "10 yrs", v: "of price history" },
  { k: "AI", v: "LSTM forecasts" },
  { k: "₹0", v: "free to use" },
];

export default function LandingPage() {
  return (
    <>
      <Hero />

      {/* Live ticker strip */}
      <div className="border-y border-border">
        <TickerTape />
      </div>

      {/* Stats band */}
      <section className="container py-16">
        <Reveal>
          <div className="grid grid-cols-2 gap-6 rounded-2xl border border-border bg-card p-8 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.v} className="text-center">
                <div className="text-3xl font-semibold tracking-tightest text-foreground sm:text-4xl">
                  {s.k}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <Features />
      <HowItWorks />
      <CTA />
    </>
  );
}
