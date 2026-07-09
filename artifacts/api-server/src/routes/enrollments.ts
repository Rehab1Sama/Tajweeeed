import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db, enrollmentsTable, usersTable, coursesTable } from "@workspace/db";
import { requireAuth, requireTeacher } from "../lib/auth";

const router = Router();

async function formatEnrollment(e: any) {
  const [student] = await db.select().from(usersTable).where(eq(usersTable.id, e.studentId));
  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, e.courseId));
  return {
    id: e.id,
    studentId: e.studentId,
    courseId: e.courseId,
    status: e.status,
    startDate: e.startDate ?? null,
    endDate: e.endDate ?? null,
    student: student ? { id: student.id, clerkId: student.clerkId, email: student.email, name: student.name, role: student.role, avatarUrl: student.avatarUrl ?? null, createdAt: student.createdAt.toISOString() } : null,
    course: course ? { id: course.id, title: course.title, description: course.description, level: course.level, durationDays: course.durationDays, price: parseFloat(course.price), capacity: course.capacity, startDate: course.startDate ?? null, endDate: course.endDate ?? null, isActive: course.isActive, enrolledCount: 0, createdAt: course.createdAt.toISOString() } : null,
    createdAt: e.createdAt.toISOString(),
  };
}

router.get("/enrollments", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).localUser;
  const { courseId, status } = req.query;
  let rows;
  if (user?.role === "teacher") {
    rows = await db.select().from(enrollmentsTable).orderBy(enrollmentsTable.createdAt);
    if (courseId) rows = rows.filter((e) => e.courseId === parseInt(courseId as string, 10));
    if (status) rows = rows.filter((e) => e.status === status);
  } else {
    rows = await db.select().from(enrollmentsTable).where(eq(enrollmentsTable.studentId, user.id));
  }
  res.json(await Promise.all(rows.map(formatEnrollment)));
});

router.post("/enrollments", requireTeacher, async (req, res): Promise<void> => {
  const { studentId, courseId, startDate } = req.body;
  if (!studentId || !courseId) { res.status(400).json({ error: "studentId and courseId required" }); return; }
  const [e] = await db.insert(enrollmentsTable).values({ studentId, courseId, startDate: startDate ?? null, status: "active" }).returning();
  res.status(201).json(await formatEnrollment(e));
});

router.get("/enrollments/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const user = (req as any).localUser;
  const [e] = await db.select().from(enrollmentsTable).where(eq(enrollmentsTable.id, id));
  if (!e) { res.status(404).json({ error: "Not found" }); return; }
  // Students can only view their own enrollments
  if (user?.role !== "teacher" && e.studentId !== user?.id) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  res.json(await formatEnrollment(e));
});

router.patch("/enrollments/:id", requireTeacher, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const { status, startDate, endDate } = req.body;
  const updates: any = {};
  if (status !== undefined) updates.status = status;
  if (startDate !== undefined) updates.startDate = startDate;
  if (endDate !== undefined) updates.endDate = endDate;
  const [updated] = await db.update(enrollmentsTable).set(updates).where(eq(enrollmentsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json(await formatEnrollment(updated));
});

export default router;
