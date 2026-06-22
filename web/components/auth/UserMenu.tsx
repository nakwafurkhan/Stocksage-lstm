"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Star, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div className="h-8 w-24 animate-pulse rounded-full bg-secondary" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/sign-in">Try the demo</Link>
        </Button>
      </div>
    );
  }

  const name = session.user?.name || session.user?.email || "Account";
  const initial = name.charAt(0).toUpperCase();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
        <Link href="/dashboard">
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex" aria-label="Watchlist">
        <Link href="/watchlist">
          <Star className="h-4 w-4" />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex" aria-label="Portfolio">
        <Link href="/portfolio">
          <Wallet className="h-4 w-4" />
        </Link>
      </Button>
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
        title={name}
      >
        {initial}
      </span>
      <Button onClick={handleSignOut} variant="ghost" size="icon" aria-label="Sign out">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
