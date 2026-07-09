import { Switch, Route } from "wouter";
import AdminLayout from "./layout";

// Pages
import AdminOverview from "./index";
import StudentsList from "./students";
import StudentDetail from "./students/[id]";
import CoursesList from "./courses";
import EnrollmentsList from "./enrollments";
import AssignmentsReview from "./assignments";
import RecordingsReview from "./recordings";
import MessagesAdmin from "./messages";
import AnnouncementsAdmin from "./announcements";
import PaymentsAdmin from "./payments";
import ApplicationsAdmin from "./applications";
import TajweedRulesAdmin from "./tajweed-rules";
import DailyWirdAdmin from "./daily-wird";
import AudioLibraryAdmin from "./audio-library";
import CommentTemplatesAdmin from "./comment-templates";
import CertificatesAdmin from "./certificates";
import WeeklyStarAdmin from "./weekly-star";
import StatsAdmin from "./stats";

export default function AdminRouter() {
  const basePath = "/admin";

  return (
    <AdminLayout>
      <Switch>
        <Route path={`${basePath}`} component={AdminOverview} />
        <Route path={`${basePath}/`} component={AdminOverview} />
        <Route path={`${basePath}/students`} component={StudentsList} />
        <Route path={`${basePath}/students/:id`} component={StudentDetail} />
        <Route path={`${basePath}/courses`} component={CoursesList} />
        <Route path={`${basePath}/enrollments`} component={EnrollmentsList} />
        <Route path={`${basePath}/assignments`} component={AssignmentsReview} />
        <Route path={`${basePath}/recordings`} component={RecordingsReview} />
        <Route path={`${basePath}/messages`} component={MessagesAdmin} />
        <Route path={`${basePath}/announcements`} component={AnnouncementsAdmin} />
        <Route path={`${basePath}/payments`} component={PaymentsAdmin} />
        <Route path={`${basePath}/applications`} component={ApplicationsAdmin} />
        <Route path={`${basePath}/tajweed-rules`} component={TajweedRulesAdmin} />
        <Route path={`${basePath}/daily-wird`} component={DailyWirdAdmin} />
        <Route path={`${basePath}/audio-library`} component={AudioLibraryAdmin} />
        <Route path={`${basePath}/comment-templates`} component={CommentTemplatesAdmin} />
        <Route path={`${basePath}/certificates`} component={CertificatesAdmin} />
        <Route path={`${basePath}/weekly-star`} component={WeeklyStarAdmin} />
        <Route path={`${basePath}/stats`} component={StatsAdmin} />
        <Route>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-2xl font-bold text-primary mb-2">الصفحة غير موجودة</h2>
            <p className="text-muted-foreground">تعذر العثور على هذه الصفحة في لوحة الإدارة.</p>
          </div>
        </Route>
      </Switch>
    </AdminLayout>
  );
}
