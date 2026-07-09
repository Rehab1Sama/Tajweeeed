import { useListCertificates } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function Certificates() {
  const { data: certificates, isLoading } = useListCertificates();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-primary mb-2">شهاداتي وإنجازاتي</h1>
        <p className="text-muted-foreground font-serif">توثيق لرحلتك التعليمية وما أتممته من مستويات.</p>
      </header>

      {certificates && certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id} className="overflow-hidden border-border group">
              <div className="h-32 bg-primary/10 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(hsl(41 65% 47%) 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                <Award className="h-16 w-16 text-primary relative z-10" strokeWidth={1} />
                {/* Decorative corners */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary m-2" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary m-2" />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-primary mb-2">{cert.course?.title}</h3>
                <div className="flex items-center justify-center gap-2 text-muted-foreground ui-sans text-sm mb-6">
                  <Calendar className="h-4 w-4" />
                  تاريخ الإصدار: {format(new Date(cert.issuedAt), 'd MMMM yyyy', { locale: ar })}
                </div>
                
                {cert.certificateUrl ? (
                  <Button variant="outline" className="w-full ui-sans group-hover:bg-primary group-hover:text-primary-foreground transition-colors" onClick={() => window.open(cert.certificateUrl || '', '_blank')}>
                    <Download className="h-4 w-4 ml-2" />
                    تحميل الشهادة
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="w-full ui-sans">
                    الشهادة قيد التجهيز
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card border border-border rounded-2xl flex flex-col items-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <Award className="h-12 w-12 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">لا توجد شهادات بعد</h3>
          <p className="text-muted-foreground max-w-md mx-auto font-serif">
            ستظهر شهاداتك هنا بمجرد إتمامك لمتطلبات الدورة واجتياز التقييمات بنجاح. استمري في سعيك!
          </p>
        </div>
      )}
    </div>
  );
}
