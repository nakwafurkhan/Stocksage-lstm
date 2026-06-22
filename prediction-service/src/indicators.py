"""Technical indicators, implemented with pandas/NumPy only (no TA-Lib).

Each function takes the OHLCV DataFrame and returns a Series. `add_indicators`
appends all 12 as new columns and drops the warm-up rows that contain NaNs.
"""
import numpy as np
import pandas as pd


def sma(series: pd.Series, window: int) -> pd.Series:
    return series.rolling(window=window, min_periods=window).mean()


def ema(series: pd.Series, span: int) -> pd.Series:
    return series.ewm(span=span, adjust=False).mean()


def rsi(close: pd.Series, window: int = 14) -> pd.Series:
    delta = close.diff()
    gain = delta.clip(lower=0.0)
    loss = -delta.clip(upper=0.0)
    avg_gain = gain.rolling(window=window, min_periods=window).mean()
    avg_loss = loss.rolling(window=window, min_periods=window).mean()
    rs = avg_gain / avg_loss.replace(0.0, np.nan)
    out = 100.0 - (100.0 / (1.0 + rs))
    return out.fillna(100.0)  # if no losses in window, treat as fully overbought


def atr(high: pd.Series, low: pd.Series, close: pd.Series, window: int = 14) -> pd.Series:
    prev_close = close.shift(1)
    tr = pd.concat([
        (high - low),
        (high - prev_close).abs(),
        (low - prev_close).abs(),
    ], axis=1).max(axis=1)
    return tr.rolling(window=window, min_periods=window).mean()


def obv(close: pd.Series, volume: pd.Series) -> pd.Series:
    direction = np.sign(close.diff().fillna(0.0))
    return (direction * volume).fillna(0.0).cumsum()


def roc(close: pd.Series, window: int = 10) -> pd.Series:
    return (close / close.shift(window) - 1.0) * 100.0


def add_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """Return a copy of df with the 12 indicator columns appended.

    Expects columns: Open, High, Low, Close, Volume.
    """
    out = df.copy()
    close = out["Close"]

    out["SMA_20"] = sma(close, 20)
    out["SMA_50"] = sma(close, 50)
    out["EMA_12"] = ema(close, 12)
    out["EMA_26"] = ema(close, 26)
    out["MACD"] = out["EMA_12"] - out["EMA_26"]
    out["MACD_signal"] = ema(out["MACD"], 9)
    out["RSI_14"] = rsi(close, 14)

    sma20 = out["SMA_20"]
    std20 = close.rolling(window=20, min_periods=20).std()
    out["BB_upper"] = sma20 + 2.0 * std20
    out["BB_lower"] = sma20 - 2.0 * std20

    out["ATR_14"] = atr(out["High"], out["Low"], close, 14)
    out["OBV"] = obv(close, out["Volume"])
    out["ROC_10"] = roc(close, 10)

    # Drop the warm-up rows (first ~50 days) that still contain NaNs.
    out = out.dropna().copy()
    return out
