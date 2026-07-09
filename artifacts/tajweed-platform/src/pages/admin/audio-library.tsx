import { useListAudioLibrary, useCreateAudioLibraryItem, useDeleteAudioLibraryItem, useListTajweedRules, getListAudioLibraryQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Music, Plus, Trash2, Headphones } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AudioLibraryAdmin() {
  const { data: libraryItems, isLoading } = useListAudioLibrary();
  const { data: rules } = useListTajweedRules();
  const createItem = useCreateAudioLibraryItem();
  const deleteItem = useDeleteAudioLibraryItem();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    reciterName: "",
    audioUrl: "",
    description: "",
    ruleId: "none"
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
    createItem.mutate({
      data: {
        reciterName: formData.reciterName,
        audioUrl: formData.audioUrl,
        description: formData.description || undefined,
        ruleId: formData.ruleId === "none" ? undefined : parseInt(formData.ruleId)
      }
    }, {
      onSuccess: () => {
        toast({ title: "تم الإضافة", description: "تمت إضافة المقطع الصوتي للمكتبة." });
        setIsOpen(false);
        queryClient.invalidateQueries({ queryKey: getListAudioLibraryQueryKey() });
        setFormData({ reciterName: "", audioUrl: "", description: "", ruleId: "none" });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكدة من حذف هذا المقطع؟")) {
      deleteItem.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "تم الحذف", description: "تم حذف المقطع من المكتبة." });
          queryClient.invalidateQueries({ queryKey: getListAudioLibraryQueryKey() });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">المكتبة الصوتية</h1>
          <p className="text-muted-foreground font-serif">إدارة التلاوات المرجعية للمقرئين لتدريب الطالبات.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="ui-sans gap-2">
              <Plus className="h-4 w-4" /> مقطع جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-xl text-primary font-bold mb-4">إضافة مقطع للمكتبة</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reciter" className="ui-sans">اسم المقرئ</Label>
                <Input required id="reciter" value={formData.reciterName} onChange={e => setFormData({...formData, reciterName: e.target.value})} className="font-serif" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audioUrl" className="ui-sans">رابط المقطع الصوتي</Label>
                <Input required type="url" id="audioUrl" value={formData.audioUrl} onChange={e => setFormData({...formData, audioUrl: e.target.value})} dir="ltr" className="text-left ui-sans" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rule" className="ui-sans">الارتباط بحكم تجويدي</Label>
                <Select value={formData.ruleId} onValueChange={val => setFormData({...formData, ruleId: val})}>
                  <SelectTrigger className="ui-sans text-right" dir="rtl">
                    <SelectValue placeholder="اختاري الحكم" />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="ui-sans max-h-60">
                    <SelectItem value="none">بدون ارتباط (مقطع عام)</SelectItem>
                    {rules?.sort((a,b) => a.orderIndex - b.orderIndex).map(rule => (
                      <SelectItem key={rule.id} value={rule.id.toString()}>{rule.nameAr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc" className="ui-sans">وصف أو توجيه (اختياري)</Label>
                <Input id="desc" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="font-serif" />
              </div>
              <Button type="submit" className="w-full ui-sans mt-4" disabled={createItem.isPending}>
                {createItem.isPending ? "جاري الحفظ..." : "حفظ المقطع"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {libraryItems && libraryItems.length > 0 ? (
          libraryItems.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(item => (
            <Card key={item.id} className="flex flex-col border-border relative group">
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 z-10"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-full text-primary">
                    <Headphones className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-primary">{item.reciterName}</CardTitle>
                    {item.ruleId && (
                      <span className="text-xs text-muted-foreground ui-sans font-medium">
                        لحكم: {rules?.find(r => r.id === item.ruleId)?.nameAr}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 flex-1 flex flex-col">
                <p className="text-sm font-serif text-muted-foreground mb-4 line-clamp-2">
                  {item.description}
                </p>
                <div className="mt-auto">
                  <audio controls src={item.audioUrl} className="w-full outline-none h-10" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-card border border-border rounded-xl text-muted-foreground font-medium flex flex-col items-center">
            <Music className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
            المكتبة الصوتية فارغة.
          </div>
        )}
      </div>
    </div>
  );
}
