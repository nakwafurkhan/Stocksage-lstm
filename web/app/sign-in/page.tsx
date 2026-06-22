import { Suspense } from "react";
import SignInForm from "@/components/auth/SignInForm";

export const metadata = {
  title: "Sign in — StockSage",
};

export default function SignInPage() {
  return (
    <div className="hero-spot flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6 py-16">
      <Suspense fallback={<div className="text-muted-foreground">Loading…</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
