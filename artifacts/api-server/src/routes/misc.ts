import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import {
  db, announcementsTable, certificatesTable, paymentsTable, applicationsTable,
  progressEntriesTable, dailyWirdTable, weeklyStarsTable, commentTemplatesTable,
  audioLibraryTable, studentNotesTable, tajweedRulesTable, usersTable, coursesTable, enrollmentsTable,
  assignmentSubmissionsTable, audioRecordingsTable
} from "@workspace/db";
import { requireAuth, requireTeacher } from "../lib/auth";

const router = Router();

// ── Announcements ─────────────────────────────────────────────────────────────
router.get("/announcements", requireAuth, async (req, res): Promise<void> => {
  const { courseId } = req.query;
  let rows = await db.select().from(announcementsTable).orderBy(desc(announcementsTable.createdAt));
  if (courseId) rows = rows.filter((a) => a.courseId === parseInt(courseId as string, 10));
  res.json(rows.map((a) => ({ id: a.id, courseId: a.courseId ?? null, title: a.title, content: a.content, createdAt: a.createdAt.toISOString() })));
});
router.post("/announcements", requireTeacher, async (req, res): Promise<void> => {
  const { courseId, title, content } = req.body;
  if (!title || !content) { res.status(400).json({ error: "title, content required" }); return; }
  const [a] = await db.insert(announcementsTable).values({ courseId: courseId ?? null, title, content }).returning();
  res.status(201).json({ id: a.id, courseId: a.courseId ?? null, title: a.title, content: a.content, createdAt: a.createdAt.toISOString() });
});

// ── Certificates ──────────────────────────────────────────────────────────────
router.get("/certificates", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).localUser;
  let rows = await db.select().from(certificatesTable).orderBy(desc(certificatesTable.issuedAt));
  if (user?.role !== "teacher") rows = rows.filter((c) => c.studentId === user.id);
  const [students, courses] = await Promise.all([db.select().from(usersTable), db.select().from(coursesTable)]);
  res.json(rows.map((c) => {
    const student = students.find((u) => u.id === c.studentId);
    const course = courses.find((co) => co.id === c.courseId);
    return {
      id: c.id, studentId: c.studentId, courseId: c.courseId, issuedAt: c.issuedAt.toISOString(), certificateUrl: c.certificateUrl ?? null,
      student: student ? { id: student.id, clerkId: student.clerkId, email: student.email, name: student.name, role: student.role, avatarUrl: student.avatarUrl ?? null, createdAt: student.createdAt.toISOString() } : null,
      course: course ? { id: course.id, title: course.title, description: course.description, level: course.level, durationDays: course.durationDays, price: parseFloat(course.price), capacity: course.capacity, startDate: course.startDate ?? null, endDate: course.endDate ?? null, isActive: course.isActive, enrolledCount: 0, createdAt: course.createdAt.toISOString() } : null,
    };
  }));
});
router.post("/certificates", requireTeacher, async (req, res): Promise<void> => {
  const { studentId, courseId, certificateUrl } = req.body;
  if (!studentId || !courseId) { res.status(400).json({ error: "studentId, courseId required" }); return; }
  const [c] = await db.insert(certificatesTable).values({ studentId, courseId, certificateUrl: certificateUrl ?? null }).returning();
  res.status(201).json({ id: c.id, studentId: c.studentId, courseId: c.courseId, issuedAt: c.issuedAt.toISOString(), certificateUrl: c.certificateUrl ?? null });
});

