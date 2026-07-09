import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, assignmentsTable, assignmentSubmissionsTable, enrollmentsTable, usersTable } from "@workspace/db";
import { requireAuth, requireTeacher } from "../lib/auth";

const router = Router();

router.get("/assignments", requireAuth, async (req, res): Promise<void> => {
  const { courseId } = req.query;
  let rows = await db.select().from(assignmentsTable).orderBy(assignmentsTable.createdAt);
  if (courseId) rows = rows.filter((a) => a.courseId === parseInt(courseId as string, 10));
  const submissions = await db.select().from(assignmentSubmissionsTable);
  res.json(rows.map((a) => ({
    id: a.id, courseId: a.courseId, title: a.title, description: a.description,
    dueDate: a.dueDate ?? null, submissionsCount: submissions.filter((s) => s.assignmentId === a.id).length,
    createdAt: a.createdAt.toISOString(),
  })));
});

router.post("/assignments", requireTeacher, async (req, res): Promise<void> => {
  const { courseId, title, description, dueDate } = req.body;
  if (!courseId || !title || !description) { res.status(400).json({ error: "courseId, title, description required" }); return; }
  const [a] = await db.insert(assignmentsTable).values({ courseId, title, description, dueDate: dueDate ?? null }).returning();
  res.status(201).json({ id: a.id, courseId: a.courseId, title: a.title, description: a.description, dueDate: a.dueDate ?? null, submissionsCount: 0, createdAt: a.createdAt.toISOString() });
});

router.patch("/assignments/:id", requireTeacher, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const { title, description, dueDate } = req.body;
  const updates: any = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (dueDate !== undefined) updates.dueDate = dueDate;
  const [updated] = await db.update(assignmentsTable).set(updates).where(eq(assignmentsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  const subs = await db.select().from(assignmentSubmissionsTable).where(eq(assignmentSubmissionsTable.assignmentId, id));
  res.json({ id: updated.id, courseId: updated.courseId, title: updated.title, description: updated.description, dueDate: updated.dueDate ?? null, submissionsCount: subs.length, createdAt: updated.createdAt.toISOString() });
});

router.delete("/assignments/:id", requireTeacher, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  await db.delete(assignmentsTable).where(eq(assignmentsTable.id, id));
  res.sendStatus(204);
});

// Submissions
router.get("/assignments/:id/submissions", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const user = (req as any).localUser;
  let rows = await db.select().from(assignmentSubmissionsTable).where(eq(assignmentSubmissionsTable.assignmentId, id));
  if (user?.role !== "teacher") rows = rows.filter((s) => s.studentId === user.id);
  const students = await db.select().from(usersTable);
  res.json(rows.map((s) => {
    const student = students.find((u) => u.id === s.studentId);
    return {
      id: s.id, assignmentId: s.assignmentId, studentId: s.studentId,
      content: s.content, audioUrl: s.audioUrl ?? null, grade: s.grade ?? null,
      feedback: s.feedback ?? null, status: s.status,
      student: student ? { id: student.id, clerkId: student.clerkId, email: student.email, name: student.name, role: student.role, avatarUrl: student.avatarUrl ?? null, createdAt: student.createdAt.toISOString() } : null,
      createdAt: s.createdAt.toISOString(),
    };
  }));
});

router.post("/assignments/:id/submissions", requireAuth, async (req, res): Promise<void> => {
  const assignmentId = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const user = (req as any).localUser;
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  // Check active enrollment
  const [assignment] = await db.select().from(assignmentsTable).where(eq(assignmentsTable.id, assignmentId));
  if (!assignment) { res.status(404).json({ error: "Assignment not found" }); return; }
  if (user.role !== "teacher") {
    const enrollments = await db.select().from(enrollmentsTable).where(eq(enrollmentsTable.studentId, user.id));
    const hasActive = enrollments.some((e) => e.courseId === assignment.courseId && e.status === "active");
    if (!hasActive) { res.status(403).json({ error: "No active enrollment" }); return; }
  }
  const { content, audioUrl } = req.body;
  if (!content) { res.status(400).json({ error: "content required" }); return; }
  const [s] = await db.insert(assignmentSubmissionsTable).values({ assignmentId, studentId: user.id, content, audioUrl: audioUrl ?? null }).returning();
  res.status(201).json({ id: s.id, assignmentId: s.assignmentId, studentId: s.studentId, content: s.content, audioUrl: s.audioUrl ?? null, grade: null, feedback: null, status: s.status, createdAt: s.createdAt.toISOString() });
});

router.patch("/submissions/:id", requireTeacher, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const { grade, feedback, status } = req.body;
  const updates: any = {};
  if (grade !== undefined) updates.grade = grade;
  if (feedback !== undefined) updates.feedback = feedback;
  if (status !== undefined) updates.status = status;
  const [updated] = await db.update(assignmentSubmissionsTable).set(updates).where(eq(assignmentSubmissionsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  const [student] = await db.select().from(usersTable).where(eq(usersTable.id, updated.studentId));
  res.json({
    id: updated.id, assignmentId: updated.assignmentId, studentId: updated.studentId,
    content: updated.content, audioUrl: updated.audioUrl ?? null, grade: updated.grade ?? null,
    feedback: updated.feedback ?? null, status: updated.status,
    student: student ? { id: student.id, clerkId: student.clerkId, email: student.email, name: student.name, role: student.role, avatarUrl: student.avatarUrl ?? null, createdAt: student.createdAt.toISOString() } : null,
    createdAt: updated.createdAt.toISOString(),
  });
});

export default router;
