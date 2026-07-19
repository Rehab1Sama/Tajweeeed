// نمط ٢ — سماء النهار: أزرق ملكي زاهي، غيوم ثلاثية الأبعاد، عصري
export function Variant2() {
  return (
    <div className="min-h-screen font-sans relative overflow-hidden" dir="rtl" style={{ background: "linear-gradient(160deg, #1565c0 0%, #1976d2 25%, #42a5f5 60%, #90caf9 100%)", fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}>
      {/* Clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg viewBox="0 0 1440 560" preserveAspectRatio="xMidYMid slice" className="absolute top-0 left-0 w-full h-full">
          <ellipse cx="150" cy="100" rx="200" ry="90" fill="white" opacity="0.9"/>
          <ellipse cx="230" cy="75" rx="160" ry="75" fill="white" opacity="0.95"/>
          <ellipse cx="90" cy="115" rx="120" ry="55" fill="white" opacity="0.8"/>
          <ellipse cx="1000" cy="90" rx="220" ry="95" fill="white" opacity="0.85"/>
          <ellipse cx="1100" cy="65" rx="160" ry="75" fill="white" opacity="0.9"/>
          <ellipse cx="930" cy="110" rx="130" ry="60" fill="white" opacity="0.75"/>
          <ellipse cx="600" cy="420" rx="250" ry="80" fill="white" opacity="0.15"/>
          <ellipse cx="1350" cy="300" rx="180" ry="65" fill="white" opacity="0.2"/>
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4" style={{ background: "rgba(21,101,192,0.4)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.25)" }}>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
            <img src="/suhub-logo.png" alt="سُحُب" className="h-10 w-10 object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-none text-white" style={{ fontFamily: "'Amiri', serif" }}>سُحُب</h1>
            <p className="text-xs mt-0.5" style={{ color: "#bbdefb" }}>سُحُبٌ في سماء التجويد</p>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <button className="text-sm px-4 py-1.5 rounded-full text-white" style={{ border: "1px solid rgba(255,255,255,0.6)" }}>تسجيل الدخول</button>
          <button className="text-sm px-4 py-1.5 rounded-full font-medium" style={{ background: "white", color: "#1565c0" }}>انضمي إلينا</button>
        </nav>
      </header>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-16">
        <div className="h-32 w-32 rounded-full flex items-center justify-center mb-6 shadow-2xl" style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(12px)", border: "2px solid rgba(255,255,255,0.4)" }}>
          <img src="/suhub-logo.png" alt="سُحُب" className="h-24 w-24 object-contain" />
        </div>
        <h2 className="text-5xl font-bold mb-3 text-white" style={{ fontFamily: "'Amiri', serif", textShadow: "0 2px 20px rgba(0,0,0,0.2)" }}>سُحُب</h2>
        <p className="text-xl mb-2" style={{ color: "#e3f2fd", fontFamily: "'Amiri', serif" }}>سُحُبٌ في سماء التجويد</p>
        <p className="text-base mb-8 max-w-lg" style={{ color: "#bbdefb" }}>رتّلي القرآن كما أُنزل، مع معلمات متخصصات في بيئة نسائية آمنة</p>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 rounded-full font-medium shadow-lg" style={{ background: "white", color: "#1565c0" }}>سجلي طلب انضمام</button>
          <button className="px-6 py-2.5 rounded-full font-medium text-white" style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.5)", backdropFilter: "blur(8px)" }}>دخول الطالبات</button>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>نمط ٢ — سماء النهار</div>
    </div>
  );
}
