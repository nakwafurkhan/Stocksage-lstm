"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function Toggle({ on, onChange, label, hint }: { on: boolean; onChange: (v: boolean) => void; label: string; hint: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">{hint}</div>
      </div>
      <button
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-primary" : "bg-border"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${on ? "translate-x-[1.4rem]" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

export default function ReportPrefs() {
  const [daily, setDaily] = useState(false);
  const [weekly, setWeekly] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/report-prefs")
      .then((r) => r.json())
      .then((d) => {
        setDaily(!!d.daily);
        setWeekly(!!d.weekly);
        setEmail(d.email || "");
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  async function save(next: { daily: boolean; weekly: boolean }) {
    setDaily(next.daily);
    setWeekly(next.weekly);
    await fetch("/api/report-prefs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Email reports</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Get a digest of your <strong>watchlist</strong>{email ? <> at <strong>{email}</strong></> : null}. Build your watchlist on any stock page.
        </p>

        {!loaded ? (
          <div className="mt-4 flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
        ) : (
          <div className="mt-3 divide-y divide-border">
            <Toggle on={daily} onChange={(v) => save({ daily: v, weekly })} label="Daily digest" hint="Every weekday morning (08:00 IST)" />
            <Toggle on={weekly} onChange={(v) => save({ daily, weekly: v })} label="Weekly digest" hint="Monday mornings (08:00 IST)" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
