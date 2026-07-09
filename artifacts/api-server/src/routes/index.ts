import { Router } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import coursesRouter from "./courses";
import lessonsAndRulesRouter from "./lessonsAndRules";
import enrollmentsRouter from "./enrollments";
import assignmentsRouter from "./assignments";
import audioAndMessagesRouter from "./audioAndMessages";
import miscRouter from "./misc";
import dashboardRouter from "./dashboard";

const router = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(coursesRouter);
router.use(lessonsAndRulesRouter);
router.use(enrollmentsRouter);
router.use(assignmentsRouter);
router.use(audioAndMessagesRouter);
router.use(miscRouter);
router.use(dashboardRouter);

export default router;
