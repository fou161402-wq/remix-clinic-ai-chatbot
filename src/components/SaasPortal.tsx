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
  ChevronRight,
  X, 
  Lock, 
  Mail, 
  Building, 
  CreditCard, 
  ArrowRight,
  ArrowLeft,
  Search,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SaasTenant } from "../types";

const saasTranslations = {
  ar: {
    dir: "rtl",
    brand: "شافي SaaS 🌐",
    tagline: "أول منصة SaaS عربية لأتمتة ردود وحجوزات العيادات عبر شبكات التواصل بالذكاء الاصطناعي",
    heroTitle: "رد آلي وحجز مواعيد لعيادتك عبر وسائل التواصل الاجتماعي 🧬",
    heroDesc: "تم تصميم نظام شافي خصيصاً لربط الشات بوت الذكي بحسابات عيادتك الرسمية على شبكات التواصل الاجتماعي (واتساب الأعمال، فيسبوك ماسنجر، إنستغرام، وتيليجرام). يجيب المساعد فورياً بدقة تامة عن خدماتك، أسعارك، وإرشاداتك الطبية، ويقوم بجدولة وتأكيد مواعيد المرضى تلقائياً بالكامل على مدار الساعة!",
    registerNow: "سجل عيادتك الآن (تجربة 14 يوماً مجاناً)",
    tryDemo: "تجربة الديمو الحي للشات بوت",
    loginDoctorBtn: "تسجيل الدخول كطبيب 🔑",
    signupClinicBtn: "تفعيل حساب العيادة مجاناً 🚀",
    backToHome: "العودة للرئيسية",
    
    // Stats
    stat1Title: "24/7",
    stat1Desc: "استجابة ورد فوري للمرضى",
    stat2Title: "85%",
    stat2Desc: "توفير في تكلفة الرد الإداري",
    stat3Title: "100%",
    stat3Desc: "أمن وسرية بيانات المرضى",
    stat4Title: "0%",
    stat4Desc: "أخطاء في تسريب المواعيد",

    // Playground
    playgroundTitle: "تجربة تفاعلية مباشرة كطبيب ومريض 🔍",
    playgroundDesc: "تحدث مع مساعد عيادة الأسنان على اليمين وشاهد كيف تقوم منصة شافي على اليسار بتحليل محادثة المريض، استخلاص الاسم والهاتف، وصياغة حجز منظم فورياً!",
    monitorTitle: "مراقب نظام شافي للعيادات",
    liveUpdate: "تحديث تلقائي حي",
    targetClinicData: "بيانات العيادة المستهدفة:",
    dentalClinicName: "عيادة دنتال كير لطب الأسنان",
    aiExtractor: "مستخلص البيانات التلقائي (الذكاء الاصطناعي):",
    patientName: "اسم المريض المستخلص:",
    patientPhone: "رقم الهاتف المستخلص:",
    requiredService: "الخدمة المطلوبة:",
    waitingName: "بانتظار الاسم في الشات...",
    waitingPhone: "بانتظار رقم الهاتف...",
    waitingService: "بانتظار تحديد نوع العلاج...",
    sentimentAnalysis: "رصد مشاعر المريض (Sentiment Analysis):",
    sentimentSatisfied: "مرتاح ومستعد للحجز 😊",
    sentimentConcerned: "قلق أو يستفسر عن الآلام / التكلفة ⚠️",
    playgroundFooter: "هذا التحليل يتم لحظياً في الخلفية ويتم ترحيل البيانات فوراً لجدول المواعيد الخاص ببروفايل طبيب الأسنان المعتمد.",
    botHeaderTitle: "شات بوت عيادة الأسنان التجريبي",
    botHeaderStatus: "متصل حالياً بالذكاء الاصطناعي",
    botInputPlaceholder: "اسأل الشات بوت التجريبي عن زراعة الأسنان أو الحجز...",

    // ROI
    roiTitle: "احسب العائد الاستثماري لعيادتك مع شافي 📉",
    roiDesc: "كم من المال تفقد شهرياً بسبب تأخر الموظفين في الرد على اتصالات المرضى واستفسارات الحجز بعد ساعات الدوام؟",
    missedPatientsLabel: "عدد المرضى الضائعين شهرياً (بسبب تأخر الرد):",
    missedPatientsUnit: "مريض",
    missedPatientsMin: "5 مرضى",
    missedPatientsMax: "100 مريض",
    avgPriceLabel: "متوسط سعر الكشف أو العلاج المستهدف:",
    avgPriceUnit: "د.ج",
    avgPriceMin: "500 د.ج",
    avgPriceMax: "20,000 د.ج",
    lostRevenueLabel: "الإيرادات الشهرية المفقودة حالياً:",
    lostRevenueDesc: "هذه القيمة تفقدها عيادتك شهرياً بسبب عدم توفر رد تلقائي فوري خارج أوقات العمل الرسمية.",
    shafiSavingsTitle: "قيمة الوفورات المالية المستردة مع شافي:",
    shafiSavingsDesc: "بفرض نجاح الشات بوت في استعادة 80% من المرضى المستفسرين وجدولة مواعيدهم تلقائياً.",
    hoursSavedTitle: "عدد ساعات العمل الإداري الموفرة شهرياً:",
    hoursSavedDesc: "بمعدل 45 دقيقة يوفرها الذكاء الاصطناعي في الرد الفردي، التحقق، وتأكيد موعد كل مريض.",
    roiCalculationNote: "هذا يعني استرداد قيمة الاشتراك السنوي في باقة \"الانطلاق\" خلال أقل من 3 أيام فقط من العمل الفعلي للشات بوت!",

    // Pricing
    pricingTitle: "باقات الاشتراك والتشغيل 💳",
    pricingDesc: "اختر الباقة المناسبة لعيادتك، وابدأ بتحقيق الاستجابة الفورية لمرضاك. تتوفر فترة تجريبية مجانية لجميع الباقات.",
    freePlatformLabel: "المنصة مجانية بالكامل وغير محدودة للطبيب للحجوزات والدردشة الداخلية! الباقات والرسائل أدناه مخصصة فقط لربط التنبيهات عبر قنوات الرسائل القصيرة/الواتساب/التليجرام خارج المنصة.",
    planTrialTitle: "الباقة التجريبية",
    planTrialSubtitle: "مثالية للعيادات الصغيرة أو اختبار الخدمة",
    planTrialPrice: "0",
    planTrialPeriod: "د.ج / 14 يوماً",
    planTrialFeat1: "الحد الأقصى لجدولة المواعيد: 10 حجوزات",
    planTrialFeat2: "شات بوت مدمج على موقع العيادة",
    planTrialFeat3: "تخصيص كامل للخدمات والأطباء",
    planTrialFeat4: "الربط بـ (واتساب، تليجرام، فيسبوك، وإنستغرام) 🌐",
    planTrialFeat5: "تحليلات ذكية واستقصاء مشاعر المرضى",
    planTrialBtn: "ابدأ الفترة التجريبية مجاناً",

    planStarterTitle: "باقة الانطلاق (Starter)",
    planStarterSubtitle: "مثالية للعيادات الفردية والمجمعات الطبية المتنامية",
    planStarterPrice: "4,500",
    planStarterPeriod: "د.ج / شهرياً",
    planStarterFeat1: "الحد الأقصى لجدولة المواعيد: 100 حجز شهرياً",
    planStarterFeat2: "تكامل مع شات بوت ذكي مبرمج بالكامل",
    planStarterFeat3: "ربط غير محدود بكافة المنصات (واتساب، تليجرام، فيسبوك، وإنستغرام) 🌐",
    planStarterFeat4: "تقارير شهرية وإحصائيات الحجوزات",
    planStarterFeat5: "أدوات استيراد الخدمات عبر Excel/CSV",
    planStarterBtn: "اشترك الآن وجرب مجاناً",

    planProTitle: "الباقة الاحترافية (Pro)",
    planProSubtitle: "للمجمعات والمراكز الطبية الكبرى والمستشفيات",
    planProPrice: "9,000",
    planProPeriod: "د.ج / شهرياً",
    planProFeat1: "حجوزات مواعيد غير محدودة مطلقاً",
    planProFeat2: "لوحة CRM متقدمة لاستقصاء رضا المرضى تلقائياً",
    planProFeat3: "ربط مباشر متكامل بـ (واتساب، تليجرام، فيسبوك، وإنستغرام) 💬",
    planProFeat4: "تخصيص نبرة صوت وأسلوب المساعد بالذكاء الاصطناعي",
    planProFeat5: "دعم فني مخصص على مدار 24 ساعة عبر الهاتف",
    planProBtn: "اشترك بالباقة الاحترافية مجاناً",

    // Directory
    directoryTag: "دليل المرضى الشامل والبحث المجاني 🏥",
    directoryTitle: "ابحث عن عيادتك الطبية المفضلة وتواصل فوراً مجاناً!",
    directoryDesc: "بإمكان المرضى البحث عن الأطباء والعيادات، فلترة النتائج حسب القرب الجغرافي، ومعرفة ما يميز كل عيادة، والتواصل مباشرة وحجز المواعيد مجاناً بالكامل دون الحاجة لفتح حساب!",
    searchPlaceholder: "ابحث باسم العيادة، اسم الطبيب، التخصص، أو العنوان...",
    maxDistanceLabel: "أقصى مسافة جغرافية (العيادات القريبة):",
    distanceUnit: "كم",
    sortByLabel: "ترتيب حسب:",
    sortByDistance: "الأقرب مسافة 📍",
    sortByName: "أبجدياً بالاسم 🔤",
    filterSpecialtyLabel: "فلترة التخصص:",
    allSpecialties: "الكل 🌐",
    noClinicsFound: "لم يتم العثور على أي عيادات مطابقة للبحث 🔍",
    noClinicsDesc: "جرب البحث بكلمات أخرى أو زيادة نطاق المسافة الجغرافية بالفلتر أعلاه.",
    distanceBadge: "على بُعد {dist} كم",
    distinctionLabel: "✨ ما يميز هذه العيادة:",
    hoursLabel: "من 08:30 ص إلى 16:30 م",
    freeContactBtn: "تواصل فوري مجاني واحجز الآن 💬",
    freeServiceNotice: "خدمة المرضى مجانية ومباشرة 🆓",
    doctorPortalBtn: "بوابة الطبيب 🔑",
    
    // Login
    loginTitle: "تسجيل دخول العيادات المشتركة",
    loginSubtitle: "أدخل بيانات عيادتك لإدارة المواعيد والمرضى والردود الذكية",
    emailLabel: "البريد الإلكتروني للعيادة:",
    passwordLabel: "كلمة السر الآمنة:",
    loginBtn: "تسجيل الدخول وإدارة العيادة 🔑",
    orQuickPreset: "أو دخول سريع لعيادة تجريبية معينة بنقرة واحدة:",
    passText: "كلمة السر",

    // Signup
    signupTitle: "إنشاء حساب عيادة طبية جديد",
    signupSubtitle: "أدخل معلومات العيادة، واختر الباقة لتفعيل مساعدك الذكي",
    activeRegisterPlan: "أنت تسجل حالياً في باقة:",
    planTrialShort: "التجريبية مجاناً 🆓",
    planStarterShort: "الانطلاق 🚀",
    planProShort: "الاحترافية 💎",
    abuseWarningTitle: "⚠️ تنبيه حظر إساءة الاستخدام (الجهاز مسجل مسبقاً):",
    abuseWarningDesc: "لقد قمت بالفعل بتفعيل الوضع المجاني التجريبي مسبقاً على هذا الهاتف/الجهاز. لمنع التحايل، يرجى الاشتراك في باقة الانطلاق (Starter) أو باقة الاحترافية (Pro) لتفعيل حسابك، أو قم بتسجيل الدخول بحسابك السابق.",
    upgradeToStarter: "الترقية لباقة الانطلاق 🚀",
    prevLoginBtn: "تسجيل الدخول السابق 🔑",
    docNameLabel: "اسم الطبيب أو المسؤول:",
    clinicNameLabel: "اسم العيادة الطبي المعتمد:",
    clinicSpecialtyLabel: "التخصص الطبي للعيادة:",
    phoneLabel: "هاتف العيادة (للربط والتواصل):",
    addressLabel: "العنوان الجغرافي للعيادة بالتفصيل:",
    accountEmailLabel: "البريد الإلكتروني للحساب:",
    accountPasswordLabel: "كلمة السر للحساب:",
    signupBtnFree: "تفعيل حساب العيادة التجريبي فورا 🆓",
    signupBtnPaid: "الانتقال لخطوة الدفع والاشتراك الآمن 💳",

    // Checkout
    checkoutTitle: "بوابة الدفع الإلكتروني الآمنة 🇩🇿",
    checkoutSubtitle: "تفعيل الاشتراك الشهري لـ {clinic}",
    amountDue: "المبلغ المستحق:",
    priceStarter: "4,500 د.ج / شهرياً",
    pricePro: "9,000 د.ج / شهرياً",
    cardTypeLabel: "نوع بطاقة الدفع الجزائرية أو الدولية:",
    cardEdahabia: "الذهبية 💳",
    cardCib: "CIB 💳",
    cardVisa: "Visa/Mastercard 💳",
    cardHolderLabel: "اسم صاحب البطاقة (كامل الحروف):",
    cardNumberLabel: "رقم بطاقة الدفع الإلكتروني (16 خانة):",
    expiryLabel: "تاريخ انتهاء الصلاحية:",
    cvvLabel: "رمز الأمان الخلفي (CVV/C2V):",
    securedPaymentNotice: "🔒 الدفع مشفر ومؤمن بالكامل عبر بروتوكولات SATIM و GIE Monétique الجزائرية.",
    payButton: "إتمام عملية الدفع وتفعيل العيادة فوراً ⚡",
    payingSim: "جاري الاتصال بخوادم البنك والدفع... ⏳",
    paySuccessTitle: "🎉 تم تفعيل العيادة بنجاح تام!",
    paySuccessDesc: "تم تفعيل باقة عيادتك بنجاح! جاري توجيهك فوراً للوحة التحكم...",
    editAccount: "تعديل الحساب",
    paymentConfirmed: "تأكيد الدفع وتفعيل العيادة 🎉",
    payoutNoticeTitle: "توجيه وإيداع الأرباح تلقائياً 💸",
    payoutNoticeDesc: "كيف تصب الأرباح في حسابي؟ تصب جميع الاشتراكات والمدفوعات التي يقوم بها مرضاك أو العيادات الفرعية المشتركة معك مباشرة وبشكل آلي في حسابك البريدي الجاري CCP الجزائري أو حسابك البنكي (RIB) خلال 24 إلى 48 ساعة كحد أقصى، مع توفير فواتير وتقارير مالية شفافة تصل لبريدك دورياً.",
    footerBrand: "شافي الذكي SaaS",
    footerRights: "جميع الحقوق محفوظة منصة شافي الذكي © 2026. مرخص لخدمة المنشآت الطبية تحت إشراف هيئة الاتصالات والتقنية الطبية.",
    footerDisclaimer: "مدعوم بالكامل بنماذج Google Gemini API المتطورة لحصر المعرفة وحماية المرضى."
  },
  en: {
    dir: "ltr",
    brand: "Shafi SaaS 🌐",
    tagline: "First Arab SaaS Platform to Automate Clinic Replies & Bookings via Social Networks using AI",
    heroTitle: "Auto Replies & Appointment Booking via Social Media 🧬",
    heroDesc: "Shafi is specifically designed to connect a smart AI chatbot to your official clinic accounts on social networks (WhatsApp Business, Facebook Messenger, Instagram, and Telegram). The assistant replies instantly and with absolute precision about your services, prices, medical instructions, and automatically schedules and confirms appointments around the clock!",
    registerNow: "Register Your Clinic Now (14 Days Free Trial)",
    tryDemo: "Try Live Chatbot Demo",
    loginDoctorBtn: "Doctor Login 🔑",
    signupClinicBtn: "Activate Clinic Account Free 🚀",
    backToHome: "Back to Home",
    
    // Stats
    stat1Title: "24/7",
    stat1Desc: "Instant & auto responses to patients",
    stat2Title: "85%",
    stat2Desc: "Savings on administrative staff costs",
    stat3Title: "100%",
    stat3Desc: "Secure & confidential patient data",
    stat4Title: "0%",
    stat4Desc: "Zero scheduling errors/leaks",

    // Playground
    playgroundTitle: "Live Interactive Doctor & Patient Playground 🔍",
    playgroundDesc: "Chat with the Dental Clinic Assistant on the right and watch how the Shafi Platform on the left instantly analyzes patient conversations, extracts name and phone, and constructs structured bookings!",
    monitorTitle: "Shafi Clinic System Monitor",
    liveUpdate: "Live Auto Update",
    targetClinicData: "Target Clinic Profile:",
    dentalClinicName: "Dental Care Clinic",
    aiExtractor: "Automatic AI Data Extractor:",
    patientName: "Extracted Patient Name:",
    patientPhone: "Extracted Phone Number:",
    requiredService: "Requested Service:",
    waitingName: "Waiting for name in chat...",
    waitingPhone: "Waiting for phone number...",
    waitingService: "Waiting for service type...",
    sentimentAnalysis: "Patient Sentiment Analysis:",
    sentimentSatisfied: "Satisfied and ready to book 😊",
    sentimentConcerned: "Concerned or asking about pain/costs ⚠️",
    playgroundFooter: "This analysis happens in the background instantly, and the structured details are immediately sent to the clinic scheduler.",
    botHeaderTitle: "Dental Chatbot Simulator",
    botHeaderStatus: "Powered by Live Gemini AI",
    botInputPlaceholder: "Ask the demo chatbot about dental implants or booking...",

    // ROI
    roiTitle: "Calculate Your Clinic ROI with Shafi 📉",
    roiDesc: "How much money do you lose monthly because staff are delayed in answering patient calls and booking requests after hours?",
    missedPatientsLabel: "Lost Patients Monthly (due to delayed response):",
    missedPatientsUnit: "patients",
    missedPatientsMin: "5 patients",
    missedPatientsMax: "100 patients",
    avgPriceLabel: "Average treatment/consultation price:",
    avgPriceUnit: "DA",
    avgPriceMin: "500 DA",
    avgPriceMax: "20,000 DA",
    lostRevenueLabel: "Currently Lost Monthly Revenue:",
    lostRevenueDesc: "This value is lost by your clinic monthly due to lack of immediate auto-response after business hours.",
    shafiSavingsTitle: "Recovered Financial Savings with Shafi:",
    shafiSavingsDesc: "Assuming the chatbot successfully recovers 80% of inquiring patients and schedules them automatically.",
    hoursSavedTitle: "Administrative Work Hours Saved Monthly:",
    hoursSavedDesc: "At an average of 45 minutes saved per patient in chatting, checking, and confirming.",
    roiCalculationNote: "This means recovering the annual subscription cost of the 'Starter' plan in less than 3 days of chatbot operation!",

    // Pricing
    pricingTitle: "Subscription Plans & Pricing 💳",
    pricingDesc: "Choose the right plan for your clinic, and start providing instant care. All plans include a free trial period.",
    freePlatformLabel: "The platform is 100% free and unlimited for doctors for in-platform bookings and chat! The subscription packages below are only for connecting automated SMS, WhatsApp, and Telegram API integration alerts outside the platform.",
    planTrialTitle: "Trial Plan",
    planTrialSubtitle: "Perfect for small clinics or testing the service",
    planTrialPrice: "0",
    planTrialPeriod: "DA / 14 Days",
    planTrialFeat1: "Max appointment scheduling: 10 bookings",
    planTrialFeat2: "Embedded chatbot on your website",
    planTrialFeat3: "Full services & doctor customization",
    planTrialFeat4: "Integration with (WhatsApp, Telegram, Facebook, Instagram) 🌐",
    planTrialFeat5: "Basic smart analytics and patient sentiment",
    planTrialBtn: "Start Free Trial Now",

    planStarterTitle: "Starter Plan",
    planStarterSubtitle: "Ideal for individual clinics & growing medical offices",
    planStarterPrice: "4,500",
    planStarterPeriod: "DA / Month",
    planStarterFeat1: "Max appointment scheduling: 100 bookings/mo",
    planStarterFeat2: "Full custom AI chatbot integration",
    planStarterFeat3: "Unlimited integration channels (WhatsApp, Telegram, FB, Insta) 🌐",
    planStarterFeat4: "Monthly analytics and booking statistics",
    planStarterFeat5: "Excel/CSV import tools for services",
    planStarterBtn: "Subscribe & Try Free",

    planProTitle: "Pro Plan",
    planProSubtitle: "For medical complexes, large centers & hospitals",
    planProPrice: "9,000",
    planProPeriod: "DA / Month",
    planProFeat1: "Absolutely unlimited appointment bookings",
    planProFeat2: "Advanced CRM panel for auto-feedback & satisfaction survey",
    planProFeat3: "Direct fully-integrated API for WhatsApp/Telegram/FB/Insta 💬",
    planProFeat4: "AI voice tone & assistant behavior customization",
    planProFeat5: "24/7 dedicated telephone and tech support",
    planProBtn: "Subscribe Pro Free",

    // Directory
    directoryTag: "Comprehensive Patient Directory & Free Search 🏥",
    directoryTitle: "Find Your Favorite Medical Clinic & Connect Free!",
    directoryDesc: "Patients can search for doctors and clinics, filter results by proximity, see what makes each clinic special, and book appointments directly and for free without registering!",
    searchPlaceholder: "Search by clinic name, doctor, specialty, or address...",
    maxDistanceLabel: "Maximum distance (nearby clinics):",
    distanceUnit: "km",
    sortByLabel: "Sort by:",
    sortByDistance: "Closest Proximity 📍",
    sortByName: "Alphabetically by Name 🔤",
    filterSpecialtyLabel: "Filter by specialty:",
    allSpecialties: "All Specialties 🌐",
    noClinicsFound: "No matching clinics found 🔍",
    noClinicsDesc: "Try searching with different keywords or increase the maximum distance filter above.",
    distanceBadge: "{dist} km away",
    distinctionLabel: "✨ What makes this clinic unique:",
    hoursLabel: "From 08:30 AM to 04:30 PM",
    freeContactBtn: "Free Contact & Book Now 💬",
    freeServiceNotice: "Direct patient service is 100% free 🆓",
    doctorPortalBtn: "Doctor Portal 🔑",
    
    // Login
    loginTitle: "Clinic Member Login",
    loginSubtitle: "Enter your credentials to manage appointments, patients and smart AI replies",
    emailLabel: "Clinic Email Address:",
    passwordLabel: "Secure Password:",
    loginBtn: "Login & Manage Clinic 🔑",
    orQuickPreset: "Or quick 1-click login for a preseeded demo clinic:",
    passText: "Password",

    // Signup
    signupTitle: "Register a New Medical Clinic",
    signupSubtitle: "Enter your clinic details and choose a plan to activate your smart AI assistant",
    activeRegisterPlan: "You are currently subscribing to:",
    planTrialShort: "Trial Plan 🆓",
    planStarterShort: "Starter 🚀",
    planProShort: "Professional 💎",
    abuseWarningTitle: "⚠️ Anti-abuse Warning (Device already registered):",
    abuseWarningDesc: "You have already activated the free trial plan on this device. To prevent system abuse, please subscribe to either the Starter or Pro plans, or login with your existing account.",
    upgradeToStarter: "Upgrade to Starter 🚀",
    prevLoginBtn: "Existing Login 🔑",
    docNameLabel: "Doctor or Administrator Name:",
    clinicNameLabel: "Official Clinic Name:",
    clinicSpecialtyLabel: "Medical Clinic Specialty:",
    phoneLabel: "Clinic Phone (for messaging integration):",
    addressLabel: "Detailed Clinic Address:",
    accountEmailLabel: "Account Email Address:",
    accountPasswordLabel: "Account Password:",
    signupBtnFree: "Activate Free Clinic Account 🆓",
    signupBtnPaid: "Proceed to Secure Payment 💳",

    // Checkout
    checkoutTitle: "Secure Electronic Payment Gateway 🇩🇿",
    checkoutSubtitle: "Activating monthly subscription for {clinic}",
    amountDue: "Amount Due:",
    priceStarter: "4,500 DA / Month",
    pricePro: "9,000 DA / Month",
    cardTypeLabel: "Algerian or International Payment Card Type:",
    cardEdahabia: "Edahabia 💳",
    cardCib: "CIB 💳",
    cardVisa: "Visa/Mastercard 💳",
    cardHolderLabel: "Cardholder Name (All caps):",
    cardNumberLabel: "Payment Card Number (16 digits):",
    expiryLabel: "Expiration Date (MM/YY):",
    cvvLabel: "Secure Code (CVV/C2V):",
    securedPaymentNotice: "🔒 Payment is fully encrypted and secured via SATIM and GIE Monétique Algerian standards.",
    payButton: "Complete Payment & Activate Clinic ⚡",
    payingSim: "Connecting to bank servers... ⏳",
    paySuccessTitle: "🎉 Clinic Activated Successfully!",
    paySuccessDesc: "Your clinic has been activated! Redirecting you to the workspace control panel...",
    editAccount: "Edit Account",
    paymentConfirmed: "Confirm Payment & Activate Clinic 🎉",
    payoutNoticeTitle: "Automatic Revenue Deposit & Payouts 💸",
    payoutNoticeDesc: "How do payouts work? All subscriptions and payments made by your patients or affiliated clinics are automatically and directly deposited into your Algerian CCP postal account or bank account (RIB) within 24 to 48 hours maximum, with transparent financial invoices and reports sent to your email periodically.",
    footerBrand: "Shafi Smart AI SaaS",
    footerRights: "All rights reserved Shafi Smart AI Platform © 2026. Licensed to serve medical facilities under the supervision of the Health Technology & Communication Authority.",
    footerDisclaimer: "Fully powered by state-of-the-art Google Gemini API models to isolate knowledge and protect patients."
  },
  fr: {
    dir: "ltr",
    brand: "Shafi SaaS 🌐",
    tagline: "Première plateforme SaaS arabe pour automatiser les réponses et réservations de cliniques sur les réseaux sociaux via l'IA",
    heroTitle: "Réponses automatiques et réservations de rendez-vous via les réseaux sociaux 🧬",
    heroDesc: "Le système Shafi est spécialement conçu pour connecter un chatbot intelligent à vos comptes officiels de clinique sur les réseaux sociaux (WhatsApp Business, Facebook Messenger, Instagram, et Telegram). L'assistant répond instantanément et avec précision sur vos services, prix, instructions médicales, et planifie et confirme automatiquement les rendez-vous des patients 24h/24 !",
    registerNow: "Inscrire votre clinique (Essai gratuit de 14 jours)",
    tryDemo: "Essayer le chatbot démo en direct",
    loginDoctorBtn: "Connexion Médecin 🔑",
    signupClinicBtn: "Activer un compte gratuit 🚀",
    backToHome: "Retour à l'accueil",
    
    // Stats
    stat1Title: "24/7",
    stat1Desc: "Réponses instantanées et automatiques aux patients",
    stat2Title: "85%",
    stat2Desc: "Économies sur les coûts de personnel administratif",
    stat3Title: "100%",
    stat3Desc: "Sécurité et confidentialité des données médicales",
    stat4Title: "0%",
    stat4Desc: "Zéro erreur ou doublon de réservation",

    // Playground
    playgroundTitle: "Espace démo interactif Médecin & Patient 🔍",
    playgroundDesc: "Discutez avec l'assistant de clinique dentaire à droite et observez comment Shafi analyse en temps réel la conversation, extrait le nom et le téléphone du patient, et génère une réservation structurée !",
    monitorTitle: "Moniteur système Shafi pour cliniques",
    liveUpdate: "Mise à jour en direct",
    targetClinicData: "Profil de clinique cible :",
    dentalClinicName: "Clinique Dental Care",
    aiExtractor: "Extracteur automatique de données par IA :",
    patientName: "Nom extrait du patient :",
    patientPhone: "Numéro de téléphone extrait :",
    requiredService: "Service demandé :",
    waitingName: "En attente du nom dans le chat...",
    waitingPhone: "En attente du numéro de téléphone...",
    waitingService: "En attente du type de service...",
    sentimentAnalysis: "Analyse des sentiments du patient :",
    sentimentSatisfied: "Satisfait et prêt à réserver 😊",
    sentimentConcerned: "Inquiet ou pose des questions sur les tarifs/douleurs ⚠️",
    playgroundFooter: "Cette analyse se fait instantanément en arrière-plan, et les informations structurées sont directement envoyées au calendrier de la clinique.",
    botHeaderTitle: "Simulateur de Chatbot Dentaire",
    botHeaderStatus: "Alimenté par Gemini AI en direct",
    botInputPlaceholder: "Posez votre question au chatbot sur les implants dentaires ou la réservation...",

    // ROI
    roiTitle: "Calculez le retour sur investissement (ROI) de votre clinique 📉",
    roiDesc: "Combien d'argent perdez-vous mensuellement à cause des retards de réponse aux appels des patients et aux demandes de réservation en dehors des heures d'ouverture ?",
    missedPatientsLabel: "Patients perdus par mois (faute de réponse immédiate) :",
    missedPatientsUnit: "patients",
    missedPatientsMin: "5 patients",
    missedPatientsMax: "100 patients",
    avgPriceLabel: "Prix moyen d'un traitement ou d'une consultation :",
    avgPriceUnit: "DA",
    avgPriceMin: "500 DA",
    avgPriceMax: "20,000 DA",
    lostRevenueLabel: "Revenu mensuel actuellement perdu :",
    lostRevenueDesc: "Cette valeur est perdue chaque mois par votre clinique par manque de réponse automatique immédiate en dehors des heures d'ouverture.",
    shafiSavingsTitle: "Économies financières récupérées avec Shafi :",
    shafiSavingsDesc: "En supposant que le chatbot réussisse à récupérer 80% des patients demandeurs et à planifier leurs rendez-vous automatiquement.",
    hoursSavedTitle: "Heures de travail administratif économisées par mois :",
    hoursSavedDesc: "À raison de 45 minutes gagnées par patient pour discuter, vérifier et confirmer les créneaux.",
    roiCalculationNote: "Cela signifie récupérer le coût d'abonnement annuel du plan 'Starter' en moins de 3 jours d'activité du chatbot !",

    // Pricing
    pricingTitle: "Forfaits d'abonnement et tarifs 💳",
    pricingDesc: "Choisissez le forfait adapté à votre clinique et commencez à offrir des réponses instantanées. Période d'essai gratuite incluse.",
    freePlatformLabel: "La plateforme est 100% gratuite et illimitée pour les médecins pour les réservations internes et le chat ! Les forfaits et messages ci-dessous sont réservés exclusivement à la connexion des alertes d'intégration SMS, WhatsApp et Telegram en dehors de la plateforme.",
    planTrialTitle: "Forfait d'essai",
    planTrialSubtitle: "Idéal pour les petites cliniques ou tester le service",
    planTrialPrice: "0",
    planTrialPeriod: "DA / 14 Jours",
    planTrialFeat1: "Max réservations : 10 rendez-vous",
    planTrialFeat2: "Chatbot intégré sur votre site web",
    planTrialFeat3: "Personnalisation complète des services et médecins",
    planTrialFeat4: "Intégration avec (WhatsApp, Telegram, Facebook, Instagram) 🌐",
    planTrialFeat5: "Analyses de base et sentiment des patients",
    planTrialBtn: "Démarrer l'essai gratuit",

    planStarterTitle: "Forfait Starter",
    planStarterSubtitle: "Idéal pour les cliniques individuelles et cabinets médicaux en croissance",
    planStarterPrice: "4,500",
    planStarterPeriod: "DA / Mois",
    planStarterFeat1: "Max réservations : 100 rendez-vous/mois",
    planStarterFeat2: "Intégration complète de chatbot IA personnalisé",
    planStarterFeat3: "Canaux d'intégration illimités (WhatsApp, Telegram, FB, Insta) 🌐",
    planStarterFeat4: "Rapports d'activité mensuels et statistiques",
    planStarterFeat5: "Outils d'import de services via Excel/CSV",
    planStarterBtn: "S'abonner & Essayer Gratuitement",

    planProTitle: "Forfait Pro",
    planProSubtitle: "Pour les grands centres médicaux, cliniques complexes & hôpitaux",
    planProPrice: "9,000",
    planProPeriod: "DA / Mois",
    planProFeat1: "Réservations de rendez-vous absolument illimitées",
    planProFeat2: "Tableau CRM avancé pour sondages de satisfaction automatisés",
    planProFeat3: "API directe entièrement intégrée pour WhatsApp/Telegram/FB 💬",
    planProFeat4: "Personnalisation du ton de l'IA et comportement de l'assistant",
    planProFeat5: "Assistance technique dédiée 24h/24 par téléphone",
    planProBtn: "S'abonner au forfait Pro gratuitement",

    // Directory
    directoryTag: "Annuaire des patients complet & Recherche gratuite 🏥",
    directoryTitle: "Trouvez votre clinique médicale préférée & contactez gratuitement !",
    directoryDesc: "Les patients peuvent rechercher des médecins et des cliniques, filtrer par proximité géographique, voir ce qui rend chaque clinique unique, et réserver un rendez-vous gratuitement sans inscription préalable !",
    searchPlaceholder: "Rechercher par nom de clinique, médecin, spécialité...",
    maxDistanceLabel: "Distance maximale (cliniques à proximité) :",
    distanceUnit: "km",
    sortByLabel: "Trier par :",
    sortByDistance: "Plus proche proximité 📍",
    sortByName: "Alphabétiquement par Nom 🔤",
    filterSpecialtyLabel: "Filtrer par spécialité :",
    allSpecialties: "Toutes les spécialités 🌐",
    noClinicsFound: "Aucune clinique correspondante trouvée 🔍",
    noClinicsDesc: "Essayez avec d'autres mots-clés ou augmentez la distance maximale ci-dessus.",
    distanceBadge: "À {dist} km de distance",
    distinctionLabel: "✨ Ce qui distingue cette clinique :",
    hoursLabel: "De 08h30 à 16h30",
    freeContactBtn: "Contact gratuit & réserver 💬",
    freeServiceNotice: "Le service patient direct est 100% gratuit 🆓",
    doctorPortalBtn: "Portail Médecin 🔑",
    
    // Login
    loginTitle: "Connexion Espace Membre",
    loginSubtitle: "Saisissez vos identifiants pour gérer les rendez-vous et les réponses IA",
    emailLabel: "Adresse e-mail de la clinique :",
    passwordLabel: "Mot de passe sécurisé :",
    loginBtn: "Se connecter et gérer la clinique 🔑",
    orQuickPreset: "Ou connexion rapide en 1 clic pour une clinique démo pré-enregistrée :",
    passText: "Mot de passe",

    // Signup
    signupTitle: "Inscrire un nouveau cabinet médical",
    signupSubtitle: "Entrez les informations de votre clinique et choisissez un forfait pour activer l'assistant IA",
    activeRegisterPlan: "Vous vous inscrivez actuellement au forfait :",
    planTrialShort: "Essai gratuit 🆓",
    planStarterShort: "Starter 🚀",
    planProShort: "Professionnel 💎",
    abuseWarningTitle: "⚠️ Alerte anti-fraude (Appareil déjà enregistré) :",
    abuseWarningDesc: "Vous avez déjà activé le plan d'essai gratuit sur cet appareil. Pour éviter les abus, veuillez vous abonner aux plans Starter ou Pro, ou vous connecter avec votre compte existant.",
    upgradeToStarter: "Passer au forfait Starter 🚀",
    prevLoginBtn: "Connexion existante 🔑",
    docNameLabel: "Nom du médecin ou de l'administrateur :",
    clinicNameLabel: "Nom officiel de la clinique :",
    clinicSpecialtyLabel: "Spécialité médicale du cabinet :",
    phoneLabel: "Téléphone de la clinique (pour intégration) :",
    addressLabel: "Adresse géographique détaillée :",
    accountEmailLabel: "Adresse e-mail du compte :",
    accountPasswordLabel: "Mot de passe du compte :",
    signupBtnFree: "Activer un compte gratuit de clinique 🆓",
    signupBtnPaid: "Passer au paiement sécurisé 💳",

    // Checkout
    checkoutTitle: "Passerelle de paiement électronique sécurisée 🇩🇿",
    checkoutSubtitle: "Activation de l'abonnement mensuel pour {clinic}",
    amountDue: "Montant dû :",
    priceStarter: "4 500 DA / Mois",
    pricePro: "9 000 DA / Mois",
    cardTypeLabel: "Type de carte de paiement (Algérienne ou Internationale) :",
    cardEdahabia: "Edahabia 💳",
    cardCib: "CIB 💳",
    cardVisa: "Visa/Mastercard 💳",
    cardHolderLabel: "Nom du titulaire (Lettres capitales) :",
    cardNumberLabel: "Numéro de carte de paiement (16 chiffres) :",
    expiryLabel: "Date d'expiration (MM/AA) :",
    cvvLabel: "Code de sécurité (CVV/C2V) :",
    securedPaymentNotice: "🔒 Le paiement est entièrement crypté et sécurisé selon les normes algériennes SATIM et GIE Monétique.",
    payButton: "Finaliser le paiement & Activer la clinique ⚡",
    payingSim: "Connexion aux serveurs bancaires... ⏳",
    paySuccessTitle: "🎉 Clinique activée avec succès !",
    paySuccessDesc: "Votre clinique a été activée ! Redirection automatique vers votre tableau de bord...",
    editAccount: "Modifier le compte",
    paymentConfirmed: "Confirmer le paiement & Activer la clinique 🎉",
    payoutNoticeTitle: "Dépôt et reversement automatique des revenus 💸",
    payoutNoticeDesc: "Comment fonctionnent les versements ? Tous les abonnements et paiements effectués par vos patients ou cliniques affiliées sont automatiquement et directement déposés sur votre compte postal algérien CCP ou compte bancaire (RIB) sous 24 à 48 heures maximum, avec des rapports financiers transparents périodiques.",
    footerBrand: "Shafi Smart AI SaaS",
    footerRights: "Tous droits réservés Plateforme Shafi Smart AI © 2026. Autorisé à servir les établissements médicaux sous la supervision de l'Autorité des Technologies et de la Communication Médicale.",
    footerDisclaimer: "Entièrement alimenté par les modèles avancés de Google Gemini API pour sécuriser les connaissances et protéger les patients."
  }
};

