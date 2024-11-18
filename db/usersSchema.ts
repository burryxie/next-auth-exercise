import { boolean, pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";

export const usersSchema = pgTable("users", {
  // id: serial("id").primaryKey,
  // email: text("email").unique(),
  // password: text("password"),
  // createdAt: timestamp("created_at").defaultNow(),
  // updatedAt: timestamp("updated_at").defaultNow(),
  // twoFactorAuthSecret: text("2fa_secret"),
  // twoFactorAuthSecretActivated: boolean("2fa_activated").default(false),

  id: serial().primaryKey(),
  email: text().unique(),
  password: text(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
  twoFactorAuthSecret: text(),
  twoFactorAuthSecretActivated: boolean().default(false),
});
