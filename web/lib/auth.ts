import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "./mongodb";

/**
 * Better Auth server instance.
 *
 * Reads BETTER_AUTH_SECRET and BETTER_AUTH_URL from the environment.
 * - Google one-click sign-in via the social provider.
 * - Email/password is enabled so the shared "demo" account can sign in.
 *
 * See ../../SETUP.md for how to create the Google OAuth client + MongoDB URI.
 */
export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
});

export type Session = typeof auth.$Infer.Session;
