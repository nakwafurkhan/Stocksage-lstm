# StockSage-NIFTY — Prediction Service (Phase 1)

The "brain" of the project: an LSTM that forecasts future closing prices for
**NIFTY 50** stocks, served over a small HTTP API your Next.js website calls.

> Educational project. **Not financial advice.** Forecasts are estimates from
> past patterns and can be wrong.

## What it does

For each NIFTY 50 stock it:
1. Downloads ~10 years of daily OHLCV from Yahoo Finance (NSE `.NS` tickers).
2. Engineers 12 technical indicators (SMA, EMA, MACD, RSI, Bollinger Bands, ATR, OBV, ROC).
3. Trains a 2-layer LSTM to predict the next day's close from a 60-day window.
4. Reports held-out accuracy as **MAE in rupees**.
5. Rolls the prediction forward autoregressively to produce a multi-day forecast
   with a widening confidence band.

## Project layout

```
prediction-service/
├── src/
│   ├── config.py        # NIFTY 50 list, features, hyperparameters  <-- edit me
│   ├── data_loader.py   # Yahoo Finance download + cache + retry
│   ├── indicators.py    # the 12 technical indicators (pandas/numpy)
│   ├── dataset.py       # scaling + sliding windows
│   ├── model.py         # StockLSTM (PyTorch)
│   ├── train.py         # training loop + early stopping + metrics
│   └── predict.py       # autoregressive forecast
├── app/
│   └── main.py          # FastAPI service
├── models/saved/        # trained weights, scalers, metrics (generated)
└── requirements.txt
```

## Quick start

```bash
cd prediction-service
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Train one stock (fast smoke test):
python -m src.train --ticker RELIANCE.NS --epochs 5

# Train a stock properly (early stopping decides when to stop):
python -m src.train --ticker RELIANCE.NS

# Train the whole NIFTY 50 (slow — do this once, models are cached):
python -m src.train --all

# Generate a forecast from the command line:
python -m src.predict RELIANCE.NS

# Run the API:
uvicorn app.main:app --reload --port 8000
# then open http://localhost:8000/docs
```

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Liveness check |
| GET | `/tickers` | NIFTY 50 list with `trained` flag |
| GET | `/predict/{ticker}?horizon=30` | Forecast for one stock |

Example response (trimmed):
```json
{
  "ticker": "RELIANCE.NS",
  "last_close": 1234.5,
  "horizon_days": 30,
  "predicted_final": 1290.1,
  "predicted_change_pct": 4.5,
  "history": [{"date": "...", "close": 1230.0}],
  "forecast": [{"date": "...", "predicted": 1240.0, "lower": 1190.0, "upper": 1290.0}],
  "model_mae_rupees": 18.4,
  "disclaimer": "Educational estimate ... NOT financial advice."
}
```

## If Yahoo Finance rate-limits you

Yahoo throttles some cloud/server IPs (`YFRateLimitError`). Options:
- Re-run — `data_loader.py` retries with backoff and caches to `data/raw/`.
- Train locally (home IPs are rarely throttled), commit the `models/saved/`
  files, and deploy those — the API can serve forecasts from cached models.
- Swap the data source in `data_loader.py` for an Indian-market alternative
  (NSE bhavcopy, Stooq, or a paid API). Only that one file needs to change.

## Deploy (Phase 8)

Designed for **Render** / **Railway** / **Hugging Face Spaces** (any Python host):
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Set `ALLOWED_ORIGINS` to your Vercel URL.
- Commit pre-trained `models/saved/` so the server doesn't train on boot.
