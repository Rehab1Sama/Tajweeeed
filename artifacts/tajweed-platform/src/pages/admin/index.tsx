import { useGetTeacherDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileEdit, Mic, UserPlus, MessageSquare, DollarSign, Activity } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function AdminOverview() {
  const { data: dashboard, isLoading } = useGetTeacherDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const statCards = [
    { title: "إجمالي الطالبات", value: dashboard?.totalStudents || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "الطالبات النشطات", value: dashboard?.activeStudents || 0, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "واجبات بانتظار التقييم", value: dashboard?.pendingSubmissions || 0, icon: FileEdit, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "تلاوات بانتظار التقييم", value: dashboard?.pendingRecordings || 0, icon: Mic, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "طلبات التحاق جديدة", value: dashboard?.pendingApplications || 0, icon: UserPlus, color: "text-rose-600", bg: "bg-rose-100" },
    { title: "رسائل غير مقروءة", value: dashboard?.unreadMessages || 0, icon: MessageSquare, color: "text-indigo-600", bg: "bg-indigo-100" },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">لوحة الإدارة</h1>
          <p className="text-muted-foreground font-serif">ملخص سريع لحالة المنصة وأهم المهام المعلقة.</p>
        </div>
        <div className="bg-card border border-border px-4 py-2 rounded-lg text-sm font-medium ui-sans flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-secondary" />
          <span>إجمالي الإيرادات:</span>
          <span className="text-primary font-bold">{dashboard?.totalRevenue || 0} د.ك</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-border">
            <CardContent className="p-4 flex flex-col items-center text-center justify-center h-full gap-3">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-full`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold ui-sans text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground ui-sans font-medium">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Course Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>الدورة الحالية</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard?.activeCourse ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-1">{dashboard.activeCourse.title}</h3>
                    <p className="text-muted-foreground ui-sans text-sm">المستوى {dashboard.activeCourse.level}</p>
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium ui-sans">
                    نشطة
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/30 p-3 rounded-lg text-center">
                    <div className="text-sm text-muted-foreground ui-sans mb-1">المدة</div>
                    <div className="font-bold ui-sans">{dashboard.activeCourse.durationDays} يوم</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg text-center">
                    <div className="text-sm text-muted-foreground ui-sans mb-1">المسجلات</div>
                    <div className="font-bold ui-sans">{dashboard.activeCourse.enrolledCount} / {dashboard.activeCourse.capacity}</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg text-center">
                    <div className="text-sm text-muted-foreground ui-sans mb-1">تاريخ البدء</div>
                    <div className="font-bold ui-sans text-xs pt-1">{dashboard.activeCourse.startDate ? format(new Date(dashboard.activeCourse.startDate), 'yyyy/MM/dd') : '-'}</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg text-center">
                    <div className="text-sm text-muted-foreground ui-sans mb-1">تاريخ الانتهاء</div>
                    <div className="font-bold ui-sans text-xs pt-1">{dashboard.activeCourse.endDate ? format(new Date(dashboard.activeCourse.endDate), 'yyyy/MM/dd') : '-'}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                لا توجد دورة نشطة حالياً.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>النشاطات الأخيرة</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard?.recentActivity && dashboard.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {dashboard.recentActivity.map((activity, i) => (
                  <div key={i} className="flex gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-primary font-bold ui-sans">{activity.studentName}</span>
                        <span className="text-xs text-muted-foreground ui-sans">• {format(new Date(activity.createdAt), 'hh:mm a', { locale: ar })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                لا توجد نشاطات حديثة.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
