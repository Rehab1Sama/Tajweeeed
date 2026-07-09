import { useListTajweedRules, useGetStudentProgress } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export default function TajweedRules() {
  const { data: rules, isLoading: rulesLoading } = useListTajweedRules();
  const { data: progress, isLoading: progressLoading } = useGetStudentProgress();

  if (rulesLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Group rules by level
  const level1Rules = rules?.filter(r => r.level === 1).sort((a, b) => a.orderIndex - b.orderIndex) || [];
  const level2Rules = rules?.filter(r => r.level === 2).sort((a, b) => a.orderIndex - b.orderIndex) || [];

  const getProgressStatus = (ruleId: number) => {
    const p = progress?.find(p => p.ruleId === ruleId);
    if (!p) return { level: 0, label: "لم يبدأ", icon: Circle, color: "text-muted-foreground" };
    if (p.masteryLevel === 1) return { level: 1, label: "قيد التدريب", icon: Clock, color: "text-amber-500" };
    if (p.masteryLevel === 2) return { level: 2, label: "متقن", icon: CheckCircle2, color: "text-emerald-500" };
    return { level: 0, label: "لم يبدأ", icon: Circle, color: "text-muted-foreground" };
  };

  const RuleCard = ({ rule }: { rule: any }) => {
    const status = getProgressStatus(rule.id);
    const StatusIcon = status.icon;

    return (
      <Card className="h-full flex flex-col border-border hover:border-primary/30 transition-colors">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/10">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-primary font-bold mb-1">{rule.nameAr}</CardTitle>
              <div className="text-xs text-muted-foreground ui-sans font-medium" dir="ltr">{rule.nameEn}</div>
            </div>
            <div className={`flex items-center gap-1.5 bg-background border px-2 py-1 rounded-full text-xs font-bold ui-sans ${status.color}`}>
              <StatusIcon className="h-3.5 w-3.5" />
              <span>{status.label}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex-1 flex flex-col">
          <p className="text-muted-foreground text-sm font-serif leading-relaxed flex-1 mb-4">
            {rule.description}
          </p>
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 mt-auto">
            <span className="text-xs font-bold text-primary mb-1 block">مثال تطبيقي:</span>
            <span className="font-serif text-lg text-foreground block text-center py-2 font-bold">{rule.example}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-primary mb-2">الدليل المرجعي لأحكام التجويد</h1>
        <p className="text-muted-foreground font-serif">مرجع شامل يضم جميع الأحكام مع أمثلتها التوضيحية ومتابعة مستوى إتقانك لكل حكم.</p>
      </header>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-border flex-1"></div>
            <h2 className="text-2xl font-bold text-primary whitespace-nowrap">المستوى الأول: التأسيس</h2>
            <div className="h-px bg-border flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {level1Rules.map(rule => <RuleCard key={rule.id} rule={rule} />)}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-border flex-1"></div>
            <h2 className="text-2xl font-bold text-primary whitespace-nowrap">المستوى الثاني: الإتقان</h2>
            <div className="h-px bg-border flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {level2Rules.map(rule => <RuleCard key={rule.id} rule={rule} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
