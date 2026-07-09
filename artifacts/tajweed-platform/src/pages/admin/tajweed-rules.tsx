import { useListTajweedRules, useCreateTajweedRule, useDeleteTajweedRule, getListTajweedRulesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, CheckSquare } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function TajweedRulesAdmin() {
  const { data: rules, isLoading } = useListTajweedRules();
  const createRule = useCreateTajweedRule();
  const deleteRule = useDeleteTajweedRule();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    description: "",
    example: "",
    level: "1",
    orderIndex: "1"
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
    createRule.mutate({
      data: {
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        description: formData.description,
        example: formData.example,
        level: parseInt(formData.level),
        orderIndex: parseInt(formData.orderIndex)
      }
    }, {
      onSuccess: () => {
        toast({ title: "تم الإضافة", description: "تمت إضافة الحكم التجويدي بنجاح." });
        setIsOpen(false);
        queryClient.invalidateQueries({ queryKey: getListTajweedRulesQueryKey() });
        setFormData({ nameAr: "", nameEn: "", description: "", example: "", level: "1", orderIndex: (rules?.length ? rules.length + 1 : 1).toString() });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكدة من حذف هذا الحكم؟")) {
      deleteRule.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "تم الحذف", description: "تم حذف الحكم التجويدي." });
          queryClient.invalidateQueries({ queryKey: getListTajweedRulesQueryKey() });
        }
      });
    }
  };

  const level1Rules = rules?.filter(r => r.level === 1).sort((a,b) => a.orderIndex - b.orderIndex) || [];
  const level2Rules = rules?.filter(r => r.level === 2).sort((a,b) => a.orderIndex - b.orderIndex) || [];

  const RuleSection = ({ level, rulesList, title }: { level: number, rulesList: any[], title: string }) => (
    <section className="mb-12">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-primary whitespace-nowrap">{title}</h2>
        <div className="h-px bg-border flex-1"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rulesList.map(rule => (
          <Card key={rule.id} className="flex flex-col border-border relative group">
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              onClick={() => handleDelete(rule.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <CardHeader className="pb-3 bg-muted/5 border-b border-border/50">
              <CardTitle className="text-lg font-bold text-primary">{rule.nameAr}</CardTitle>
              <div className="text-xs text-muted-foreground ui-sans" dir="ltr">{rule.nameEn}</div>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col">
              <p className="text-sm font-serif text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-1">
                {rule.description}
              </p>
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 mt-auto">
                <span className="text-xs font-bold text-primary block mb-1">المثال:</span>
                <span className="font-serif font-bold text-foreground text-center block">{rule.example}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {rulesList.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground bg-card border border-border rounded-xl">
            لا توجد أحكام في هذا المستوى.
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">أحكام التجويد</h1>
          <p className="text-muted-foreground font-serif">الدليل المرجعي الذي تتابعه الطالبات في خريطة التقدم.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="ui-sans gap-2">
              <Plus className="h-4 w-4" /> حكم جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-xl text-primary font-bold mb-4">إضافة حكم تجويدي</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 ui-sans">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameAr">الاسم (عربي)</Label>
                  <Input required id="nameAr" value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} className="font-serif" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameEn">الاسم (انجليزي)</Label>
                  <Input required id="nameEn" value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} dir="ltr" className="text-left" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">الشرح والتفصيل</Label>
                <Textarea required id="desc" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="font-serif resize-none" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="example">المثال القرآني</Label>
                <Input required id="example" value={formData.example} onChange={e => setFormData({...formData, example: e.target.value})} className="font-serif text-lg text-center" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">المستوى</Label>
                  <Input required type="number" min="1" max="2" id="level" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">الترتيب</Label>
                  <Input required type="number" min="1" id="order" value={formData.orderIndex} onChange={e => setFormData({...formData, orderIndex: e.target.value})} />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4" disabled={createRule.isPending}>
                {createRule.isPending ? "جاري الحفظ..." : "حفظ الحكم"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <RuleSection level={1} rulesList={level1Rules} title="المستوى الأول: التأسيس" />
      <RuleSection level={2} rulesList={level2Rules} title="المستوى الثاني: الإتقان" />
    </div>
  );
}
