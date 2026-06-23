import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "./mongodb";

/**
 * Better Auth server instance.
 *
 * Email + password auth, with users stored in MongoDB via the adapter.
 * Reads BETTER_AUTH_SECRET and BETTER_AUTH_URL from the environment.
 * See ../../SETUP.md for the MongoDB URI setup (no third-party OAuth needed).
 */
export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
});

export type Session = typeof auth.$Infer.Session;
