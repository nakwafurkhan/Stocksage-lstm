import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";

async function requireUser(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  return session?.user ?? null;
}

const col = () => db.collection("watchlist");

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await col()
    .find({ userId: user.id })
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json({ symbols: items.map((i) => i.symbol as string) });
}

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { symbol } = await req.json().catch(() => ({}));
  if (!symbol) return NextResponse.json({ error: "symbol required" }, { status: 400 });
  await col().updateOne(
    { userId: user.id, symbol },
    { $setOnInsert: { userId: user.id, symbol, createdAt: new Date() } },
    { upsert: true }
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) return NextResponse.json({ error: "symbol required" }, { status: 400 });
  await col().deleteOne({ userId: user.id, symbol });
  return NextResponse.json({ ok: true });
}
