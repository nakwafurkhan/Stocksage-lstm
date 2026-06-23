"""Central configuration for the StockSage-NIFTY prediction service.

Everything that controls *what* we predict and *how* the LSTM is trained lives
here, so you only edit one file when you want to tweak the model or the universe
of stocks.
"""
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_RAW = BASE_DIR / "data" / "raw"
DATA_PROCESSED = BASE_DIR / "data" / "processed"
MODELS_DIR = BASE_DIR / "models" / "saved"

for _p in (DATA_RAW, DATA_PROCESSED, MODELS_DIR):
    _p.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# Stock universe: NIFTY 50 (NSE). Yahoo Finance uses the ".NS" suffix for NSE.
# This list is a representative NIFTY 50 set; constituents change over time, so
# treat it as a starting point you can edit freely.
# ---------------------------------------------------------------------------
NIFTY_50 = [
    "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "ICICIBANK.NS", "INFY.NS",
    "HINDUNILVR.NS", "ITC.NS", "SBIN.NS", "BHARTIARTL.NS", "KOTAKBANK.NS",
    "LT.NS", "BAJFINANCE.NS", "AXISBANK.NS", "ASIANPAINT.NS", "MARUTI.NS",
    "HCLTECH.NS", "SUNPHARMA.NS", "TITAN.NS", "ULTRACEMCO.NS", "WIPRO.NS",
    "NESTLEIND.NS", "ONGC.NS", "NTPC.NS", "POWERGRID.NS", "M&M.NS",
    "TMPV.NS", "TATASTEEL.NS", "JSWSTEEL.NS", "ADANIENT.NS", "ADANIPORTS.NS",
    "COALINDIA.NS", "GRASIM.NS", "HINDALCO.NS", "DRREDDY.NS", "CIPLA.NS",
    "DIVISLAB.NS", "BAJAJFINSV.NS", "BRITANNIA.NS", "EICHERMOT.NS", "HEROMOTOCO.NS",
    "BPCL.NS", "INDUSINDBK.NS", "APOLLOHOSP.NS", "TECHM.NS", "TATACONSUM.NS",
    "SBILIFE.NS", "HDFCLIFE.NS", "BAJAJ-AUTO.NS", "LTIM.NS", "SHRIRAMFIN.NS",
]

# Friendly display names for the UI / search (extend as you like).
DISPLAY_NAMES = {
    "RELIANCE.NS": "Reliance Industries",
    "TCS.NS": "Tata Consultancy Services",
    "HDFCBANK.NS": "HDFC Bank",
    "ICICIBANK.NS": "ICICI Bank",
    "INFY.NS": "Infosys",
    "HINDUNILVR.NS": "Hindustan Unilever",
    "ITC.NS": "ITC",
    "SBIN.NS": "State Bank of India",
    "BHARTIARTL.NS": "Bharti Airtel",
    "KOTAKBANK.NS": "Kotak Mahindra Bank",
    "LT.NS": "Larsen & Toubro",
    "BAJFINANCE.NS": "Bajaj Finance",
    "AXISBANK.NS": "Axis Bank",
    "ASIANPAINT.NS": "Asian Paints",
    "MARUTI.NS": "Maruti Suzuki",
    "HCLTECH.NS": "HCL Technologies",
    "SUNPHARMA.NS": "Sun Pharma",
    "TITAN.NS": "Titan Company",
    "ULTRACEMCO.NS": "UltraTech Cement",
    "WIPRO.NS": "Wipro",
    "NESTLEIND.NS": "Nestle India",
    "ONGC.NS": "Oil & Natural Gas Corp",
    "NTPC.NS": "NTPC",
    "POWERGRID.NS": "Power Grid Corp",
    "M&M.NS": "Mahindra & Mahindra",
    "TMPV.NS": "Tata Motors (Passenger Vehicles)",
    "TATASTEEL.NS": "Tata Steel",
    "JSWSTEEL.NS": "JSW Steel",
    "ADANIENT.NS": "Adani Enterprises",
    "ADANIPORTS.NS": "Adani Ports",
    "COALINDIA.NS": "Coal India",
    "GRASIM.NS": "Grasim Industries",
    "HINDALCO.NS": "Hindalco Industries",
    "DRREDDY.NS": "Dr. Reddy's Labs",
    "CIPLA.NS": "Cipla",
    "DIVISLAB.NS": "Divi's Laboratories",
    "BAJAJFINSV.NS": "Bajaj Finserv",
    "BRITANNIA.NS": "Britannia Industries",
    "EICHERMOT.NS": "Eicher Motors",
    "HEROMOTOCO.NS": "Hero MotoCorp",
    "BPCL.NS": "Bharat Petroleum",
    "INDUSINDBK.NS": "IndusInd Bank",
    "APOLLOHOSP.NS": "Apollo Hospitals",
    "TECHM.NS": "Tech Mahindra",
    "TATACONSUM.NS": "Tata Consumer Products",
    "SBILIFE.NS": "SBI Life Insurance",
    "HDFCLIFE.NS": "HDFC Life Insurance",
    "BAJAJ-AUTO.NS": "Bajaj Auto",
    "LTIM.NS": "LTIMindtree",
    "SHRIRAMFIN.NS": "Shriram Finance",
}

# ---------------------------------------------------------------------------
# Feature columns fed to the LSTM. "Close" must stay at index 0 because it is
# also our prediction target (we invert just that column when forecasting).
# 1 price column + 12 technical indicators = 13 features.
# ---------------------------------------------------------------------------
FEATURES = [
    "Close",        # target + short-term level
    "SMA_20",       # 20-day simple moving average (short trend)
    "SMA_50",       # 50-day simple moving average (medium trend)
    "EMA_12",       # 12-day exponential MA (fast trend)
    "EMA_26",       # 26-day exponential MA (slow trend)
    "MACD",         # EMA_12 - EMA_26 (momentum)
    "MACD_signal",  # 9-day EMA of MACD (momentum crossovers)
    "RSI_14",       # relative strength index (overbought/oversold)
    "BB_upper",     # Bollinger upper band (volatility envelope)
    "BB_lower",     # Bollinger lower band
    "ATR_14",       # average true range (volatility)
    "OBV",          # on-balance volume (volume pressure)
    "ROC_10",       # 10-day rate of change (momentum)
]
TARGET = "Close"

# ---------------------------------------------------------------------------
# Data + model hyperparameters
# ---------------------------------------------------------------------------
HISTORY_PERIOD = "10y"   # ~10 years of daily candles (your requirement)
WINDOW = 60              # look-back window: model sees 60 trading days
HORIZON = 30             # default forecast length (trading days ahead)
TRAIN_SPLIT = 0.85       # first 85% train, last 15% held-out test

HIDDEN_SIZE = 128
NUM_LAYERS = 2
DROPOUT = 0.2
EPOCHS = 60
BATCH_SIZE = 32
LEARNING_RATE = 1e-3
EARLY_STOP_PATIENCE = 8

SEED = 42
