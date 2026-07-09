import { useListCourses, useCreateCourse, getListCoursesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Clock, Edit2, Plus, Calendar } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function CoursesList() {
  const { data: courses, isLoading } = useListCourses();
  const createCourse = useCreateCourse();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "1",
    durationDays: "30",
    price: "0",
    capacity: "20"
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
    createCourse.mutate({
      data: {
        title: formData.title,
        description: formData.description,
        level: parseInt(formData.level),
        durationDays: parseInt(formData.durationDays),
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity)
      }
    }, {
      onSuccess: () => {
        toast({ title: "تم الإضافة", description: "تمت إضافة الدورة بنجاح." });
        setIsOpen(false);
        queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() });
        setFormData({ title: "", description: "", level: "1", durationDays: "30", price: "0", capacity: "20" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">إدارة الدورات</h1>
          <p className="text-muted-foreground font-serif">إنشاء وإدارة الدورات التعليمية المتاحة للتسجيل.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="ui-sans gap-2">
              <Plus className="h-4 w-4" /> دورة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-xl text-primary font-bold mb-4">إنشاء دورة جديدة</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 ui-sans">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان الدورة</Label>
                <Input required id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">الوصف</Label>
                <Textarea required id="desc" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">المستوى (1 أو 2)</Label>
                  <Input required type="number" id="level" min="1" max="2" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">المدة (بالأيام)</Label>
                  <Input required type="number" id="duration" min="1" value={formData.durationDays} onChange={e => setFormData({...formData, durationDays: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">الطاقة الاستيعابية</Label>
                  <Input required type="number" id="capacity" min="1" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">السعر (0 للمجاني)</Label>
                  <Input required type="number" id="price" min="0" step="0.5" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
              </div>
              <Button type="submit" className="w-full mt-6" disabled={createCourse.isPending}>
                {createCourse.isPending ? "جاري الحفظ..." : "حفظ الدورة"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses && courses.length > 0 ? (
          courses.map(course => (
            <Card key={course.id} className="flex flex-col h-full border-border hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3 border-b border-border/50 bg-muted/10">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ui-sans ${course.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                    {course.isActive ? 'نشط للتسجيل' : 'مغلق'}
                  </span>
                  <span className="text-xs font-bold ui-sans bg-primary/10 text-primary px-2 py-0.5 rounded">
                    مستوى {course.level}
                  </span>
                </div>
                <CardTitle className="text-xl text-primary font-bold leading-tight">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex-1">
                <p className="text-muted-foreground text-sm font-serif line-clamp-3 mb-6">
                  {course.description}
                </p>
                <div className="grid grid-cols-2 gap-3 mt-auto ui-sans text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" /> {course.durationDays} يوم
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" /> {course.enrolledCount} / {course.capacity}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t border-border p-4 bg-muted/5 flex justify-between items-center">
                <div className="font-bold text-primary ui-sans">
                  {course.price > 0 ? `${course.price} د.ك` : 'مجاني'}
                </div>
                <Button variant="ghost" size="sm" className="ui-sans text-secondary hover:text-secondary hover:bg-secondary/10">
                  <Edit2 className="h-4 w-4 ml-1.5" /> تعديل
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-card border border-border rounded-xl text-muted-foreground font-medium">
            لا توجد دورات مضافة. انقري على "دورة جديدة" للبدء.
          </div>
        )}
      </div>
    </div>
  );
}
