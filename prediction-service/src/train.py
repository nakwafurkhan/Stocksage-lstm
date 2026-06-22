"""Train the LSTM for one ticker (or all of NIFTY 50).

Usage:
    python -m src.train --ticker RELIANCE.NS
    python -m src.train --all
    python -m src.train --ticker RELIANCE.NS --epochs 5   # quick smoke test

Artifacts written to models/saved/:
    <TICKER>_lstm.pt        trained weights
    <TICKER>_scaler.pkl     fitted MinMaxScaler
    <TICKER>_metrics.json   held-out MAE (in rupees) + metadata
"""
import argparse
import json
import time
from typing import Optional

import joblib
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

from . import config, data_loader, dataset
from .indicators import add_indicators
from .model import StockLSTM


def _seed():
    np.random.seed(config.SEED)
    torch.manual_seed(config.SEED)


def train_one(
    ticker: str,
    epochs: int = config.EPOCHS,
    verbose: bool = True,
) -> Optional[dict]:
    _seed()
    device = "cuda" if torch.cuda.is_available() else "cpu"

    raw = data_loader.load(ticker)
    ind = add_indicators(raw)
    if len(ind) < config.WINDOW + 50:
        print(f"[train] {ticker}: not enough data ({len(ind)} rows) -- skipping")
        return None

    X_tr, y_tr, X_te, y_te, scaler = dataset.prepare(ind)
    n_features = X_tr.shape[2]

    train_ds = TensorDataset(torch.from_numpy(X_tr), torch.from_numpy(y_tr))
    train_dl = DataLoader(train_ds, batch_size=config.BATCH_SIZE, shuffle=True)

    Xte_t = torch.from_numpy(X_te).to(device)
    yte_t = torch.from_numpy(y_te).to(device)

    model = StockLSTM(n_features).to(device)
    opt = torch.optim.Adam(model.parameters(), lr=config.LEARNING_RATE)
    loss_fn = nn.MSELoss()

    best_val = float("inf")
    best_state = None
    patience = 0
    t0 = time.time()

    for epoch in range(1, epochs + 1):
        model.train()
        for xb, yb in train_dl:
            xb, yb = xb.to(device), yb.to(device)
            opt.zero_grad()
            pred = model(xb)
            loss = loss_fn(pred, yb)
            loss.backward()
            opt.step()

        model.eval()
        with torch.no_grad():
            val_pred = model(Xte_t)
            val_loss = loss_fn(val_pred, yte_t).item()

        if val_loss < best_val - 1e-6:
            best_val = val_loss
            best_state = {k: v.cpu().clone() for k, v in model.state_dict().items()}
            patience = 0
        else:
            patience += 1

        if verbose and (epoch == 1 or epoch % 5 == 0 or patience == 0):
            print(f"[train] {ticker} epoch {epoch:>3}/{epochs} "
                  f"val_mse={val_loss:.5f} best={best_val:.5f}")

        if patience >= config.EARLY_STOP_PATIENCE:
            print(f"[train] {ticker}: early stop at epoch {epoch}")
            break

    if best_state is not None:
        model.load_state_dict(best_state)

    # Held-out MAE in rupees (invert just the Close column).
    model.eval()
    with torch.no_grad():
        pred_scaled = model(Xte_t).cpu().numpy()
    pred_price = dataset.invert_close(pred_scaled, scaler)
    true_price = dataset.invert_close(y_te, scaler)
    mae = float(np.mean(np.abs(pred_price - true_price)))

    # Persist artifacts.
    torch.save(model.state_dict(), config.MODELS_DIR / f"{ticker}_lstm.pt")
    joblib.dump(scaler, config.MODELS_DIR / f"{ticker}_scaler.pkl")
    metrics = {
        "ticker": ticker,
        "mae_rupees": round(mae, 2),
        "test_samples": int(len(y_te)),
        "epochs_trained": epoch,
        "n_features": n_features,
        "window": config.WINDOW,
        "rows": int(len(ind)),
        "date_range": [str(ind.index.min().date()), str(ind.index.max().date())],
        "trained_seconds": round(time.time() - t0, 1),
    }
    with open(config.MODELS_DIR / f"{ticker}_metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"[train] {ticker}: DONE  MAE=Rs.{mae:,.2f}  "
          f"({metrics['test_samples']} test samples, {metrics['trained_seconds']}s)")
    return metrics


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ticker", type=str, help="single ticker, e.g. RELIANCE.NS")
    ap.add_argument("--all", action="store_true", help="train every NIFTY 50 stock")
    ap.add_argument("--epochs", type=int, default=config.EPOCHS)
    args = ap.parse_args()

    if args.all:
        summary = []
        for tk in config.NIFTY_50:
            try:
                m = train_one(tk, epochs=args.epochs)
                if m:
                    summary.append(m)
            except Exception as e:  # noqa: BLE001
                print(f"[train] {tk}: ERROR {e!r}")
        print(f"\nTrained {len(summary)}/{len(config.NIFTY_50)} tickers.")
    elif args.ticker:
        train_one(args.ticker, epochs=args.epochs)
    else:
        ap.error("pass --ticker <SYMBOL> or --all")


if __name__ == "__main__":
    main()
