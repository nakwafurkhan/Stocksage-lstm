"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/lib/auth-client";
import { DEMO_ACCOUNT } from "@/lib/demo";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.85 0-5.27-1.93-6.13-4.52H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.87 14.1a6.6 6.6 0 0 1 0-4.22V7.04H2.18a11 11 0 0 0 0 9.9l3.69-2.84z" />
      <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.04l3.69 2.84C6.73 6.68 9.15 4.75 12 4.75z" />
    </svg>
  );
}

export default function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";
  const [loading, setLoading] = useState<null | "google" | "demo">(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setError(null);
    setLoading("google");
    const { error } = await signIn.social({ provider: "google", callbackURL: redirect });
    if (error) {
      setError(error.message || "Google sign-in failed. Is the OAuth client configured?");
      setLoading(null);
    }
  }

  async function handleDemo() {
    setError(null);
    setLoading("demo");
    // Try signing in; if the demo account doesn't exist yet, create it.
    const res = await signIn.email({
      email: DEMO_ACCOUNT.email,
      password: DEMO_ACCOUNT.password,
    });
    if (res.error) {
      const created = await signUp.email({
        email: DEMO_ACCOUNT.email,
        password: DEMO_ACCOUNT.password,
        name: DEMO_ACCOUNT.name,
      });
      if (created.error) {
        setError(created.error.message || "Could not start the demo. Check MONGODB_URI.");
        setLoading(null);
        return;
      }
    }
    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.2)]">
        <h1 className="text-2xl font-semibold tracking-tightest">Welcome to StockSage</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to save watchlists, track a portfolio, and get reports.
        </p>

        <div className="mt-7 space-y-3">
          <Button
            onClick={handleGoogle}
            disabled={loading !== null}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            {loading === "google" ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </Button>

          <Button
            onClick={handleDemo}
            disabled={loading !== null}
            size="lg"
            className="w-full"
          >
            {loading === "demo" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Try the demo — no signup
          </Button>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree this is an educational tool — not financial advice.
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">← Back to home</Link>
      </p>
    </div>
  );
}
