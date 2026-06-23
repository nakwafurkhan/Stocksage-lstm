"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { getHistory, type Candle } from "@/lib/api";
import CandleChart from "./CandleChart";

/** Fetches OHLC from our prediction service and draws a candlestick chart. */
export default function StockChart({
  symbol,
  days = 180,
  height = 560,
}: {
  symbol: string; // Yahoo symbol, e.g. "RELIANCE.NS" or "^NSEI"
  days?: number;
  height?: number | string;
}) {
  const [candles, setCandles] = useState<Candle[] | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let active = true;
    setCandles(null);
    setErr(false);
    getHistory(symbol, days)
      .then((d) => active && setCandles(d.candles))
      .catch(() => active && setErr(true));
    return () => {
      active = false;
    };
  }, [symbol, days]);

  const h = typeof height === "number" ? `${height}px` : height;

  if (err) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground" style={{ height: h }}>
        <AlertTriangle className="h-5 w-5" />
        <span>Chart data unavailable — make sure the prediction API is running.</span>
      </div>
    );
  }
  if (!candles) {
    return (
      <div className="flex items-center justify-center" style={{ height: h }}>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return <CandleChart candles={candles} height={height} />;
}
