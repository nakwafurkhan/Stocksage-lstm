"use client";

import { useState } from "react";
import { Info } from "lucide-react";

/** Tiny info tooltip for explaining jargon. Hover (desktop) or tap (mobile). */
export default function InfoHint({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        aria-label="More info"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      {open && (
        <span className="absolute left-1/2 top-6 z-30 w-56 -translate-x-1/2 rounded-lg border border-border bg-card p-2 text-left text-xs font-normal leading-relaxed text-muted-foreground shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}
