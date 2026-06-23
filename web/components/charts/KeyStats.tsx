"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getHistory, type Candle } from "@/lib/api";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

/** Latest-close key stats from our own daily data (EOD). */
export default function KeyStats({ symbol }: { symbol: string }) {
  const [candles, setCandles] = useState<Candle[] | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let active = true;
    getHistory(symbol, 7)
      .then((d) => active && setCandles(d.candles))
      .catch(() => active && setErr(true));
    return () => {
      active = false;
    };
  }, [symbol]);

  if (err) return <p className="p-2 text-sm text-muted-foreground">Latest price unavailable — is the prediction API running?</p>;
  if (!candles)
    return (
      <div className="flex items-center gap-2 p-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    );

  const last = candles[candles.length - 1];
  const prev = candles.length > 1 ? candles[candles.length - 2] : last;
  const chg = ((last.close - prev.close) / prev.close) * 100;
  const up = chg >= 0;

  const Stat = ({ label, value, cls }: { label: string; value: string; cls?: string }) => (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-lg font-semibold tracking-tight ${cls ?? ""}`}>{value}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4 p-2 sm:grid-cols-4">
      <Stat label="Latest close" value={inr(last.close)} />
      <Stat label="Change" value={`${up ? "+" : ""}${chg.toFixed(2)}%`} cls={up ? "text-success" : "text-danger"} />
      <Stat label="Day high" value={inr(last.high)} />
      <Stat label="Day low" value={inr(last.low)} />
    </div>
  );
}
