import { useListStudents, useGetStudent } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";
import { Search, ChevronLeft, Award } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function StudentsList() {
  const { data: students, isLoading } = useListStudents();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, inactive

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const filteredStudents = students?.filter(student => {
    const matchesSearch = student.name.includes(searchTerm) || student.email.includes(searchTerm);
    const hasActiveEnrollment = student.activeEnrollment?.status === 'active';
    
    if (filter === 'active' && !hasActiveEnrollment) return false;
    if (filter === 'inactive' && hasActiveEnrollment) return false;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">إدارة الطالبات</h1>
          <p className="text-muted-foreground font-serif">قائمة بجميع الطالبات المسجلات في المنصة.</p>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="بحث بالاسم أو البريد الإلكتروني..." 
            className="pr-10 h-12 text-base ui-sans"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 ui-sans">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            onClick={() => setFilter('all')}
          >
            الكل
          </Button>
          <Button 
            variant={filter === 'active' ? 'default' : 'outline'} 
            onClick={() => setFilter('active')}
          >
            نشط
          </Button>
          <Button 
            variant={filter === 'inactive' ? 'default' : 'outline'} 
            onClick={() => setFilter('inactive')}
          >
            غير نشط
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right ui-sans text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground">
              <tr>
                <th className="p-4 font-bold">الطالبة</th>
                <th className="p-4 font-bold">حالة التسجيل</th>
                <th className="p-4 font-bold">مستوى الإتقان</th>
                <th className="p-4 font-bold">آخر نشاط</th>
                <th className="p-4 font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents && filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border">
                          <AvatarImage src={student.avatarUrl || undefined} />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-foreground">{student.name}</div>
                          <div className="text-xs text-muted-foreground">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {student.activeEnrollment?.status === 'active' ? (
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold inline-block">
                          مسجلة: {student.activeEnrollment.course?.title}
                        </span>
                      ) : (
                        <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs font-bold inline-block">
                          غير مسجلة
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-secondary font-bold">
                        <Award className="h-4 w-4" />
                        {student.masteryScore} نقطة
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {student.lastActiveAt ? format(new Date(student.lastActiveAt), 'd MMM yyyy', { locale: ar }) : '-'}
                    </td>
                    <td className="p-4 text-left">
                      <Link href={`/admin/students/${student.id}`}>
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground font-medium">
                    لا توجد نتائج مطابقة للبحث.
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
