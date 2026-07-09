import { Switch, Route, useLocation } from "wouter";
import DashboardLayout from "./layout";

// Pages
import DashboardOverview from "./index";
import LessonsList from "./lessons";
import LessonDetail from "./lessons/[id]";
import TajweedRules from "./tajweed-rules";
import ProgressMap from "./progress";
import MyCourse from "./my-course";
import AssignmentsList from "./assignments";
import AssignmentDetail from "./assignments/[id]";
import Recordings from "./recordings";
import Messages from "./messages";
import Certificates from "./certificates";
import Announcements from "./announcements";

export default function DashboardRouter() {
  const [location] = useLocation();
  const basePath = "/dashboard";

  // Note: Route components inside DashboardRouter will receive paths relative to the base passed to wouter if using nesting, 
  // but wouter standard is flat. We matched `/dashboard/*?` in App.tsx. 
  // Inside DashboardRouter, we use the full paths or use a nested Router. 
  // The simplest way is to match full paths.
  
  return (
    <DashboardLayout>
      <Switch>
        <Route path={`${basePath}`} component={DashboardOverview} />
        <Route path={`${basePath}/`} component={DashboardOverview} />
        <Route path={`${basePath}/lessons`} component={LessonsList} />
        <Route path={`${basePath}/lessons/:id`} component={LessonDetail} />
        <Route path={`${basePath}/tajweed-rules`} component={TajweedRules} />
        <Route path={`${basePath}/progress`} component={ProgressMap} />
        <Route path={`${basePath}/my-course`} component={MyCourse} />
        <Route path={`${basePath}/assignments`} component={AssignmentsList} />
        <Route path={`${basePath}/assignments/:id`} component={AssignmentDetail} />
        <Route path={`${basePath}/recordings`} component={Recordings} />
        <Route path={`${basePath}/messages`} component={Messages} />
        <Route path={`${basePath}/certificates`} component={Certificates} />
        <Route path={`${basePath}/announcements`} component={Announcements} />
        <Route>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-2xl font-bold text-primary mb-2">الصفحة غير موجودة</h2>
            <p className="text-muted-foreground">تعذر العثور على هذه الصفحة في لوحة التحكم.</p>
          </div>
        </Route>
      </Switch>
    </DashboardLayout>
  );
}
