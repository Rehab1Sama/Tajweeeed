import { pgTable, serial, text, timestamp, integer, boolean, numeric, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// Announcements
export const announcementsTable = pgTable("announcements", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAnnouncementSchema = createInsertSchema(announcementsTable).omit({ id: true, createdAt: true });
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcementsTable.$inferSelect;

// Certificates
export const certificatesTable = pgTable("certificates", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  courseId: integer("course_id").notNull(),
  certificateUrl: text("certificate_url"),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCertificateSchema = createInsertSchema(certificatesTable).omit({ id: true, issuedAt: true });
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificatesTable.$inferSelect;

// Payments
export const paymentsTable = pgTable("payments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  courseId: integer("course_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status", { enum: ["pending", "paid", "cancelled", "refunded"] }).notNull().default("pending"),
  method: text("method"),
  notes: text("notes"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(paymentsTable).omit({ id: true, createdAt: true });
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof paymentsTable.$inferSelect;

// Applications
export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  desiredLevel: integer("desired_level").notNull().default(1),
  message: text("message"),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({ id: true, createdAt: true });
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;

// Progress entries
export const progressEntriesTable = pgTable("progress_entries", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  ruleId: integer("rule_id").notNull(),
  masteryLevel: integer("mastery_level").notNull().default(0),
  selfAssessment: integer("self_assessment"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProgressEntrySchema = createInsertSchema(progressEntriesTable).omit({ id: true, updatedAt: true });
export type InsertProgressEntry = z.infer<typeof insertProgressEntrySchema>;
export type ProgressEntry = typeof progressEntriesTable.$inferSelect;

// Daily Wird
export const dailyWirdTable = pgTable("daily_wird", {
  id: serial("id").primaryKey(),
  date: date("date", { mode: "string" }).notNull().unique(),
  ruleId: integer("rule_id"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDailyWirdSchema = createInsertSchema(dailyWirdTable).omit({ id: true, createdAt: true });
export type InsertDailyWird = z.infer<typeof insertDailyWirdSchema>;
export type DailyWird = typeof dailyWirdTable.$inferSelect;

// Weekly Stars
export const weeklyStarsTable = pgTable("weekly_stars", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  weekStartDate: date("week_start_date", { mode: "string" }).notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertWeeklyStarSchema = createInsertSchema(weeklyStarsTable).omit({ id: true, createdAt: true });
export type InsertWeeklyStar = z.infer<typeof insertWeeklyStarSchema>;
export type WeeklyStar = typeof weeklyStarsTable.$inferSelect;

// Comment Templates
export const commentTemplatesTable = pgTable("comment_templates", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  category: text("category"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCommentTemplateSchema = createInsertSchema(commentTemplatesTable).omit({ id: true, createdAt: true });
export type InsertCommentTemplate = z.infer<typeof insertCommentTemplateSchema>;
export type CommentTemplate = typeof commentTemplatesTable.$inferSelect;

// Audio Library
export const audioLibraryTable = pgTable("audio_library", {
  id: serial("id").primaryKey(),
  ruleId: integer("rule_id"),
  reciterName: text("reciter_name").notNull(),
  audioUrl: text("audio_url").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAudioLibrarySchema = createInsertSchema(audioLibraryTable).omit({ id: true, createdAt: true });
export type InsertAudioLibrary = z.infer<typeof insertAudioLibrarySchema>;
export type AudioLibraryItem = typeof audioLibraryTable.$inferSelect;

// Student Notes (private, teacher-only)
export const studentNotesTable = pgTable("student_notes", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertStudentNoteSchema = createInsertSchema(studentNotesTable).omit({ id: true, createdAt: true });
export type InsertStudentNote = z.infer<typeof insertStudentNoteSchema>;
export type StudentNote = typeof studentNotesTable.$inferSelect;