// ── Payments ──────────────────────────────────────────────────────────────────
router.get("/payments", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).localUser;
  let rows = await db.select().from(paymentsTable).orderBy(desc(paymentsTable.createdAt));
  if (user?.role !== "teacher") rows = rows.filter((p) => p.studentId === user.id);
  const [students, courses] = await Promise.all([db.select().from(usersTable), db.select().from(coursesTable)]);
  res.json(rows.map((p) => {
    const student = students.find((u) => u.id === p.studentId);
    const course = courses.find((c) => c.id === p.courseId);
    return {
      id: p.id, studentId: p.studentId, courseId: p.courseId, amount: parseFloat(p.amount),
      status: p.status, method: p.method ?? null, notes: p.notes ?? null,
      paidAt: p.paidAt?.toISOString() ?? null, createdAt: p.createdAt.toISOString(),
      student: student ? { id: student.id, clerkId: student.clerkId, email: student.email, name: student.name, role: student.role, avatarUrl: student.avatarUrl ?? null, createdAt: student.createdAt.toISOString() } : null,
      course: course ? { id: course.id, title: course.title, description: course.description, level: course.level, durationDays: course.durationDays, price: parseFloat(course.price), capacity: course.capacity, startDate: course.startDate ?? null, endDate: course.endDate ?? null, isActive: course.isActive, enrolledCount: 0, createdAt: course.createdAt.toISOString() } : null,
    };
  }));
});
router.post("/payments", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).localUser;
  const { studentId, courseId, amount, method, notes } = req.body;
  if (!courseId || !amount) { res.status(400).json({ error: "courseId and amount required" }); return; }
  const sid = user?.role === "teacher" ? (studentId ?? user.id) : user.id;
  const [p] = await db.insert(paymentsTable).values({ studentId: sid, courseId, amount: String(amount), method: method ?? null, notes: notes ?? null }).returning();
  res.status(201).json({ id: p.id, studentId: p.studentId, courseId: p.courseId, amount: parseFloat(p.amount), status: p.status, method: p.method ?? null, notes: p.notes ?? null, paidAt: null, createdAt: p.createdAt.toISOString() });
});
router.patch("/payments/:id", requireTeacher, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const { status, method, notes, paidAt } = req.body;
  const updates: any = {};
  if (status !== undefined) updates.status = status;
  if (method !== undefined) updates.method = method;
  if (notes !== undefined) updates.notes = notes;
  if (paidAt !== undefined) updates.paidAt = new Date(paidAt);
  const [updated] = await db.update(paymentsTable).set(updates).where(eq(paymentsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ id: updated.id, studentId: updated.studentId, courseId: updated.courseId, amount: parseFloat(updated.amount), status: updated.status, method: updated.method ?? null, notes: updated.notes ?? null, paidAt: updated.paidAt?.toISOString() ?? null, createdAt: updated.createdAt.toISOString() });
});

// ── Applications ──────────────────────────────────────────────────────────────
router.get("/applications", requireTeacher, async (req, res): Promise<void> => {
  const { status } = req.query;
  let rows = await db.select().from(applicationsTable).orderBy(desc(applicationsTable.createdAt));
  if (status) rows = rows.filter((a) => a.status === status);
  res.json(rows.map((a) => ({ id: a.id, name: a.name, email: a.email, phone: a.phone ?? null, desiredLevel: a.desiredLevel, message: a.message ?? null, status: a.status, createdAt: a.createdAt.toISOString() })));
});
router.post("/applications", async (req, res): Promise<void> => {
  const { name, email, phone, desiredLevel, message } = req.body;
  if (!name || !email || !desiredLevel) { res.status(400).json({ error: "name, email, desiredLevel required" }); return; }
  const [a] = await db.insert(applicationsTable).values({ name, email, phone: phone ?? null, desiredLevel, message: message ?? null }).returning();
  res.status(201).json({ id: a.id, name: a.name, email: a.email, phone: a.phone ?? null, desiredLevel: a.desiredLevel, message: a.message ?? null, status: a.status, createdAt: a.createdAt.toISOString() });
});
router.patch("/applications/:id", requireTeacher, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const { status } = req.body;
  const [updated] = await db.update(applicationsTable).set({ status }).where(eq(applicationsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ id: updated.id, name: updated.name, email: updated.email, phone: updated.phone ?? null, desiredLevel: updated.desiredLevel, message: updated.message ?? null, status: updated.status, createdAt: updated.createdAt.toISOString() });
});

