import PortfolioManager from "@/components/portfolio/PortfolioManager";

export const metadata = {
  title: "Portfolio — StockSage",
};

export default function PortfolioPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-semibold tracking-tightest sm:text-4xl">Your portfolio</h1>
      <p className="mt-2 text-muted-foreground">
        Record your holdings and track live value and gain/loss. Educational only — not financial advice.
      </p>
      <div className="mt-8">
        <PortfolioManager />
      </div>
    </div>
  );
}
