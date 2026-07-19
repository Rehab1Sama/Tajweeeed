// نمط ٣ — ضوء الغيم (محدّث): ألوان باستيل، سماء مرسومة، بدون الجملة الوصفية
export function Variant3() {
  return (
    <div className="min-h-screen font-sans relative overflow-hidden" dir="rtl"
      style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}>

      {/* ── Sky background: pastel painted sky ── */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #b8d8f0 0%, #cce5f7 18%, #ddf0fb 38%, #eef8fd 58%, #f5f0e8 82%, #ecdfd0 100%)"
      }}/>

      {/* Painted clouds layer — soft, impressionistic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice"
          className="absolute top-0 left-0 w-full h-full">
          <defs>
            <filter id="softCloud" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="18" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
            <filter id="cloudBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="10"/>
            </filter>
            <radialGradient id="c1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95"/>
              <stop offset="100%" stopColor="#daeefa" stopOpacity="0.3"/>
            </radialGradient>
            <radialGradient id="c2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f0f8ff" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#c5dff0" stopOpacity="0.2"/>
            </radialGradient>
          </defs>

          {/* Large cloud cluster — right */}
          <g filter="url(#softCloud)" opacity="0.85">
            <ellipse cx="1140" cy="105" rx="220" ry="85" fill="url(#c1)"/>
            <ellipse cx="1260" cy="80"  rx="170" ry="72" fill="url(#c1)"/>
            <ellipse cx="1060" cy="125" rx="150" ry="60" fill="url(#c2)"/>
            <ellipse cx="1330" cy="115" rx="110" ry="48" fill="url(#c1)"/>
          </g>

          {/* Large cloud cluster — left */}
          <g filter="url(#softCloud)" opacity="0.80">
            <ellipse cx="180"  cy="120" rx="200" ry="82" fill="url(#c1)"/>
            <ellipse cx="290"  cy="90"  rx="160" ry="68" fill="url(#c1)"/>
            <ellipse cx="90"   cy="140" rx="130" ry="55" fill="url(#c2)"/>
          </g>

          {/* Small wispy clouds — middle */}
          <g filter="url(#cloudBlur)" opacity="0.5">
            <ellipse cx="560" cy="65"  rx="120" ry="38" fill="#e8f5fd"/>
            <ellipse cx="700" cy="50"  rx="100" ry="32" fill="#f0f9ff"/>
            <ellipse cx="820" cy="80"  rx="90"  ry="30" fill="#e8f5fd"/>
          </g>

          {/* Horizon glow — warm pastel */}
          <ellipse cx="720" cy="560" rx="600" ry="120" fill="#f5e6d3" opacity="0.45" filter="url(#cloudBlur)"/>

          {/* Tiny birds */}
          <g fill="#7fb8d8" opacity="0.5">
            <path d="M420 160 Q424 156 428 160 Q432 156 436 160" strokeWidth="1.2" stroke="#7fb8d8" fill="none"/>
            <path d="M390 175 Q393 172 396 175 Q399 172 402 175" strokeWidth="1"   stroke="#7fb8d8" fill="none"/>
            <path d="M960 140 Q964 136 968 140 Q972 136 976 140" strokeWidth="1.2" stroke="#7fb8d8" fill="none"/>
          </g>
        </svg>
      </div>

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-8 py-3"
        style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.65)" }}>
        <div className="flex items-center gap-3">
          {/* Logo: circular frame with soft shadow */}
          <div className="rounded-full overflow-hidden flex items-center justify-center shadow-sm"
            style={{ width: 48, height: 48, background: "rgba(255,255,255,0.7)", border: "1.5px solid #c8e0f0" }}>
            <img src="/suhub-logo.png" alt="سُحُب"
              style={{ width: 42, height: 42, objectFit: "contain" }}/>
          </div>
          <div>
            <h1 style={{ color: "#4a8fb5", fontFamily: "'Amiri', serif", fontSize: "1.4rem", fontWeight: 700, lineHeight: 1 }}>سُحُب</h1>
            <p style={{ color: "#8bbfd8", fontSize: "0.7rem", marginTop: 2 }}>سُحُبٌ في سماء التجويد</p>
          </div>
        </div>
        <nav className="flex items-center gap-3">
          <button style={{ fontSize: "0.82rem", padding: "6px 18px", borderRadius: 99, color: "#4a8fb5", border: "1.5px solid #a8d4ec", background: "rgba(255,255,255,0.6)" }}>
            تسجيل الدخول
          </button>
          <button style={{ fontSize: "0.82rem", padding: "6px 18px", borderRadius: 99, color: "white", background: "linear-gradient(135deg, #6db3d8, #91cceb)", boxShadow: "0 2px 10px #91cceb88" }}>
            انضمي إلينا
          </button>
        </nav>
      </header>

      {/* ── Hero ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-14 pb-16">

        {/* Logo — larger, with soft glow ring */}
        <div className="relative mb-5" style={{ width: 130, height: 130 }}>
          <div className="absolute inset-0 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(145,204,235,0.35) 0%, transparent 70%)", transform: "scale(1.4)" }}/>
          <div className="rounded-full overflow-hidden flex items-center justify-center w-full h-full shadow-lg"
            style={{ background: "rgba(255,255,255,0.65)", border: "2px solid rgba(200,224,240,0.8)", backdropFilter: "blur(6px)" }}>
            <img src="/suhub-logo.png" alt="سُحُب"
              style={{ width: 110, height: 110, objectFit: "contain" }}/>
          </div>
        </div>

        <h2 style={{ color: "#3a7fa8", fontFamily: "'Amiri', serif", fontSize: "3.2rem", fontWeight: 700, marginBottom: "0.4rem" }}>
          سُحُب
        </h2>
        <p style={{ color: "#6aaece", fontFamily: "'Amiri', serif", fontSize: "1.2rem", marginBottom: "2rem" }}>
          سُحُبٌ في سماء التجويد
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button style={{ padding: "10px 28px", borderRadius: 99, color: "white", fontFamily: "'Amiri', serif", fontSize: "1rem", background: "linear-gradient(135deg, #5aaad0, #83c8e8)", boxShadow: "0 4px 18px rgba(90,170,208,0.35)" }}>
            سجلي طلب انضمام
          </button>
          <button style={{ padding: "10px 28px", borderRadius: 99, color: "#4a8fb5", fontFamily: "'Amiri', serif", fontSize: "1rem", background: "rgba(255,255,255,0.7)", border: "1.5px solid #b4d9ef", boxShadow: "0 2px 10px rgba(145,204,235,0.2)" }}>
            دخول الطالبات
          </button>
        </div>
      </div>
    </div>
  );
}
