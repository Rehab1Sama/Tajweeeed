// نمط ٣ — ضوء الغيم: خلفية بيضاء نقية، تفاصيل زرقاء سماوية، نظيف وأنيق
export function Variant3() {
  return (
    <div className="min-h-screen font-sans relative overflow-hidden" dir="rtl" style={{ background: "#f0f8ff", fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}>
      {/* Subtle cloud pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg viewBox="0 0 1440 560" preserveAspectRatio="xMidYMid slice" className="absolute top-0 left-0 w-full h-full opacity-30">
          <ellipse cx="200" cy="140" rx="200" ry="90" fill="#5bb3e8"/>
          <ellipse cx="290" cy="110" rx="160" ry="75" fill="#7ec8f0"/>
          <ellipse cx="120" cy="155" rx="120" ry="55" fill="#5bb3e8"/>
          <ellipse cx="950" cy="100" rx="220" ry="95" fill="#5bb3e8"/>
          <ellipse cx="1050" cy="75" rx="160" ry="75" fill="#7ec8f0"/>
          <ellipse cx="880" cy="120" rx="130" ry="58" fill="#5bb3e8"/>
          <ellipse cx="560" cy="480" rx="300" ry="70" fill="#7ec8f0" opacity="0.4"/>
          <ellipse cx="1400" cy="400" rx="200" ry="60" fill="#7ec8f0" opacity="0.3"/>
        </svg>
        {/* Gradient wash at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48" style={{ background: "linear-gradient(0deg, #d0ebfa 0%, transparent 100%)" }}/>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4 bg-white shadow-sm" style={{ borderBottom: "2px solid #deeefa" }}>
        <div className="flex items-center gap-3">
          <img src="/suhub-logo.png" alt="سُحُب" className="h-12 w-12 object-contain" />
          <div>
            <h1 className="text-2xl font-bold leading-none" style={{ color: "#1976d2", fontFamily: "'Amiri', serif" }}>سُحُب</h1>
            <p className="text-xs mt-0.5" style={{ color: "#64b5f6" }}>سُحُبٌ في سماء التجويد</p>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <button className="text-sm px-4 py-1.5 rounded-lg" style={{ color: "#1976d2", border: "1.5px solid #90caf9" }}>تسجيل الدخول</button>
          <button className="text-sm px-4 py-1.5 rounded-lg text-white shadow-md" style={{ background: "linear-gradient(135deg, #1976d2, #42a5f5)" }}>انضمي إلينا</button>
        </nav>
      </header>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-16">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full blur-2xl opacity-30" style={{ background: "#42a5f5", transform: "scale(1.3)" }}/>
          <img src="/suhub-logo.png" alt="سُحُب" className="relative h-32 w-32 object-contain drop-shadow-xl" />
        </div>
        <h2 className="text-5xl font-bold mb-3" style={{ color: "#0d47a1", fontFamily: "'Amiri', serif" }}>سُحُب</h2>
        <p className="text-xl mb-2" style={{ color: "#1976d2", fontFamily: "'Amiri', serif" }}>سُحُبٌ في سماء التجويد</p>
        <p className="text-base mb-8 max-w-lg" style={{ color: "#455a64" }}>رتّلي القرآن كما أُنزل، مع معلمات متخصصات في بيئة نسائية آمنة</p>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 rounded-lg text-white font-medium shadow-lg" style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}>سجلي طلب انضمام</button>
          <button className="px-6 py-2.5 rounded-lg font-medium" style={{ color: "#1976d2", background: "white", border: "1.5px solid #90caf9", boxShadow: "0 2px 8px rgba(25,118,210,0.1)" }}>دخول الطالبات</button>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full" style={{ background: "white", color: "#1976d2", border: "1px solid #90caf9" }}>نمط ٣ — ضوء الغيم</div>
    </div>
  );
}
