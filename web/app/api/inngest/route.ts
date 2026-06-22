import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { functions } from "@/inngest/functions";

// Inngest endpoint — the Inngest dev server / cloud calls this to run the
// scheduled report & alert functions.
export const { GET, POST, PUT } = serve({ client: inngest, functions });
