import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreateApplication } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ApplyPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createApplication = useCreateApplication();
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    desiredLevel: "1",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createApplication.mutate({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        desiredLevel: parseInt(formData.desiredLevel),
        message: formData.message || undefined
      }
    }, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
      onError: () => {
        toast({
          title: "حدث خطأ",
          description: "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-card border border-border p-8 rounded-2xl shadow-sm text-center"
        >
          <div className="h-20 w-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold text-primary mb-4 font-serif">تم إرسال طلبك بنجاح</h2>
          <p className="text-muted-foreground mb-8 font-serif leading-relaxed">
            شكرًا لاهتمامك بالانضمام إلى نور التجويد. تمت مراجعة طلبك وسنتواصل معك قريبًا عبر البريد الإلكتروني.
          </p>
          <Link href="/">
            <Button className="w-full ui-sans">
              العودة للرئيسية
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-serif">
      <header className="h-20 border-b border-border bg-card flex items-center px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <ArrowRight className="h-5 w-5" />
          <span className="font-bold text-lg ui-sans">العودة</span>
        </Link>
      </header>
      
      <main className="flex-1 py-12 px-4 flex items-center justify-center">
        <div className="max-w-xl w-full">
          <div className="text-center mb-10">
            <img src="/logo.svg" alt="نور التجويد" className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-primary mb-4">طلب التحاق</h1>
            <p className="text-muted-foreground text-lg">أكملي النموذج أدناه لطلب الانضمام إلى الدورة القادمة.</p>
          </div>

          <div className="bg-card border border-border p-6 md:p-8 rounded-2xl shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6 ui-sans">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">الاسم الثلاثي</Label>
                <Input 
                  id="name" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">البريد الإلكتروني</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-12 text-left" dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base">رقم الهاتف (اختياري)</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="h-12 text-left" dir="ltr"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base">المستوى المطلوب</Label>
                <RadioGroup 
                  value={formData.desiredLevel} 
                  onValueChange={(val) => setFormData({...formData, desiredLevel: val})}
                  className="gap-4"
                >
                  <div className="flex items-center gap-3 border border-border p-4 rounded-xl cursor-pointer hover:bg-muted/50" onClick={() => setFormData({...formData, desiredLevel: "1"})}>
                    <RadioGroupItem value="1" id="level-1" />
                    <Label htmlFor="level-1" className="cursor-pointer font-serif flex-1">
                      <span className="block font-bold text-primary mb-1">المستوى الأول: التأسيس</span>
                      <span className="block text-sm text-muted-foreground">للمبتدئات ومن ترغب في مراجعة الأساسيات</span>
                    </Label>
                  </div>
                  <div className="flex items-center gap-3 border border-border p-4 rounded-xl cursor-pointer hover:bg-muted/50" onClick={() => setFormData({...formData, desiredLevel: "2"})}>
                    <RadioGroupItem value="2" id="level-2" />
                    <Label htmlFor="level-2" className="cursor-pointer font-serif flex-1">
                      <span className="block font-bold text-primary mb-1">المستوى الثاني: الإتقان</span>
                      <span className="block text-sm text-muted-foreground">لمن تتقن الأساسيات وترغب في التعمق وتصحيح التلاوة</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-base">رسالة قصيرة (نبذة عن مستواك الحالي)</Label>
                <Textarea 
                  id="message" 
                  rows={4} 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="resize-none"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg mt-8" 
                disabled={createApplication.isPending}
              >
                {createApplication.isPending ? "جاري الإرسال..." : "إرسال الطلب"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
