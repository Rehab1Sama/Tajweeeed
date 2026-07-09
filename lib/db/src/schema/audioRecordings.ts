import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const audioRecordingsTable = pgTable("audio_recordings", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  ruleId: integer("rule_id"),
  audioUrl: text("audio_url").notNull(),
  notes: text("notes"),
  teacherFeedback: text("teacher_feedback"),
  teacherAudioFeedbackUrl: text("teacher_audio_feedback_url"),
  status: text("status", { enum: ["pending", "reviewed"] }).notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertAudioRecordingSchema = createInsertSchema(audioRecordingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAudioRecording = z.infer<typeof insertAudioRecordingSchema>;
export type AudioRecording = typeof audioRecordingsTable.$inferSelect;
