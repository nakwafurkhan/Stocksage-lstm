import StockSearch from "@/components/stocks/StockSearch";

export const metadata = {
  title: "Browse NIFTY 50 — StockSage",
};

export default function StocksPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-semibold tracking-tightest sm:text-4xl">
        Browse NIFTY 50
      </h1>
      <p className="mt-2 text-muted-foreground">
        Search any of India&apos;s 50 largest listed companies, then open it for
        charts, news, financials and a forecast.
      </p>
      <div className="mt-8">
        <StockSearch />
      </div>
    </div>
  );
}
