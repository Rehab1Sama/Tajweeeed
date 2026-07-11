---
name: Teacher bootstrapping
description: How to make the first user a teacher; admin route protection details
---

## Bootstrap endpoint
POST /api/setup/make-teacher (no auth middleware)
Body: { email: string, secret: string }
- secret must match process.env.SESSION_SECRET → 403 if mismatch
- Finds user by email → 404 if not found
- Sets role to "teacher" → returns updated user

## Admin protection layers
1. Frontend RoleRouter: renders DashboardRouter for students, AdminRouter for teachers
2. AdminLayout: checks useGetCurrentUser().data.role === 'teacher'; shows Arabic
   access-denied message ("ليس لديكِ صلاحية الوصول إلى هذه الصفحة") if not teacher
3. Backend: requireTeacher middleware on all /admin/* API routes

**Why:** Bootstrap endpoint uses SESSION_SECRET (already configured) to authorize the
first teacher promotion — no chicken-and-egg problem.
**How to apply:** After deploying, call POST /api/setup/make-teacher with the teacher's
email + the SESSION_SECRET value to promote them to teacher role.
