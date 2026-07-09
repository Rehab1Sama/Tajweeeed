import { Router } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, audioRecordingsTable, messagesTable, usersTable, enrollmentsTable, tajweedRulesTable } from "@workspace/db";
import { requireAuth, requireTeacher } from "../lib/auth";

const router = Router();

// ── Audio Recordings ──────────────────────────────────────────────────────────
router.get("/audio-recordings", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).localUser;
  const { studentId, status } = req.query;
  let rows = await db.select().from(audioRecordingsTable).orderBy(desc(audioRecordingsTable.createdAt));
  if (user?.role !== "teacher") rows = rows.filter((r) => r.studentId === user.id);
  if (studentId) rows = rows.filter((r) => r.studentId === parseInt(studentId as string, 10));
  if (status) rows = rows.filter((r) => r.status === status);
  const students = await db.select().from(usersTable);
  res.json(rows.map((r) => {
    const student = students.find((u) => u.id === r.studentId);
    return {
      id: r.id, studentId: r.studentId, ruleId: r.ruleId ?? null, audioUrl: r.audioUrl,
      notes: r.notes ?? null, teacherFeedback: r.teacherFeedback ?? null,
      teacherAudioFeedbackUrl: r.teacherAudioFeedbackUrl ?? null, status: r.status,
      student: student ? { id: student.id, clerkId: student.clerkId, email: student.email, name: student.name, role: student.role, avatarUrl: student.avatarUrl ?? null, createdAt: student.createdAt.toISOString() } : null,
      createdAt: r.createdAt.toISOString(),
    };
  }));
});

router.post("/audio-recordings", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).localUser;
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (user.role !== "teacher") {
    const enrollments = await db.select().from(enrollmentsTable).where(eq(enrollmentsTable.studentId, user.id));
    const hasActive = enrollments.some((e) => e.status === "active");
    if (!hasActive) { res.status(403).json({ error: "No active enrollment" }); return; }
  }
  const { ruleId, audioUrl, notes } = req.body;
  if (!audioUrl) { res.status(400).json({ error: "audioUrl required" }); return; }
  const [r] = await db.insert(audioRecordingsTable).values({ studentId: user.id, ruleId: ruleId ?? null, audioUrl, notes: notes ?? null }).returning();
  res.status(201).json({ id: r.id, studentId: r.studentId, ruleId: r.ruleId ?? null, audioUrl: r.audioUrl, notes: r.notes ?? null, teacherFeedback: null, teacherAudioFeedbackUrl: null, status: r.status, createdAt: r.createdAt.toISOString() });
});

router.patch("/audio-recordings/:id", requireTeacher, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const { teacherFeedback, teacherAudioFeedbackUrl, status } = req.body;
  const updates: any = {};
  if (teacherFeedback !== undefined) updates.teacherFeedback = teacherFeedback;
  if (teacherAudioFeedbackUrl !== undefined) updates.teacherAudioFeedbackUrl = teacherAudioFeedbackUrl;
  if (status !== undefined) updates.status = status;
  const [updated] = await db.update(audioRecordingsTable).set(updates).where(eq(audioRecordingsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  const [student] = await db.select().from(usersTable).where(eq(usersTable.id, updated.studentId));
  res.json({
    id: updated.id, studentId: updated.studentId, ruleId: updated.ruleId ?? null, audioUrl: updated.audioUrl,
    notes: updated.notes ?? null, teacherFeedback: updated.teacherFeedback ?? null,
    teacherAudioFeedbackUrl: updated.teacherAudioFeedbackUrl ?? null, status: updated.status,
    student: student ? { id: student.id, clerkId: student.clerkId, email: student.email, name: student.name, role: student.role, avatarUrl: student.avatarUrl ?? null, createdAt: student.createdAt.toISOString() } : null,
    createdAt: updated.createdAt.toISOString(),
  });
});

// ── Messages ──────────────────────────────────────────────────────────────────
function formatMsg(m: any, sender: any) {
  return {
    id: m.id, senderId: m.senderId, recipientId: m.recipientId, content: m.content, isRead: m.isRead,
    sender: sender ? { id: sender.id, clerkId: sender.clerkId, email: sender.email, name: sender.name, role: sender.role, avatarUrl: sender.avatarUrl ?? null, createdAt: sender.createdAt.toISOString() } : null,
    createdAt: m.createdAt.toISOString(),
  };
}

router.get("/messages", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).localUser;
  const { studentId } = req.query;
  let rows = await db.select().from(messagesTable).orderBy(messagesTable.createdAt);
  const users = await db.select().from(usersTable);
  if (user?.role !== "teacher") {
    rows = rows.filter((m) => m.senderId === user.id || m.recipientId === user.id);
  } else if (studentId) {
    const sid = parseInt(studentId as string, 10);
    rows = rows.filter((m) => m.senderId === sid || m.recipientId === sid);
  }
  res.json(rows.map((m) => {
    const sender = users.find((u) => u.id === m.senderId);
    return formatMsg(m, sender ?? null);
  }));
});

router.post("/messages", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).localUser;
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (user.role !== "teacher") {
    const enrollments = await db.select().from(enrollmentsTable).where(eq(enrollmentsTable.studentId, user.id));
    const hasActive = enrollments.some((e) => e.status === "active");
    if (!hasActive) { res.status(403).json({ error: "No active enrollment" }); return; }
  }
  const { recipientId, content } = req.body;
  if (!recipientId || !content) { res.status(400).json({ error: "recipientId, content required" }); return; }
  const [m] = await db.insert(messagesTable).values({ senderId: user.id, recipientId, content }).returning();
  const [sender] = await db.select().from(usersTable).where(eq(usersTable.id, user.id));
  res.status(201).json(formatMsg(m, sender ?? null));
});

router.get("/messages/conversations", requireTeacher, async (_req, res): Promise<void> => {
  const messages = await db.select().from(messagesTable).orderBy(desc(messagesTable.createdAt));
  const students = await db.select().from(usersTable).where(eq(usersTable.role, "student"));
  const enrollments = await db.select().from(enrollmentsTable);
  const teacher = await db.select().from(usersTable).where(eq(usersTable.role, "teacher"));
  const teacherIds = teacher.map((t) => t.id);

  const conversations = students.map((s) => {
    const related = messages.filter((m) => m.senderId === s.id || m.recipientId === s.id);
    const last = related[0];
    const unread = related.filter((m) => m.recipientId !== s.id && !m.isRead).length;
    const activeEnrollment = enrollments.find((e) => e.studentId === s.id && e.status === "active");
    return {
      studentId: s.id,
      student: { id: s.id, clerkId: s.clerkId, email: s.email, name: s.name, role: s.role, avatarUrl: s.avatarUrl ?? null, createdAt: s.createdAt.toISOString() },
      lastMessage: last?.content ?? "",
      lastMessageAt: last?.createdAt?.toISOString() ?? s.createdAt.toISOString(),
      unreadCount: unread,
      hasActiveEnrollment: !!activeEnrollment,
    };
  }).filter((c) => c.lastMessage);

  res.json(conversations);
});

export default router;
