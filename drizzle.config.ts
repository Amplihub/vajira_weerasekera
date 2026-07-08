import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit (CLI) does not load .env.local the way Next.js does — load it here.
config({ path: ".env.local" });

export default defineConfig({
  schema: ["./src/db/schema.ts", "./src/db/auth-schema.ts"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
