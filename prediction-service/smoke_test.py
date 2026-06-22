"""End-to-end smoke test: data -> indicators -> train -> forecast.

Tries real NIFTY 50 data first; if Yahoo rate-limits, falls back to a synthetic
random-walk series so we can still prove the ML pipeline runs.
"""
import numpy as np
import pandas as pd

from src import config, data_loader
from src.train import train_one
from src import predict as predictor

REAL = "RELIANCE.NS"


def make_synthetic(ticker="SMOKE.NS", n=800):
    rng = np.random.default_rng(7)
    dates = pd.bdate_range("2021-01-01", periods=n)
    steps = rng.normal(0.0006, 0.015, n)
    close = 1000 * np.exp(np.cumsum(steps))
    high = close * (1 + np.abs(rng.normal(0, 0.006, n)))
    low = close * (1 - np.abs(rng.normal(0, 0.006, n)))
    open_ = close * (1 + rng.normal(0, 0.004, n))
    vol = rng.integers(1_000_000, 5_000_000, n).astype(float)
    df = pd.DataFrame({"Open": open_, "High": high, "Low": low,
                       "Close": close, "Volume": vol}, index=dates)
    df.index.name = "Date"
    df.to_csv(config.DATA_RAW / f"{ticker}.csv")
    return ticker


def main():
    print("=" * 60)
    ticker = None
    try:
        df = data_loader.load(REAL, use_cache=False, max_retries=3)
        print(f"REAL DATA OK: {REAL} {len(df)} rows "
              f"{df.index.min().date()} -> {df.index.max().date()}")
        ticker = REAL
    except Exception as e:
        print(f"REAL DATA UNAVAILABLE ({e!r})")
        print("-> falling back to synthetic series to validate the pipeline.")
        ticker = make_synthetic()

    print("=" * 60)
    print(f"Training {ticker} (5 epochs, smoke test)...")
    metrics = train_one(ticker, epochs=5)
    print("metrics:", metrics)

    print("=" * 60)
    print(f"Forecasting {ticker} (10 business days)...")
    out = predictor.forecast(ticker, horizon=10)
    print("last_close:", out["last_close"],
          "| predicted_final:", out["predicted_final"],
          "| change%:", out["predicted_change_pct"],
          "| model_mae:", out["model_mae_rupees"])
    print("first 3 forecast points:")
    for p in out["forecast"][:3]:
        print("  ", p)
    print("history points:", len(out["history"]), "| forecast points:", len(out["forecast"]))
    print("=" * 60)
    print("SMOKE TEST PASSED" if out["forecast"] else "SMOKE TEST FAILED")


if __name__ == "__main__":
    main()
