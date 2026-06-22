import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Mounts all Better Auth endpoints at /api/auth/*
export const { GET, POST } = toNextJsHandler(auth);
