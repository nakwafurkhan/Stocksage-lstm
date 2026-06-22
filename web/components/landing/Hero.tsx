"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdvancedChart from "@/components/widgets/AdvancedChart";
import { NIFTY_INDEX_TV } from "@/lib/constants";

export default function Hero() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section className="hero-spot relative overflow-hidden">
      <div className="container relative pb-10 pt-16 text-center sm:pt-24">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[13px] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI insights for India&apos;s top 50 stocks
          </motion.div>

          <motion.h1
            variants={item}
            className="mx-auto mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tightest sm:text-6xl md:text-7xl"
          >
            The stock market,
            <br className="hidden sm:block" />{" "}
            <span className="text-gradient">finally easy to understand.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Explore NIFTY 50 companies with live charts, plain-English AI
            insights, an AI chatbot, and LSTM price forecasts — all in one
            beautiful, beginner-friendly app.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button asChild size="lg">
              <Link href="/dashboard">
                Try the demo <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#features">See features</Link>
            </Button>
          </motion.div>

          <motion.p variants={item} className="mt-4 text-xs text-muted-foreground">
            Free · Google one-click sign-in · No signup needed for the demo
          </motion.p>
        </motion.div>

        {/* Framed live chart */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 40, scale: reduce ? 1 : 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-14 max-w-5xl"
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-xs text-muted-foreground">
                NIFTY 50 · live
              </span>
            </div>
            <div className="p-2">
              <AdvancedChart symbol={NIFTY_INDEX_TV} height={440} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
