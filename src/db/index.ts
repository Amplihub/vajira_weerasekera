import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as authSchema from "./auth-schema";

const fullSchema = { ...schema, ...authSchema };
type Schema = typeof fullSchema;

// Lazy singleton: do not connect at import time, so `next build` (which imports
// route modules without runtime env) does not fail. The connection is created on
// first actual query.
let _db: PostgresJsDatabase<Schema> | null = null;

function init(): PostgresJsDatabase<Schema> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add the Supabase Postgres connection string to your env.");
  }
  // Supabase pooled connection (port 6543, transaction mode) — disable prepared statements.
  const client = postgres(connectionString, { prepare: false });
  return drizzle(client, { schema: fullSchema });
}

export const db = new Proxy({} as PostgresJsDatabase<Schema>, {
  get(_target, prop) {
    if (!_db) _db = init();
    return _db[prop as keyof PostgresJsDatabase<Schema>];
  },
});

export { schema, authSchema };
