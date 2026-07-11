import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import {
  db, usersTable, enrollmentsTable, coursesTable, assignmentSubmissionsTable,
  audioRecordingsTable, messagesTable, applicationsTable, paymentsTable,
  certificatesTable, progressEntriesTable, tajweedRulesTable
} from "@workspace/db";
import { requireAuth, requireTeacher } from "../lib/auth";

const router = Router();

// Teacher Dashboard
router.get("/dashboard/teacher", requireTeacher, async (_req, res): Promise<void> => {
  const [students, enrollments, submissions, recordings, applications, messages, payments, courses] = await Promise.all([
    db.select().from(usersTable).where(eq(usersTable.role, "student")),
    db.select().from(enrollmentsTable),
    db.select().from(assignmentSubmissionsTable),
    db.select().from(audioRecordingsTable),
    db.select().from(applicationsTable),
    db.select().from(messagesTable),
    db.select().from(paymentsTable),
    db.select().from(coursesTable),
  ]);

  const activeStudents = enrollments.filter((e) => e.status === "active").length;
  const pendingSubmissions = submissions.filter((s) => s.status === "pending").length;
  const pendingRecordings = recordings.filter((r) => r.status === "pending").length;
  const pendingApplications = applications.filter((a) => a.status === "pending").length;
  const unreadMessages = messages.filter((m) => !m.isRead).length;
  const totalRevenue = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const activeCourseData = courses.find((c) => c.isActive);

  const recentActivity = [
    ...submissions.slice(-5).map((s) => ({ type: "submission", description: "تسليم واجب جديد", studentName: null, createdAt: s.createdAt.toISOString() })),
    ...recordings.slice(-3).map((r) => ({ type: "recording", description: "تسجيل صوتي جديد", studentName: null, createdAt: r.createdAt.toISOString() })),
    ...applications.slice(-3).map((a) => ({ type: "application", description: `طلب انضمام من ${a.name}`, studentName: a.name, createdAt: a.createdAt.toISOString() })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);

  res.json({
    totalStudents: students.length,
    activeStudents,
    pendingSubmissions,
    pendingRecordings,
    pendingApplications,
    unreadMessages,
    totalRevenue,
    activeCourse: activeCourseData ? {
      id: activeCourseData.id, title: activeCourseData.title, description: activeCourseData.description,
      level: activeCourseData.level, durationDays: activeCourseData.durationDays, price: parseFloat(activeCourseData.price),
      capacity: activeCourseData.capacity, startDate: activeCourseData.startDate ?? null, endDate: activeCourseData.endDate ?? null,
      isActive: activeCourseData.isActive, enrolledCount: enrollments.filter((e) => e.courseId === activeCourseData.id && e.status === "active").length,
      createdAt: activeCourseData.createdAt.toISOString(),
    } : null,
    recentActivity,
  });
});

// Student Dashboard
router.get("/dashboard/student", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).localUser;
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const [enrollments, progress, rules, certificates, submissions, recordings] = await Promise.all([
    db.select().from(enrollmentsTable).where(eq(enrollmentsTable.studentId, user.id)),
    db.select().from(progressEntriesTable).where(eq(progressEntriesTable.studentId, user.id)),
    db.select().from(tajweedRulesTable),
    db.select().from(certificatesTable).where(eq(certificatesTable.studentId, user.id)),
    db.select().from(assignmentSubmissionsTable).where(eq(assignmentSubmissionsTable.studentId, user.id)),
    db.select().from(audioRecordingsTable).where(eq(audioRecordingsTable.studentId, user.id)),
  ]);

  const activeEnrollment = enrollments.find((e) => e.status === "active");
  const masteredCount = progress.filter((p) => p.masteryLevel === 2).length;
  const pendingAssignments = submissions.filter((s) => s.status === "pending").length;
  const pendingRecordingFeedback = recordings.filter((r) => r.status === "pending").length;

  let daysRemaining: number | null = null;
  if (activeEnrollment?.endDate) {
    const end = new Date(activeEnrollment.endDate);
    daysRemaining = Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86400000));
  }

  const [coursesData, courseEnrollments] = activeEnrollment
    ? await Promise.all([
        db.select().from(coursesTable).where(eq(coursesTable.id, activeEnrollment.courseId)),
        db.select().from(enrollmentsTable).where(eq(enrollmentsTable.courseId, activeEnrollment.courseId)),
      ])
    : [[], []];

  const courseEnrolledCount = courseEnrollments.filter((e) => e.status === "active").length;

  res.json({
    activeEnrollment: activeEnrollment ? {
      id: activeEnrollment.id, studentId: activeEnrollment.studentId, courseId: activeEnrollment.courseId,
      status: activeEnrollment.status, startDate: activeEnrollment.startDate ?? null, endDate: activeEnrollment.endDate ?? null,
      course: coursesData[0] ? { id: coursesData[0].id, title: coursesData[0].title, description: coursesData[0].description, level: coursesData[0].level, durationDays: coursesData[0].durationDays, price: parseFloat(coursesData[0].price), capacity: coursesData[0].capacity, startDate: coursesData[0].startDate ?? null, endDate: coursesData[0].endDate ?? null, isActive: coursesData[0].isActive, enrolledCount: courseEnrolledCount, createdAt: coursesData[0].createdAt.toISOString() } : null,
      createdAt: activeEnrollment.createdAt.toISOString(),
    } : null,
    masteredRulesCount: masteredCount,
    totalRulesCount: rules.length,
    pendingAssignments,
    pendingRecordingFeedback,
    certificates: certificates.map((c) => ({ id: c.id, studentId: c.studentId, courseId: c.courseId, issuedAt: c.issuedAt.toISOString(), certificateUrl: c.certificateUrl ?? null })),
    daysRemaining,
    lastActivity: user.lastActiveAt?.toISOString() ?? null,
  });
});

