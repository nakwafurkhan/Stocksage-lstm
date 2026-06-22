"""FastAPI prediction service that the Next.js website calls.

Run locally:
    uvicorn app.main:app --reload --port 8000

Endpoints:
    GET /health                      -> liveness check
    GET /tickers                     -> NIFTY 50 universe (symbol + name + trained?)
    GET /predict/{ticker}?horizon=30 -> LSTM forecast for one stock
"""
import os
import sys
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

# Allow "from src ..." imports when run as "uvicorn app.main:app" from the
# prediction-service/ directory.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src import config           # noqa: E402
from src import predict as predictor  # noqa: E402

app = FastAPI(
    title="StockSage-NIFTY Prediction Service",
    description="LSTM price forecasts for NIFTY 50 stocks. Educational only — not financial advice.",
    version="1.0.0",
)

# CORS: allow your Next.js app's origin(s). Set ALLOWED_ORIGINS as a
# comma-separated list in production (e.g. https://your-app.vercel.app).
_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _origins if o.strip()],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "stocksage-nifty", "stocks": len(config.NIFTY_50)}


@app.get("/tickers")
def tickers():
    return {
        "count": len(config.NIFTY_50),
        "tickers": [
            {
                "symbol": t,
                "name": config.DISPLAY_NAMES.get(t, t),
                "trained": predictor.is_trained(t),
            }
            for t in config.NIFTY_50
        ],
    }


@app.get("/predict/{ticker}")
def predict_endpoint(
    ticker: str,
    horizon: int = Query(config.HORIZON, ge=1, le=90),
):
    ticker = ticker.upper()
    if ticker not in config.NIFTY_50:
        raise HTTPException(status_code=404, detail=f"{ticker} is not in the NIFTY 50 universe.")
    try:
        return predictor.forecast(ticker, horizon=horizon)
    except FileNotFoundError as e:
        raise HTTPException(status_code=409, detail=str(e))
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Forecast failed: {e!r}")
