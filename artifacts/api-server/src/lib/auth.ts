import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { db } from "@workspace/db";
import { usersTable, enrollmentsTable } from "@workspace/db";
import { eq, and, gte } from "drizzle-orm";

/**
 * Verify Clerk session only — does NOT require the user to exist in the local DB.
 * Use for endpoints that create or sync the user (e.g. POST /api/users/sync).
 */
export async function requireClerkSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  const auth = getAuth(req);
  if (!auth?.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as any).clerkId = auth.userId;
  next();
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const auth = getAuth(req);
  if (!auth?.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as any).clerkId = auth.userId;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, auth.userId));
  if (!user) {
    // User not yet synced — return 401 so frontend triggers /users/sync
    res.status(401).json({ error: "User not provisioned. Call /api/users/sync first." });
    return;
  }
  (req as any).localUser = user;
  // Update last active (fire-and-forget)
  db.update(usersTable).set({ lastActiveAt: new Date() }).where(eq(usersTable.id, user.id)).catch(() => {});
  next();
}

export async function requireTeacher(req: Request, res: Response, next: NextFunction): Promise<void> {
  await requireAuth(req, res, async () => {
    const user = (req as any).localUser;
    if (!user || user.role !== "teacher") {
      res.status(403).json({ error: "Forbidden: teacher only" });
      return;
    }
    next();
  });
}

/**
 * Returns the active enrollment for a student in a specific course, or null.
 * If courseId is omitted, returns any active enrollment.
 */
export async function getActiveEnrollment(studentId: number, courseId?: number) {
  const today = new Date().toISOString().split("T")[0]!;
  const rows = await db
    .select()
    .from(enrollmentsTable)
    .where(
      and(
        eq(enrollmentsTable.studentId, studentId),
        eq(enrollmentsTable.status, "active"),
        courseId !== undefined ? eq(enrollmentsTable.courseId, courseId) : undefined,
      ),
    );
  // Also check endDate hasn't passed
  const active = rows.find((e) => !e.endDate || e.endDate >= today);
  return active ?? null;
}