// Admin Stats
router.get("/admin/stats", requireTeacher, async (_req, res): Promise<void> => {
  const [students, enrollments, payments, progress, courses] = await Promise.all([
    db.select().from(usersTable).where(eq(usersTable.role, "student")),
    db.select().from(enrollmentsTable),
    db.select().from(paymentsTable),
    db.select().from(progressEntriesTable),
    db.select().from(coursesTable),
  ]);

  const totalRevenue = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const mastered = progress.filter((p) => p.masteryLevel === 2).length;
  const averageMastery = students.length > 0 ? mastered / students.length : 0;

  const byLevel = [1, 2].map((level) => {
    const courseIdsAtLevel = courses.filter((c) => c.level === level).map((c) => c.id);
    return {
      level,
      count: enrollments.filter((e) => e.status === "active" && courseIdsAtLevel.includes(e.courseId)).length,
    };
  });

  res.json({
    totalStudents: students.length,
    activeEnrollments: enrollments.filter((e) => e.status === "active").length,
    completedCourses: enrollments.filter((e) => e.status === "completed").length,
    totalRevenue,
    averageMastery,
    topStudents: students.slice(0, 5).map((s) => ({ id: s.id, clerkId: s.clerkId, email: s.email, name: s.name, role: s.role, avatarUrl: s.avatarUrl ?? null, createdAt: s.createdAt.toISOString() })),
    enrollmentsByLevel: byLevel,
  });
});

// Common mistakes
router.get("/admin/common-mistakes", requireTeacher, async (_req, res): Promise<void> => {
  const progress = await db.select().from(progressEntriesTable);
  const rules = await db.select().from(tajweedRulesTable);
  const mistakeMap: Record<number, number> = {};
  progress.filter((p) => p.masteryLevel < 2).forEach((p) => {
    mistakeMap[p.ruleId] = (mistakeMap[p.ruleId] ?? 0) + 1;
  });
  const result = Object.entries(mistakeMap).map(([ruleId, count]) => {
    const rule = rules.find((r) => r.id === parseInt(ruleId));
    return { ruleId: parseInt(ruleId), ruleName: rule?.nameAr ?? "", correctionCount: count };
  }).sort((a, b) => b.correctionCount - a.correctionCount);
  res.json(result);
});

export default router;
