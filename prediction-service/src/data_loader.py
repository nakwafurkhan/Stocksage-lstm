"""Download daily OHLCV history from Yahoo Finance with retry/backoff.

Yahoo occasionally rate-limits requests from cloud/server IPs
(YFRateLimitError). We retry with exponential backoff and cache every download
to data/raw/<TICKER>.csv so repeat runs never hit the network again.

If Yahoo is unavailable in your environment, see the README for alternative
Indian-market data sources (NSE bhavcopy, Stooq, paid APIs).
"""
import sys
import time
from pathlib import Path
from typing import Optional

import pandas as pd

from . import config


def _flatten_columns(df: pd.DataFrame) -> pd.DataFrame:
    """yfinance sometimes returns a (field, ticker) MultiIndex; flatten it."""
    if isinstance(df.columns, pd.MultiIndex):
        df = df.copy()
        df.columns = [c[0] for c in df.columns]
    return df


def load(
    ticker: str,
    period: str = config.HISTORY_PERIOD,
    use_cache: bool = True,
    max_retries: int = 4,
) -> pd.DataFrame:
    """Return a clean OHLCV DataFrame (Open, High, Low, Close, Volume)."""
    cache_path = config.DATA_RAW / f"{ticker.replace('/', '_')}.csv"
    if use_cache and cache_path.exists():
        df = pd.read_csv(cache_path, index_col=0, parse_dates=True)
        if len(df) > config.WINDOW:
            return df

    import yfinance as yf

    last_err: Optional[Exception] = None
    for attempt in range(1, max_retries + 1):
        try:
            tk = yf.Ticker(ticker)
            df = tk.history(period=period, interval="1d", auto_adjust=True)
            df = _flatten_columns(df)
            if df is None or len(df) == 0:
                raise RuntimeError("empty frame returned")
            df = df[["Open", "High", "Low", "Close", "Volume"]].dropna()
            df.index.name = "Date"
            df.to_csv(cache_path)
            return df
        except Exception as e:  # noqa: BLE001 - we want to retry on anything
            last_err = e
            wait = 2 ** attempt + 1  # 3s, 5s, 9s, 17s
            print(f"[data_loader] {ticker} attempt {attempt}/{max_retries} "
                  f"failed: {e!r} -- retrying in {wait}s", file=sys.stderr)
            time.sleep(wait)

    raise RuntimeError(f"Failed to download {ticker} after {max_retries} "
                       f"attempts. Last error: {last_err!r}")


if __name__ == "__main__":
    # Quick manual check: python -m src.data_loader RELIANCE.NS
    sym = sys.argv[1] if len(sys.argv) > 1 else "RELIANCE.NS"
    data = load(sym, use_cache=False)
    print(f"{sym}: {len(data)} rows, {data.index.min().date()} -> {data.index.max().date()}")
    print(data.tail())
