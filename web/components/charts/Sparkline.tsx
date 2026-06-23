/** Dependency-free SVG sparkline (line + soft fill) from a series of closes. */
export default function Sparkline({
  closes,
  height = 120,
}: {
  closes: number[];
  height?: number | string;
}) {
  if (!closes || closes.length < 2) return null;

  const W = 300;
  const H = 100;
  const pad = 4;
  let lo = Math.min(...closes);
  let hi = Math.max(...closes);
  const p = (hi - lo) * 0.1 || 1;
  lo -= p;
  hi += p;

  const x = (i: number) => pad + (i / (closes.length - 1)) * (W - 2 * pad);
  const y = (v: number) => pad + (1 - (v - lo) / (hi - lo)) * (H - 2 * pad);
  const up = closes[closes.length - 1] >= closes[0];
  const col = up ? "hsl(var(--success))" : "hsl(var(--danger))";
  const line = closes.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${x(0).toFixed(1)},${H - pad} ${line} ${x(closes.length - 1).toFixed(1)},${H - pad}`;

  return (
    <div className="w-full" style={{ height: typeof height === "number" ? `${height}px` : height }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full">
        <polygon points={area} style={{ fill: col, opacity: 0.1 }} />
        <polyline points={line} fill="none" style={{ stroke: col }} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
