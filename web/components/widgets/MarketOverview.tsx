"use client";

import { useMemo } from "react";
import TradingViewWidget from "@/components/TradingViewWidget";

const SCRIPT =
  "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";

/** Tabbed snapshot of Indian market groups (banks, IT, autos). */
export default function MarketOverview({ height = 460 }: { height?: number | string }) {
  const config = useMemo(
    () => ({
      colorTheme: "light",
      dateRange: "12M",
      showChart: true,
      locale: "en",
      isTransparent: true,
      showSymbolLogo: true,
      width: "100%",
      height: "100%",
      tabs: [
        {
          title: "Banking",
          symbols: [
            { s: "NSE:HDFCBANK", d: "HDFC Bank" },
            { s: "NSE:ICICIBANK", d: "ICICI Bank" },
            { s: "NSE:SBIN", d: "SBI" },
            { s: "NSE:KOTAKBANK", d: "Kotak" },
            { s: "NSE:AXISBANK", d: "Axis Bank" },
          ],
        },
        {
          title: "IT",
          symbols: [
            { s: "NSE:TCS", d: "TCS" },
            { s: "NSE:INFY", d: "Infosys" },
            { s: "NSE:HCLTECH", d: "HCL Tech" },
            { s: "NSE:WIPRO", d: "Wipro" },
            { s: "NSE:TECHM", d: "Tech Mahindra" },
          ],
        },
        {
          title: "Auto",
          symbols: [
            { s: "NSE:MARUTI", d: "Maruti" },
            { s: "NSE:TMPV", d: "Tata Motors (PV)" },
            { s: "NSE:M_M", d: "Mahindra" },
            { s: "NSE:EICHERMOT", d: "Eicher" },
            { s: "NSE:BAJAJ_AUTO", d: "Bajaj Auto" },
          ],
        },
      ],
    }),
    []
  );

  return <TradingViewWidget scriptSrc={SCRIPT} config={config} height={height} />;
}
