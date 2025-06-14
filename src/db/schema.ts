import { sql } from 'drizzle-orm';
import { int, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const templates = sqliteTable('templates', {
  id: int().primaryKey({ autoIncrement: true }),
  uuid: text().notNull().unique(),
  userId: text().notNull(),
  createdAt: int()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: int()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  title: text().notNull(),
  template: text().notNull(),
  count: int().notNull().default(0),
  totalTime: int().notNull().default(0),
  bestWpm: int().notNull().default(0),
  metadata: text().default('{}'),
});

export const activity = sqliteTable('activity', {
  id: int().primaryKey({ autoIncrement: true }),
  userId: text().notNull(),
  date: text().notNull(),
  count: int().notNull().default(0),
  bestAccuracy: real().notNull().default(0),
  bestWpm: int().notNull().default(0),
  bestTime: int().notNull().default(0),
});

export const metadata = sqliteTable('metadata', {
  id: int().primaryKey({ autoIncrement: true }),
  userId: text().notNull(),
  key: text().notNull(),
  value: text().notNull(),
});
