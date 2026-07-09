import { useListAudioRecordings, useCreateAudioRecording, useGetStudentDashboard, useListTajweedRules, getListAudioRecordingsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, CheckCircle2, Clock, AlertCircle, PlaySquare } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function Recordings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: dashboard } = useGetStudentDashboard();
  const isReadOnly = dashboard?.activeEnrollment?.status !== 'active';
  
  const { data: recordings, isLoading: recLoading } = useListAudioRecordings();
  const { data: rules } = useListTajweedRules();
  const createRecording = useCreateAudioRecording();

  const [audioUrl, setAudioUrl] = useState("");
  const [ruleId, setRuleId] = useState<string>("");
  const [notes, setNotes] = useState("");

  if (recLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioUrl.trim()) {
      toast({ title: "خطأ", description: "يرجى إرفاق رابط التسجيل.", variant: "destructive" });
      return;
    }

    createRecording.mutate({
      data: {
        audioUrl,
        ruleId: ruleId ? parseInt(ruleId) : undefined,
        notes: notes || undefined
      }
    }, {
      onSuccess: () => {
        toast({ title: "تم الإرسال", description: "تم إرسال تلاوتك للمعلمة بنجاح." });
        setAudioUrl("");
        setRuleId("");
        setNotes("");
        queryClient.invalidateQueries({ queryKey: getListAudioRecordingsQueryKey() });
      },
      onError: () => {
        toast({ title: "حدث خطأ", description: "لم نتمكن من إرسال التلاوة.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">التسجيلات الصوتية</h1>
          <p className="text-muted-foreground font-serif">أرسلي تلاوتك للمعلمة واحصلي على تقييم وتوجيه دقيق.</p>
        </div>
        {isReadOnly && (
          <div className="bg-destructive/10 text-destructive px-3 py-1.5 rounded-lg text-sm font-bold ui-sans border border-destructive/20">
            وضع القراءة فقط
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-primary/20 bg-gradient-to-b from-card to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                إرسال تلاوة جديدة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isReadOnly ? (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex flex-col gap-3 text-center">
                  <AlertCircle className="h-8 w-8 mx-auto opacity-70" />
                  <p className="font-serif font-medium text-sm">عذراً، اشتراكك الحالي غير فعال ولا يمكنك إرسال تلاوات للتقييم.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="audioUrl">رابط التسجيل <span className="text-destructive">*</span></Label>
                    <Input 
                      id="audioUrl" 
                      type="url" 
                      required
                      placeholder="https://..." 
                      className="text-left" dir="ltr"
                      value={audioUrl}
                      onChange={(e) => setAudioUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">ارفعي تسجيلك على Google Drive أو أي منصة سحابية وضعي الرابط هنا.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ruleId">الحكم المجود (اختياري)</Label>
                    <Select value={ruleId} onValueChange={setRuleId}>
                      <SelectTrigger className="ui-sans text-right" dir="rtl">
                        <SelectValue placeholder="اختاري الحكم" />
                      </SelectTrigger>
                      <SelectContent dir="rtl" className="ui-sans max-h-60">
                        <SelectItem value="none">بدون تحديد (تلاوة عامة)</SelectItem>
                        {rules?.sort((a,b) => a.orderIndex - b.orderIndex).map(rule => (
                          <SelectItem key={rule.id} value={rule.id.toString()}>{rule.nameAr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات للمعلمة (اختياري)</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="مثال: أواجه صعوبة في نطق الإخفاء في هذه الآيات..." 
                      className="resize-none font-serif"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full ui-sans" disabled={createRecording.isPending}>
                    {createRecording.isPending ? "جاري الإرسال..." : "إرسال التلاوة"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-primary mb-4">سجل تلاواتي</h2>
          
          {recordings && recordings.length > 0 ? (
            recordings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(recording => {
              const rule = rules?.find(r => r.id === recording.ruleId);
              
              return (
                <Card key={recording.id} className="overflow-hidden border-border hover:border-primary/30 transition-colors">
                  <div className="flex flex-col sm:flex-row">
                    <div className="p-5 flex-1 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-primary ui-sans">
                              {format(new Date(recording.createdAt), 'd MMMM yyyy', { locale: ar })}
                            </span>
                            {rule && (
                              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold ui-sans">
                                {rule.nameAr}
                              </span>
                            )}
                          </div>
                          {recording.notes && (
                            <p className="text-muted-foreground font-serif text-sm italic">"{recording.notes}"</p>
                          )}
                        </div>
                        <div className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ui-sans flex items-center gap-1.5 ${
                          recording.status === 'reviewed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
                        }`}>
                          {recording.status === 'reviewed' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                          <span>{recording.status === 'reviewed' ? 'تم التقييم' : 'قيد المراجعة'}</span>
                        </div>
                      </div>

                      <div className="bg-muted/30 p-3 rounded-lg border border-border">
                        <audio controls src={recording.audioUrl} className="w-full outline-none h-10" />
                      </div>
                    </div>

                    {recording.status === 'reviewed' && (recording.teacherFeedback || recording.teacherAudioFeedbackUrl) && (
                      <div className="bg-secondary/5 border-t sm:border-t-0 sm:border-r border-secondary/20 p-5 sm:w-1/3 flex flex-col justify-center">
                        <h4 className="font-bold text-secondary text-sm mb-3 flex items-center gap-2">
                          <PlaySquare className="h-4 w-4" />
                          تقييم المعلمة
                        </h4>
                        
                        {recording.teacherFeedback && (
                          <p className="font-serif text-sm leading-relaxed text-foreground mb-4">
                            {recording.teacherFeedback}
                          </p>
                        )}
                        
                        {recording.teacherAudioFeedbackUrl && (
                          <div className="mt-auto">
                            <span className="text-xs text-muted-foreground ui-sans mb-1 block">ملاحظة صوتية:</span>
                            <audio controls src={recording.teacherAudioFeedbackUrl} className="w-full outline-none h-8" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-16 text-muted-foreground bg-card border border-border rounded-xl">
              <Mic className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium text-lg">لم تقومي بإرسال أي تلاوات بعد.</p>
              <p className="text-sm mt-2">أرسلي تلاوتك الأولى لتبدأي في تلقي التوجيهات.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
