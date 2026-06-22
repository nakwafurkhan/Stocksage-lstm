"use client";

import { useMemo } from "react";
import TradingViewWidget from "@/components/TradingViewWidget";
import { NIFTY_50, NIFTY_INDEX_TV } from "@/lib/constants";

const SCRIPT =
  "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";

/** Scrolling tape of the NIFTY index + top stocks across the top of the app. */
export default function TickerTape() {
  const config = useMemo(
    () => ({
      symbols: [
        { proName: NIFTY_INDEX_TV, title: "NIFTY 50" },
        ...NIFTY_50.slice(0, 14).map((s) => ({ proName: s.tv, title: s.name })),
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "light",
      locale: "en",
    }),
    []
  );

  return <TradingViewWidget scriptSrc={SCRIPT} config={config} height={48} />;
}
