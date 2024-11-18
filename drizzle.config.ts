import "dotenv";
import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  // schema: "./db/usersSchema.ts",
  schema: "./db/schemas.ts",
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL!,
  },
});
