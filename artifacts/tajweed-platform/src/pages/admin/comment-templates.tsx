import { useListCommentTemplates, useCreateCommentTemplate, useDeleteCommentTemplate, getListCommentTemplatesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquarePlus, Trash2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function CommentTemplatesAdmin() {
  const { data: templates, isLoading } = useListCommentTemplates();
  const createTemplate = useCreateCommentTemplate();
  const deleteTemplate = useDeleteCommentTemplate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    text: "",
    category: "عام"
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
    if (!formData.text.trim()) return;

    createTemplate.mutate({
      data: {
        text: formData.text,
        category: formData.category || undefined
      }
    }, {
      onSuccess: () => {
        toast({ title: "تم الإضافة", description: "تمت إضافة القالب بنجاح." });
        queryClient.invalidateQueries({ queryKey: getListCommentTemplatesQueryKey() });
        setFormData({ ...formData, text: "" });
      }
    });
  };

  const handleDelete = (id: number) => {
    deleteTemplate.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "تم الحذف", description: "تم حذف القالب." });
        queryClient.invalidateQueries({ queryKey: getListCommentTemplatesQueryKey() });
      }
    });
  };

  // Group templates by category
  const groupedTemplates = templates?.reduce((acc: Record<string, any[]>, curr) => {
    const cat = curr.category || 'عام';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(curr);
    return acc;
  }, {}) || {};

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-primary mb-2">قوالب التعليقات</h1>
        <p className="text-muted-foreground font-serif">ردود جاهزة لتسريع عملية التقييم وكتابة الملاحظات للطالبات.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
                <MessageSquarePlus className="h-5 w-5" />
                إضافة قالب جديد
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="ui-sans">التصنيف (القسم)</Label>
                  <Input 
                    id="category" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    placeholder="مثال: أحكام النون، إيجابي، توجيه..."
                    className="ui-sans" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text" className="ui-sans">نص التعليق</Label>
                  <Textarea 
                    required 
                    id="text" 
                    rows={4}
                    value={formData.text} 
                    onChange={e => setFormData({...formData, text: e.target.value})} 
                    className="font-serif resize-none" 
                  />
                </div>
                <Button type="submit" className="w-full ui-sans" disabled={createTemplate.isPending}>
                  {createTemplate.isPending ? "جاري الإضافة..." : "حفظ القالب"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {Object.entries(groupedTemplates).length > 0 ? (
            Object.entries(groupedTemplates).map(([category, items]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-bold text-foreground bg-muted px-4 py-2 rounded-lg border border-border inline-block ui-sans">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map(template => (
                    <Card key={template.id} className="border-border group">
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex-1 font-serif text-sm leading-relaxed whitespace-pre-wrap mb-4">
                          "{template.text}"
                        </div>
                        <div className="flex justify-end mt-auto border-t border-border pt-3">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2 ui-sans"
                            onClick={() => handleDelete(template.id)}
                          >
                            <Trash2 className="h-4 w-4 ml-1" /> حذف
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-card border border-border rounded-xl text-muted-foreground flex flex-col items-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
              لا توجد قوالب مضافة بعد. أضيفي قالبك الأول لتسهيل التقييم.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
