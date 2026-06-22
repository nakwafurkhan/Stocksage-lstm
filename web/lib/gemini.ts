// Minimal server-side client for Google's Gemini API (REST).
// Used by AI insights, news summaries, and the chatbot.
// Requires GEMINI_API_KEY (see ../SETUP.md). Optional GEMINI_MODEL.

const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

export class GeminiNotConfigured extends Error {
  constructor() {
    super("GEMINI_API_KEY is not set");
    this.name = "GeminiNotConfigured";
  }
}

export type GeminiMessage = { role: "user" | "model"; text: string };

type GenerateOptions = {
  system?: string;
  prompt?: string;
  messages?: GeminiMessage[];
  useSearch?: boolean;
  temperature?: number;
  maxTokens?: number;
};

export async function geminiGenerate(opts: GenerateOptions): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new GeminiNotConfigured();

  const contents = opts.messages
    ? opts.messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] }))
    : [{ role: "user", parts: [{ text: opts.prompt ?? "" }] }];

  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: opts.temperature ?? 0.6,
      maxOutputTokens: opts.maxTokens ?? 600,
    },
  };
  if (opts.system) body.system_instruction = { parts: [{ text: opts.system }] };
  if (opts.useSearch) body.tools = [{ google_search: {} }];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .map((p: { text?: string }) => p.text)
    .filter(Boolean)
    .join("\n")
    .trim();
  if (!text) throw new Error("Empty response from Gemini");
  return text;
}