// ── Progress ──────────────────────────────────────────────────────────────────
router.get("/progress", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).localUser;
  const { studentId } = req.query;
  const sid = user?.role === "teacher" && studentId ? parseInt(studentId as string, 10) : user.id;
  const rows = await db.select().from(progressEntriesTable).where(eq(progressEntriesTable.studentId, sid));
  const rules = await db.select().from(tajweedRulesTable);
  res.json(rows.map((p) => {
    const rule = rules.find((r) => r.id === p.ruleId);
    return {
      id: p.id, studentId: p.studentId, ruleId: p.ruleId, masteryLevel: p.masteryLevel,
      selfAssessment: p.selfAssessment ?? null, updatedAt: p.updatedAt.toISOString(),
      rule: rule ? { id: rule.id, nameAr: rule.nameAr, nameEn: rule.nameEn, description: rule.description, example: rule.example, level: rule.level, orderIndex: rule.orderIndex, createdAt: rule.createdAt.toISOString() } : null,
    };
  }));
});
router.patch("/progress/:ruleId", requireAuth, async (req, res): Promise<void> => {
  const ruleId = parseInt(Array.isArray(req.params.ruleId) ? req.params.ruleId[0] : req.params.ruleId, 10);
  const user = (req as any).localUser;
  const { masteryLevel, selfAssessment } = req.body;
  const [existing] = await db.select().from(progressEntriesTable).where(eq(progressEntriesTable.ruleId, ruleId));
  let row;
  if (existing && existing.studentId === user.id) {
    const updates: any = {};
    if (masteryLevel !== undefined) updates.masteryLevel = masteryLevel;
    if (selfAssessment !== undefined) updates.selfAssessment = selfAssessment;
    const [updated] = await db.update(progressEntriesTable).set(updates).where(eq(progressEntriesTable.id, existing.id)).returning();
    row = updated;
  } else {
    const [created] = await db.insert(progressEntriesTable).values({ studentId: user.id, ruleId, masteryLevel: masteryLevel ?? 0, selfAssessment: selfAssessment ?? null }).returning();
    row = created;
  }
  const [rule] = await db.select().from(tajweedRulesTable).where(eq(tajweedRulesTable.id, ruleId));
  res.json({ id: row.id, studentId: row.studentId, ruleId: row.ruleId, masteryLevel: row.masteryLevel, selfAssessment: row.selfAssessment ?? null, updatedAt: row.updatedAt.toISOString(), rule: rule ? { id: rule.id, nameAr: rule.nameAr, nameEn: rule.nameEn, description: rule.description, example: rule.example, level: rule.level, orderIndex: rule.orderIndex, createdAt: rule.createdAt.toISOString() } : null });
});

// ── Daily Wird ─────────────────────────────────────────────────────────────────
router.get("/daily-wird", requireAuth, async (_req, res): Promise<void> => {
  const today = new Date().toISOString().split("T")[0];
  const [row] = await db.select().from(dailyWirdTable).where(eq(dailyWirdTable.date, today));
  if (!row) {
    const [latest] = await db.select().from(dailyWirdTable).orderBy(desc(dailyWirdTable.createdAt));
    if (!latest) { res.json(null); return; }
    const rule = latest.ruleId ? await db.select().from(tajweedRulesTable).where(eq(tajweedRulesTable.id, latest.ruleId)).then((r) => r[0]) : null;
    res.json({ id: latest.id, date: latest.date, ruleId: latest.ruleId ?? null, title: latest.title, content: latest.content, rule: rule ?? null });
    return;
  }
  const rule = row.ruleId ? await db.select().from(tajweedRulesTable).where(eq(tajweedRulesTable.id, row.ruleId)).then((r) => r[0]) : null;
  res.json({ id: row.id, date: row.date, ruleId: row.ruleId ?? null, title: row.title, content: row.content, rule: rule ?? null });
});
router.post("/daily-wird", requireTeacher, async (req, res): Promise<void> => {
  const { date, ruleId, title, content } = req.body;
  if (!date || !title || !content) { res.status(400).json({ error: "date, title, content required" }); return; }
  const [w] = await db.insert(dailyWirdTable).values({ date, ruleId: ruleId ?? null, title, content }).returning();
  res.status(201).json({ id: w.id, date: w.date, ruleId: w.ruleId ?? null, title: w.title, content: w.content, rule: null });
});

// ── Weekly Star ────────────────────────────────────────────────────────────────
router.get("/weekly-star", requireAuth, async (_req, res): Promise<void> => {
  const [row] = await db.select().from(weeklyStarsTable).orderBy(desc(weeklyStarsTable.createdAt));
  if (!row) { res.json(null); return; }
  const [student] = await db.select().from(usersTable).where(eq(usersTable.id, row.studentId));
  res.json({ id: row.id, studentId: row.studentId, weekStartDate: row.weekStartDate, reason: row.reason ?? null, student: student ? { id: student.id, clerkId: student.clerkId, email: student.email, name: student.name, role: student.role, avatarUrl: student.avatarUrl ?? null, createdAt: student.createdAt.toISOString() } : null });
});
router.post("/weekly-star", requireTeacher, async (req, res): Promise<void> => {
  const { studentId, weekStartDate, reason } = req.body;
  if (!studentId || !weekStartDate) { res.status(400).json({ error: "studentId, weekStartDate required" }); return; }
  const [row] = await db.insert(weeklyStarsTable).values({ studentId, weekStartDate, reason: reason ?? null }).returning();
  const [student] = await db.select().from(usersTable).where(eq(usersTable.id, studentId));
  res.status(201).json({ id: row.id, studentId: row.studentId, weekStartDate: row.weekStartDate, reason: row.reason ?? null, student: student ? { id: student.id, clerkId: student.clerkId, email: student.email, name: student.name, role: student.role, avatarUrl: student.avatarUrl ?? null, createdAt: student.createdAt.toISOString() } : null });
});

