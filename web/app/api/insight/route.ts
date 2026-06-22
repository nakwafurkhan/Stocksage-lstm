import { NextRequest, NextResponse } from "next/server";
import { findStock } from "@/lib/constants";
import { fetchQuote } from "@/lib/quote";
import { llmGenerate, LlmNotConfigured } from "@/lib/llm";

const SYSTEM =
  "You are StockSage, a friendly guide who explains the Indian stock market to complete beginners. Use plain English and explain any term simply. Be concise, balanced and encouraging. Never give financial advice or tell anyone to buy or sell.";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol") || "";
  const stock = findStock(symbol);
  if (!stock) {
    return NextResponse.json({ error: "Unknown stock" }, { status: 404 });
  }

  const price = await fetchQuote(stock.yf);
  const priceLine = price ? `Its latest price is about ₹${Math.round(price)}.` : "";

  const prompt = `Give a beginner-friendly overview of ${stock.name} (${stock.yf.replace(
    ".NS",
    ""
  )}), an Indian ${stock.sector} company listed on the NSE. ${priceLine}

Write three short paragraphs:
1) What the company does, in simple words.
2) What matters about the ${stock.sector} sector for a beginner.
3) What a new investor should keep in mind when looking at a stock like this (e.g. doing research, thinking long-term, diversifying).

Finish with one sentence reminding the reader this is educational information, not financial advice.`;

  try {
    const text = await llmGenerate({ system: SYSTEM, prompt, maxTokens: 520 });
    return NextResponse.json({ text });
  } catch (e) {
    if (e instanceof LlmNotConfigured) {
      return NextResponse.json(
        { error: "AI is not configured. Add GROQ_API_KEY in web/.env.local." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: e instanceof Error ? e.message : "AI error" }, { status: 502 });
  }
}
