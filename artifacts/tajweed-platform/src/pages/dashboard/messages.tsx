import { useListMessages, useCreateMessage, useGetStudentDashboard, getListMessagesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function Messages() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: dashboard } = useGetStudentDashboard();
  const isReadOnly = dashboard?.activeEnrollment?.status !== 'active';
  
  // Student side: they only converse with teachers, recipientId could be omitted or we need teacher ID.
  // The API uses recipientId. For a student, it should default to their teacher or the system admin.
  // Since we don't have the teacher's ID exposed cleanly, let's assume recipientId=1 (admin/teacher) for this MVP.
  // In a real app, this would be fetched from active course or dashboard.
  const TEACHER_ID = 1; 
  
  const { data: messages, isLoading } = useListMessages();
  const createMessage = useCreateMessage();

  const [content, setContent] = useState("");

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createMessage.mutate({
      data: {
        content: content.trim(),
        recipientId: TEACHER_ID
      }
    }, {
      onSuccess: () => {
        setContent("");
        queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() });
      },
      onError: () => {
        toast({ title: "حدث خطأ", description: "لم نتمكن من إرسال الرسالة.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6 h-[calc(100vh-12rem)] flex flex-col">
      <header>
        <h1 className="text-3xl font-bold text-primary mb-2">المراسلة المباشرة</h1>
        <p className="text-muted-foreground font-serif">تواصل مباشر مع معلمتك للاستفسار عن أحكام التجويد والدروس.</p>
      </header>

      <Card className="flex-1 flex flex-col overflow-hidden border-border shadow-sm">
        <div 
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-muted/10" 
          ref={scrollRef}
        >
          {messages && messages.length > 0 ? (
            messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((msg) => {
              const isMine = msg.sender?.role === 'student'; // Current user is student
              return (
                <div key={msg.id} className={`flex flex-col ${isMine ? 'items-start' : 'items-end'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    isMine 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-card border border-border text-foreground rounded-tl-sm'
                  }`}>
                    {!isMine && <p className="text-xs font-bold text-secondary mb-1 ui-sans">المعلمة</p>}
                    <p className="font-serif leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground ui-sans mt-1 px-1">
                    {format(new Date(msg.createdAt), 'hh:mm a', { locale: ar })}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
              <MessageSquare className="h-16 w-16 mb-4" />
              <p className="font-medium text-lg">لا توجد رسائل سابقة</p>
              <p>ابدأي المحادثة بترك استفسارك للمعلمة.</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-card border-t border-border">
          {isReadOnly ? (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg flex items-center justify-center gap-2 ui-sans text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              لا يمكنك إرسال رسائل لأن اشتراكك الحالي غير فعال.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="اكتبي رسالتك هنا..."
                className="resize-none min-h-[60px] font-serif bg-background"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="h-[60px] w-[60px] shrink-0 bg-primary hover:bg-primary/90 rounded-xl"
                disabled={!content.trim() || createMessage.isPending}
              >
                <Send className="h-6 w-6 rotate-180" />
              </Button>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}
