"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Maximize2, X } from "lucide-react";

type Props = {
  /** Title shown in the modal header */
  title: string;
  /** Render the widget. `expanded` is true inside the modal (render it larger). */
  render: (expanded: boolean) => ReactNode;
};

/**
 * Wraps any chart/widget with a small "expand" button that opens it in a large,
 * focused modal. Closes on Escape, backdrop click, or the X.
 * The modal is portaled to <body> so it can't be clipped by card overflow or
 * Framer Motion transforms.
 */
export default function ExpandableWidget({ title, render }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label={`Expand ${title}`}
        title="Expand"
        className="absolute right-2 top-2 z-20 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground"
      >
        <Maximize2 className="h-4 w-4" />
      </button>

      {render(false)}

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 sm:p-6"
            onClick={() => setOpen(false)}
          >
            <div
              className="relative flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h3 className="font-semibold tracking-tight">{title}</h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="min-h-0 flex-1 p-2 sm:p-3">{render(true)}</div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
