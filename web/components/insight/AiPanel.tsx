"use client";

import { useState } from "react";
import { Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  symbol: string;
  endpoint: string; // e.g. "/api/insight"
  title: string;
  description: string;
  cta: string;
};

/** On-demand AI text panel (used for stock insights and news summaries). */
export default function AiPanel({ symbol, endpoint, title, description, cta }: Props) {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${endpoint}?symbol=${encodeURIComponent(symbol)}`);
      const data = await res.json();
      if (!res.ok) setError(data.error || "AI is unavailable right now.");
      else setText(data.text);
    } catch {
      setError("Could not reach the AI service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{title}</h3>
        </div>

        {text ? (
          <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {text}
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            <Button onClick={run} disabled={loading} className="mt-4" size="sm">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {cta}
            </Button>
          </>
        )}

        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-secondary p-3 text-sm text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
