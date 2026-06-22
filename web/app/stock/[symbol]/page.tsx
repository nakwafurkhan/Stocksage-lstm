import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import { findStock } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdvancedChart from "@/components/widgets/AdvancedChart";
import SymbolInfo from "@/components/widgets/SymbolInfo";
import Financials from "@/components/widgets/Financials";
import CompanyProfile from "@/components/widgets/CompanyProfile";
import NewsTimeline from "@/components/widgets/NewsTimeline";
import WatchlistButton from "@/components/stocks/WatchlistButton";

type Params = { params: Promise<{ symbol: string }> };

export async function generateMetadata({ params }: Params) {
  const { symbol } = await params;
  const stock = findStock(decodeURIComponent(symbol));
  return { title: stock ? `${stock.name} — StockSage` : "Stock — StockSage" };
}

export default async function StockPage({ params }: Params) {
  const { symbol } = await params;
  const stock = findStock(decodeURIComponent(symbol));
  if (!stock) notFound();

  return (
    <div className="container py-8">
      <Link
        href="/stocks"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All stocks
      </Link>

      {/* Header */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tightest sm:text-4xl">{stock.name}</h1>
          <p className="mt-1 text-muted-foreground">
            {stock.yf.replace(".NS", "")} · NSE ·{" "}
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              {stock.sector}
            </span>
          </p>
        </div>
        <WatchlistButton symbol={stock.yf} />
      </div>

      {/* Quote strip */}
      <div className="mt-6">
        <Card className="overflow-hidden">
          <CardContent className="p-2 sm:p-3">
            <SymbolInfo symbol={stock.tv} />
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <section className="mt-6">
        <Card className="overflow-hidden">
          <CardContent className="p-2 sm:p-3">
            <AdvancedChart symbol={stock.tv} height={480} />
          </CardContent>
        </Card>
      </section>

      {/* Forecast teaser (wired in Phase 5) */}
      <section className="mt-6">
        <Card className="overflow-hidden border-primary/30">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BrainCircuit className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-semibold">AI price forecast</h3>
                <p className="text-sm text-muted-foreground">
                  An LSTM projection for {stock.name} appears here in Phase 5.
                </p>
              </div>
            </div>
            <span className="rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground">
              Coming in Phase 5
            </span>
          </CardContent>
        </Card>
      </section>

      {/* Financials + Profile */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Financials</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-3">
            <Financials symbol={stock.tv} />
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">About</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-3">
            <CompanyProfile symbol={stock.tv} />
          </CardContent>
        </Card>
      </section>

      {/* News */}
      <section className="mt-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Latest news</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-3">
            <NewsTimeline symbol={stock.tv} height={460} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
