import { useGetStudent, useListStudentNotes, useCreateStudentNote, getListStudentNotesQueryKey } from "@workspace/api-client-react";
import { MessageSquare } from "lucide-react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, BookOpen, Mic, FileEdit, Award, Calendar, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function StudentDetail() {
  const params = useParams();
  const studentId = parseInt(params.id || "0");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: student, isLoading } = useGetStudent(studentId);
  const { data: notes, isLoading: notesLoading } = useListStudentNotes(studentId);
  const createNote = useCreateStudentNote();
  
  const [newNote, setNewNote] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!student) {
    return <div className="text-center py-20 text-muted-foreground">الطالبة غير موجودة.</div>;
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    createNote.mutate({
      studentId,
      data: { note: newNote }
    }, {
      onSuccess: () => {
        setNewNote("");
        queryClient.invalidateQueries({ queryKey: getListStudentNotesQueryKey(studentId) });
        toast({ title: "تم الإضافة", description: "تمت إضافة الملاحظة بنجاح." });
      }
    });
  };

  return (
    <div className="space-y-6">
      <Link href="/admin/students" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
        <ArrowRight className="h-4 w-4" />
        <span className="font-medium ui-sans">العودة لقائمة الطالبات</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-border text-center">
            <div className="bg-primary/10 h-24 w-full"></div>
            <CardContent className="px-6 pb-6 pt-0 flex flex-col items-center">
              <Avatar className="h-24 w-24 border-4 border-card -mt-12 mb-4 bg-muted text-4xl">
                <AvatarImage src={student.avatarUrl || undefined} />
                <AvatarFallback className="text-primary font-bold">{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-primary mb-1">{student.name}</h2>
              <p className="text-muted-foreground ui-sans text-sm mb-6">{student.email}</p>
              
              <div className="w-full grid grid-cols-2 gap-2 border-t border-border pt-4 mt-2">
                <div className="text-center p-2">
                  <div className="text-xs text-muted-foreground ui-sans mb-1">الاشتراكات</div>
                  <div className="font-bold text-lg ui-sans">{student.totalEnrollments}</div>
                </div>
                <div className="text-center p-2">
                  <div className="text-xs text-muted-foreground ui-sans mb-1">نقاط الإتقان</div>
                  <div className="font-bold text-lg text-secondary ui-sans flex items-center justify-center gap-1">
                    <Award className="h-4 w-4" /> {student.masteryScore}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">روابط سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/admin/recordings?studentId=${student.id}`}>
                <Button variant="outline" className="w-full justify-start ui-sans">
                  <Mic className="h-4 w-4 ml-2 text-primary" /> تلاوات الطالبة
                </Button>
              </Link>
              <Link href={`/admin/assignments?studentId=${student.id}`}>
                <Button variant="outline" className="w-full justify-start ui-sans">
                  <FileEdit className="h-4 w-4 ml-2 text-primary" /> واجبات الطالبة
                </Button>
              </Link>
              <Link href={`/admin/messages?studentId=${student.id}`}>
                <Button variant="outline" className="w-full justify-start ui-sans">
                  <MessageSquare className="h-4 w-4 ml-2 text-primary" /> إرسال رسالة
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الاشتراك الحالي</CardTitle>
            </CardHeader>
            <CardContent>
              {student.activeEnrollment ? (
                <div className="bg-primary/5 border border-primary/20 p-5 rounded-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-primary">{student.activeEnrollment.course?.title}</h3>
                      <p className="text-sm text-muted-foreground ui-sans">مستوى {student.activeEnrollment.course?.level}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold ui-sans">نشط</span>
                  </div>
                  <div className="flex gap-6 text-sm ui-sans">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      تاريخ البدء: {student.activeEnrollment.startDate ? format(new Date(student.activeEnrollment.startDate), 'yyyy/MM/dd') : '-'}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      تاريخ الانتهاء: {student.activeEnrollment.endDate ? format(new Date(student.activeEnrollment.endDate), 'yyyy/MM/dd') : '-'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-muted p-5 rounded-xl flex items-center gap-3 text-muted-foreground">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p className="font-medium">الطالبة غير مسجلة في دورة حالياً.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ملاحظات المعلمة (خاصة)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <form onSubmit={handleAddNote} className="space-y-3">
                  <Textarea 
                    placeholder="اكتبي ملاحظة خاصة لمتابعة تطور الطالبة (لا تراها الطالبة)..." 
                    className="font-serif resize-none"
                    rows={3}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" className="ui-sans" disabled={createNote.isPending || !newNote.trim()}>
                      إضافة ملاحظة
                    </Button>
                  </div>
                </form>

                <div className="space-y-3 pt-4 border-t border-border">
                  {notesLoading ? (
                    <div className="text-center py-4 text-muted-foreground">جاري التحميل...</div>
                  ) : notes && notes.length > 0 ? (
                    notes.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(note => (
                      <div key={note.id} className="bg-muted/30 p-4 rounded-xl text-sm font-serif border border-border">
                        <p className="mb-2 leading-relaxed">{note.note}</p>
                        <span className="text-xs text-muted-foreground ui-sans">
                          {format(new Date(note.createdAt), 'd MMMM yyyy - hh:mm a', { locale: ar })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground text-sm bg-card rounded-lg border border-dashed border-border">
                      لا توجد ملاحظات مسجلة لهذه الطالبة.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