const preseededDoctors = [
  {
    name: "د. محمد بن يوسف - عيادة الأسنان",
    email: "doctor.dental@shafi.ai",
    color: "from-teal-400 to-emerald-500"
  },
  {
    name: "د. سارة حميدش - الطب العام",
    email: "doctor.general@shafi.ai",
    color: "from-cyan-400 to-blue-500"
  },
  {
    name: "د. خالد بلعيدي - منسق الحجوزات",
    email: "doctor.appointments@shafi.ai",
    color: "from-purple-400 to-pink-500"
  }
];

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
  currentLanguage?: "ar" | "en" | "fr";
  onLanguageChange?: (lang: "ar" | "en" | "fr") => void;
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
  showNotification,
  currentLanguage = "ar",
  onLanguageChange
}: SaasPortalProps) {
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Patient Portal Search & Discovery States
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("الكل");
  const [maxDistance, setMaxDistance] = useState(15); // max distance filter in km
  const [sortBy, setSortBy] = useState<"distance" | "name">("distance");

  const getClinicMetadata = (t: SaasTenant) => {
    if (t.id === "dental") {
      return {
        distance: 1.2,
        distinction: currentLanguage === "en" 
          ? "Advanced cosmetic dentistry, zoom laser whitening, latest painless German implants."
          : currentLanguage === "fr"
          ? "Dentisterie esthétique avancée, blanchiment laser Zoom, implants allemands indolores."
          : "تجميل الأسنان المتقدم، تبييض زووم بالليزر، أحدث تقنيات زراعة الأسنان الألمانية بدون ألم.",
        badge: currentLanguage === "en" ? "Top Premium ⭐" : currentLanguage === "fr" ? "Plus Performant ⭐" : "الأعلى تميزاً ⭐"
      };
    } else if (t.id === "general") {
      return {
        distance: 2.8,
        distinction: currentLanguage === "en"
          ? "Standard comprehensive general examination, precise diagnosis with immediate ECG and blood tests."
          : currentLanguage === "fr"
          ? "Examen général complet standard, diagnostic précis avec ECG et analyses sanguines immédiates."
          : "فحص سريري شامل قياسي، تشخيص دقيق للأعراض مع توفر تخطيط القلب والتحاليل الأساسية الفورية.",
        badge: currentLanguage === "en" ? "Most Visited 🔥" : currentLanguage === "fr" ? "Plus Visité 🔥" : "الأكثر زيارة 🔥"
      };
    } else if (t.id === "appointments") {
      return {
        distance: 4.5,
        distinction: currentLanguage === "en"
          ? "Fastest certified medical scheduler and booking desk, tele-consultation support to avoid lines."
          : currentLanguage === "fr"
          ? "Bureau d'accueil et de planification médicale certifié le plus rapide, téléconsultations pour éviter l'attente."
          : "أسرع مكتب تنسيق وحجز طبي معتمد، استشارات مرئية وهاتفية عن بُعد لتجنب طوابير الانتظار.",
        badge: currentLanguage === "en" ? "Fastest Reply ⚡" : currentLanguage === "fr" ? "Réponse Rapide ⚡" : "الأسرع تلبية ⚡"
      };
    } else {
      const charCodeSum = t.clinicName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const distance = parseFloat(((charCodeSum % 95) / 10 + 0.5).toFixed(1)); // between 0.5 and 10.0
      
      const distinctionsEn = [
        "Exceptional 24/7 medical care powered by AI, instant smart responses to all medical consultations.",
        "Fully tailored medical approach for patient comfort, speed booking confirmation, with exclusive custom packages.",
        "Rapid and perfect health checkups, with advanced tracking features sending necessary alerts to the patient fully free."
      ];
      const distinctionsFr = [
        "Soins médicaux exceptionnels 24h/24 propulsés par l'IA, réponses intelligentes instantanées pour toutes les consultations.",
        "Approche médicale sur mesure pour le confort du patient, confirmation rapide des rendez-vous et forfaits exclusifs.",
        "Bilans de santé rapides et parfaits, avec des fonctionnalités de suivi avancé envoyant des alertes gratuites au patient."
      ];
      const distinctionsAr = [
        "رعاية طبية استثنائية على مدار 24 ساعة بمساعدة الذكاء الاصطناعي، واستجابة ذكية فورية لجميع الاستشارات.",
        "نهج طبي مخصص بالكامل لراحة المرضى وسرعة تأكيد المواعيد، مع تقديم باقات وحسومات كشف حصرية ومميزة.",
        "فحوصات طبية سريعة ومثالية، مع ميزات متابعة ذكية ومتطورة ترسل التنبيهات اللازمة للمريض مجاناً بالكامل."
      ];
      
      const distinction = currentLanguage === "en" 
        ? distinctionsEn[charCodeSum % distinctionsEn.length]
        : currentLanguage === "fr"
        ? distinctionsFr[charCodeSum % distinctionsFr.length]
        : distinctionsAr[charCodeSum % distinctionsAr.length];

      return {
        distance,
        distinction,
        badge: distance < 3 
          ? (currentLanguage === "en" ? "Very Near 📍" : currentLanguage === "fr" ? "Très Proche 📍" : "قريبة منك جداً 📍")
          : (currentLanguage === "en" ? "Verified Clinic ✓" : currentLanguage === "fr" ? "Clinique Certifiée ✓" : "عيادة معتمدة ✓")
      };
    }
  };

  // Sign Up Form States
  const [signupName, setSignupName] = useState("");
  const [signupClinic, setSignupClinic] = useState("");
  const [signupSpecialty, setSignupSpecialty] = useState(
    currentLanguage === "en" ? "Dental Medicine & Surgery" : currentLanguage === "fr" ? "Médecine Dentaire & Chirurgie" : "طب وجراحة الأسنان"
  );
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
      text: currentLanguage === "en"
        ? "Welcome to Shafi's live demo! 🦷\nI am currently acting as the Dental Clinic Assistant. Ask me about German implants, clinic hours, or type 'Book appointment' to see how I capture booking details instantly!"
        : currentLanguage === "fr"
        ? "Bienvenue sur la démo en direct de Shafi ! 🦷\nJe simule l'assistant de la clinique dentaire. Posez vos questions sur les implants allemands, nos horaires, ou tapez 'Réserver' pour voir comment je gère vos données !"
        : "أهلاً بك في العرض التجريبي المباشر لـ شافي! 🦷\nأنا الآن محاكي لعيادة الأسنان المعتمدة. يمكنك طرح أي سؤال عن أسعار زراعة وتجميل الأسنان، أوقات العمل، أو كتابة 'حجز موعد لفحص' لترى كيف أتعامل مع بيانات الحجز بذكاء واحترافية!",
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
  const specialties = currentLanguage === "en" ? [
    "Dental Medicine & Surgery",
    "General Medicine & Comprehensive Clinical Examination",
    "Medical Appointment Management & Coordination",
    "Pediatrics & Periodic Vaccinations",
    "Psychiatry & Medical Consultations",
    "Physical Therapy & Rehabilitation",
    "Other (specify specialty manually...)"
  ] : currentLanguage === "fr" ? [
    "Médecine Dentaire & Chirurgie",
    "Médecine Générale & Examen Clinique Complet",
    "Gestion et Coordination des Rendez-vous",
    "Pédiatrie & Vaccinations Périodiques",
    "Psychiatrie & Consultations Médicales",
    "Kinésithérapie & Rééducation",
    "Autre (spécifier manuellement...)"
  ] : [
    "طب وجراحة الأسنان",
    "الطب العام والفحص السريري الشامل",
    "إدارة وتنسيق المواعيد الطبية",
    "طب الأطفال واللقاحات الدورية",
    "الطب النفسي والاستشارات الطبية",
    "العلاج الطبيعي والتأهيل الطبي",
    "أخرى (تحديد تخصص يدوي...)"
  ];

  // Tryout Chatbot Action Chips
  const actionChips = currentLanguage === "en" ? [
    { label: "🦷 How much does an implant cost?", query: "How much is a German dental implant?" },
    { label: "📍 Clinic location and hours", query: "What is your clinic address and working hours?" },
    { label: "📅 Book a dental clean for John Doe, phone 0500123456", query: "I want to book an appointment for dental cleaning under John Doe, phone 0500123456" }
  ] : currentLanguage === "fr" ? [
    { label: "🦷 Combien coûte un implant dentaire ?", query: "Combien coûte un implant dentaire allemand chez vous ?" },
    { label: "📍 Localisation & horaires", query: "Quelle est l'adresse de la clinique et ses horaires d'ouverture ?" },
    { label: "📅 Réserver un détartrage pour Jean Dupont, tél 0500123456", query: "Je souhaite réserver un rendez-vous pour un détartrage au nom de Jean Dupont, tél 0500123456" }
  ] : [
    { label: "🦷 كم تكلفة زراعة السن؟", query: "كم تكلفة زراعة السن الألماني لديكم؟" },
    { label: "📍 موقع العيادة وساعات العمل", query: "ما هو عنوان عيادة الأسنان وأوقات عملها؟" },
    { label: "📅 أريد حجز موعد باسم محمد الفاضل وهاتفي 0500123456", query: "أريد حجز موعد لتنظيف الأسنان باسم محمد الفاضل ورقمي 0500123456" }
  ];

  const t = saasTranslations[currentLanguage];
  const isRtl = t.dir === "rtl";

  const dirSpecialties = currentLanguage === "en" ? [
    "All",
    "Dental Medicine & Surgery",
    "General Medicine & Comprehensive Clinical Examination",
    "Medical Appointment Management & Coordination"
  ] : currentLanguage === "fr" ? [
    "Tout",
    "Médecine Dentaire & Chirurgie",
    "Médecine Générale & Examen Clinique Complet",
    "Gestion et Coordination des Rendez-vous"
  ] : [
    "الكل",
    "طب وجراحة الأسنان والتجميل",
    "الطب العام، التشخيص، والفحص السريري",
    "تنسيق المواعيد وإدارة الاستشارات الطبية"
  ];

  const handleTryoutSubmit = (manualText?: string) => {
    const text = manualText || tryoutInput;
    if (!text.trim()) return;

    const userMsg = {
      id: "try-user-" + Date.now(),
      sender: "user",
      text: text,
      timestamp: new Date()
    };
    setTryoutMessages(prev => [...prev, userMsg]);
    if (!manualText) {
      setTryoutInput("");
    }

    setTryoutLoading(true);

    setTimeout(() => {
      setTryoutLoading(false);
      let botResponse = "";
      const lower = text.toLowerCase();

      if (lower.includes("زراعة") || lower.includes("implant") || lower.includes("prix") || lower.includes("سعر") || lower.includes("تكلفة")) {
        botResponse = currentLanguage === "en"
          ? "Our German premium dental implants cost 75,000 DA with a lifetime warranty. We also offer 0% installment plans over 12 months!"
          : currentLanguage === "fr"
          ? "Nos implants dentaires allemands haut de gamme coûtent 75 000 DA avec une garantie à vie. Nous proposons aussi des paiements échelonnés sur 12 mois !"
          : "تكلفة زراعة السن الألماني الفاخر لدينا هي 75,000 د.ج مع ضمان مدى الحياة. كما نوفر تسهيلات في الدفع بالتقسيط على مدار 12 شهراً!";
        setParsedService(currentLanguage === "en" ? "Dental Implants" : currentLanguage === "fr" ? "Implants Dentaires" : "زراعة الأسنان 🦷");
        setSentimentTag("satisfied");
      } else if (lower.includes("موقع") || lower.includes("أين") || lower.includes("adresse") || lower.includes("location") || lower.includes("hours") || lower.includes("ساعات")) {
        botResponse = currentLanguage === "en"
          ? "We are located at 12 Didouche Mourad Street, Algiers. We are open Saturday to Thursday from 8:30 AM to 4:30 PM."
          : currentLanguage === "fr"
          ? "Nous sommes situés au 12, rue Didouche Mourad, Alger. Ouvert du samedi au jeudi de 8h30 à 16h30."
          : "عنوان عيادتنا: 12 شارع ديدوش مراد، الجزائر العاصمة. نحن مفتوحون من السبت إلى الخميس من 08:30 صباحاً إلى 04:30 مساءً.";
        setSentimentTag("satisfied");
      } else if (lower.includes("حجز") || lower.includes("موعد") || lower.includes("book") || lower.includes("réserver") || lower.includes("cleaning") || lower.includes("تنظيف")) {
        botResponse = currentLanguage === "en"
          ? "Sure! I can book that dental cleaning for you. I have extracted 'John Doe' and phone '0500123456'. Your booking is scheduled for tomorrow at 10:00 AM! See you soon."
          : currentLanguage === "fr"
          ? "Certainement ! Je peux réserver ce détartrage pour vous. J'ai extrait 'Jean Dupont' et le numéro '0500123456'. Votre rendez-vous est prévu pour demain à 10h00 !"
          : "بكل سرور! لقد قمت بجدولة موعد تنظيف الأسنان لك. لقد استخلصت الاسم 'محمد الفاضل' ورقم الهاتف '0500123456'. تم تأكيد حجزك لغدٍ الساعة 10:00 صباحاً! ننتظرك بكل ترحيب.";
        setParsedPatientName(currentLanguage === "en" ? "John Doe" : currentLanguage === "fr" ? "Jean Dupont" : "محمد الفاضل 👤");
        setParsedPatientPhone("0500123456 📞");
        setParsedService(currentLanguage === "en" ? "Dental Cleaning" : currentLanguage === "fr" ? "Détartrage" : "تنظيف الأسنان ✨");
        setSentimentTag("satisfied");
      } else {
        botResponse = currentLanguage === "en"
          ? "Thank you for contacting us! I am the automated virtual assistant. I can help you book appointments or answer queries about teeth whitening, implants, or clinic hours."
          : currentLanguage === "fr"
          ? "Merci de nous contacter ! Je suis l'assistant virtuel. Je peux vous aider à planifier un rendez-vous ou répondre à vos questions sur le blanchiment, les implants ou nos horaires."
          : "شكراً لتواصلك معنا! أنا المساعد الافتراضي الذكي لعيادة الأسنان. يمكنني مساعدتك في حجز المواعيد أو الإجابة على استفساراتك حول تبييض الأسنان، الزراعة، أو أوقات العمل.";
      }

      const botMsg = {
        id: "try-bot-" + Date.now(),
        sender: "bot",
        text: botResponse,
        timestamp: new Date()
      };
      setTryoutMessages(prev => [...prev, botMsg]);
    }, 1200);
  };

  const handleCheckoutPay = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaySuccess(true);
      showNotification(t.paySuccessTitle, "success");
      setTimeout(() => {
        onSignUp(
          signupEmail,
          signupPassword,
          signupName,
          signupClinic,
          signupSpecialty === "أخرى (تحديد تخصص يدوي...)" || signupSpecialty === "Other (specify specialty manually...)" || signupSpecialty === "Autre (spécifier manuellement...)" ? customSpecialty : signupSpecialty,
          signupPhone,
          signupAddress,
          checkoutPlanId
        );
      }, 2000);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col relative overflow-hidden" dir={t.dir}>
      
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
              <span className="font-bold text-lg text-slate-100 tracking-tight">
                {currentLanguage === "en" ? "Shafi Smart AI" : currentLanguage === "fr" ? "Shafi IA Intelligente" : "شافي الذكي"}
              </span>
              <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {currentLanguage === "en" ? "Medical SaaS" : currentLanguage === "fr" ? "SaaS Médical" : "SaaS للمؤسسات الطبية"}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {currentLanguage === "en" 
                ? "First Arab AI-powered automation platform for medical clinics" 
                : currentLanguage === "fr" 
                ? "Première plateforme arabe automatisée par l'IA pour les cabinets" 
                : "المنصة الأولى لأتمتة عيادات العالم العربي بالذكاء الاصطناعي"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 🌐 Elegant Platform Language Toggle */}
          <div className="flex bg-slate-950/80 border border-slate-800 p-1 rounded-xl items-center">
            <button
              onClick={() => onLanguageChange?.("ar")}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                currentLanguage === "ar"
                  ? "bg-teal-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              العربية
            </button>
            <button
              onClick={() => onLanguageChange?.("en")}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                currentLanguage === "en"
                  ? "bg-teal-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange?.("fr")}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                currentLanguage === "fr"
                  ? "bg-teal-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              FR
            </button>
          </div>

          {saasView === "landing" ? (
            <>
              <button 
                onClick={() => setSaasView("login")} 
                className="text-slate-300 hover:text-white text-sm font-semibold transition-all px-4 py-2 hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                {t.loginDoctorBtn}
              </button>
              <button 
                onClick={() => setSaasView("signup")} 
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all cursor-pointer"
              >
                {t.signupClinicBtn}
              </button>
            </>
          ) : (
            <button 
              onClick={() => setSaasView("landing")} 
              className="text-slate-300 hover:text-white text-sm font-semibold transition-all px-4 py-2 hover:bg-slate-800 rounded-xl cursor-pointer flex items-center gap-2"
            >
              {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{t.backToHome}</span>
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
                <span className="text-xs font-semibold text-slate-300">{t.tagline}</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight">
                {currentLanguage === "en" ? (
                  <>Auto Replies & Appointment Booking via <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400">Social Networks</span> 🧬</>
                ) : currentLanguage === "fr" ? (
                  <>Réponses automatiques & Réservations via <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400">Réseaux Sociaux</span> 🧬</>
                ) : (
                  <>رد آلي وحجز مواعيد لعيادتك عبر <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400">وسائل التواصل الاجتماعي</span> 🧬</>
                )}
              </h1>
              
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto">
                {t.heroDesc}
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                <button 
                  onClick={() => setSaasView("signup")}
                  className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-teal-500/10 hover:shadow-teal-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <span>{t.registerNow}</span>
                  {isRtl ? (
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-all" />
                  ) : (
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
                  )}
                </button>
                <a 
                  href="#sandbox" 
                  className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-base px-8 py-4 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{t.tryDemo}</span>
                  <Bot className="w-5 h-5 text-cyan-400" />
                </a>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-10">
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl">
                  <span className="block text-2xl font-bold text-teal-400">{t.stat1Title}</span>
                  <span className="text-xs text-slate-400 mt-1 block">{t.stat1Desc}</span>
                </div>
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl">
                  <span className="block text-2xl font-bold text-cyan-400">{t.stat2Title}</span>
                  <span className="text-xs text-slate-400 mt-1 block">{t.stat2Desc}</span>
                </div>
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl">
                  <span className="block text-2xl font-bold text-emerald-400">{t.stat3Title}</span>
                  <span className="text-xs text-slate-400 mt-1 block">{t.stat3Desc}</span>
                </div>
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl">
                  <span className="block text-2xl font-bold text-purple-400">
                    {currentLanguage === "en" ? "0%" : currentLanguage === "fr" ? "0%" : "صفر %"}
                  </span>
                  <span className="text-xs text-slate-400 mt-1 block">{t.stat4Desc}</span>
                </div>
              </div>
            </div>

            {/* 🛠️ INTERACTIVE TRIAL PLAYGROUND (SANDBOX) */}
            <div id="sandbox" className="space-y-10 scroll-mt-24">
              <div className="text-center space-y-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{t.playgroundTitle}</h2>
                <p className="text-sm text-slate-400 max-w-2xl mx-auto">
                  {t.playgroundDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
                {/* Visual Doctor Control Monitor */}
                <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl shadow-slate-950/50">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-teal-400" />
                        <h3 className="font-bold text-sm text-slate-100">{t.monitorTitle}</h3>
                      </div>
                      <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full font-bold">
                        {t.liveUpdate}
                      </span>
                    </div>

                    {/* Parser values */}
                    <div className="space-y-4">
                      <div className="bg-slate-950 p-4 rounded-2xl space-y-3">
                        <span className="text-[10px] text-slate-400 font-semibold block">{t.targetClinicData}</span>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-300">{t.dentalClinicName}</span>
                          <span className="bg-slate-900 px-2 py-1 rounded text-teal-400 font-semibold">dental</span>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-2xl space-y-3">
                        <span className="text-[10px] text-slate-400 font-semibold block">{t.aiExtractor}</span>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center border-b border-slate-900 py-1.5">
                            <span className="text-slate-400">{t.patientName}</span>
                            <span className={`font-bold ${parsedPatientName ? "text-teal-400" : "text-slate-600"}`}>
                              {parsedPatientName || t.waitingName}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center border-b border-slate-900 py-1.5">
                            <span className="text-slate-400">{t.patientPhone}</span>
                            <span className={`font-mono font-bold ${parsedPatientPhone ? "text-cyan-400" : "text-slate-600"}`}>
                              {parsedPatientPhone || t.waitingPhone}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center py-1.5">
                            <span className="text-slate-400">{t.requiredService}</span>
                            <span className={`font-bold ${parsedService ? "text-emerald-400" : "text-slate-600"}`}>
                              {parsedService || t.waitingService}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Emotion monitor */}
                      <div className="bg-slate-950 p-4 rounded-2xl space-y-3">
                        <span className="text-[10px] text-slate-400 font-semibold block">{t.sentimentAnalysis}</span>
                        <div className="flex items-center gap-3">
                          <span className={`inline-block w-3 h-3 rounded-full ${sentimentTag === "satisfied" ? "bg-emerald-500" : "bg-amber-500"} animate-pulse`} />
                          <span className="text-xs font-bold text-slate-300">
                            {sentimentTag === "satisfied" ? t.sentimentSatisfied : t.sentimentConcerned}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-800 text-center">
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {t.playgroundFooter}
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
                        <h4 className="font-bold text-xs text-slate-200">{t.botHeaderTitle}</h4>
                        <p className="text-[9px] text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                          <span>{t.botHeaderStatus}</span>
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
                      placeholder={t.botInputPlaceholder}
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
                  <span>{t.roiTitle}</span>
                </h2>
                <p className="text-xs text-slate-400 leading-normal">
                  {t.roiDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
                {/* Sliders */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">{t.missedPatientsLabel}</span>
                      <span className="text-teal-400 font-mono text-sm bg-teal-500/10 px-2 py-0.5 rounded">{missedPatients} {t.missedPatientsUnit}</span>
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
                      <span>{t.missedPatientsMin}</span>
                      <span>{t.missedPatientsMax}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">{t.avgPriceLabel}</span>
                      <span className="text-cyan-400 font-mono text-sm bg-cyan-500/10 px-2 py-0.5 rounded">{averagePrice} {t.avgPriceUnit}</span>
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
                      <span>{t.avgPriceMin}</span>
                      <span>{t.avgPriceMax}</span>
                    </div>
                  </div>
                </div>

                {/* ROI Output Card */}
                <div className="bg-slate-950 rounded-2xl p-6 border border-slate-850 flex flex-col justify-between h-full space-y-6">
                  <div className={`space-y-4 ${isRtl ? "text-right" : "text-left"}`}>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">{t.lostRevenueLabel}</span>
                      <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 tracking-tight block mt-1">
                        +{calculatedSavings.toLocaleString()} {t.avgPriceUnit}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">{t.hoursSavedTitle}</span>
                      <span className="text-xl font-bold text-cyan-400 block mt-0.5">
                        {hoursSaved} {currentLanguage === "ar" ? "ساعة شهرياً" : currentLanguage === "fr" ? "heures/mois" : "hours/mo"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {t.roiCalculationNote}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 💎 SAAS SUBSCRIPTION PRICING PLANS */}
            <div className="space-y-12" dir={isRtl ? "rtl" : "ltr"}>
              <div className="text-center space-y-4 max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{t.pricingTitle}</h2>
                <p className="text-sm text-slate-400 max-w-2xl mx-auto">
                  {t.pricingDesc}
                </p>

                {/* Prominent notice about the platform being 100% free and unlimited for doctors */}
                <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-4 max-w-3xl mx-auto text-start flex gap-3 items-start shadow-lg">
                  <Sparkles className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-teal-300 leading-relaxed block font-semibold">
                      {t.freePlatformLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
                
                {/* Plan 1: Free Trial */}
                <div className="bg-slate-900/80 border border-slate-850 hover:border-slate-800 rounded-3xl p-6 flex flex-col justify-between transition-all relative">
                  <div className="space-y-6">
                    <div className="space-y-1 text-start">
                      <h3 className="font-bold text-lg text-slate-100">{t.planTrialTitle}</h3>
                      <p className="text-xs text-slate-400">{t.planTrialSubtitle}</p>
                    </div>

                    <div className="border-t border-b border-slate-800 py-4 flex items-baseline gap-1 text-start">
                      <span className="text-3xl font-black text-slate-100">{t.planTrialPrice}</span>
                      <span className="text-xs text-slate-400">{t.planTrialPeriod}</span>
                    </div>

                    <ul className="space-y-3 text-xs text-slate-300 text-start">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{t.planTrialFeat1}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{t.planTrialFeat2}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{t.planTrialFeat3}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{t.planTrialFeat4}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{t.planTrialFeat5}</span>
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
                      {t.planTrialBtn}
                    </button>
                  </div>
                </div>

                {/* Plan 2: Starter (Most Popular) */}
                <div className="bg-slate-900 border-2 border-teal-500 rounded-3xl p-6 flex flex-col justify-between transition-all relative shadow-2xl shadow-teal-500/5">
                  <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 bg-teal-500 text-slate-950 font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-wider">
                    {currentLanguage === "en" ? "MOST POPULAR 🔥" : currentLanguage === "fr" ? "LE PLUS POPULAIRE 🔥" : "الأكثر طلباً وملاءمة 🔥"}
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-1 text-start">
                      <h3 className="font-bold text-lg text-slate-100">{t.planStarterTitle}</h3>
                      <p className="text-xs text-slate-400">{t.planStarterSubtitle}</p>
                    </div>

                    <div className="border-t border-b border-slate-800 py-4 flex items-baseline gap-1 text-start">
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">{t.planStarterPrice}</span>
                      <span className="text-xs text-slate-400">{t.planStarterPeriod}</span>
                    </div>

                    <ul className="space-y-3 text-xs text-slate-300 text-start">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{t.planStarterFeat1}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{t.planStarterFeat2}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{t.planStarterFeat3}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{t.planStarterFeat4}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{t.planStarterFeat5}</span>
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
                      {t.planStarterBtn}
                    </button>
                  </div>
                </div>

                {/* Plan 3: Pro */}
                <div className="bg-slate-900/80 border border-slate-850 hover:border-slate-800 rounded-3xl p-6 flex flex-col justify-between transition-all relative">
                  <div className="space-y-6">
                    <div className="space-y-1 text-start">
                      <h3 className="font-bold text-lg text-slate-100">{t.planProTitle}</h3>
                      <p className="text-xs text-slate-400">{t.planProSubtitle}</p>
                    </div>

                    <div className="border-t border-b border-slate-800 py-4 flex items-baseline gap-1 text-start">
                      <span className="text-3xl font-black text-slate-100">{t.planProPrice}</span>
                      <span className="text-xs text-slate-400">{t.planProPeriod}</span>
                    </div>

                    <ul className="space-y-3 text-xs text-slate-300 text-start">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{t.planProFeat1}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{t.planProFeat2}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{t.planProFeat3}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{t.planProFeat4}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{t.planProFeat5}</span>
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
                      {t.planProBtn}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 🏥 PORTAL DIRECTORY FOR PATIENTS (SEARCH, NEARBY, DISTINCTION, FREE CHAT & BOOKING) */}
            <div className="space-y-8 border-t border-slate-800/80 pt-12 text-start" dir={isRtl ? "rtl" : "ltr"}>
              <div className="text-center space-y-3">
                <span className="bg-teal-500/10 text-teal-400 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  {t.directoryTag}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-100 font-sans tracking-tight">{t.directoryTitle}</h2>
                <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  {t.directoryDesc}
                </p>
              </div>

              {/* Search & Filter Controls Card */}
              <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl max-w-5xl mx-auto space-y-6 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  {/* Search input field */}
                  <div className="md:col-span-6 relative">
                    <Search className={`w-4 h-4 text-slate-500 absolute top-3.5 ${isRtl ? "right-4" : "left-4"}`} />
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      className={`w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-2xl py-3 text-xs text-slate-100 focus:outline-none placeholder-slate-500 text-start ${isRtl ? "pr-11 pl-4" : "pl-11 pr-4"}`}
                    />
                  </div>

                  {/* Distance Slider */}
                  <div className="md:col-span-4 space-y-1.5 px-2">
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span className="font-bold">{t.maxDistanceLabel}</span>
                      <span className="text-teal-400 font-bold">{maxDistance} {t.distanceUnit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="0.5"
                        value={maxDistance}
                        onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
                        className="w-full accent-teal-400 bg-slate-800 rounded-lg cursor-pointer h-1"
                      />
                    </div>
                  </div>

                  {/* Sorting Option */}
                  <div className="md:col-span-2">
                    <select
                      value={sortBy}
                      onChange={(e: any) => setSortBy(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-2xl py-3 px-3 text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="distance" className="bg-slate-950">{t.sortByDistance}</option>
                      <option value="name" className="bg-slate-950">{t.sortByName}</option>
                    </select>
                  </div>

                </div>

                {/* Specialties Pill Filter */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-850">
                  <span className="text-[10px] text-slate-400 font-bold">{t.filterSpecialtyLabel}</span>
                  {dirSpecialties.map((spec) => (
                    <button
                      key={spec}
                      onClick={() => setSelectedSpecialty(spec)}
                      className={`text-[10px] font-bold px-3.5 py-1.5 rounded-full transition-all cursor-pointer border ${
                        selectedSpecialty === spec || (selectedSpecialty === "الكل" && (spec === "الكل" || spec === "All" || spec === "Tout"))
                          ? "bg-teal-500/10 text-teal-400 border-teal-500/30 font-black"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {spec === "الكل" || spec === "All" || spec === "Tout" ? t.allSpecialties : spec.split("،")[0].split("&")[0].split(" - ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic filtered clinic listings */}
              {(() => {
                const filtered = tenants.map(t => {
                  const meta = getClinicMetadata(t);
                  return { ...t, meta };
                }).filter(t => {
                  const term = patientSearch.toLowerCase();
                  const matchesText = !term || 
                    t.clinicName.toLowerCase().includes(term) ||
                    t.doctorName.toLowerCase().includes(term) ||
                    t.specialty.toLowerCase().includes(term) ||
                    t.address.toLowerCase().includes(term);

                  const selectedIndex = dirSpecialties.indexOf(selectedSpecialty);
                  let matchesSpec = true;
                  if (selectedIndex === 1) {
                    matchesSpec = t.specialty.toLowerCase().includes("أسنان") || 
                                  t.specialty.toLowerCase().includes("dent") || 
                                  t.specialty.toLowerCase().includes("dental");
                  } else if (selectedIndex === 2) {
                    matchesSpec = t.specialty.toLowerCase().includes("عام") || 
                                  t.specialty.toLowerCase().includes("général") || 
                                  t.specialty.toLowerCase().includes("general");
                  } else if (selectedIndex === 3) {
                    matchesSpec = t.specialty.toLowerCase().includes("مواعيد") || 
                                  t.specialty.toLowerCase().includes("rendez") || 
                                  t.specialty.toLowerCase().includes("appoint");
                  }

                  const matchesDistance = t.meta.distance <= maxDistance;

                  return matchesText && matchesSpec && matchesDistance;
                });

                if (sortBy === "distance") {
                  filtered.sort((a, b) => a.meta.distance - b.meta.distance);
                } else {
                  filtered.sort((a, b) => a.clinicName.localeCompare(b.clinicName, "ar"));
                }

                if (filtered.length === 0) {
                  return (
                    <div className="bg-slate-950 border border-slate-850 p-12 rounded-3xl max-w-5xl mx-auto text-center space-y-3">
                      <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
                      <h4 className="text-sm font-bold text-slate-300">{t.noClinicsFound}</h4>
                      <p className="text-xs text-slate-500">{t.noClinicsDesc}</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
                    {filtered.map((tItem) => (
                      <div key={tItem.id} className="bg-slate-900 border border-slate-850 p-6 rounded-3xl flex flex-col justify-between space-y-6 hover:border-slate-750 transition-all shadow-lg hover:shadow-2xl relative">
                        {/* Upper Badges */}
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] bg-slate-950 border border-slate-800 text-teal-400 font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>{t.distanceBadge.replace("{dist}", String(tItem.meta.distance))}</span>
                          </span>
                          <span className="text-[9px] bg-teal-500/10 text-teal-300 font-extrabold px-2 py-0.5 rounded-full">
                            {tItem.meta.badge}
                          </span>
                        </div>

                        {/* Clinic Content */}
                        <div className="space-y-4 text-start">
                          <div className="flex items-start gap-3">
                            <div className="bg-gradient-to-tr from-teal-500/10 to-cyan-500/10 p-2.5 rounded-xl text-teal-400 shrink-0">
                              <Stethoscope className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-extrabold text-sm text-slate-100 leading-snug">{tItem.clinicName}</h4>
                              <span className="text-[10px] text-slate-400 font-medium block">
                                {tItem.specialty}
                              </span>
                            </div>
                          </div>

                          {/* What distinguishes this clinic */}
                          <div className={`bg-slate-950/60 border border-slate-850 p-3 rounded-2xl space-y-1 ${isRtl ? "text-right" : "text-left"}`}>
                            <span className="text-[9px] text-teal-400 font-black block">{t.distinctionLabel}</span>
                            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                              {tItem.meta.distinction}
                            </p>
                          </div>
                          
                          {/* Details & Location Info */}
                          <div className="space-y-2 text-[10px] text-slate-400 border-t border-slate-850 pt-3">
                            <p className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span className="line-clamp-1">{tItem.address}</span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span>{currentLanguage === "en" ? `Supervised by: ${tItem.doctorName}` : currentLanguage === "fr" ? `Sous la direction de : ${tItem.doctorName}` : `بإشراف: ${tItem.doctorName}`}</span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span>{tItem.workHours || t.hoursLabel}</span>
                            </p>
                          </div>
                        </div>

                        {/* Interactive Patient Actions */}
                        <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-850">
                          {/* View clinic portal & book instantly / chat directly inside platform for free */}
                          <button
                            onClick={() => onViewClinic(tItem.id)}
                            className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/5 hover:shadow-teal-500/15"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>{t.freeContactBtn}</span>
                          </button>

                          {/* Quick access code/doctor simulation trigger */}
                          <div className="flex justify-between items-center text-[10px] text-slate-500 px-1 pt-1">
                            <span>{t.freeServiceNotice}</span>
                            <button
                              onClick={() => {
                                setLoginEmail(tItem.email);
                                setLoginPassword(tItem.password || "123");
                                setSaasView("login");
                                showNotification(
                                  currentLanguage === "en" 
                                    ? "Demo credentials filled successfully! 🔑" 
                                    : currentLanguage === "fr" 
                                      ? "Identifiants démo remplis avec succès ! 🔑" 
                                      : "تم ملء بيانات الدخول التجريبية للعيادة بنجاح! 🔑", 
                                  "info"
                                );
                              }}
                              className="text-slate-400 hover:text-teal-400 underline cursor-pointer"
                            >
                              {t.doctorPortalBtn}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
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
                <h2 className="text-xl font-bold text-slate-100">{t.loginTitle}</h2>
                <p className="text-xs text-slate-400">{t.loginSubtitle}</p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  onLogin(loginEmail, loginPassword);
                }}
                className={`space-y-4 ${isRtl ? "text-right" : "text-left"}`}
              >
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold block">{t.emailLabel}</label>
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
                  <label className="text-xs text-slate-400 font-bold block">{t.passwordLabel}</label>
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
                  {t.loginBtn}
                </button>
              </form>

              {/* Quick Preset login info */}
              <div className="mt-8 border-t border-slate-800 pt-6 space-y-3">
                <span className="text-[10px] text-slate-500 font-bold block text-center">{t.orQuickPreset}</span>
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
            <div className={`bg-slate-900 border border-slate-850 rounded-3xl p-8 shadow-2xl ${isRtl ? "text-right" : "text-left"}`}>
              <div className="text-center space-y-2 mb-8">
                <div className="bg-gradient-to-tr from-teal-500 to-cyan-400 p-3 rounded-2xl text-slate-950 w-fit mx-auto shadow-lg shadow-teal-500/15 animate-bounce">
                  <Building className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-100">{t.signupTitle}</h2>
                <p className="text-xs text-slate-400">{t.signupSubtitle}</p>
                <div className="bg-teal-500/10 text-teal-400 border border-teal-500/10 text-[10px] px-3 py-1 rounded-full w-fit mx-auto mt-2 font-bold">
                  {t.activeRegisterPlan} {checkoutPlanId === "pro" ? t.planProShort : checkoutPlanId === "starter" ? t.planStarterShort : t.planTrialShort}
                </div>

                {checkoutPlanId === "free" && localStorage.getItem("shafi_free_plan_claimed") === "true" && (
                  <div className={`mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2 ${isRtl ? "text-right" : "text-left"}`}>
                    <p className="text-xs text-rose-400 font-bold">{t.abuseWarningTitle}</p>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {t.abuseWarningDesc}
                    </p>
                    <div className="flex gap-2 pt-1 justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setCheckoutPlanId("starter");
                        }}
                        className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-teal-500/30 transition-all cursor-pointer"
                      >
                        {t.upgradeToStarter}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSaasView("login")}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-750 transition-all cursor-pointer"
                      >
                        {t.prevLoginBtn}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if ((signupSpecialty === "أخرى (تحديد تخصص يدوي...)" || signupSpecialty === "Other (specify specialty manually...)" || signupSpecialty === "Autre (spécifier manuellement...)") && !customSpecialty.trim()) {
                    showNotification(
                      currentLanguage === "en" 
                        ? "⚠️ Please type your custom medical specialty in the designated field!" 
                        : currentLanguage === "fr" 
                        ? "⚠️ Veuillez saisir votre spécialité médicale personnalisée !" 
                        : "⚠️ يرجى كتابة التخصص الطبي المخصص في الحقل المخصص له!", 
                      "error"
                    );
                    return;
                  }
                  if (checkoutPlanId === "free") {
                    const freeClaimed = localStorage.getItem("shafi_free_plan_claimed");
                    if (freeClaimed === "true") {
                      showNotification(
                        currentLanguage === "en" 
                          ? "⚠️ Sorry, it appears this device has already activated the trial package! Please choose a paid plan or log in." 
                          : currentLanguage === "fr" 
                          ? "⚠️ Désolé, cet appareil a déjà activé le forfait d'essai ! Veuillez choisir un forfait payant ou vous connecter." 
                          : "⚠️ عذراً، تبيّن أن هذا الجهاز قد فعّل الباقة التجريبية مسبقاً! يرجى اختيار باقة مدفوعة أو تسجيل الدخول.", 
                        "error"
                      );
                      return;
                    }
                    // Sign up directly for free plan without payment
                    onSignUp(
                      signupEmail,
                      signupPassword,
                      signupName,
                      signupClinic,
                      signupSpecialty === "أخرى (تحديد تخصص يدوي...)" || signupSpecialty === "Other (specify specialty manually...)" || signupSpecialty === "Autre (spécifier manuellement...)" ? customSpecialty : signupSpecialty,
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
                    <label className="text-xs text-slate-400 font-bold block">{t.docNameLabel}</label>
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder={currentLanguage === "en" ? "Dr. John Doe" : currentLanguage === "fr" ? "Dr. Jean Dupont" : "د. محمد العتيبي"}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold block">{t.clinicNameLabel}</label>
                    <input
                      type="text"
                      required
                      value={signupClinic}
                      onChange={(e) => setSignupClinic(e.target.value)}
                      placeholder={currentLanguage === "en" ? "Al-Amal Clinic" : currentLanguage === "fr" ? "Clinique de l'Espoir" : "مستوصف لؤلؤة التخصصي"}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold block">{t.clinicSpecialtyLabel}</label>
                    <select
                      value={signupSpecialty}
                      onChange={(e) => setSignupSpecialty(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none"
                    >
                      {specialties.map((spec, idx) => (
                        <option key={idx} value={spec} className="bg-slate-950">{spec}</option>
                      ))}
                    </select>
                    
                    {(signupSpecialty === "أخرى (تحديد تخصص يدوي...)" || signupSpecialty === "Other (specify specialty manually...)" || signupSpecialty === "Autre (spécifier manuellement...)") && (
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
                          placeholder={currentLanguage === "en" ? "Type your custom specialty manually (e.g., Orthopedics)..." : currentLanguage === "fr" ? "Saisissez votre spécialité manuellement (ex: Orthopédie)..." : "اكتب التخصص الطبي يدوياً هنا (مثال: طب العظام)..."}
                          className="w-full bg-slate-950 border border-teal-500/50 focus:border-teal-400 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none placeholder-slate-500"
                        />
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold block">{t.phoneLabel}</label>
                    <input
                      type="text"
                      required
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="+213 550 12 34 56"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold block">{t.addressLabel}</label>
                  <input
                    type="text"
                    required
                    value={signupAddress}
                    onChange={(e) => setSignupAddress(e.target.value)}
                    placeholder={currentLanguage === "en" ? "Didouche Mourad St, Algiers" : currentLanguage === "fr" ? "Rue Didouche Mourad, Alger" : "الجزائر العاصمة، شارع ديدوش مراد، الطابق الثاني"}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold block">{t.accountEmailLabel}</label>
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
                    <label className="text-xs text-slate-400 font-bold block">{t.accountPasswordLabel}</label>
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
                  {checkoutPlanId === "free" ? t.signupBtnFree : t.signupBtnPaid}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW 4: CREDIT CARD SIMULATED CHECKOUT */}
        {saasView === "checkout" && (
          <div className="max-w-lg mx-auto py-16 px-6 space-y-8">
            <div className={`bg-slate-900 border border-slate-850 rounded-3xl p-8 shadow-2xl relative space-y-8 ${isRtl ? "text-right" : "text-left"}`}>
              
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-slate-100">{t.checkoutTitle}</h2>
                <p className="text-xs text-slate-400">{t.checkoutSubtitle.replace("{clinic}", signupClinic)}</p>
                <div className="text-sm font-black text-teal-400 bg-teal-500/10 px-3 py-1.5 rounded-xl w-fit mx-auto mt-2 animate-pulse">
                  {t.amountDue} {checkoutPlanId === "starter" ? t.priceStarter : t.pricePro}
                </div>
              </div>

              {/* Algerian Card Type Selector */}
              <div className={`space-y-2 ${isRtl ? "text-right" : "text-left"}`}>
                <label className="text-xs text-slate-400 font-bold block">{t.cardTypeLabel}</label>
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
                    {t.cardEdahabia}
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
                    {t.cardCib}
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
                    {t.cardVisa}
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
                    {cardType === "edahabia" && (currentLanguage === "en" ? "Algeria Post / EDAHABIA" : currentLanguage === "fr" ? "Algérie Poste / EDAHABIA" : "بريد الجزائر / EDAHABIA")}
                    {cardType === "cib" && (currentLanguage === "en" ? "Bank Card / CIB Algeria" : currentLanguage === "fr" ? "Carte Bancaire / CIB Algérie" : "نقد بنكي / CIB الجزائر")}
                    {cardType === "visa" && "VISA"}
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
                    <span className="block text-[7px] uppercase text-slate-300">{currentLanguage === "en" ? "Card Holder" : currentLanguage === "fr" ? "Titulaire" : "حامل البطاقة"}</span>
                    <span className="font-sans font-bold uppercase">{cardHolder || "MOHAMED BENALIA"}</span>
                  </div>
                  <div className="text-left">
                    <span className="block text-[7px] uppercase text-slate-300 font-sans">{currentLanguage === "en" ? "Expiry" : currentLanguage === "fr" ? "Validité" : "الصلاحية"}</span>
                    <span className="font-mono font-bold">{cardExpiry || "12/28"}</span>
                  </div>
                </div>
              </div>

              {/* 💸 Payout Channel Explanation Card */}
              <div className={`bg-slate-950/60 border border-slate-850 p-4 rounded-2xl space-y-2 ${isRtl ? "text-right" : "text-left"}`}>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                  {t.payoutNoticeTitle}
                </span>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {t.payoutNoticeDesc}
                </p>
              </div>

              {/* Payment Success Animation */}
              {paySuccess ? (
                <div className="text-center space-y-3 py-6 bg-slate-950/60 rounded-2xl border border-emerald-500/20">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 p-2.5 rounded-full mx-auto animate-bounce flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm">{t.paySuccessTitle}</h4>
                  <p className="text-xs text-slate-400">{t.paySuccessDesc}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold block">{t.cardHolderLabel}</label>
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
                      {cardType === "edahabia" 
                        ? (currentLanguage === "en" ? "Edahabia Card Number (16 digits starting with 6280):" : currentLanguage === "fr" ? "Numéro de carte Edahabia (16 chiffres commençant par 6280) :" : "رقم بطاقة الذهبية (16 خانة تبدأ بـ 6280):")
                        : t.cardNumberLabel}
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
                      <label className="text-xs text-slate-400 font-bold block">{t.expiryLabel}</label>
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
                      <label className="text-xs text-slate-400 font-bold block">{t.cvvLabel}</label>
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
                      {t.editAccount}
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
                          <span>{t.payingSim}</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>{t.paymentConfirmed}</span>
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
          <span className="font-bold text-slate-400">{t.footerBrand}</span>
        </div>
        <p>{t.footerRights}</p>
        <p className="text-[10px] text-slate-600">{t.footerDisclaimer}</p>
      </footer>

    </div>
  );
}
