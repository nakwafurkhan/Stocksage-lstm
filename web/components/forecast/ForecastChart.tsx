import type { Forecast } from "@/lib/api";

// Dependency-free SVG chart: historical close (solid) + LSTM forecast (dashed)
// with a shaded confidence band. Scales responsively via viewBox.
export default function ForecastChart({
  history,
  forecast,
}: {
  history: Forecast["history"];
  forecast: Forecast["forecast"];
}) {
  const W = 820;
  const H = 320;
  const padL = 10;
  const padR = 10;
  const padT = 16;
  const padB = 26;

  const total = history.length + forecast.length;
  if (total < 2 || history.length === 0) return null;

  const values: number[] = [];
  history.forEach((h) => values.push(h.close));
  forecast.forEach((f) => values.push(f.predicted, f.lower, f.upper));
  let min = Math.min(...values);
  let max = Math.max(...values);
  const pad = (max - min) * 0.08 || 1;
  min -= pad;
  max += pad;

  const x = (i: number) => padL + (i / (total - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - (v - min) / (max - min)) * (H - padT - padB);

  const lastIdx = history.length - 1;
  const lastClose = history[lastIdx].close;

  const histPts = history.map((h, i) => `${x(i).toFixed(1)},${y(h.close).toFixed(1)}`).join(" ");
  const fcPts = [
    `${x(lastIdx).toFixed(1)},${y(lastClose).toFixed(1)}`,
    ...forecast.map((f, i) => `${x(history.length + i).toFixed(1)},${y(f.predicted).toFixed(1)}`),
  ].join(" ");
  const upper = forecast.map((f, i) => `${x(history.length + i).toFixed(1)},${y(f.upper).toFixed(1)}`);
  const lower = forecast
    .map((f, i) => `${x(history.length + i).toFixed(1)},${y(f.lower).toFixed(1)}`)
    .reverse();
  const band = [`${x(lastIdx).toFixed(1)},${y(lastClose).toFixed(1)}`, ...upper, ...lower].join(" ");
  const divX = x(lastIdx).toFixed(1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Price history and forecast">
      <polygon points={band} style={{ fill: "hsl(var(--primary))", opacity: 0.12 }} />
      <line
        x1={divX} y1={padT} x2={divX} y2={H - padB}
        style={{ stroke: "hsl(var(--border))" }}
        strokeDasharray="4 4" vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={histPts} fill="none"
        style={{ stroke: "hsl(var(--foreground))" }}
        strokeWidth={2} vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={fcPts} fill="none"
        style={{ stroke: "hsl(var(--primary))" }}
        strokeWidth={2} strokeDasharray="6 4" vectorEffect="non-scaling-stroke"
      />
      <text x={divX} y={H - 8} textAnchor="middle" fontSize={11} style={{ fill: "hsl(var(--muted-foreground))" }}>
        today
      </text>
    </svg>
  );
}
