import { NextRequest, NextResponse } from "next/server";
import { fetchQuote } from "@/lib/quote";

// Best-effort latest price for portfolio P&L. Returns { price: number | null }.
export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "symbol required" }, { status: 400 });
  }
  const price = await fetchQuote(symbol);
  return NextResponse.json({ symbol, price });
}
