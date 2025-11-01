import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Items table - stores all items available for pledging
 */
export const items = mysqlTable("items", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: int("price").notNull(), // Store as cents to avoid decimal issues
  quantity: int("quantity").notNull().default(1),
  shop: varchar("shop", { length: 255 }),
  imageUrl: varchar("imageUrl", { length: 500 }),
  totalPledged: int("totalPledged").notNull().default(0), // Total amount pledged in cents
  isLocked: int("isLocked").notNull().default(0), // 0 = available, 1 = fully pledged
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Item = typeof items.$inferSelect;
export type InsertItem = typeof items.$inferInsert;

/**
 * Pledges table - stores all pledge submissions
 */
export const pledges = mysqlTable("pledges", {
  id: int("id").autoincrement().primaryKey(),
  pledgeNumber: varchar("pledgeNumber", { length: 20 }).notNull().unique(),
  itemId: int("itemId").notNull(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  cellNumber: varchar("cellNumber", { length: 20 }).notNull(),
  amount: int("amount").notNull(), // Amount pledged in cents
  isFull: int("isFull").notNull().default(0), // 0 = partial, 1 = full amount
  popiConsent: int("popiConsent").notNull().default(1), // Must be 1 to submit
  emailSent: int("emailSent").notNull().default(0), // 0 = not sent, 1 = sent
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Pledge = typeof pledges.$inferSelect;
export type InsertPledge = typeof pledges.$inferInsert;