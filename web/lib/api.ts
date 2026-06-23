// Thin client for the Phase 1 Python prediction service.
// Set NEXT_PUBLIC_PREDICTION_API_URL in .env (defaults to local dev).

const BASE =
  process.env.NEXT_PUBLIC_PREDICTION_API_URL || "http://localhost:8000";

export type ForecastPoint = {
  date: string;
  predicted: number;
  lower: number;
  upper: number;
};

export type Forecast = {
  ticker: string;
  display_name: string;
  last_close: number;
  horizon_days: number;
  predicted_final: number;
  predicted_change_pct: number;
  history: { date: string; close: number }[];
  forecast: ForecastPoint[];
  model_mae_rupees: number | null;
  disclaimer: string;
};

/** Fetch an LSTM forecast for one NIFTY 50 stock. */
export async function getForecast(
  yfSymbol: string,
  horizon = 30
): Promise<Forecast> {
  const res = await fetch(
    `${BASE}/predict/${encodeURIComponent(yfSymbol)}?horizon=${horizon}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.detail || `Prediction API error ${res.status}`);
  }
  return res.json();
}

export type Candle = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

/** Fetch daily OHLC candles for charting (any Yahoo symbol, incl. ^NSEI). */
export async function getHistory(
  yfSymbol: string,
  days = 180
): Promise<{ ticker: string; count: number; candles: Candle[] }> {
  const res = await fetch(
    `${BASE}/history/${encodeURIComponent(yfSymbol)}?days=${days}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.detail || `History API error ${res.status}`);
  }
  return res.json();
}

/** List which tickers have trained models available. */
export async function getTickers() {
  const res = await fetch(`${BASE}/tickers`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Prediction API error ${res.status}`);
  return res.json() as Promise<{
    count: number;
    tickers: { symbol: string; name: string; trained: boolean }[];
  }>;
}
