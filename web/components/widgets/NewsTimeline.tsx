"use client";

import { useMemo } from "react";
import TradingViewWidget from "@/components/TradingViewWidget";

const SCRIPT =
  "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";

/** Latest news headlines for a specific stock. */
export default function NewsTimeline({ symbol, height = 420 }: { symbol: string; height?: number }) {
  const config = useMemo(
    () => ({
      feedMode: "symbol",
      symbol,
      colorTheme: "light",
      isTransparent: true,
      displayMode: "regular",
      width: "100%",
      height: "100%",
      locale: "en",
    }),
    [symbol]
  );
  return <TradingViewWidget scriptSrc={SCRIPT} config={config} height={height} />;
}
