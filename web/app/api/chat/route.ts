import { NextRequest, NextResponse } from "next/server";
import { llmGenerate, LlmNotConfigured, type ChatMessage } from "@/lib/llm";

const SYSTEM =
  "You are StockSage's friendly assistant. You explain the Indian stock market — NIFTY 50, NSE/BSE, SEBI, and terms like P/E ratio, dividends, market cap, indices — to absolute beginners. Keep replies short (2-4 sentences), warm, and free of jargon (or explain any term you use). You can also explain how to use the StockSage app (watchlist, portfolio, forecasts). Never give financial advice or specific buy/sell recommendations; if asked, gently decline and explain you're here to educate, not advise.";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const raw = Array.isArray(body.messages) ? body.messages : [];
  const messages: ChatMessage[] = raw
    .slice(-12)
    .map((m: { role?: string; content?: string }) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || ""),
    }))
    .filter((m: ChatMessage) => m.content.trim().length > 0);

  if (messages.length === 0) {
    return NextResponse.json({ error: "no messages" }, { status: 400 });
  }

  try {
    const reply = await llmGenerate({ system: SYSTEM, messages, temperature: 0.7, maxTokens: 400 });
    return NextResponse.json({ reply });
  } catch (e) {
    if (e instanceof LlmNotConfigured) {
      return NextResponse.json({
        reply:
          "I'm not switched on yet — add a GROQ_API_KEY in web/.env.local to enable the AI assistant. 🙂",
      });
    }
    return NextResponse.json({
      reply: "Sorry, I hit a snag reaching the AI service. Please try again in a moment.",
    });
  }
}
