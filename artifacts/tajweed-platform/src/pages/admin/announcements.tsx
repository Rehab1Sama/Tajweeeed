import { useListAnnouncements, useCreateAnnouncement, useListCourses, getListAnnouncementsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bell, Calendar, Plus, Megaphone } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function AnnouncementsAdmin() {
  const { data: announcements, isLoading } = useListAnnouncements();
  const { data: courses } = useListCourses();
  const createAnnouncement = useCreateAnnouncement();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    courseId: "all"
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAnnouncement.mutate({
      data: {
        title: formData.title,
        content: formData.content,
        courseId: formData.courseId === "all" ? undefined : parseInt(formData.courseId)
      }
    }, {
      onSuccess: () => {
        toast({ title: "تم النشر", description: "تم نشر الإعلان بنجاح." });
        setIsOpen(false);
        queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
        setFormData({ title: "", content: "", courseId: "all" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">إدارة الإعلانات</h1>
          <p className="text-muted-foreground font-serif">نشر تنبيهات وأخبار لجميع الطالبات أو لدورة محددة.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="ui-sans gap-2">
              <Plus className="h-4 w-4" /> إعلان جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-xl text-primary font-bold mb-4">نشر إعلان جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="ui-sans">عنوان الإعلان</Label>
                <Input required id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="font-serif" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target" className="ui-sans">الجمهور المستهدف</Label>
                <Select value={formData.courseId} onValueChange={val => setFormData({...formData, courseId: val})}>
                  <SelectTrigger className="ui-sans bg-background text-right" dir="rtl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="ui-sans">
                    <SelectItem value="all">جميع الطالبات (عام)</SelectItem>
                    {courses?.map(c => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="ui-sans">نص الإعلان</Label>
                <Textarea required id="content" rows={5} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="font-serif resize-none" />
              </div>
              <Button type="submit" className="w-full ui-sans mt-4" disabled={createAnnouncement.isPending}>
                {createAnnouncement.isPending ? "جاري النشر..." : "نشر الإعلان الآن"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements && announcements.length > 0 ? (
          announcements.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(announcement => (
            <Card key={announcement.id} className="border-border">
              <CardHeader className="pb-3 border-b border-border/50 bg-muted/5">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-lg font-bold text-primary">{announcement.title}</CardTitle>
                  <span className={`shrink-0 text-[10px] font-bold ui-sans px-2 py-1 rounded-md ${announcement.courseId ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                    {announcement.courseId ? 'دورة محددة' : 'عام للجميع'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground ui-sans mt-2">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(announcement.createdAt), 'd MMMM yyyy - hh:mm a', { locale: ar })}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="font-serif text-sm leading-relaxed text-foreground whitespace-pre-wrap line-clamp-4">
                  {announcement.content}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-card border border-border rounded-xl text-muted-foreground font-medium flex flex-col items-center">
            <Megaphone className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
            لا توجد إعلانات منشورة سابقة.
          </div>
        )}
      </div>
    </div>
  );
}
