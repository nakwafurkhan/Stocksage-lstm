import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/motion/Reveal";

export default function CTA() {
  return (
    <section className="container py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground px-6 py-16 text-center text-background sm:py-20">
          <div className="hero-spot pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tightest sm:text-5xl">
              Start exploring the market today.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-background/70">
              It&apos;s free, beginner-friendly, and you can try the full demo
              without creating an account.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link href="/dashboard">
                  Try the demo <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background"
              >
                <Link href="/#features">See all features</Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
