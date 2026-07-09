import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, coursesTable, enrollmentsTable } from "@workspace/db";
import { requireAuth, requireTeacher } from "../lib/auth";

const router = Router();

function formatCourse(c: any, enrolledCount: number) {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    level: c.level,
    durationDays: c.durationDays,
    price: parseFloat(c.price),
    capacity: c.capacity,
    startDate: c.startDate ?? null,
    endDate: c.endDate ?? null,
    isActive: c.isActive,
    enrolledCount,
    createdAt: c.createdAt.toISOString(),
  };
}

router.get("/courses", requireAuth, async (_req, res): Promise<void> => {
  const courses = await db.select().from(coursesTable).orderBy(coursesTable.level);
  const enrollments = await db.select().from(enrollmentsTable);

  res.json(courses.map((c) => {
    const count = enrollments.filter((e) => e.courseId === c.id && e.status === "active").length;
    return formatCourse(c, count);
  }));
});

router.post("/courses", requireTeacher, async (req, res): Promise<void> => {
  const { title, description, level, durationDays, price, capacity, startDate, endDate } = req.body;
  if (!title || !description || !level) {
    res.status(400).json({ error: "title, description, level required" });
    return;
  }
  const [course] = await db.insert(coursesTable).values({
    title, description, level, durationDays: durationDays ?? 14,
    price: String(price ?? 0), capacity: capacity ?? 20,
    startDate: startDate ?? null, endDate: endDate ?? null,
  }).returning();
  res.status(201).json(formatCourse(course, 0));
});

router.get("/courses/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, id));
  if (!course) { res.status(404).json({ error: "Not found" }); return; }
  const enrollments = await db.select().from(enrollmentsTable).where(eq(enrollmentsTable.courseId, id));
  const count = enrollments.filter((e) => e.status === "active").length;
  res.json(formatCourse(course, count));
});

router.patch("/courses/:id", requireTeacher, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const { title, description, durationDays, price, capacity, startDate, endDate, isActive } = req.body;
  const updates: any = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (durationDays !== undefined) updates.durationDays = durationDays;
  if (price !== undefined) updates.price = String(price);
  if (capacity !== undefined) updates.capacity = capacity;
  if (startDate !== undefined) updates.startDate = startDate;
  if (endDate !== undefined) updates.endDate = endDate;
  if (isActive !== undefined) updates.isActive = isActive;

  const [updated] = await db.update(coursesTable).set(updates).where(eq(coursesTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  const enrollments = await db.select().from(enrollmentsTable).where(eq(enrollmentsTable.courseId, id));
  const count = enrollments.filter((e) => e.status === "active").length;
  res.json(formatCourse(updated, count));
});

router.delete("/courses/:id", requireTeacher, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  await db.delete(coursesTable).where(eq(coursesTable.id, id));
  res.sendStatus(204);
});

export default router;
