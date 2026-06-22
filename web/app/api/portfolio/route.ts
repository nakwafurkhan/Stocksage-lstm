import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";

async function requireUser(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  return session?.user ?? null;
}

const col = () => db.collection("holdings");

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await col()
    .find({ userId: user.id })
    .sort({ createdAt: -1 })
    .toArray();
  const holdings = items.map((h) => ({
    id: h._id.toString(),
    symbol: h.symbol as string,
    quantity: h.quantity as number,
    buyPrice: h.buyPrice as number,
  }));
  return NextResponse.json({ holdings });
}

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const symbol = String(body.symbol || "");
  const quantity = Number(body.quantity);
  const buyPrice = Number(body.buyPrice);
  if (!symbol || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(buyPrice) || buyPrice < 0) {
    return NextResponse.json({ error: "symbol, positive quantity and buyPrice required" }, { status: 400 });
  }
  await col().insertOne({ userId: user.id, symbol, quantity, buyPrice, createdAt: new Date() });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  try {
    await col().deleteOne({ _id: new ObjectId(id), userId: user.id });
  } catch {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
