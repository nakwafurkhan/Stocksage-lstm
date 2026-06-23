"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getHistory } from "@/lib/api";
import { NIFTY_50 } from "@/lib/constants";

type Q = { yf: string; name: string; price: number; change: number };

/** A horizontal strip of live-ish quotes from our own data (replaces the TradingView tape). */
export default function QuoteTape() {
  const [quotes, setQuotes] = useState<Q[]>([]);

  useEffect(() => {
    let active = true;
    const syms = NIFTY_50.slice(0, 12);
    Promise.all(
      syms.map(async (s) => {
        try {
          const d = await getHistory(s.yf, 5);
          const c = d.candles.map((x) => x.close);
          if (c.length < 2) return null;
          return {
            yf: s.yf,
            name: s.name,
            price: c[c.length - 1],
            change: ((c[c.length - 1] - c[c.length - 2]) / c[c.length - 2]) * 100,
          } as Q;
        } catch {
          return null;
        }
      })
    ).then((rs) => active && setQuotes(rs.filter(Boolean) as Q[]));
    return () => {
      active = false;
    };
  }, []);

  if (quotes.length === 0) return <div className="h-11" />;

  return (
    <div className="flex gap-6 overflow-x-auto px-4 py-3 text-sm" style={{ scrollbarWidth: "none" }}>
      {quotes.map((q) => {
        const up = q.change >= 0;
        return (
          <Link
            key={q.yf}
            href={`/stock/${encodeURIComponent(q.yf)}`}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap"
          >
            <span className="text-foreground/70">{q.name.split(" ")[0]}</span>
            <span className="font-medium">
              ₹{q.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </span>
            <span className={up ? "text-success" : "text-danger"}>
              {up ? "▲" : "▼"} {Math.abs(q.change).toFixed(2)}%
            </span>
          </Link>
        );
      })}
    </div>
  );
}
