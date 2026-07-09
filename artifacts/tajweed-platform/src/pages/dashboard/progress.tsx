import { useListTajweedRules, useGetStudentProgress } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock, Star, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function ProgressMap() {
  const { data: rules, isLoading: rulesLoading } = useListTajweedRules();
  const { data: progress, isLoading: progressLoading } = useGetStudentProgress();

  if (rulesLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const allRules = rules?.sort((a, b) => a.orderIndex - b.orderIndex) || [];
  
  const masteredCount = progress?.filter(p => p.masteryLevel === 2).length || 0;
  const inProgressCount = progress?.filter(p => p.masteryLevel === 1).length || 0;
  const totalCount = allRules.length;

  return (
    <div className="space-y-8">
      <header className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-primary mb-4">خريطة التقدم</h1>
        <p className="text-muted-foreground font-serif">
          مسار واضح لرحلتك في تعلم أحكام التجويد. كل خطوة تقربك أكثر من إتقان تلاوة كتاب الله.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-16">
        <Card className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900 text-center py-6">
          <div className="text-4xl font-bold text-emerald-600 ui-sans mb-2">{masteredCount}</div>
          <div className="text-sm font-medium text-emerald-700 dark:text-emerald-400">حكم متقن</div>
        </Card>
        <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900 text-center py-6">
          <div className="text-4xl font-bold text-amber-600 ui-sans mb-2">{inProgressCount}</div>
          <div className="text-sm font-medium text-amber-700 dark:text-amber-400">قيد التدريب</div>
        </Card>
        <Card className="bg-muted text-center py-6">
          <div className="text-4xl font-bold text-muted-foreground ui-sans mb-2">{totalCount - masteredCount - inProgressCount}</div>
          <div className="text-sm font-medium text-muted-foreground">لم يبدأ</div>
        </Card>
      </div>

      <div className="relative max-w-4xl mx-auto pb-20">
        {/* Winding Path Background */}
        <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-muted-foreground/10 -translate-x-1/2 rounded-full" />
        
        <div className="space-y-12">
          {allRules.map((rule, index) => {
            const p = progress?.find(p => p.ruleId === rule.id);
            const status = p?.masteryLevel === 2 ? 'mastered' : p?.masteryLevel === 1 ? 'in-progress' : 'not-started';
            
            const isEven = index % 2 === 0;
            
            return (
              <motion.div 
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex items-center gap-8 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Content Side */}
                <div className={`flex-1 ${isEven ? 'text-left' : 'text-right'}`}>
                  <Card className={`inline-block w-full max-w-sm text-right transition-transform hover:-translate-y-1 ${
                    status === 'mastered' ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20' :
                    status === 'in-progress' ? 'border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20' :
                    'opacity-70'
                  }`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className={`text-lg font-bold ${
                          status === 'mastered' ? 'text-emerald-700 dark:text-emerald-400' :
                          status === 'in-progress' ? 'text-amber-700 dark:text-amber-400' :
                          'text-muted-foreground'
                        }`}>{rule.nameAr}</h3>
                        <span className="text-xs font-bold ui-sans bg-background px-2 py-1 rounded text-muted-foreground border">مستوى {rule.level}</span>
                      </div>
                      <p className="text-sm text-muted-foreground font-serif line-clamp-2">{rule.description}</p>
                      
                      {p?.selfAssessment && (
                        <div className="mt-3 flex items-center gap-1 justify-end" dir="ltr">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className={`h-3 w-3 ${star <= p.selfAssessment! ? 'fill-secondary text-secondary' : 'text-muted/30'}`} />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Node */}
                <div className="relative shrink-0 z-10 flex justify-center">
                  <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center bg-background shadow-sm ${
                    status === 'mastered' ? 'border-emerald-500 text-emerald-500' :
                    status === 'in-progress' ? 'border-amber-500 text-amber-500' :
                    'border-muted-foreground/20 text-muted-foreground/30'
                  }`}>
                    {status === 'mastered' ? <CheckCircle2 className="h-6 w-6" /> :
                     status === 'in-progress' ? <Clock className="h-6 w-6" /> :
                     <span className="font-bold ui-sans">{index + 1}</span>}
                  </div>
                </div>

                {/* Empty Side for layout */}
                <div className="flex-1" />
              </motion.div>
            );
          })}

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center pt-8"
          >
            <div className="w-24 h-24 rounded-full bg-secondary/10 border-4 border-secondary flex items-center justify-center text-secondary relative z-10 shadow-lg">
              <Trophy className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-primary mt-4">الإتقان الكامل</h3>
            <p className="text-muted-foreground mt-2">المحطة النهائية في رحلة التجويد</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
