import { useListPayments, useUpdatePayment, getListPaymentsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, CheckCircle2, Clock, XCircle, Search } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function PaymentsAdmin() {
  const { data: payments, isLoading } = useListPayments();
  const updatePayment = useUpdatePayment();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const filteredPayments = payments?.filter(p => {
    const matchesFilter = filter === 'all' ? true : p.status === filter;
    const matchesSearch = p.student?.name?.includes(searchTerm) || p.course?.title?.includes(searchTerm);
    return matchesFilter && matchesSearch;
  }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleStatusChange = (id: number, newStatus: any) => {
    updatePayment.mutate({
      id,
      data: { status: newStatus, paidAt: newStatus === 'paid' ? new Date().toISOString() : undefined }
    }, {
      onSuccess: () => {
        toast({ title: "تم التحديث", description: "تم تحديث حالة الدفع بنجاح." });
        queryClient.invalidateQueries({ queryKey: getListPaymentsQueryKey() });
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 w-max"><CheckCircle2 className="h-3 w-3"/> مدفوع</span>;
      case 'pending': return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 w-max"><Clock className="h-3 w-3"/> قيد الانتظار</span>;
      case 'cancelled': return <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 w-max"><XCircle className="h-3 w-3"/> ملغى</span>;
      case 'refunded': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 w-max">مسترجع</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">المدفوعات والرسوم</h1>
          <p className="text-muted-foreground font-serif">متابعة الرسوم المالية للاشتراكات وتسجيل الدفع.</p>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="بحث باسم الطالبة أو الدورة..." 
            className="pr-10 h-10 text-sm ui-sans"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 ui-sans overflow-x-auto pb-2 shrink-0">
          <Button size="sm" variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>الكل</Button>
          <Button size="sm" variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>قيد الانتظار</Button>
          <Button size="sm" variant={filter === 'paid' ? 'default' : 'outline'} onClick={() => setFilter('paid')}>مدفوع</Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right ui-sans text-sm min-w-[900px]">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground">
              <tr>
                <th className="p-4 font-bold">الطالبة</th>
                <th className="p-4 font-bold">الدورة / الوصف</th>
                <th className="p-4 font-bold">المبلغ</th>
                <th className="p-4 font-bold">التاريخ</th>
                <th className="p-4 font-bold">الحالة</th>
                <th className="p-4 font-bold w-40">تحديث</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments && filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">{payment.student?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="font-bold text-foreground text-xs">{payment.student?.name}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-primary text-xs mb-1">{payment.course?.title}</div>
                      {payment.method && <div className="text-[10px] text-muted-foreground">طريقة الدفع: {payment.method}</div>}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-secondary">{payment.amount} د.ك</span>
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {format(new Date(payment.createdAt), 'd MMM yyyy', { locale: ar })}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="p-4">
                      <Select 
                        value={payment.status} 
                        onValueChange={(val) => handleStatusChange(payment.id, val)}
                      >
                        <SelectTrigger className="h-8 text-xs bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent dir="rtl" className="ui-sans text-xs">
                          <SelectItem value="pending">قيد الانتظار</SelectItem>
                          <SelectItem value="paid">تم الدفع</SelectItem>
                          <SelectItem value="cancelled">إلغاء</SelectItem>
                          <SelectItem value="refunded">مسترجع</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground font-medium">
                    لا توجد سجلات دفع مطابقة.
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
