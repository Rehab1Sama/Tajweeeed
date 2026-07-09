import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Star, Users, Award, PlayCircle, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="نور التجويد" className="h-12 w-12" />
            <h1 className="text-2xl font-bold text-primary">نور التجويد</h1>
          </div>
          <div className="flex items-center gap-4 ui-sans">
            <Link href="/sign-in" className="text-primary hover:text-primary/80 font-medium px-4 py-2 transition-colors">
              تسجيل الدخول
            </Link>
            <Link href="/apply">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                انضمي إلينا
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(hsl(180 78% 24%) 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight">
                رتّلي القرآن <br className="hidden md:block" />
                <span className="text-secondary">كما أُنزل</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed font-serif">
                مساحة تعليمية هادئة ومخصصة للنساء لتعلم وإتقان أحكام التجويد 
                بطريقة علمية وعملية، مع متابعة شخصية مستمرة.
              </p>
              <div className="flex items-center justify-center gap-4 ui-sans">
                <Link href="/apply">
                  <Button size="lg" className="h-14 px-8 text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    سجلي طلب انضمام
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    دخول الطالبات
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-card border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4">ما يميز منصتنا</h3>
              <p className="text-lg text-muted-foreground font-serif max-w-2xl mx-auto">
                صممت هذه المنصة لتكون بيئة داعمة ومحفزة لتعلم كتاب الله، تجمع بين الأصالة في العلم والحداثة في العرض.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Users, title: "متابعة فردية", desc: "توجيه وتصحيح مباشر لكل طالبة لضمان التطبيق الصحيح للأحكام." },
                { icon: BookOpen, title: "منهجية واضحة", desc: "دروس مقسمة لمستويات متدرجة تناسب المبتدئات والمتقدمات." },
                { icon: PlayCircle, title: "تسجيلات صوتية", desc: "مكتبة صوتية للمقارنة وتقييم التلاوات مع تغذية راجعة دقيقة." },
                { icon: Heart, title: "بيئة نسائية", desc: "مساحة آمنة ومريحة تتيح للطالبة التعلم براحة وطمأنينة." },
                { icon: Star, title: "مستويات إتقان", desc: "نظام تتبع يوضح مدى استيعابك وتطبيقك لكل حكم تجويدي." },
                { icon: Award, title: "شهادات إتمام", desc: "توثيق لرحلتك التعليمية عند إتمام كل مستوى بنجاح." },
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h4 className="text-xl font-bold text-primary mb-3">{feature.title}</h4>
                  <p className="text-muted-foreground font-serif">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Levels */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1">
                <h3 className="text-4xl font-bold text-primary mb-6">رحلة التعلم</h3>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-serif">
                  نقدم مستويين دراسيين متدرجين، لنأخذ بيدك من البداية وحتى التلاوة المتقنة التي ترضين عنها.
                </p>
                
                <div className="space-y-6">
                  <div className="flex gap-4 p-6 rounded-2xl bg-card border border-border">
                    <div className="text-secondary font-bold text-5xl">1</div>
                    <div>
                      <h4 className="text-2xl font-bold text-primary mb-2">المستوى الأول: التأسيس</h4>
                      <p className="text-muted-foreground font-serif">التعرف على مخارج الحروف وصفاتها الأساسية، وأحكام النون الساكنة والتنوين والميم الساكنة.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 p-6 rounded-2xl bg-card border border-border">
                    <div className="text-secondary font-bold text-5xl">2</div>
                    <div>
                      <h4 className="text-2xl font-bold text-primary mb-2">المستوى الثاني: الإتقان</h4>
                      <p className="text-muted-foreground font-serif">التعمق في أحكام المدود، والوقف والابتداء، والتدريب المكثف على التلاوة الصحيحة الخالية من اللحون.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 relative">
                <div className="aspect-square max-w-md mx-auto rounded-full bg-primary/5 border-2 border-primary/20 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(hsl(41 65% 47%) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  <BookOpen className="w-48 h-48 text-primary/20" strokeWidth={0.5} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">هل أنتِ مستعدة للبدء؟</h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto font-serif">
              المقاعد محدودة لضمان جودة المتابعة الفردية. سجلي طلب انضمامك الآن وسنتواصل معك قريباً.
            </p>
            <Link href="/apply">
              <Button size="lg" className="h-16 px-10 text-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 ui-sans border-0 shadow-lg">
                تقديم طلب الالتحاق
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 text-center ui-sans">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-2 mb-6">
            <img src="/logo.svg" alt="نور التجويد" className="h-8 w-8 grayscale" />
            <span className="text-xl font-bold text-muted-foreground font-serif">نور التجويد</span>
          </div>
          <p className="text-muted-foreground mb-4 font-serif">
            مساحة لتعلم كتاب الله وإتقان تلاوته
          </p>
          <p className="text-sm text-muted-foreground/60">
            &copy; {new Date().getFullYear()} جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
}
