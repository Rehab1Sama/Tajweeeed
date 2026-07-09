import { useListMessages, useCreateMessage, useListConversations, getListMessagesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Input } from "@/components/ui/input";

export default function MessagesAdmin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: conversations, isLoading: convLoading } = useListConversations();
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: messages, isLoading: msgLoading } = useListMessages(selectedStudentId ? { studentId: selectedStudentId } : undefined, { query: { enabled: !!selectedStudentId } });
  const createMessage = useCreateMessage();

  const [content, setContent] = useState("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // If no student is selected but conversations exist, select the first one
  useEffect(() => {
    if (!selectedStudentId && conversations && conversations.length > 0) {
      setSelectedStudentId(conversations[0].studentId);
    }
  }, [conversations, selectedStudentId]);

  if (convLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const filteredConversations = conversations?.filter(c => 
    c.student?.name.includes(searchTerm) || c.student?.email.includes(searchTerm)
  );

  const selectedConversation = conversations?.find(c => c.studentId === selectedStudentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !selectedStudentId) return;

    createMessage.mutate({
      data: {
        content: content.trim(),
        recipientId: selectedStudentId
      }
    }, {
      onSuccess: () => {
        setContent("");
        queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey({ studentId: selectedStudentId }) });
        // Optional: refresh conversations to update last message preview
      },
      onError: () => {
        toast({ title: "حدث خطأ", description: "لم نتمكن من إرسال الرسالة.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6 h-[calc(100vh-10rem)] flex flex-col">
      <header>
        <h1 className="text-3xl font-bold text-primary mb-2">رسائل الطالبات</h1>
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Conversations List (Sidebar) */}
        <Card className="w-full md:w-80 flex flex-col border-border overflow-hidden shrink-0 h-1/3 md:h-full">
          <div className="p-4 border-b border-border bg-muted/10">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="بحث عن طالبة..." 
                className="pr-9 h-10 ui-sans bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto ui-sans">
            {filteredConversations && filteredConversations.length > 0 ? (
              filteredConversations.map(conv => (
                <div 
                  key={conv.studentId}
                  onClick={() => setSelectedStudentId(conv.studentId)}
                  className={`p-4 border-b border-border/50 cursor-pointer transition-colors hover:bg-muted/20 ${selectedStudentId === conv.studentId ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conv.student?.avatarUrl || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">{conv.student?.name?.charAt(0) || 'ط'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className={`font-bold truncate text-sm ${conv.unreadCount > 0 ? 'text-foreground' : 'text-foreground/80'}`}>{conv.student?.name}</span>
                        {conv.lastMessageAt && (
                          <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                            {format(new Date(conv.lastMessageAt), 'MMM d', { locale: ar })}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-xs truncate font-serif ${conv.unreadCount > 0 ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                          {conv.lastMessage || 'لا توجد رسائل'}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="bg-secondary text-secondary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                لا توجد محادثات.
              </div>
            )}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col overflow-hidden border-border h-2/3 md:h-full">
          {selectedStudentId ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-card flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedConversation?.student?.avatarUrl || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">{selectedConversation?.student?.name?.charAt(0) || 'ط'}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-primary text-sm">{selectedConversation?.student?.name}</h3>
                  <span className="text-xs text-muted-foreground ui-sans">
                    {selectedConversation?.hasActiveEnrollment ? 'مسجلة حالياً' : 'غير مسجلة'}
                  </span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-muted/5" ref={scrollRef}>
                {msgLoading ? (
                  <div className="flex justify-center py-4"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>
                ) : messages && messages.length > 0 ? (
                  messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((msg) => {
                    const isMine = msg.sender?.role === 'teacher';
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMine ? 'items-start' : 'items-end'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 ${
                          isMine 
                            ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                            : 'bg-card border border-border text-foreground rounded-tl-sm'
                        }`}>
                          <p className="font-serif leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground ui-sans mt-1 px-1">
                          {format(new Date(msg.createdAt), 'hh:mm a', { locale: ar })}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                    <MessageSquare className="h-12 w-12 mb-3" />
                    <p className="font-medium text-sm">لا توجد رسائل في هذه المحادثة</p>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-card border-t border-border">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="اكتبي رسالتك للطالبة..."
                    className="resize-none min-h-[60px] font-serif bg-background text-sm"
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
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-50">
              <MessageSquare className="h-16 w-16 mb-4" />
              <p className="font-medium text-lg">اختاري محادثة للبدء</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
