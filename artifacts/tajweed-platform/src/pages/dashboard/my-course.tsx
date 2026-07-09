import { useGetStudentDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen, Calendar, Users, Info, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function MyCourse() {
  const { data: dashboard, isLoading } = useGetStudentDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const enrollment = dashboard?.activeEnrollment;

  if (!enrollment) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <BookOpen className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-4">لا يوجد اشتراك فعال</h2>
        <p className="text-muted-foreground font-serif mb-8 leading-relaxed">
          أنتِ لستِ مسجلة في أي دورة حالياً، أو انتهت فترة اشتراكك في الدورة السابقة.
          يمكنك تصفح الدروس وأحكام التجويد، لكن لن تتمكني من تقديم الواجبات أو التلاوات.
        </p>
      </div>
    );
  }

  const course = enrollment.course;
  const isReadOnly = enrollment.status !== 'active';

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-primary mb-2">دورتي الحالية</h1>
        <p className="text-muted-foreground font-serif">تفاصيل الدورة المسجلة فيها والجدول الزمني.</p>
      </header>

      {isReadOnly && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold mb-1">الاشتراك منتهي</h4>
            <p className="text-sm font-serif">حالة اشتراكك حالياً ({enrollment.status === 'completed' ? 'مكتمل' : 'ملغى'}). يمكنك الاطلاع على المحتوى للرجوع إليه، ولكن تم إيقاف إمكانية التفاعل وتسليم الواجبات.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="bg-muted/30 border-b border-border">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold ui-sans">
                      المستوى {course?.level}
                    </span>
                    <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold ui-sans">
                      {dashboard.daysRemaining} يوم متبقي
                    </span>
                  </div>
                  <CardTitle className="text-2xl font-bold text-primary">{course?.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
                    <Info className="h-5 w-5 text-muted-foreground" />
                    عن الدورة
                  </h3>
                  <p className="text-muted-foreground font-serif leading-relaxed">
                    {course?.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                  <div className="bg-muted/20 p-4 rounded-xl text-center">
                    <Calendar className="h-6 w-6 text-primary mx-auto mb-2 opacity-70" />
                    <div className="text-sm text-muted-foreground ui-sans mb-1">تاريخ البدء</div>
                    <div className="font-bold ui-sans">{enrollment.startDate ? format(new Date(enrollment.startDate), 'yyyy/MM/dd') : '-'}</div>
                  </div>
                  <div className="bg-muted/20 p-4 rounded-xl text-center">
                    <Calendar className="h-6 w-6 text-primary mx-auto mb-2 opacity-70" />
                    <div className="text-sm text-muted-foreground ui-sans mb-1">تاريخ الانتهاء</div>
                    <div className="font-bold ui-sans">{enrollment.endDate ? format(new Date(enrollment.endDate), 'yyyy/MM/dd') : '-'}</div>
                  </div>
                  <div className="bg-muted/20 p-4 rounded-xl text-center">
                    <BookOpen className="h-6 w-6 text-primary mx-auto mb-2 opacity-70" />
                    <div className="text-sm text-muted-foreground ui-sans mb-1">المدة الكلية</div>
                    <div className="font-bold ui-sans">{course?.durationDays} يوم</div>
                  </div>
                  <div className="bg-muted/20 p-4 rounded-xl text-center">
                    <Users className="h-6 w-6 text-primary mx-auto mb-2 opacity-70" />
                    <div className="text-sm text-muted-foreground ui-sans mb-1">عدد الطالبات</div>
                    <div className="font-bold ui-sans">{course?.enrolledCount} طالبة</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>المهام المطلوبة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border">
                  <span className="font-medium">الواجبات المعلقة</span>
                  <span className="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center text-sm font-bold ui-sans">{dashboard.pendingAssignments}</span>
                </div>
                <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border">
                  <span className="font-medium">تقييمات التلاوة بانتظار الرد</span>
                  <span className="bg-secondary text-secondary-foreground h-6 w-6 rounded-full flex items-center justify-center text-sm font-bold ui-sans">{dashboard.pendingRecordingFeedback}</span>
                </div>
                
                {!isReadOnly && (
                  <div className="pt-4 grid grid-cols-2 gap-2">
                    <Link href="/dashboard/assignments">
                      <Button variant="outline" className="w-full ui-sans text-xs">عرض الواجبات</Button>
                    </Link>
                    <Link href="/dashboard/recordings">
                      <Button variant="outline" className="w-full ui-sans text-xs">التسجيلات</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
