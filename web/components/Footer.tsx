import Link from "next/link";

export default function Footer() {
  return (
    <footer className="section-muted mt-24 border-t border-border">
      <div className="container py-12">
        <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            Educational tool — not financial advice.
          </span>{" "}
          StockSage helps you learn and explore the market. Forecasts are
          machine-learning estimates from past patterns and can be wrong. Always
          do your own research before investing.
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <span className="font-semibold tracking-tightest text-foreground">
            Stock<span className="text-primary">Sage</span>
          </span>
          <p>
            © {new Date().getFullYear()} StockSage · Charts &amp; data by
            TradingView · NIFTY 50 (NSE), regulated by SEBI
          </p>
          <div className="flex items-center gap-4">
            <Link href="/glossary" className="text-foreground/70 transition-colors hover:text-foreground">
              Glossary
            </Link>
            <Link href="/dashboard" className="text-foreground/70 transition-colors hover:text-foreground">
              Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
