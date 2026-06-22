"use client";

import { useMemo } from "react";
import TradingViewWidget from "@/components/TradingViewWidget";

const SCRIPT =
  "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";

type Props = {
  symbol: string; // e.g. "NSE:RELIANCE"
  height?: number | string;
};

/** Compact sparkline-style price chart for a single stock card. */
export default function MiniSymbolOverview({ symbol, height = 180 }: Props) {
  const config = useMemo(
    () => ({
      symbol,
      width: "100%",
      height: "100%",
      locale: "en",
      dateRange: "12M",
      colorTheme: "light",
      isTransparent: true,
      autosize: true,
      largeChartUrl: "",
    }),
    [symbol]
  );

  return <TradingViewWidget scriptSrc={SCRIPT} config={config} height={height} />;
}
