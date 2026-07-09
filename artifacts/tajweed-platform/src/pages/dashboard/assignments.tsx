import { useListAssignments, useGetStudentDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileEdit, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function AssignmentsList() {
  const { data: dashboard } = useGetStudentDashboard();
  const courseId = dashboard?.activeEnrollment?.courseId;
  const isReadOnly = dashboard?.activeEnrollment?.status !== 'active';
  
  const { data: assignments, isLoading: assignLoading } = useListAssignments(courseId ? { courseId } : undefined);

  if (assignLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!courseId) {
    return (
      <div className="text-center py-20 text-muted-foreground bg-card border border-border rounded-xl">
        يجب أن تكوني مسجلة في دورة لعرض الواجبات.
      </div>
    );
  }

  const getAssignmentStatus = (assignment: { submissionsCount: number }) => {
    if (assignment.submissionsCount === 0) return { type: 'pending', label: 'بانتظار التسليم', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' };
    return { type: 'submitted', label: 'تم التسليم', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' };
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">الواجبات والمهام</h1>
          <p className="text-muted-foreground font-serif">تدريبات عملية لترسيخ المفاهيم التي تم دراستها.</p>
        </div>
        {isReadOnly && (
          <div className="bg-destructive/10 text-destructive px-3 py-1.5 rounded-lg text-sm font-bold ui-sans border border-destructive/20">
            وضع القراءة فقط
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments && assignments.length > 0 ? assignments.map((assignment) => {
          const status = getAssignmentStatus(assignment);
          const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date() && status.type === 'pending';
          
          return (
            <Card key={assignment.id} className="flex flex-col h-full hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-lg font-bold text-primary leading-tight">{assignment.title}</CardTitle>
                  <div className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ui-sans flex items-center gap-1.5 ${status.bg} ${status.color}`}>
                    {status.type === 'pending' ? <Clock className="h-3.5 w-3.5" /> : 
                     status.type === 'submitted' ? <FileEdit className="h-3.5 w-3.5" /> : 
                     <CheckCircle2 className="h-3.5 w-3.5" />}
                    <span>{status.label}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground font-serif line-clamp-3 text-sm mb-4">
                  {assignment.description}
                </p>
                {assignment.dueDate && (
                  <div className={`flex items-center gap-1.5 text-xs font-medium ui-sans ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {isOverdue ? <AlertCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    <span>موعد التسليم: {format(new Date(assignment.dueDate), 'd MMMM yyyy', { locale: ar })}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Link href={`/dashboard/assignments/${assignment.id}`} className="w-full">
                  <Button variant="outline" className="w-full ui-sans">
                    {status.type === 'reviewed' ? 'عرض التقييم' : 
                     status.type === 'submitted' ? 'عرض التسليم' : 'بدء الحل'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        }) : (
          <div className="col-span-full text-center py-16 text-muted-foreground bg-card border border-border rounded-xl">
            <FileEdit className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium text-lg">لا توجد واجبات مضافة حالياً.</p>
          </div>
        )}
      </div>
    </div>
  );
}
