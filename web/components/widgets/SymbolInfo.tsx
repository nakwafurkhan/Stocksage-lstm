"use client";

import { useMemo } from "react";
import TradingViewWidget from "@/components/TradingViewWidget";

const SCRIPT =
  "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";

/** Compact quote header (price, change, key stats) for a stock. */
export default function SymbolInfo({ symbol }: { symbol: string }) {
  const config = useMemo(
    () => ({
      symbol,
      width: "100%",
      locale: "en",
      colorTheme: "light",
      isTransparent: true,
    }),
    [symbol]
  );
  return <TradingViewWidget scriptSrc={SCRIPT} config={config} height={170} />;
}
