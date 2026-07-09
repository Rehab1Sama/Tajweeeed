import { useListLessons, useGetStudentDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { PlayCircle, Lock, BookOpen } from "lucide-react";

export default function LessonsList() {
  const { data: lessons, isLoading } = useListLessons();
  const { data: dashboard } = useGetStudentDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const hasActiveCourse = !!dashboard?.activeEnrollment;
  const currentLevel = dashboard?.activeEnrollment?.course?.level || 1;

  // Group lessons by level
  const level1Lessons = lessons?.filter(l => l.level === 1).sort((a, b) => a.orderIndex - b.orderIndex) || [];
  const level2Lessons = lessons?.filter(l => l.level === 2).sort((a, b) => a.orderIndex - b.orderIndex) || [];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-primary mb-2">الدروس التعليمية</h1>
        <p className="text-muted-foreground font-serif">دروس مرئية ومكتوبة مقسمة حسب المستويات التعليمية.</p>
      </header>

      <div className="space-y-12">
        {/* Level 1 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-primary">المستوى الأول: التأسيس</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {level1Lessons.length > 0 ? level1Lessons.map((lesson) => (
              <Link key={lesson.id} href={`/dashboard/lessons/${lesson.id}`}>
                <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group h-full">
                  <CardContent className="p-5 flex items-start gap-4 h-full">
                    <div className="bg-muted p-3 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                      <PlayCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-secondary transition-colors">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{lesson.content.replace(/<[^>]*>?/gm, '')}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )) : (
              <div className="col-span-full text-center py-8 text-muted-foreground bg-card border border-border rounded-xl">
                لا توجد دروس في هذا المستوى حالياً.
              </div>
            )}
          </div>
        </section>

        {/* Level 2 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-secondary/10 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-primary">المستوى الثاني: الإتقان</h2>
            {currentLevel < 2 && (
              <div className="mr-auto bg-muted px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-medium text-muted-foreground ui-sans">
                <Lock className="h-3 w-3" />
                مغلق
              </div>
            )}
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${currentLevel < 2 ? 'opacity-50 pointer-events-none' : ''}`}>
            {level2Lessons.length > 0 ? level2Lessons.map((lesson) => (
              <Link key={lesson.id} href={`/dashboard/lessons/${lesson.id}`}>
                <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group h-full">
                  <CardContent className="p-5 flex items-start gap-4 h-full">
                    <div className="bg-muted p-3 rounded-full group-hover:bg-secondary/10 group-hover:text-secondary transition-colors shrink-0">
                      <PlayCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-secondary transition-colors">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{lesson.content.replace(/<[^>]*>?/gm, '')}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )) : (
              <div className="col-span-full text-center py-8 text-muted-foreground bg-card border border-border rounded-xl">
                لا توجد دروس في هذا المستوى حالياً.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
