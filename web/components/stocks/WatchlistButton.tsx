"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type State = "loading" | "in" | "out" | "anon";

export default function WatchlistButton({ symbol }: { symbol: string }) {
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await fetch("/api/watchlist");
      if (!active) return;
      if (res.status === 401) return setState("anon");
      const data = await res.json();
      setState(data.symbols?.includes(symbol) ? "in" : "out");
    })().catch(() => active && setState("out"));
    return () => {
      active = false;
    };
  }, [symbol]);

  if (state === "anon") {
    return (
      <Button asChild variant="outline">
        <Link href={`/sign-in?redirect=/stock/${encodeURIComponent(symbol)}`}>
          <Star className="h-4 w-4" /> Sign in to save
        </Link>
      </Button>
    );
  }

  async function toggle() {
    setBusy(true);
    try {
      if (state === "in") {
        await fetch(`/api/watchlist?symbol=${encodeURIComponent(symbol)}`, { method: "DELETE" });
        setState("out");
      } else {
        await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbol }),
        });
        setState("in");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button onClick={toggle} disabled={busy || state === "loading"} variant={state === "in" ? "default" : "outline"}>
      {busy || state === "loading" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Star className={`h-4 w-4 ${state === "in" ? "fill-current" : ""}`} />
      )}
      {state === "in" ? "In watchlist" : "Add to watchlist"}
    </Button>
  );
}
