import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { findStock } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import StockChart from "@/components/charts/StockChart";
import KeyStats from "@/components/charts/KeyStats";
import WatchlistButton from "@/components/stocks/WatchlistButton";
import ForecastCard from "@/components/forecast/ForecastCard";
import AiPanel from "@/components/insight/AiPanel";
import ExpandableWidget from "@/components/ExpandableWidget";

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

      {/* Key stats (our data) */}
      <div className="mt-6">
        <Card className="overflow-hidden">
          <CardContent className="p-3">
            <KeyStats symbol={stock.yf} />
          </CardContent>
        </Card>
      </div>

      {/* Price chart (our own data) */}
      <section className="mt-6">
        <Card className="overflow-hidden">
          <CardContent className="p-2 sm:p-3">
            <ExpandableWidget
              title={`${stock.name} — price chart`}
              render={(big) => <StockChart symbol={stock.yf} days={big ? 500 : 180} height={big ? "100%" : 560} />}
            />
          </CardContent>
        </Card>
      </section>

      {/* AI forecast (LSTM) */}
      <section className="mt-6">
        <ForecastCard symbol={stock.yf} />
      </section>

      {/* AI insight */}
      <section className="mt-6">
        <AiPanel
          symbol={stock.yf}
          endpoint="/api/insight"
          title="AI insight"
          description={`Get a plain-English explanation of ${stock.name} — what it does and what a beginner should keep in mind.`}
          cta="Explain this stock"
        />
      </section>

      {/* AI news summary */}
      <section className="mt-6">
        <AiPanel
          symbol={stock.yf}
          endpoint="/api/news-summary"
          title="Latest news, summarized"
          description={`Get an AI summary of recent news and developments about ${stock.name}.`}
          cta="Summarize recent news"
        />
      </section>
    </div>
  );
}
