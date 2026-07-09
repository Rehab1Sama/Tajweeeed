import { useListEnrollments, useUpdateEnrollment, getListEnrollmentsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function EnrollmentsList() {
  const { data: enrollments, isLoading } = useListEnrollments();
  const updateEnrollment = useUpdateEnrollment();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [filter, setFilter] = useState("all"); // all, pending, active, completed

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const filteredEnrollments = enrollments?.filter(e => {
    if (filter === 'all') return true;
    return e.status === filter;
  }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleStatusChange = (id: number, newStatus: any) => {
    updateEnrollment.mutate({
      id,
      data: { status: newStatus }
    }, {
      onSuccess: () => {
        toast({ title: "تم التحديث", description: "تم تحديث حالة الاشتراك بنجاح." });
        queryClient.invalidateQueries({ queryKey: getListEnrollmentsQueryKey() });
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5"/> نشط</span>;
      case 'pending': return <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1"><Clock className="h-3.5 w-3.5"/> قيد الانتظار</span>;
      case 'completed': return <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5"/> مكتمل</span>;
      case 'cancelled': return <span className="bg-muted text-muted-foreground px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1"><XCircle className="h-3.5 w-3.5"/> ملغى</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">إدارة الاشتراكات</h1>
          <p className="text-muted-foreground font-serif">متابعة وتحديث حالات اشتراك الطالبات في الدورات.</p>
        </div>
      </header>

      <div className="flex gap-2 ui-sans overflow-x-auto pb-2">
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>الكل</Button>
        <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>قيد الانتظار</Button>
        <Button variant={filter === 'active' ? 'default' : 'outline'} onClick={() => setFilter('active')}>نشط</Button>
        <Button variant={filter === 'completed' ? 'default' : 'outline'} onClick={() => setFilter('completed')}>مكتمل</Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right ui-sans text-sm min-w-[800px]">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground">
              <tr>
                <th className="p-4 font-bold">الطالبة</th>
                <th className="p-4 font-bold">الدورة</th>
                <th className="p-4 font-bold">تاريخ الطلب</th>
                <th className="p-4 font-bold">الحالة</th>
                <th className="p-4 font-bold w-40">تحديث الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments && filteredEnrollments.length > 0 ? (
                filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">{enrollment.student?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="font-bold text-foreground">{enrollment.student?.name}</div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-primary">
                      {enrollment.course?.title}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {format(new Date(enrollment.createdAt), 'd MMM yyyy', { locale: ar })}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(enrollment.status)}
                    </td>
                    <td className="p-4">
                      <Select 
                        value={enrollment.status} 
                        onValueChange={(val) => handleStatusChange(enrollment.id, val)}
                      >
                        <SelectTrigger className="h-8 text-xs bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent dir="rtl" className="ui-sans text-xs">
                          <SelectItem value="pending">قيد الانتظار</SelectItem>
                          <SelectItem value="active">تفعيل (نشط)</SelectItem>
                          <SelectItem value="completed">إنهاء (مكتمل)</SelectItem>
                          <SelectItem value="cancelled">إلغاء</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground font-medium">
                    لا توجد اشتراكات مطابقة للفرز الحالي.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
