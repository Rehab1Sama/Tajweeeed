import { useGetLesson, useListAudioLibrary, useGetStudentProgress, useUpdateProgress, getGetStudentProgressQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { lessonsContent } from "@/data/lessonsContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, Headphones, Star, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function LessonDetail() {
  const params = useParams();
  const lessonId = parseInt(params.id || "0");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: lesson, isLoading: isLessonLoading } = useGetLesson(lessonId);
  const { data: audioLibrary, isLoading: isAudioLoading } = useListAudioLibrary(lesson?.ruleId ? { ruleId: lesson.ruleId } : undefined);
  const { data: progress } = useGetStudentProgress();
  const updateProgress = useUpdateProgress();

  const [selfRating, setSelfRating] = useState<number>(0);
  
  const ruleProgress = progress?.find(p => p.ruleId === lesson?.ruleId);

  useEffect(() => {
    if (ruleProgress?.selfAssessment) {
      setSelfRating(ruleProgress.selfAssessment);
    }
  }, [ruleProgress]);

  if (isLessonLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!lesson) {
    return <div className="text-center py-20 text-muted-foreground">الدرس غير موجود.</div>;
  }

  const handleRating = (rating: number) => {
    if (!lesson.ruleId) return;
    
    setSelfRating(rating);
    updateProgress.mutate({
      ruleId: lesson?.ruleId || 0,
      data: { selfAssessment: rating }
    }, {
      onSuccess: () => {
        toast({ title: "تم حفظ تقييمك", description: "شكراً لتقييم مدى فهمك للدرس." });
        queryClient.invalidateQueries({ queryKey: getGetStudentProgressQueryKey() });
      },
      onError: () => {
        toast({ title: "حدث خطأ", description: "لم يتم حفظ التقييم. قد تحتاج لبدء التدريب على هذا الحكم أولاً.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <Link href="/dashboard/lessons" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
        <ArrowRight className="h-4 w-4" />
        <span className="font-medium ui-sans">العودة للدروس</span>
      </Link>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {lesson.videoUrl && (
          <div className="aspect-video w-full bg-black relative flex items-center justify-center group">
            {/* Fallback for video if it's just a URL string and not an iframe embed */}
            <div className="absolute inset-0 bg-primary/10 flex flex-col items-center justify-center text-primary-foreground/50">
               <PlayCircle className="h-20 w-20 opacity-50 mb-4 group-hover:opacity-100 transition-opacity cursor-pointer text-white" />
               <p className="ui-sans text-sm text-white/70">انقري لتشغيل الفيديو</p>
            </div>
            {/* In a real app we'd put an iframe here */}
            {lesson.videoUrl.includes('youtube') || lesson.videoUrl.includes('vimeo') ? (
               <iframe 
                 src={lesson.videoUrl} 
                 className="w-full h-full relative z-10" 
                 allowFullScreen 
                 title={lesson.title}
               />
            ) : null}
          </div>
        )}
        
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold ui-sans">
              المستوى {lesson.level}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-primary mb-6">{lesson.title}</h1>
          
          <div className="prose prose-slate prose-lg max-w-none font-serif text-foreground leading-loose" dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {lesson.ruleId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-secondary" />
                  مكتبة التلاوات (للمقارنة)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAudioLoading ? (
                  <div className="text-center py-4"><div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto" /></div>
                ) : audioLibrary && audioLibrary.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">استمعي لتلاوة القراء المتقنين وحاولي محاكاة طريقة نطقهم للحكم.</p>
                    {audioLibrary.map((audio) => (
                      <div key={audio.id} className="bg-muted/30 p-4 rounded-xl border border-border flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex-1 text-center sm:text-right">
                          <h4 className="font-bold text-primary">{audio.reciterName}</h4>
                          {audio.description && <p className="text-sm text-muted-foreground">{audio.description}</p>}
                        </div>
                        <audio controls src={audio.audioUrl} className="w-full sm:w-64 outline-none" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground flex flex-col items-center gap-2 bg-muted/20 rounded-xl border border-border">
                    <AlertCircle className="h-6 w-6 opacity-50" />
                    <p>لا توجد تسجيلات مرجعية مرتبطة بهذا الدرس حالياً.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          {lesson.ruleId && (
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">التقييم الذاتي</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6 font-serif">
                  إلى أي مدى تشعرين أنك استوعبتِ هذا الدرس ويمكنك تطبيق الحكم بشكل صحيح؟
                </p>
                <div className="flex justify-center gap-2 mb-6" dir="ltr">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      disabled={!ruleProgress?.id || updateProgress.isPending}
                      onClick={() => handleRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <Star 
                        className={`h-8 w-8 ${star <= selfRating ? 'fill-secondary text-secondary' : 'text-muted-foreground/30'}`} 
                      />
                    </button>
                  ))}
                </div>
                {!ruleProgress?.id && (
                  <p className="text-xs text-center text-muted-foreground bg-muted p-2 rounded-lg">
                    يجب أن يبدأ المعلم بمتابعة هذا الحكم لكِ أولاً لتتمكني من تقييم نفسك.
                  </p>
                )}
                <div className="mt-8 pt-6 border-t border-border text-center space-y-4">
                  <p className="text-sm font-medium">جاهزة للتطبيق العملي؟</p>
                  <Link href="/dashboard/recordings">
                    <Button className="w-full ui-sans">إرسال تلاوة للتقييم</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
