"use client";

import { useMemo } from "react";
import TradingViewWidget from "@/components/TradingViewWidget";

const SCRIPT =
  "https://s3.tradingview.com/external-embedding/embed-widget-financials.js";

/** Fundamentals: revenue, earnings, margins, etc. */
export default function Financials({ symbol, height = 420 }: { symbol: string; height?: number | string }) {
  const config = useMemo(
    () => ({
      symbol,
      colorTheme: "light",
      isTransparent: true,
      largeChartUrl: "",
      displayMode: "regular",
      width: "100%",
      height: "100%",
      locale: "en",
    }),
    [symbol]
  );
  return <TradingViewWidget scriptSrc={SCRIPT} config={config} height={height} />;
}
