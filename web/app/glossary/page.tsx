import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Glossary — StockSage",
};

const TERMS: { term: string; def: string }[] = [
  { term: "Stock (Share)", def: "A small piece of ownership in a company. If the company does well, your share can become more valuable." },
  { term: "NIFTY 50", def: "An index tracking 50 of the largest companies listed on India's National Stock Exchange (NSE). It's a quick gauge of the overall market." },
  { term: "NSE & BSE", def: "India's two main stock exchanges — the National Stock Exchange and Bombay Stock Exchange — where shares are bought and sold." },
  { term: "SEBI", def: "The Securities and Exchange Board of India — the regulator that makes rules to keep the markets fair and protect investors." },
  { term: "Index", def: "A basket of stocks used to measure how a market or sector is doing overall (e.g. the NIFTY 50)." },
  { term: "Market capitalisation", def: "The total value of a company's shares (share price × number of shares). 'Large-cap' means a big, established company." },
  { term: "P/E ratio", def: "Price-to-Earnings: the share price divided by earnings per share. A rough sense of how expensive a stock is relative to its profits." },
  { term: "Dividend", def: "A share of a company's profit paid out to shareholders, usually as cash." },
  { term: "Volume", def: "How many shares were traded in a period. High volume means lots of buying and selling activity." },
  { term: "Volatility", def: "How much a price swings up and down. Higher volatility means bigger, faster moves — and more risk." },
  { term: "Candlestick chart", def: "A chart where each 'candle' shows the open, high, low and close price for a period. Green/red shows up/down days." },
  { term: "Moving average", def: "The average price over a recent window (e.g. 50 days), smoothed to show the trend." },
  { term: "RSI", def: "Relative Strength Index — a 0-100 gauge of whether a stock may be 'overbought' (high) or 'oversold' (low)." },
  { term: "Portfolio", def: "The collection of all the investments you own." },
  { term: "Diversification", def: "Spreading money across different stocks/sectors so one bad performer doesn't sink everything." },
  { term: "Watchlist", def: "A personal list of stocks you want to keep an eye on." },
];

export default function GlossaryPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-semibold tracking-tightest sm:text-4xl">Stock market glossary</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Plain-English definitions of the words you&apos;ll see around StockSage. No jargon, promise.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {TERMS.map((t) => (
          <Card key={t.term}>
            <CardContent className="p-5">
              <h2 className="font-semibold">{t.term}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t.def}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-xs text-muted-foreground">
        Educational information only — not financial advice.
      </p>
    </div>
  );
}
