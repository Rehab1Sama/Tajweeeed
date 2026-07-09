import { useListAudioRecordings, useUpdateAudioRecording, getListAudioRecordingsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mic, CheckCircle2, Clock, PlaySquare } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function RecordingsReview() {
  const { data: recordings, isLoading } = useListAudioRecordings();
  const updateRecording = useUpdateAudioRecording();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [filter, setFilter] = useState("pending");
  const [selectedRec, setSelectedRec] = useState<any>(null);
  const [feedback, setFeedback] = useState("");
  const [audioFeedbackUrl, setAudioFeedbackUrl] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const filteredRecs = recordings?.filter(r => r.status === filter).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRec) return;
    if (!feedback.trim() && !audioFeedbackUrl.trim()) {
      toast({ title: "خطأ", description: "يجب إدخال ملاحظات نصية أو صوتية.", variant: "destructive" });
      return;
    }

    updateRecording.mutate({
      id: selectedRec.id,
      data: {
        status: "reviewed",
        teacherFeedback: feedback || undefined,
        teacherAudioFeedbackUrl: audioFeedbackUrl || undefined
      }
    }, {
      onSuccess: () => {
        toast({ title: "تم التقييم", description: "تم حفظ تقييم التلاوة." });
        setSelectedRec(null);
        queryClient.invalidateQueries({ queryKey: getListAudioRecordingsQueryKey() });
      }
    });
  };

  const openReviewModal = (rec: any) => {
    setSelectedRec(rec);
    setFeedback(rec.teacherFeedback || "");
    setAudioFeedbackUrl(rec.teacherAudioFeedbackUrl || "");
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">تقييم التلاوات</h1>
          <p className="text-muted-foreground font-serif">الاستماع لتلاوات الطالبات وتقديم التوجيهات لتصحيح الأداء.</p>
        </div>
      </header>

      <div className="flex gap-2 ui-sans">
        <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>
          قيد الانتظار
        </Button>
        <Button variant={filter === 'reviewed' ? 'default' : 'outline'} onClick={() => setFilter('reviewed')}>
          تم التقييم
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecs && filteredRecs.length > 0 ? (
          filteredRecs.map(rec => (
            <Card key={rec.id} className="flex flex-col h-full border-border">
              <CardHeader className="pb-3 border-b border-border/50 bg-muted/5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">{rec.student?.name?.charAt(0) || 'ط'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-sm text-foreground">{rec.student?.name || 'طالبة مجهولة'}</div>
                      <div className="text-xs text-muted-foreground ui-sans">{format(new Date(rec.createdAt), 'd MMM yyyy - hh:mm a', { locale: ar })}</div>
                    </div>
                  </div>
                  {rec.ruleId && (
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded ui-sans shrink-0">
                      حكم رقم {rec.ruleId}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex-1 flex flex-col">
                <div className="bg-muted/30 p-4 rounded-xl border border-border mb-4">
                  <audio src={rec.audioUrl} controls className="w-full h-10 outline-none" />
                </div>
                {rec.notes && (
                  <p className="text-sm font-serif text-muted-foreground italic mb-4 p-3 bg-muted/10 rounded-lg border-r-2 border-primary">
                    "{rec.notes}"
                  </p>
                )}
                <div className="mt-auto pt-4">
                  <Button 
                    className="w-full ui-sans" 
                    variant={rec.status === 'reviewed' ? 'outline' : 'default'}
                    onClick={() => openReviewModal(rec)}
                  >
                    {rec.status === 'reviewed' ? 'تعديل التقييم' : 'استماع وتقييم'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-card border border-border rounded-xl text-muted-foreground font-medium flex flex-col items-center">
            <Mic className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
            لا توجد تلاوات {filter === 'pending' ? 'بانتظار التقييم' : 'تم تقييمها'}.
          </div>
        )}
      </div>

      <Dialog open={!!selectedRec} onOpenChange={(open) => !open && setSelectedRec(null)}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary font-bold mb-4">تقييم التلاوة</DialogTitle>
          </DialogHeader>
          {selectedRec && (
            <div className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-xl border border-border">
                <audio src={selectedRec.audioUrl} controls className="w-full outline-none" />
              </div>
              
              <form onSubmit={handleReview} className="space-y-4 pt-2 border-t border-border">
                <div className="space-y-2">
                  <Label className="text-base font-bold text-primary">توجيهات مكتوبة</Label>
                  <Textarea 
                    placeholder="اكتبي ملاحظاتك وتوجيهاتك للطالبة حول تلاوتها..." 
                    className="font-serif resize-none"
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-bold text-primary">ملاحظة صوتية (اختياري)</Label>
                  <Input 
                    type="url"
                    placeholder="رابط تسجيل صوتي بصوت المعلمة للتوضيح" 
                    className="ui-sans text-left" dir="ltr"
                    value={audioFeedbackUrl}
                    onChange={(e) => setAudioFeedbackUrl(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full ui-sans mt-4" disabled={updateRecording.isPending}>
                  {updateRecording.isPending ? "جاري الحفظ..." : "حفظ وإرسال التقييم"}
                </Button>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
