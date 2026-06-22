"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, GraduationCap } from "lucide-react";

export default function OnboardingBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(localStorage.getItem("ss-onboarded") !== "1");
  }, []);

  if (!show) return null;

  function dismiss() {
    localStorage.setItem("ss-onboarded", "1");
    setShow(false);
  }

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-primary/30 bg-primary/5 p-5">
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <GraduationCap className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-semibold">New to investing? Welcome 👋</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse a stock to see its chart, news and an AI forecast. Save favourites to your
            watchlist, track holdings in your portfolio, and ask the chat assistant anything.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link href="/stocks" className="font-medium text-primary hover:underline">Browse stocks →</Link>
            <Link href="/glossary" className="font-medium text-primary hover:underline">Read the glossary →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
