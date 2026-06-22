"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Plus, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NIFTY_50, findStock } from "@/lib/constants";

type Alert = { id: string; symbol: string; kind: string; threshold: number; active: boolean };

const KIND_LABEL: Record<string, string> = {
  price_above: "Price rises above ₹",
  price_below: "Price falls below ₹",
  volume_above: "Volume rises above ",
};

export default function AlertsManager() {
  const [alerts, setAlerts] = useState<Alert[] | null>(null);
  const [symbol, setSymbol] = useState(NIFTY_50[0].yf);
  const [kind, setKind] = useState("price_above");
  const [threshold, setThreshold] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch("/api/alerts");
    const data = await res.json();
    setAlerts(data.alerts || []);
  }
  useEffect(() => {
    load().catch(() => setAlerts([]));
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, kind, threshold: Number(threshold) }),
      });
      setThreshold("");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setAlerts((prev) => prev?.filter((a) => a.id !== id) ?? prev);
    await fetch(`/api/alerts?id=${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <Card>
        <CardContent className="p-5">
          <form onSubmit={add} className="grid gap-3 sm:grid-cols-[2fr_2fr_1.2fr_auto] sm:items-end">
            <label className="text-sm">
              <span className="text-muted-foreground">Stock</span>
              <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-border bg-card px-3 outline-none focus:ring-2 focus:ring-ring">
                {NIFTY_50.map((s) => (
                  <option key={s.yf} value={s.yf}>{s.name}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="text-muted-foreground">Condition</span>
              <select value={kind} onChange={(e) => setKind(e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-border bg-card px-3 outline-none focus:ring-2 focus:ring-ring">
                <option value="price_above">Price rises above</option>
                <option value="price_below">Price falls below</option>
                <option value="volume_above">Volume rises above</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="text-muted-foreground">{kind === "volume_above" ? "Shares" : "Price (₹)"}</span>
              <input type="number" min="0" step="any" required value={threshold} onChange={(e) => setThreshold(e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-border bg-card px-3 outline-none focus:ring-2 focus:ring-ring" />
            </label>
            <Button type="submit" disabled={busy} size="lg">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6">
        {alerts === null ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Loading…</div>
        ) : alerts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            <Bell className="mx-auto h-8 w-8" />
            <p className="mt-3">No alerts yet. Create one above — we&apos;ll email you when it triggers.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((a) => {
              const stock = findStock(a.symbol);
              return (
                <Card key={a.id}>
                  <CardContent className="flex items-center justify-between gap-3 p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary"><Bell className="h-4 w-4" /></span>
                      <div className="text-sm">
                        <span className="font-medium">{stock?.name ?? a.symbol}</span>{" "}
                        <span className="text-muted-foreground">
                          {KIND_LABEL[a.kind]}{a.threshold.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                    <Button onClick={() => remove(a.id)} variant="ghost" size="icon" aria-label="Remove"><Trash2 className="h-4 w-4" /></Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
