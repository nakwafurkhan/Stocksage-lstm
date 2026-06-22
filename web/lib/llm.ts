// Minimal server-side LLM client using Groq's OpenAI-compatible API.
// Powers AI insights, news summaries, and the chatbot.
// Requires GROQ_API_KEY (free at https://console.groq.com). Optional GROQ_MODEL.

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export class LlmNotConfigured extends Error {
  constructor() {
    super("GROQ_API_KEY is not set");
    this.name = "LlmNotConfigured";
  }
}

export type ChatMessage = { role: "user" | "assistant"; content: string };

type GenerateOptions = {
  system?: string;
  prompt?: string;
  messages?: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
};

export async function llmGenerate(opts: GenerateOptions): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new LlmNotConfigured();

  const messages: { role: string; content: string }[] = [];
  if (opts.system) messages.push({ role: "system", content: opts.system });
  if (opts.messages) {
    for (const m of opts.messages) messages.push({ role: m.role, content: m.content });
  } else if (opts.prompt) {
    messages.push({ role: "user", content: opts.prompt });
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: opts.temperature ?? 0.6,
      max_tokens: opts.maxTokens ?? 600,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Groq ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  const text: string = data?.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text) throw new Error("Empty response from Groq");
  return text;
}
