"""The StockLSTM model: a 2-layer LSTM that maps a window of features to the
next day's (scaled) closing price.
"""
import torch
import torch.nn as nn

from . import config


class StockLSTM(nn.Module):
    def __init__(
        self,
        n_features: int,
        hidden_size: int = config.HIDDEN_SIZE,
        num_layers: int = config.NUM_LAYERS,
        dropout: float = config.DROPOUT,
    ):
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=n_features,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0.0,
        )
        self.head = nn.Sequential(
            nn.Linear(hidden_size, hidden_size // 2),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_size // 2, 1),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: (batch, window, n_features)
        out, _ = self.lstm(x)
        last = out[:, -1, :]          # take the final timestep
        return self.head(last).squeeze(-1)  # (batch,)
