import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

// Applies the SQL migrations in ./drizzle to the database in DATABASE_URL.
// Unlike `drizzle-kit push`, this does NOT introspect the existing schema, so it
// avoids the drizzle-kit CHECK-constraint parser bug. Use this to provision a
// fresh Supabase (e.g. the client's project): set DATABASE_URL, then
//   npm run db:migrate
async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set.");

  const sql = postgres(url, { max: 1, prepare: false });
  const db = drizzle(sql);
  console.log("Applying migrations from ./drizzle …");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✓ Migrations applied.");
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
