"use client";

import { useMemo } from "react";
import TradingViewWidget from "@/components/TradingViewWidget";

const SCRIPT =
  "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

type Props = {
  /** TradingView symbol, e.g. "NSE:RELIANCE" or "NSE:NIFTY" */
  symbol: string;
  height?: number | string;
  interval?: string;
};

/** Full interactive candlestick chart (the centrepiece of a stock view). */
export default function AdvancedChart({ symbol, height = 480, interval = "D" }: Props) {
  const config = useMemo(
    () => ({
      autosize: true,
      symbol,
      interval,
      timezone: "Asia/Kolkata",
      theme: "light",
      style: "1", // candlesticks
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      hide_side_toolbar: false,
      withdateranges: true,
      details: true,
      backgroundColor: "rgba(255, 255, 255, 1)",
      gridColor: "rgba(42, 46, 57, 0.06)",
      support_host: "https://www.tradingview.com",
    }),
    [symbol, interval]
  );

  return <TradingViewWidget scriptSrc={SCRIPT} config={config} height={height} />;
}
