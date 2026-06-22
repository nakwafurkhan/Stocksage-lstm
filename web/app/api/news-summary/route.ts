import { NextRequest, NextResponse } from "next/server";
import { findStock } from "@/lib/constants";
import { geminiGenerate, GeminiNotConfigured } from "@/lib/gemini";

const SYSTEM =
  "You are StockSage, explaining market news to beginners in plain English. Be factual, concise and balanced. Never give financial advice.";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol") || "";
  const stock = findStock(symbol);
  if (!stock) {
    return NextResponse.json({ error: "Unknown stock" }, { status: 404 });
  }

  const prompt = `Summarize the most recent news and developments about ${stock.name} (NSE: ${stock.yf.replace(
    ".NS",
    ""
  )}), an Indian company, from roughly the last few weeks. Give 3 to 5 short bullet points a beginner can understand. If you don't have recent information, say so honestly rather than guessing. End with a one-line reminder that this is educational, not financial advice.`;

  // Try with Google Search grounding for fresh news; fall back to a plain
  // generation if grounding is unavailable on this API key.
  try {
    const text = await geminiGenerate({ system: SYSTEM, prompt, useSearch: true, maxTokens: 600 });
    return NextResponse.json({ text, grounded: true });
  } catch (e) {
    if (e instanceof GeminiNotConfigured) {
      return NextResponse.json(
        { error: "AI is not configured. Add GEMINI_API_KEY in web/.env.local." },
        { status: 503 }
      );
    }
    try {
      const text = await geminiGenerate({ system: SYSTEM, prompt, maxTokens: 600 });
      return NextResponse.json({ text, grounded: false });
    } catch (e2) {
      return NextResponse.json({ error: e2 instanceof Error ? e2.message : "AI error" }, { status: 502 });
    }
  }
}