// ── Comment Templates ─────────────────────────────────────────────────────────
router.get("/comment-templates", requireTeacher, async (_req, res): Promise<void> => {
  const rows = await db.select().from(commentTemplatesTable).orderBy(commentTemplatesTable.createdAt);
  res.json(rows.map((t) => ({ id: t.id, text: t.text, category: t.category ?? null, createdAt: t.createdAt.toISOString() })));
});
router.post("/comment-templates", requireTeacher, async (req, res): Promise<void> => {
  const { text, category } = req.body;
  if (!text) { res.status(400).json({ error: "text required" }); return; }
  const [t] = await db.insert(commentTemplatesTable).values({ text, category: category ?? null }).returning();
  res.status(201).json({ id: t.id, text: t.text, category: t.category ?? null, createdAt: t.createdAt.toISOString() });
});
router.delete("/comment-templates/:id", requireTeacher, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  await db.delete(commentTemplatesTable).where(eq(commentTemplatesTable.id, id));
  res.sendStatus(204);
});

// ── Audio Library ─────────────────────────────────────────────────────────────
router.get("/audio-library", requireAuth, async (req, res): Promise<void> => {
  const { ruleId } = req.query;
  let rows = await db.select().from(audioLibraryTable).orderBy(audioLibraryTable.createdAt);
  if (ruleId) rows = rows.filter((a) => a.ruleId === parseInt(ruleId as string, 10));
  res.json(rows.map((a) => ({ id: a.id, ruleId: a.ruleId ?? null, reciterName: a.reciterName, audioUrl: a.audioUrl, description: a.description ?? null, createdAt: a.createdAt.toISOString() })));
});
router.post("/audio-library", requireTeacher, async (req, res): Promise<void> => {
  const { ruleId, reciterName, audioUrl, description } = req.body;
  if (!reciterName || !audioUrl) { res.status(400).json({ error: "reciterName, audioUrl required" }); return; }
  const [a] = await db.insert(audioLibraryTable).values({ ruleId: ruleId ?? null, reciterName, audioUrl, description: description ?? null }).returning();
  res.status(201).json({ id: a.id, ruleId: a.ruleId ?? null, reciterName: a.reciterName, audioUrl: a.audioUrl, description: a.description ?? null, createdAt: a.createdAt.toISOString() });
});
router.delete("/audio-library/:id", requireTeacher, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  await db.delete(audioLibraryTable).where(eq(audioLibraryTable.id, id));
  res.sendStatus(204);
});

// ── Student Notes ─────────────────────────────────────────────────────────────
router.get("/students/:studentId/notes", requireTeacher, async (req, res): Promise<void> => {
  const studentId = parseInt(Array.isArray(req.params.studentId) ? req.params.studentId[0] : req.params.studentId, 10);
  const rows = await db.select().from(studentNotesTable).where(eq(studentNotesTable.studentId, studentId)).orderBy(desc(studentNotesTable.createdAt));
  res.json(rows.map((n) => ({ id: n.id, studentId: n.studentId, note: n.note, createdAt: n.createdAt.toISOString() })));
});
router.post("/students/:studentId/notes", requireTeacher, async (req, res): Promise<void> => {
  const studentId = parseInt(Array.isArray(req.params.studentId) ? req.params.studentId[0] : req.params.studentId, 10);
  const { note } = req.body;
  if (!note) { res.status(400).json({ error: "note required" }); return; }
  const [n] = await db.insert(studentNotesTable).values({ studentId, note }).returning();
  res.status(201).json({ id: n.id, studentId: n.studentId, note: n.note, createdAt: n.createdAt.toISOString() });
});

export default router;
