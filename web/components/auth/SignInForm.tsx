"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/lib/auth-client";
import { DEMO_ACCOUNT } from "@/lib/demo";

export default function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<null | "form" | "demo">(null);
  const [error, setError] = useState<string | null>(null);

  function done() {
    router.push(redirect);
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading("form");
    try {
      if (mode === "signup") {
        const { error } = await signUp.email({ email, password, name: name || email.split("@")[0] });
        if (error) {
          setError(error.message || "Could not create your account.");
          return;
        }
      } else {
        const { error } = await signIn.email({ email, password });
        if (error) {
          setError(error.message || "Wrong email or password.");
          return;
        }
      }
      done();
    } finally {
      setLoading(null);
    }
  }

  async function handleDemo() {
    setError(null);
    setLoading("demo");
    const res = await signIn.email({ email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password });
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
    done();
  }

  const busy = loading !== null;

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.2)]">
        <h1 className="text-2xl font-semibold tracking-tightest">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signup"
            ? "Sign up to save watchlists, track a portfolio, and get reports."
            : "Sign in to your StockSage account."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          )}
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="password"
            required
            minLength={8}
            placeholder="Password (8+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <Button type="submit" disabled={busy} size="lg" className="w-full">
            {loading === "form" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-4 w-4" />}
            {mode === "signup" ? "Create account" : "Sign in"}
          </Button>
        </form>

        <p className="mt-3 text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Already have an account?" : "New to StockSage?"}{" "}
          <button
            type="button"
            onClick={() => {
              setError(null);
              setMode(mode === "signup" ? "signin" : "signup");
            }}
            className="font-medium text-primary hover:underline"
          >
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </p>

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        <Button onClick={handleDemo} disabled={busy} variant="secondary" size="lg" className="w-full">
          {loading === "demo" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Try the demo — no signup
        </Button>

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
