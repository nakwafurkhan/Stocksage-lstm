import { MongoClient } from "mongodb";

// A single shared MongoClient. The driver connects lazily on first use, so
// constructing it at import time is safe (no network call yet). We fall back to
// a localhost URI so `next build` doesn't crash when MONGODB_URI is unset —
// real database operations still require a valid MONGODB_URI at runtime.
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/stocksage";

const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

export const mongoClient =
  globalForMongo._mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClient = mongoClient;
}

// Database name comes from the connection string (…/stocksage).
export const db = mongoClient.db();
