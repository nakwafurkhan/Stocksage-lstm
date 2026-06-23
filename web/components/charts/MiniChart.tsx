"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getHistory } from "@/lib/api";
import Sparkline from "./Sparkline";

/** Small sparkline + last price & change, drawn from our own data. */
export default function MiniChart({
  symbol,
  days = 90,
  height = 120,
}: {
  symbol: string;
  days?: number;
  height?: number | string;
}) {
  const [closes, setCloses] = useState<number[] | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let active = true;
    getHistory(symbol, days)
      .then((d) => active && setCloses(d.candles.map((c) => c.close)))
      .catch(() => active && setErr(true));
    return () => {
      active = false;
    };
  }, [symbol, days]);

  const h = typeof height === "number" ? `${height}px` : height;

  if (err || closes === null) {
    return (
      <div className="flex items-center justify-center" style={{ height: h }}>
        {err ? (
          <span className="text-xs text-muted-foreground">No data</span>
        ) : (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
    );
  }

  const change = closes.length > 1 ? ((closes[closes.length - 1] - closes[0]) / closes[0]) * 100 : 0;
  const up = change >= 0;

  return (
    <div>
      <Sparkline closes={closes} height={height} />
      <div className="mt-1 px-1 text-xs">
        <span className="font-medium">
          ₹{closes[closes.length - 1].toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        </span>{" "}
        <span className={up ? "text-success" : "text-danger"}>
          {up ? "+" : ""}
          {change.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
