import ReportPrefs from "@/components/alerts/ReportPrefs";
import AlertsManager from "@/components/alerts/AlertsManager";

export const metadata = {
  title: "Alerts & reports — StockSage",
};

export default function AlertsPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-semibold tracking-tightest sm:text-4xl">Alerts &amp; reports</h1>
      <p className="mt-2 text-muted-foreground">
        Get emailed when a stock hits your target, and receive digests of your watchlist.
      </p>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Price &amp; volume alerts</h2>
        <AlertsManager />
      </section>

      <section className="mt-12 max-w-xl">
        <ReportPrefs />
      </section>

      <p className="mt-8 text-xs text-muted-foreground">
        Educational only — not financial advice. Alerts and reports run on a schedule, so there may be a short delay.
      </p>
    </div>
  );
}
