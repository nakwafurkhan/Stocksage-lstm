import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";

async function requireUser(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  return session?.user ?? null;
}

const col = () => db.collection("reportPrefs");

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const pref = await col().findOne({ userId: user.id });
  return NextResponse.json({
    daily: !!pref?.daily,
    weekly: !!pref?.weekly,
    email: user.email,
  });
}

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const daily = !!body.daily;
  const weekly = !!body.weekly;
  await col().updateOne(
    { userId: user.id },
    { $set: { userId: user.id, email: user.email, daily, weekly, updatedAt: new Date() } },
    { upsert: true }
  );
  return NextResponse.json({ ok: true, daily, weekly });
}
