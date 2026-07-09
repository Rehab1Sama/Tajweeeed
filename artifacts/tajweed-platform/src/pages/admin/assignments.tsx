import { useUpdateSubmission, customFetch } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileEdit, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

function useAllSubmissions() {
  return useQuery({
    queryKey: ['/api/submissions'],
    queryFn: () => customFetch<any[]>('/api/submissions'),
  });
}

export default function AssignmentsReview() {
  const { data: submissions, isLoading } = useAllSubmissions();
  const updateSubmission = useUpdateSubmission();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [filter, setFilter] = useState("pending");
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const filteredSubs = (submissions as any[] | undefined)?.filter((s: any) => s.status === filter).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    updateSubmission.mutate({
      id: selectedSub.id,
      data: {
        status: "reviewed",
        grade,
        feedback
      }
    }, {
      onSuccess: () => {
        toast({ title: "تم التقييم", description: "تم حفظ التقييم وإرساله للطالبة." });
        setSelectedSub(null);
        queryClient.invalidateQueries({ queryKey: ['/api/submissions'] });
      }
    });
  };

  const openReviewModal = (sub: any) => {
    setSelectedSub(sub);
    setGrade(sub.grade || "");
    setFeedback(sub.feedback || "");
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">تقييم الواجبات</h1>
          <p className="text-muted-foreground font-serif">مراجعة وتقييم إجابات الطالبات.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubs && filteredSubs.length > 0 ? (
          filteredSubs.map(sub => (
            <Card key={sub.id} className="flex flex-col h-full border-border">
              <CardHeader className="pb-3 border-b border-border/50 bg-muted/5">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">{sub.student?.name?.charAt(0) || 'ط'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-sm text-foreground">{sub.student?.name || 'طالبة مجهولة'}</div>
                    <div className="text-xs text-muted-foreground ui-sans">{format(new Date(sub.createdAt), 'd MMM yyyy - hh:mm a', { locale: ar })}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex-1 flex flex-col">
                <div className="bg-muted/30 p-3 rounded-lg border border-border mb-4 font-serif text-sm line-clamp-4 leading-relaxed">
                  {sub.content}
                </div>
                {sub.audioUrl && (
                  <div className="mb-4">
                    <audio src={sub.audioUrl} controls className="w-full h-8" />
                  </div>
                )}
                <div className="mt-auto">
                  <Button 
                    className="w-full ui-sans" 
                    variant={sub.status === 'reviewed' ? 'outline' : 'default'}
                    onClick={() => openReviewModal(sub)}
                  >
                    {sub.status === 'reviewed' ? 'تعديل التقييم' : 'تقييم الآن'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-card border border-border rounded-xl text-muted-foreground font-medium flex flex-col items-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4 opacity-50" />
            لا توجد واجبات {filter === 'pending' ? 'بانتظار التقييم' : 'تم تقييمها'}.
          </div>
        )}
      </div>

      <Dialog open={!!selectedSub} onOpenChange={(open) => !open && setSelectedSub(null)}>
        <DialogContent className="sm:max-w-[600px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary font-bold mb-4">تقييم الواجب</DialogTitle>
          </DialogHeader>
          {selectedSub && (
            <div className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-xl border border-border font-serif leading-relaxed whitespace-pre-wrap max-h-[200px] overflow-y-auto text-sm">
                {selectedSub.content}
              </div>
              {selectedSub.audioUrl && (
                <audio src={selectedSub.audioUrl} controls className="w-full" />
              )}
              
              <form onSubmit={handleReview} className="space-y-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <Label className="text-base">الدرجة الممنوحة</Label>
                  <Input 
                    required 
                    placeholder="مثال: 10/10 أو ممتاز" 
                    className="ui-sans text-left" dir="ltr"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">الملاحظات (اختياري)</Label>
                  <Textarea 
                    placeholder="اكتبي توجيهاتك للطالبة هنا..." 
                    className="font-serif resize-none"
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full ui-sans mt-4" disabled={updateSubmission.isPending}>
                  {updateSubmission.isPending ? "جاري الحفظ..." : "حفظ التقييم"}
                </Button>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
