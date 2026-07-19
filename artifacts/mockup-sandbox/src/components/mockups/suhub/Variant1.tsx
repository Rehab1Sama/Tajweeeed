// نمط ١ — فجر السماء: أزرق فاتح ناعم، غيوم بيضاء شفافة
export function Variant1() {
  return (
    <div className="min-h-screen font-sans" dir="rtl" style={{ background: "linear-gradient(180deg, #e8f4fd 0%, #c9e8f8 30%, #a8d8f0 60%, #87c3e8 100%)", fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}>
      {/* Clouds SVG background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg viewBox="0 0 1440 560" preserveAspectRatio="xMidYMid slice" className="absolute top-0 left-0 w-full h-full opacity-60">
          <ellipse cx="200" cy="120" rx="180" ry="80" fill="white" opacity="0.7"/>
          <ellipse cx="280" cy="100" rx="140" ry="65" fill="white" opacity="0.8"/>
          <ellipse cx="130" cy="130" rx="110" ry="50" fill="white" opacity="0.6"/>
          <ellipse cx="900" cy="80" rx="200" ry="85" fill="white" opacity="0.65"/>
          <ellipse cx="990" cy="60" rx="150" ry="70" fill="white" opacity="0.75"/>
          <ellipse cx="820" cy="95" rx="120" ry="55" fill="white" opacity="0.55"/>
          <ellipse cx="1300" cy="150" rx="160" ry="70" fill="white" opacity="0.6"/>
          <ellipse cx="550" cy="200" rx="130" ry="55" fill="white" opacity="0.4"/>
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4" style={{ background: "rgba(255,255,255,0.35)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.5)" }}>
        <div className="flex items-center gap-3">
          <img src="/suhub-logo.png" alt="سُحُب" className="h-12 w-12 object-contain" />
          <div>
            <h1 className="text-2xl font-bold leading-none" style={{ color: "#1a6ba8", fontFamily: "'Amiri', serif" }}>سُحُب</h1>
            <p className="text-xs mt-0.5" style={{ color: "#4a9cc7" }}>سُحُبٌ في سماء التجويد</p>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <button className="text-sm px-4 py-1.5 rounded-full" style={{ color: "#1a6ba8", border: "1px solid #1a6ba8" }}>تسجيل الدخول</button>
          <button className="text-sm px-4 py-1.5 rounded-full text-white" style={{ background: "#1a6ba8" }}>انضمي إلينا</button>
        </nav>
      </header>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
        <img src="/suhub-logo.png" alt="سُحُب" className="h-28 w-28 object-contain mb-6 drop-shadow-lg" />
        <h2 className="text-5xl font-bold mb-3" style={{ color: "#0d4f80", fontFamily: "'Amiri', serif" }}>سُحُب</h2>
        <p className="text-xl mb-2" style={{ color: "#1a6ba8", fontFamily: "'Amiri', serif" }}>سُحُبٌ في سماء التجويد</p>
        <p className="text-base mb-8 max-w-lg" style={{ color: "#2a7ab8" }}>رتّلي القرآن كما أُنزل، مع معلمات متخصصات في بيئة نسائية آمنة</p>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 rounded-full text-white font-medium shadow-md" style={{ background: "#1a6ba8" }}>سجلي طلب انضمام</button>
          <button className="px-6 py-2.5 rounded-full font-medium" style={{ color: "#1a6ba8", background: "rgba(255,255,255,0.7)", border: "1px solid #1a6ba8" }}>دخول الطالبات</button>
        </div>
      </div>

      {/* Label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.7)", color: "#1a6ba8" }}>نمط ١ — فجر السماء</div>
    </div>
  );
}
