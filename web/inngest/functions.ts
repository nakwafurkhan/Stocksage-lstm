import { inngest } from "@/lib/inngest";
import { sendReportsForPeriod, runAlertChecks } from "@/lib/reports";

// Daily digest — weekdays at 08:00 IST.
export const dailyReport = inngest.createFunction(
  { id: "daily-report" },
  { cron: "TZ=Asia/Kolkata 0 8 * * 1-5" },
  async () => {
    return await sendReportsForPeriod("daily");
  }
);

// Weekly digest — Mondays at 08:00 IST.
export const weeklyReport = inngest.createFunction(
  { id: "weekly-report" },
  { cron: "TZ=Asia/Kolkata 0 8 * * 1" },
  async () => {
    return await sendReportsForPeriod("weekly");
  }
);

// Price/volume alert checker — every 30 minutes.
export const alertChecker = inngest.createFunction(
  { id: "alert-checker" },
  { cron: "*/30 * * * *" },
  async () => {
    return await runAlertChecks();
  }
);

export const functions = [dailyReport, weeklyReport, alertChecker];
