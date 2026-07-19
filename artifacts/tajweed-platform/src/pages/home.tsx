import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Star, Users, Award, PlayCircle, Heart } from "lucide-react";

function SkyBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Pastel sky gradient */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #b8d8f0 0%, #cce5f7 18%, #ddf0fb 38%, #eef8fd 58%, #f5f0e8 82%, #ecdfd0 100%)"
      }}/>
      {/* Painted clouds */}
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
        className="absolute top-0 left-0 w-full h-full">
        <defs>
          <filter id="sc1" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="18"/>
          </filter>
          <filter id="sc2" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10"/>
          </filter>
          <radialGradient id="cg1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95"/>
            <stop offset="100%" stopColor="#daeefa" stopOpacity="0.25"/>
          </radialGradient>
          <radialGradient id="cg2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f0f8ff" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#c5dff0" stopOpacity="0.2"/>
          </radialGradient>
        </defs>
        {/* Right cloud cluster */}
        <g filter="url(#sc1)" opacity="0.85">
          <ellipse cx="1160" cy="110" rx="230" ry="90" fill="url(#cg1)"/>
          <ellipse cx="1290" cy="82"  rx="175" ry="75" fill="url(#cg1)"/>
          <ellipse cx="1065" cy="132" rx="155" ry="62" fill="url(#cg2)"/>
          <ellipse cx="1350" cy="118" rx="115" ry="50" fill="url(#cg1)"/>
        </g>
        {/* Left cloud cluster */}
        <g filter="url(#sc1)" opacity="0.80">
          <ellipse cx="175"  cy="125" rx="210" ry="86" fill="url(#cg1)"/>
          <ellipse cx="295"  cy="94"  rx="165" ry="70" fill="url(#cg1)"/>
          <ellipse cx="88"   cy="145" rx="135" ry="58" fill="url(#cg2)"/>
        </g>
        {/* Wispy mid clouds */}
        <g filter="url(#sc2)" opacity="0.45">
          <ellipse cx="560" cy="68"  rx="125" ry="40" fill="#e8f5fd"/>
          <ellipse cx="710" cy="52"  rx="105" ry="34" fill="#f0f9ff"/>
          <ellipse cx="840" cy="82"  rx="95"  ry="32" fill="#e8f5fd"/>
        </g>
        {/* Warm horizon glow */}
        <ellipse cx="720" cy="850" rx="650" ry="130" fill="#f5e6d3" opacity="0.4" filter="url(#sc2)"/>
        {/* Tiny birds */}
        <g fill="none" stroke="#7fb8d8" strokeWidth="1.3" opacity="0.45">
          <path d="M420 168 Q425 163 430 168 Q435 163 440 168"/>
          <path d="M390 182 Q394 178 398 182 Q402 178 406 182"/>
          <path d="M970 145 Q975 140 980 145 Q985 140 990 145"/>
          <path d="M945 162 Q949 158 953 162 Q957 158 961 162"/>
        </g>
      </svg>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen text-foreground flex flex-col font-serif relative">
      <SkyBackground />

      {/* Header */}
      <header className="fixed top-0 w-full z-50" style={{
        background: "rgba(255,255,255,0.42)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.65)"
      }}>
        <div className="container mx-auto px-4 h-18 flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full overflow-hidden flex items-center justify-center shadow-sm"
              style={{ width: 46, height: 46, background: "rgba(255,255,255,0.75)", border: "1.5px solid #c8e0f0" }}>
              <img src="/logo.png" alt="سُحُب" style={{ width: 40, height: 40, objectFit: "contain" }}/>
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none" style={{ color: "#4a8fb5" }}>سُحُب</h1>
              <p className="text-xs mt-0.5" style={{ color: "#8bbfd8" }}>سُحُبٌ في سماء التجويد</p>
            </div>
          </div>
          <div className="flex items-center gap-3 ui-sans">
            <Link href="/sign-in" className="font-medium px-4 py-1.5 rounded-full transition-colors"
              style={{ color: "#4a8fb5", border: "1.5px solid #a8d4ec", background: "rgba(255,255,255,0.6)" }}>
              تسجيل الدخول
            </Link>
            <Link href="/apply">
              <Button className="rounded-full font-medium shadow-md"
                style={{ background: "linear-gradient(135deg,#5aaad0,#83c8e8)", border: "none" }}>
                انضمي إلينا
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              {/* Logo — hero size with glow */}
              <div className="relative mb-6" style={{ width: 140, height: 140 }}>
                <div className="absolute inset-0 rounded-full"
                  style={{ background: "radial-gradient(circle,rgba(145,204,235,0.4) 0%,transparent 70%)", transform: "scale(1.45)" }}/>
                <div className="rounded-full overflow-hidden flex items-center justify-center w-full h-full shadow-xl"
                  style={{ background: "rgba(255,255,255,0.72)", border: "2px solid rgba(200,224,240,0.85)", backdropFilter: "blur(6px)" }}>
                  <img src="/logo.png" alt="سُحُب" style={{ width: 118, height: 118, objectFit: "contain" }}/>
                </div>
              </div>

              <h2 className="text-6xl md:text-7xl font-bold mb-3 leading-tight" style={{ color: "#3a7fa8" }}>
                سُحُب
              </h2>
              <p className="text-xl md:text-2xl mb-10" style={{ color: "#6aaece", fontFamily: "'Amiri', serif" }}>
                سُحُبٌ في سماء التجويد
              </p>

              <div className="flex items-center justify-center gap-4 ui-sans">
                <Link href="/apply">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg"
                    style={{ background: "linear-gradient(135deg,#5aaad0,#83c8e8)", border: "none" }}>
                    سجلي طلب انضمام
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full"
                    style={{ color: "#4a8fb5", borderColor: "#a8d4ec", background: "rgba(255,255,255,0.65)" }}>
                    دخول الطالبات
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 border-y" style={{ background: "rgba(255,255,255,0.55)", borderColor: "rgba(200,224,240,0.5)" }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#3a7fa8" }}>ما يميز منصتنا</h3>
              <p className="text-lg font-serif max-w-2xl mx-auto" style={{ color: "#6aaece" }}>
                صممت هذه المنصة لتكون بيئة داعمة ومحفزة لتعلم كتاب الله، تجمع بين الأصالة في العلم والحداثة في العرض.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: BookOpen,    title: "تعليم نظري متين",  desc: "التركيز على فهم أحكام التجويد وقواعده العلمية بأسلوب واضح ومنظم." },
                { icon: Users,       title: "متابعة جماعية",     desc: "جلسات متابعة مشتركة تُعزز روح الانتماء والتشجيع المتبادل بين الطالبات." },
                { icon: PlayCircle,  title: "تدريب صوتي",        desc: "تسجيل واحد لكل درس للتدرب العملي وتثبيت الأحكام المدروسة." },
                { icon: Heart,       title: "بيئة نسائية",       desc: "مساحة آمنة ومريحة تتيح للطالبة التعلم براحة وطمأنينة." },
                { icon: Star,        title: "مستويات إتقان",     desc: "نظام تتبع يوضح مدى استيعابك لكل حكم تجويدي وتقدمك في الدورة." },
                { icon: Award,       title: "شهادات إتمام",      desc: "توثيق لرحلتك التعليمية عند إتمام كل مستوى بنجاح." },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                  style={{ border: "1px solid rgba(200,224,240,0.6)" }}
                >
                  <div className="h-14 w-14 rounded-xl flex items-center justify-center mb-6"
                    style={{ background: "rgba(90,170,208,0.12)" }}>
                    <feature.icon className="h-7 w-7" style={{ color: "#5aaad0" }}/>
                  </div>
                  <h4 className="text-xl font-bold mb-3" style={{ color: "#3a7fa8" }}>{feature.title}</h4>
                  <p className="font-serif" style={{ color: "#6aaece" }}>{feature.desc}</p>
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
                <h3 className="text-4xl font-bold mb-6" style={{ color: "#3a7fa8" }}>رحلة التعلم</h3>
                <p className="text-xl mb-8 leading-relaxed font-serif" style={{ color: "#5aaad0" }}>
                  نقدم مستويين دراسيين متدرجين، لنأخذ بيدك من البداية وحتى التلاوة المتقنة التي ترضين عنها.
                </p>
                <div className="space-y-6">
                  {[
                    { n: "1", title: "المستوى الأول: التأسيس",
                      desc: "دراسة مخارج الحروف وصفاتها، وأحكام النون الساكنة والتنوين والميم الساكنة — مع تسجيل تدريبي لكل درس لتثبيت الأحكام." },
                    { n: "2", title: "المستوى الثاني: الإتقان",
                      desc: "دراسة أحكام المدود، والوقف والابتداء، والتفخيم والترقيق — مع متابعة جماعية لمراجعة ما تعلمته ودعمك حتى الإتقان." },
                  ].map(({ n, title, desc }) => (
                    <div key={n} className="flex gap-4 p-6 rounded-2xl bg-white"
                      style={{ border: "1px solid rgba(200,224,240,0.6)" }}>
                      <div className="font-bold text-5xl" style={{ color: "#83c8e8" }}>{n}</div>
                      <div>
                        <h4 className="text-2xl font-bold mb-2" style={{ color: "#3a7fa8" }}>{title}</h4>
                        <p className="font-serif" style={{ color: "#6aaece" }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="aspect-square max-w-md mx-auto rounded-full flex items-center justify-center relative overflow-hidden"
                  style={{ background: "rgba(144,204,235,0.12)", border: "2px solid rgba(144,204,235,0.3)" }}>
                  <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: "radial-gradient(#91cceb 1px, transparent 1px)", backgroundSize: "20px 20px" }}/>
                  <img src="/logo.png" alt="سُحُب" className="w-56 h-56 object-contain opacity-30"/>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#5aaad0,#83c8e8)" }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)", backgroundSize: "40px 40px" }}/>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">هل أنتِ مستعدة للبدء؟</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto font-serif" style={{ color: "rgba(255,255,255,0.88)" }}>
              المقاعد محدودة لضمان جودة التعلم والمتابعة. سجلي طلب انضمامك الآن وسنتواصل معك قريباً.
            </p>
            <Link href="/apply">
              <Button size="lg" className="h-16 px-10 text-xl rounded-full shadow-lg ui-sans"
                style={{ background: "white", color: "#4a8fb5", border: "none" }}>
                تقديم طلب الالتحاق
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 text-center ui-sans"
        style={{ background: "rgba(255,255,255,0.55)", borderColor: "rgba(200,224,240,0.5)" }}>
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="rounded-full overflow-hidden"
              style={{ width: 32, height: 32, background: "rgba(255,255,255,0.8)", border: "1px solid #c8e0f0" }}>
              <img src="/logo.png" alt="سُحُب" style={{ width: 32, height: 32, objectFit: "contain" }}/>
            </div>
            <span className="text-xl font-bold font-serif" style={{ color: "#4a8fb5" }}>سُحُب</span>
          </div>
          <p className="mb-2 font-serif" style={{ color: "#8bbfd8" }}>سُحُبٌ في سماء التجويد</p>
          <p className="text-sm" style={{ color: "#a8d4ec" }}>
            &copy; {new Date().getFullYear()} جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
}
