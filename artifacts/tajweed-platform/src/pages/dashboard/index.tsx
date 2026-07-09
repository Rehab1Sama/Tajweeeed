import { useGetStudentDashboard, useGetDailyWird } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen, Star, FileEdit, Mic, Target, CalendarDays, Award } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";

export default function DashboardOverview() {
  const { data: dashboard, isLoading } = useGetStudentDashboard();
  const { data: dailyWird } = useGetDailyWird();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const hasActiveEnrollment = dashboard?.activeEnrollment?.status === 'active';
  const progressPercent = dashboard?.totalRulesCount 
    ? Math.round((dashboard.masteredRulesCount / dashboard.totalRulesCount) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-primary mb-2">السلام عليكم ورحمة الله</h1>
        <p className="text-muted-foreground font-serif text-lg">أهلاً بكِ في مساحتك التعليمية. نسأل الله أن يبارك في وقتك وجهدك.</p>
      </header>

      {/* Progress Ring and Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-40 h-40 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-muted/50" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-secondary" strokeWidth="8"
                  strokeDasharray={`${progressPercent * 2.83} 283`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-primary">
                <span className="text-4xl font-bold ui-sans">{progressPercent}%</span>
                <span className="text-xs font-serif font-medium mt-1">نسبة الإتقان</span>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-right">
              <h2 className="text-2xl font-bold text-primary mb-2">تقدمك العام</h2>
              <p className="text-muted-foreground mb-6 font-serif">
                لقد أتقنتِ {dashboard?.masteredRulesCount || 0} من أصل {dashboard?.totalRulesCount || 0} حكماً تجويدياً في الدورة.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 min-w-[120px]">
                  <div className="text-3xl font-bold text-primary ui-sans mb-1">{dashboard?.pendingAssignments || 0}</div>
                  <div className="text-sm font-medium text-muted-foreground ui-sans">واجبات معلقة</div>
                </div>
                <div className="bg-secondary/5 rounded-xl p-4 border border-secondary/10 min-w-[120px]">
                  <div className="text-3xl font-bold text-secondary ui-sans mb-1">{dashboard?.pendingRecordingFeedback || 0}</div>
                  <div className="text-sm font-medium text-muted-foreground ui-sans">تلاوات للتقييم</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {dashboard?.activeEnrollment ? (
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                الدورة الحالية
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-primary mb-2">{dashboard.activeEnrollment.course?.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                {dashboard.activeEnrollment.course?.description}
              </p>
              
              {dashboard.daysRemaining !== null && dashboard.daysRemaining !== undefined && (
                <div className="mt-auto">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium ui-sans">الأيام المتبقية</span>
                    <span className="text-2xl font-bold text-secondary ui-sans">{dashboard.daysRemaining} <span className="text-sm text-muted-foreground">يوم</span></span>
                  </div>
                  <Progress value={(1 - (dashboard.daysRemaining / (dashboard.activeEnrollment.course?.durationDays || 30))) * 100} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center text-center p-6 bg-muted/30">
            <Target className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-primary mb-2">لا توجد دورة نشطة</h3>
            <p className="text-sm text-muted-foreground mb-4">أنتِ غير مسجلة في دورة حالياً، أو انتهت فترة دورتك.</p>
            <Link href="/dashboard/my-course">
              <Button variant="outline" size="sm" className="ui-sans">عرض التفاصيل</Button>
            </Link>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Wird */}
        <Card className="border-secondary/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full -z-10" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-secondary" />
              الورد اليومي
            </CardTitle>
            <CardDescription className="ui-sans">{format(new Date(), 'EEEE، d MMMM yyyy', { locale: ar })}</CardDescription>
          </CardHeader>
          <CardContent>
            {dailyWird ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-primary">{dailyWird.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-serif whitespace-pre-wrap">{dailyWird.content}</p>
                {dailyWird.rule && (
                  <div className="bg-secondary/10 p-3 rounded-lg border border-secondary/20 flex items-start gap-3 mt-4">
                    <Star className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-primary block text-sm">تطبيق حكم: {dailyWird.rule.nameAr}</span>
                      <span className="text-xs text-muted-foreground ui-sans">{dailyWird.rule.description}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                لم يتم تحديد ورد لهذا اليوم بعد.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>الوصول السريع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/lessons">
                <div className="bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors p-4 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer group h-full">
                  <div className="bg-primary/10 p-3 rounded-full group-hover:scale-110 transition-transform">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-bold text-primary text-sm ui-sans">متابعة الدروس</span>
                </div>
              </Link>
              
              <Link href={hasActiveEnrollment ? "/dashboard/assignments" : "/dashboard"}>
                <div className={`bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center gap-3 h-full ${hasActiveEnrollment ? 'hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer group' : 'opacity-60 cursor-not-allowed'}`}>
                  <div className={`${hasActiveEnrollment ? 'bg-primary/10' : 'bg-muted'} p-3 rounded-full ${hasActiveEnrollment ? 'group-hover:scale-110 transition-transform' : ''}`}>
                    <FileEdit className={`h-6 w-6 ${hasActiveEnrollment ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <span className={`font-bold text-sm ui-sans ${hasActiveEnrollment ? 'text-primary' : 'text-muted-foreground'}`}>حل الواجبات</span>
                </div>
              </Link>

              <Link href={hasActiveEnrollment ? "/dashboard/recordings" : "/dashboard"}>
                <div className={`bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center gap-3 h-full ${hasActiveEnrollment ? 'hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer group' : 'opacity-60 cursor-not-allowed'}`}>
                  <div className={`${hasActiveEnrollment ? 'bg-primary/10' : 'bg-muted'} p-3 rounded-full ${hasActiveEnrollment ? 'group-hover:scale-110 transition-transform' : ''}`}>
                    <Mic className={`h-6 w-6 ${hasActiveEnrollment ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <span className={`font-bold text-sm ui-sans ${hasActiveEnrollment ? 'text-primary' : 'text-muted-foreground'}`}>إرسال تلاوة</span>
                </div>
              </Link>

              <Link href="/dashboard/certificates">
                <div className="bg-card border border-border hover:border-secondary/50 hover:bg-secondary/5 transition-colors p-4 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer group h-full">
                  <div className="bg-secondary/10 p-3 rounded-full group-hover:scale-110 transition-transform">
                    <Award className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="font-bold text-secondary text-sm ui-sans">شهاداتي</span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
