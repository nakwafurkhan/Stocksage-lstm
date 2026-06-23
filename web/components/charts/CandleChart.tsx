import type { Candle } from "@/lib/api";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

/**
 * Dependency-free SVG candlestick chart drawn from our own OHLC data.
 * Stretches to fill its container (price scale stays accurate); text labels are
 * HTML overlays so they don't distort.
 */
export default function CandleChart({
  candles,
  height = 480,
}: {
  candles: Candle[];
  height?: number | string;
}) {
  if (!candles || candles.length < 2) return null;

  const W = 1000;
  const H = 400;
  const padX = 6;
  const padY = 10;
  const n = candles.length;

  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const trueHi = Math.max(...highs);
  const trueLo = Math.min(...lows);
  const pad = (trueHi - trueLo) * 0.06 || 1;
  const hi = trueHi + pad;
  const lo = trueLo - pad;

  const x = (i: number) => padX + ((i + 0.5) / n) * (W - 2 * padX);
  const y = (v: number) => padY + (1 - (v - lo) / (hi - lo)) * (H - 2 * padY);
  const slot = (W - 2 * padX) / n;
  const bw = Math.max(1, Math.min(slot * 0.6, 14));

  const UP = "hsl(var(--success))";
  const DOWN = "hsl(var(--danger))";
  const last = candles[n - 1];
  const first = candles[0];
  const changePct = ((last.close - first.close) / first.close) * 100;
  const lastUp = changePct >= 0;

  const grid = Array.from({ length: 5 }, (_, i) => padY + (i * (H - 2 * padY)) / 4);
  const lastTopPct = (y(last.close) / H) * 100;

  return (
    <div
      className="relative w-full"
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {grid.map((gy, i) => (
          <line key={i} x1={0} y1={gy} x2={W} y2={gy} style={{ stroke: "hsl(var(--border))" }} strokeWidth={1} opacity={0.5} vectorEffect="non-scaling-stroke" />
        ))}
        {candles.map((c, i) => {
          const cx = x(i);
          const isUp = c.close >= c.open;
          const col = isUp ? UP : DOWN;
          const yOpen = y(c.open);
          const yClose = y(c.close);
          const top = Math.min(yOpen, yClose);
          const bodyH = Math.max(1, Math.abs(yClose - yOpen));
          return (
            <g key={i}>
              <line x1={cx} y1={y(c.high)} x2={cx} y2={y(c.low)} style={{ stroke: col }} strokeWidth={1} vectorEffect="non-scaling-stroke" />
              <rect x={cx - bw / 2} y={top} width={bw} height={bodyH} style={{ fill: col }} />
            </g>
          );
        })}
        <line x1={0} y1={y(last.close)} x2={W} y2={y(last.close)} style={{ stroke: "hsl(var(--primary))" }} strokeWidth={1} strokeDasharray="6 5" opacity={0.7} vectorEffect="non-scaling-stroke" />
      </svg>

      {/* HTML overlays (not distorted) */}
      <div className="pointer-events-none absolute left-2 top-2 rounded bg-card/70 px-1.5 py-0.5 text-[11px] text-muted-foreground backdrop-blur-sm">
        H {inr(trueHi)}
      </div>
      <div className="pointer-events-none absolute bottom-7 left-2 rounded bg-card/70 px-1.5 py-0.5 text-[11px] text-muted-foreground backdrop-blur-sm">
        L {inr(trueLo)}
      </div>
      <div
        className="pointer-events-none absolute right-2 -translate-y-1/2 rounded bg-primary px-1.5 py-0.5 text-[11px] font-medium text-primary-foreground"
        style={{ top: `${lastTopPct}%` }}
      >
        {inr(last.close)}
      </div>
      <div className="pointer-events-none absolute bottom-1.5 left-2 right-2 flex justify-between text-[11px] text-muted-foreground">
        <span>{first.date}</span>
        <span className={lastUp ? "text-success" : "text-danger"}>
          {lastUp ? "+" : ""}
          {changePct.toFixed(2)}% over {n} days
        </span>
        <span>{last.date}</span>
      </div>
    </div>
  );
}
