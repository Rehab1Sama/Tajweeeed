import { Link, useLocation } from "wouter";
import { useUser, useClerk } from "@clerk/react";
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckCircle, 
  Map, 
  FileText, 
  Edit3, 
  Mic, 
  MessageSquare, 
  Award, 
  Bell,
  LogOut,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetStudentDashboard } from "@workspace/api-client-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { data: dashboardData } = useGetStudentDashboard();

  const navItems = [
    { href: "/dashboard", label: "الرئيسية", icon: LayoutDashboard },
    { href: "/dashboard/my-course", label: "دورتي الحالية", icon: BookOpen },
    { href: "/dashboard/lessons", label: "الدروس", icon: FileText },
    { href: "/dashboard/tajweed-rules", label: "أحكام التجويد", icon: CheckCircle },
    { href: "/dashboard/progress", label: "خريطة التقدم", icon: Map },
    { href: "/dashboard/assignments", label: "الواجبات", icon: Edit3 },
    { href: "/dashboard/recordings", label: "التسجيلات الصوتية", icon: Mic },
    { href: "/dashboard/messages", label: "الرسائل", icon: MessageSquare },
    { href: "/dashboard/certificates", label: "الشهادات", icon: Award },
    { href: "/dashboard/announcements", label: "الإعلانات", icon: Bell },
  ];

  const hasActiveEnrollment = dashboardData?.activeEnrollment?.status === 'active';

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-l border-sidebar-border text-sidebar-foreground">
      <div className="p-6 border-b border-sidebar-border flex items-center justify-center gap-3">
        <div className="rounded-full overflow-hidden flex items-center justify-center shrink-0"
          style={{ width: 40, height: 40, background: "rgba(255,255,255,0.85)" }}>
          <img src="/logo.png" alt="سُحُب" style={{ width: 34, height: 34, objectFit: "contain" }}/>
        </div>
        <div>
          <span className="text-xl font-bold font-serif text-sidebar-primary-foreground block leading-none">سُحُب</span>
          <span className="text-xs font-serif" style={{ color: "rgba(255,255,255,0.75)" }}>سُحُبٌ في سماء التجويد</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 ui-sans">
        {navItems.map((item) => {
          const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/dashboard");
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" 
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-6 border-t border-sidebar-border ui-sans">
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="h-10 w-10 border border-sidebar-border">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
              {user?.firstName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="font-medium truncate text-sidebar-primary-foreground">{user?.fullName}</span>
            <span className="text-xs text-sidebar-foreground/70 truncate">طالبة</span>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground/80 hover:text-destructive-foreground hover:bg-destructive/90"
          onClick={() => signOut({ redirectUrl: "/" })}
        >
          <LogOut className="h-5 w-5 ml-2" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background font-serif overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <SidebarContent />
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-border bg-card flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full overflow-hidden" style={{ width: 32, height: 32, background: "rgba(255,255,255,0.8)", border: "1px solid #c8e0f0" }}>
              <img src="/logo.png" alt="سُحُب" style={{ width: 32, height: 32, objectFit: "contain" }}/>
            </div>
            <span className="font-bold text-primary">سُحُب</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-72 border-none">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>

        {/* Read-only Banner */}
        {dashboardData && !hasActiveEnrollment && (
          <div className="bg-destructive/10 border-b border-destructive/20 text-destructive px-4 py-3 text-center ui-sans text-sm font-medium flex items-center justify-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
            اشتراكك الحالي غير فعال. أنت في وضع القراءة فقط ولا يمكنك إرسال واجبات أو تسليم تلاوات.
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
