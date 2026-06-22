import { db } from "@/lib/mongodb";
import { findStock } from "@/lib/constants";
import { sendEmail } from "@/lib/email";

type QuoteDetail = { price: number; prevClose: number | null; volume: number | null };

async function quoteDetail(symbol: string): Promise<QuoteDetail | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      symbol
    )}?range=1d&interval=1d`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; StockSage/1.0)" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const m = data?.chart?.result?.[0]?.meta;
    if (!m || typeof m.regularMarketPrice !== "number") return null;
    return {
      price: m.regularMarketPrice,
      prevClose: m.previousClose ?? m.chartPreviousClose ?? null,
      volume: m.regularMarketVolume ?? null,
    };
  } catch {
    return null;
  }
}

const inr = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

function row(name: string, price: number | null, changePct: number | null): string {
  const color = changePct == null ? "#6e6e73" : changePct >= 0 ? "#1a8c4a" : "#d23b3b";
  const chg = changePct == null ? "—" : `${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}%`;
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #f0f0f3;">${name}</td>
    <td style="padding:8px 0;text-align:right;border-bottom:1px solid #f0f0f3;">${price == null ? "—" : inr(price)}</td>
    <td style="padding:8px 0;text-align:right;border-bottom:1px solid #f0f0f3;color:${color};">${chg}</td>
  </tr>`;
}

export async function buildReportHtml(
  symbols: string[],
  period: "daily" | "weekly"
): Promise<string | null> {
  const rows: string[] = [];
  for (const sym of symbols) {
    const stock = findStock(sym);
    if (!stock) continue;
    const q = await quoteDetail(sym);
    const changePct = q && q.prevClose ? ((q.price - q.prevClose) / q.prevClose) * 100 : null;
    rows.push(row(stock.name, q ? q.price : null, changePct));
  }
  if (rows.length === 0) return null;

  const title = period === "daily" ? "Your daily digest" : "Your weekly digest";
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1d1d1f;padding:8px;">
    <h2 style="margin:0 0 4px;">📈 StockSage — ${title}</h2>
    <p style="color:#6e6e73;margin:0 0 16px;">Here's how your watchlist is doing.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead><tr style="color:#6e6e73;text-align:left;">
        <th style="padding-bottom:6px;">Stock</th>
        <th style="padding-bottom:6px;text-align:right;">Price</th>
        <th style="padding-bottom:6px;text-align:right;">Change</th>
      </tr></thead>
      <tbody>${rows.join("")}</tbody>
    </table>
    <p style="color:#9a9aa0;font-size:12px;margin-top:24px;">
      Educational only — not financial advice. You're receiving this because you enabled ${period} reports in StockSage.
    </p>
  </div>`;
}

/** Send digests to every user who opted into this period. */
export async function sendReportsForPeriod(
  period: "daily" | "weekly"
): Promise<{ sent: number; users: number }> {
  const prefs = await db.collection("reportPrefs").find({ [period]: true }).toArray();
  let sent = 0;
  for (const p of prefs) {
    const email = p.email as string | undefined;
    if (!email) continue;
    const wl = await db.collection("watchlist").find({ userId: p.userId }).toArray();
    const symbols = wl.map((w) => w.symbol as string);
    if (symbols.length === 0) continue;
    const html = await buildReportHtml(symbols, period);
    if (!html) continue;
    const subject = period === "daily" ? "📈 Your daily StockSage digest" : "📊 Your weekly StockSage digest";
    if (await sendEmail({ to: email, subject, html })) sent++;
  }
  return { sent, users: prefs.length };
}

/** Check active price/volume alerts and email + deactivate any that trigger. */
export async function runAlertChecks(): Promise<{ triggered: number; checked: number }> {
  const alerts = await db.collection("alerts").find({ active: true }).toArray();
  const cache = new Map<string, QuoteDetail | null>();
  let triggered = 0;

  for (const a of alerts) {
    const sym = a.symbol as string;
    if (!cache.has(sym)) cache.set(sym, await quoteDetail(sym));
    const q = cache.get(sym);
    if (!q) continue;

    const kind = a.kind as string;
    const threshold = a.threshold as number;
    let hit = false;
    if (kind === "price_above") hit = q.price >= threshold;
    else if (kind === "price_below") hit = q.price <= threshold;
    else if (kind === "volume_above") hit = (q.volume ?? 0) >= threshold;
    if (!hit) continue;

    const stock = findStock(sym);
    const name = stock?.name ?? sym;
    const label =
      kind === "price_above"
        ? `rose above ${inr(threshold)}`
        : kind === "price_below"
        ? `fell below ${inr(threshold)}`
        : `traded volume passed ${threshold.toLocaleString("en-IN")}`;
    const html = `<div style="font-family:-apple-system,sans-serif;color:#1d1d1f;max-width:520px;margin:0 auto;">
      <h2>🔔 ${name} alert</h2>
      <p>${name} ${label}. Current price: <b>${inr(q.price)}</b>.</p>
      <p style="color:#9a9aa0;font-size:12px;">Educational only — not financial advice.</p>
    </div>`;

    if (a.email) {
      const ok = await sendEmail({
        to: a.email as string,
        subject: `🔔 ${name} ${kind.startsWith("price") ? "price" : "volume"} alert`,
        html,
      });
      if (ok) {
        triggered++;
        await db.collection("alerts").updateOne({ _id: a._id }, { $set: { active: false, triggeredAt: new Date() } });
      }
    }
  }
  return { triggered, checked: alerts.length };
}
