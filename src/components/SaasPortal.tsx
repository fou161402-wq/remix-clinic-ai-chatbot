import React, { useState } from "react";
import { 
  Bot, 
  User, 
  Stethoscope, 
  Plus, 
  Trash, 
  Upload, 
  Send, 
  DollarSign, 
  ClipboardList, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare,
  TrendingUp,
  Sparkles, 
  Clock, 
  Phone, 
  MapPin, 
  Save, 
  HelpCircle, 
  ShieldCheck, 
  Heart, 
  FileText, 
  Sliders, 
  Check, 
  ChevronLeft, 
  X, 
  Lock, 
  Mail, 
  Building, 
  CreditCard, 
  ArrowRight 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SaasTenant } from "../types";

interface SaasPortalProps {
  tenants: SaasTenant[];
  onLogin: (email: string, pass: string) => boolean;
  onSignUp: (
    email: string,
    pass: string,
    docName: string,
    clinicName: string,
    specialty: string,
    phone: string,
    address: string,
    planId: "free" | "starter" | "pro"
  ) => boolean;
  onViewClinic: (tenantId: string) => void;
  saasView: "landing" | "login" | "signup" | "checkout";
  setSaasView: (view: "landing" | "login" | "signup" | "checkout") => void;
  checkoutPlanId: "free" | "starter" | "pro";
  setCheckoutPlanId: (plan: "free" | "starter" | "pro") => void;
  showNotification: (message: string, type?: "success" | "error" | "info") => void;
}

