import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, enrollmentsTable, progressEntriesTable } from "@workspace/db";
import { requireAuth, requireTeacher } from "../lib/auth";

const router = Router();

// GET /api/users/me
router.get("/users/me", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).localUser;
  if (!user) {
    res.status(404).json({ error: "User not found. Please sync first." });
    return;
  }
  res.json({
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
    name: user.name,
    role: user.role,
    avatarUrl: user.avatarUrl ?? null,
    createdAt: user.createdAt.toISOString(),
  });
});

// POST /api/users/sync
router.post("/users/sync", requireAuth, async (req, res): Promise<void> => {
  const clerkId = (req as any).clerkId;
  const { email, name, avatarUrl } = req.body;

  if (!email || !name) {
    res.status(400).json({ error: "email and name are required" });
    return;
  }

  // Upsert user
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));

  if (existing) {
    const [updated] = await db
      .update(usersTable)
      .set({ email, name, avatarUrl: avatarUrl ?? null, lastActiveAt: new Date() })
      .where(eq(usersTable.clerkId, clerkId))
      .returning();
    res.json({
      id: updated.id,
      clerkId: updated.clerkId,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      avatarUrl: updated.avatarUrl ?? null,
      createdAt: updated.createdAt.toISOString(),
    });
    return;
  }

  const [created] = await db.insert(usersTable).values({ clerkId, email, name, avatarUrl: avatarUrl ?? null, role: "student" }).returning();
  res.json({
    id: created.id,
    clerkId: created.clerkId,
    email: created.email,
    name: created.name,
    role: created.role,
    avatarUrl: created.avatarUrl ?? null,
    createdAt: created.createdAt.toISOString(),
  });
});

// GET /api/students (admin only)
router.get("/students", requireTeacher, async (_req, res): Promise<void> => {
  const students = await db.select().from(usersTable).where(eq(usersTable.role, "student")).orderBy(usersTable.createdAt);

  const enrollments = await db.select().from(enrollmentsTable);
  const progress = await db.select().from(progressEntriesTable);

  const result = students.map((s) => {
    const sEnrollments = enrollments.filter((e) => e.studentId === s.id);
    const activeEnrollment = sEnrollments.find((e) => e.status === "active");
    const sProgress = progress.filter((p) => p.studentId === s.id);
    const mastered = sProgress.filter((p) => p.masteryLevel === 2).length;

    return {
      id: s.id,
      clerkId: s.clerkId,
      email: s.email,
      name: s.name,
      avatarUrl: s.avatarUrl ?? null,
      lastActiveAt: s.lastActiveAt?.toISOString() ?? null,
      totalEnrollments: sEnrollments.length,
      activeEnrollment: activeEnrollment ? {
        id: activeEnrollment.id,
        studentId: activeEnrollment.studentId,
        courseId: activeEnrollment.courseId,
        status: activeEnrollment.status,
        startDate: activeEnrollment.startDate ?? null,
        endDate: activeEnrollment.endDate ?? null,
        createdAt: activeEnrollment.createdAt.toISOString(),
      } : null,
      masteryScore: mastered,
      createdAt: s.createdAt.toISOString(),
    };
  });

  res.json(result);
});

// GET /api/students/:id (admin only)
router.get("/students/:id", requireTeacher, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [student] = await db.select().from(usersTable).where(eq(usersTable.id, id));

  if (!student || student.role !== "student") {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  const sEnrollments = await db.select().from(enrollmentsTable).where(eq(enrollmentsTable.studentId, id));
  const activeEnrollment = sEnrollments.find((e) => e.status === "active");
  const sProgress = await db.select().from(progressEntriesTable).where(eq(progressEntriesTable.studentId, id));
  const mastered = sProgress.filter((p) => p.masteryLevel === 2).length;

  res.json({
    id: student.id,
    clerkId: student.clerkId,
    email: student.email,
    name: student.name,
    avatarUrl: student.avatarUrl ?? null,
    lastActiveAt: student.lastActiveAt?.toISOString() ?? null,
    totalEnrollments: sEnrollments.length,
    activeEnrollment: activeEnrollment ? {
      id: activeEnrollment.id,
      studentId: activeEnrollment.studentId,
      courseId: activeEnrollment.courseId,
      status: activeEnrollment.status,
      startDate: activeEnrollment.startDate ?? null,
      endDate: activeEnrollment.endDate ?? null,
      createdAt: activeEnrollment.createdAt.toISOString(),
    } : null,
    masteryScore: mastered,
    createdAt: student.createdAt.toISOString(),
  });
});

// PATCH /api/students/:id (admin only)
router.patch("/students/:id", requireTeacher, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const { name, avatarUrl } = req.body;

  const [updated] = await db
    .update(usersTable)
    .set({ ...(name && { name }), avatarUrl: avatarUrl ?? undefined })
    .where(eq(usersTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  res.json({
    id: updated.id,
    clerkId: updated.clerkId,
    email: updated.email,
    name: updated.name,
    avatarUrl: updated.avatarUrl ?? null,
    lastActiveAt: updated.lastActiveAt?.toISOString() ?? null,
    totalEnrollments: 0,
    masteryScore: 0,
    createdAt: updated.createdAt.toISOString(),
  });
});

// POST /api/setup/make-teacher (no auth required — bootstrap mechanism)
router.post("/setup/make-teacher", async (req, res): Promise<void> => {
  const { email, secret } = req.body;

  if (!secret || secret !== process.env.SESSION_SECRET) {
    res.status(403).json({ error: "Invalid secret" });
    return;
  }

  if (!email) {
    res.status(400).json({ error: "email is required" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const [updated] = await db
    .update(usersTable)
    .set({ role: "teacher" })
    .where(eq(usersTable.email, email))
    .returning();

  res.json({
    id: updated.id,
    clerkId: updated.clerkId,
    email: updated.email,
    name: updated.name,
    role: updated.role,
    avatarUrl: updated.avatarUrl ?? null,
    createdAt: updated.createdAt.toISOString(),
  });
});

export default router;
