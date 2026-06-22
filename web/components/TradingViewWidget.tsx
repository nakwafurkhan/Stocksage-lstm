"use client";

import { useEffect, useRef, memo } from "react";

type Props = {
  /** TradingView embed script URL (e.g. .../embed-widget-advanced-chart.js) */
  scriptSrc: string;
  /** Widget configuration object (serialized into the script body) */
  config: Record<string, unknown>;
  /** Container height. Use a number (px) or a CSS string. */
  height?: number | string;
  className?: string;
};

/**
 * Generic loader for any TradingView embeddable widget.
 * TradingView widgets are <script> tags whose JSON config lives in the script
 * body; this component injects that structure and cleans up on unmount.
 */
function TradingViewWidget({ scriptSrc, config, height = 400, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Reset (handles React re-renders / fast refresh).
    el.innerHTML = '<div class="tradingview-widget-container__widget"></div>';

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify(config);
    el.appendChild(script);

    return () => {
      el.innerHTML = "";
    };
  }, [scriptSrc, config]);

  return (
    <div
      className={`tradingview-widget-container ${className ?? ""}`}
      ref={containerRef}
      style={{ height: typeof height === "number" ? `${height}px` : height, width: "100%" }}
    />
  );
}

export default memo(TradingViewWidget);
