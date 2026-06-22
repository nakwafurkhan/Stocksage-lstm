"use client";

import { useMemo } from "react";
import TradingViewWidget from "@/components/TradingViewWidget";

const SCRIPT =
  "https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js";

/** "About this company" profile box. */
export default function CompanyProfile({ symbol }: { symbol: string }) {
  const config = useMemo(
    () => ({
      symbol,
      width: "100%",
      height: "100%",
      colorTheme: "light",
      isTransparent: true,
      locale: "en",
    }),
    [symbol]
  );
  return <TradingViewWidget scriptSrc={SCRIPT} config={config} height={360} />;
}
