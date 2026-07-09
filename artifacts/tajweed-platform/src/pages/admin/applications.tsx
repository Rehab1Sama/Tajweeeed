import { useListApplications, useUpdateApplication, getListApplicationsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ApplicationsAdmin() {
  const { data: applications, isLoading } = useListApplications();
  const updateApplication = useUpdateApplication();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [filter, setFilter] = useState("pending");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const filteredApps = applications?.filter(a => a.status === filter).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleStatusChange = (id: number, newStatus: any) => {
    updateApplication.mutate({
      id,
      data: { status: newStatus }
    }, {
      onSuccess: () => {
        toast({ title: "تم التحديث", description: "تم تحديث حالة الطلب بنجاح." });
        queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey() });
      }
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">طلبات الالتحاق</h1>
          <p className="text-muted-foreground font-serif">مراجعة والبت في طلبات الانضمام للمنصة.</p>
        </div>
      </header>

      <div className="flex gap-2 ui-sans">
        <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>
          قيد الانتظار
        </Button>
        <Button variant={filter === 'approved' ? 'default' : 'outline'} onClick={() => setFilter('approved')}>
          مقبولة
        </Button>
        <Button variant={filter === 'rejected' ? 'default' : 'outline'} onClick={() => setFilter('rejected')}>
          مرفوضة
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredApps && filteredApps.length > 0 ? (
          filteredApps.map(app => (
            <Card key={app.id} className="border-border">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-1">{app.name}</h3>
                    <p className="text-sm text-muted-foreground ui-sans" dir="ltr">{app.email}</p>
                    {app.phone && <p className="text-sm text-muted-foreground ui-sans mt-1" dir="ltr">{app.phone}</p>}
                  </div>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold ui-sans">
                    المستوى {app.desiredLevel}
                  </span>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-xl border border-border mb-6">
                  <span className="text-xs font-bold text-muted-foreground block mb-2 ui-sans">رسالة المتقدمة:</span>
                  <p className="font-serif text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                    {app.message || "لا توجد رسالة مرفقة."}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground ui-sans">
                    {format(new Date(app.createdAt), 'd MMMM yyyy', { locale: ar })}
                  </span>
                  
                  {filter === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive hover:text-destructive-foreground ui-sans" onClick={() => handleStatusChange(app.id, 'rejected')}>
                        <XCircle className="h-4 w-4 ml-1" /> رفض
                      </Button>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white ui-sans" onClick={() => handleStatusChange(app.id, 'approved')}>
                        <CheckCircle2 className="h-4 w-4 ml-1" /> قبول
                      </Button>
                    </div>
                  )}
                  {filter === 'approved' && <span className="text-emerald-600 font-bold text-sm flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> تم القبول</span>}
                  {filter === 'rejected' && <span className="text-destructive font-bold text-sm flex items-center gap-1"><XCircle className="h-4 w-4" /> تم الرفض</span>}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-card border border-border rounded-xl text-muted-foreground font-medium flex flex-col items-center">
            <UserPlus className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
            لا توجد طلبات في هذا القسم.
          </div>
        )}
      </div>
    </div>
  );
}
