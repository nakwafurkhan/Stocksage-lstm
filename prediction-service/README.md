# prediction-service — LSTM Forecast API (Phase 1)

The "prediction brain" of StockSage: a PyTorch **LSTM** trained on ~10 years of
**NIFTY 50** daily data, served as a small **FastAPI** service the website calls.

> 🚧 Code lands in **Phase 1**. This folder is a placeholder for now.

Planned layout:

```
prediction-service/
├── src/            # data loader, indicators, model, train, predict
├── app/            # FastAPI app (GET /predict/{ticker})
├── models/saved/   # trained weights (generated)
└── requirements.txt
```

> ⚠️ Educational only — not financial advice.
