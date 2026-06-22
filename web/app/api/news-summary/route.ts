import { NextRequest, NextResponse } from "next/server";
import { findStock } from "@/lib/constants";
import { llmGenerate, LlmNotConfigured } from "@/lib/llm";

const SYSTEM =
  "You are StockSage, explaining companies to beginners in plain English. Be factual, concise and balanced. Never give financial advice.";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol") || "";
  const stock = findStock(symbol);
  if (!stock) {
    return NextResponse.json({ error: "Unknown stock" }, { status: 404 });
  }

  const prompt = `In 3 to 5 short, beginner-friendly bullet points, summarize what ${stock.name} (NSE: ${stock.yf.replace(
    ".NS",
    ""
  )}) does and the kinds of things that typically move a stock like this (its business, its ${stock.sector} sector, and common risks).

Important: you may not have the very latest headlines, so do NOT invent specific recent events or dates. Keep it to general, durable context. End by suggesting the reader check the live news feed below for current headlines, and add a one-line reminder this is educational, not financial advice.`;

  try {
    const text = await llmGenerate({ system: SYSTEM, prompt, maxTokens: 600 });
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
