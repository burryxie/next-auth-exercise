import { pgTable, text, timestamp, serial, integer } from "drizzle-orm/pg-core";

import { usersSchema } from "./schemas";

export const passwordResetTokensSchema = pgTable("password-reset-tokens", {
  id: serial().primaryKey(),
  userId: integer()
    .references(() => usersSchema.id, { onDelete: "cascade" })
    .unique(),
  email: text(),
  token: text(),
  tokenExpiresAt: timestamp(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});
