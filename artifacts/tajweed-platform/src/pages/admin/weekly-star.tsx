import { useGetWeeklyStar, useSetWeeklyStar, useListStudents, getGetWeeklyStarQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Trophy, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function WeeklyStarAdmin() {
  const { data: weeklyStar, isLoading: starLoading } = useGetWeeklyStar();
  const { data: students, isLoading: studentsLoading } = useListStudents();
  
  const setStar = useSetWeeklyStar();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    studentId: "",
    reason: ""
  });

  useEffect(() => {
    if (weeklyStar) {
      setFormData({
        studentId: weeklyStar.studentId?.toString() || "",
        reason: weeklyStar.reason || ""
      });
    }
  }, [weeklyStar]);

  if (starLoading || studentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId) return;

    // Use current week's Monday as startDate
    const currDate = new Date();
    const day = currDate.getDay();
    const diff = currDate.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const weekStartDate = new Date(currDate.setDate(diff)).toISOString().split('T')[0];

    setStar.mutate({
      data: {
        studentId: parseInt(formData.studentId),
        weekStartDate,
        reason: formData.reason || undefined
      }
    }, {
      onSuccess: () => {
        toast({ title: "تم الاختيار", description: "تم تعيين نجمة الأسبوع بنجاح." });
        queryClient.invalidateQueries({ queryKey: getGetWeeklyStarQueryKey() });
      }
    });
  };

  const selectedStudent = students?.find(s => s.id.toString() === formData.studentId);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-primary mb-2">نجمة الأسبوع</h1>
        <p className="text-muted-foreground font-serif">اختيار وتكريم الطالبة المتميزة لتشجيع البقية وبث روح المنافسة.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>تحديد نجمة هذا الأسبوع</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="ui-sans">اختيار الطالبة</Label>
                <Select value={formData.studentId} onValueChange={val => setFormData({...formData, studentId: val})}>
                  <SelectTrigger className="ui-sans text-right bg-background h-12" dir="rtl">
                    <SelectValue placeholder="ابحثي عن الطالبة..." />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="ui-sans max-h-60">
                    {students?.sort((a,b) => b.masteryScore - a.masteryScore).map(s => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name} <span className="text-muted-foreground text-xs mr-2">({s.masteryScore} نقطة)</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason" className="ui-sans">سبب التميز أو عبارة تشجيعية</Label>
                <Textarea 
                  id="reason" 
                  rows={4} 
                  placeholder="مثال: لتميزها في التلاوة وحرصها على تسليم الواجبات في وقتها..."
                  value={formData.reason} 
                  onChange={e => setFormData({...formData, reason: e.target.value})} 
                  className="font-serif resize-none text-base" 
                />
              </div>
              
              <Button type="submit" className="w-full ui-sans h-12 text-lg gap-2" disabled={setStar.isPending || !formData.studentId}>
                <Star className="h-5 w-5" />
                {setStar.isPending ? "جاري الحفظ..." : "اعتماد النجمة"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div>
          <h3 className="text-xl font-bold text-primary mb-4 text-center">المعاينة لدى الطالبات</h3>
          <div className="bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-950/40 dark:to-background border border-amber-200 dark:border-amber-900 rounded-3xl p-8 text-center relative overflow-hidden shadow-lg mx-auto max-w-md">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Trophy className="h-32 w-32 text-amber-600" />
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-background rounded-full p-2 shadow-xl mb-4 relative">
                <div className="absolute -top-3 -right-3 text-amber-500 animate-pulse">
                  <Star className="h-8 w-8 fill-amber-500" />
                </div>
                <Avatar className="h-24 w-24 border-2 border-amber-100">
                  <AvatarImage src={selectedStudent?.avatarUrl || undefined} />
                  <AvatarFallback className="bg-amber-100 text-amber-700 text-2xl font-bold">{selectedStudent?.name?.charAt(0) || '؟'}</AvatarFallback>
                </Avatar>
              </div>
              
              <h4 className="text-sm font-bold text-amber-600 tracking-widest mb-2 ui-sans">نجمة الأسبوع</h4>
              <h3 className="text-2xl font-bold text-primary mb-4">{selectedStudent?.name || 'اسم الطالبة'}</h3>
              
              {formData.reason ? (
                <p className="text-foreground font-serif leading-relaxed italic border-t border-amber-200/50 pt-4 px-4 w-full">
                  "{formData.reason}"
                </p>
              ) : (
                <div className="text-muted-foreground/50 border-t border-amber-200/50 pt-4 px-4 w-full text-sm">
                  عبارة التشجيع تظهر هنا...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
