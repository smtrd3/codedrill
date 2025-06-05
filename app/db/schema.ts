import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const templates = sqliteTable("templates", {
  id: int().primaryKey({ autoIncrement: true }),
  uuid: text().notNull().unique(),
  userId: text().notNull(),
  createdAt: int().notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: int().notNull().default(sql`CURRENT_TIMESTAMP`),
  title: text().notNull(),
  template: text().notNull(),
  count: int().notNull().default(0),
  totalTime: int().notNull().default(0),
  metadata: text().default("{}"),
});
