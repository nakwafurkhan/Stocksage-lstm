import Link from "next/link";
import UserMenu from "@/components/auth/UserMenu";
import MobileNav from "@/components/MobileNav";

const LINKS = [
  { label: "Stocks", href: "/stocks" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Features", href: "/#features" },
];

export default function Navbar() {
  return (
    <header className="glass sticky top-0 z-50 border-b border-border/60">
      <nav className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base font-semibold tracking-tightest">
            Stock<span className="text-primary">Sage</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] text-foreground/70 transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <UserMenu />
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
