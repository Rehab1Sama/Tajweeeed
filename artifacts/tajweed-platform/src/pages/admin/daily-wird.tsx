import { useGetDailyWird, useCreateDailyWird, useListTajweedRules, getGetDailyWirdQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Save, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function DailyWirdAdmin() {
  const { data: dailyWird, isLoading } = useGetDailyWird();
  const { data: rules } = useListTajweedRules();
  const createWird = useCreateDailyWird();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    ruleId: "none",
    date: todayStr
  });

  useEffect(() => {
    if (dailyWird && dailyWird.date === todayStr) {
      setFormData({
        title: dailyWird.title,
        content: dailyWird.content,
        ruleId: dailyWird.ruleId?.toString() || "none",
        date: dailyWird.date
      });
    }
  }, [dailyWird, todayStr]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWird.mutate({
      data: {
        date: formData.date,
        title: formData.title,
        content: formData.content,
        ruleId: formData.ruleId === "none" ? undefined : parseInt(formData.ruleId)
      }
    }, {
      onSuccess: () => {
        toast({ title: "تم الحفظ", description: "تم تحديد الورد اليومي بنجاح." });
        queryClient.invalidateQueries({ queryKey: getGetDailyWirdQueryKey() });
      }
    });
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-primary mb-2">إدارة الورد اليومي</h1>
        <p className="text-muted-foreground font-serif">تحديد ورد التلاوة والتطبيق العملي للطالبات كل يوم.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>تعيين ورد اليوم</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="ui-sans">تاريخ الورد</Label>
                <div className="flex items-center gap-3 px-3 py-2 bg-muted/30 rounded-lg border border-border text-muted-foreground ui-sans font-medium">
                  <CalendarDays className="h-5 w-5" />
                  {format(new Date(formData.date), 'EEEE، d MMMM yyyy', { locale: ar })}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title" className="ui-sans">عنوان الورد (مثال: سورة البقرة - الوجه 15)</Label>
                <Input required id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="font-serif" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rule" className="ui-sans">ربط بحكم تجويدي للتطبيق (اختياري)</Label>
                <Select value={formData.ruleId} onValueChange={val => setFormData({...formData, ruleId: val})}>
                  <SelectTrigger className="ui-sans text-right bg-background" dir="rtl">
                    <SelectValue placeholder="بدون ربط بحكم" />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="ui-sans max-h-60">
                    <SelectItem value="none">بدون ربط (تلاوة حرة)</SelectItem>
                    {rules?.sort((a,b) => a.orderIndex - b.orderIndex).map(rule => (
                      <SelectItem key={rule.id} value={rule.id.toString()}>{rule.nameAr} (مستوى {rule.level})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content" className="ui-sans">توجيهات للقراءة</Label>
                <Textarea 
                  required 
                  id="content" 
                  rows={6} 
                  placeholder="ملاحظات حول طريقة الأداء والآيات المطلوب التركيز عليها..."
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})} 
                  className="font-serif resize-none" 
                />
              </div>
              
              <Button type="submit" className="w-full ui-sans gap-2" disabled={createWird.isPending}>
                <Save className="h-4 w-4" />
                {createWird.isPending ? "جاري الحفظ..." : "حفظ الورد"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div>
          <h3 className="text-xl font-bold text-primary mb-4">معاينة الطالبة</h3>
          <Card className="border-secondary/20 shadow-sm relative overflow-hidden bg-background">
            <div className="absolute top-0 left-0 w-32 h-32 bg-secondary/10 rounded-br-full -z-10" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-secondary" />
                الورد اليومي
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.title ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-primary">{formData.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-serif whitespace-pre-wrap">{formData.content || '...'}</p>
                  {formData.ruleId !== "none" && (
                    <div className="bg-secondary/10 p-3 rounded-lg border border-secondary/20 flex items-start gap-3 mt-4">
                      <Star className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-primary block text-sm">
                          تطبيق حكم: {rules?.find(r => r.id.toString() === formData.ruleId)?.nameAr}
                        </span>
                        <span className="text-xs text-muted-foreground ui-sans">
                          {rules?.find(r => r.id.toString() === formData.ruleId)?.description}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground opacity-50">
                  اكتبي تفاصيل الورد لتظهر المعاينة هنا.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