export default function SaasPortal({
  tenants,
  onLogin,
  onSignUp,
  onViewClinic,
  saasView,
  setSaasView,
  checkoutPlanId,
  setCheckoutPlanId,
  showNotification
}: SaasPortalProps) {
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Sign Up Form States
  const [signupName, setSignupName] = useState("");
  const [signupClinic, setSignupClinic] = useState("");
  const [signupSpecialty, setSignupSpecialty] = useState("طب وجراحة الأسنان والتجميل");
  const [customSpecialty, setCustomSpecialty] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupAddress, setSignupAddress] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // ROI Calculator States
  const [missedPatients, setMissedPatients] = useState(25);
  const [averagePrice, setAveragePrice] = useState(2500);

  // Chatbot Tryout State
  const [tryoutInput, setTryoutInput] = useState("");
  const [tryoutLoading, setTryoutLoading] = useState(false);
  const [tryoutMessages, setTryoutMessages] = useState<any[]>([
    {
      id: "try-1",
      sender: "bot",
      text: "أهلاً بك في العرض التجريبي المباشر لـ شافي! 🦷\nأنا الآن محاكي لعيادة الأسنان المعتمدة. يمكنك طرح أي سؤال عن أسعار زراعة وتجميل الأسنان، أوقات العمل، أو كتابة 'حجز موعد لفحص' لترى كيف أتعامل مع بيانات الحجز بذكاء واحترافية!",
      timestamp: new Date()
    }
  ]);
  const [parsedPatientName, setParsedPatientName] = useState<string | null>(null);
  const [parsedPatientPhone, setParsedPatientPhone] = useState<string | null>(null);
  const [parsedService, setParsedService] = useState<string | null>(null);
  const [sentimentTag, setSentimentTag] = useState<string>("satisfied");

  // Credit Card Checkout States
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [cardType, setCardType] = useState<"edahabia" | "cib" | "visa">("edahabia");

  // ROI Calculation formulas
  const calculatedSavings = Math.round(missedPatients * averagePrice * 0.8);
  const hoursSaved = Math.round(missedPatients * 45 / 60);

  // Dentist Specialty Presets for Sign Up dropdown
  const specialties = [
    "طب وجراحة الأسنان والتجميل",
    "الجلدية، الليزر وتجميل البشرة",
    "طب الأطفال، التطعيمات، والطب العام",
    "الطب النفسي والاستشارات الأسرية",
    "العلاج الطبيعي والطب الرياضي",
    "طب وجراحة العيون والليكك",
    "أخرى (تحديد تخصص يدوي...)"
  ];

  // Tryout Chatbot Action Chips
  const actionChips = [
    { label: "🦷 كم تكلفة زراعة السن؟", query: "كم تكلفة زراعة السن الألماني لديكم؟" },
    { label: "📍 موقع العيادة وساعات العمل", query: "ما هو عنوان عيادة الأسنان وأوقات عملها؟" },
    { label: "📅 أريد حجز موعد باسم محمد الفاضل وهاتفي 0500123456", query: "أريد حجز موعد لتنظيف الأسنان باسم محمد الفاضل ورقمي 0500123456" }
  ];

  // Handle live chat submission in Sandbox demo
  const handleTryoutSubmit = async (queryText: string) => {
    const textToSend = queryText || tryoutInput;
    if (!textToSend.trim()) return;

    setTryoutInput("");
    const newMsgs = [...tryoutMessages, { id: `try-u-${Date.now()}`, sender: "user", text: textToSend, timestamp: new Date() }];
    setTryoutMessages(newMsgs);
    setTryoutLoading(true);

    // Auto Parse logic for the visual doctor sandbox screen
    if (textToSend.includes("محمد") || textToSend.includes("أحمد") || textToSend.includes("خالد")) {
      const match = textToSend.match(/(?:باسم|اسمي)\s+([\u0600-\u06FF\s]+?)(?:\s+ورقمي|\s+وجوالي|$)/);
      setParsedPatientName(match ? match[1].trim() : "محمد الفاضل");
    }
    if (textToSend.match(/05\d{8}/)) {
      const match = textToSend.match(/05\d{8}/);
      setParsedPatientPhone(match ? match[0] : "0500123456");
    }
    if (textToSend.includes("تنظيف") || textToSend.includes("كشف") || textToSend.includes("زراعة")) {
      setParsedService(textToSend.includes("زراعة") ? "زراعة أسنان" : textToSend.includes("تنظيف") ? "تنظيف وإزالة جير" : "استشارة أولية");
    }

    // Set simulated sentiment
    if (textToSend.includes("غالي") || textToSend.includes("ألم") || textToSend.includes("مشكلة")) {
      setSentimentTag("concerned");
    } else {
      setSentimentTag("satisfied");
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: newMsgs.slice(-5).map(m => ({
            role: m.sender === "user" ? "user" : "model",
            parts: [{ text: m.text }]
          })),
          clinicInfo: {
            name: "عيادة دنتال كير لطب الأسنان",
            specialty: "طب وجراحة الأسنان والتجميل",
            phone: "+213 550 12 34 56",
            address: "الجزائر العاصمة، شارع ديدوش مراد، عمارة السلام، الطابق الثاني"
          },
          dailyStatus: "اليوم الطبيب متواجد من الساعة 08:30 صباحاً وحتى 16:30 زوالاً. يوجد ازدحام طفيف في فترة المساء، وننصح بالحضور قبل الموعد بـ 15 دقيقة لتأكيد الحجز.",
          services: [
            { id: "d-1", name: "تنظيف الأسنان وإزالة الجير", description: "جلسة تنظيف عميق لتلميع الأسنان وإزالة التصبغات والترسبات الجيرية باستخدام الأمواج فوق الصوتية.", price: "3000 دج" },
            { id: "d-4", name: "زراعة الأسنان الألمانية", description: "زراعة الأسنان المفقودة بأحدث التقنيات وبنسبة نجاح تفوق 98% شاملة التلبيسة الزركونية.", price: "35000 دج" }
          ],
          guidelines: [
            { id: "dg-1", title: "تعليمات ما قبل زراعة الأسنان", content: "يرجى تناول وجبة خفيفة قبل المجيء بساعتين. يرجى تجنب مميعات الدم مثل الأسبرين قبل 3 أيام من الموعد بالتنسيق مع طبيبك المعالج." }
          ],
          quickActions: []
        })
      });

      const data = await response.json();
      setTryoutMessages(prev => [...prev, {
        id: `try-b-${Date.now()}`,
        sender: "bot",
        text: data.response || "مرحباً! نتشرف بخدمتك في عيادتنا.",
        timestamp: new Date()
      }]);
    } catch (e) {
      // Fallback
      setTryoutMessages(prev => [...prev, {
        id: `try-b-err-${Date.now()}`,
        sender: "bot",
        text: "تكلفة زراعة السن الألماني لدينا هي 35000 دج فقط بأحدث التقنيات وتحت إشراف استشاري الزراعة. هل ترغب بحجز موعد للفحص المجاني؟",
        timestamp: new Date()
      }]);
    } finally {
      setTryoutLoading(false);
    }
  };

  // Preseeded logins helper for doctors
  const preseededDoctors = [
    { name: "عيادة طب الأسنان", email: "doctor.dental@shafi.ai", spec: "طب وجراحة الأسنان والتجميل", color: "from-teal-500 to-cyan-400" },
    { name: "عيادة الجلدية والتجميل", email: "doctor.derma@shafi.ai", spec: "الجلدية والليزر", color: "from-purple-500 to-pink-500" },
    { name: "عيادة طب الأطفال", email: "doctor.pediatrics@shafi.ai", spec: "طب الأطفال واللقاحات", color: "from-amber-500 to-orange-500" }
  ];

  // Submit payment form
  const handleCheckoutPay = () => {
    if (!cardHolder || !cardNumber || !cardExpiry || !cardCvv) {
      alert("يرجى ملء جميع حقول بطاقة الدفع! 💳");
      return;
    }
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaySuccess(true);
      setTimeout(() => {
        // Trigger actual signUp callback
        onSignUp(
          signupEmail,
          signupPassword,
          signupName,
          signupClinic,
          signupSpecialty === "أخرى (تحديد تخصص يدوي...)" ? customSpecialty : signupSpecialty,
          signupPhone,
          signupAddress,
          checkoutPlanId
        );
      }, 2000);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col relative overflow-hidden" dir="rtl">
      
      {/* Background Lights */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[160px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] -z-10 pointer-events-none" />

      {/* 🚀 TOP NAVIGATION NAVBAR */}
      <nav className="bg-slate-900/60 backdrop-blur-md border-b border-slate-850 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSaasView("landing")}>
          <div className="bg-gradient-to-tr from-teal-500 to-cyan-400 p-2 rounded-xl text-slate-950 shadow-lg shadow-teal-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-100 tracking-tight">شافي الذكي</span>
              <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold">
                SaaS للمؤسسات الطبية
              </span>
            </div>
            <p className="text-[10px] text-slate-400">المنصة الأولى لأتمتة عيادات العالم العربي بالذكاء الاصطناعي</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saasView === "landing" ? (
            <>
              <button 
                onClick={() => setSaasView("login")} 
                className="text-slate-300 hover:text-white text-sm font-semibold transition-all px-4 py-2 hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                تسجيل الدخول كطبيب 🔑
              </button>
              <button 
                onClick={() => setSaasView("signup")} 
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all cursor-pointer"
              >
                تفعيل حساب العيادة مجاناً 🚀
              </button>
            </>
          ) : (
            <button 
              onClick={() => setSaasView("landing")} 
              className="text-slate-300 hover:text-white text-sm font-semibold transition-all px-4 py-2 hover:bg-slate-800 rounded-xl cursor-pointer flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للرئيسية</span>
            </button>
          )}
        </div>
      </nav>

      {/* 🔮 VIEW ROUTER CONTENT */}
      <main className="flex-1">
        
        {/* VIEW 1: SAAS LANDING PAGE */}
        {saasView === "landing" && (
          <div className="space-y-24 py-16 px-6 max-w-7xl mx-auto">
            
            {/* HERO HERO SECTION */}
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full shadow-inner">
                <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-300">أول منصة SaaS عربية لأتمتة ردود وحجوزات العيادات عبر شبكات التواصل بالذكاء الاصطناعي</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight">
                رد آلي وحجز مواعيد لعيادتك عبر <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400">وسائل التواصل الاجتماعي</span> 🧬
              </h1>
              
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto">
                تم تصميم نظام شافي خصيصاً لربط الشات بوت الذكي بحسابات عيادتك الرسمية على شبكات التواصل الاجتماعي (واتساب الأعمال، فيسبوك ماسنجر، إنستغرام، وتيليجرام). يجيب المساعد فورياً بدقة تامة عن خدماتك، أسعارك، وإرشاداتك الطبية، ويقوم بجدولة وتأكيد مواعيد المرضى تلقائياً بالكامل على مدار الساعة!
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                <button 
                  onClick={() => setSaasView("signup")}
                  className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-teal-500/10 hover:shadow-teal-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <span>سجل عيادتك الآن (تجربة 14 يوماً مجاناً)</span>
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-all" />
                </button>
                <a 
                  href="#sandbox" 
                  className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-base px-8 py-4 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>تجربة الديمو الحي للشات بوت</span>
                  <Bot className="w-5 h-5 text-cyan-400" />
                </a>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-10">
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl">
                  <span className="block text-2xl font-bold text-teal-400">24/7</span>
                  <span className="text-xs text-slate-400 mt-1 block">استجابة ورد فوري للمرضى</span>
                </div>
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl">
                  <span className="block text-2xl font-bold text-cyan-400">85%</span>
                  <span className="text-xs text-slate-400 mt-1 block">توفير في تكلفة الرد الإداري</span>
                </div>
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl">
                  <span className="block text-2xl font-bold text-emerald-400">100%</span>
                  <span className="text-xs text-slate-400 mt-1 block">أمن وسرية بيانات المرضى</span>
                </div>
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl">
                  <span className="block text-2xl font-bold text-purple-400">صفر %</span>
                  <span className="text-xs text-slate-400 mt-1 block">أخطاء في تسريب المواعيد</span>
                </div>
              </div>
            </div>

            {/* 🛠️ INTERACTIVE TRIAL PLAYGROUND (SANDBOX) */}
            <div id="sandbox" className="space-y-10 scroll-mt-24">
              <div className="text-center space-y-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">تجربة تفاعلية مباشرة كطبيب ومريض 🔍</h2>
                <p className="text-sm text-slate-400 max-w-2xl mx-auto">
                  تحدث مع مساعد عيادة الأسنان على اليمين وشاهد كيف تقوم منصة شافي على اليسار بتحليل محادثة المريض، استخلاص الاسم والهاتف، وصياغة حجز منظم فورياً!
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
                {/* Visual Doctor Control Monitor */}
                <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl shadow-slate-950/50">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-teal-400" />
                        <h3 className="font-bold text-sm text-slate-100">مراقب نظام شافي للعيادات</h3>
                      </div>
                      <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full font-bold">
                        تحديث تلقائي حي
                      </span>
                    </div>

                    {/* Parser values */}
                    <div className="space-y-4">
                      <div className="bg-slate-950 p-4 rounded-2xl space-y-3">
                        <span className="text-[10px] text-slate-400 font-semibold block">بيانات العيادة المستهدفة:</span>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-300">عيادة دنتال كير لطب الأسنان</span>
                          <span className="bg-slate-900 px-2 py-1 rounded text-teal-400 font-semibold">dental</span>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-2xl space-y-3">
                        <span className="text-[10px] text-slate-400 font-semibold block">مستخلص البيانات التلقائي (الذكاء الاصطناعي):</span>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center border-b border-slate-900 py-1.5">
                            <span className="text-slate-400">اسم المريض المستخلص:</span>
                            <span className={`font-bold ${parsedPatientName ? "text-teal-400" : "text-slate-600"}`}>
                              {parsedPatientName || "بانتظار الاسم في الشات..."}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center border-b border-slate-900 py-1.5">
                            <span className="text-slate-400">رقم الهاتف المستخلص:</span>
                            <span className={`font-mono font-bold ${parsedPatientPhone ? "text-cyan-400" : "text-slate-600"}`}>
                              {parsedPatientPhone || "بانتظار رقم الهاتف..."}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center py-1.5">
                            <span className="text-slate-400">الخدمة المطلوبة:</span>
                            <span className={`font-bold ${parsedService ? "text-emerald-400" : "text-slate-600"}`}>
                              {parsedService || "بانتظار تحديد نوع العلاج..."}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Emotion monitor */}
                      <div className="bg-slate-950 p-4 rounded-2xl space-y-3">
                        <span className="text-[10px] text-slate-400 font-semibold block">رصد مشاعر المريض (Sentiment Analysis):</span>
                        <div className="flex items-center gap-3">
                          <span className={`inline-block w-3 h-3 rounded-full ${sentimentTag === "satisfied" ? "bg-emerald-500" : "bg-amber-500"} animate-pulse`} />
                          <span className="text-xs font-bold text-slate-300">
                            {sentimentTag === "satisfied" ? "مرتاح ومستعد للحجز 😊" : "قلق أو يستفسر عن الآلام / التكلفة ⚠️"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-800 text-center">
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      هذا التحليل يتم لحظياً في الخلفية ويتم ترحيل البيانات فوراً لجدول المواعيد الخاص ببروفايل طبيب الأسنان المعتمد.
                    </p>
                  </div>
                </div>

                {/* Patient Chat Simulator */}
                <div className="lg:col-span-7 bg-slate-950 border border-slate-850 rounded-3xl h-[580px] flex flex-col overflow-hidden shadow-2xl relative">
                  
                  {/* Chat top header */}
                  <div className="bg-slate-900 px-4 py-3 border-b border-slate-850 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="bg-teal-500/10 p-2 rounded-xl text-teal-400">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-200">شات بوت عيادة الأسنان التجريبي</h4>
                        <p className="text-[9px] text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                          <span>متصل حالياً بالذكاء الاصطناعي</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message body */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {tryoutMessages.map((m) => (
                      <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                          m.sender === "user" 
                            ? "bg-gradient-to-tr from-teal-600 to-cyan-600 text-white rounded-br-none" 
                            : "bg-slate-900 text-slate-200 rounded-bl-none border border-slate-800/60"
                        }`}>
                          <p className="whitespace-pre-line">{m.text}</p>
                        </div>
                      </div>
                    ))}
                    {tryoutLoading && (
                      <div className="flex justify-start">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none p-3.5 flex items-center gap-2">
                          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tryout action chips */}
                  <div className="px-4 py-2 border-t border-slate-850 bg-slate-900/30 flex gap-2 overflow-x-auto shrink-0 select-none scrollbar-none">
                    {actionChips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleTryoutSubmit(chip.query)}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-full text-[10px] whitespace-nowrap cursor-pointer transition-all"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  {/* Input form */}
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleTryoutSubmit(""); }}
                    className="p-3 border-t border-slate-850 bg-slate-900 flex items-center gap-2 shrink-0"
                  >
                    <input
                      type="text"
                      value={tryoutInput}
                      onChange={(e) => setTryoutInput(e.target.value)}
                      placeholder="اسأل الشات بوت التجريبي عن زراعة الأسنان أو الحجز..."
                      className="flex-1 bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={tryoutLoading}
                      className="bg-teal-500 hover:bg-teal-400 text-slate-950 p-2.5 rounded-xl cursor-pointer transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* 📈 ROI CALCULATOR SECTION */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-850 rounded-3xl p-8 max-w-4xl mx-auto space-y-8 relative shadow-2xl">
              <div className="absolute top-4 left-4 text-emerald-400 animate-pulse">
                <TrendingUp className="w-8 h-8 opacity-40" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                  <span>احسب العائد الاستثماري لعيادتك مع شافي 📉</span>
                </h2>
                <p className="text-xs text-slate-400 leading-normal">
                  كم من المال تفقد شهرياً بسبب تأخر الموظفين في الرد على اتصالات المرضى واستفسارات الحجز بعد ساعات الدوام؟
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
                {/* Sliders */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">عدد المرضى الضائعين شهرياً (بسبب تأخر الرد):</span>
                      <span className="text-teal-400 font-mono text-sm bg-teal-500/10 px-2 py-0.5 rounded">{missedPatients} مريض</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={missedPatients}
                      onChange={(e) => setMissedPatients(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>5 مرضى</span>
                      <span>100 مريض</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">متوسط سعر الكشف أو العلاج المستهدف:</span>
                      <span className="text-cyan-400 font-mono text-sm bg-cyan-500/10 px-2 py-0.5 rounded">{averagePrice} د.ج</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="20000"
                      step="250"
                      value={averagePrice}
                      onChange={(e) => setAveragePrice(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>500 د.ج</span>
                      <span>20,000 د.ج</span>
                    </div>
                  </div>
                </div>

                {/* ROI Output Card */}
                <div className="bg-slate-950 rounded-2xl p-6 border border-slate-850 flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-4 text-center md:text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">الأرباح الإضافية المستعادة شهرياً:</span>
                      <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 tracking-tight block mt-1">
                        +{calculatedSavings.toLocaleString()} د.ج
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">ساعات العمل الإداري الموفرة لفريقك:</span>
                      <span className="text-xl font-bold text-cyan-400 block mt-0.5">
                        {hoursSaved} ساعة شهرياً
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      هذا يعني استرداد قيمة الاشتراك السنوي في باقة "الانطلاق" خلال أقل من <span className="font-bold text-teal-400">3 أيام فقط</span> من العمل الفعلي للشات بوت!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 💎 SAAS SUBSCRIPTION PRICING PLANS */}
            <div className="space-y-12">
              <div className="text-center space-y-3" dir="rtl">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">باقات الاشتراك والتشغيل 💳</h2>
                <p className="text-sm text-slate-400 max-w-2xl mx-auto">
                  اختر الباقة المناسبة لعيادتك، وابدأ بتحقيق الاستجابة الفورية لمرضاك. تتوفر فترة تجريبية مجانية لجميع الباقات.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch" dir="rtl">
                
                {/* Plan 1: Free Trial */}
                <div className="bg-slate-900/80 border border-slate-850 hover:border-slate-800 rounded-3xl p-6 flex flex-col justify-between transition-all relative">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg text-slate-100">الباقة التجريبية</h3>
                      <p className="text-xs text-slate-400">مثالية للعيادات الصغيرة أو اختبار الخدمة</p>
                    </div>

                    <div className="border-t border-b border-slate-800 py-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-100">0</span>
                      <span className="text-xs text-slate-400">د.ج / 14 يوماً</span>
                    </div>

                    <ul className="space-y-3 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>الحد الأقصى لجدولة المواعيد: 10 حجوزات</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>شات بوت مدمج على موقع العيادة</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>تخصيص كامل للخدمات والأطباء</span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-500 line-through">
                        <span>الربط مع الواتساب وتليجرام</span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-500 line-through">
                        <span>تحليلات ذكية واستقصاء مشاعر المرضى</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => {
                        setCheckoutPlanId("free");
                        setSaasView("signup");
                      }}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      ابدأ الفترة التجريبية مجاناً
                    </button>
                  </div>
                </div>

                {/* Plan 2: Starter (Most Popular) */}
                <div className="bg-slate-900 border-2 border-teal-500 rounded-3xl p-6 flex flex-col justify-between transition-all relative shadow-2xl shadow-teal-500/5">
                  <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 bg-teal-500 text-slate-950 font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-wider">
                    الأكثر طلباً وملاءمة 🔥
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg text-slate-100">باقة الانطلاق (Starter)</h3>
                      <p className="text-xs text-slate-400">مثالية للعيادات الفردية والمجمعات الطبية المتنامية</p>
                    </div>

                    <div className="border-t border-b border-slate-800 py-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">4,500</span>
                      <span className="text-xs text-slate-400">د.ج / شهرياً</span>
                    </div>

                    <ul className="space-y-3 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span className="font-semibold text-slate-100">الحد الأقصى لجدولة المواعيد: 100 حجز شهرياً</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>تكامل مع شات بوت ذكي مبرمج بالكامل</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>تقارير شهرية وإحصائيات الحجوزات</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>أدوات استيراد الخدمات عبر Excel/CSV</span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-500 line-through">
                        <span>الربط المباشر مع حساب واتساب العيادة</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => {
                        setCheckoutPlanId("starter");
                        setSaasView("signup");
                      }}
                      className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black py-3 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-teal-500/10"
                    >
                      اشترك الآن وجرب مجاناً
                    </button>
                  </div>
                </div>

                {/* Plan 3: Pro */}
                <div className="bg-slate-900/80 border border-slate-850 hover:border-slate-800 rounded-3xl p-6 flex flex-col justify-between transition-all relative">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg text-slate-100">الباقة الاحترافية (Pro)</h3>
                      <p className="text-xs text-slate-400">للمجمعات والمراكز الطبية الكبرى والمستشفيات</p>
                    </div>

                    <div className="border-t border-b border-slate-800 py-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-100">9,000</span>
                      <span className="text-xs text-slate-400">د.ج / شهرياً</span>
                    </div>

                    <ul className="space-y-3 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span className="font-semibold text-slate-100">حجوزات مواعيد غير محدودة مطلقاً</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>لوحة CRM متقدمة لاستقصاء رضا المرضى تلقائياً</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span className="font-semibold text-teal-400">الربط المباشر بواتساب وتليجرام العيادة 💬</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>أولية الدعم الفني والمتابعة 24/7</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>تحكم كامل في إعدادات حرية ونبرة المساعد الذكي</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => {
                        setCheckoutPlanId("pro");
                        setSaasView("signup");
                      }}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      اشترك الآن وجرب مجاناً
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 🏥 ACTIVE CLINICS SHOWROOM */}
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-extrabold text-slate-100">العيادات المشتركة والنشطة معنا 🌐</h2>
                <p className="text-xs text-slate-400 max-w-2xl mx-auto">
                  يمكنك زيارة المواقع المباشرة لعيادات تجريبية مسجلة مسبقاً وتجربة الحجز فيها كأنك مريض حقيقي، أو الدخول كطبيب تجريبي (Password: 123) لمشاهدة لوحة تحكم CRM الفائقة!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {tenants.map((t) => (
                  <div key={t.id} className="bg-slate-900 border border-slate-850 p-6 rounded-2xl flex flex-col justify-between space-y-6">
                    <div className="space-y-3 text-right">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-gradient-to-tr from-teal-500/10 to-cyan-500/10 p-2 rounded-lg text-teal-400">
                          <Stethoscope className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-200">{t.clinicName}</h4>
                          <span className="text-[10px] bg-slate-950 px-2.5 py-0.5 rounded-full text-slate-400 font-semibold block w-fit mt-1">
                            {t.specialty}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5 text-[10px] text-slate-400 leading-normal">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span className="line-clamp-1">{t.address}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>بإشراف: {t.doctorName}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>الباقة الحالية: {t.subscription.planId === "pro" ? "الاحترافية 💎" : t.subscription.planId === "starter" ? "الانطلاق 🚀" : "التجريبية 🆓"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-slate-800 pt-4">
                      <button
                        onClick={() => onViewClinic(t.id)}
                        className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-bold text-[10px] py-2 px-1 rounded-xl text-center cursor-pointer transition-all flex items-center justify-center gap-1"
                      >
                        <Heart className="w-3.5 h-3.5 text-teal-400" />
                        <span>موقع المريض 🌐</span>
                      </button>
                      <button
                        onClick={() => {
                          setLoginEmail(t.email);
                          setLoginPassword(t.password);
                          setSaasView("login");
                          showNotification("تم ملء بيانات الدخول التجريبية للعيادة بنجاح! 🔑", "info");
                        }}
                        className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[10px] py-2 px-1 rounded-xl text-center cursor-pointer transition-all flex items-center justify-center gap-1"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>دخول الطبيب 🔑</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: DOCTOR SECURE LOGIN */}
        {saasView === "login" && (
          <div className="max-w-md mx-auto py-24 px-6 space-y-8">
            <div className="bg-slate-900 border border-slate-850 rounded-3xl p-8 shadow-2xl relative">
              <div className="text-center space-y-2 mb-8">
                <div className="bg-gradient-to-tr from-teal-500 to-cyan-400 p-3 rounded-2xl text-slate-950 w-fit mx-auto shadow-lg shadow-teal-500/15">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-100">تسجيل دخول بوابة الطبيب</h2>
                <p className="text-xs text-slate-400">أدخل بريدك الإلكتروني والرمز السري لإدارة عيادتك الطبية</p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  onLogin(loginEmail, loginPassword);
                }}
                className="space-y-4 text-right"
              >
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold block">البريد الإلكتروني للعيادة / الطبيب:</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute top-3 right-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="doctor@example.com"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 pl-4 pr-10 text-xs text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold block">كلمة السر الآمنة:</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute top-3 right-3" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 pl-4 pr-10 text-xs text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black py-3 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-teal-500/10 hover:shadow-teal-500/25 mt-4"
                >
                  تسجيل الدخول وإدارة العيادة 🔑
                </button>
              </form>

              {/* Quick Preset login info */}
              <div className="mt-8 border-t border-slate-800 pt-6 space-y-3">
                <span className="text-[10px] text-slate-500 font-bold block text-center">أو دخول سريع لعيادة تجريبية معينة بنقرة واحدة:</span>
                <div className="grid grid-cols-1 gap-2">
                  {preseededDoctors.map((doc, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setLoginEmail(doc.email);
                        setLoginPassword("123");
                      }}
                      className="bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-2.5 rounded-xl text-[10px] text-slate-300 flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${doc.color}`} />
                        <span className="font-bold">{doc.name}</span>
                      </div>
                      <span className="text-slate-500 font-mono text-[9px]">{doc.email} (pass: 123)</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: DOCTOR SIGN UP */}
        {saasView === "signup" && (
          <div className="max-w-lg mx-auto py-16 px-6 space-y-8">
            <div className="bg-slate-900 border border-slate-850 rounded-3xl p-8 shadow-2xl text-right">
              <div className="text-center space-y-2 mb-8">
                <div className="bg-gradient-to-tr from-teal-500 to-cyan-400 p-3 rounded-2xl text-slate-950 w-fit mx-auto shadow-lg shadow-teal-500/15 animate-bounce">
                  <Building className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-100">إنشاء حساب عيادة طبية جديد</h2>
                <p className="text-xs text-slate-400">أدخل معلومات العيادة، واختر الباقة لتفعيل مساعدك الذكي</p>
                <div className="bg-teal-500/10 text-teal-400 border border-teal-500/10 text-[10px] px-3 py-1 rounded-full w-fit mx-auto mt-2 font-bold">
                  أنت تسجل حالياً في باقة: {checkoutPlanId === "pro" ? "الاحترافية 💎" : checkoutPlanId === "starter" ? "الانطلاق 🚀" : "التجريبية مجاناً 🆓"}
                </div>

                {checkoutPlanId === "free" && localStorage.getItem("shafi_free_plan_claimed") === "true" && (
                  <div className="mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-right space-y-2">
                    <p className="text-xs text-rose-400 font-bold">⚠️ تنبيه حظر إساءة الاستخدام (الجهاز مسجل مسبقاً):</p>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      لقد قمت بالفعل بتفعيل الوضع المجاني التجريبي مسبقاً على هذا الهاتف/الجهاز. لمنع التحايل، يرجى الاشتراك في باقة <strong className="text-teal-400">الانطلاق (Starter)</strong> أو باقة <strong className="text-teal-400">الاحترافية (Pro)</strong> لتفعيل حسابك، أو قم بتسجيل الدخول بحسابك السابق.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setCheckoutPlanId("starter");
                        }}
                        className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-teal-500/30 transition-all cursor-pointer"
                      >
                        الترقية لباقة الانطلاق 🚀
                      </button>
                      <button
                        type="button"
                        onClick={() => setSaasView("login")}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-750 transition-all cursor-pointer"
                      >
                        تسجيل الدخول السابق 🔑
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (signupSpecialty === "أخرى (تحديد تخصص يدوي...)" && !customSpecialty.trim()) {
                    showNotification("⚠️ يرجى كتابة التخصص الطبي المخصص في الحقل المخصص له!", "error");
                    return;
                  }
                  if (checkoutPlanId === "free") {
                    const freeClaimed = localStorage.getItem("shafi_free_plan_claimed");
                    if (freeClaimed === "true") {
                      showNotification("⚠️ عذراً، تبيّن أن هذا الجهاز قد فعّل الباقة التجريبية مسبقاً! يرجى اختيار باقة مدفوعة أو تسجيل الدخول.", "error");
                      return;
                    }
                    // Sign up directly for free plan without payment
                    onSignUp(
                      signupEmail,
                      signupPassword,
                      signupName,
                      signupClinic,
                      signupSpecialty === "أخرى (تحديد تخصص يدوي...)" ? customSpecialty : signupSpecialty,
                      signupPhone,
                      signupAddress,
                      "free"
                    );
                  } else {
                    // Send to card checkout simulator
                    setSaasView("checkout");
                  }
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold block">اسم الطبيب أو المسؤول:</label>
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="د. محمد العتيبي"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold block">اسم العيادة الطبي المعتمد:</label>
                    <input
                      type="text"
                      required
                      value={signupClinic}
                      onChange={(e) => setSignupClinic(e.target.value)}
                      placeholder="مستوصف لؤلؤة التخصصي"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold block">التخصص الطبي للعيادة:</label>
                    <select
                      value={signupSpecialty}
                      onChange={(e) => setSignupSpecialty(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none"
                    >
                      {specialties.map((spec, idx) => (
                        <option key={idx} value={spec} className="bg-slate-950">{spec}</option>
                      ))}
                    </select>
                    
                    {signupSpecialty === "أخرى (تحديد تخصص يدوي...)" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2"
                      >
                        <input
                          type="text"
                          required
                          value={customSpecialty}
                          onChange={(e) => setCustomSpecialty(e.target.value)}
                          placeholder="اكتب التخصص الطبي يدوياً هنا (مثال: طب العظام)..."
                          className="w-full bg-slate-950 border border-teal-500/50 focus:border-teal-400 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none placeholder-slate-500"
                        />
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold block">هاتف العيادة (للربط والتواصل):</label>
                    <input
                      type="text"
                      required
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="+213 550 12 34 56"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold block">العنوان الجغرافي للعيادة بالتفصيل:</label>
                  <input
                    type="text"
                    required
                    value={signupAddress}
                    onChange={(e) => setSignupAddress(e.target.value)}
                    placeholder="الجزائر العاصمة، شارع ديدوش مراد، الطابق الثاني"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold block">البريد الإلكتروني للحساب:</label>
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="doctor@shafi.ai"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold block">كلمة السر للحساب:</label>
                    <input
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black py-3 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-teal-500/10 mt-4"
                >
                  {checkoutPlanId === "free" ? "تفعيل حساب العيادة التجريبي فورا 🆓" : "الانتقال لخطوة الدفع والاشتراك الآمن 💳"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW 4: CREDIT CARD SIMULATED CHECKOUT */}
        {saasView === "checkout" && (
          <div className="max-w-lg mx-auto py-16 px-6 space-y-8">
            <div className="bg-slate-900 border border-slate-850 rounded-3xl p-8 shadow-2xl relative text-right space-y-8">
              
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-slate-100">بوابة الدفع الإلكتروني الآمنة 🇩🇿</h2>
                <p className="text-xs text-slate-400">تفعيل الاشتراك الشهري لـ {signupClinic}</p>
                <div className="text-sm font-black text-teal-400 bg-teal-500/10 px-3 py-1.5 rounded-xl w-fit mx-auto mt-2 animate-pulse">
                  المبلغ المستحق: {checkoutPlanId === "starter" ? "4,500 د.ج / شهرياً" : "9,000 د.ج / شهرياً"}
                </div>
              </div>

              {/* Algerian Card Type Selector */}
              <div className="space-y-2 text-right">
                <label className="text-xs text-slate-400 font-bold block">نوع بطاقة الدفع الجزائرية أو الدولية:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCardType("edahabia");
                      setCardHolder("MOHAMED BENALIA");
                    }}
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-all ${
                      cardType === "edahabia"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-sm"
                        : "bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300"
                    }`}
                  >
                    الذهبية 💳
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCardType("cib");
                      setCardHolder("MOHAMED BENALIA");
                    }}
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-all ${
                      cardType === "cib"
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow-sm"
                        : "bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300"
                    }`}
                  >
                    بطاقة CIB 🏦
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCardType("visa");
                      setCardHolder("MOHAMED BENALIA");
                    }}
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-all ${
                      cardType === "visa"
                        ? "bg-teal-500/10 text-teal-400 border-teal-500/40 shadow-sm"
                        : "bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300"
                    }`}
                  >
                    Visa / Master
                  </button>
                </div>
              </div>

              {/* Interactive Virtual Credit Card Graphic with Dynamic Algerian Skin */}
              <div className={`border rounded-2xl p-5 text-right relative overflow-hidden shadow-2xl h-44 flex flex-col justify-between max-w-sm mx-auto select-none transition-all duration-500 ${
                cardType === "edahabia"
                  ? "bg-gradient-to-tr from-amber-700 via-yellow-600 to-amber-900 border-amber-500/30"
                  : cardType === "cib"
                    ? "bg-gradient-to-tr from-cyan-900 via-blue-800 to-cyan-950 border-cyan-500/30"
                    : "bg-gradient-to-tr from-slate-950 to-slate-800 border-slate-750"
              }`}>
                {/* Microchip and Card Brand */}
                <div className="flex justify-between items-center">
                  <div className="bg-black/30 px-2.5 py-1 rounded-lg text-[9px] font-bold text-slate-100 font-mono tracking-wider">
                    {cardType === "edahabia" && "بريد الجزائر / EDAHABIA"}
                    {cardType === "cib" && "نقد بنكي / CIB الجزائر"}
                    {cardType === "visa" && "الائتمان الدولي / VISA"}
                  </div>
                  <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-slate-100" />
                  </div>
                </div>
                
                {/* Card Number */}
                <div className="font-mono text-slate-100 text-sm sm:text-base tracking-widest text-center py-2 bg-black/10 rounded-lg">
                  {cardNumber ? cardNumber.replace(/(\d{4})/g, "$1 ").trim() : "6280 5000 •••• ••••"}
                </div>

                {/* Card Holder and Expiry */}
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-200">
                  <div>
                    <span className="block text-[7px] uppercase text-slate-300">حامل البطاقة</span>
                    <span className="font-sans font-bold uppercase">{cardHolder || "MOHAMED BENALIA"}</span>
                  </div>
                  <div className="text-left">
                    <span className="block text-[7px] uppercase text-slate-300 font-sans">الصلاحية</span>
                    <span className="font-mono font-bold">{cardExpiry || "12/28"}</span>
                  </div>
                </div>
              </div>

              {/* 💸 Payout Channel Explanation Card */}
              <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-2xl text-right space-y-2">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                  توجيه وإيداع الأرباح تلقائياً 💸
                </span>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  <strong>كيف تصب الأرباح في حسابي؟</strong> تصب جميع الاشتراكات والمدفوعات التي يقوم بها مرضاك أو العيادات الفرعية المشتركة معك مباشرة وبشكل آلي في حسابك البريدي الجاري <span className="text-emerald-400 font-bold">CCP الجزائري</span> أو حسابك البنكي <span className="text-emerald-400 font-bold">(RIB)</span> خلال <span className="font-bold text-slate-200">24 إلى 48 ساعة</span> كحد أقصى، مع توفير فواتير وتقارير مالية شفافة تصل لبريدك دورياً.
                </p>
              </div>

              {/* Payment Success Animation */}
              {paySuccess ? (
                <div className="text-center space-y-3 py-6 bg-slate-950/60 rounded-2xl border border-emerald-500/20">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 p-2.5 rounded-full mx-auto animate-bounce flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm">تم الدفع بنجاح! 🎉</h4>
                  <p className="text-xs text-slate-400">جاري تفعيل لوحة تحكم الطبيب وإنشاء الشات بوت المخصص...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold block">الاسم المكتوب على البطاقة:</label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="MOHAMED BENALIA"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 uppercase focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold block">
                      {cardType === "edahabia" ? "رقم بطاقة الذهبية (16 خانة تبدأ بـ 6280):" : "رقم بطاقة الدفع (16 خانة):"}
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder={cardType === "edahabia" ? "6280500012345678" : "4000123456789010"}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold block">تاريخ الانتهاء:</label>
                      <input
                        type="text"
                        maxLength={5}
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold block">رمز التحقق (CVV):</label>
                      <input
                        type="password"
                        maxLength={3}
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                        placeholder="•••"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setSaasView("signup")}
                      className="w-1/3 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      تعديل الحساب
                    </button>
                    <button
                      type="button"
                      onClick={handleCheckoutPay}
                      disabled={isPaying}
                      className="w-2/3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-3 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isPaying ? (
                        <>
                          <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>جاري الدفع بأمان...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>تأكيد الدفع وتفعيل العيادة 🎉</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* 🚀 SAAS FOOTER */}
      <footer className="bg-slate-900/40 border-t border-slate-850 py-12 px-6 text-center text-xs text-slate-500 space-y-4">
        <div className="flex justify-center items-center gap-2">
          <Bot className="w-4 h-4 text-teal-400" />
          <span className="font-bold text-slate-400">شافي الذكي SaaS</span>
        </div>
        <p>جميع الحقوق محفوظة منصة شافي الذكي © 2026. مرخص لخدمة المنشآت الطبية تحت إشراف هيئة الاتصالات والتقنية الطبية.</p>
        <p className="text-[10px] text-slate-600">مدعوم بالكامل بنماذج Google Gemini API المتطورة لحصر المعرفة وحماية المرضى.</p>
      </footer>

    </div>
  );
}
