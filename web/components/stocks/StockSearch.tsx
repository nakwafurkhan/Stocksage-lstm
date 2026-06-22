"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { NIFTY_50, SECTORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function StockSearch() {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string | null>(null);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    return NIFTY_50.filter((s) => {
      const matchesText =
        !query || `${s.name} ${s.yf} ${s.sector}`.toLowerCase().includes(query);
      const matchesSector = !sector || s.sector === sector;
      return matchesText && matchesSector;
    });
  }, [q, sector]);

  return (
    <div>
      {/* Search box */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search NIFTY 50 — e.g. Reliance, TCS, banking…"
          className="h-12 w-full rounded-full border border-border bg-card pl-12 pr-4 text-base outline-none transition-shadow focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Sector chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSector(null)}
          className={cn(
            "rounded-full border px-3 py-1 text-sm transition-colors",
            sector === null ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          All
        </button>
        {SECTORS.map((s) => (
          <button
            key={s}
            onClick={() => setSector(s)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              sector === s ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Results */}
      <p className="mt-6 text-sm text-muted-foreground">{results.length} stocks</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((s) => (
          <Link
            key={s.yf}
            href={`/stock/${encodeURIComponent(s.yf)}`}
            className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.3)]"
          >
            <div>
              <div className="font-medium tracking-tight">{s.name}</div>
              <div className="text-xs text-muted-foreground">{s.yf.replace(".NS", "")} · NSE</div>
            </div>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
              {s.sector}
            </span>
          </Link>
        ))}
      </div>

      {results.length === 0 && (
        <p className="mt-10 text-center text-muted-foreground">No stocks match your search.</p>
      )}
    </div>
  );
}
