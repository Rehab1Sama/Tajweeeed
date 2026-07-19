import { Link, useLocation } from "wouter";
import { useUser, useClerk } from "@clerk/react";
import { useGetCurrentUser } from "@workspace/api-client-react";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ListOrdered,
  FileEdit,
  Mic,
  MessageSquare,
  Bell,
  CreditCard,
  UserPlus,
  CheckSquare,
  CalendarDays,
  Music,
  MessageCircle,
  Award,
  Star,
  BarChart3,
  LogOut,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { data: currentUser, isLoading } = useGetCurrentUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (currentUser?.role !== "teacher") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 rounded-2xl border border-border bg-card shadow-sm max-w-sm">
          <p className="text-xl font-serif text-primary">ليس لديكِ صلاحية الوصول إلى هذه الصفحة</p>
        </div>
      </div>
    );
  }

  const navGroups = [
    {
      title: "عام",
      items: [
        { href: "/admin", label: "لوحة القيادة", icon: LayoutDashboard },
        { href: "/admin/stats", label: "الإحصائيات والتقارير", icon: BarChart3 },
      ]
    },
    {
      title: "الطالبات والتسجيل",
      items: [
        { href: "/admin/students", label: "الطالبات", icon: Users },
        { href: "/admin/applications", label: "طلبات الالتحاق", icon: UserPlus },
        { href: "/admin/enrollments", label: "الاشتراكات", icon: ListOrdered },
        { href: "/admin/payments", label: "المدفوعات", icon: CreditCard },
      ]
    },
    {
      title: "المحتوى العلمي",
      items: [
        { href: "/admin/courses", label: "الدورات", icon: BookOpen },
        { href: "/admin/tajweed-rules", label: "أحكام التجويد", icon: CheckSquare },
        { href: "/admin/audio-library", label: "المكتبة الصوتية", icon: Music },
        { href: "/admin/daily-wird", label: "الورد اليومي", icon: CalendarDays },
      ]
    },
    {
      title: "التقييم والمتابعة",
      items: [
        { href: "/admin/assignments", label: "تقييم الواجبات", icon: FileEdit },
        { href: "/admin/recordings", label: "تقييم التلاوات", icon: Mic },
        { href: "/admin/comment-templates", label: "قوالب التعليقات", icon: MessageCircle },
        { href: "/admin/messages", label: "الرسائل", icon: MessageSquare },
        { href: "/admin/announcements", label: "الإعلانات", icon: Bell },
      ]
    },
    {
      title: "التحفيز والتقدير",
      items: [
        { href: "/admin/weekly-star", label: "نجمة الأسبوع", icon: Star },
        { href: "/admin/certificates", label: "إصدار الشهادات", icon: Award },
      ]
    }
  ];

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
      
      <div className="flex-1 overflow-y-auto py-6 px-4 ui-sans">
        {navGroups.map((group, i) => (
          <div key={i} className="mb-6 last:mb-0">
            <h3 className="px-4 text-xs font-bold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/admin");
                return (
                  <Link key={item.href} href={item.href}>
                    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-sm ${
                      isActive 
                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" 
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
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
            <span className="font-medium truncate text-sidebar-primary-foreground">المعلمة {user?.firstName}</span>
            <span className="text-xs text-sidebar-foreground/70 truncate">لوحة الإدارة</span>
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
            <span className="font-bold text-primary">إدارة سُحُب</span>
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

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
