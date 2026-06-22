// NIFTY 50 universe for the front-end.
//   yf  -> Yahoo Finance / prediction-API symbol (e.g. "RELIANCE.NS")
//   tv  -> TradingView widget symbol           (e.g. "NSE:RELIANCE")
//   name, sector -> display + filtering
// Keep this in sync with prediction-service/src/config.py.

export type Stock = {
  yf: string;
  tv: string;
  name: string;
  sector: string;
};

// TradingView symbol for the NIFTY 50 index itself.
export const NIFTY_INDEX_TV = "NSE:NIFTY";

export const NIFTY_50: Stock[] = [
  { yf: "RELIANCE.NS", tv: "NSE:RELIANCE", name: "Reliance Industries", sector: "Energy" },
  { yf: "TCS.NS", tv: "NSE:TCS", name: "Tata Consultancy Services", sector: "IT" },
  { yf: "HDFCBANK.NS", tv: "NSE:HDFCBANK", name: "HDFC Bank", sector: "Banking" },
  { yf: "ICICIBANK.NS", tv: "NSE:ICICIBANK", name: "ICICI Bank", sector: "Banking" },
  { yf: "INFY.NS", tv: "NSE:INFY", name: "Infosys", sector: "IT" },
  { yf: "HINDUNILVR.NS", tv: "NSE:HINDUNILVR", name: "Hindustan Unilever", sector: "FMCG" },
  { yf: "ITC.NS", tv: "NSE:ITC", name: "ITC", sector: "FMCG" },
  { yf: "SBIN.NS", tv: "NSE:SBIN", name: "State Bank of India", sector: "Banking" },
  { yf: "BHARTIARTL.NS", tv: "NSE:BHARTIARTL", name: "Bharti Airtel", sector: "Telecom" },
  { yf: "KOTAKBANK.NS", tv: "NSE:KOTAKBANK", name: "Kotak Mahindra Bank", sector: "Banking" },
  { yf: "LT.NS", tv: "NSE:LT", name: "Larsen & Toubro", sector: "Infrastructure" },
  { yf: "BAJFINANCE.NS", tv: "NSE:BAJFINANCE", name: "Bajaj Finance", sector: "Financials" },
  { yf: "AXISBANK.NS", tv: "NSE:AXISBANK", name: "Axis Bank", sector: "Banking" },
  { yf: "ASIANPAINT.NS", tv: "NSE:ASIANPAINT", name: "Asian Paints", sector: "Consumer" },
  { yf: "MARUTI.NS", tv: "NSE:MARUTI", name: "Maruti Suzuki", sector: "Auto" },
  { yf: "HCLTECH.NS", tv: "NSE:HCLTECH", name: "HCL Technologies", sector: "IT" },
  { yf: "SUNPHARMA.NS", tv: "NSE:SUNPHARMA", name: "Sun Pharma", sector: "Pharma" },
  { yf: "TITAN.NS", tv: "NSE:TITAN", name: "Titan Company", sector: "Consumer" },
  { yf: "ULTRACEMCO.NS", tv: "NSE:ULTRACEMCO", name: "UltraTech Cement", sector: "Cement" },
  { yf: "WIPRO.NS", tv: "NSE:WIPRO", name: "Wipro", sector: "IT" },
  { yf: "NESTLEIND.NS", tv: "NSE:NESTLEIND", name: "Nestle India", sector: "FMCG" },
  { yf: "ONGC.NS", tv: "NSE:ONGC", name: "Oil & Natural Gas Corp", sector: "Energy" },
  { yf: "NTPC.NS", tv: "NSE:NTPC", name: "NTPC", sector: "Power" },
  { yf: "POWERGRID.NS", tv: "NSE:POWERGRID", name: "Power Grid Corp", sector: "Power" },
  { yf: "M&M.NS", tv: "NSE:M_M", name: "Mahindra & Mahindra", sector: "Auto" },
  { yf: "TATAMOTORS.NS", tv: "NSE:TATAMOTORS", name: "Tata Motors", sector: "Auto" },
  { yf: "TATASTEEL.NS", tv: "NSE:TATASTEEL", name: "Tata Steel", sector: "Metals" },
  { yf: "JSWSTEEL.NS", tv: "NSE:JSWSTEEL", name: "JSW Steel", sector: "Metals" },
  { yf: "ADANIENT.NS", tv: "NSE:ADANIENT", name: "Adani Enterprises", sector: "Conglomerate" },
  { yf: "ADANIPORTS.NS", tv: "NSE:ADANIPORTS", name: "Adani Ports", sector: "Infrastructure" },
  { yf: "COALINDIA.NS", tv: "NSE:COALINDIA", name: "Coal India", sector: "Energy" },
  { yf: "GRASIM.NS", tv: "NSE:GRASIM", name: "Grasim Industries", sector: "Cement" },
  { yf: "HINDALCO.NS", tv: "NSE:HINDALCO", name: "Hindalco Industries", sector: "Metals" },
  { yf: "DRREDDY.NS", tv: "NSE:DRREDDY", name: "Dr. Reddy's Labs", sector: "Pharma" },
  { yf: "CIPLA.NS", tv: "NSE:CIPLA", name: "Cipla", sector: "Pharma" },
  { yf: "DIVISLAB.NS", tv: "NSE:DIVISLAB", name: "Divi's Laboratories", sector: "Pharma" },
  { yf: "BAJAJFINSV.NS", tv: "NSE:BAJAJFINSV", name: "Bajaj Finserv", sector: "Financials" },
  { yf: "BRITANNIA.NS", tv: "NSE:BRITANNIA", name: "Britannia Industries", sector: "FMCG" },
  { yf: "EICHERMOT.NS", tv: "NSE:EICHERMOT", name: "Eicher Motors", sector: "Auto" },
  { yf: "HEROMOTOCO.NS", tv: "NSE:HEROMOTOCO", name: "Hero MotoCorp", sector: "Auto" },
  { yf: "BPCL.NS", tv: "NSE:BPCL", name: "Bharat Petroleum", sector: "Energy" },
  { yf: "INDUSINDBK.NS", tv: "NSE:INDUSINDBK", name: "IndusInd Bank", sector: "Banking" },
  { yf: "APOLLOHOSP.NS", tv: "NSE:APOLLOHOSP", name: "Apollo Hospitals", sector: "Healthcare" },
  { yf: "TECHM.NS", tv: "NSE:TECHM", name: "Tech Mahindra", sector: "IT" },
  { yf: "TATACONSUM.NS", tv: "NSE:TATACONSUM", name: "Tata Consumer Products", sector: "FMCG" },
  { yf: "SBILIFE.NS", tv: "NSE:SBILIFE", name: "SBI Life Insurance", sector: "Insurance" },
  { yf: "HDFCLIFE.NS", tv: "NSE:HDFCLIFE", name: "HDFC Life Insurance", sector: "Insurance" },
  { yf: "BAJAJ-AUTO.NS", tv: "NSE:BAJAJ_AUTO", name: "Bajaj Auto", sector: "Auto" },
  { yf: "LTIM.NS", tv: "NSE:LTIM", name: "LTIMindtree", sector: "IT" },
  { yf: "SHRIRAMFIN.NS", tv: "NSE:SHRIRAMFIN", name: "Shriram Finance", sector: "Financials" },
];

// A handful of large, well-known names to feature on the homepage grid.
export const FEATURED_SYMBOLS = [
  "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS",
  "ICICIBANK.NS", "SBIN.NS", "BHARTIARTL.NS", "ITC.NS",
];

export const FEATURED: Stock[] = NIFTY_50.filter((s) =>
  FEATURED_SYMBOLS.includes(s.yf)
);

export const SECTORS = Array.from(new Set(NIFTY_50.map((s) => s.sector))).sort();

export function findStock(yf: string): Stock | undefined {
  return NIFTY_50.find((s) => s.yf.toUpperCase() === yf.toUpperCase());
}
