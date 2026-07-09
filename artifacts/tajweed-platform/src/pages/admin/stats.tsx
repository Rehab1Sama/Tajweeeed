import { useGetAdminStats, useGetCommonMistakes } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { GraduationCap, TrendingUp, AlertTriangle } from "lucide-react";

export default function StatsAdmin() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: mistakes, isLoading: mistakesLoading } = useGetCommonMistakes();

  if (statsLoading || mistakesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const COLORS = ['hsl(180 78% 24%)', 'hsl(41 65% 47%)', 'hsl(160 50% 40%)', 'hsl(38 54% 80%)'];

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-bold text-primary mb-2">التقارير والإحصائيات</h1>
        <p className="text-muted-foreground font-serif">رؤى وأرقام تحليلية لأداء المنصة والطالبات.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground ui-sans">الاشتراكات النشطة</p>
                <p className="text-3xl font-bold text-foreground ui-sans">{stats?.activeEnrollments || 0}</p>
              </div>
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground ui-sans">متوسط الإتقان</p>
                <p className="text-3xl font-bold text-foreground ui-sans">%{stats?.averageMastery || 0}</p>
              </div>
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground ui-sans">الدورات المكتملة</p>
                <p className="text-3xl font-bold text-foreground ui-sans">{stats?.completedCourses || 0}</p>
              </div>
              <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground ui-sans">إجمالي الطالبات</p>
                <p className="text-3xl font-bold text-foreground ui-sans">{stats?.totalStudents || 0}</p>
              </div>
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>الأحكام الأكثر خطأً (تحتاج تركيز)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {mistakes && mistakes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mistakes} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="ruleName" width={120} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} style={{ fontFamily: 'var(--font-serif)' }} />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontFamily: 'var(--font-sans)' }}
                  />
                  <Bar dataKey="correctionCount" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} barSize={24} name="عدد الأخطاء" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <AlertTriangle className="h-10 w-10 mb-2 opacity-20" />
                لا تتوفر بيانات كافية
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>توزيع الطالبات حسب المستوى</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex flex-col items-center justify-center">
            {stats?.enrollmentsByLevel && stats.enrollmentsByLevel.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.enrollmentsByLevel}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="level"
                    label={({level, percent}) => `المستوى ${level} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {stats.enrollmentsByLevel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value, 'طالبة']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontFamily: 'var(--font-sans)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground text-center">لا تتوفر بيانات كافية</div>
            )}
          </CardContent>
        </Card>
      </div>

      {stats?.topStudents && stats.topStudents.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>الطالبات المتميزات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.topStudents.map((student, i) => (
                <div key={student.id} className="flex items-center gap-4 p-4 border border-border rounded-xl bg-muted/10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                    i === 0 ? 'bg-amber-100 text-amber-700' : 
                    i === 1 ? 'bg-slate-200 text-slate-700' : 
                    i === 2 ? 'bg-amber-700/20 text-amber-900' : 
                    'bg-muted text-muted-foreground'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground truncate ui-sans">{student.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
