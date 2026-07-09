import { Router } from "express";
import { eq, asc } from "drizzle-orm";
import { db, lessonsTable, tajweedRulesTable } from "@workspace/db";
import { requireAuth, requireTeacher } from "../lib/auth";

const router = Router();

// ── Lessons ──────────────────────────────────────────────────────────────────
router.get("/lessons", requireAuth, async (req, res): Promise<void> => {
  const level = req.query.level ? parseInt(req.query.level as string, 10) : undefined;
  let lessons;
  if (level) {
    lessons = await db.select().from(lessonsTable).where(eq(lessonsTable.level, level)).orderBy(asc(lessonsTable.orderIndex));
  } else {
    lessons = await db.select().from(lessonsTable).orderBy(asc(lessonsTable.level), asc(lessonsTable.orderIndex));
  }
  res.json(lessons.map((l) => ({
    id: l.id, title: l.title, content: l.content, level: l.level,
    orderIndex: l.orderIndex, ruleId: l.ruleId ?? null, videoUrl: l.videoUrl ?? null,
    createdAt: l.createdAt.toISOString(),
  })));
});

router.post("/lessons", requireTeacher, async (req, res): Promise<void> => {
  const { title, content, level, orderIndex, ruleId, videoUrl } = req.body;
  if (!title || !content || !level) { res.status(400).json({ error: "title, content, level required" }); return; }
  const [lesson] = await db.insert(lessonsTable).values({ title, content, level, orderIndex: orderIndex ?? 0, ruleId: ruleId ?? null, videoUrl: videoUrl ?? null }).returning();
  res.status(201).json({ id: lesson.id, title: lesson.title, content: lesson.content, level: lesson.level, orderIndex: lesson.orderIndex, ruleId: lesson.ruleId ?? null, videoUrl: lesson.videoUrl ?? null, createdAt: lesson.createdAt.toISOString() });
});

router.get("/lessons/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, id));
  if (!lesson) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ id: lesson.id, title: lesson.title, content: lesson.content, level: lesson.level, orderIndex: lesson.orderIndex, ruleId: lesson.ruleId ?? null, videoUrl: lesson.videoUrl ?? null, createdAt: lesson.createdAt.toISOString() });
});

router.patch("/lessons/:id", requireTeacher, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const { title, content, orderIndex, ruleId, videoUrl } = req.body;
  const updates: any = {};
  if (title !== undefined) updates.title = title;
  if (content !== undefined) updates.content = content;
  if (orderIndex !== undefined) updates.orderIndex = orderIndex;
  if (ruleId !== undefined) updates.ruleId = ruleId;
  if (videoUrl !== undefined) updates.videoUrl = videoUrl;
  const [updated] = await db.update(lessonsTable).set(updates).where(eq(lessonsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ id: updated.id, title: updated.title, content: updated.content, level: updated.level, orderIndex: updated.orderIndex, ruleId: updated.ruleId ?? null, videoUrl: updated.videoUrl ?? null, createdAt: updated.createdAt.toISOString() });
});

router.delete("/lessons/:id", requireTeacher, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  await db.delete(lessonsTable).where(eq(lessonsTable.id, id));
  res.sendStatus(204);
});

// ── Tajweed Rules ─────────────────────────────────────────────────────────────
router.get("/tajweed-rules", requireAuth, async (_req, res): Promise<void> => {
  const rules = await db.select().from(tajweedRulesTable).orderBy(asc(tajweedRulesTable.level), asc(tajweedRulesTable.orderIndex));
  res.json(rules.map((r) => ({ id: r.id, nameAr: r.nameAr, nameEn: r.nameEn, description: r.description, example: r.example, level: r.level, orderIndex: r.orderIndex, createdAt: r.createdAt.toISOString() })));
});

router.post("/tajweed-rules", requireTeacher, async (req, res): Promise<void> => {
  const { nameAr, nameEn, description, example, level, orderIndex } = req.body;
  if (!nameAr || !nameEn || !description || !example || !level) { res.status(400).json({ error: "Missing required fields" }); return; }
  const [rule] = await db.insert(tajweedRulesTable).values({ nameAr, nameEn, description, example, level, orderIndex: orderIndex ?? 0 }).returning();
  res.status(201).json({ id: rule.id, nameAr: rule.nameAr, nameEn: rule.nameEn, description: rule.description, example: rule.example, level: rule.level, orderIndex: rule.orderIndex, createdAt: rule.createdAt.toISOString() });
});

router.patch("/tajweed-rules/:id", requireTeacher, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const { nameAr, nameEn, description, example, level, orderIndex } = req.body;
  const updates: any = {};
  if (nameAr !== undefined) updates.nameAr = nameAr;
  if (nameEn !== undefined) updates.nameEn = nameEn;
  if (description !== undefined) updates.description = description;
  if (example !== undefined) updates.example = example;
  if (level !== undefined) updates.level = level;
  if (orderIndex !== undefined) updates.orderIndex = orderIndex;
  const [updated] = await db.update(tajweedRulesTable).set(updates).where(eq(tajweedRulesTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ id: updated.id, nameAr: updated.nameAr, nameEn: updated.nameEn, description: updated.description, example: updated.example, level: updated.level, orderIndex: updated.orderIndex, createdAt: updated.createdAt.toISOString() });
});

router.delete("/tajweed-rules/:id", requireTeacher, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  await db.delete(tajweedRulesTable).where(eq(tajweedRulesTable.id, id));
  res.sendStatus(204);
});

export default router;
