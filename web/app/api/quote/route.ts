import { NextRequest, NextResponse } from "next/server";

// Best-effort latest price from Yahoo Finance (used for portfolio P&L).
// Returns { price: number | null } — null if the upstream is unavailable or
// rate-limited, so the UI can degrade gracefully.
export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "symbol required" }, { status: 400 });
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      symbol
    )}?range=1d&interval=1d`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; StockSage/1.0)" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = await res.json();
    const meta = data?.chart?.result?.[0]?.meta;
    const price: number | null =
      meta?.regularMarketPrice ?? meta?.previousClose ?? null;
    return NextResponse.json({ symbol, price, currency: meta?.currency ?? "INR" });
  } catch {
    return NextResponse.json({ symbol, price: null });
  }
}
