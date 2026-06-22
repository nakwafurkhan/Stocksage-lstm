"""Turn an indicator DataFrame into scaled sliding-window tensors for the LSTM.

We fit the MinMaxScaler on the TRAIN portion only (so the held-out test set is a
fair, unseen evaluation), then build windows of shape
(num_samples, WINDOW, num_features). The target is the NEXT day's Close.
"""
from typing import Tuple

import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

from . import config


def build_matrix(ind_df: pd.DataFrame) -> np.ndarray:
    """Select FEATURES in the fixed order and return a float32 matrix."""
    return ind_df[config.FEATURES].astype("float32").values


def make_windows(scaled: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    """Sliding windows. X[i] = days [i, i+WINDOW); y[i] = Close at i+WINDOW."""
    X, y = [], []
    w = config.WINDOW
    close_idx = config.FEATURES.index(config.TARGET)
    for i in range(len(scaled) - w):
        X.append(scaled[i : i + w])
        y.append(scaled[i + w, close_idx])
    return np.asarray(X, dtype="float32"), np.asarray(y, dtype="float32")


def prepare(ind_df: pd.DataFrame):
    """Full pipeline -> train/test windows + fitted scaler.

    Returns: X_train, y_train, X_test, y_test, scaler
    """
    matrix = build_matrix(ind_df)
    split = int(len(matrix) * config.TRAIN_SPLIT)

    scaler = MinMaxScaler()
    scaler.fit(matrix[:split])              # fit on train only
    scaled = scaler.transform(matrix)

    # Build windows across the whole series, then split by the window's END
    # index so no test target leaks into training.
    X, y = make_windows(scaled)
    win_split = split - config.WINDOW
    win_split = max(1, win_split)

    X_train, y_train = X[:win_split], y[:win_split]
    X_test, y_test = X[win_split:], y[win_split:]
    return X_train, y_train, X_test, y_test, scaler


def invert_close(scaled_close, scaler: MinMaxScaler):
    """Inverse-scale ONLY the Close column (index 0) back to rupees."""
    close_idx = config.FEATURES.index(config.TARGET)
    lo = scaler.data_min_[close_idx]
    hi = scaler.data_max_[close_idx]
    return scaled_close * (hi - lo) + lo
