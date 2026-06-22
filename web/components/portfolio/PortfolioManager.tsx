"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Trash2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NIFTY_50, findStock } from "@/lib/constants";

type Holding = { id: string; symbol: string; quantity: number; buyPrice: number };

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

export default function PortfolioManager() {
  const [holdings, setHoldings] = useState<Holding[] | null>(null);
  const [prices, setPrices] = useState<Record<string, number | null>>({});
  const [symbol, setSymbol] = useState(NIFTY_50[0].yf);
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch("/api/portfolio");
    const data = await res.json();
    const hs: Holding[] = data.holdings || [];
    setHoldings(hs);
    const syms = Array.from(new Set(hs.map((h) => h.symbol)));
    const entries = await Promise.all(
      syms.map(async (sym) => {
        try {
          const q = await (await fetch(`/api/quote?symbol=${encodeURIComponent(sym)}`)).json();
          return [sym, (q.price as number) ?? null] as const;
        } catch {
          return [sym, null] as const;
        }
      })
    );
    setPrices(Object.fromEntries(entries));
  }

  useEffect(() => {
    load().catch(() => setHoldings([]));
  }, []);

  async function addHolding(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, quantity: Number(quantity), buyPrice: Number(buyPrice) }),
      });
      setQuantity("");
      setBuyPrice("");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setHoldings((prev) => prev?.filter((h) => h.id !== id) ?? prev);
    await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" });
  }

  const totals = useMemo(() => {
    let invested = 0;
    let current = 0;
    let priced = true;
    for (const h of holdings ?? []) {
      invested += h.quantity * h.buyPrice;
      const p = prices[h.symbol];
      if (p == null) priced = false;
      else current += h.quantity * p;
    }
    return { invested, current, priced, gain: current - invested };
  }, [holdings, prices]);

  return (
    <div>
      {/* Add holding form */}
      <Card>
        <CardContent className="p-5">
          <form onSubmit={addHolding} className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end">
            <label className="text-sm">
              <span className="text-muted-foreground">Stock</span>
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-border bg-card px-3 outline-none focus:ring-2 focus:ring-ring"
              >
                {NIFTY_50.map((s) => (
                  <option key={s.yf} value={s.yf}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="text-muted-foreground">Quantity</span>
              <input
                type="number" min="0" step="any" required value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-border bg-card px-3 outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="text-sm">
              <span className="text-muted-foreground">Buy price (₹)</span>
              <input
                type="number" min="0" step="any" required value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-border bg-card px-3 outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <Button type="submit" disabled={busy} size="lg">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-5">
          <div className="text-sm text-muted-foreground">Invested</div>
          <div className="mt-1 text-2xl font-semibold tracking-tightest">{inr(totals.invested)}</div>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="text-sm text-muted-foreground">Current value</div>
          <div className="mt-1 text-2xl font-semibold tracking-tightest">
            {totals.priced ? inr(totals.current) : "—"}
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="text-sm text-muted-foreground">Total gain / loss</div>
          <div className={`mt-1 text-2xl font-semibold tracking-tightest ${totals.priced ? (totals.gain >= 0 ? "text-success" : "text-danger") : ""}`}>
            {totals.priced ? `${totals.gain >= 0 ? "+" : ""}${inr(totals.gain)}` : "—"}
          </div>
        </CardContent></Card>
      </div>

      {!totals.priced && (holdings?.length ?? 0) > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Live prices are temporarily unavailable for some holdings, so current value is hidden.
        </p>
      )}

      {/* Holdings table */}
      <div className="mt-6">
        {holdings === null ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading…
          </div>
        ) : holdings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No holdings yet — add your first above.
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-left text-muted-foreground">
                  <tr>
                    <th className="p-4 font-medium">Stock</th>
                    <th className="p-4 text-right font-medium">Qty</th>
                    <th className="p-4 text-right font-medium">Buy ₹</th>
                    <th className="p-4 text-right font-medium">Now ₹</th>
                    <th className="p-4 text-right font-medium">Value</th>
                    <th className="p-4 text-right font-medium">Gain/Loss</th>
                    <th className="p-4" />
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h) => {
                    const stock = findStock(h.symbol);
                    const price = prices[h.symbol];
                    const value = price != null ? h.quantity * price : null;
                    const gain = value != null ? value - h.quantity * h.buyPrice : null;
                    return (
                      <tr key={h.id} className="border-b border-border last:border-0">
                        <td className="p-4 font-medium">{stock?.name ?? h.symbol}</td>
                        <td className="p-4 text-right">{h.quantity}</td>
                        <td className="p-4 text-right">{h.buyPrice.toLocaleString("en-IN")}</td>
                        <td className="p-4 text-right">{price != null ? price.toLocaleString("en-IN") : "—"}</td>
                        <td className="p-4 text-right">{value != null ? inr(value) : "—"}</td>
                        <td className={`p-4 text-right ${gain == null ? "" : gain >= 0 ? "text-success" : "text-danger"}`}>
                          {gain != null ? `${gain >= 0 ? "+" : ""}${inr(gain)}` : "—"}
                        </td>
                        <td className="p-4 text-right">
                          <Button onClick={() => remove(h.id)} variant="ghost" size="icon" aria-label="Remove">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
