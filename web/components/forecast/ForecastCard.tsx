"use client";

import { useEffect, useState } from "react";
import { Loader2, BrainCircuit, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getForecast, type Forecast } from "@/lib/api";
import ForecastChart from "./ForecastChart";

const HORIZONS = [7, 30, 90];

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

export default function ForecastCard({ symbol }: { symbol: string }) {
  const [horizon, setHorizon] = useState(30);
  const [data, setData] = useState<Forecast | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [err, setErr] = useState("");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    getForecast(symbol, horizon)
      .then((d) => active && (setData(d), setStatus("ok")))
      .catch((e) => active && (setErr(e?.message || "unavailable"), setStatus("error")));
    return () => {
      active = false;
    };
  }, [symbol, horizon]);

  const up = (data?.predicted_change_pct ?? 0) >= 0;

  return (
    <Card className="overflow-hidden border-primary/30">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BrainCircuit className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-semibold">AI price forecast</h3>
              <p className="text-sm text-muted-foreground">LSTM projection · next {horizon} trading days</p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-border p-1">
            {HORIZONS.map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={cn(
                  "rounded-full px-3 py-1 text-sm transition-colors",
                  horizon === h ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {h}d
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        {status === "loading" && (
          <div className="mt-8 flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Crunching the model…
          </div>
        )}

        {status === "error" && (
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-secondary p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="text-muted-foreground">
              <p className="font-medium text-foreground">Forecast unavailable</p>
              <p className="mt-1">
                Make sure the prediction service is running and this stock is trained
                (<code>python -m src.train --ticker {symbol}</code>), and that{" "}
                <code>NEXT_PUBLIC_PREDICTION_API_URL</code> points to it.
              </p>
              <p className="mt-1 opacity-70">Details: {err}</p>
            </div>
          </div>
        )}

        {status === "ok" && data && (
          <>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="Last close" value={inr(data.last_close)} />
              <Stat
                label={`Projected (${horizon}d)`}
                value={inr(data.predicted_final)}
              />
              <Stat
                label="Projected move"
                value={`${up ? "+" : ""}${data.predicted_change_pct}%`}
                className={up ? "text-success" : "text-danger"}
                icon={up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              />
              <Stat
                label="Model error (MAE)"
                value={data.model_mae_rupees != null ? `±${inr(data.model_mae_rupees)}` : "—"}
              />
            </div>

            <div className="mt-6">
              <ForecastChart history={data.history} forecast={data.forecast} />
            </div>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-5" style={{ background: "hsl(var(--foreground))" }} /> History
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-5 border-t-2 border-dashed" style={{ borderColor: "hsl(var(--primary))" }} /> Forecast
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-5 rounded-sm" style={{ background: "hsl(var(--primary))", opacity: 0.12 }} /> Confidence band
              </span>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">{data.disclaimer}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  className,
  icon,
}: {
  label: string;
  value: string;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn("mt-1 flex items-center gap-1 text-lg font-semibold tracking-tight", className)}>
        {icon}
        {value}
      </div>
    </div>
  );
}
