import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Star, Users, Award, PlayCircle, Heart } from "lucide-react";

/* ─── Cloud-shaped card ─────────────────────────────────────────── */
function CloudCard({
  children,
  style,
  className = "",
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  const bg = "rgba(255,255,255,0.88)";
  return (
    <div
      className={`relative ${className}`}
      style={{ filter: "drop-shadow(0 6px 18px rgba(90,170,208,0.18))", paddingTop: 28, ...style }}
    >
      {/* Three cloud bumps at the top */}
      <div className="absolute rounded-full" style={{ background: bg, width: "46%", height: 48, top: 0, left: "8%" }} />
      <div className="absolute rounded-full" style={{ background: bg, width: "32%", height: 38, top: 6,  left: "44%" }} />
      <div className="absolute rounded-full" style={{ background: bg, width: "22%", height: 30, top: 2,  left: "70%" }} />
      {/* Body */}
      <div className="rounded-3xl relative z-10" style={{ background: bg, padding: "26px 26px 30px" }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Animated sky background ───────────────────────────────────── */
function SkyBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient — cool blues only */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #9ecce8 0%, #bce0f5 22%, #d4edfb 48%, #e6f5fd 72%, #f2faff 100%)"
      }} />

      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
        className="absolute top-0 left-0 w-full h-full">
        <defs>
          <filter id="blur18" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="18"/></filter>
          <filter id="blur10" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10"/></filter>
          <filter id="blur6"  x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="6"/></filter>
          <radialGradient id="cg1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96"/>
            <stop offset="100%" stopColor="#d0eaf8" stopOpacity="0.22"/>
          </radialGradient>
          <radialGradient id="cg2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#edf7ff" stopOpacity="0.92"/>
            <stop offset="100%" stopColor="#b8dcf0" stopOpacity="0.18"/>
          </radialGradient>
          <radialGradient id="cg3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85"/>
            <stop offset="100%" stopColor="#c8e5f5" stopOpacity="0.15"/>
          </radialGradient>
        </defs>

        {/* ── Row 1: top clouds ── */}
        <g filter="url(#blur18)" opacity="0.88">
          <ellipse cx="1180" cy="105" rx="240" ry="92"  fill="url(#cg1)"/>
          <ellipse cx="1320" cy="76"  rx="180" ry="76"  fill="url(#cg1)"/>
          <ellipse cx="1075" cy="130" rx="160" ry="64"  fill="url(#cg2)"/>
          <ellipse cx="1370" cy="118" rx="118" ry="52"  fill="url(#cg1)"/>
        </g>
        <g filter="url(#blur18)" opacity="0.82">
          <ellipse cx="165"  cy="118" rx="220" ry="88"  fill="url(#cg1)"/>
          <ellipse cx="295"  cy="86"  rx="170" ry="72"  fill="url(#cg1)"/>
          <ellipse cx="75"   cy="140" rx="138" ry="58"  fill="url(#cg2)"/>
          <ellipse cx="380"  cy="108" rx="100" ry="44"  fill="url(#cg3)"/>
        </g>
        {/* Wispy mid top */}
        <g filter="url(#blur10)" opacity="0.48">
          <ellipse cx="570"  cy="62"  rx="130" ry="42"  fill="#e4f4fd"/>
          <ellipse cx="720"  cy="46"  rx="108" ry="34"  fill="#eef9ff"/>
          <ellipse cx="855"  cy="78"  rx="96"  ry="32"  fill="#e4f4fd"/>
        </g>

        {/* ── Row 2: mid-page clouds ── */}
        <g filter="url(#blur18)" opacity="0.60">
          <ellipse cx="80"   cy="420" rx="195" ry="78"  fill="url(#cg1)"/>
          <ellipse cx="220"  cy="392" rx="148" ry="62"  fill="url(#cg2)"/>
          <ellipse cx="-20"  cy="440" rx="120" ry="52"  fill="url(#cg3)"/>
        </g>
        <g filter="url(#blur18)" opacity="0.55">
          <ellipse cx="1360" cy="400" rx="185" ry="74"  fill="url(#cg1)"/>
          <ellipse cx="1240" cy="375" rx="140" ry="60"  fill="url(#cg2)"/>
          <ellipse cx="1460" cy="420" rx="110" ry="48"  fill="url(#cg3)"/>
        </g>
        <g filter="url(#blur10)" opacity="0.38">
          <ellipse cx="680"  cy="350" rx="120" ry="38"  fill="#ddf0fb"/>
          <ellipse cx="820"  cy="338" rx="95"  ry="30"  fill="#eaf6fd"/>
          <ellipse cx="560"  cy="368" rx="80"  ry="28"  fill="#ddf0fb"/>
        </g>

        {/* ── Row 3: lower clouds ── */}
        <g filter="url(#blur18)" opacity="0.50">
          <ellipse cx="300"  cy="700" rx="210" ry="82"  fill="url(#cg1)"/>
          <ellipse cx="460"  cy="672" rx="158" ry="66"  fill="url(#cg2)"/>
          <ellipse cx="180"  cy="720" rx="130" ry="54"  fill="url(#cg3)"/>
        </g>
        <g filter="url(#blur18)" opacity="0.48">
          <ellipse cx="1140" cy="680" rx="200" ry="80"  fill="url(#cg1)"/>
          <ellipse cx="1280" cy="656" rx="152" ry="64"  fill="url(#cg2)"/>
          <ellipse cx="1400" cy="700" rx="115" ry="50"  fill="url(#cg3)"/>
        </g>
        <g filter="url(#blur10)" opacity="0.32">
          <ellipse cx="700"  cy="660" rx="125" ry="40"  fill="#d8eefa"/>
          <ellipse cx="840"  cy="645" rx="98"  ry="32"  fill="#e6f5fd"/>
        </g>

        {/* ── Cool horizon glow ── */}
        <ellipse cx="720" cy="870" rx="680" ry="120" fill="#b8def5" opacity="0.20" filter="url(#blur18)"/>

        {/* ── Tiny birds ── */}
        <g fill="none" stroke="#7fb8d8" strokeWidth="1.3" opacity="0.42">
          <path d="M425 165 Q430 160 435 165 Q440 160 445 165"/>
          <path d="M395 180 Q399 176 403 180 Q407 176 411 180"/>
          <path d="M972 142 Q977 137 982 142 Q987 137 992 142"/>
          <path d="M948 160 Q952 156 956 160 Q960 156 964 160"/>
          <path d="M640 330 Q644 326 648 330 Q652 326 656 330"/>
          <path d="M618 344 Q621 341 624 344 Q627 341 630 344"/>
        </g>
      </svg>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
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

        {/* ── Hero ── */}
        <section className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
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

        {/* ── Features — cloud cards ── */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#3a7fa8" }}>ما يميز منصتنا</h3>
              <p className="text-lg font-serif max-w-2xl mx-auto" style={{ color: "#6aaece" }}>
                صممت هذه المنصة لتكون بيئة داعمة ومحفزة لتعلم كتاب الله، تجمع بين الأصالة في العلم والحداثة في العرض.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
              {[
                { icon: BookOpen,   title: "تعليم نظري متين",  desc: "التركيز على فهم أحكام التجويد وقواعده العلمية بأسلوب واضح ومنظم." },
                { icon: Users,      title: "متابعة جماعية",    desc: "جلسات متابعة مشتركة تُعزز روح الانتماء والتشجيع المتبادل بين الطالبات." },
                { icon: PlayCircle, title: "تدريب صوتي",       desc: "تسجيل واحد لكل درس للتدرب العملي وتثبيت الأحكام المدروسة." },
                { icon: Heart,      title: "بيئة نسائية",      desc: "مساحة آمنة ومريحة تتيح للطالبة التعلم براحة وطمأنينة." },
                { icon: Star,       title: "مستويات إتقان",    desc: "نظام تتبع يوضح مدى استيعابك لكل حكم تجويدي وتقدمك في الدورة." },
                { icon: Award,      title: "شهادات إتمام",     desc: "توثيق لرحلتك التعليمية عند إتمام كل مستوى بنجاح." },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <CloudCard>
                    <div className="h-14 w-14 rounded-full flex items-center justify-center mb-5"
                      style={{ background: "rgba(90,170,208,0.12)" }}>
                      <feature.icon className="h-7 w-7" style={{ color: "#5aaad0" }}/>
                    </div>
                    <h4 className="text-xl font-bold mb-3" style={{ color: "#3a7fa8" }}>{feature.title}</h4>
                    <p className="font-serif leading-relaxed" style={{ color: "#6aaece" }}>{feature.desc}</p>
                  </CloudCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Levels — cloud cards ── */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h3 className="text-4xl font-bold mb-4 text-center" style={{ color: "#3a7fa8" }}>رحلة التعلم</h3>
            <p className="text-xl mb-12 text-center leading-relaxed font-serif" style={{ color: "#5aaad0" }}>
              نقدم مستويين دراسيين متدرجين، لنأخذ بيدك من البداية وحتى التلاوة المتقنة.
            </p>

            <div className="space-y-14">
              {[
                { n: "١", title: "المستوى الأول: التأسيس",
                  desc: "دراسة مخارج الحروف وصفاتها، وأحكام النون الساكنة والتنوين والميم الساكنة — مع تسجيل تدريبي لكل درس لتثبيت الأحكام." },
                { n: "٢", title: "المستوى الثاني: الإتقان",
                  desc: "دراسة أحكام المدود، والوقف والابتداء، والتفخيم والترقيق — مع متابعة جماعية لمراجعة ما تعلمته ودعمك حتى الإتقان." },
              ].map(({ n, title, desc }, i) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                >
                  <CloudCard>
                    <div className="flex gap-5 items-start">
                      <div className="font-bold text-5xl shrink-0 leading-none mt-1" style={{ color: "#83c8e8" }}>{n}</div>
                      <div>
                        <h4 className="text-2xl font-bold mb-2" style={{ color: "#3a7fa8" }}>{title}</h4>
                        <p className="font-serif leading-relaxed" style={{ color: "#6aaece" }}>{desc}</p>
                      </div>
                    </div>
                  </CloudCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 text-center relative overflow-hidden mt-8"
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
        style={{ background: "rgba(200,232,250,0.22)", borderColor: "rgba(180,218,240,0.45)" }}>
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
