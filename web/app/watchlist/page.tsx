"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Loader2, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MiniSymbolOverview from "@/components/widgets/MiniSymbolOverview";
import { findStock } from "@/lib/constants";

export default function WatchlistPage() {
  const [symbols, setSymbols] = useState<string[] | null>(null);

  useEffect(() => {
    fetch("/api/watchlist")
      .then((r) => r.json())
      .then((d) => setSymbols(d.symbols || []))
      .catch(() => setSymbols([]));
  }, []);

  async function remove(symbol: string) {
    setSymbols((prev) => prev?.filter((s) => s !== symbol) ?? prev);
    await fetch(`/api/watchlist?symbol=${encodeURIComponent(symbol)}`, { method: "DELETE" });
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-semibold tracking-tightest sm:text-4xl">Your watchlist</h1>
      <p className="mt-2 text-muted-foreground">Stocks you&apos;re keeping an eye on.</p>

      {symbols === null ? (
        <div className="mt-10 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading…
        </div>
      ) : symbols.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
          <Star className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">Your watchlist is empty.</p>
          <Button asChild className="mt-4">
            <Link href="/stocks">Browse stocks</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {symbols.map((sym) => {
            const stock = findStock(sym);
            if (!stock) return null;
            return (
              <Card key={sym} className="overflow-hidden">
                <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                  <Link href={`/stock/${encodeURIComponent(sym)}`}>
                    <CardTitle className="text-base hover:text-primary">{stock.name}</CardTitle>
                  </Link>
                  <Button onClick={() => remove(sym)} variant="ghost" size="icon" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="px-2 pb-3">
                  <Link href={`/stock/${encodeURIComponent(sym)}`} className="block">
                    {/* visual only — click opens the detail page, not TradingView */}
                    <div className="pointer-events-none">
                      <MiniSymbolOverview symbol={stock.tv} height={130} />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
