import { useListAnnouncements, useGetStudentDashboard } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function Announcements() {
  const { data: dashboard } = useGetStudentDashboard();
  const courseId = dashboard?.activeEnrollment?.courseId;
  
  // List announcements for the specific course, and also global ones (courseId = null)
  // For simplicity, we fetch all and let the user see them, or filter if API supports it.
  const { data: announcements, isLoading } = useListAnnouncements(courseId ? { courseId } : undefined);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-primary mb-2">إعلانات وتنبيهات</h1>
        <p className="text-muted-foreground font-serif">تحديثات هامة من الإدارة والمعلمات.</p>
      </header>

      {announcements && announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((announcement) => (
            <Card key={announcement.id} className="overflow-hidden border-border hover:border-primary/20 transition-colors">
              <CardContent className="p-0 flex">
                <div className="w-2 bg-secondary shrink-0" />
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="text-xl font-bold text-primary">{announcement.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground ui-sans bg-muted/50 px-2 py-1 rounded-md shrink-0">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(announcement.createdAt), 'd MMMM yyyy', { locale: ar })}
                    </div>
                  </div>
                  <p className="text-foreground font-serif leading-relaxed whitespace-pre-wrap">
                    {announcement.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card border border-border rounded-2xl flex flex-col items-center">
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
            <Bell className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">لا توجد إعلانات حالياً</h3>
          <p className="text-muted-foreground max-w-md mx-auto font-serif">
            لم تقم الإدارة بنشر أي إعلانات مؤخراً. سيصلك إشعار هنا عند توفر أخبار جديدة.
          </p>
        </div>
      )}
    </div>
  );
}
