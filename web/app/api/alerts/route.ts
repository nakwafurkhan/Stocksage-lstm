import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";

const KINDS = ["price_above", "price_below", "volume_above"];

async function requireUser(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  return session?.user ?? null;
}

const col = () => db.collection("alerts");

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await col().find({ userId: user.id }).sort({ createdAt: -1 }).toArray();
  const alerts = items.map((a) => ({
    id: a._id.toString(),
    symbol: a.symbol as string,
    kind: a.kind as string,
    threshold: a.threshold as number,
    active: a.active as boolean,
  }));
  return NextResponse.json({ alerts });
}

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const symbol = String(body.symbol || "");
  const kind = String(body.kind || "");
  const threshold = Number(body.threshold);
  if (!symbol || !KINDS.includes(kind) || !Number.isFinite(threshold) || threshold <= 0) {
    return NextResponse.json({ error: "symbol, valid kind and positive threshold required" }, { status: 400 });
  }
  await col().insertOne({
    userId: user.id,
    email: user.email,
    symbol,
    kind,
    threshold,
    active: true,
    createdAt: new Date(),
  });
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
