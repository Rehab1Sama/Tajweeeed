export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">الصفحة غير موجودة</h2>
      <p className="text-muted-foreground mb-8">عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
      <a href="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
        العودة للرئيسية
      </a>
    </div>
  );
}
