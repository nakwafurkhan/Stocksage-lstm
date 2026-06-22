"use client";

import { createAuthClient } from "better-auth/react";

// Same-origin: the client talks to /api/auth on this app, so no baseURL needed.
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
