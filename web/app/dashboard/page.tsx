import Link from "next/link";
import { TrendingUp, BrainCircuit, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/motion/Reveal";
import OnboardingBanner from "@/components/OnboardingBanner";
import AdvancedChart from "@/components/widgets/AdvancedChart";
import MiniSymbolOverview from "@/components/widgets/MiniSymbolOverview";
import MarketOverview from "@/components/widgets/MarketOverview";
import { FEATURED, NIFTY_INDEX_TV } from "@/lib/constants";

export const metadata = {
  title: "Dashboard — StockSage",
};

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tightest sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="container py-10">
      <OnboardingBanner />
      {/* Header */}
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              Demo mode
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tightest sm:text-4xl">
              Your market dashboard
            </h1>
            <p className="mt-1 text-muted-foreground">
              Live NIFTY 50 charts, your watchlist and portfolio, and AI-powered forecasts — all in one place.
            </p>
          </div>
        </div>
      </Reveal>

      {/* NIFTY index */}
      <section className="mt-10">
        <Reveal>
          <SectionHeading eyebrow="Live market" title="NIFTY 50 Index" subtitle="India's benchmark of 50 large companies — fully interactive." />
          <Card className="overflow-hidden">
            <CardContent className="p-2 sm:p-3">
              <AdvancedChart symbol={NIFTY_INDEX_TV} height={500} />
            </CardContent>
          </Card>
        </Reveal>
      </section>

      {/* Featured stocks */}
      <section className="mt-14">
        <Reveal>
          <SectionHeading eyebrow="Popular stocks" title="Featured companies" subtitle="A snapshot of the most-watched names — tap any one to open its full page." />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map((stock, i) => (
            <Reveal key={stock.yf} delay={(i % 4) * 0.06}>
              <Link href={`/stock/${encodeURIComponent(stock.yf)}`} className="block h-full">
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.3)]">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{stock.name}</CardTitle>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
                        {stock.sector}
                      </span>
                    </div>
                    <CardDescription className="text-xs">{stock.tv}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2 pb-3">
                    {/* visual only — the whole card links to the detail page */}
                    <div className="pointer-events-none">
                      <MiniSymbolOverview symbol={stock.tv} height={140} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Market overview */}
      <section className="mt-14">
        <Reveal>
          <SectionHeading eyebrow="By sector" title="Market overview" subtitle="Leaders across banking, IT and autos." />
          <Card className="overflow-hidden">
            <CardContent className="p-2 sm:p-3">
              <MarketOverview height={460} />
            </CardContent>
          </Card>
        </Reveal>
      </section>

      {/* Predictions teaser */}
      <section className="mt-14">
        <Reveal>
          <Card className="overflow-hidden">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="p-7 sm:p-9">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BrainCircuit className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-2xl font-semibold tracking-tightest">
                  LSTM forecasts on every stock
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Our prediction engine, trained on a decade of NIFTY 50 data, projects a multi-day
                  forecast with a confidence band right on each stock&apos;s page.
                </p>
                <div className="mt-6">
                  <Button asChild variant="outline">
                    <Link href="/stocks">
                      Browse stocks <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center border-t border-border bg-secondary/50 p-9 md:border-l md:border-t-0">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4 text-success" /> Example forecast
                  </div>
                  <div className="mt-2 text-5xl font-semibold tracking-tightest text-foreground">+4.5%</div>
                  <div className="text-sm text-muted-foreground">projected 30-day move</div>
                  <div className="mt-4 inline-block rounded-lg border border-dashed border-border px-4 py-2 text-xs text-muted-foreground">
                    Open any stock to see its live forecast
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Reveal>
      </section>
    </div>
  );
}
