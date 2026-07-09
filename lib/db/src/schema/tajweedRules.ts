import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tajweedRulesTable = pgTable("tajweed_rules", {
  id: serial("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  description: text("description").notNull(),
  example: text("example").notNull(),
  level: integer("level").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertTajweedRuleSchema = createInsertSchema(tajweedRulesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTajweedRule = z.infer<typeof insertTajweedRuleSchema>;
export type TajweedRule = typeof tajweedRulesTable.$inferSelect;
