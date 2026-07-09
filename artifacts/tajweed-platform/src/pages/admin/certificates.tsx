import { useListCertificates, useCreateCertificate, useListStudents, useListCourses, getListCertificatesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Award, Plus, Calendar, Download } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function CertificatesAdmin() {
  const { data: certificates, isLoading: certsLoading } = useListCertificates();
  const { data: students, isLoading: studentsLoading } = useListStudents();
  const { data: courses, isLoading: coursesLoading } = useListCourses();
  
  const createCertificate = useCreateCertificate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    certificateUrl: ""
  });

  if (certsLoading || studentsLoading || coursesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.courseId) return;

    createCertificate.mutate({
      data: {
        studentId: parseInt(formData.studentId),
        courseId: parseInt(formData.courseId),
        certificateUrl: formData.certificateUrl || undefined
      }
    }, {
      onSuccess: () => {
        toast({ title: "تم الإصدار", description: "تم إصدار الشهادة بنجاح." });
        setIsOpen(false);
        queryClient.invalidateQueries({ queryKey: getListCertificatesQueryKey() });
        setFormData({ studentId: "", courseId: "", certificateUrl: "" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">إصدار الشهادات</h1>
          <p className="text-muted-foreground font-serif">منح الطالبات شهادات الاجتياز بعد إتمام متطلبات الدورة.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="ui-sans gap-2">
              <Plus className="h-4 w-4" /> إصدار شهادة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-xl text-primary font-bold mb-4">إصدار شهادة</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="ui-sans">اسم الطالبة</Label>
                <Select value={formData.studentId} onValueChange={val => setFormData({...formData, studentId: val})}>
                  <SelectTrigger className="ui-sans text-right bg-background" dir="rtl">
                    <SelectValue placeholder="اختاري الطالبة" />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="ui-sans max-h-60">
                    {students?.map(s => (
                      <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="ui-sans">الدورة المنجزة</Label>
                <Select value={formData.courseId} onValueChange={val => setFormData({...formData, courseId: val})}>
                  <SelectTrigger className="ui-sans text-right bg-background" dir="rtl">
                    <SelectValue placeholder="اختاري الدورة" />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="ui-sans max-h-60">
                    {courses?.map(c => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url" className="ui-sans">رابط ملف الشهادة (PDF/صورة)</Label>
                <Input 
                  id="url" 
                  type="url" 
                  value={formData.certificateUrl} 
                  onChange={e => setFormData({...formData, certificateUrl: e.target.value})} 
                  placeholder="https://..."
                  className="ui-sans text-left" dir="ltr" 
                />
                <p className="text-xs text-muted-foreground ui-sans">يفضل رفع الشهادة على منصة سحابية ووضع الرابط هنا.</p>
              </div>
              
              <Button type="submit" className="w-full ui-sans mt-4" disabled={createCertificate.isPending || !formData.studentId || !formData.courseId}>
                {createCertificate.isPending ? "جاري الإصدار..." : "إصدار الشهادة"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates && certificates.length > 0 ? (
          certificates.sort((a,b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()).map(cert => (
            <Card key={cert.id} className="border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-0">
                <div className="h-2 bg-gradient-to-r from-primary to-secondary w-full" />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4 border-b border-border/50 pb-4">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">{cert.student?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-foreground">{cert.student?.name}</h3>
                      <div className="text-xs text-muted-foreground ui-sans mt-0.5">
                        <Calendar className="inline h-3 w-3 ml-1" />
                        {format(new Date(cert.issuedAt), 'd MMMM yyyy', { locale: ar })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground ui-sans uppercase tracking-wider block mb-1">الدورة</span>
                      <span className="font-bold text-primary text-sm">{cert.course?.title}</span>
                    </div>
                    {cert.certificateUrl && (
                      <Button variant="outline" size="icon" className="shrink-0 rounded-full h-8 w-8 text-secondary hover:text-secondary hover:bg-secondary/10" onClick={() => window.open(cert.certificateUrl || '', '_blank')}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-card border border-border rounded-xl text-muted-foreground font-medium flex flex-col items-center">
            <Award className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
            لم يتم إصدار أي شهادات بعد.
          </div>
        )}
      </div>
    </div>
  );
}
