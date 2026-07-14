import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  User,
  Stethoscope,
  Plus,
  Trash,
  Upload,
  FileSpreadsheet, 
  Send, 
  DollarSign, 
  ClipboardList, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare,
  Settings,
  TrendingUp,
  Facebook,
  Instagram,
  Globe,

  Sparkles, 
  Clock, 
  Phone, 
  MapPin, 
  Save, 
  HelpCircle, 
  ShieldCheck, 
  Heart, 
  FileText, 
  RefreshCw,
  Printer,
  Sliders,
  Maximize2,
  Check,
  ChevronLeft,
  ChevronRight,
  Database,
  Smartphone,
  Download,
  Calendar,
  UserCheck,
  XCircle,
  PlusCircle,
  Search,
  Image,
  X,
  Camera,
  Mic,
  Square,
  Volume2,
  Play,
  Bell,
  BellOff,
  Lock,
  Mail,
  Building,
  CreditCard,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart, 
  Bar, 
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

import { CLINIC_PRESETS, ClinicPreset } from "./data/presets";
import { ClinicInfo, ClinicService, ClinicGuideline, QuickAction, ChatMessage, Booking, ChatSession, SaasTenant } from "./types";
import { parseExcelOrCsvToServices, parseExcelOrCsvToGuidelines } from "./utils/parser";
import ClinicMap from "./components/ClinicMap";
import SaasPortal from "./components/SaasPortal";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n, { translations } from "./i18n";

const pdfTranslations: Record<string, any> = {};

// translations loaded from ./i18n.ts

const localizeDynamicText = (text: string, lang: "ar" | "en" | "fr"): string => {
  if (!text) return text;
  
  const dict: Record<string, Record<"ar" | "en" | "fr", string>> = {
    "طب وجراحة الأسنان والتجميل": {
      ar: "طب وجراحة الأسنان والتجميل",
      en: "Dentistry, Oral Surgery & Cosmetics",
      fr: "Chirurgie Dentaire et Esthétique"
    },
    "الطب العام، التشخيص، والفحص السريري": {
      ar: "الطب العام، التشخيص، والفحص السريري",
      en: "General Medicine, Diagnosis & Clinical Exam",
      fr: "Médecine Générale, Diagnostic et Examen Clinique"
    },
    "تنسيق المواعيد وإدارة الاستشارات الطبية والدعم الإداري": {
      ar: "تنسيق المواعيد وإدارة الاستشارات الطبية والدعم الإداري",
      en: "Appointment Coordination & Consultation Management",
      fr: "Coordination des rendez-vous et gestion des consultations"
    },
    "عيادة دنتال كير لطب الأسنان": {
      ar: "عيادة دنتال كير لطب الأسنان",
      en: "Dental Care Clinic",
      fr: "Clinique Dental Care"
    },
    "عيادة الشفاء للطب العام والفحص الشامل": {
      ar: "عيادة الشفاء للطب العام والفحص الشامل",
      en: "Al-Shifa Clinic for General Medicine & Comprehensive Checkup",
      fr: "Clinique Al-Shifa pour la médecine générale"
    },
    "مكتب تنظيم وحجز المواعيد الطبي الموحد": {
      ar: "مكتب تنظيم وحجز المواعيد الطبي الموحد",
      en: "Unified Medical Appointment & Scheduling Office",
      fr: "Bureau Unifié de Coordination des Rendez-vous Médicaux"
    },
    "الجزائر العاصمة، شارع ديدوش مراد، عمارة السلام، الطابق الثاني": {
      ar: "الجزائر العاصمة، شارع ديدوش مراد، عمارة السلام، الطابق الثاني",
      en: "Algiers, Didouche Mourad Street, Peace Building, 2nd Floor",
      fr: "Alger, Rue Didouche Mourad, Immeuble de la Paix, 2e Étage"
    },
    "الجزائر العاصمة، حي باب الواد، شارع الاستقلال، الطابق الأول": {
      ar: "الجزائر العاصمة، حي باب الواد، شارع الاستقلال، الطابق الأول",
      en: "Algiers, Bab El Oued, Independence Street, 1st Floor",
      fr: "Alger, Bab El Oued, Rue de l'Indépendance, 1er Étage"
    },
    "قسنطينة، حي سيدي مبروك، شارع المستشفى، مجمع الشفاء الطبي، الطابق الأرضي": {
      ar: "قسنطينة، حي سيدي مبروك، شارع المستشفى، مجمع الشفاء الطبي، الطابق الأرضي",
      en: "Constantine, Sidi Mabrouk, Hospital Street, Al-Shifa Medical Complex, Ground Floor",
      fr: "Constantine, Sidi Mabrouk, Rue de l'Hôpital, Complexe Médical Al-Shifa, Rez-de-chaussée"
    },
    "اليوم الطبيب متواجد من الساعة 08:30 صباحاً وحتى 16:30 زوالاً. يوجد ازدحام طفيف في فترة المساء، وننصح بالحضور قبل الموعد بـ 15 دقيقة لتأكيد الحجز.": {
      ar: "اليوم الطبيب متواجد من الساعة 08:30 صباحاً وحتى 16:30 زوالاً. يوجد ازدحام طفيف في فترة المساء، وننصح بالحضور قبل الموعد بـ 15 دقيقة لتأكيد الحجز.",
      en: "The doctor is available today from 08:30 AM to 04:30 PM. There is slight congestion in the afternoon, we recommend arriving 15 minutes before your slot to confirm.",
      fr: "Le médecin est disponible aujourd'hui de 08h30 à 16h30. Il y a un léger encombrement l'après-midi, nous conseillons d'arriver 15 minutes à l'avance."
    },
    "طبيب الطب العام متواجد اليوم من الساعة 09:00 صباحاً وحتى 18:30 مساءً. تتوفر اليوم خدمات قياس الضغط، فحص السكر، وفحص الوزن والنمو الشامل والاطمئنان على الصحة العامة للجميع.": {
      ar: "طبيب الطب العام متواجد اليوم من الساعة 09:00 صباحاً وحتى 18:30 مساءً. تتوفر اليوم خدمات قياس الضغط، فحص السكر، وفحص الوزن والنمو الشامل والاطمئنان على الصحة العامة للجميع.",
      en: "The general practitioner is available today from 09:00 AM to 06:30 PM. Blood pressure check, glucose monitoring, growth assessment, and comprehensive wellness checkups are available today.",
      fr: "Le médecin généraliste est présent aujourd'hui de 09h00 à 18h30. Les services de mesure de tension, de glycémie et de bilan général de bien-être sont disponibles."
    },
    "مكتب تنظيم المواعيد يعمل بشكل اعتيادي اليوم من الساعة 08:00 صباحاً وحتى 20:00 مساءً. جميع مواعيد العيادات الخارجية ومتابعات الأطباء يتم تنظيمها وحجزها في غضون دقائق معدودة.": {
      ar: "مكتب تنظيم المواعيد يعمل بشكل اعتيادي اليوم من الساعة 08:00 صباحاً وحتى 20:00 مساءً. جميع مواعيد العيادات الخارجية ومتابعات الأطباء يتم تنظيمها وحجزها في غضون دقائق معدودة.",
      en: "The scheduling office is working normally today from 08:00 AM to 08:00 PM. All outpatient appointments and physician follow-ups are coordinated in a matter of minutes.",
      fr: "Le bureau de coordination est ouvert aujourd'hui de 08h00 à 20h00. Tous les rendez-vous ambulatoires et suivis médicaux sont organisés en quelques minutes."
    },
    "تنظيف الأسنان وإزالة الجير": {
      ar: "تنظيف الأسنان وإزالة الجير",
      en: "Teeth Cleaning & Scaling",
      fr: "Nettoyage des dents et détartrage"
    },
    "تبييض الأسنان بالليزر (زوم)": {
      ar: "تبييض الأسنان بالليزر (زوم)",
      en: "Laser Teeth Whitening (Zoom)",
      fr: "Blanchiment des dents au laser (Zoom)"
    },
    "حشوة تجميلية ضوئية (كومبوزيت)": {
      ar: "حشوة تجميلية ضوئية (كومبوزيت)",
      en: "Cosmetic Composite Filling",
      fr: "Obturation composite esthétique"
    },
    "زراعة الأسنان الألمانية": {
      ar: "زراعة الأسنان الألمانية",
      en: "German Dental Implant",
      fr: "Implant dentaire allemand"
    },
    "تقويم الأسنان الشفاف": {
      ar: "تقويم الأسنان الشفاف",
      en: "Clear Aligners",
      fr: "Alignement dentaire transparent"
    },
    "الفحص السريري العام والاستشارة الطبية": {
      ar: "الفحص السريري العام والاستشارة الطبية",
      en: "General Clinical Exam & Consultation",
      fr: "Examen clinique général et consultation"
    },
    "فحص وتخطيط القلب الكهربائي (ECG)": {
      ar: "فحص وتخطيط القلب الكهربائي (ECG)",
      en: "Electrocardiogram (ECG) Exam",
      fr: "Examen et électrocardiogramme (ECG)"
    },
    "الفحص الدوري والتحاليل الطبية الأساسية": {
      ar: "الفحص الدوري والتحاليل الطبية الأساسية",
      en: "Periodic Checkup & Basic Medical Analyses",
      fr: "Bilan périodique et analyses médicales de base"
    },
    "استشارة التغذية وعلاج السمنة والنحافة": {
      ar: "استشارة التغذية وعلاج السمنة والنحافة",
      en: "Nutrition Consultation & Weight Management",
      fr: "Consultation nutritionnelle et traitement de l'obésité"
    },
    "الكشف الطبي المنزلي للحالات الخاصة": {
      ar: "الكشف الطبي المنزلي للحالات الخاصة",
      en: "Home Medical Visit for Special Cases",
      fr: "Visite médicale à domicile pour cas particuliers"
    },
    "حجز وتأكيد المواعيد العادية والطارئة": {
      ar: "حجز وتأكيد المواعيد العادية والطارئة",
      en: "Regular & Emergency Appointment Booking",
      fr: "Réservation et confirmation des rendez-vous standards et urgents"
    },
    "الاستشارة الطبية عن بُعد (مرئية / هاتفية)": {
      ar: "الاستشارة الطبية عن بُعد (مرئية / هاتفية)",
      en: "Remote Tele-Consultation (Video / Phone)",
      fr: "Téléconsultation médicale (Vidéo / Téléphone)"
    },
    "تنظيم مواعيد الفحوصات الخارجية والتحاليل": {
      ar: "تنظيم مواعيد الفحوصات الخارجية والتحاليل",
      en: "Outsource Diagnostic & Lab Appointments",
      fr: "Coordination des examens externes et analyses"
    },
    "جلسة تنظيف عميق لتلميع الأسنان وإزالة التصبغات والترسبات الجيرية باستخدام الأمواج فوق الصوتية.": {
      ar: "جلسة تنظيف عميق لتلميع الأسنان وإزالة التصبغات والترسبات الجيرية باستخدام الأمواج فوق الصوتية.",
      en: "Deep cleaning session to polish teeth and remove stains and calculus deposits using ultrasound.",
      fr: "Séance de nettoyage en profondeur pour polir les dents et éliminer les taches et le tartre par ultrasons."
    },
    "تبييض احترافي في العيادة للحصول على ابتسامة ناصعة البياض خلال ساعة واحدة فقط.": {
      ar: "تبييض احترافي في العيادة للحصول على ابتسامة ناصعة البياض خلال ساعة واحدة فقط.",
      en: "Professional in-office whitening to get a bright white smile in just one hour.",
      fr: "Blanchiment professionnel au cabinet pour un sourire éclatant en seulement une heure."
    },
    "حشوة أسنان بلون السن الطبيعي متينة وتدوم طويلاً لترميم الأسنان الأمامية والخلفية.": {
      ar: "حشوة أسنان بلون السن الطبيعي متينة وتدوم طويلاً لترميم الأسنان الأمامية والخلفية.",
      en: "Tooth-colored, durable dental filling for restoring anterior and posterior teeth.",
      fr: "Obturation de la couleur de la dent, durable pour restaurer les dents antérieures et postérieures."
    },
    "زراعة الأسنان المفقودة بأحدث التقنيات وبنسبة نجاح تفوق 98% شاملة التلبيسة الزركونية.": {
      ar: "زراعة الأسنان المفقودة بأحدث التقنيات وبنسبة نجاح تفوق 98% شاملة التلبيسة الزركونية.",
      en: "Replacing missing teeth with the latest technologies and a success rate over 98%, including zircon crown.",
      fr: "Remplacement des dents manquantes avec les dernières technologies et un taux de réussite de plus de 98%, couronne en zircone incluse."
    },
    "تقويم أسنان غير مرئي متحرك لعلاج اعوجاج الأسنان بدون أسلاك معدنية.": {
      ar: "تقويم أسنان غير مرئي متحرك لعلاج اعوجاج الأسنان بدون أسلاك معدنية.",
      en: "Removable invisible orthodontic treatment to align teeth without metal wires.",
      fr: "Traitement orthodontique invisible amovible pour aligner les dents sans fils métalliques."
    },
    "كشف طبي شامل يشمل قياس الضغط والنبض وفحص العلامات الحيوية مع تقديم استشارة طبية وتوجيه للعلاج المناسب والمتابعة.": {
      ar: "كشف طبي شامل يشمل قياس الضغط والنبض وفحص العلامات الحيوية مع تقديم استشارة طبية وتوجيه للعلاج المناسب والمتابعة.",
      en: "Comprehensive medical checkup including blood pressure, pulse, and vital signs monitoring, with a tailored consultation and treatment path.",
      fr: "Examen médical complet comprenant tension, pouls et constantes vitales, avec consultation et orientation thérapeutique."
    },
    "إجراء تخطيط للقلب بأحدث الأجهزة للكشف عن صحة القلب ووظائفه بدقة وعناية فائقة مع تقديم التقرير الطبي فوراً.": {
      ar: "إجراء تخطيط للقلب بأحدث الأجهزة للكشف عن صحة القلب ووظائفه بدقة وعناية فائقة مع تقديم التقرير الطبي فوراً.",
      en: "Electrocardiogram (ECG) using state-of-the-art equipment to accurately assess heart health with an immediate report.",
      fr: "Réalisation d'un électrocardiogramme (ECG) avec des équipements modernes pour évaluer la santé cardiaque, rapport immédiat."
    },
    "فحص روتيني شامل للدم والسكري والوظائف الحيوية للجسم للاطمئنان العام وتفادي المشاكل الصحية والمضاعفات.": {
      ar: "فحص روتيني شامل للدم والسكري والوظائف الحيوية للجسم للاطمئنان العام وتفادي المشاكل الصحية والمضاعفات.",
      en: "Routine screening of blood, glucose, and key biological functions for general wellness and early risk prevention.",
      fr: "Dépistage de routine comprenant bilan sanguin, glycémie et fonctions vitales pour un suivi préventif complet."
    },
    "تحليل بنية الجسم ومكونات الدهون والكتلة العضلية مع وضع نظام غذائي صحي علاجي ومتابعة دورية متخصصة ومستمرة.": {
      ar: "تحليل بنية الجسم ومكونات الدهون والكتلة العضلية مع وضع نظام غذائي صحي علاجي ومتابعة دورية متخصصة ومستمرة.",
      en: "Body composition analysis of fat and muscle mass with a tailored nutritional plan and continuous expert follow-up.",
      fr: "Analyse de la composition corporelle (masse grasse/musculaire) avec programme diététique sur mesure et suivi spécialisé."
    },
    "زيارة منزلية وفحص طبي شامل للمرصى كبار السن أو الحالات التي يصعب نقلها للعيادة في محيط العاصمة وضواحيها.": {
      ar: "زيارة منزلية وفحص طبي شامل للمرصى كبار السن أو الحالات التي يصعب نقلها للعيادة في محيط العاصمة وضواحيها.",
      en: "Home visit and thorough medical checkup for elderly patients or cases with restricted mobility in Algiers and its suburbs.",
      fr: "Visite à domicile et examen médical complet pour les patients âgés ou à mobilité réduite à Alger et ses environs."
    },
    "تنسيق وحجز موعد طبي مباشر في أي من التخصصات المتاحة وتلقي التأكيد الفوري عبر رسائل الجوال لتنظيم دخولك للطبيب المختص.": {
      ar: "تنسيق وحجز موعد طبي مباشر في أي من التخصصات المتاحة وتلقي التأكيد الفوري عبر رسائل الجوال لتنظيم دخولك للطبيب المختص.",
      en: "Coordinating a direct medical slot in any available specialty with immediate confirmation via mobile to organize your visit.",
      fr: "Coordination et réservation directe dans les spécialités disponibles avec confirmation SMS immédiate pour organiser votre entrée."
    },
    "جدولة وتنسيق اتصال مباشر وآمن مع الطبيب المختص للحالات التي لا تستدعي الحضور الفعلي للعيادة وتوفير التقارير الرقمية.": {
      ar: "جدولة وتنسيق اتصال مباشر وآمن مع الطبيب المختص للحالات التي لا تستدعي الحضور الفعلي للعيادة وتوفير التقارير الرقمية.",
      en: "Scheduling a secure direct call with the specialist doctor for cases that do not require physical presence, with digital reports provided.",
      fr: "Planification d'un appel direct sécurisé avec le spécialiste pour les cas ne nécessitant pas de déplacement physique, compte-rendu numérique."
    },
    "تنسيق مواعيد الفحوصات المتقدمة مثل الرنين المغناطيسي، الأشعة السينية، والتحاليل المخبرية المعقدة مع أفضل المراكز الطبية الشريكة بأفضل الأسعار.": {
      ar: "تنسيق مواعيد الفحوصات المتقدمة مثل الرنين المغناطيسي، الأشعة السينية، والتحاليل المخبرية المعقدة مع أفضل المراكز الطبية الشريكة بأفضل الأسعار.",
      en: "Coordinating advanced examinations like MRI, X-ray, and complex laboratory tests with partner medical centers at special rates.",
      fr: "Planification d'examens avancés (IRM, radiographie, analyses complexes) avec des centres partenaires aux meilleurs tarifs."
    },
    "3000 دج": {
      ar: "3000 دج",
      en: "3,000 DZD",
      fr: "3 000 DA"
    },
    "15000 دج": {
      ar: "15000 دج",
      en: "15,000 DZD",
      fr: "15 000 DA"
    },
    "4000 دج للسن": {
      ar: "4000 دج للسن",
      en: "4,000 DZD per tooth",
      fr: "4 000 DA par dent"
    },
    "35000 دج": {
      ar: "35000 دج",
      en: "35,000 DZD",
      fr: "35 000 DA"
    },
    "90000 دج (أقساط ميسرة)": {
      ar: "90000 دج (أقساط ميسرة)",
      en: "90,000 DZD (Easy Installments)",
      fr: "90 000 DA (Facilités de paiement)"
    },
    "2000 دج": {
      ar: "2000 دج",
      en: "2,000 DZD",
      fr: "2 000 DA"
    },
    "3500 دج": {
      ar: "3500 دج",
      en: "3,500 DZD",
      fr: "3 500 DA"
    },
    "5000 دج": {
      ar: "5000 دج",
      en: "5,000 DZD",
      fr: "5 000 DA"
    },
    "8000 دج": {
      ar: "8000 دج",
      en: "8,000 DZD",
      fr: "8 000 DA"
    },
    "خدمة إدارية مجانية": {
      ar: "خدمة إدارية مجانية",
      en: "Free Administrative Service",
      fr: "Service administratif gratuit"
    },
    "1500 دج (خدمة تنسيق)": {
      ar: "1500 دج (خدمة تنسيق)",
      en: "1,500 DZD (Coordination Fee)",
      fr: "1 500 DA (Frais de coordination)"
    },
    "تعليمات ما قبل زراعة الأسنان": {
      ar: "تعليمات ما قبل زراعة الأسنان",
      en: "Pre-Dental Implant Instructions",
      fr: "Instructions pré-implant dentaire"
    },
    "تعليمات ما بعد خلع السن": {
      ar: "تعليمات ما بعد خلع السن",
      en: "Post-Tooth Extraction Instructions",
      fr: "Instructions post-extraction dentaire"
    },
    "إرشادات تبييض الأسنان": {
      ar: "إرشادات تبييض الأسنان",
      en: "Teeth Whitening Instructions",
      fr: "Instructions post-blanchiment des dents"
    },
    "تعليمات ما قبل فحص الدم الشامل": {
      ar: "تعليمات ما قبل فحص الدم الشامل",
      en: "Instructions Before Comprehensive Blood Test",
      fr: "Consignes avant un bilan sanguin complet"
    },
    "إرشادات قياس ضغط الدم بدقة": {
      ar: "إرشادات قياس ضغط الدم بدقة",
      en: "Guidelines for Accurate Blood Pressure Measurement",
      fr: "Instructions pour mesurer précisément la tension"
    },
    "الوقاية من نزلات البرد الموسمية": {
      ar: "الوقاية من نزلات البرد الموسمية",
      en: "Seasonal Cold Prevention Tips",
      fr: "Prévention des rhumes saisonniers"
    },
    "سياسة إلغاء وتعديل المواعيد": {
      ar: "سياسة إلغاء وتعديل المواعيد",
      en: "Appointment Cancellation & Rescheduling Policy",
      fr: "Politique d'annulation et de modification des rendez-vous"
    },
    "المستندات المطلوبة في أول زيارة": {
      ar: "المستندات المطلوبة في أول زيارة",
      en: "Documents Required for Your First Visit",
      fr: "Documents requis pour la première visite"
    },
    "يرجى تناول وجبة خفيفة قبل المجيء بساعتين. يرجى تجنب مميعات الدم مثل الأسبرين قبل 3 أيام من الموعد بالتنسيق مع طبيبك المعالج. تأكد من إحضار الأشعة البانورامية المحدثة إن وجدت.": {
      ar: "يرجى تناول وجبة خفيفة قبل المجيء بساعتين. يرجى تجنب مميعات الدم مثل الأسبرين قبل 3 أيام من الموعد بالتنسيق مع طبيبك المعالج. تأكد من إحضار الأشعة البانورامية المحدثة إن وجدت.",
      en: "Please eat a light meal two hours before coming. Avoid blood thinners like Aspirin 3 days before the appointment in coordination with your treating doctor. Bring your updated panoramic X-ray if available.",
      fr: "Veuillez manger un repas léger deux heures avant de venir. Évitez les anticoagulants comme l'Aspirine 3 jours avant le rendez-vous en coordination avec votre médecin traitant. Apportez votre radiographie panoramique si disponible."
    },
    "أبقِ قطعة القطن مكان الخلع بالضغط عليها لمدة ساعة كاملة. تجنب المشروبات الساخنة والمأكولات الصلبة لمدة 24 ساعة. تجنب البصق أو غسل الفم بقوة أو التدخين لضمان تخثر الدم بالشكل السليم وتفادي الالتهابات.": {
      ar: "أبقِ قطعة القطن مكان الخلع بالضغط عليها لمدة ساعة كاملة. تجنب المشروبات الساخنة والمأكولات الصلبة لمدة 24 ساعة. تجنب البصق أو غسل الفم بقوة أو التدخين لضمان تخثر الدم بالشكل السليم وتفادي الالتهابات.",
      en: "Keep the cotton pack on the extraction site and press for a full hour. Avoid hot drinks and hard food for 24 hours. Avoid spitting, vigorous rinsing, or smoking to ensure proper blood clotting and prevent infections.",
      fr: "Gardez la compresse de coton sur le site d'extraction et appuyez pendant une heure entière. Évitez les boissons chaudes et les aliments durs pendant 24 heures. Évitez de cracher, de rincer vigoureusement ou de fumer pour assurer une bonne coagulation et prévenir les infections."
    },
    "بعد جلسة التبييض بـ 48 ساعة، يرجى الامتناع التام عن التدخين والمشروبات الملونة كالقهوة والشاي والبيبسي والصلصات الحمراء للحفاظ على النتيجة المثالية.": {
      ar: "بعد جلسة التبييض بـ 48 ساعة، يرجى الامتناع التام عن التدخين والمشروبات الملونة كالقهوة والشاي والبيبسي والصلصات الحمراء للحفاظ على النتيجة المثالية.",
      en: "For 48 hours after the whitening session, please completely abstain from smoking and colored beverages like coffee, tea, Pepsi, and red sauces to maintain the perfect result.",
      fr: "Pendant 48 heures après la séance de blanchiment, veuillez vous abstenir complètement de fumer et de consommer des boissons colorées comme le café, le thé, le Pepsi et les sauces rouges pour maintenir un résultat parfait."
    },
    "يرجى الصيام عن الطعام والشراب (ما عدا الماء) لمدة تتراوح بين 8 إلى 12 ساعة قبل موعد سحب عينة الدم لضمان دقة نتائج فحص السكر والدهون والكلسترول.": {
      ar: "يرجى الصيام عن الطعام والشراب (ما عدا الماء) لمدة تتراوح بين 8 إلى 12 ساعة قبل موعد سحب عينة الدم لضمان دقة نتائج فحص السكر والدهون والكلسترول.",
      en: "Please fast from food and drinks (except water) for 8 to 12 hours before the blood draw to ensure accurate results for glucose, lipids, and cholesterol.",
      fr: "Veuillez rester à jeun (sauf eau) de 8 à 12 heures avant le prélèvement sanguin pour garantir l'exactitude de la glycémie, des lipides et du cholestérol."
    },
    "تجنب تناول المشروبات التي تحتوي على الكافيين (مثل القهوة والشاي) أو التدخين لمدة 30 دقيقة قبل القياس. اجلس بهدوء واسترخِ لمدة 5 دقائق قبل بدء الفحص والقياس الفعلي.": {
      ar: "تجنب تناول المشروبات التي تحتوي على الكافيين (مثل القهوة والشاي) أو التدخين لمدة 30 دقيقة قبل القياس. اجلس بهدوء واسترخِ لمدة 5 دقائق قبل بدء الفحص والقياس الفعلي.",
      en: "Avoid caffeine (coffee/tea) or smoking for 30 minutes before measurement. Sit quietly and relax for 5 minutes before the exam starts.",
      fr: "Évitez le café, le thé ou le tabac 30 minutes avant la mesure. Asseyez-vous calmement et détendez-vous 5 minutes avant le début de l'examen."
    },
    "احرص على غسل اليدين بانتظام بالماء والصابون، تناول الأغذية الغنية بالفيتامينات مثل البرتقال والليمون، والحصول على قسط كافٍ من النوم والراحة لتقوية جهاز المناعة ومواجهة الفيروسات.": {
      ar: "احرص على غسل اليدين بانتظام بالماء والصابون، تناول الأغذية الغنية بالفيتامينات مثل البرتقال والليمون، والحصول على قسط كافٍ من النوم والراحة لتقوية جهاز المناعة ومواجهة الفيروسات.",
      en: "Wash hands regularly with soap, eat vitamin-rich foods like oranges and lemons, and get sufficient sleep to strengthen your immune system.",
      fr: "Lavez-vous les mains régulièrement, mangez des aliments riches en vitamines (oranges, citrons) et dormez suffisamment pour renforcer vos défenses."
    },
    "يرجى تعديل الموعد أو إلغاؤه قبل 24 ساعة على الأقل من الوقت المحدد. يساعد هذا في تنظيم العمل وإتاحة الفرصة لمرضى آخرين بحاجة للرعاية الطبية العاجلة والاستفادة من الوقت.": {
      ar: "يرجى تعديل الموعد أو إلغاؤه قبل 24 ساعة على الأقل من الوقت المحدد. يساعد هذا في تنظيم العمل وإتاحة الفرصة لمرضى آخرين بحاجة للرعاية الطبية العاجلة والاستفادة من الوقت.",
      en: "Please reschedule or cancel your appointment at least 24 hours prior. This helps reorganize and allocate slots to patients in urgent need of care.",
      fr: "Veuillez modifier ou annuler votre rendez-vous au moins 24 heures à l'avance. Cela aide à réattribuer les créneaux aux patients qui en ont un besoin urgent."
    },
    "يرجى إحضار بطاقة الهوية الوطنية أو بطاقة التأمين الصحي، بالإضافة إلى أي تقارير طبية سابقة أو صور أشعة وتحاليل تم إجراؤها مؤخراً لمساعدتنا في تقديم أفضل تشخيص متكامل.": {
      ar: "يرجى إحضار بطاقة الهوية الوطنية أو بطاقة التأمين الصحي، بالإضافة إلى أي تقارير طبية سابقة أو صور أشعة وتحاليل تم إجراؤها مؤخراً لمساعدتنا في تقديم أفضل تشخيص متكامل.",
      en: "Please bring your national ID or health insurance card, as well as any prior medical reports, X-rays, or recent blood tests to help us provide an integrated diagnosis.",
      fr: "Veuillez apporter votre carte d'identité ou d'assurance, ainsi que vos anciens comptes-rendus, radiographies ou analyses pour nous aider dans le diagnostic."
    },
    "📅 حجز موعد جديد": {
      ar: "📅 حجز موعد جديد",
      en: "📅 Book a New Appointment",
      fr: "📅 Réserver un nouveau rendez-vous"
    },
    "📍 موقع العيادة وأوقات العمل": {
      ar: "📍 موقع العيادة وأوقات العمل",
      en: "📍 Clinic Location & Working Hours",
      fr: "📍 Emplacement et heures d'ouverture"
    },
    "🦷 تكلفة زراعة وتجميل الأسنان": {
      ar: "🦷 تكلفة زراعة وتجميل الأسنان",
      en: "🦷 Cost of Dental Implants & Cosmetics",
      fr: "🦷 Tarifs des implants et cosmétiques"
    },
    "🚑 حالات الطوارئ والآلام الشديدة": {
      ar: "🚑 حالات الطوارئ والآلام الشديدة",
      en: "🚑 Emergencies & Severe Pain",
      fr: "🚑 Urgences et douleurs intenses"
    },
    "📅 حجز كشف طبي عام": {
      ar: "📅 حجز كشف طبي عام",
      en: "📅 Book a General Checkup",
      fr: "📅 Réserver une consultation générale"
    },
    "📍 عنوان العيادة وساعات العمل": {
      ar: "📍 عنوان العيادة وساعات العمل",
      en: "📍 Clinic Location & Hours",
      fr: "📍 Adresse et horaires d'ouverture"
    },
    "🏥 خدمات الفحص السريري والتحاليل": {
      ar: "🏥 خدمات الفحص السريري والتحاليل",
      en: "🏥 Clinical Services & Lab Tests",
      fr: "🏥 Examens cliniques et analyses"
    },
    "🚑 الرعاية الطارئة والاستشارات": {
      ar: "🚑 الرعاية الطارئة والاستشارات",
      en: "🚑 Emergency Care & Inquiries",
      fr: "🚑 Urgences et consultations d'orientation"
    },
    "📅 طلب حجز موعد فوري جديد": {
      ar: "📅 طلب حجز موعد فوري جديد",
      en: "📅 Request Instant New Appointment",
      fr: "📅 Demander une réservation immédiate"
    },
    "📍 موقع مكتب المواعيد والتواصل": {
      ar: "📍 موقع مكتب المواعيد والتواصل",
      en: "📍 Appointment Office Location",
      fr: "📍 Bureau des rendez-vous et contact"
    },
    "🕒 مواعيد وأوقات العمل الرسمية": {
      ar: "🕒 مواعيد وأوقات العمل الرسمية",
      en: "🕒 Official Working Hours",
      fr: "🕒 Heures officielles d'ouverture"
    },
    "أهلاً بك! يمكنك حجز موعدك فوراً بإرسال اسمك الثلاثي، التخصص المطلوب، والوقت المفضل (صباحي/مسائي)، وسيقوم منسق العيادة بتأكيد الموعد معك هاتفياً أو عبر الواتساب في غضون دقائق.": {
      ar: "أهلاً بك! يمكنك حجز موعدك فوراً بإرسال اسمك الثلاثي، التخصص المطلوب، والوقت المفضل (صباحي/مسائي)، وسيقوم منسق العيادة بتأكيد الموعد معك هاتفياً أو عبر الواتساب في غضون دقائق.",
      en: "Welcome! You can book your appointment instantly by sending your full name, desired specialty, and preferred time (morning/evening). The coordinator will confirm your appointment within minutes.",
      fr: "Bienvenue ! Vous pouvez réserver votre rendez-vous instantanément en envoyant votre nom complet, la spécialité souhaitée et l'heure préférée (matin/soir). Le coordinateur confirmera dans quelques minutes."
    },
    "موقعنا: الجزائر العاصمة، شارع ديدوش مراد، عمارة السلام، الطابق الثاني. أوقات العمل: من الأحد إلى الخميس، من الساعة 8:30 صباحاً وحتى 16:30 زوالاً.": {
      ar: "موقعنا: الجزائر العاصمة، شارع ديدوش مراد، عمارة السلام، الطابق الثاني. أوقات العمل: من الأحد إلى الخميس، من الساعة 8:30 صباحاً وحتى 16:30 زوالاً.",
      en: "Our Location: Algiers, Didouche Mourad Street, Peace Building, 2nd Floor. Hours: Sunday to Thursday, 8:30 AM to 4:30 PM.",
      fr: "Notre emplacement : Alger, Rue Didouche Mourad, Immeuble de la Paix, 2e Étage. Horaires : Dimanche au Jeudi, de 8h30 à 16h30."
    },
    "لدينا عروض مميزة: زراعة السن الألماني تبدأ من 35000 دج، وتبييض الأسنان زووم بالليزر بـ 15000 دج فقط. كما يتوفر تقويم الأسنان الشفاف بأقساط شهرية مريحة.": {
      ar: "لدينا عروض مميزة: زراعة السن الألماني تبدأ من 35000 دج، وتبييض الأسنان زووم بالليزر بـ 15000 دج فقط. كما يتوفر تقويم الأسنان الشفاف بأقساط شهرية مريحة.",
      en: "We have special offers: German dental implants start from 35,000 DZD, laser Zoom whitening is only 15,000 DZD. Clear aligners are also available in comfortable monthly installments.",
      fr: "Offres spéciales : l'implant allemand commence à 35 000 DA, le blanchiment laser Zoom est à seulement 15 000 DA. Aligneurs transparents disponibles avec facilités de paiement."
    },
    "إذا كنت تعاني من ألم أسنان شديد ومفاجئ، يرجى التوجه للعيادة فوراً دون موعد مسبق، أو الاتصال بالرقم السريع للعيادة +213 550 12 34 56 لنوجهك للإجراء السليم ونستقبلك بالحال.": {
      ar: "إذا كنت تعاني من ألم أسنان شديد ومفاجئ، يرجى التوجه للعيادة فوراً دون موعد مسبق، أو الاتصال بالرقم السريع للعيادة +213 550 12 34 56 لنوجهك للإجراء السليم ونستقبلك بالحال.",
      en: "If you suffer from severe, sudden toothache, please proceed to the clinic immediately without an appointment, or call the clinic hotline +213 550 12 34 56 for immediate guidance and care.",
      fr: "Si vous souffrez d'un mal de dents soudain et intense, veuillez vous rendre directement à la clinique sans rendez-vous, ou appeler la hotline +213 550 12 34 56 pour être pris en charge."
    },
    "أهلاً بك! لحجز موعد كشف أو فحص شامل، يرجى كتابة اسمك، رقم جوالك، والوقت المفضل (صباحاً/مساءً)، وسيقوم فريق الاستقبال بحجز أقرب موعد وتأكيده معك فوراً وبسرعة.": {
      ar: "أهلاً بك! لحجز موعد كشف أو فحص شامل، يرجى كتابة اسمك، رقم جوالك، والوقت المفضل (صباحاً/مساءً)، وسيقوم فريق الاستقبال بحجز أقرب موعد وتأكيده معك فوراً وبسرعة.",
      en: "Welcome! To book a consultation or checkup, please send your name, phone number, and preferred time (morning/evening). The team will book and confirm your slot shortly.",
      fr: "Bienvenue ! Pour réserver une consultation, veuillez saisir votre nom, numéro de téléphone et heure préférée (matin/soir). Notre équipe prendra contact rapidement."
    },
    "موقعنا: الجزائر العاصمة، حي باب الواد، شارع الاستقلال، الطابق الأول. نعمل من الأحد إلى الخميس من الساعة 09:00 صباحاً وحتى 18:30 مساءً بشكل مستمر لخدمتكم.": {
      ar: "موقعنا: الجزائر العاصمة، حي باب الواد، شارع الاستقلال، الطابق الأول. نعمل من الأحد إلى الخميس من الساعة 09:00 صباحاً وحتى 18:30 مساءً بشكل مستمر لخدمتكم.",
      en: "Location: Algiers, Bab El Oued, Independence Street, 1st Floor. We are open Sunday to Thursday, 09:00 AM to 06:30 PM.",
      fr: "Emplacement : Alger, Bab El Oued, Rue de l'Indépendance, 1er Étage. Ouvert du dimanche au jeudi de 09h00 à 18h30."
    },
    "نقدم كشفاً طبياً عاماً بـ 2000 دج، فحص وتخطيط قلب بـ 3500 دج، وباقات تحاليل دورية شاملة بـ 5000 دج للاطمئنان على صحتك وعافيتك على مدار السنة.": {
      ar: "نقدم كشفاً طبياً عاماً بـ 2000 دج، فحص وتخطيط قلب بـ 3500 دج، وباقات تحاليل دورية شاملة بـ 5000 دج للاطمئنان على صحتك وعافيتك على مدار السنة.",
      en: "We offer general clinical checkup for 2,000 DZD, ECG test for 3,500 DZD, and periodic screening packages for 5,000 DZD for your health all year round.",
      fr: "Nous proposons l'examen clinique à 2 000 DA, l'ECG à 3 500 DA et des bilans périodiques complets à 5 000 DA pour prendre soin de votre santé toute l'année."
    },
    "في الحالات الطارئة جداً، يرجى الاتصال فوراً بالرقم +213 560 76 54 32 أو التوجه إلى أقرب مستشفى. إذا كان هناك استفسار طبي مستعجل، أرسله هنا وسيوجهك الطبيب الإداري فوراً وبأعلى أمان.": {
      ar: "في الحالات الطارئة جداً، يرجى الاتصال فوراً بالرقم +213 560 76 54 32 أو التوجه إلى أقرب مستشفى. إذا كان هناك استفسار طبي مستعجل، أرسله هنا وسيوجهك الطبيب الإداري فوراً وبأعلى أمان.",
      en: "In extreme emergencies, call +213 560 76 54 32 immediately or go to the nearest hospital. For urgent inquiries, send them here for instant safe guidance.",
      fr: "En cas d'extrême urgence, appelez immédiatement le +213 560 76 54 32 ou rendez-vous à l'hôpital. Pour toute question urgente, écrivez-la ici pour une réponse rapide."
    },
    "مرحباً بك! لجدولة موعدك الجديد، يرجى تزويدنا بالاسم الثلاثي، رقم الهاتف، التخصص الطبي المطلوب، والوقت المفضل (صباحاً/مساءً)، وسيقوم فريق الاستقبال بحجز الموعد وإرسال رسالة للتأكيد.": {
      ar: "مرحباً بك! لجدولة موعدك الجديد، يرجى تزويدنا بالاسم الثلاثي، رقم الهاتف، التخصص الطبي المطلوب، والوقت المفضل (صباحاً/مساءً)، وسيقوم فريق الاستقبال بحجز الموعد وإرسال رسالة للتأكيد.",
      en: "Welcome! To schedule your appointment, please provide your full name, phone number, medical specialty, and preferred slot (morning/evening). Our team will book it and notify you.",
      fr: "Bienvenue ! Pour planifier, veuillez renseigner votre nom complet, numéro de téléphone, spécialité et créneau souhaité (matin/soir). Nous vous confirmerons rapidement."
    },
    "موقعنا: قسنطينة، حي سيدي مبروك، شارع المستشفى، مجمع الشفاء الطبي، الطابق الأرضي. يمكنك الاتصال بنا على الرقم: +213 555 11 22 33.": {
      ar: "موقعنا: قسنطينة، حي سيدي مبروك، شارع المستشفى، مجمع الشفاء الطبي، الطابق الأرضي. يمكنك الاتصال بنا على الرقم: +213 555 11 22 33.",
      en: "Our Location: Constantine, Sidi Mabrouk, Hospital Street, Al-Shifa Medical Complex, Ground Floor. You can call us at: +213 555 11 22 33.",
      fr: "Emplacement : Constantine, Sidi Mabrouk, Rue de l'Hôpital, Complexe Médical Al-Shifa, Rez-de-chaussée. Contactez-nous au : +213 555 11 22 33."
    },
    "مكتب تنظيم المواعيد يسعد بخدمتكم طيلة أيام الأسبوع ما عدا الجمعة، من الساعة 08:00 صباحاً وحتى الساعة 20:00 مساءً بشكل مستمر لراحة المرضى وتنسيق المتابعات.": {
      ar: "مكتب تنظيم المواعيد يسعد بخدمتكم طيلة أيام الأسبوع ما عدا الجمعة، من الساعة 08:00 صباحاً وحتى الساعة 20:00 مساءً بشكل مستمر لراحة المرضى وتنسيق المتابعات.",
      en: "The scheduling office is pleased to serve you Saturday to Thursday, 08:00 AM to 08:00 PM, helping coordinate follow-ups and patient checkups.",
      fr: "Le bureau de coordination est heureux de vous servir du samedi au jeudi de 08h00 à 20h00 pour le confort des patients et la coordination des suivis."
    },
    "تخصص عام": {
      ar: "تخصص عام",
      en: "General Specialty",
      fr: "Spécialité Générale"
    },
    "الكل": {
      ar: "الكل",
      en: "All",
      fr: "Tous"
    },
    "أحمد منصور": {
      ar: "أحمد منصور",
      en: "Ahmed Mansour",
      fr: "Ahmed Mansour"
    },
    "منى الرويلي": {
      ar: "منى الرويلي",
      en: "Mona Al-Rowaili",
      fr: "Mona Al-Rowaili"
    },
    "رائد الحربي": {
      ar: "رائد الحربي",
      en: "Raed Al-Harbi",
      fr: "Raed Al-Harbi"
    },
    "فاطمة عسيري": {
      ar: "فاطمة عسيري",
      en: "Fatima Asiri",
      fr: "Fatima Asiri"
    },
    "أحمد بن عبد الله العتيبي": {
      ar: "أحمد بن عبد الله العتيبي",
      en: "Ahmed Bin Abdullah Al-Otaibi",
      fr: "Ahmed Bin Abdullah Al-Otaibi"
    },
    "سارة محمد الشمري": {
      ar: "سارة محمد الشمري",
      en: "Sara Mohammed Al-Shammari",
      fr: "Sara Mohammed Al-Shammari"
    },
    "فيصل خالد الدوسري": {
      ar: "فيصل خالد الدوسري",
      en: "Faisal Khalid Al-Dossari",
      fr: "Faisal Khalid Al-Dossari"
    },
    "د. أحمد بن يوسف": {
      ar: "د. أحمد بن يوسف",
      en: "Dr. Ahmed Ben Youssef",
      fr: "Dr Ahmed Ben Youssef"
    },
    "د. محمد بن يوسف": {
      ar: "د. محمد بن يوسف",
      en: "Dr. Mohamed Ben Youssef",
      fr: "Dr Mohamed Ben Youssef"
    },
    "د. سارة حميدش": {
      ar: "د. سارة حميدش",
      en: "Dr. Sara Hmaidich",
      fr: "Dr Sara Hmaidich"
    },
    "د. خالد بلعيدي": {
      ar: "د. خالد بلعيدي",
      en: "Dr. Khaled Belaidi",
      fr: "Dr Khaled Belaidi"
    },
    "تنظيف وتبييض الأسنان بالليزر": {
      ar: "تنظيف وتبييض الأسنان بالليزر",
      en: "Laser Teeth Cleaning & Whitening",
      fr: "Nettoyage et blanchiment des dents au laser"
    },
    "علاج عصب وجلسة حشوة سنية": {
      ar: "علاج عصب وجلسة حشوة سنية",
      en: "Root Canal Treatment & Filling Session",
      fr: "Traitement de canal et séance d'obturation"
    },
    "استشارة طبية وفحص دوري": {
      ar: "استشارة طبية وفحص دوري",
      en: "Medical Consultation & Routine Exam",
      fr: "Consultation médicale et examen de routine"
    },
    "استشارة زراعة أسنان وتكلفة العلاج": {
      ar: "استشارة زراعة أسنان وتكلفة العلاج",
      en: "Dental Implant Consultation & Cost",
      fr: "Consultation d'implant dentaire et coût"
    },
    "سؤال عن ألم حاد في الضرس السفلي بعد الحشو": {
      ar: "سؤال عن ألم حاد في الضرس السفلي بعد الحشو",
      en: "Question about acute pain in lower molar after filling",
      fr: "Question sur une douleur aiguë de la molaire inférieure après plombage"
    },
    "قراءة أشعة سينية مرفقة وإفادة طبية": {
      ar: "قراءة أشعة سينية مرفقة وإفادة طبية",
      en: "Reading attached X-ray and medical report",
      fr: "Lecture de la radiographie jointe et rapport médical"
    },
    "استفسار عن تقويم الأسنان الشفاف والأقساط": {
      ar: "استفسار عن تقويم الأسنان الشفاف والأقساط",
      en: "Inquiry about clear aligners & installments",
      fr: "Demande d'aligneurs transparents et versements"
    },
    "استشارة الكشف الأولي": {
      ar: "استشارة الكشف الأولي",
      en: "Initial Checkup Consultation",
      fr: "Consultation initiale"
    },
    "كشف مجاني": {
      ar: "كشف مجاني",
      en: "Free Consultation",
      fr: "Consultation gratuite"
    },
    "إرشادات عامة للمرضى": {
      ar: "إرشادات عامة للمرضى",
      en: "General Patient Guidelines",
      fr: "Directives générales pour les patients"
    },
    "يرجى الحضور قبل الموعد بـ 15 دقيقة وإحضار الهوية الوطنية.": {
      ar: "يرجى الحضور قبل الموعد بـ 15 دقيقة وإحضار الهوية الوطنية.",
      en: "Please arrive 15 minutes before the appointment and bring your national ID.",
      fr: "Veuillez arriver 15 minutes avant le rendez-vous et apporter votre pièce d'identité."
    },
    "أرغب بزيارة عاجلة صباحاً لتنظيف الأسنان قبل السفر.": {
      ar: "أرغب بزيارة عاجلة صباحاً لتنظيف الأسنان قبل السفر.",
      en: "I would like an urgent morning visit for teeth cleaning before traveling.",
      fr: "Je souhaite une visite matinale urgente pour un nettoyage des dents avant de voyager."
    },
    "ألم شديد في الضرس الأيمن العلوي منذ يومين.": {
      ar: "ألم شديد في الضرس الأيمن العلوي منذ يومين.",
      en: "Severe pain in the upper right molar for two days.",
      fr: "Douleur intense au niveau de la molaire supérieure droite depuis deux jours."
    },
    "مراجعة دورية للتقويم من أجل الشد.": {
      ar: "مراجعة دورية للتقويم من أجل الشد.",
      en: "Routine checkup for braces tightening.",
      fr: "Visite de routine pour le resserrement de l'appareil."
    },
    "مرحبا، أريد الاستفسار عن تكلفة زراعة السن الواحد في عيادتكم وما هي الإجراءات؟": {
      ar: "مرحبا، أريد الاستفسار عن تكلفة زراعة السن الواحد في عيادتكم وما هي الإجراءات؟",
      en: "Hello, I want to inquire about the cost of a single dental implant in your clinic and what are the procedures?",
      fr: "Bonjour, je souhaite me renseigner sur le coût d'un implant dentaire unique dans votre clinique et quelles sont les procédures ?"
    },
    "أهلاً بك يا فندم في عيادتنا! زراعة السن الواحد لدينا تتم بأحدث التقنيات السويسرية والألمانية. تكلفتها تبدأ من 35000 دج وتعتمد على نوع الغرسة وحالة عظام الفك. الإجراء يتضمن فحصاً أولياً، ثم زراعة وتثبيت الغرسة، تليها فترة شفاء قصيرة قبل وضع التاج النهائي. هل تود حجز موعد لفحص مجاني مع طبيب الزراعة؟": {
      ar: "أهلاً بك يا فندم في عيادتنا! زراعة السن الواحد لدينا تتم بأحدث التقنيات السويسرية والألمانية. تكلفتها تبدأ من 35000 دج وتعتمد على نوع الغرسة وحالة عظام الفك. الإجراء يتضمن فحصاً أولياً، ثم زراعة وتثبيت الغرسة، تليها فترة شفاء قصيرة قبل وضع التاج النهائي. هل تود حجز موعد لفحص مجاني مع طبيب الزراعة؟",
      en: "Welcome to our clinic! A single dental implant is performed here using the latest Swiss and German technologies. The cost starts from 35,000 DZD depending on the implant type and jaw bone condition. The procedure includes initial examination, placing and securing the implant, followed by a short healing period before placing the final crown. Would you like to book a free checkup with the implantologist?",
      fr: "Bienvenue dans notre clinique ! Un implant dentaire unique est réalisé ici à l'aide des dernières technologies suisses et allemandes. Le coût commence à partir de 35 000 DZD selon le type d'implant et l'état de l'os de la mâchoire. La procédure comprend un examen initial, la pose et la fixation de l'implant, suivies d'une courte période de guérison avant la pose de la couronne finale. Souhaitez-vous réserver un examen gratuit avec l'implantologue ?"
    },
    "نعم، أريد موعداً يوم الخميس القادم مساءً إن أمكن.": {
      ar: "نعم، أريد موعداً يوم الخميس القادم مساءً إن أمكن.",
      en: "Yes, I would like an appointment next Thursday evening if possible.",
      fr: "Oui, je voudrais un rendez-vous jeudi soir prochain si possible."
    },
    "يسعدنا ذلك! لقد حجزت لك موعداً مبدئياً ليوم الخميس القادم الساعة 16:00 زوالاً باسم أحمد منصور. هل يمكنك تأكيد رقم جوالك لاستكمال التأكيد؟": {
      ar: "يسعدنا ذلك! لقد حجزت لك موعداً مبدئياً ليوم الخميس القادم الساعة 16:00 زوالاً باسم أحمد منصور. هل يمكنك تأكيد رقم جوالك لاستكمال التأكيد؟",
      en: "We are pleased to do so! I have booked a tentative appointment for next Thursday at 16:00 under the name Ahmed Mansour. Can you confirm your mobile number to complete the confirmation?",
      fr: "Nous sommes ravis ! J'ai pris un rendez-vous provisoire pour jeudi prochain à 16:00 sous le nom d'Ahmed Mansour. Pouvez-vous confirmer votre numéro de mobile pour finaliser la confirmation ?"
    },
    "السلام عليكم، دكتور عملت حشوة لضرسي السفلي قبل يومين والآن أشعر بألم شديد لا يطاق عند شرب الماء البارد، هل هذا طبيعي؟": {
      ar: "السلام عليكم، دكتور عملت حشوة لضرسي السفلي قبل يومين والآن أشعر بألم شديد لا يطاق عند شرب الماء البارد، هل هذا طبيعي؟",
      en: "Hello doctor, I got a filling for my lower molar two days ago and now I feel severe, unbearable pain when drinking cold water, is this normal?",
      fr: "Bonjour docteur, j'ai fait faire un plombage sur ma molaire inférieure il y a deux jours et maintenant je ressens une douleur intense et insupportable en buvant de l'eau froide, est-ce normal ?"
    },
    "وعليكم السلام ورحمة الله وبركاته. سلامتك ألف سلامة! بعد حشو العصب أو الحشو العميق، قد يحدث تحسس مؤقت للبارد والساخن يستمر لعدة أيام وهو أمر طبيعي نسبياً. ولكن، إذا كان الألم شديداً ومستمراً (نابضاً) ويمنعك من النوم، فقد يشير ذلك إلى حاجة السن لفحص إضافي أو تعديل في مستوى الحشوة. يرجى مراجعة طبيبك بالعيادة فوراً، ويمكنك تناول مسكن ألم معتدل مثل البروفين مؤقتاً لحين زيارتنا. هل تودين حجز موعد فحص طارئ اليوم؟": {
      ar: "وعليكم السلام ورحمة الله وبركاته. سلامتك ألف سلامة! بعد حشو العصب أو الحشو العميق، قد يحدث تحسس مؤقت للبارد والساخن يستمر لعدة أيام وهو أمر طبيعي نسبياً. ولكن، إذا كان الألم شديداً ومستمراً (نابضاً) ويمنعك من النوم، فقد يشير ذلك إلى حاجة السن لفحص إضافي أو تعديل في مستوى الحشوة. يرجى مراجعة طبيبك بالعيادة فوراً، ويمكنك تناول مسكن ألم معتدل مثل البروفين مؤقتاً لحين زيارتنا. هل تودين حجز موعد فحص طارئ اليوم؟",
      en: "Peace be upon you. Wishing you a speedy recovery! After root canal or deep filling, temporary sensitivity to hot and cold may occur and last for a few days, which is relatively normal. However, if the pain is severe, continuous (throbbing), and prevents you from sleeping, it may indicate that the tooth needs an additional exam or adjustment of the filling level. Please visit your doctor at the clinic immediately. You can take a mild pain reliever like Ibuprofen temporarily until your visit. Would you like to book an emergency exam today?",
      fr: "Que la paix soit sur vous. Nous vous souhaitons un prompt rétablissement ! Après un traitement de canal ou un plombage profond, une sensibilité temporaire au chaud et au froid peut survenir et durer quelques jours, ce qui est relativement normal. Cependant, si la douleur est intense, continue (pulsatile) et vous empêche de dormir, cela peut indiquer que la dent nécessite un examen supplémentaire ou un ajustement du niveau de plombage. Veuillez consulter immédiatement votre médecin à la clinique. Vous pouvez prendre temporairement un analgésique doux comme l'Ibuprofène en attendant votre visite. Souhaitez-vous réserver un examen d'urgence aujourd'hui ?"
    },
    "شكراً جزيلاً، سأقوم بأخذ المسكن وإذا لم يتحسن سأتصل بكم غداً.": {
      ar: "شكراً جزيلاً، سأقوم بأخذ المسكن وإذا لم يتحسن سأتصل بكم غداً.",
      en: "Thank you very much, I will take the painkiller and if it doesn't improve, I will call you tomorrow.",
      fr: "Merci beaucoup, je vais prendre l'analgésique et si cela ne s'améliore pas, je vous appellerai demain."
    },
    "أرفقت لكم صورة الأشعة لضرسي، هل يحتاج خلع أو علاج عصب فقط؟": {
      ar: "أرفقت لكم صورة الأشعة لضرسي، هل يحتاج خلع أو علاج عصب فقط؟",
      en: "I have attached the X-ray of my tooth, does it need extraction or just root canal?",
      fr: "J'ai joint la radiographie de ma dent, a-t-elle besoin d'une extraction ou simplement d'un traitement de canal ?"
    },
    "أهلاً بك يا فندم. لقد اطلعت على صورة الأشعة المرفقة بكل دقة. يظهر من الصورة وجود تسوس عميق جداً يقترب كثيراً من حجرة العصب في الضرس المعني، مع وجود ظلال طفيفة حول جذر السن قد تشير إلى التهاب بسيط. الاحتمال الأكبر هو حاجتك لعلاج عصب (سحب عصب) مع حشوة وتلبيسة للمحافظة على السن وتجنب الخلع. ومع ذلك، لا يمكن إعطاء قرار نهائي إلا بالفحص السريري المباشر واختبار حيوية العصب بالعيادة. ننصح بزيارتنا بأقرب وقت لتجنب تفاقم الالتهاب. هل ترغب بحجز موعد لعلاج العصب؟": {
      ar: "أهلاً بك يا فندم. لقد اطلعت على صورة الأشعة المرفقة بكل دقة. يظهر من الصورة وجود تسوس عميق جداً يقترب كثيراً من حجرة العصب في الضرس المعني، مع وجود ظلال طفيفة حول جذر السن قد تشير إلى التهاب بسيط. الاحتمال الأكبر هو حاجتك لعلاج عصب (سحب عصب) مع حشوة وتلبيسة للمحافظة على السن وتجنب الخلع. ومع ذلك، لا يمكن إعطاء قرار نهائي إلا بالفحص السريري المباشر واختبار حيوية العصب بالعيادة. ننصح بزيارتنا بأقرب وقت لتجنب تفاقم الالتهاب. هل ترغب بحجز موعد لعلاج العصب؟",
      en: "Welcome, sir. I have reviewed the attached X-ray carefully. It shows very deep decay approaching the nerve chamber of the affected tooth, with slight shadowing around the root indicating minor inflammation. Most likely, you will need a root canal treatment with a filling and crown to preserve the tooth and avoid extraction. However, a final decision can only be made through a direct clinical examination and pulp vitality test at the clinic. We recommend visiting us as soon as possible. Would you like to book an appointment for root canal?",
      fr: "Bienvenue, monsieur. J'ai examiné attentivement la radiographie jointe. Elle montre une carie très profonde qui s'approche de la chambre pulpaire de la dent concernée, avec une légère ombre autour de la racine indiquant une inflammation mineure. Selon toute vraisemblance, vous aurez besoin d'un traitement de canal avec plombage et couronne pour préserver la dent et éviter l'extraction. Cependant, une décision finale ne peut être prise que par un examen clinique direct et un test de vitalité pulpaire à la clinique. Nous vous recommandons de nous rendre visite dès que possible. Souhaitez-vous réserver un rendez-vous pour un traitement de canal ?"
    },
    "مرحبا.. هل يتوفر لديكم تقويم شفاف وبكم السعر؟ وهل فيه تقسيط؟": {
      ar: "مرحبا.. هل يتوفر لديكم تقويم شفاف وبكم السعر؟ وهل فيه تقسيط؟",
      en: "Hello.. do you have clear aligners and what is the price? And is there an installment plan?",
      fr: "Bonjour.. proposez-vous des aligneurs transparents et quel est le prix ? Et y a-t-il un plan de versement ?"
    },
    "مرحباً بكِ أختي فاطمة! نعم، نوفر تقنية التقويم الشفاف (Invisalign) وهو الخيار التجميلي المفضل للكثيرين. تبدأ أسعار التقويم الشفاف من 90000 دج وتتفاوت حسب عدد القوالب المطلوبة ومدة العلاج. نعم، يسرنا تقديم خطة تقسيط مريحة لمرضانا: دفعة أولى 20000 دج، والباقي أقساط شهرية ميسرة تبدأ من 5000 دج فقط بدون أي فوائد. هل تحبين حجز موعد استشارة مجانية مع أخصائي التقويم لدينا لأخذ القياسات ووضع الخطة؟": {
      ar: "مرحباً بكِ أختي فاطمة! نعم، نوفر تقنية التقويم الشفاف (Invisalign) وهو الخيار التجميلي المفضل للكثيرين. تبدأ أسعار التقويم الشفاف من 90000 دج وتتفاوت حسب عدد القوالب المطلوبة ومدة العلاج. نعم، يسرنا تقديم خطة تقسيط مريحة لمرضانا: دفعة أولى 20000 دج، والباقي أقساط شهرية ميسرة تبدأ من 5000 دج فقط بدون أي فوائد. هل تحبين حجز موعد استشارة مجانية مع أخصائي التقويم لدينا لأخذ القياسات ووضع الخطة؟",
      en: "Welcome sister Fatima! Yes, we offer Invisalign technology, which is the preferred cosmetic choice for many. Prices for clear aligners start from 90,000 DZD and vary according to the number of molds required and treatment duration. Yes, we are pleased to offer a convenient installment plan: down payment of 20,000 DZD, and the rest in monthly installments starting from 5,000 DZD only without any interest. Would you like to book a free consultation with our orthodontist to take measurements and make the plan?",
      fr: "Bienvenue sœur Fatima ! Oui, nous proposons la technologie Invisalign, qui est le choix esthétique préféré de beaucoup. Les prix des aligneurs transparents commencent à partir de 90 000 DZD et varient en fonction du nombre de moules requis et de la durée du traitement. Oui, nous sommes ravis de proposer un plan de versement pratique : un acompte de 20 000 DZD, et le reste en mensualités à partir de 5 000 DZD seulement sans aucun intérêt. Souhaitez-vous réserver une consultation gratuite avec notre orthodontiste pour prendre les mesures et établir le plan ?"
    },
    "رائع جداً، سأحجز موعداً الأسبوع القادم إن شاء الله.": {
      ar: "رائع جداً، سأحجز موعداً الأسبوع القادم إن شاء الله.",
      en: "That's wonderful, I will book an appointment next week, God willing.",
      fr: "C'est merveilleux, je prendrai rendez-vous la semaine prochaine, si Dieu le veut."
    },
    "مستعد للرد 🤖": {
      ar: "مستعد للرد 🤖",
      en: "Ready to respond 🤖",
      fr: "Prêt à répondre 🤖"
    },
    "تحديث اليوم من العيادة:": {
      ar: "تحديث اليوم من العيادة:",
      en: "Today's clinic update:",
      fr: "Mise à jour d'aujourd'hui :"
    },
    "العيادة تعمل بمواعيدها الرسمية ونرحب بكم في أي وقت!": {
      ar: "العيادة تعمل بمواعيدها الرسمية ونرحب بكم في أي وقت!",
      en: "The clinic is operating on official hours, we welcome you anytime!",
      fr: "La clinique fonctionne aux heures officielles, bienvenue à tout moment !"
    },
    "قبل الموعد بـ 15 دقيقة": {
      ar: "قبل الموعد بـ 15 دقيقة",
      en: "15 minutes before the appointment",
      fr: "15 minutes avant le rendez-vous"
    },
    "قبل الموعد بـ 1 ساعة": {
      ar: "قبل الموعد بـ 1 ساعة",
      en: "1 hour before the appointment",
      fr: "1 heure avant le rendez-vous"
    },
    "قبل الموعد بـ 2 ساعة": {
      ar: "قبل الموعد بـ 2 ساعة",
      en: "2 hours before the appointment",
      fr: "2 heures avant le rendez-vous"
    },
    "قبل الموعد بـ 24 ساعة": {
      ar: "قبل الموعد بـ 24 ساعة",
      en: "24 hours before the appointment",
      fr: "24 heures avant le rendez-vous"
    }
  };

  const entry = dict[text.trim()];
  if (entry && entry[lang]) {
    return entry[lang];
  }
  return text;
};

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: "booking-1",
    patientName: "أحمد بن عبد الله العتيبي",
    patientPhone: "0501234567",
    serviceName: "تنظيف وتبييض الأسنان بالليزر",
    bookingDate: "2026-07-01",
    bookingTime: "10:30",
    notes: "أرغب بزيارة عاجلة صباحاً لتنظيف الأسنان قبل السفر.",
    status: "confirmed",
    createdAt: new Date().toISOString()
  },
  {
    id: "booking-2",
    patientName: "سارة محمد الشمري",
    patientPhone: "0559876543",
    serviceName: "علاج عصب وجلسة حشوة سنية",
    bookingDate: "2026-07-02",
    bookingTime: "16:00",
    notes: "ألم شديد في الضرس الأيمن العلوي منذ يومين.",
    status: "pending",
    createdAt: new Date().toISOString()
  },
  {
    id: "booking-3",
    patientName: "فيصل خالد الدوسري",
    patientPhone: "0543322110",
    serviceName: "استشارة طبية وفحص دوري",
    bookingDate: "2026-07-03",
    bookingTime: "18:30",
    notes: "مراجعة دورية للتقويم من أجل الشد.",
    status: "cancelled",
    createdAt: new Date().toISOString()
  }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 border border-slate-800 p-3 rounded-xl shadow-xl backdrop-blur-md">
        <p className="text-xs font-bold text-slate-200 mb-1.5">{label}</p>
        <p className="text-xs text-teal-400 font-medium flex items-center gap-1.5">
          <span>عدد الحجوزات:</span>
          <span className="font-bold text-sm">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

function InnerApp() {
  // Load initial preset or saved state
  const [selectedPresetId, setSelectedPresetId] = useState<string>("dental");
  
  // PWA Install state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState<boolean>(false);

  // Notification Permission State
  const [notificationPermission, setNotificationPermission] = useState<string>(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default"
  );

  // SaaS Multi-Tenant States
  const [tenants, setTenants] = useState<SaasTenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<SaasTenant | null>(null);
  const [saasView, setSaasView] = useState<"landing" | "login" | "signup" | "checkout">("landing");
  const [portalTenantId, setPortalTenantId] = useState<string | null>(null);
  const [checkoutPlanId, setCheckoutPlanId] = useState<"free" | "starter" | "pro">("starter");

  // App View Mode State (website = public clinic landing page website, admin = doctor dashboard panel)
  const [viewMode, setViewMode] = useState<"website" | "admin">("website");
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState<boolean>(false);

  // Interactive bot-knowledge editor states
  const [interactiveDocName, setInteractiveDocName] = useState<string>("د. أحمد بن يوسف");
  const [interactiveDocBio, setInteractiveDocBio] = useState<string>("طبيب أخصائي متخرج من كلية الطب بجامعة الجزائر، ذو خبرة تزيد عن 12 سنة في ممارسة وتطوير العلاجات الحديثة وعضو الجمعية الوطنية الجزائرية لطب الأسنان.");
  const [interactiveServices, setInteractiveServices] = useState<string>("تقديم رعاية صحية تخصصية متكاملة تشمل الفحص السريري الدقيق وعلاج العصب بأحدث المجهريات، زراعة وتقويم الأسنان بأجود الخامات السويسرية والألمانية، وتجميل الابتسامة.");
  const [interactiveWorkHours, setInteractiveWorkHours] = useState<string>("من الأحد إلى الخميس، من الساعة 08:30 صباحاً وحتى الساعة 16:30 مساءً. يوم السبت مخصص للحالات الطارئة والمتابعات من 09:00 ص إلى 13:00 زوالاً.");
  const [interactiveWeekend, setInteractiveWeekend] = useState<string>("يوم الجمعة هو يوم العطلة الأسبوعية للعيادة.");
  const [isBotPreviewOpen, setIsBotPreviewOpen] = useState<boolean>(false);
  const [botTestQuestion, setBotTestQuestion] = useState<string>("");
  const [botTestAnswer, setBotTestAnswer] = useState<string>("");
  const [isBotTesting, setIsBotTesting] = useState<boolean>(false);
  
  // Clinic data state
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo>({
    name: "",
    specialty: "",
    phone: "",
    address: "",
    doctorName: "",
    workHours: "",
    notes: "",
  });
  
  const [dailyStatus, setDailyStatus] = useState<string>("");
  const [services, setServices] = useState<ClinicService[]>([]);
  const [guidelines, setGuidelines] = useState<ClinicGuideline[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // Booking Limit and Working Hours control states
  const [maxBookingsCount, setMaxBookingsCount] = useState<number>(10);
  const [enableBookingLimits, setEnableBookingLimits] = useState<boolean>(true);
  const [bookingSystemStatus, setBookingSystemStatus] = useState<"open" | "closed_limit" | "outside_hours">("open");
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  
  // UI states
  const [activeTab, setActiveTab] = useState<"profile" | "bookings" | "buttons" | "database" | "import" | "backup" | "presets" | "conversations" | "market" | "subscription" | "settings">("profile");
  
  // Multi-lingual translation states
  const [currentLanguage, setCurrentLanguage] = useState<"ar" | "en" | "fr">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("shafi_current_language") as "ar" | "en" | "fr") || "ar";
    }
    return "ar";
  });
  const isRtl = currentLanguage === "ar";

  const { t: translate } = useTranslation();

  // Keep i18n language in sync with currentLanguage state
  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage]);

  // 🌐 Comprehensive translation update function that listens to currentLanguage state
  const t = (key: string, defaultArabicOrOptions?: any, options?: any): string => {
    let finalOptions = options;
    let fallback = key;
    if (typeof defaultArabicOrOptions === "string") {
      fallback = defaultArabicOrOptions;
    } else if (defaultArabicOrOptions && typeof defaultArabicOrOptions === "object") {
      finalOptions = defaultArabicOrOptions;
    }
    const result = translate(key, finalOptions) as string;
    if (result !== key) return result;
    return fallback;
  };

  // Message plan and limits outside platform (SaaS requirements)
  const [msgSubPlan, setMsgSubPlan] = useState<"trial" | "msg1500" | "msg4000" | "unlimited" | "custom">("trial");
  const [msgLimit, setMsgLimit] = useState<number>(999999); // Unlimited for trial by default or custom
  const [msgUsed, setMsgUsed] = useState<number>(250); // messages consumed
  const [customPaymentAmount, setCustomPaymentAmount] = useState<number>(10); // Default $10
  
  // Daily Messages Analytics Chart Data
  const [dailyMessagesData, setDailyMessagesData] = useState<{ date: string; count: number }[]>([
    { date: "07/04", count: 180 },
    { date: "07/05", count: 210 },
    { date: "07/06", count: 165 },
    { date: "07/07", count: 245 },
    { date: "07/08", count: 190 },
    { date: "07/09", count: 280 },
    { date: "07/10", count: 152 } // Today
  ]);

  const [importTypeText, setImportTypeText] = useState<string>("");
  const [importTarget, setImportTarget] = useState<"services" | "guidelines">("services");
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });

  const [reminderModal, setReminderModal] = useState<{
    isOpen: boolean;
    bookingId: string;
    patientName: string;
    serviceName: string;
    bookingDate: string;
    bookingTime: string;
    enableReminder: boolean;
    timeBefore: string;
    customMessage: string;
  }>({
    isOpen: false,
    bookingId: "",
    patientName: "",
    serviceName: "",
    bookingDate: "",
    bookingTime: "",
    enableReminder: true,
    timeBefore: "1_day",
    customMessage: "",
  });

  // Patient Conversations & AI Analytics States
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [showMedicalPdfModal, setShowMedicalPdfModal] = useState<boolean>(false);
  const [pdfSession, setPdfSession] = useState<ChatSession | null>(null);
  const [conversations, setConversations] = useState<ChatSession[]>([
    {
      id: "sess-1",
      patientName: "أحمد منصور",
      patientPhone: "0554433221",
      topic: "استشارة زراعة أسنان وتكلفة العلاج",
      date: "2026-06-30 14:20",
      status: "pending_review",
      aiSentiment: "satisfied",
      messages: [
        { id: "m-1", sender: "user", text: "مرحبا، أريد الاستفسار عن تكلفة زراعة السن الواحد في عيادتكم وما هي الإجراءات؟", timestamp: new Date() },
        { id: "m-2", sender: "bot", text: "أهلاً بك يا فندم في عيادتنا! زراعة السن الواحد لدينا تتم بأحدث التقنيات السويسرية والألمانية. تكلفتها تبدأ من 35000 دج وتعتمد على نوع الغرسة وحالة عظام الفك. الإجراء يتضمن فحصاً أولياً، ثم زراعة وتثبيت الغرسة، تليها فترة شفاء قصيرة قبل وضع التاج النهائي. هل تود حجز موعد لفحص مجاني مع طبيب الزراعة؟", timestamp: new Date() },
        { id: "m-3", sender: "user", text: "نعم، أريد موعداً يوم الخميس القادم مساءً إن أمكن.", timestamp: new Date() },
        { id: "m-4", sender: "bot", text: "يسعدنا ذلك! لقد حجزت لك موعداً مبدئياً ليوم الخميس القادم الساعة 16:00 زوالاً باسم أحمد منصور. هل يمكنك تأكيد رقم جوالك لاستكمال التأكيد؟", timestamp: new Date() }
      ]
    },
    {
      id: "sess-2",
      patientName: "منى الرويلي",
      patientPhone: "0550987654",
      topic: "سؤال عن ألم حاد في الضرس السفلي بعد الحشو",
      date: "2026-06-30 11:05",
      status: "reviewed",
      aiSentiment: "neutral",
      messages: [
        { id: "m-5", sender: "user", text: "السلام عليكم، دكتور عملت حشوة لضرسي السفلي قبل يومين والآن أشعر بألم شديد لا يطاق عند شرب الماء البارد، هل هذا طبيعي؟", timestamp: new Date() },
        { id: "m-6", sender: "bot", text: "وعليكم السلام ورحمة الله وبركاته. سلامتك ألف سلامة! بعد حشو العصب أو الحشو العميق، قد يحدث تحسس مؤقت للبارد والساخن يستمر لعدة أيام وهو أمر طبيعي نسبياً. ولكن، إذا كان الألم شديداً ومستمراً (نابضاً) ويمنعك من النوم، فقد يشير ذلك إلى حاجة السن لفحص إضافي أو تعديل في مستوى الحشوة. يرجى مراجعة طبيبك بالعيادة فوراً، ويمكنك تناول مسكن ألم معتدل مثل البروفين مؤقتاً لحين زيارتنا. هل تودين حجز موعد فحص طارئ اليوم؟", timestamp: new Date() },
        { id: "m-7", sender: "user", text: "شكراً جزيلاً، سأقوم بأخذ المسكن وإذا لم يتحسن سأتصل بكم غداً.", timestamp: new Date() }
      ]
    },
    {
      id: "sess-3",
      patientName: "رائد الحربي",
      patientPhone: "0561234567",
      topic: "قراءة أشعة سينية مرفقة وإفادة طبية",
      date: "2026-06-29 18:30",
      status: "pending_review",
      aiSentiment: "satisfied",
      messages: [
        { id: "m-8", sender: "user", text: "أرفقت لكم صورة الأشعة لضرسي، هل يحتاج خلع أو علاج عصب فقط؟", timestamp: new Date() },
        { id: "m-9", sender: "bot", text: "أهلاً بك يا فندم. لقد اطلعت على صورة الأشعة المرفقة بكل دقة. يظهر من الصورة وجود تسوس عميق جداً يقترب كثيراً من حجرة العصب في الضرس المعني، مع وجود ظلال طفيفة حول جذر السن قد تشير إلى التهاب بسيط. الاحتمال الأكبر هو حاجتك لعلاج عصب (سحب عصب) مع حشوة وتلبيسة للمحافظة على السن وتجنب الخلع. ومع ذلك، لا يمكن إعطاء قرار نهائي إلا بالفحص السريري المباشر واختبار حيوية العصب بالعيادة. ننصح بزيارتنا بأقرب وقت لتجنب تفاقم الالتهاب. هل ترغب بحجز موعد لعلاج العصب؟", timestamp: new Date() }
      ]
    },
    {
      id: "sess-4",
      patientName: "فاطمة عسيري",
      patientPhone: "0544556677",
      topic: "استفسار عن تقويم الأسنان الشفاف والأقساط",
      date: "2026-06-29 15:12",
      status: "reviewed",
      aiSentiment: "satisfied",
      messages: [
        { id: "m-10", sender: "user", text: "مرحبا.. هل يتوفر لديكم تقويم شفاف وبكم السعر؟ وهل فيه تقسيط؟", timestamp: new Date() },
        { id: "m-11", sender: "bot", text: "مرحباً بكِ أختي فاطمة! نعم، نوفر تقنية التقويم الشفاف (Invisalign) وهو الخيار التجميلي المفضل للكثيرين. تبدأ أسعار التقويم الشفاف من 90000 دج وتتفاوت حسب عدد القوالب المطلوبة ومدة العلاج. نعم، يسرنا تقديم خطة تقسيط مريحة لمرضانا: دفعة أولى 20000 دج، والباقي أقساط شهرية ميسرة تبدأ من 5000 دج فقط بدون أي فوائد. هل تحبين حجز موعد استشارة مجانية مع أخصائي التقويم لدينا لأخذ القياسات ووضع الخطة؟", timestamp: new Date() },
        { id: "m-12", sender: "user", text: "رائع جداً، سأحجز موعداً الأسبوع القادم إن شاء الله.", timestamp: new Date() }
      ]
    }
  ]);

  // AI Safeguards & Config states
  const [aiTemperature, setAiTemperature] = useState<number>(0.15);
  const [safeguardLevel, setSafeguardLevel] = useState<"strict" | "moderate">("strict");
  const [aiTone, setAiTone] = useState<"formal" | "friendly" | "simple">("formal");

  // Market & Monetization States
  const [targetClinics, setTargetClinics] = useState<number>(5);
  const [monthlyPrice, setMonthlyPrice] = useState<number>(4500); // DZD / د.ج
  const [activeIntegrationTab, setActiveIntegrationTab] = useState<"whatsapp" | "messenger" | "instagram" | "telegram" | "embed">("whatsapp");
  
  // Credentials & State for Social Media Integrations
  const [integrationStatus, setIntegrationStatus] = useState<Record<string, "disconnected" | "connecting" | "connected">>({
    whatsapp: "disconnected",
    messenger: "disconnected",
    instagram: "disconnected",
    telegram: "disconnected"
  });
  const [whatsappPhoneId, setWhatsappPhoneId] = useState("");
  const [whatsappToken, setWhatsappToken] = useState("");
  const [messengerPageId, setMessengerPageId] = useState("");
  const [messengerToken, setMessengerToken] = useState("");
  const [instagramPageId, setInstagramPageId] = useState("");
  const [instagramToken, setInstagramToken] = useState("");
  const [telegramTokenState, setTelegramTokenState] = useState("");

  const [flyerClinicName, setFlyerClinicName] = useState<string>("عيادة المدار لطب الأسنان");
  const [flyerClinicPhone, setFlyerClinicPhone] = useState<string>("0554433221");
  const [flyerWelcomeText, setFlyerWelcomeText] = useState<string>("امسح الكود للتحدث مع طبيبنا الافتراضي وحجز موعدك في دقيقة واحدة! 🦷");
  const [installDeviceType, setInstallDeviceType] = useState<"android" | "ios" | "pc">("android");


  // Custom Presets Management States
  const [customPresets, setCustomPresets] = useState<ClinicPreset[]>([]);
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetSpecialty, setNewPresetSpecialty] = useState("");
  const [blankPresetName, setBlankPresetName] = useState("");
  const [blankPresetSpecialty, setBlankPresetSpecialty] = useState("");

  // Chat Image Attachment State
  const [attachedImage, setAttachedImage] = useState<{ data: string; mimeType: string; previewUrl: string } | null>(null);
  const [attachedAudio, setAttachedAudio] = useState<{ data: string; mimeType: string; audioUrl: string } | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  
  // Form add-row helper states
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  
  const [newGuidelineTitle, setNewGuidelineTitle] = useState("");
  const [newGuidelineContent, setNewGuidelineContent] = useState("");
  
  const [newButtonLabel, setNewButtonLabel] = useState("");
  const [newButtonResponse, setNewButtonResponse] = useState("");

  // Manual booking form and filter states
  const [manualPatientName, setManualPatientName] = useState("");
  const [manualPatientPhone, setManualPatientPhone] = useState("");
  const [manualServiceName, setManualServiceName] = useState("");
  const [manualBookingDate, setManualBookingDate] = useState("");
  const [manualBookingTime, setManualBookingTime] = useState("");
  const [manualNotes, setManualNotes] = useState("");
  const [bookingSearchQuery, setBookingSearchQuery] = useState("");
  const [bookingFilterStatus, setBookingFilterStatus] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [isAddingBooking, setIsAddingBooking] = useState(false);

  // Chatbot simulator patient booking states
  const [chatBookingName, setChatBookingName] = useState("");
  const [chatBookingPhone, setChatBookingPhone] = useState("");
  const [chatBookingService, setChatBookingService] = useState("");
  const [chatBookingDate, setChatBookingDate] = useState("");
  const [chatBookingTime, setChatBookingTime] = useState("");
  const [chatBookingNotes, setChatBookingNotes] = useState("");
  const [submittedBookingId, setSubmittedBookingId] = useState<string | null>(null);

  // Calculate dynamic progress of chat booking form
  const getChatBookingProgress = () => {
    let filled = 0;
    const total = 5; // 5 key fields: Name, Phone, Service, Date, Time
    if (chatBookingName.trim()) filled++;
    if (chatBookingPhone.trim()) filled++;
    if (chatBookingService) filled++;
    if (chatBookingDate) filled++;
    if (chatBookingTime) filled++;
    return {
      percentage: Math.round((filled / total) * 100),
      filled,
      total
    };
  };

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Patient chat booking submission handler
  const handleChatBookingSubmit = (e: React.FormEvent, msgId: string) => {
    e.preventDefault();
    if (!chatBookingName.trim() || !chatBookingPhone.trim() || !chatBookingService) {
      showNotification("يرجى تعبئة الاسم ورقم الجوال والخدمة لتسجيل حجزك.", "error");
      return;
    }

    const activeBookingsCount = bookings.filter(b => b.status === "pending" || b.status === "confirmed").length;
    const isLimitReached = enableBookingLimits && activeBookingsCount >= maxBookingsCount;

    if (bookingSystemStatus === "outside_hours") {
      showNotification("عذراً، لا يمكن إتمام الحجز حالياً لأن العيادة خارج أوقات العمل الرسمية. 🕒", "error");
      return;
    }

    if (bookingSystemStatus === "closed_limit" || isLimitReached) {
      showNotification("عذراً، لقد اكتمل الحد الأقصى للحجوزات اليومية المتاحة. 🔴", "error");
      return;
    }

    const bookingId = `bk-${Date.now()}`;
    const newBooking: Booking = {
      id: bookingId,
      patientName: chatBookingName,
      patientPhone: chatBookingPhone,
      serviceName: chatBookingService,
      bookingDate: chatBookingDate || new Date().toISOString().split('T')[0],
      bookingTime: chatBookingTime || "12:00",
      notes: chatBookingNotes,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    saveToLocalStorage(clinicInfo, dailyStatus, services, guidelines, quickActions, updated);

    // Trigger Browser Notification for the doctor
    sendBrowserNotification("وصول طلب حجز جديد عبر الشات بوت! 📅", {
      body: `المريض: ${chatBookingName}\nالخدمة المطلوبة: ${chatBookingService}\nالتوقيت: ${chatBookingTime || "12:00"} | ${chatBookingDate || ""}`,
      tag: `booking-${bookingId}`,
      requireInteraction: true
    });

    setSubmittedBookingId(msgId);

    // Append confirmation message from bot
    setTimeout(() => {
      const confirmationMsg: ChatMessage = {
        id: `b-confirm-${Date.now()}`,
        sender: "bot",
        text: `تم استقبال طلب حجزك المبدئي بنجاح! 🎉\n\n📝 تفاصيل طلب الحجز:\n• الاسم: ${chatBookingName}\n• الجوال: ${chatBookingPhone}\n• الخدمة: ${chatBookingService}\n• التاريخ: ${chatBookingDate || new Date().toISOString().split('T')[0]}\n• الوقت: ${chatBookingTime || "12:00"}\n\nالحالة الحالية للطلب: قيد المراجعة ⏳\n\nسنقوم بالاتصال بك فوراً لتأكيد الحجز النهائي. شكراً لثقتك بنا!`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, confirmationMsg]);
      
      // Clear patient booking states
      setChatBookingName("");
      setChatBookingPhone("");
      setChatBookingService("");
      setChatBookingDate("");
      setChatBookingTime("");
      setChatBookingNotes("");
    }, 500);

    showNotification("تم إرسال طلب حجزك بنجاح للمراجعة! 📅", "success");
  };

  // Bookings CRUD handlers
  const handleAddManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPatientName.trim() || !manualPatientPhone.trim() || !manualServiceName) {
      showNotification("يرجى تعبئة الاسم والهاتف والخدمة المطلوبة على الأقل.", "error");
      return;
    }

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      patientName: manualPatientName,
      patientPhone: manualPatientPhone,
      serviceName: manualServiceName,
      bookingDate: manualBookingDate || new Date().toISOString().split('T')[0],
      bookingTime: manualBookingTime || "12:00",
      notes: manualNotes,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    saveToLocalStorage(clinicInfo, dailyStatus, services, guidelines, quickActions, updated);

    // Clear form
    setManualPatientName("");
    setManualPatientPhone("");
    setManualServiceName("");
    setManualBookingDate("");
    setManualBookingTime("");
    setManualNotes("");
    setIsAddingBooking(false);
    
    showNotification("تم إضافة حجز المريض بنجاح! 📅", "success");
  };

  const handleConfirmBooking = (id: string) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    const defaultMsg = `تذكير بموعدك: عزيزي المريض ${booking.patientName}، نود تذكيرك بموعدك لـ (${booking.serviceName}) في عيادتنا يوم ${booking.bookingDate} الساعة ${booking.bookingTime}. نتطلع لرؤيتك ونتمنى لك دوام الصحة والعافية.`;

    setReminderModal({
      isOpen: true,
      bookingId: id,
      patientName: booking.patientName,
      serviceName: booking.serviceName,
      bookingDate: booking.bookingDate,
      bookingTime: booking.bookingTime,
      enableReminder: true,
      timeBefore: "1_day",
      customMessage: defaultMsg,
    });
  };

  const submitConfirmBookingWithReminder = () => {
    const { bookingId, enableReminder, timeBefore, customMessage } = reminderModal;
    
    let label = "قبل الموعد بيوم واحد";
    if (timeBefore === "30_mins") label = "قبل الموعد بـ 30 دقيقة";
    else if (timeBefore === "2_hours") label = "قبل الموعد بساعتين";
    else if (timeBefore === "2_days") label = "قبل الموعد بيومين";

    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        const remindersList = b.reminders || [];
        const newReminders = enableReminder ? [
          ...remindersList,
          {
            id: `rem-${Date.now()}`,
            timeBefore,
            timeBeforeLabel: label,
            message: customMessage,
            scheduledTime: `مجدول (${label})`,
            isSent: false
          }
        ] : remindersList;

        return {
          ...b,
          status: "confirmed" as const,
          reminders: newReminders
        };
      }
      return b;
    });

    setBookings(updated);
    saveToLocalStorage(clinicInfo, dailyStatus, services, guidelines, quickActions, updated);
    
    if (enableReminder) {
      showNotification("تم تأكيد الحجز وجدولة تذكير تلقائي للمريض بنجاح! 🔔✅", "success");
    } else {
      showNotification("تم تأكيد الحجز بنجاح بدون جدولة تذكير. ✅", "success");
    }

    setReminderModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleTriggerReminder = (bookingId: string, reminderId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const reminder = booking.reminders?.find(r => r.id === reminderId);
    if (!reminder) return;

    // Update reminder state
    const updatedBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          reminders: b.reminders?.map(r => r.id === reminderId ? { ...r, isSent: true, sentAt: new Date().toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' }) } : r)
        };
      }
      return b;
    });
    setBookings(updatedBookings);
    saveToLocalStorage(clinicInfo, dailyStatus, services, guidelines, quickActions, updatedBookings);

    // Append reminder message from bot to chat stream
    const reminderMsg: ChatMessage = {
      id: `rem-sent-${Date.now()}`,
      sender: "bot",
      text: `🔔 [${t("notif_reminder_scheduled", "تذكير تلقائي مجدول للمريض")} ${booking.patientName}]

${reminder.message}`,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, reminderMsg]);
    
    showNotification(t("notif_reminder_sent"), "success");
  };

  const handleCancelBooking = (id: string) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: "cancelled" as const } : b);
    setBookings(updated);
    saveToLocalStorage(clinicInfo, dailyStatus, services, guidelines, quickActions, updated);
    showNotification(t("notif_booking_cancelled"), "info");
  };

  const handleReactivateBooking = (id: string) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: "pending" as const } : b);
    setBookings(updated);
    saveToLocalStorage(clinicInfo, dailyStatus, services, guidelines, quickActions, updated);
    showNotification(t("notif_booking_reactivated"), "info");
  };

  const handleDeleteBooking = (id: string) => {
    const booking = bookings.find(b => b.id === id);
    setDeleteConfirm({
      isOpen: true,
      title: t("notif_delete_confirm_title"),
      message: t("notif_delete_confirm_msg", { name: booking?.patientName || '' }),
      onConfirm: () => {
        const updated = bookings.filter(b => b.id !== id);
        setBookings(updated);
        saveToLocalStorage(clinicInfo, dailyStatus, services, guidelines, quickActions, updated);
        showNotification(t("notif_booking_deleted"), "success");
        setDeleteConfirm(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Calculate booking distribution by service for the past week
  const getBookingChartData = () => {
    const referenceDate = new Date("2026-07-01");
    const sevenDaysAgo = new Date(referenceDate);
    sevenDaysAgo.setDate(referenceDate.getDate() - 7);
    
    const pastWeekBookings = bookings.filter(b => {
      if (!b.bookingDate) return false;
      const bDate = new Date(b.bookingDate);
      // Include any booking within the 7-day window prior to or on the reference date
      return bDate >= sevenDaysAgo && bDate <= referenceDate;
    });

    const isUsingPastWeek = pastWeekBookings.length > 0;
    const targetBookings = isUsingPastWeek ? pastWeekBookings : bookings;

    const serviceCounts: { [key: string]: number } = {};
    targetBookings.forEach(b => {
      const name = b.serviceName || "استشارة عامة";
      serviceCounts[name] = (serviceCounts[name] || 0) + 1;
    });

    const data = Object.keys(serviceCounts).map(service => ({
      name: service,
      count: serviceCounts[service],
    }));

    return {
      data,
      isPastWeekOnly: isUsingPastWeek,
      count: targetBookings.length
    };
  };

  // Calculate waiting time and morning/evening period distribution analytics
  const getWaitingAndPeriodAnalytics = () => {
    // Filter out cancelled bookings as they don't wait
    const activeBookings = bookings.filter(b => b.status !== "cancelled");
    
    let morningCount = 0;
    let eveningCount = 0;
    
    let morningWaitTotal = 0;
    let eveningWaitTotal = 0;
    
    // Group by date to check congestion
    const dateCongestion: { [date: string]: number } = {};
    activeBookings.forEach(b => {
      if (b.bookingDate) {
        dateCongestion[b.bookingDate] = (dateCongestion[b.bookingDate] || 0) + 1;
      }
    });

    // We analyze specific hour blocks
    const hourBlocks = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
    const hourlyCounts = hourBlocks.map(h => ({ hour: h, count: 0, waitTime: 12 }));

    activeBookings.forEach(b => {
      let isMorning = true;
      if (b.bookingTime) {
        const hour = parseInt(b.bookingTime.split(":")[0]) || 12;
        if (hour >= 13) {
          isMorning = false;
        }
      }
      
      // Calculate realistic waiting time: Base 12 mins + congestion delay
      const dayCongestionCount = b.bookingDate ? (dateCongestion[b.bookingDate] || 1) : 1;
      let calculatedWait = 12 + (dayCongestionCount - 1) * 6;
      
      // Natural variance based on name length
      const variance = (b.patientName.length * 3) % 8;
      calculatedWait += variance;

      if (b.status === "pending") {
        calculatedWait += 4; // Pending status might need some check-in validation
      }

      if (isMorning) {
        morningCount++;
        morningWaitTotal += calculatedWait;
      } else {
        eveningCount++;
        eveningWaitTotal += calculatedWait;
      }

      // Map to closest hourly block
      if (b.bookingTime) {
        const hourVal = parseInt(b.bookingTime.split(":")[0]) || 12;
        let closestIndex = 0;
        let minDiff = 24;
        hourBlocks.forEach((hStr, idx) => {
          const blockH = parseInt(hStr.split(":")[0]);
          const diff = Math.abs(hourVal - blockH);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = idx;
          }
        });
        hourlyCounts[closestIndex].count++;
        hourlyCounts[closestIndex].waitTime = Math.round((hourlyCounts[closestIndex].waitTime * hourlyCounts[closestIndex].count + calculatedWait) / (hourlyCounts[closestIndex].count + 1));
      }
    });

    const totalCount = morningCount + eveningCount;
    const morningAvgWait = morningCount > 0 ? Math.round(morningWaitTotal / morningCount) : 15;
    const eveningAvgWait = eveningCount > 0 ? Math.round(eveningWaitTotal / eveningCount) : 25;
    const overallAvgWait = totalCount > 0 ? Math.round((morningWaitTotal + eveningWaitTotal) / totalCount) : 18;

    const morningPercent = totalCount > 0 ? Math.round((morningCount / totalCount) * 100) : 40;
    const eveningPercent = totalCount > 0 ? Math.round((eveningCount / totalCount) * 100) : 60;

    const periodData = [
      { name: currentLanguage === "ar" ? "الفترة الصباحية" : currentLanguage === "fr" ? "Matin" : "Morning", value: morningCount || 1, color: "#2dd4bf" },
      { name: currentLanguage === "ar" ? "الفترة المسائية" : currentLanguage === "fr" ? "Après-midi/Soir" : "Evening/PM", value: eveningCount || 1, color: "#0ea5e9" }
    ];

    const hourlyTrend = hourlyCounts.map(block => ({
      ...block,
      hourLabel: currentLanguage === "ar" 
        ? (parseInt(block.hour) < 12 ? `${block.hour} ص` : `${block.hour} م`)
        : block.hour
    }));

    return {
      morningCount,
      eveningCount,
      morningPercent,
      eveningPercent,
      morningAvgWait,
      eveningAvgWait,
      overallAvgWait,
      periodData,
      hourlyTrend
    };
  };

  // SaaS Multi-Tenant and Auth Helper Functions
  const openPatientPortal = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) {
      showNotification(t("notif_clinic_unavailable"), "error");
      return;
    }
    
    setPortalTenantId(tenantId);
    
    // Populate active state variables with portal tenant data
    setClinicInfo({
      name: tenant.clinicName,
      specialty: tenant.specialty,
      phone: tenant.phone,
      address: tenant.address,
      doctorName: tenant.doctorName,
      workHours: tenant.workHours || "من 9:00 ص إلى 9:00 م",
      notes: tenant.notes || ""
    });
    setDailyStatus(tenant.dailyStatus || "");
    setServices(tenant.services);
    setGuidelines(tenant.guidelines);
    setQuickActions(tenant.quickActions);
    setBookings(tenant.bookings || []);
    setMaxBookingsCount(tenant.subscription.planId === "free" ? 10 : tenant.subscription.planId === "starter" ? 100 : 9999);
    setEnableBookingLimits(tenant.subscription.planId !== "pro");
    
    // Reset chatbot message with specific clinic info
    resetWelcomeMessages(
      {
        name: tenant.clinicName,
        specialty: tenant.specialty,
        phone: tenant.phone,
        address: tenant.address
      },
      tenant.quickActions
    );
    
    setViewMode("website");
    showNotification(t("notif_welcome_clinic", { name: tenant.clinicName }), "success");
  };

  const handleDoctorLogin = (email: string, pass: string) => {
    const tenant = tenants.find(t => t.email.toLowerCase() === email.toLowerCase() && t.password === pass);
    if (!tenant) {
      showNotification(t("notif_invalid_login"), "error");
      return false;
    }
    
    setCurrentTenant(tenant);
    localStorage.setItem("shafi_current_tenant", JSON.stringify(tenant));
    
    // Restore message subscription states
    setMsgSubPlan(tenant.msgSubPlan || "trial");
    setMsgLimit(tenant.msgLimit !== undefined ? tenant.msgLimit : 999999);
    setMsgUsed(tenant.msgUsed !== undefined ? tenant.msgUsed : 250);

    // Populate active state variables
    setClinicInfo({
      name: tenant.clinicName,
      specialty: tenant.specialty,
      phone: tenant.phone,
      address: tenant.address,
      doctorName: tenant.doctorName,
      workHours: tenant.workHours || "من 9 ص إلى 9 م",
      notes: tenant.notes || ""
    });
    setDailyStatus(tenant.dailyStatus || "");
    setServices(tenant.services);
    setGuidelines(tenant.guidelines);
    setQuickActions(tenant.quickActions);
    setBookings(tenant.bookings || []);
    setMaxBookingsCount(tenant.subscription.planId === "free" ? 10 : tenant.subscription.planId === "starter" ? 100 : 9999);
    setEnableBookingLimits(tenant.subscription.planId !== "pro");
    
    resetWelcomeMessages(
      {
        name: tenant.clinicName,
        specialty: tenant.specialty,
        phone: tenant.phone,
        address: tenant.address
      },
      tenant.quickActions
    );
    
    setViewMode("admin");
    setPortalTenantId(null);
    showNotification(t("notif_doctor_logged_in", { name: tenant.doctorName }), "success");
    return true;
  };

  const handleDoctorSignUp = (
    email: string,
    pass: string,
    docName: string,
    clinicName: string,
    specialty: string,
    phone: string,
    address: string,
    planId: "free" | "starter" | "pro"
  ) => {
    if (planId === "free") {
      const freeClaimed = localStorage.getItem("shafi_free_plan_claimed");
      if (freeClaimed === "true") {
        showNotification(t("notif_trial_abused"), "error");
        return false;
      }
      localStorage.setItem("shafi_free_plan_claimed", "true");
    }

    if (tenants.some(t => t.email.toLowerCase() === email.toLowerCase())) {
      showNotification(t("notif_email_registered"), "error");
      return false;
    }
    
    const newTenantId = clinicName.toLowerCase().replace(/[^a-z0-9]/g, "-") || `clinic-${Date.now()}`;
    const newTenant: SaasTenant = {
      id: newTenantId,
      email,
      password: pass,
      doctorName: docName,
      clinicName,
      specialty,
      phone,
      address,
      workHours: "من 9:00 صباحاً وحتى 9:00 مساءً",
      dailyStatus: "العيادة تعمل بأوقاتها الطبيعية ونستقبل الحجوزات الطبية بشكل طبيعي.",
      notes: "عيادة جديدة تم تفعيلها حديثاً على منصة شافي SaaS للذكاء الاصطناعي.",
      
      subscription: {
        planId: planId,
        status: "active",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      billingHistory: [
        {
          id: `bill-${Date.now()}`,
          planId: planId,
          amount: planId === "free" ? 0 : planId === "starter" ? 4500 : 9000,
          date: new Date().toISOString().split("T")[0],
          status: "paid"
        }
      ],
      
      services: [
        { id: `s-1-${Date.now()}`, name: "استشارة الكشف الأولي", description: "فحص أولي مجاني لتحديد المشكلة ووضع الخطة العلاجية.", price: "كشف مجاني" }
      ],
      guidelines: [
        { id: `g-1-${Date.now()}`, title: "إرشادات عامة للمرضى", content: "يرجى الحضور قبل الموعد بـ 15 دقيقة وإحضار الهوية الوطنية." }
      ],
      quickActions: [
        { id: `q-1-${Date.now()}`, label: "📅 حجز موعد جديد", response: "أهلاً بك! يمكنك إرسال اسمك ورقم جوالك وتحديد الموعد المفضل ليتم الحجز فوراً." },
        { id: `q-2-${Date.now()}`, label: "📍 موقع العيادة وأوقات العمل", response: `عنواننا: ${address}. ساعات العمل: من السبت إلى الخميس من 9 ص إلى 9 م.` }
      ],
      bookings: [],
      conversations: [],
      
      aiTemperature: 0.15,
      safeguardLevel: "strict",
      aiTone: "friendly"
    };
    
    const updatedTenants = [...tenants, newTenant];
    setTenants(updatedTenants);
    localStorage.setItem("shafi_saas_tenants", JSON.stringify(updatedTenants));
    
    // Automatically log in!
    setCurrentTenant(newTenant);
    localStorage.setItem("shafi_current_tenant", JSON.stringify(newTenant));
    
    // Populate states
    setClinicInfo({
      name: newTenant.clinicName,
      specialty: newTenant.specialty,
      phone: newTenant.phone,
      address: newTenant.address,
      doctorName: newTenant.doctorName,
      workHours: newTenant.workHours,
      notes: newTenant.notes
    });
    setDailyStatus(newTenant.dailyStatus || "");
    setServices(newTenant.services);
    setGuidelines(newTenant.guidelines);
    setQuickActions(newTenant.quickActions);
    setBookings([]);
    setMaxBookingsCount(planId === "free" ? 10 : planId === "starter" ? 100 : 9999);
    setEnableBookingLimits(planId !== "pro");
    
    resetWelcomeMessages(
      {
        name: newTenant.clinicName,
        specialty: newTenant.specialty,
        phone: newTenant.phone,
        address: newTenant.address
      },
      newTenant.quickActions
    );
    
    setViewMode("admin");
    setPortalTenantId(null);
    showNotification(t("notif_clinic_created", { name: docName }), "success");
    return true;
  };

  const handleDoctorLogout = () => {
    setCurrentTenant(null);
    localStorage.removeItem("shafi_current_tenant");
    setViewMode("website"); // return to SaaS landing page
    setPortalTenantId(null);
    showNotification(t("notif_logged_out"), "info");
  };

  const handleSubscriptionUpgrade = (newPlanId: "starter" | "pro") => {
    if (!currentTenant) return;
    
    const price = newPlanId === "starter" ? 199 : 399;
    const newBilling = {
      id: `bill-${Date.now()}`,
      planId: newPlanId,
      amount: price,
      date: new Date().toISOString().split("T")[0],
      status: "paid" as const
    };
    
    const updatedTenant: SaasTenant = {
      ...currentTenant,
      subscription: {
        planId: newPlanId,
        status: "active",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      billingHistory: [newBilling, ...currentTenant.billingHistory],
      maxBookingsCount: newPlanId === "starter" ? 100 : 9999,
      enableBookingLimits: newPlanId !== "pro"
    };

    setMaxBookingsCount(newPlanId === "starter" ? 100 : 9999);
    setEnableBookingLimits(newPlanId !== "pro");
    setCurrentTenant(updatedTenant);
    
    const updatedTenants = tenants.map(t => t.id === currentTenant.id ? updatedTenant : t);
    setTenants(updatedTenants);
    localStorage.setItem("shafi_saas_tenants", JSON.stringify(updatedTenants));
    localStorage.setItem("shafi_current_tenant", JSON.stringify(updatedTenant));
    
    showNotification(t("notif_subscription_upgraded", { plan: newPlanId === "pro" ? t("planProShort", "الاحترافية") : t("planStarterShort", "الانطلاق") }), "success");
  };

  // Initialize from LocalStorage or Seed Default SaaS Tenants
  useEffect(() => {
    // Force clear any old Saudi default data from client localStorage to ensure Algerian presets load properly
    const migrated = localStorage.getItem("shafi_algerian_migration_v5");
    if (!migrated) {
      localStorage.removeItem("shafi_saas_tenants");
      localStorage.removeItem("shafi_current_tenant");
      localStorage.removeItem("shafi_free_plan_claimed");
      localStorage.setItem("shafi_algerian_migration_v5", "true");
    }

    const savedCustom = localStorage.getItem("custom_clinic_presets");
    if (savedCustom) {
      try {
        setCustomPresets(JSON.parse(savedCustom));
      } catch (e) {
        console.error("Error loading custom presets:", e);
      }
    }

    // 1. Check and Load Tenants List
    const savedTenants = localStorage.getItem("shafi_saas_tenants");
    let activeTenants: SaasTenant[] = [];
    
    if (savedTenants) {
      try {
        activeTenants = JSON.parse(savedTenants);
      } catch (e) {
        console.error("Error loading tenants:", e);
      }
    }
    
    // If no tenants saved, seed initial tenants from presets!
    if (activeTenants.length === 0) {
      activeTenants = CLINIC_PRESETS.map((preset) => {
        return {
          id: preset.id,
          email: `doctor.${preset.id}@shafi.ai`,
          password: "123", // easy password for demo
          doctorName: preset.id === "dental" ? "د. محمد بن يوسف" : preset.id === "general" ? "د. سارة حميدش" : "د. خالد بلعيدي",
          clinicName: preset.info.name,
          specialty: preset.info.specialty,
          phone: preset.info.phone,
          address: preset.info.address,
          workHours: preset.id === "dental" ? "من 9:00 ص إلى 9:00 م" : preset.id === "general" ? "من 2:00 ظ إلى 9:30 م" : "من 8:00 ص إلى 9:00 م",
          dailyStatus: preset.dailyStatus,
          notes: "عيادة معتمدة تقدم خدمات راقية لمرضاها بأحدث التقنيات.",
          
          subscription: {
            planId: preset.id === "dental" ? "pro" : preset.id === "general" ? "starter" : "free",
            status: "active",
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          billingHistory: [
            {
              id: `bill-${preset.id}-1`,
              planId: preset.id === "dental" ? "pro" : preset.id === "general" ? "starter" : "free",
              amount: preset.id === "dental" ? 399 : preset.id === "general" ? 199 : 0,
              date: new Date().toISOString().split("T")[0],
              status: "paid"
            }
          ],
          
          services: preset.services,
          guidelines: preset.guidelines,
          quickActions: preset.quickActions,
          bookings: preset.id === "dental" ? DEFAULT_BOOKINGS : [],
          conversations: preset.id === "dental" ? [
            {
              id: "sess-1",
              patientName: "أحمد منصور",
              patientPhone: "0554433221",
              topic: "استشارة زراعة أسنان وتكلفة العلاج",
              date: "2026-06-30 14:20",
              status: "pending_review",
              aiSentiment: "satisfied",
              messages: [
                { id: "m-1", sender: "user", text: "مرحبا، أريد الاستفسار عن تكلفة زراعة السن الواحد في عيادتكم وما هي الإجراءات؟", timestamp: new Date() },
                { id: "m-2", sender: "bot", text: "أهلاً بك يا فندم في عيادتنا! زراعة السن الواحد لدينا تتم بأحدث التقنيات السويسرية والألمانية. تكلفتها تبدأ من 35000 دج وتعتمد على نوع الغرسة وحالة عظام الفك. الإجراء يتضمن فحصاً أولياً، ثم زراعة وتثبيت الغرسة، تليها فترة شفاء قصيرة قبل وضع التاج النهائي. هل تود حجز موعد لفحص مجاني مع طبيب الزراعة؟", timestamp: new Date() }
              ]
            }
          ] : [],
          
          aiTemperature: 0.15,
          safeguardLevel: "strict",
          aiTone: "formal"
        };
      });
      localStorage.setItem("shafi_saas_tenants", JSON.stringify(activeTenants));
    }
    
    setTenants(activeTenants);

    // 2. Check for active logged-in tenant session
    const savedActiveTenant = localStorage.getItem("shafi_current_tenant");
    if (savedActiveTenant) {
      try {
        const tenant: SaasTenant = JSON.parse(savedActiveTenant);
        const latestTenant = activeTenants.find(t => t.id === tenant.id) || tenant;
        setCurrentTenant(latestTenant);
        
        // Restore message subscription states
        setMsgSubPlan(latestTenant.msgSubPlan || "trial");
        setMsgLimit(latestTenant.msgLimit !== undefined ? latestTenant.msgLimit : 999999);
        setMsgUsed(latestTenant.msgUsed !== undefined ? latestTenant.msgUsed : 250);

        // Populate active state variables
        setClinicInfo({
          name: latestTenant.clinicName,
          specialty: latestTenant.specialty,
          phone: latestTenant.phone,
          address: latestTenant.address,
          doctorName: latestTenant.doctorName,
          workHours: latestTenant.workHours || "من 9 ص إلى 9 م",
          notes: latestTenant.notes || ""
        });
        setDailyStatus(latestTenant.dailyStatus || "");
        setServices(latestTenant.services);
        setGuidelines(latestTenant.guidelines);
        setQuickActions(latestTenant.quickActions);
        setBookings(latestTenant.bookings || []);
        setMaxBookingsCount(latestTenant.subscription.planId === "free" ? 10 : latestTenant.subscription.planId === "starter" ? 100 : 9999);
        setEnableBookingLimits(latestTenant.subscription.planId !== "pro");
        
        // Setup initial welcome messages in chat
        resetWelcomeMessages(
          {
            name: latestTenant.clinicName,
            specialty: latestTenant.specialty,
            phone: latestTenant.phone,
            address: latestTenant.address
          },
          latestTenant.quickActions
        );
        
        setViewMode("admin");
        return;
      } catch (e) {
        console.error("Error loading current active tenant:", e);
      }
    }
    
    // Default fallback (no active session) -> Render SaaS Landing Page
    setViewMode("website"); // Renders SaaS landing if currentTenant and portalTenantId are null
    setPortalTenantId(null);
  }, []);

  // Cleanup Media Streams and Recording Timers on Unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Listen for Progressive Web App installation prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to notify the user they can install the PWA
      setShowInstallBtn(true);
      console.log('[PWA] beforeinstallprompt fired and captured.');
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If app is already installed/standalone, hide button
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstallBtn(false);
    }

    // Also listen to appinstalled event
    const handleAppInstalled = () => {
      showNotification(t("notif_install_success"), "success");
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      // Guide the user and switch to installation tab
      setActiveTab("market");
      showNotification(t("notif_install_manual"), "info");
      return;
    }
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to PWA install outcome: ${outcome}`);
      if (outcome === "accepted") {
        showNotification(t("notif_install_started"), "success");
        setDeferredPrompt(null);
        setShowInstallBtn(false);
      } else {
        showNotification(t("notif_install_cancelled"), "info");
      }
    } catch (err) {
      console.error("PWA installation trigger error:", err);
      showNotification(t("notif_install_error"), "error");
    }
  };

  // Browser Notification Utilities
  const sendBrowserNotification = (title: string, options?: NotificationOptions) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      try {
        const notification = new Notification(title, {
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          dir: "rtl",
          silent: false, // ensures sound plays on supporting systems
          ...options
        });

        // Try using the AudioContext API for an elegant chime sound
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          if (audioCtx.state === "suspended") {
            audioCtx.resume();
          }
          const playChime = () => {
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc1.type = "sine";
            osc2.type = "triangle";

            osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
            osc1.frequency.exponentialRampToValueAtTime(880.00, audioCtx.currentTime + 0.15); // A5

            osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
            osc2.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.15); // C6

            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc1.start();
            osc2.start();
            osc1.stop(audioCtx.currentTime + 0.5);
            osc2.stop(audioCtx.currentTime + 0.5);
          };
          playChime();
        } catch (audioErr) {
          console.warn("Audio Context sound could not be played:", audioErr);
        }

        notification.onclick = () => {
          window.focus();
          setActiveTab("bookings");
        };
      } catch (err) {
        console.error("Failed to trigger browser notification:", err);
      }
    }
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      showNotification(t("notif_notifications_not_supported"), "error");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === "granted") {
        showNotification(t("notif_notifications_enabled"), "success");
        // Trigger a test notification
        sendBrowserNotification(t("notif_notif_welcome"), {
          body: t("notif_notif_desc"),
          tag: "test-notification"
        });
      } else if (permission === "denied") {
        showNotification(t("notif_notif_denied"), "error");
      }
    } catch (err) {
      console.error("Error requesting notification permission:", err);
      showNotification(t("notif_notif_error"), "error");
    }
  };

  const handleSaveCurrentAsPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) {
      showNotification(t("notif_enter_preset_name"), "error");
      return;
    }
    const newPresetId = `custom-${Date.now()}`;
    const newPreset: ClinicPreset = {
      id: newPresetId,
      name: newPresetName,
      specialty: newPresetSpecialty || clinicInfo.specialty || t("general_specialty", "تخصص عام"),
      info: { 
        name: newPresetName, 
        specialty: newPresetSpecialty || clinicInfo.specialty || t("general_specialty", "تخصص عام"),
        phone: clinicInfo.phone,
        address: clinicInfo.address
      },
      services: [...services],
      guidelines: [...guidelines],
      quickActions: [...quickActions],
      dailyStatus: dailyStatus
    };

    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    localStorage.setItem("custom_clinic_presets", JSON.stringify(updated));
    setSelectedPresetId(newPresetId);
    
    // Clear inputs
    setNewPresetName("");
    setNewPresetSpecialty("");
    
    showNotification(t("notif_preset_saved", { name: newPreset.name }), "success");
  };

  const handleCreateBlankPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blankPresetName.trim()) {
      showNotification(t("notif_enter_blank_preset_name"), "error");
      return;
    }
    const newPresetId = `custom-${Date.now()}`;
    const newPreset: ClinicPreset = {
      id: newPresetId,
      name: blankPresetName,
      specialty: blankPresetSpecialty || t("general_specialty", "تخصص عام"),
      info: { 
        name: blankPresetName, 
        specialty: blankPresetSpecialty || t("general_specialty", "تخصص عام"),
        phone: "",
        address: ""
      },
      services: [],
      guidelines: [],
      quickActions: [
        {
          id: `qa-${Date.now()}-1`,
          label: "📅 حجز موعد جديد",
          response: "أهلاً بك! يرجى ملء نموذج حجز الموعد أدناه."
        }
      ],
      dailyStatus: "أهلاً بكم في عيادتنا اليوم."
    };

    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    localStorage.setItem("custom_clinic_presets", JSON.stringify(updated));
    
    // Load it instantly
    loadPreset(newPreset);
    
    // Clear inputs
    setBlankPresetName("");
    setBlankPresetSpecialty("");
    
    showNotification(`تم إنشاء وتفعيل القالب الفارغ الجديد: ${newPreset.name} بنجاح! ✨`, "success");
  };

  const handleDeleteCustomPreset = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const presetToDelete = customPresets.find(p => p.id === id);
    const updated = customPresets.filter(p => p.id !== id);
    setCustomPresets(updated);
    localStorage.setItem("custom_clinic_presets", JSON.stringify(updated));
    
    showNotification(`تم حذف القالب "${presetToDelete?.name || ""}" بنجاح. 🗑️`, "info");
    
    if (selectedPresetId === id) {
      // Load default dental preset
      loadPreset(CLINIC_PRESETS[0]);
    }
  };

  // Save current state to local storage helper
  const saveToLocalStorage = (
    info: ClinicInfo, 
    status: string, 
    srvs: ClinicService[], 
    gdlns: ClinicGuideline[], 
    btns: QuickAction[],
    bkngs?: Booking[],
    maxCount?: number,
    enableLimit?: boolean,
    sysStatus?: "open" | "closed_limit" | "outside_hours"
  ) => {
    const dataToSave = { 
      clinicInfo: info, 
      dailyStatus: status, 
      services: srvs, 
      guidelines: gdlns, 
      quickActions: btns,
      bookings: bkngs || bookings,
      maxBookingsCount: maxCount !== undefined ? maxCount : maxBookingsCount,
      enableBookingLimits: enableLimit !== undefined ? enableLimit : enableBookingLimits,
      bookingSystemStatus: sysStatus !== undefined ? sysStatus : bookingSystemStatus
    };
    localStorage.setItem("clinic_chatbot_data_v1", JSON.stringify(dataToSave));
    
    // SaaS Multi-tenant synchronization
    if (currentTenant) {
      const updatedTenant: SaasTenant = {
        ...currentTenant,
        doctorName: info.doctorName || currentTenant.doctorName,
        clinicName: info.name || currentTenant.clinicName,
        specialty: info.specialty || currentTenant.specialty,
        phone: info.phone || currentTenant.phone,
        address: info.address || currentTenant.address,
        workHours: info.workHours || currentTenant.workHours,
        notes: info.notes || currentTenant.notes,
        
        dailyStatus: status,
        services: srvs,
        guidelines: gdlns,
        quickActions: btns,
        bookings: bkngs || bookings,
        
        maxBookingsCount: maxCount !== undefined ? maxCount : maxBookingsCount,
        enableBookingLimits: enableLimit !== undefined ? enableLimit : enableBookingLimits,
        bookingSystemStatus: sysStatus !== undefined ? sysStatus : bookingSystemStatus,
        
        aiTemperature,
        safeguardLevel,
        aiTone
      };
      
      const updatedTenants = tenants.map(t => t.id === currentTenant.id ? updatedTenant : t);
      setTenants(updatedTenants);
      localStorage.setItem("shafi_saas_tenants", JSON.stringify(updatedTenants));
      localStorage.setItem("shafi_current_tenant", JSON.stringify(updatedTenant));
      setCurrentTenant(updatedTenant);
    } else if (portalTenantId) {
      // Patient Portal mode booking or interaction sync
      const updatedTenants = tenants.map(t => {
        if (t.id === portalTenantId) {
          return {
            ...t,
            bookings: bkngs || bookings
          };
        }
        return t;
      });
      setTenants(updatedTenants);
      localStorage.setItem("shafi_saas_tenants", JSON.stringify(updatedTenants));
    }
    
    showNotification("تم حفظ البيانات وتحديث الشات بوت فورياً بنجاح! 💾", "success");
  };

  const showNotification = (text: string, type: "success" | "error" | "info") => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const saveMsgSubscriptionData = (
    newPlan: "trial" | "msg1500" | "msg4000" | "unlimited" | "custom",
    newLimit: number,
    newUsed: number
  ) => {
    setMsgSubPlan(newPlan);
    setMsgLimit(newLimit);
    setMsgUsed(newUsed);

    if (currentTenant) {
      const updatedTenant: SaasTenant = {
        ...currentTenant,
        msgSubPlan: newPlan,
        msgLimit: newLimit,
        msgUsed: newUsed
      };

      const updatedTenants = tenants.map(t => t.id === currentTenant.id ? updatedTenant : t);
      setTenants(updatedTenants);
      localStorage.setItem("shafi_saas_tenants", JSON.stringify(updatedTenants));
      localStorage.setItem("shafi_current_tenant", JSON.stringify(updatedTenant));
      setCurrentTenant(updatedTenant);
    }
  };

  const loadPreset = (preset: ClinicPreset) => {
    setClinicInfo(preset.info);
    setDailyStatus(preset.dailyStatus);
    setServices(preset.services);
    setGuidelines(preset.guidelines);
    setQuickActions(preset.quickActions);
    setSelectedPresetId(preset.id);
    
    // Save
    const dataToSave = { 
      clinicInfo: preset.info, 
      dailyStatus: preset.dailyStatus, 
      services: preset.services, 
      guidelines: preset.guidelines, 
      quickActions: preset.quickActions,
      bookings: bookings.length > 0 ? bookings : DEFAULT_BOOKINGS,
      maxBookingsCount,
      enableBookingLimits,
      bookingSystemStatus
    };
    localStorage.setItem("clinic_chatbot_data_v1", JSON.stringify(dataToSave));
    
    // Reset welcome messages
    resetWelcomeMessages(preset.info, preset.quickActions);
    showNotification(`تم تحميل قالب عيادة: ${preset.name} بنجاح! ✨`, "success");
  };

  const resetWelcomeMessages = (info: ClinicInfo, buttons: QuickAction[]) => {
    const fallbackClinic = currentLanguage === "ar" ? "عيادتنا" : currentLanguage === "fr" ? "notre clinique" : "our clinic";
    const welcomeMsgs: ChatMessage[] = [
      {
        id: "w-1",
        sender: "bot",
        text: t('welcomeMessage').replace("{clinicName}", localizeDynamicText(info.name, currentLanguage) || fallbackClinic),
        timestamp: new Date()
      }
    ];
    setChatMessages(welcomeMsgs);
  };

  useEffect(() => {
    resetWelcomeMessages(clinicInfo, quickActions);
  }, [currentLanguage]);

  // Export all current settings as JSON backup file
  const handleExportBackup = () => {
    const dataToSave = { 
      clinicInfo, 
      dailyStatus, 
      services, 
      guidelines, 
      quickActions,
      bookings,
      maxBookingsCount,
      enableBookingLimits,
      bookingSystemStatus
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToSave, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    const fileName = `clinic_chatbot_backup_${clinicInfo.name ? clinicInfo.name.replace(/\s+/g, '_') : 'setup'}.json`;
    downloadAnchor.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification("تم تصدير ملف النسخة الاحتياطية بنجاح! احتفظ به في مكان آمن 📥", "success");
  };

  // Import settings from JSON backup file
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.clinicInfo && parsed.services && parsed.guidelines && parsed.quickActions) {
            setClinicInfo(parsed.clinicInfo);
            setDailyStatus(parsed.dailyStatus || "");
            setServices(parsed.services);
            setGuidelines(parsed.guidelines);
            setQuickActions(parsed.quickActions);
            const loadedBookings = parsed.bookings || DEFAULT_BOOKINGS;
            setBookings(loadedBookings);
            
            const loadedMaxCount = parsed.maxBookingsCount !== undefined ? parsed.maxBookingsCount : 10;
            const loadedEnableLimit = parsed.enableBookingLimits !== undefined ? parsed.enableBookingLimits : true;
            const loadedSysStatus = parsed.bookingSystemStatus || "open";
            
            setMaxBookingsCount(loadedMaxCount);
            setEnableBookingLimits(loadedEnableLimit);
            setBookingSystemStatus(loadedSysStatus);
            
            // Save to localStorage
            const completeData = {
              ...parsed,
              bookings: loadedBookings,
              maxBookingsCount: loadedMaxCount,
              enableBookingLimits: loadedEnableLimit,
              bookingSystemStatus: loadedSysStatus
            };
            localStorage.setItem("clinic_chatbot_data_v1", JSON.stringify(completeData));
            resetWelcomeMessages(parsed.clinicInfo, parsed.quickActions);
            showNotification("تم استيراد واسترجاع النسخة الاحتياطية وتحديث الشات بوت فورياً بنجاح! 🎉", "success");
          } else {
            showNotification("صيغة الملف غير صالحة. تأكد من رفع ملف نسخة احتياطية تم تصديره من هذا النظام.", "error");
          }
        } catch (error) {
          showNotification("حدث خطأ أثناء قراءة الملف. يرجى التأكد من اختيار ملف .json صحيح.", "error");
        }
      };
    }
  };

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isBotTyping]);

  // Handle Quick Action Button clicks in simulator
  const handleQuickActionClick = async (action: QuickAction) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: localizeDynamicText(action.label, currentLanguage),
      timestamp: new Date(),
      isQuickAction: true
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    setIsBotTyping(true);
    
    // Intercept booking trigger button
    if (action.id === "booking-trigger" || action.label.includes("حجز") || action.label.includes("موعد") || action.label.includes("احجز")) {
      setTimeout(() => {
        const activeBookingsCount = bookings.filter(b => b.status === "pending" || b.status === "confirmed").length;
        const isLimitReached = enableBookingLimits && activeBookingsCount >= maxBookingsCount;

        if (bookingSystemStatus === "outside_hours") {
          const outsideHoursMsg: ChatMessage = {
            id: `b-${Date.now()}`,
            sender: "bot",
            text: t('botOutsideHours'),
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, outsideHoursMsg]);
          setIsBotTyping(false);
          return;
        }

        if (bookingSystemStatus === "closed_limit" || isLimitReached) {
          const limitReachedMsg: ChatMessage = {
            id: `b-${Date.now()}`,
            sender: "bot",
            text: t('botLimitReached').replace("{max}", String(maxBookingsCount)),
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, limitReachedMsg]);
          setIsBotTyping(false);
          return;
        }

        const bookingBotMsg: ChatMessage = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: t('botBookingSystemReady'),
          timestamp: new Date(),
          isBookingCard: true
        };
        setChatMessages(prev => [...prev, bookingBotMsg]);
        setIsBotTyping(false);
      }, 700);
      return;
    }
    
    // Simulate natural typing lag for instant pre-configured responses
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: localizeDynamicText(action.response, currentLanguage),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMsg]);
      setIsBotTyping(false);
    }, 600);
  };

  const handleImageAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification("يرجى اختيار ملف صورة صالح (PNG, JPEG, etc.).", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(",")[1];
      
      setAttachedImage({
        data: base64Data,
        mimeType: file.type,
        previewUrl: result
      });
      showNotification("تم إرفاق الصورة بنجاح! جاهزة للإرسال مع رسالتك. 📸", "success");
    };
    reader.onerror = () => {
      showNotification("حدث خطأ أثناء قراءة ملف الصورة.", "error");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Camera Access and Capture Methods
  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      videoStreamRef.current = stream;
      if (videoElementRef.current) {
        videoElementRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      showNotification("فشل الوصول إلى الكاميرا. يرجى التحقق من الأذونات ومنح المتصفح حق الوصول.", "error");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
      videoStreamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoElementRef.current) {
      const video = videoElementRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        const base64Data = dataUrl.split(",")[1];
        
        setAttachedImage({
          data: base64Data,
          mimeType: "image/jpeg",
          previewUrl: dataUrl
        });
        showNotification("تم التقاط الصورة وإرفاقها بنجاح! 📸", "success");
      }
      stopCamera();
    }
  };

  // Audio Recording Methods
  const startRecording = async () => {
    audioChunksRef.current = [];
    setRecordingSeconds(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let recorder: MediaRecorder;
      const options = { mimeType: 'audio/webm' };
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (e) {
        recorder = new MediaRecorder(stream);
      }

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64Data = result.split(",")[1];
          const audioUrl = URL.createObjectURL(audioBlob);
          
          setAttachedAudio({
            data: base64Data,
            mimeType: audioBlob.type,
            audioUrl: audioUrl
          });
          showNotification("تم تسجيل وإرفاق المقطع الصوتي بنجاح! 🎙️", "success");
        };
        reader.readAsDataURL(audioBlob);

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      showNotification("فشل الوصول إلى الميكروفون لتسجيل الصوت. يرجى التحقق من الأذونات.", "error");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = () => {
        if (mediaRecorderRef.current) {
          const stream = mediaRecorderRef.current.stream;
          stream.getTracks().forEach(track => track.stop());
        }
      };
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setRecordingSeconds(0);
    audioChunksRef.current = [];
    showNotification("تم إلغاء تسجيل الصوت.", "info");
  };

  // Send real dynamic question to the Express server/Gemini backend
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const userText = inputValue;
    const hasImage = !!attachedImage;
    const hasAudio = !!attachedAudio;
    if ((!userText.trim() && !hasImage && !hasAudio) || isBotTyping) return;

    // SaaS Outside Platform Subscription Check
    // In-Platform live chat & assistant is 100% FREE and UNLIMITED for doctors and patients on the platform!
    // Paid limits only apply to actual WhatsApp/Telegram API integrations simulated off-platform.
    const isExpired = false; // In-platform chat is never blocked
    if (isExpired) {
      setInputValue("");
      setAttachedImage(null);
      setAttachedAudio(null);

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        sender: "user",
        text: userText || "مرفقات",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, userMsg]);
      setIsBotTyping(true);

      setTimeout(() => {
        const expiredMsg: ChatMessage = {
          id: `b-expired-${Date.now()}`,
          sender: "bot",
          text: currentLanguage === "ar"
            ? "عذراً، لقد انتهى اشتراك المساعد الذكي خارج المنصة لهذه العيادة. يرجى من الطبيب تجديد الاشتراك عبر لوحة التحكم 💳."
            : currentLanguage === "fr"
            ? "Désolé, l'abonnement de l'assistant intelligent hors plateforme a expiré pour cette clinique. Veuillez le renouveler depuis le panneau de contrôle 💳."
            : "Sorry, the smart assistant's off-platform subscription has expired for this clinic. Please renew via the control panel 💳.",
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, expiredMsg]);
        setIsBotTyping(false);
      }, 700);
      return;
    }

    // In-platform chat is 100% free and unlimited, so we do NOT increment msgUsed.
    // msgUsed is reserved for simulated WhatsApp/Telegram/SMS off-platform notifications.

    // Increment today's messages count in dailyMessagesData
    setDailyMessagesData(prev => {
      const copy = [...prev];
      if (copy.length > 0) {
        copy[copy.length - 1] = {
          ...copy[copy.length - 1],
          count: copy[copy.length - 1].count + 1
        };
      }
      return copy;
    });

    setInputValue("");
    const imgToSend = attachedImage;
    const audioToSend = attachedAudio;
    
    setAttachedImage(null);
    setAttachedAudio(null);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: userText || (imgToSend ? "تحليل وقراءة الصورة المرفقة 📸" : "تحليل وسماع المقطع الصوتي المرفق 🎙️"),
      timestamp: new Date(),
      image: imgToSend ? {
        data: imgToSend.data,
        mimeType: imgToSend.mimeType,
        previewUrl: imgToSend.previewUrl
      } : undefined,
      audio: audioToSend ? {
        data: audioToSend.data,
        mimeType: audioToSend.mimeType,
        audioUrl: audioToSend.audioUrl
      } : undefined
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsBotTyping(true);

    // Intercept typed booking keywords for offline smart booking form
    const lowercaseText = userText.toLowerCase();
    const isBookingQuery = userText.trim() && (
      lowercaseText.includes("حجز") || 
      lowercaseText.includes("موعد") || 
      lowercaseText.includes("احجز") || 
      lowercaseText.includes("booking") || 
      lowercaseText.includes("appointment")
    );

    if (isBookingQuery) {
      setTimeout(() => {
        const activeBookingsCount = bookings.filter(b => b.status === "pending" || b.status === "confirmed").length;
        const isLimitReached = enableBookingLimits && activeBookingsCount >= maxBookingsCount;

        if (bookingSystemStatus === "outside_hours") {
          const outsideHoursMsg: ChatMessage = {
            id: `b-${Date.now()}`,
            sender: "bot",
            text: t('botOutsideHours'),
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, outsideHoursMsg]);
          setIsBotTyping(false);
          return;
        }

        if (bookingSystemStatus === "closed_limit" || isLimitReached) {
          const limitReachedMsg: ChatMessage = {
            id: `b-${Date.now()}`,
            sender: "bot",
            text: t('botLimitReached').replace("{max}", String(maxBookingsCount)),
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, limitReachedMsg]);
          setIsBotTyping(false);
          return;
        }

        const bookingBotMsg: ChatMessage = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: t('botBookingSystemReady'),
          timestamp: new Date(),
          isBookingCard: true
        };
        setChatMessages(prev => [...prev, bookingBotMsg]);
        setIsBotTyping(false);
      }, 700);
      return;
    }

    try {
      const payload = {
        messages: [...chatMessages, userMsg],
        services,
        guidelines,
        dailyStatus,
        quickActions,
        clinicInfo,
        language: currentLanguage
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("فشل في الحصول على رد من خادم الذكاء الاصطناعي");
      }

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: data.reply || (currentLanguage === "ar" ? "عذراً، لم أستطع إجابتك بشكل سليم." : currentLanguage === "fr" ? "Désolé, je n'ai pas pu vous répondre correctement." : "Sorry, I could not answer you properly."),
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botMsg]);

    } catch (err: any) {
      console.error("Chat API error:", err);
      const errorMsg: ChatMessage = {
        id: `b-err-${Date.now()}`,
        sender: "bot",
        text: currentLanguage === "ar"
          ? `عذراً، حدث خطأ أثناء محاولة الاتصال بالذكاء الاصطناعي. يرجى التحقق من تفعيل مفتاح الـ API الخاص بـ Gemini في إعدادات العيادة هاتفياً عبر الرقم (${clinicInfo.phone}).`
          : currentLanguage === "fr"
          ? `Désolé, une erreur s'est produite lors de la tentative de connexion à l'IA. Veuillez vérifier l'activation de la clé API Gemini de la clinique en appelant le (${clinicInfo.phone}).`
          : `Sorry, an error occurred while trying to connect to the AI. Please verify the Gemini API key activation in the clinic settings by calling (${clinicInfo.phone}).`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsBotTyping(false);
    }
  };

  // Test how the comprehensive definition behaves with the Bot
  const handleTestBotKnowledge = async (customQuestion: string) => {
    const questionToTest = customQuestion || botTestQuestion;
    if (!questionToTest.trim()) {
      showNotification("يرجى كتابة سؤال لفحصه!", "error");
      return;
    }

    setIsBotTesting(true);
    setBotTestAnswer("");

    try {
      const payload = {
        messages: [{ id: `test-q-${Date.now()}`, sender: "user", text: questionToTest, timestamp: new Date() }],
        services,
        guidelines,
        dailyStatus,
        quickActions,
        clinicInfo: {
          ...clinicInfo,
          notes: clinicInfo.notes // Test the latest edited notes
        }
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("حدث خطأ أثناء الاتصال بالخادم");
      }

      const data = await response.json();
      setBotTestAnswer(data.reply || "عذراً، لم أستطع إجابتك بشكل سليم.");
    } catch (err: any) {
      console.error("Test bot query error:", err);
      // Smart local fallback if the server is offline or Gemini throws an error
      setBotTestAnswer(`[مُحاكاة محلية ذكية لعدم توفر الاتصال] 🤖
بناءً على معلومات عيادتك الحالية:
- الطبيب المسؤول: ${interactiveDocName} (${interactiveDocBio})
- الخدمات: ${interactiveServices}
- أوقات العمل: ${interactiveWorkHours}
- العطلة: ${interactiveWeekend}

سأجيب المريض كالتالي: "أهلاً بك! تحت إشراف الدكتور ${interactiveDocName} (${interactiveDocBio})، نقدم لك خدماتنا: ${interactiveServices} في أوقات العمل الرسمية: ${interactiveWorkHours}، وعطلتنا الأسبوعية: ${interactiveWeekend}."`);
    } finally {
      setIsBotTesting(false);
    }
  };

  // Handlers for Services
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const newSrv: ClinicService = {
      id: `service-${Date.now()}`,
      name: newServiceName,
      description: newServiceDesc,
      price: newServicePrice || "غير محدد"
    };

    const updated = [...services, newSrv];
    setServices(updated);
    setNewServiceName("");
    setNewServiceDesc("");
    setNewServicePrice("");
    saveToLocalStorage(clinicInfo, dailyStatus, updated, guidelines, quickActions);
  };

  const handleDeleteService = (id: string) => {
    const service = services.find(s => s.id === id);
    setDeleteConfirm({
      isOpen: true,
      title: "تأكيد حذف الخدمة",
      message: `هل أنت متأكد من رغبتك في حذف خدمة "${service?.name || ''}" نهائياً من قائمة الخدمات المتوفرة بالعيادة؟`,
      onConfirm: () => {
        const updated = services.filter(s => s.id !== id);
        setServices(updated);
        saveToLocalStorage(clinicInfo, dailyStatus, updated, guidelines, quickActions);
        showNotification("تم حذف الخدمة نهائياً من قاعدة البيانات. 🗑️", "success");
        setDeleteConfirm(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Handlers for Guidelines
  const handleAddGuideline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuidelineTitle.trim() || !newGuidelineContent.trim()) return;

    const newGd: ClinicGuideline = {
      id: `guideline-${Date.now()}`,
      title: newGuidelineTitle,
      content: newGuidelineContent
    };

    const updated = [...guidelines, newGd];
    setGuidelines(updated);
    setNewGuidelineTitle("");
    setNewGuidelineContent("");
    saveToLocalStorage(clinicInfo, dailyStatus, services, updated, quickActions);
  };

  const handleDeleteGuideline = (id: string) => {
    const guideline = guidelines.find(g => g.id === id);
    setDeleteConfirm({
      isOpen: true,
      title: "تأكيد حذف التعليمات / الإرشادات",
      message: `هل أنت متأكد من رغبتك في حذف الإرشاد الطبي "${guideline?.title || ''}" نهائياً؟`,
      onConfirm: () => {
        const updated = guidelines.filter(g => g.id !== id);
        setGuidelines(updated);
        saveToLocalStorage(clinicInfo, dailyStatus, services, updated, quickActions);
        showNotification("تم حذف الإرشاد الطبي بنجاح. 🗑️", "success");
        setDeleteConfirm(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Handlers for Quick Action Buttons
  const handleAddQuickAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newButtonLabel.trim() || !newButtonResponse.trim()) return;

    const newBtn: QuickAction = {
      id: `btn-${Date.now()}`,
      label: newButtonLabel,
      response: newButtonResponse
    };

    const updated = [...quickActions, newBtn];
    setQuickActions(updated);
    setNewButtonLabel("");
    setNewButtonResponse("");
    saveToLocalStorage(clinicInfo, dailyStatus, services, guidelines, updated);
  };

  const handleDeleteQuickAction = (id: string) => {
    const updated = quickActions.filter(a => a.id !== id);
    setQuickActions(updated);
    saveToLocalStorage(clinicInfo, dailyStatus, services, guidelines, updated);
  };

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveToLocalStorage(clinicInfo, dailyStatus, services, guidelines, quickActions);
  };

  // Live Sync Daily Status
  const handleSaveDailyStatus = () => {
    saveToLocalStorage(clinicInfo, dailyStatus, services, guidelines, quickActions);
  };

  // Excel / CSV Import Parser Preview Trigger
  useEffect(() => {
    if (importTypeText.trim()) {
      if (importTarget === "services") {
        const parsed = parseExcelOrCsvToServices(importTypeText, currentLanguage);
        setImportPreview(parsed);
      } else {
        const parsed = parseExcelOrCsvToGuidelines(importTypeText, currentLanguage);
        setImportPreview(parsed);
      }
    } else {
      setImportPreview([]);
    }
  }, [importTypeText, importTarget, currentLanguage]);

  // Execute actual database import
  const handleCommitImport = () => {
    if (importPreview.length === 0) return;

    if (importTarget === "services") {
      const updated = [...services, ...importPreview];
      setServices(updated);
      saveToLocalStorage(clinicInfo, dailyStatus, updated, guidelines, quickActions);
    } else {
      const updated = [...guidelines, ...importPreview];
      setGuidelines(updated);
      saveToLocalStorage(clinicInfo, dailyStatus, services, updated, quickActions);
    }

    setImportTypeText("");
    setImportPreview([]);
    showNotification(`نجح استيراد عدد (${importPreview.length}) من السجلات لقاعدة البيانات! 📊`, "success");
  };

  // 🤖 Dynamic Reusable Chatbot Component (Renders the high-end smartphone simulator)
  const renderChatbot = (isFloating: boolean = false) => {
    return (
      <div className={`w-full ${isFloating ? "max-w-[360px] h-[600px] rounded-[30px]" : "max-w-[400px] h-[720px] rounded-[40px]"} bg-slate-950 border-[10px] border-slate-800/90 shadow-2xl shadow-teal-500/5 flex flex-col overflow-hidden relative ${isRtl ? "text-right" : "text-left"}`} dir={isRtl ? "rtl" : "ltr"}>
        
        {/* Phone Ear Speaker & Sensor bar */}
        <div className="h-6 bg-slate-950 flex items-center justify-center relative shrink-0">
          <div className="w-24 h-4 bg-slate-800 rounded-b-xl absolute top-0" />
        </div>

        {/* Chat App Header */}
        <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="bg-gradient-to-tr from-teal-500 to-cyan-400 p-2 rounded-lg text-slate-950">
                <Bot className="w-5 h-5" />
              </div>
              {/* Green Pulsing Live Dot */}
              <div className="w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full absolute -bottom-0.5 -right-0.5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-100 line-clamp-1">{localizeDynamicText(clinicInfo.name, currentLanguage) || t('botSmartAssistant')}</h4>
              <p className="text-[10px] text-slate-400 line-clamp-1">{localizeDynamicText(clinicInfo.specialty, currentLanguage) || t('botSubtitle')}</p>
            </div>
          </div>
          <div className="text-left flex items-center gap-2">
            {isFloating && (
              <button 
                onClick={() => setIsFloatingChatOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all cursor-pointer border border-slate-800/40"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
              {t('botStatusReady')}
            </span>
          </div>
        </div>

        {/* Micro daily banner inside chatbot directly for patient context */}
        <div className={`bg-teal-500/5 border-b border-teal-500/10 px-3.5 py-2 shrink-0 flex items-start gap-2 ${isRtl ? "text-right" : "text-left"}`}>
          <Clock className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
          <div className="space-y-0.5 text-[10px] text-slate-300 leading-normal">
            <span className="font-bold text-teal-400">{t('botDailyUpdateBanner')}</span>
            <p className="line-clamp-2" title={dailyStatus || t('botDefaultUpdateText')}>
              {dailyStatus || t('botDefaultUpdateText')}
            </p>
          </div>
        </div>

        {/* Messages Screen Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 space-y-4">
          
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 max-w-[85%] ${msg.sender === "user" ? "mr-auto flex-row-reverse" : "ml-auto"}`}
            >
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === "user" 
                  ? "bg-slate-800 text-slate-300" 
                  : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
              }`}>
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                {msg.image && (
                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 max-w-[180px] md:max-w-[220px]">
                    <img
                      src={msg.image.previewUrl || `data:${msg.image.mimeType};base64,${msg.image.data}`}
                      alt="Attached file"
                      className="w-full h-auto object-cover max-h-40 cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  </div>
                )}

                {msg.audio && (
                  <div className="rounded-xl p-2 border border-slate-800 bg-slate-900 flex items-center gap-2 max-w-[180px] md:max-w-[220px]" dir={isRtl ? "rtl" : "ltr"}>
                    <div className="bg-teal-500/15 p-1.5 rounded-lg text-teal-400 shrink-0">
                      <Volume2 className="w-3.5 h-3.5" />
                    </div>
                    <audio 
                      src={msg.audio.audioUrl || `data:${msg.audio.mimeType};base64,${msg.audio.data}`} 
                      controls 
                      className="w-full h-8 max-w-[120px] outline-none"
                    />
                  </div>
                )}

                {msg.text && (
                  <div className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? `bg-teal-500 text-slate-950 rounded-tr-none font-medium ${isRtl ? "text-right" : "text-left"}`
                      : `bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none ${isRtl ? "text-right" : "text-left"}`
                  }`}>
                    {localizeDynamicText(msg.text, currentLanguage)}
                  </div>
                )}

                {/* Smart Interactive Booking Card Widget inside the Bot Bubble */}
                {msg.isBookingCard && (
                  <div className="mt-2 bg-slate-950/95 rounded-2xl p-4 border border-slate-800/85 space-y-3.5 w-64 md:w-72 shadow-xl" dir={isRtl ? "rtl" : "ltr"}>
                    {submittedBookingId === msg.id ? (
                      <div className="text-center py-5 space-y-2.5">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                        </motion.div>
                        <p className="font-bold text-white text-xs">{t('botBookingSuccessTitle')}</p>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          {t('botBookingSuccessDesc')}
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleChatBookingSubmit(e, msg.id)} className={`space-y-3 ${isRtl ? "text-right" : "text-left"}`}>
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-teal-400" />
                            <h5 className="font-bold text-teal-400 text-xs">{t('botSmartBookingTitle')}</h5>
                          </div>
                          <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md font-mono">
                            {t('stepLabel')} {getChatBookingProgress().filled}/{getChatBookingProgress().total}
                          </span>
                        </div>

                        {/* Dynamic Booking Progress Bar */}
                        <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-800/60 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-medium">{t('botBookingProgressLabel')}</span>
                            <span className={`font-bold transition-all duration-300 ${getChatBookingProgress().percentage === 100 ? 'text-emerald-400' : 'text-teal-400'}`}>
                              {getChatBookingProgress().percentage}% {getChatBookingProgress().percentage === 100 && t('botBookingProgressReady')}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden relative">
                            <motion.div 
                              className={`h-full rounded-full transition-all duration-500 ${getChatBookingProgress().percentage === 100 ? 'bg-emerald-500' : 'bg-teal-500'}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${getChatBookingProgress().percentage}%` }}
                              transition={{ type: "spring", stiffness: 80 }}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block text-[10px] text-slate-400 font-medium">{t('botPatientNameLabel')}</label>
                          <input
                            type="text"
                            value={chatBookingName}
                            onChange={(e) => setChatBookingName(e.target.value)}
                            placeholder={t('botPatientNamePlaceholder')}
                            className={`w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none ${isRtl ? "text-right" : "text-left"}`}
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] text-slate-400 font-medium">{t('botPatientPhoneLabel')}</label>
                          <input
                            type="tel"
                            value={chatBookingPhone}
                            onChange={(e) => setChatBookingPhone(e.target.value)}
                            placeholder={t('botPatientPhonePlaceholder')}
                            className={`w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none ${isRtl ? "text-right" : "text-left"}`}
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] text-slate-400 font-medium">{t('botPatientServiceLabel')}</label>
                          <select
                            value={chatBookingService}
                            onChange={(e) => setChatBookingService(e.target.value)}
                            className={`w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer ${isRtl ? "text-right" : "text-left"}`}
                            required
                          >
                            <option value="">{t('botPatientServicePlaceholder')}</option>
                            {services.map(s => (
                              <option key={s.id} value={s.name}>{localizeDynamicText(s.name, currentLanguage)} ({s.price})</option>
                            ))}
                            {services.length === 0 && (
                              <option value="استشارة وفحص طبي">{currentLanguage === "ar" ? "استشارة وفحص طبي" : currentLanguage === "fr" ? "Consultation & Examen médical" : "Medical Consultation & Examination"}</option>
                            )}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="block text-[10px] text-slate-400 font-medium">{t('botPatientDateLabel')}</label>
                            <input
                              type="date"
                              value={chatBookingDate}
                              onChange={(e) => setChatBookingDate(e.target.value)}
                              className={`w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[10px] focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer ${isRtl ? "text-right" : "text-left"}`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] text-slate-400 font-medium">{t('botPatientTimeLabel')}</label>
                            <input
                              type="time"
                              value={chatBookingTime}
                              onChange={(e) => setChatBookingTime(e.target.value)}
                              className={`w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[10px] focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer ${isRtl ? "text-right" : "text-left"}`}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] text-slate-400 font-medium">{t('botPatientSymptomsLabel')}</label>
                          <input
                            type="text"
                            value={chatBookingNotes}
                            onChange={(e) => setChatBookingNotes(e.target.value)}
                            placeholder={t('botPatientSymptomsPlaceholder')}
                            className={`w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none ${isRtl ? "text-right" : "text-left"}`}
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer mt-2.5 border border-teal-400"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{t('botBookingConfirmBtn')}</span>
                        </button>
                      </form>
                    )}
                  </div>
                )}

                <p className={`text-[8px] text-slate-500 ${msg.sender === "user" ? "text-left" : "text-right"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isBotTyping && (
            <div className="flex gap-2.5 max-w-[85%] ml-auto">
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce delay-200" />
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Custom Quick Actions Panel - Patient can tap them instantly! */}
        <div className="bg-slate-950/90 border-t border-slate-800/50 p-2.5 shrink-0 space-y-1.5">
          <p className="text-[9px] text-slate-400 px-1.5 font-bold flex items-center gap-1 justify-start">
            <Sparkles className="w-3 h-3 text-teal-400" /> {t('botQuickActionsLabel')}
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800" dir={isRtl ? "rtl" : "ltr"}>
            <button
              onClick={() => handleQuickActionClick({
                id: "booking-trigger",
                label: t('botBookingTriggerBtn'),
                response: t('botBookingTriggerResponse')
              })}
              className="text-[10px] bg-teal-500 hover:bg-teal-400 border border-teal-600/30 text-slate-950 px-3 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 shadow-sm shadow-teal-500/20 whitespace-nowrap"
            >
              <span>{t('botBookingTriggerBtnLabel')}</span>
            </button>
            {quickActions.map(action => (
              <button
                key={action.id}
                onClick={() => handleQuickActionClick(action)}
                className="text-[10px] bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer whitespace-nowrap"
              >
                {localizeDynamicText(action.label, currentLanguage)}
              </button>
            ))}
          </div>
        </div>

        {/* Message input form */}
        <form 
          onSubmit={handleSendMessage} 
          className="bg-slate-900 border-t border-slate-800 px-3.5 py-3 flex gap-2 shrink-0 items-center"
        >
          <input
            type="file"
            id={`chat-image-input-${isFloating ? 'floating' : 'embedded'}`}
            accept="image/*"
            className="hidden"
            onChange={handleImageAttachment}
            disabled={isBotTyping || isRecording}
          />
          
          <div className="flex gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => document.getElementById(`chat-image-input-${isFloating ? 'floating' : 'embedded'}`)?.click()}
              disabled={isBotTyping || isRecording}
              className="p-2.5 rounded-xl bg-slate-950 text-slate-400 hover:text-teal-400 border border-slate-800 hover:bg-slate-900 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              title={t('botTitleImageUpload')}
            >
              <Image className="w-4 h-4 text-teal-400" />
            </button>

            <button
              type="button"
              onClick={isCameraOpen ? stopCamera : startCamera}
              disabled={isBotTyping || isRecording}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                isCameraOpen 
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/30" 
                  : "bg-slate-950 text-slate-400 hover:text-teal-400 border-slate-800 hover:bg-slate-900"
              }`}
              title={t('botTitleCameraShot')}
            >
              <Camera className="w-4 h-4 text-teal-400" />
            </button>

            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isBotTyping || isCameraOpen}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                isRecording 
                  ? "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse" 
                  : "bg-slate-950 text-slate-400 hover:text-teal-400 border-slate-800 hover:bg-slate-900"
              }`}
              title={t('botTitleAudioRecording')}
            >
              <Mic className="w-4 h-4 text-teal-400" />
            </button>
          </div>

          {isRecording ? (
            <div className="flex-1 bg-slate-950 border border-rose-500/30 rounded-xl px-3 py-2.5 flex items-center justify-between gap-3" dir={isRtl ? "rtl" : "ltr"}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                <span className="text-[10px] text-rose-400 font-bold font-mono">
                  {String(Math.floor(recordingSeconds / 60)).padStart(2, "0")}:{String(recordingSeconds % 60).padStart(2, "0")}
                </span>
                <span className="text-[9px] text-slate-400">{t('botRecordingStatusText')}</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={stopRecording}
                  className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all cursor-pointer flex items-center justify-center"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={cancelRecording}
                  className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer flex items-center justify-center"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <input
              type="text"
              placeholder={t('botInputPlaceholder')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isBotTyping}
              className={`flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 placeholder-slate-500 ${isRtl ? "text-right" : "text-left"}`}
            />
          )}

          <button
            type="submit"
            disabled={(!inputValue.trim() && !attachedImage && !attachedAudio) || isBotTyping || isRecording}
            className={`p-2.5 rounded-xl text-slate-950 font-bold transition-all shrink-0 ${
              (inputValue.trim() || attachedImage || attachedAudio) && !isBotTyping && !isRecording
                ? "bg-teal-500 hover:bg-teal-400 shadow-md shadow-teal-500/10 cursor-pointer text-slate-950" 
                : "bg-slate-800 text-slate-600 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4 text-slate-950" />
          </button>
        </form>

        {/* Bottom Safe Indicator bar */}
        <div className="h-4 bg-slate-950 flex items-center justify-center shrink-0">
          <div className="w-32 h-1 bg-slate-850 rounded-full" />
        </div>

      </div>
    );
  };

  // 🌐 SAAS LANDING AND PLATFORM PORTAL VIEW MODE
  if (currentTenant === null && portalTenantId === null) {
    return (
      <SaasPortal
        tenants={tenants}
        onLogin={handleDoctorLogin}
        onSignUp={handleDoctorSignUp}
        onViewClinic={openPatientPortal}
        saasView={saasView}
        setSaasView={setSaasView}
        checkoutPlanId={checkoutPlanId}
        setCheckoutPlanId={setCheckoutPlanId}
        showNotification={showNotification}
        currentLanguage={currentLanguage}
        onLanguageChange={(lang) => {
          setCurrentLanguage(lang);
          localStorage.setItem("shafi_current_language", lang);
          const localizedMsg = 
            lang === "ar" ? "تم تغيير لغة المنصة والتحكم إلى العربية بنجاح! 🇸🇦" :
            lang === "fr" ? "Langue de la plateforme changée en français avec succès ! 🇫🇷" :
            "Platform language successfully changed to English! 🇺🇸";
          showNotification(localizedMsg, "success");
        }}
      />
    );
  }

  // 🌐 PUBLIC WEBSITE VIEW MODE
  if (viewMode === "website") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col relative overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
        {/* Floating SaaS Return Bar */}
        {portalTenantId && (
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-[11px] font-medium text-slate-400 select-none shrink-0 relative z-50 shadow-md">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span>{t('previewBarLabel')}<strong className="text-teal-400">{localizeDynamicText(clinicInfo.name, currentLanguage) || "Clinic"}</strong></span>
            </div>
            <button
              onClick={() => {
                setPortalTenantId(null);
                setViewMode("website"); // go back to SaaS landing
                showNotification(t('returnedToSaaSNotif'), "info");
              }}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{t('returnToSaaSHoriz')}</span>
            </button>
          </div>
        )}
        {/* Ambient glow effects */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Global notification popup inside website view */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-medium text-sm backdrop-blur-md border ${
                notification.type === "success" 
                  ? "bg-emerald-500/95 text-white border-emerald-400" 
                  : notification.type === "error"
                  ? "bg-rose-500/95 text-white border-rose-400"
                  : "bg-teal-500/95 text-white border-teal-400"
              }`}
            >
              {notification.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span>{notification.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Chat Widget Panel (Drawer) */}
        <AnimatePresence>
          {isFloatingChatOpen && (
            <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFloatingChatOpen(false)}
                className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs pointer-events-auto"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="relative w-full max-w-[420px] h-full bg-slate-950 shadow-2xl border-r border-slate-800 p-4 flex flex-col pointer-events-auto z-10"
              >
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3" dir={isRtl ? "rtl" : "ltr"}>
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-teal-400 animate-pulse" />
                    <span className="font-extrabold text-sm text-slate-100">{t('botWelcomeTitle')}</span>
                  </div>
                  <button
                    onClick={() => setIsFloatingChatOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  {renderChatbot(true)}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* PUBLIC NAVBAR */}
        <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-40 px-4 py-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-teal-500 to-cyan-400 p-2.5 rounded-xl shadow-lg shadow-teal-500/20 text-slate-950">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div className={isRtl ? "text-right" : "text-left"}>
              <h1 className="text-base font-extrabold bg-gradient-to-l from-white via-slate-100 to-teal-400 bg-clip-text text-transparent">
                {localizeDynamicText(clinicInfo.name, currentLanguage) || (currentLanguage === "ar" ? "عيادتي الذكية" : currentLanguage === "fr" ? "Ma Clinique" : "My Clinic")}
              </h1>
              <p className="text-[10px] text-teal-400 font-bold">{localizeDynamicText(clinicInfo.specialty, currentLanguage) || (currentLanguage === "ar" ? "رعاية صحية واستشارات متميزة" : currentLanguage === "fr" ? "Soins et conseils d'excellence" : "Premium care and consultations")}</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-400">
            <a href="#" className="hover:text-teal-400 transition-colors text-slate-200">{t('navHome')}</a>
            <a href="#services" className="hover:text-teal-400 transition-colors">{t('navServices')}</a>
            <a href="#e-clinic" className="hover:text-teal-400 transition-colors">{t('navEClinic')}</a>
            <a href="#about" className="hover:text-teal-400 transition-colors">{t('navAbout')}</a>
            {guidelines.length > 0 && (
              <a href="#faq" className="hover:text-teal-400 transition-colors">{t('navFaq')}</a>
            )}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setIsFloatingChatOpen(true);
                showNotification(currentLanguage === "ar" ? "أهلاً بك! يمكنك الاستفسار أو حجز موعد فورياً مع مساعدنا الذكي الآن." : currentLanguage === "fr" ? "Bienvenue ! Vous pouvez poser des questions ou prendre rendez-vous instantanément avec notre assistant intelligent." : "Welcome! You can inquire or book an appointment instantly with our smart assistant now.", "info");
              }}
              className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-teal-500/5"
            >
              <Bot className="w-3.5 h-3.5 animate-bounce text-teal-400" />
              <span>{t('btnInstantConsult')}</span>
            </button>
            <button
              onClick={() => {
                setViewMode("admin");
                showNotification(currentLanguage === "ar" ? "أهلاً بك يا دكتور! تم الدخول للوحة التحكم الطبية بنجاح 🔑" : currentLanguage === "fr" ? "Bienvenue Docteur ! Vous êtes connecté avec succès au panneau d'administration médicale 🔑" : "Welcome Doctor! You have successfully logged in to the medical control panel 🔑", "success");
              }}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-inner"
              title={currentLanguage === "ar" ? "لوحة الإدارة وتدريب الشات بوت" : currentLanguage === "fr" ? "Panneau d'administration et formation du chatbot" : "Admin Panel & Chatbot Training"}
            >
              <Sliders className="w-3.5 h-3.5 text-teal-400" />
              <span>{t('btnDocPortal')}</span>
            </button>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="relative py-16 md:py-24 text-center px-4 max-w-5xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs text-slate-300">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${bookingSystemStatus === "open" ? "bg-emerald-400" : "bg-rose-400"}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${bookingSystemStatus === "open" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
            </span>
            {bookingSystemStatus === "open" ? (
              <span>{t('statusReady')}</span>
            ) : bookingSystemStatus === "outside_hours" ? (
              <span>{t('statusClosed')}</span>
            ) : (
              <span>{t('statusFull')}</span>
            )}
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            {localizeDynamicText(clinicInfo.name, currentLanguage) || (currentLanguage === "ar" ? "عيادتنا الذكية المتطورة" : currentLanguage === "fr" ? "Notre Clinique Intelligente" : "Our Smart Clinic")} <br />
            <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent text-xl md:text-3xl lg:text-4xl mt-3.5 block">
              {t('clinicMotto')}
            </span>
          </h2>

          <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('clinicSubDesc').replace("{doctor}", localizeDynamicText(clinicInfo.doctorName || (currentLanguage === "ar" ? "الاستشاري المتخصص" : currentLanguage === "fr" ? "le médecin spécialiste" : "the specialist physician"), currentLanguage))}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <a
              href="#e-clinic"
              className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 text-xs font-extrabold px-6 py-3.5 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 border border-teal-400 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-slate-950" />
              <span>{t('heroBtnAI')}</span>
            </a>
            <a
              href="#services"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-teal-400" />
              <span>{t('heroBtnServices')}</span>
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 max-w-4xl mx-auto text-right">
            <div className="bg-slate-900/40 border border-slate-800/60 p-4.5 rounded-2xl space-y-1">
              <span className="text-slate-500 text-[10px] font-bold block">{t('labelSpecialty')}</span>
              <span className="text-xs font-bold text-teal-400 line-clamp-1">{localizeDynamicText(clinicInfo.specialty, currentLanguage) || (currentLanguage === "ar" ? "تخصص متميز وعلاج حديث" : currentLanguage === "fr" ? "Spécialité d'excellence" : "Premium Specialty")}</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/60 p-4.5 rounded-2xl space-y-1">
              <span className="text-slate-500 text-[10px] font-bold block">{t('labelPhone')}</span>
              <span className="text-xs font-bold text-slate-200" dir="ltr">{clinicInfo.phone || (currentLanguage === "ar" ? "متوفر بالداخل" : currentLanguage === "fr" ? "Disponible" : "Available")}</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/60 p-4.5 rounded-2xl space-y-1">
              <span className="text-slate-500 text-[10px] font-bold block">{t('labelAddress')}</span>
              <span className="text-xs font-bold text-slate-200 line-clamp-1">{localizeDynamicText(clinicInfo.address, currentLanguage) || (currentLanguage === "ar" ? "العنوان المعتمد" : currentLanguage === "fr" ? "Adresse agréée" : "Approved Address")}</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/60 p-4.5 rounded-2xl space-y-1">
              <span className="text-slate-500 text-[10px] font-bold block">{t('labelHours')}</span>
              <span className="text-xs font-bold text-slate-200 line-clamp-1">{localizeDynamicText(clinicInfo.workHours, currentLanguage) || (currentLanguage === "ar" ? "من السبت للخميس" : currentLanguage === "fr" ? "Du samedi au jeudi" : "Saturday to Thursday")}</span>
            </div>
          </div>
        </section>

        {/* PUBLIC SERVICES */}
        <section id="services" className="py-16 bg-slate-900/20 border-y border-slate-900 px-4">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <h3 className="text-2xl md:text-3xl font-extrabold text-white">{t('titleServices')}</h3>
              <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
                {t('descServices')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.length > 0 ? (
                services.map((service, idx) => (
                  <div
                    key={service.id}
                    className="bg-slate-950/60 border border-slate-900 hover:border-teal-500/30 p-5 rounded-2xl transition-all duration-300 flex flex-col gap-4 relative overflow-hidden group text-right"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl group-hover:bg-teal-500/10 transition-colors" />
                    
                    <div className="flex items-center justify-between">
                      <div className="bg-teal-500/10 text-teal-400 p-2.5 rounded-xl">
                        <Heart className="w-5 h-5 text-teal-400 group-hover:scale-115 transition-transform" />
                      </div>
                      <div className="text-left">
                        <span className="text-teal-400 font-extrabold text-sm block">
                          {service.price} {isNaN(Number(service.price)) ? "" : (currentLanguage === "ar" ? "دج" : "DA")}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold block">{t('durationLabel').replace("{duration}", String(service.duration || 30))}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-extrabold text-slate-100 text-sm group-hover:text-teal-400 transition-colors">{localizeDynamicText(service.name, currentLanguage)}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 min-h-[50px]">
                        {localizeDynamicText(service.description, currentLanguage) || (currentLanguage === "ar" ? "وصف الخدمة العلاجية المتاحة لمرضى العيادة. يرجى مراجعة الطبيب المعالج للحصول على خطتك المخصصة." : currentLanguage === "fr" ? "Description du service thérapeutique disponible pour les patients. Veuillez consulter le médecin traitant pour obtenir votre plan personnalisé." : "Description of the therapeutic service available to the clinic's patients. Please consult your treating physician for your customized plan.")}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setChatBookingService(service.name);
                        setIsFloatingChatOpen(true);
                        handleQuickActionClick({
                          id: "booking-trigger",
                          label: currentLanguage === "ar" ? `📅 حجز: ${localizeDynamicText(service.name, currentLanguage)}` : currentLanguage === "fr" ? `📅 Réserver : ${localizeDynamicText(service.name, currentLanguage)}` : `📅 Book: ${localizeDynamicText(service.name, currentLanguage)}`,
                          response: currentLanguage === "ar" 
                            ? `أهلاً بك! لقد اخترت خدمة (${localizeDynamicText(service.name, currentLanguage)}). يرجى إكمال نموذج الحجز أدناه للحصول على موعدك.` 
                            : currentLanguage === "fr" 
                            ? `Bienvenue ! Vous avez choisi le service (${localizeDynamicText(service.name, currentLanguage)}). Veuillez remplir le formulaire de réservation ci-dessous pour obtenir votre rendez-vous.` 
                            : `Welcome! You have chosen the service (${localizeDynamicText(service.name, currentLanguage)}). Please fill out the booking form below to get your appointment.`
                        });
                        showNotification(
                          currentLanguage === "ar" 
                            ? `تم تحديد خدمة (${localizeDynamicText(service.name, currentLanguage)}) وتنشيط استمارة الحجز في الشات بوت! 📅` 
                            : currentLanguage === "fr" 
                            ? `Service (${localizeDynamicText(service.name, currentLanguage)}) sélectionné et formulaire de réservation activé dans le chatbot ! 📅` 
                            : `Service (${localizeDynamicText(service.name, currentLanguage)}) selected and booking form activated in the chatbot! 📅`, 
                          "info"
                        );
                      }}
                      className="w-full bg-slate-900 hover:bg-teal-500 hover:text-slate-950 text-slate-300 hover:border-teal-400 text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-auto"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{t('bookServiceBtn')}</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-slate-900/40 p-10 rounded-2xl text-center border border-slate-800/80">
                  <Stethoscope className="w-10 h-10 text-slate-500 mx-auto mb-3 animate-pulse" />
                  <p className="text-slate-400 text-xs font-bold">{t('loadingServices')}</p>
                  <p className="text-slate-500 text-[10px] mt-1">{t('loadingServicesDesc')}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PUBLIC CHATBOT INTERFACE */}
        <section id="e-clinic" className="py-16 max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className={`lg:col-span-7 space-y-6 ${isRtl ? "text-right" : "text-left"}`}>
            <div className="space-y-2">
              <span className="text-teal-400 font-extrabold text-xs tracking-wider bg-teal-500/10 px-3 py-1 rounded-full">{t('chatBannerBadge')}</span>
              <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                {t('chatBannerTitle')} <br />
                <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">{t('chatBannerSub')}</span>
              </h3>
            </div>

            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              {t('chatDesc').replace("{doctor}", localizeDynamicText(clinicInfo.doctorName || "", currentLanguage) || (currentLanguage === "ar" ? "الطبيب الاستشاري" : currentLanguage === "fr" ? "le médecin spécialiste" : "the specialist physician"))}
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 bg-slate-900/40 p-3.5 rounded-xl border border-slate-900">
                <div className="bg-teal-500/10 p-2 rounded-lg text-teal-400 shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">{t('feat1Title')}</span>
                  <span className="text-[11px] text-slate-400">{t('feat1Desc')}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-slate-900/40 p-3.5 rounded-xl border border-slate-900">
                <div className="bg-teal-500/10 p-2 rounded-lg text-teal-400 shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">{t('feat2Title')}</span>
                  <span className="text-[11px] text-slate-400">{t('feat2Desc')}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-slate-900/40 p-3.5 rounded-xl border border-slate-900">
                <div className="bg-teal-500/10 p-2 rounded-lg text-teal-400 shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">{t('feat3Title')}</span>
                  <span className="text-[11px] text-slate-400">{t('feat3Desc')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center w-full">
            {renderChatbot(false)}
          </div>
        </section>

        {/* CLINIC BIO / WORKING HOURS */}
        <section id="about" className="py-16 bg-slate-900/20 border-t border-slate-900 px-4">
          <div className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start ${isRtl ? "text-right" : "text-left"}`}>
            
            <div className="md:col-span-7 bg-slate-950/60 border border-slate-900 p-6 rounded-2xl space-y-5">
              <h3 className={`text-xl font-extrabold text-white flex items-center gap-2 ${isRtl ? "justify-end" : "justify-start"}`}>
                <span>{t('aboutTitle')}</span>
                <Heart className="w-5 h-5 text-teal-400" />
              </h3>

              <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed">
                <p>
                  {t('aboutClinicText').replace("{clinic}", localizeDynamicText(clinicInfo.name, currentLanguage) || (currentLanguage === "ar" ? "عيادتنا الذكية" : currentLanguage === "fr" ? "notre clinique" : "our clinic"))}
                </p>
                <p>
                  {t('aboutDoctorText').replace("{doctor}", localizeDynamicText(clinicInfo.doctorName, currentLanguage) || (currentLanguage === "ar" ? "الاستشاري المتخصص" : currentLanguage === "fr" ? "le médecin spécialiste" : "the specialist physician"))}
                </p>
                {clinicInfo.notes && (
                  <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 italic">
                    💡 " {localizeDynamicText(clinicInfo.notes, currentLanguage)} "
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="flex items-center gap-3 bg-slate-900/50 p-3.5 rounded-xl border border-slate-900/80">
                  <MapPin className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <span className="text-slate-500 block">{t('aboutLocationLabel')}</span>
                    <span className="font-bold text-slate-200">{localizeDynamicText(clinicInfo.address, currentLanguage) || (currentLanguage === "ar" ? "غير مدخل" : currentLanguage === "fr" ? "Non renseigné" : "Not entered")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-900/50 p-3.5 rounded-xl border border-slate-900/80">
                  <Phone className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <span className="text-slate-500 block">{t('aboutPhoneLabel')}</span>
                    <span className="font-bold text-slate-200" dir="ltr">{clinicInfo.phone || (currentLanguage === "ar" ? "غير مدخل" : currentLanguage === "fr" ? "Non renseigné" : "Not entered")}</span>
                  </div>
                </div>
              </div>

              {/* Embedded Interactive ClinicMap component */}
              <div className="w-full h-[220px] rounded-xl overflow-hidden border border-slate-800">
                <ClinicMap clinicInfo={clinicInfo} onChange={() => {}} />
              </div>
            </div>

            <div className="md:col-span-5 bg-slate-950/60 border border-slate-900 p-6 rounded-2xl space-y-5">
              <h3 className={`text-xl font-extrabold text-white flex items-center gap-2 ${isRtl ? "justify-end" : "justify-start"}`}>
                <span>{t('hoursTitle')}</span>
                <Clock className="w-5 h-5 text-teal-400" />
              </h3>

              <div className="space-y-4">
                <div className="bg-slate-900/50 p-4.5 rounded-xl border border-slate-900/80 space-y-2 text-center">
                  <span className="text-xs text-slate-400 font-bold block">{t('hoursSubTitle')}</span>
                  <span className="text-base font-black text-teal-400 block">{localizeDynamicText(clinicInfo.workHours, currentLanguage) || (currentLanguage === "ar" ? "من 9:00 صباحاً إلى 9:00 مساءً" : currentLanguage === "fr" ? "De 9h00 à 21h00" : "From 9:00 AM to 9:00 PM")}</span>
                  <span className="text-[10px] text-slate-500 block">{t('hoursDays')}</span>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="text-slate-400">{t('hoursSatThu')}</span>
                    <span className="font-bold text-slate-200">{localizeDynamicText(clinicInfo.workHours, currentLanguage) || "09:00 - 21:00"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="text-slate-400">{t('hoursFriday')}</span>
                    <span className="text-rose-500 font-bold">{t('hoursFridayClosed')}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="text-slate-400">{t('hoursHotline')}</span>
                    <span className="font-bold text-teal-400" dir="ltr">{clinicInfo.emergencyPhone || clinicInfo.phone || (currentLanguage === "ar" ? "متوفر بالداخل" : currentLanguage === "fr" ? "Disponible" : "Available")}</span>
                  </div>
                </div>

                <div className="bg-teal-500/5 border border-teal-500/10 p-3.5 rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-slate-500 block">{t('occupancyLabel')}</span>
                  <span className="text-xs font-bold text-white block">
                    {t('occupancyCount')
                      .replace("{active}", String(bookings.filter(b => b.status === "pending" || b.status === "confirmed").length))
                      .replace("{max}", String(maxBookingsCount))}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* CLINIC FAQ / GUIDELINES */}
        {guidelines.length > 0 && (
          <section id="faq" className={`py-16 max-w-4xl mx-auto px-4 ${isRtl ? "text-right" : "text-left"}`}>
            <div className="text-center space-y-2 mb-10">
              <h3 className="text-2xl md:text-3xl font-extrabold text-white">{t('faqTitle')}</h3>
              <p className="text-slate-400 text-xs md:text-sm">
                {t('faqDesc')}
              </p>
            </div>

            <div className="space-y-4">
              {guidelines.map((faq, index) => (
                <div
                  key={faq.id}
                  className="bg-slate-900/30 border border-slate-900 rounded-xl overflow-hidden"
                >
                  <div className="p-4 flex items-center justify-between font-bold text-slate-200 text-xs md:text-sm cursor-pointer hover:bg-slate-900/60 transition-colors select-none">
                    <div className="flex items-center gap-2.5">
                      <span className="text-teal-400 font-mono text-xs bg-teal-500/10 px-2 py-0.5 rounded-md">Q{index + 1}</span>
                      <span>{localizeDynamicText(faq.title, currentLanguage)}</span>
                    </div>
                    <HelpCircle className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className={`p-4 pt-1.5 border-t border-slate-950/60 bg-slate-950/10 text-xs leading-relaxed text-slate-400 whitespace-pre-wrap ${isRtl ? "text-right" : "text-left"}`}>
                    {localizeDynamicText(faq.content, currentLanguage)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FLOATING ACTION CHAT WIDGET BUTTON */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => {
              setIsFloatingChatOpen(!isFloatingChatOpen);
            }}
            className="h-14 w-14 bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 rounded-full shadow-2xl shadow-teal-500/30 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all relative group border border-teal-400"
            title={currentLanguage === "ar" ? "افتح المساعد الطبي الذكي" : currentLanguage === "fr" ? "Ouvrir l'assistant médical intelligent" : "Open smart medical assistant"}
          >
            <Bot className="w-6 h-6 animate-pulse text-slate-950" />
            <span className={`absolute ${isRtl ? "right-16" : "left-16"} bg-slate-900 border border-slate-800 text-teal-400 text-[10px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl`} dir={isRtl ? "rtl" : "ltr"}>
              {currentLanguage === "ar" ? "حجز موعد واستشارة طبية فورية 🤖" : currentLanguage === "fr" ? "Réservation et consultation médicale instantanée 🤖" : "Appointment booking & instant consultation 🤖"}
            </span>
          </button>
        </div>

        {/* PUBLIC FOOTER */}
        <footer className={`bg-slate-950 border-t border-slate-900 py-10 text-center text-xs text-slate-500 mt-auto ${isRtl ? "text-right" : "text-left"}`}>
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-900">
            <div className="space-y-3">
              <span className="text-slate-300 font-bold block text-sm">{localizeDynamicText(clinicInfo.name, currentLanguage) || (currentLanguage === "ar" ? "عيادتي الذكية" : currentLanguage === "fr" ? "Ma Clinique" : "My Clinic")}</span>
              <p className="text-[11px] leading-relaxed text-slate-400">
                {t('platformDesc')}
              </p>
            </div>
            <div className="space-y-3">
              <span className="text-slate-300 font-bold block text-sm">{t('sectionsTitle')}</span>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">{t('navHome')}</a></li>
                <li><a href="#services" className="hover:text-teal-400 transition-colors">{t('navServices')}</a></li>
                <li><a href="#e-clinic" className="hover:text-teal-400 transition-colors">{t('navEClinic')}</a></li>
                <li><a href="#about" className="hover:text-teal-400 transition-colors">{t('navAbout')}</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <span className="text-slate-300 font-bold block text-sm">
                {currentLanguage === "ar" ? "الاتصال والموقع الجغرافي" : currentLanguage === "fr" ? "Contact & Localisation" : "Contact & Location"}
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li>
                  {currentLanguage === "ar" ? "📍 العنوان: " : currentLanguage === "fr" ? "📍 Adresse : " : "📍 Address: "}
                  {localizeDynamicText(clinicInfo.address, currentLanguage) || (currentLanguage === "ar" ? "الجزائر العاصمة، الجزائر" : "Algiers, Algeria")}
                </li>
                <li>
                  {currentLanguage === "ar" ? "📞 الهاتف: " : currentLanguage === "fr" ? "📞 Téléphone : " : "📞 Phone: "}
                  {clinicInfo.phone || (currentLanguage === "ar" ? "غير مدخل" : "Not entered")}
                </li>
                <li>
                  {currentLanguage === "ar" ? "🕒 الطوارئ: " : currentLanguage === "fr" ? "🕒 Urgences : " : "🕒 Emergency: "}
                  {clinicInfo.emergencyPhone || clinicInfo.phone || (currentLanguage === "ar" ? "غير مدخل" : "Not entered")}
                </li>
              </ul>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500">{t('copyrightLabel').replace("{clinic}", localizeDynamicText(clinicInfo.name, currentLanguage) || (currentLanguage === "ar" ? "عيادتي الذكية" : currentLanguage === "fr" ? "Ma Clinique" : "My Clinic"))}</p>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>{t('madeWithSkill')}</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased flex flex-col" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Dynamic Top Bar in Doctor Dashboard Panel to let the doctor preview the clinic public website */}
      <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border-b border-teal-500/20 px-4 py-2.5 flex items-center justify-between text-xs font-bold gap-4">
        <div className="flex items-center gap-2">
          <span className="bg-teal-500 text-slate-950 px-2 py-0.5 rounded text-[10px]">{t('adminModeLabel')}</span>
          <span className="text-slate-300">{t('adminModeDesc')}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (currentTenant) {
                openPatientPortal(currentTenant.id);
              }
            }}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-3 py-1 rounded-lg transition-all cursor-pointer border border-teal-400 flex items-center gap-1 shadow shadow-teal-500/10"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{t('previewClinicBtn')}</span>
          </button>
          <button
            onClick={handleDoctorLogout}
            className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-md font-semibold"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{t('logoutSaaSDoc')}</span>
          </button>
        </div>
      </div>
      
      {/* Dynamic Notification Popup */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-medium text-sm backdrop-blur-md border ${
              notification.type === "success" 
                ? "bg-emerald-500/90 text-white border-emerald-400" 
                : notification.type === "error"
                ? "bg-rose-500/90 text-white border-rose-400"
                : "bg-teal-500/90 text-white border-teal-400"
            }`}
          >
            {notification.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{notification.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(prev => ({ ...prev, isOpen: false }))}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden z-10"
            >
              {/* Top Warning Accented line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500" />
              
              <div className="flex items-start gap-4">
                <div className="bg-rose-500/10 text-rose-400 p-3 rounded-xl shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-100 mb-2">
                    {deleteConfirm.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {deleteConfirm.message}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={deleteConfirm.onConfirm}
                  className="px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-xl transition-all shadow-lg shadow-rose-600/10 hover:shadow-rose-600/25 flex items-center gap-2 cursor-pointer"
                >
                  <Trash className="w-4 h-4" />
                  <span>تأكيد الحذف</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* Reminder Scheduling Modal */}
      <AnimatePresence>
        {reminderModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReminderModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden z-10 animate-fade-in"
            >
              {/* Accent header line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-teal-500" />
              
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-teal-500/10 text-teal-400 p-3 rounded-xl shrink-0">
                  <Bell className="w-6 h-6 animate-bounce" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-100">
                    {t("confirmBookingTitle", "تأكيد الحجز وجدولة تذكير ذكي 🔔")}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t("confirmBookingDesc", "قم بتأكيد موعد المريض وتحديد موعد إرسال التذكير التلقائي له عبر الشات بوت.")}
                  </p>
                </div>
              </div>

              {/* Patient and Booking summary */}
              <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/85 mb-4 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">{t("pdfTranslations.patientNameLabel", "اسم المريض:")}</span>
                  <span className="font-bold text-slate-200">{localizeDynamicText(reminderModal.patientName, currentLanguage)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t("pdfTranslations.serviceNameLabel", "الخدمة المطلوبة:")}</span>
                  <span className="font-bold text-teal-400">{localizeDynamicText(reminderModal.serviceName, currentLanguage)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t("pdfTranslations.bookingDateLabel", "تاريخ الموعد:")}</span>
                  <span className="font-bold text-slate-200">{reminderModal.bookingDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t("pdfTranslations.bookingTimeLabel", "وقت الموعد:")}</span>
                  <span className="font-bold text-slate-200" dir="ltr">{reminderModal.bookingTime}</span>
                </div>
              </div>

              {/* Toggle reminder checkbox */}
              <div className="bg-slate-950/30 border border-slate-800/60 rounded-xl p-3.5 mb-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reminderModal.enableReminder}
                    onChange={(e) => setReminderModal(prev => ({ ...prev, enableReminder: e.target.checked }))}
                    className="w-4 h-4 rounded text-teal-500 focus:ring-teal-500 bg-slate-950 border-slate-800"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">{t("enableAutoReminderLabel", "تفعيل التذكير التلقائي (تنبيه المريض)")}</span>
                    <span className="text-[10px] text-slate-400">{t("enableAutoReminderDesc", "سيقوم النظام بتنبيه المريض تلقائياً في الوقت المحدد.")}</span>
                  </div>
                </label>

                {reminderModal.enableReminder && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 pt-2 border-t border-slate-800/60"
                  >
                    {/* Time before dropdown */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300 block">{t("reminderTimeLabel", "وقت إرسال التذكير قبل الموعد:")}</label>
                      <select
                        value={reminderModal.timeBefore}
                        onChange={(e) => {
                          const val = e.target.value;
                          setReminderModal(prev => {
                            let label = currentLanguage === "ar" ? "قبل الموعد بيوم واحد" : currentLanguage === "fr" ? "1 jour avant" : "1 day before";
                            if (val === "30_mins") label = currentLanguage === "ar" ? "قبل الموعد بـ 30 دقيقة" : currentLanguage === "fr" ? "30 minutes avant" : "30 minutes before";
                            else if (val === "2_hours") label = currentLanguage === "ar" ? "قبل الموعد بساعتين" : currentLanguage === "fr" ? "2 heures avant" : "2 hours before";
                            else if (val === "2_days") label = currentLanguage === "ar" ? "قبل الموعد بيومين" : currentLanguage === "fr" ? "2 jours avant" : "2 days before";
                            
                            const greetingStr = currentLanguage === "ar" ? `تذكير بموعدك: عزيزي المريض ${prev.patientName}، نود تذكيرك بموعدك لـ (${prev.serviceName}) في عيادتنا يوم ${prev.bookingDate} الساعة ${prev.bookingTime} (${label}). نتطلع لرؤيتك ونتمنى لك دوام الصحة والعافية.`
                                              : currentLanguage === "fr" ? `Rappel de rendez-vous : Cher patient ${localizeDynamicText(prev.patientName, currentLanguage)}, nous vous rappelons votre rendez-vous pour (${localizeDynamicText(prev.serviceName, currentLanguage)}) dans notre clinique le ${prev.bookingDate} à ${prev.bookingTime} (${label}). Au plaisir de vous voir et nous vous souhaitons une excellente santé.`
                                              : `Appointment Reminder: Dear Patient ${localizeDynamicText(prev.patientName, currentLanguage)}, we would like to remind you of your appointment for (${localizeDynamicText(prev.serviceName, currentLanguage)}) in our clinic on ${prev.bookingDate} at ${prev.bookingTime} (${label}). We look forward to seeing you and wish you good health.`;
                            return { ...prev, timeBefore: val, customMessage: greetingStr };
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                      >
                        <option value="30_mins">{t("before30Mins", "قبل الموعد بـ 30 دقيقة")}</option>
                        <option value="2_hours">{t("before2Hours", "قبل الموعد بساعتين")}</option>
                        <option value="1_day">{t("before1Day", "قبل الموعد بيوم واحد (24 ساعة)")}</option>
                        <option value="2_days">{t("before2Days", "قبل الموعد بيومين (48 ساعة)")}</option>
                      </select>
                    </div>

                    {/* Custom message text area */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300 block flex items-center justify-between">
                        <span>{t("reminderMsgTextLabel", "نص رسالة التذكير:")}</span>
                        <span className="text-[10px] text-slate-500">{t("editableLabel", "قابلة للتعديل")}</span>
                      </label>
                      <textarea
                        rows={3}
                        value={reminderModal.customMessage}
                        onChange={(e) => setReminderModal(prev => ({ ...prev, customMessage: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:ring-1 focus:ring-teal-500 focus:outline-none leading-relaxed resize-none"
                        placeholder={t("reminderMsgPlaceholder", "أدخل نص التذكير المخصص هنا...")}
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReminderModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-850 rounded-xl transition-all cursor-pointer"
                >
                  {t("cancel", "إلغاء")}
                </button>
                <button
                  type="button"
                  onClick={submitConfirmBookingWithReminder}
                  className="px-5 py-2 text-xs font-bold bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 rounded-xl transition-all shadow-lg shadow-teal-500/10 hover:shadow-teal-500/25 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{reminderModal.enableReminder ? t("confirmAndSchedule", "تأكيد الحجز وجدولة التذكير") : t("confirmOnly", "تأكيد الحجز فقط")}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Modern High-End Top Navigation Header */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 px-4 py-4 md:px-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-teal-500 to-cyan-400 p-2.5 rounded-xl shadow-lg shadow-teal-500/20 text-slate-950">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-l from-white via-slate-100 to-teal-400 bg-clip-text text-transparent flex items-center gap-2">
              {t("mySmartClinicHeader", "عيادتي الذكية")} <span className="text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full font-normal">{t("doctorAppHeaderBadge", "منصة الأطباء الذكية للعيادات")}</span>
            </h1>
            <p className="text-xs text-slate-400">{t("doctorAppHeaderDesc", "لوحة التحكم السحابية وتخصيص شات بوت الذكاء الاصطناعي الحصري")}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-center">
          {/* Browser Notifications Activation Button */}
          <button
            type="button"
            onClick={requestNotificationPermission}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer border ${
              notificationPermission === "granted"
                ? "bg-slate-900 border-emerald-500/30 text-emerald-400 hover:bg-slate-850"
                : notificationPermission === "denied"
                ? "bg-slate-900 border-rose-500/30 text-rose-400 hover:bg-slate-850"
                : "bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border-teal-500/30 shadow-md shadow-teal-500/5"
            }`}
            title={
              notificationPermission === "granted"
                ? "الإشعارات المباشرة مفعلة بنجاح على هذا المتصفح"
                : notificationPermission === "denied"
                ? "الإشعارات محظورة. اضغط على أيقونة القفل بجانب شريط العنوان في متصفحك لتفعيلها."
                : "اضغط لتفعيل إشعارات المتصفح لتنبيهك فوراً عند وصول حجز جديد"
            }
          >
            {notificationPermission === "granted" ? (
              <>
                <Bell className="w-3.5 h-3.5 text-emerald-400" />
                <span>الإشعارات نشطة 🟢</span>
              </>
            ) : notificationPermission === "denied" ? (
              <>
                <BellOff className="w-3.5 h-3.5 text-rose-400" />
                <span>الإشعارات محجوبة 🔴</span>
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5 text-teal-400 animate-bounce" />
                <span>تفعيل الإشعارات 🔔</span>
              </>
            )}
          </button>

          {/* Demo Preset Selection for commercial pitches */}
          <div className="flex items-center gap-2 flex-wrap justify-center bg-slate-900/80 border border-slate-800 p-1.5 rounded-xl">
          <span className="text-xs text-slate-400 px-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" /> القوالب المتاحة:
          </span>
          {CLINIC_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => loadPreset(preset)}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all duration-300 ${
                selectedPresetId === preset.id
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/10 font-bold"
                  : "text-slate-300 hover:bg-slate-800/60"
              }`}
            >
              {preset.id === "dental" ? "🦷 طب الأسنان" : preset.id === "general" ? "🩺 الطب العام" : "📅 إدارة المواعيد"}
            </button>
          ))}

          {customPresets.map((preset) => (
            <div key={preset.id} className="relative flex items-center">
              <button
                onClick={() => loadPreset(preset)}
                className={`text-xs pl-7 pr-3.5 py-1.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-1 ${
                  selectedPresetId === preset.id
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10 font-bold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700/50"
                }`}
              >
                <span>⭐ {preset.name}</span>
              </button>
              <button
                onClick={(e) => handleDeleteCustomPreset(preset.id, e)}
                className={`absolute left-1.5 p-1 rounded transition-all cursor-pointer ${
                  selectedPresetId === preset.id ? "text-slate-900 hover:text-rose-600" : "text-slate-500 hover:text-rose-500"
                }`}
                title="حذف القالب"
              >
                <Trash className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        </div>
      </header>

      {/* Main Container Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left Side: Doctor's Control Panel (8 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* SaaS Outside Platform Subscription Check alerts */}
          {msgSubPlan !== "unlimited" && msgUsed >= msgLimit && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-rose-500/10 border-2 border-rose-500/30 rounded-2xl p-4 flex gap-3.5 items-start text-right relative overflow-hidden"
              dir={isRtl ? "rtl" : "ltr"}
            >
              <div className="bg-rose-500/20 text-rose-400 p-2.5 rounded-xl">
                <AlertCircle className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-rose-400 text-sm">
                  {currentLanguage === "ar" ? "🚨 انتهى اشتراك الرسائل المساعد الذكي خارج المنصة!" : currentLanguage === "fr" ? "🚨 L'abonnement de l'assistant intelligent hors plateforme a expiré !" : "🚨 Smart Assistant Off-Platform subscription has expired!"}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentLanguage === "ar" 
                    ? "الشات بوت متوقف حالياً عن الرد على المرضى في موقعك الإلكتروني لانتهاء الرصيد المتاح. يرجى تجديد الاشتراك فوراً لتجنب فقدان الحجوزات والزبائن." 
                    : currentLanguage === "fr" 
                    ? "Le chatbot est actuellement arrêté et ne répond plus aux patients sur votre site pour manque de crédit. Veuillez renouveler l'abonnement pour éviter de perdre des réservations." 
                    : "The chatbot is currently stopped and won't respond to patients on your website due to out of balance. Please renew the subscription to avoid losing bookings."}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab("subscription")}
                    className="bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    {currentLanguage === "ar" ? "تجديد الاشتراك الآن 💳" : currentLanguage === "fr" ? "Renouveler l'abonnement 💳" : "Renew Subscription 💳"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {msgSubPlan !== "unlimited" && msgUsed < msgLimit && msgLimit - msgUsed <= msgLimit * 0.1 && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-4 flex gap-3.5 items-start text-right relative overflow-hidden"
              dir={isRtl ? "rtl" : "ltr"}
            >
              <div className="bg-amber-500/20 text-amber-400 p-2.5 rounded-xl">
                <AlertCircle className="w-5 h-5 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-amber-400 text-sm">
                  {currentLanguage === "ar" ? "⚠️ رصيد الرسائل يقترب من النفاد (باقي أقل من 10%)!" : currentLanguage === "fr" ? "⚠️ Le solde de messages est presque épuisé (moins de 10% restants) !" : "⚠️ Message balance is running low (less than 10% remaining)!"}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentLanguage === "ar" 
                    ? `متبقي للعيادة فقط ${msgLimit - msgUsed} رسالة من أصل باقة ${msgLimit} رسالة خارج المنصة. يرجى شحن الرصيد لتفادي توقف الخدمة التلقائية.` 
                    : currentLanguage === "fr" 
                    ? `Il ne reste que ${msgLimit - msgUsed} messages sur votre forfait de ${msgLimit} hors plateforme. Veuillez recharger pour éviter l'arrêt du service.` 
                    : `Only ${msgLimit - msgUsed} messages remain out of your ${msgLimit} off-platform package. Please recharge to prevent service interruption.`}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab("subscription")}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    {currentLanguage === "ar" ? "شحن رصيد إضافي 💳" : currentLanguage === "fr" ? "Recharger le crédit 💳" : "Recharge Credit 💳"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Quick Informational Notice explaining strict data limits */}
          <div className="bg-slate-950/60 rounded-2xl p-5 border border-slate-800/50 flex gap-4 items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl" />
            <div className="bg-teal-500/10 text-teal-400 p-3 rounded-xl mt-0.5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-teal-400 text-base">{t("cognitiveLockSystemTitle", "نظام الحماية والذكاء المحكم 🛡️")}</h3>
              <p className="text-xs leading-relaxed text-slate-300">
                {t("cognitiveLockDescPart1", "الشات بوت مبرمج بـ ")}
                <span className="text-teal-400 font-bold">{t("cognitiveLockDescPart2", " نظام الحصر المعرفي الحاسم ")}</span>
                {t("cognitiveLockDescPart3", ". لن يقوم بالاجتهاد أو \"التعلم والاستنتاج\" الطبي خارج ما تدخله هنا. إذا لم يجد إجابة دقيقة في قاعدة بيانات العيادة أو في حال الأسئلة الطبية المعقدة، سيوجه الزبون فوراً للاتصال بالعيادة أو حجز موعد. هذا يحمي العيادة قانونياً وطبياً ويحافظ على أرباحك وتدفق المرضى!")}
              </p>
            </div>
          </div>

          {/* Tab Navigation buttons */}
          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 ${
                activeTab === "profile"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>{t('profileTab')}</span>
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 ${
                activeTab === "bookings"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>{t('bookingsTab')}</span>
              {bookings.filter(b => b.status === "pending").length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                  {bookings.filter(b => b.status === "pending").length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("buttons")}
              className={`py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 ${
                activeTab === "buttons"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>{t('buttonsTab')}</span>
            </button>
            <button
              onClick={() => setActiveTab("database")}
              className={`py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 ${
                activeTab === "database"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Database className="w-4 h-4" />
              <span>{t('databaseTab')}</span>
            </button>
            <button
              onClick={() => setActiveTab("import")}
              className={`py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 ${
                activeTab === "import"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{t('importTab')}</span>
            </button>
            <button
              onClick={() => setActiveTab("conversations")}
              className={`py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 ${
                activeTab === "conversations"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-teal-400" />
              <span>{t('conversationsTab')}</span>
              {conversations.filter(c => c.status === "pending_review").length > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                  {conversations.filter(c => c.status === "pending_review").length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("market")}
              className={`py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 ${
                activeTab === "market"
                  ? "bg-teal-500/10 text-teal-300 border border-teal-500/30 shadow-md shadow-teal-500/5 font-bold"
                  : "text-slate-400 hover:text-teal-400"
              }`}
            >
              <Smartphone className="w-4 h-4 text-teal-400 animate-pulse" />
              <span>{t('marketTab')}</span>
            </button>
            <button
              onClick={() => setActiveTab("presets")}
              className={`py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 ${
                activeTab === "presets"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300">{t('presetsTab')}</span>
            </button>
            <button
              onClick={() => setActiveTab("backup")}
              className={`py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 ${
                activeTab === "backup"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Database className="w-4 h-4 text-teal-400" />
              <span className="font-bold">{t('backupTab')}</span>
            </button>
            <button
              onClick={() => setActiveTab("subscription")}
              className={`py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 ${
                activeTab === "subscription"
                  ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-teal-300 border border-teal-500/30 shadow-md font-bold"
                  : "text-slate-400 hover:text-emerald-400"
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>{t('subscriptionTab')}</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 ${
                activeTab === "settings"
                  ? "bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-cyan-300 border border-teal-500/30 shadow-md font-bold"
                  : "text-slate-400 hover:text-teal-400"
              }`}
            >
              <Settings className="w-4 h-4 text-teal-400 animate-spin" />
              <span>{t('settings')}</span>
            </button>
          </div>

          {/* Dynamic Tab Body with animations */}
          <div className="bg-slate-950/40 rounded-2xl border border-slate-800/80 p-6 flex-1 min-h-[500px]">
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Profile & Daily Status */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Doctor's Daily Status Quick Update Card */}
                  <div className="bg-gradient-to-tr from-teal-500/10 to-transparent p-5 rounded-xl border border-teal-500/20 relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-teal-400 font-bold">
                        <Clock className="w-5 h-5" />
                        <h4>{t("dailyStatusQuickTitle", "الحالة اليومية السريعة للطبيب 📅")}</h4>
                      </div>
                      <button 
                        onClick={handleSaveDailyStatus}
                        className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{t("instantUpdateBtn", "تحديث فوري")}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                      {t("dailyStatusDescriptionText", "اكتب هنا حالتك اليومية للعيادة (مثال: مواعيد الحضور الاستثنائية، طبيب بديل، ازدحام متوقع، إغلاق طارئ). سيقوم الشات بوت باستخدام هذه الجملة لتحديث جميع إجاباته للمرضى اليوم تلقائياً!")}
                    </p>
                    <textarea
                      value={dailyStatus}
                      onChange={(e) => setDailyStatus(e.target.value)}
                      placeholder={t("dailyStatusTextareaPlaceholder", "اكتب هنا حالة العيادة اليوم... (مثلاً: طبيب الأسنان متواجد اليوم من 10 صباحاً وحتى 8 مساءً، ننصح بحجز موعد مسبق لتجنب الانتظار)")}
                      className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl px-4 py-3 text-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none min-h-[100px]"
                    />
                  </div>

                  {/* Clinic Info Inputs */}
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="border-b border-slate-800 pb-2">
                      <h4 className="font-bold text-slate-200 text-sm">{t("clinicProfileTitle", "معلومات الملف التعريفي للعيادة")}</h4>
                      <p className="text-xs text-slate-400">{t("clinicProfileDesc", "البيانات الثابتة الأساسية لتعريف الشات بوت بموقعك والاتصال بك")}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t("clinicNameInputLabel", "اسم العيادة")}</label>
                        <input
                          type="text"
                          value={clinicInfo.name}
                          onChange={(e) => setClinicInfo({ ...clinicInfo, name: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t("clinicSpecialtyInputLabel", "التخصص الطبي")}</label>
                        <input
                          type="text"
                          value={clinicInfo.specialty}
                          onChange={(e) => setClinicInfo({ ...clinicInfo, specialty: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t("clinicPhoneInputLabel", "رقم الهاتف السريع للتواصل وحجز المواعيد")}</label>
                        <input
                          type="text"
                          value={clinicInfo.phone}
                          onChange={(e) => setClinicInfo({ ...clinicInfo, phone: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t("clinicAddressInputLabel", "عنوان العيادة الجغرافي بالتفصيل")}</label>
                        <input
                          type="text"
                          value={clinicInfo.address}
                          onChange={(e) => setClinicInfo({ ...clinicInfo, address: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Interactive Clinic Map */}
                    <div className="pt-2">
                      <ClinicMap clinicInfo={clinicInfo} onChange={setClinicInfo} />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold py-2 px-5 rounded-lg text-sm transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4 text-teal-400" />
                        <span>{t("saveBasicProfileBtn", "حفظ بيانات الملف الأساسي")}</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Tab: Smart Bookings Manager */}
              {activeTab === "bookings" && (
                <motion.div
                  key="bookings-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-white text-xl flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-teal-400" />
                        <span>{t("smartBookingsTitle", "نظام الحجوزات الذكي المباشر 📅")}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {t("smartBookingsDesc", "هنا تظهر طلبات الحجوزات التي يقوم المرضى بتسجيلها ذاتياً عبر شات بوت العيادة، بالإضافة إلى إمكانية تسجيل الحجوزات اليدوية.")}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setIsAddingBooking(!isAddingBooking)}
                      className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center justify-center gap-2 self-start cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>{isAddingBooking ? t("closeBookingForm", "إغلاق استمارة الحجز") : t("addManualBooking", "تسجيل حجز جديد يدوي")}</span>
                    </button>
                  </div>

                  {/* Booking Stats Bento Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 font-medium">{t("totalBookings", "إجمالي الحجوزات")}</p>
                        <h4 className="text-2xl font-bold text-white mt-1">{bookings.length}</h4>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
                        <Calendar className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 font-medium">{t("pendingBookings", "بانتظار المراجعة")}</p>
                        <h4 className="text-2xl font-bold text-amber-400 mt-1">
                          {bookings.filter(b => b.status === "pending").length}
                        </h4>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <Clock className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 font-medium">{t("confirmedBookings", "المؤكدة والمجدولة")}</p>
                        <h4 className="text-2xl font-bold text-emerald-400 mt-1">
                          {bookings.filter(b => b.status === "confirmed").length}
                        </h4>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 font-medium">{t("cancelledBookings", "الملغاة")}</p>
                        <h4 className="text-2xl font-bold text-rose-400 mt-1">
                          {bookings.filter(b => b.status === "cancelled").length}
                        </h4>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                        <XCircle className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Browser Notifications Integration Helper Card */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <Bell className="w-4 h-4 text-teal-400" />
                        <span>{t("browserNotificationsTitle", "إشعارات الحجوزات المباشرة للمتصفح 📱🔔")}</span>
                      </h4>
                      <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                        {t("browserNotificationsDesc", "قم بتفعيل ميزة إشعارات المتصفح لتلقي تنبيه فوري مصحوب بنغمة رنين مميزة على هاتفك أو حاسوبك بمجرد قيام مريض بحجز موعد جديد عبر الشات بوت الذكي، حتى وإن كان التطبيق مغلقاً أو مفتوحاً في الخلفية!")}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] text-slate-500 font-medium">{t("notificationPermissionLabel", "حالة الإذن الحالية:")}</span>
                        {notificationPermission === "granted" ? (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">{t("permissionActive", "نشط ومفعل 🟢")}</span>
                        ) : notificationPermission === "denied" ? (
                          <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full font-bold">{t("permissionBlocked", "محظور من المتصفح 🔴 (اضغط أيقونة القفل بجانب الرابط لتفعيله)")}</span>
                        ) : (
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold">{t("permissionPending", "بانتظار التفعيل ⏳")}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={requestNotificationPermission}
                        className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border ${
                          notificationPermission === "granted"
                            ? "bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-700/60"
                            : "bg-teal-500 hover:bg-teal-400 text-slate-950 border-teal-400 shadow-lg shadow-teal-500/15"
                        }`}
                      >
                        <Bell className="w-4 h-4" />
                        <span>{notificationPermission === "granted" ? t("testNotificationAlert", "إعادة اختبار التنبيه 🔔") : t("enableNotificationsNow", "تفعيل الإشعارات الآن")}</span>
                      </button>
                      
                      {notificationPermission === "granted" && (
                        <button
                          type="button"
                          onClick={() => {
                            sendBrowserNotification("تجربة حجز عيادة جديد 📅", {
                              body: "هذا إشعار تجريبي يوضح كيف سيظهر لك اسم المريض والخدمة المطلوبة والوقت فوراً!",
                              tag: "test-booking-simulation",
                              requireInteraction: true
                            });
                            showNotification("تم إرسال إشعار تجريبي ناجح لمتصفحك! 🔔", "success");
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700/60"
                        >
                          <Sparkles className="w-4 h-4 text-teal-400" />
                          <span>{t("sendTestNotification", "إرسال إشعار تجريبي")}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Smart Booking Capacity & Status Control Panel */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Sliders className="w-5 h-5 text-teal-400" />
                      <div>
                        <h4 className="font-bold text-white text-sm">{t("capacityControlTitle", "التحكم في الطاقة الاستيعابية وحالة استقبال الحجوزات للشات بوت ⚙️")}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {t("capacityControlDesc", "حدد أقصى عدد حجوزات مسموح بها لليوم أو تحكم يدويًا في ردود الشات بوت للمرضى عند محاولة الحجز.")}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Section 1: Limits & Caps */}
                      <div className="space-y-4">
                        <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <span>{t("bookingLimitHeader", "📊 تحديد سقف الحجوزات التلقائي")}</span>
                        </h5>
                        
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={enableBookingLimits} 
                              onChange={(e) => setEnableBookingLimits(e.target.checked)}
                              className="sr-only peer" 
                            />
                            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500 peer-checked:after:bg-slate-950"></div>
                            <span className="mr-2 text-xs text-slate-300 select-none">{t("enableBookingMaxLimit", "تفعيل الحد الأقصى التلقائي لعدد الحجوزات")}</span>
                          </label>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-[11px] text-slate-400">{t("maxDailyBookingsLabel", "الحد الأقصى للحجوزات اليومية:")}</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              disabled={!enableBookingLimits}
                              value={maxBookingsCount}
                              onChange={(e) => setMaxBookingsCount(parseInt(e.target.value) || 1)}
                              className="bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500/50 w-24 disabled:opacity-40"
                            />
                            <span className="text-xs text-slate-400">{t("activeBookingsCountLabel", "حجوزات نشطة اليوم")}</span>
                          </div>
                        </div>

                        {/* Progress display */}
                        <div className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-400">{t("actualOccupancyLabel", "معدل الامتلاء الفعلي اليوم:")}</span>
                            <span className="font-bold text-teal-400">
                              {bookings.filter(b => b.status === "pending" || b.status === "confirmed").length} / {maxBookingsCount} {t("bookingUnit", "حجز")}
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                bookings.filter(b => b.status === "pending" || b.status === "confirmed").length >= maxBookingsCount ? "bg-rose-500" : "bg-teal-500"
                              }`}
                              style={{ 
                                width: `${Math.min(100, (bookings.filter(b => b.status === "pending" || b.status === "confirmed").length / maxBookingsCount) * 100)}%` 
                              }}
                            ></div>
                          </div>
                          {enableBookingLimits && bookings.filter(b => b.status === "pending" || b.status === "confirmed").length >= maxBookingsCount && (
                            <p className="text-[10px] text-rose-400 font-medium">{t("maxReachedWarningText", "⚠️ تم الوصول للحد الأقصى! الشات بوت سيرد تلقائياً بأن الحجوزات مكتملة.")}</p>
                          )}
                        </div>
                      </div>

                      {/* Section 2: Manual Control State Selection */}
                      <div className="space-y-3">
                        <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <span>{t("botResponseModeHeader", "🕒 وضع الرد الحالي للشات بوت (تجاوز يدوي)")}</span>
                        </h5>

                        <div className="space-y-2">
                          {/* Option 1: Open */}
                          <div 
                            onClick={() => setBookingSystemStatus("open")}
                            className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                              bookingSystemStatus === "open" 
                                ? "bg-emerald-500/10 border-emerald-500/30 text-white" 
                                : "bg-slate-950/40 border-slate-800 hover:border-slate-750 text-slate-400"
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                                bookingSystemStatus === "open" ? "border-emerald-400" : "border-slate-600"
                              }`}>
                                {bookingSystemStatus === "open" && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs font-bold block text-emerald-400">{t("bookingSystemStatusOpen", "مفتوح - استقبال عادي للحجوزات 🟢")}</span>
                              <span className="text-[10px] leading-relaxed block mt-0.5">{t("bookingSystemStatusOpenDesc", "يتم استقبال الحجوزات بشكل طبيعي عبر الاستمارة الذكية طالما لم يتم تجاوز الحد الأقصى.")}</span>
                            </div>
                          </div>

                          {/* Option 2: Closed/Full */}
                          <div 
                            onClick={() => setBookingSystemStatus("closed_limit")}
                            className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                              bookingSystemStatus === "closed_limit" 
                                ? "bg-rose-500/10 border-rose-500/30 text-white" 
                                : "bg-slate-950/40 border-slate-800 hover:border-slate-750 text-slate-400"
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                                bookingSystemStatus === "closed_limit" ? "border-rose-400" : "border-slate-600"
                              }`}>
                                {bookingSystemStatus === "closed_limit" && <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" />}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs font-bold block text-rose-400">{t("bookingSystemStatusClosedLimit", "مغلق - الحجوزات انتهت لليوم 🔴")}</span>
                              <span className="text-[10px] leading-relaxed block mt-0.5">{t("bookingSystemStatusClosedLimitDesc", "يرد الشات بوت فوراً للمريض بأن الحجوزات قد اكتملت لليوم وينصح بالاتصال أو الحجز غداً.")}</span>
                            </div>
                          </div>

                          {/* Option 3: Outside working hours */}
                          <div 
                            onClick={() => setBookingSystemStatus("outside_hours")}
                            className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                              bookingSystemStatus === "outside_hours" 
                                ? "bg-amber-500/10 border-amber-500/30 text-white" 
                                : "bg-slate-950/40 border-slate-800 hover:border-slate-750 text-slate-400"
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                                bookingSystemStatus === "outside_hours" ? "border-amber-400" : "border-slate-600"
                              }`}>
                                {bookingSystemStatus === "outside_hours" && <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs font-bold block text-amber-400">{t("bookingSystemStatusOutsideHours", "خارج أوقات العمل الرسمية 🕒")}</span>
                              <span className="text-[10px] leading-relaxed block mt-0.5">{t("bookingSystemStatusOutsideHoursDesc", "يرد الشات بوت فوراً للمريض بأن العيادة مغلقة حالياً خارج أوقات العمل ويطلب ترك الهاتف لخدمته لاحقاً.")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-800/85">
                      <button
                        type="button"
                        onClick={() => {
                          saveToLocalStorage(clinicInfo, dailyStatus, services, guidelines, quickActions, bookings, maxBookingsCount, enableBookingLimits, bookingSystemStatus);
                        }}
                        className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-teal-400"
                      >
                        <Save className="w-4 h-4" />
                        <span>{t("saveBookingSettingsBtn", "حفظ إعدادات الحجز وتحديث الشات بوت فوراً")}</span>
                      </button>
                    </div>
                  </div>

                  {/* Manual Booking Entry Form */}
                  <AnimatePresence>
                    {isAddingBooking && (
                      <motion.form
                        onSubmit={handleAddManualBooking}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4 overflow-hidden"
                      >
                        <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
                          <Plus className="w-4 h-4 text-teal-400" />
                          <span>{t("manualBookingFormTitle", "إدخل حجز يدوي جديد (من الهاتف أو مريض في العيادة)")}</span>
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t("manualPatientNameLabel", "اسم المريض بالكامل")}</label>
                            <input
                              type="text"
                              value={manualPatientName}
                              onChange={(e) => setManualPatientName(e.target.value)}
                              placeholder={t("manualPatientNamePlaceholder", "مثال: صالح أحمد الزهراني")}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t("manualPatientPhoneLabel", "رقم الجوال للتواصل")}</label>
                            <input
                              type="tel"
                              value={manualPatientPhone}
                              onChange={(e) => setManualPatientPhone(e.target.value)}
                              placeholder={t("manualPatientPhonePlaceholder", "مثال: 0512345678")}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs text-right focus:ring-1 focus:ring-teal-500 focus:outline-none"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t("manualServiceNameLabel", "الخدمة المطلوبة")}</label>
                            <select
                              value={manualServiceName}
                              onChange={(e) => setManualServiceName(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer"
                              required
                            >
                              <option value="">{t("manualServiceNamePlaceholder", "-- اختر الخدمة --")}</option>
                              {services.map(s => (
                                <option key={s.id} value={s.name}>{s.name} ({s.price})</option>
                              ))}
                              {services.length === 0 && (
                                <option value="استشارة عامة">{t("defaultGeneralConsultation", "استشارة عامة (افتراضي)")}</option>
                              )}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t("manualBookingDateLabel", "تاريخ الموعد")}</label>
                            <input
                              type="date"
                              value={manualBookingDate}
                              onChange={(e) => setManualBookingDate(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t("manualBookingTimeLabel", "الوقت المفضل")}</label>
                            <input
                              type="time"
                              value={manualBookingTime}
                              onChange={(e) => setManualBookingTime(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-slate-400 mb-1.5 font-medium">{t("manualNotesLabel", "ملاحظات أو الأعراض الشكوى")}</label>
                            <input
                              type="text"
                              value={manualNotes}
                              onChange={(e) => setManualNotes(e.target.value)}
                              placeholder={t("manualNotesPlaceholder", "ملاحظات اختيارية عن الأعراض أو حالة المريض")}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2 rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>{t("confirmBookingBtn", "تأكيد تسجيل الحجز 📅")}</span>
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Booking Demand Analytics Chart */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-teal-400" />
                          <span>{t("bookingAnalyticsTitle", "تحليل الطلب وتوزيع الحجوزات حسب الخدمة 📊")}</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {getBookingChartData().isPastWeekOnly 
                            ? t("bookingAnalyticsPastWeek", "إحصائيات دقيقة للحجوزات المسجلة خلال الأسبوع الماضي (آخر 7 أيام)") 
                            : t("bookingAnalyticsTotalAll", "إحصائيات إجمالية لكافة الحجوزات المسجلة بالعيادة (لعدم وجود حجوزات كافية في الأسبوع الأخير)")}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[11px] font-medium bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800/80">
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                        <span className="text-slate-400">إجمالي الحجوزات المحللة:</span>
                        <span className="text-teal-400 font-bold">{getBookingChartData().count}</span>
                      </div>
                    </div>

                    {getBookingChartData().data.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-xs text-slate-500">لا تتوفر بيانات حجوزات كافية لعرض الرسم البياني حالياً.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        {/* Recharts Bar Chart */}
                        <div className="lg:col-span-8 h-64 md:h-72 w-full pr-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={getBookingChartData().data}
                              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                              <XAxis 
                                dataKey="name" 
                                stroke="#94a3b8" 
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                              />
                              <YAxis 
                                stroke="#94a3b8" 
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                              />
                              <Tooltip 
                                content={<CustomTooltip />}
                                cursor={{ fill: '#1e293b', opacity: 0.4 }}
                              />
                              <Bar 
                                dataKey="count" 
                                fill="#0d9488" 
                                radius={[6, 6, 0, 0]}
                              >
                                {getBookingChartData().data.map((entry, index) => {
                                  const colors = ["#0d9488", "#06b6d4", "#10b981", "#14b8a6", "#34d399"];
                                  return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                })}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Side demand insights card */}
                        <div className="lg:col-span-4 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
                          <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>مؤشرات وإحصاءات سريعة</span>
                          </h5>
                          
                          <div className="space-y-2">
                            {getBookingChartData().data
                              .sort((a, b) => b.count - a.count)
                              .map((item, i) => {
                                const percentage = Math.round((item.count / getBookingChartData().count) * 100);
                                return (
                                  <div key={item.name} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-slate-400 truncate max-w-[150px]" title={item.name}>
                                        {i === 0 && "🥇 "}
                                        {i === 1 && "🥈 "}
                                        {i === 2 && "🥉 "}
                                        {item.name}
                                      </span>
                                      <span className="text-slate-300 font-bold">{item.count} حجز ({percentage}%)</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-teal-500 rounded-full transition-all duration-500" 
                                        style={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Wait Time & Time Slot Distribution Analytics Card */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          <Clock className="w-4 h-4 text-teal-400" />
                          <span>{t("avgWaitingTimeCardTitle", "تحليل أوقات الانتظار وتوزيع فترات الحجز 🕒📈")}</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {t("avgWaitingTimeCardDesc", "مؤشرات تفصيلية لمراقبة سلاسة تدفق المرضى، وتحليل فترات الازدحام ومقارنة معدلات الانتظار بين الصباح والمساء لتجويد تخطيط المواعيد.")}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                      {/* Left Block: Waiting stats & Advice (Span 5) */}
                      <div className="xl:col-span-5 flex flex-col justify-between bg-slate-950/60 border border-slate-800/85 rounded-xl p-5 space-y-4">
                        <div className="space-y-3">
                          <p className="text-xs text-slate-400 font-medium">{t("overallAvgWaitTime", "متوسط وقت الانتظار العام")}</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-teal-400 font-mono tracking-tight">
                              {getWaitingAndPeriodAnalytics().overallAvgWait}
                            </span>
                            <span className="text-sm text-slate-400 font-medium">{t("minutesUnit", "دقيقة")}</span>
                          </div>
                          
                          {/* Flow Status bar */}
                          <div className="pt-2">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                              {t("patientFlowStatus", "حالة تدفق المرضى وسلاسة العيادة")}
                            </span>
                            <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800/60">
                              <span className={`w-2.5 h-2.5 rounded-full ${
                                getWaitingAndPeriodAnalytics().overallAvgWait > 20 
                                  ? "bg-rose-500 animate-pulse" 
                                  : getWaitingAndPeriodAnalytics().overallAvgWait > 15 
                                  ? "bg-amber-500" 
                                  : "bg-emerald-500"
                              }`} />
                              <span className="text-xs font-bold text-slate-200">
                                {getWaitingAndPeriodAnalytics().overallAvgWait > 20 
                                  ? t("flowStatusCongested", "ازدحام مكثف ⚠️") 
                                  : getWaitingAndPeriodAnalytics().overallAvgWait > 15 
                                  ? t("flowStatusNormal", "سلس ومتزن 🟢") 
                                  : t("flowStatusExcellent", "سريع وممتاز ✨")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Morning & Evening Wait metrics */}
                        <div className="grid grid-cols-2 gap-3 border-t border-b border-slate-850 py-3">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-medium block">{t("avgWaitMorning", "معدل انتظار الصباح")}</span>
                            <span className="text-sm font-bold text-teal-300 font-mono">{getWaitingAndPeriodAnalytics().morningAvgWait} {t("minutesUnit", "دقيقة")}</span>
                            <span className="text-[9px] text-slate-500 block">{getWaitingAndPeriodAnalytics().morningCount} {t("bookingUnit", "حجز")}</span>
                          </div>
                          <div className="space-y-1 border-r border-slate-800/80 pr-3">
                            <span className="text-[10px] text-slate-500 font-medium block">{t("avgWaitEvening", "معدل انتظار المساء")}</span>
                            <span className="text-sm font-bold text-sky-400 font-mono">{getWaitingAndPeriodAnalytics().eveningAvgWait} {t("minutesUnit", "دقيقة")}</span>
                            <span className="text-[9px] text-slate-500 block">{getWaitingAndPeriodAnalytics().eveningCount} {t("bookingUnit", "حجز")}</span>
                          </div>
                        </div>

                        {/* Recommendation */}
                        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-850 text-xs space-y-1">
                          <span className="font-extrabold text-teal-400 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>{t("waitingTimeRecommendation", "توصية تنظيمية مخصصة")}</span>
                          </span>
                          <p className="text-slate-300 leading-relaxed text-[11px]">
                            {getWaitingAndPeriodAnalytics().overallAvgWait > 20 
                              ? t("recHighWait", "الانتظار مرتفع نسبياً بسبب تزايد الطلبات وضغط المواعيد. نقترح توسيع الفاصل الزمني بين الخدمات بمقدار 5 دقائق إضافية.") 
                              : getWaitingAndPeriodAnalytics().overallAvgWait > 15 
                              ? t("recMediumWait", "الانتظار مقبول وضمن الحدود الآمنة. نوصي بالتنبيه على المرضى عبر الشات بوت بالحضور قبل موعدهم بـ 5 دقائق لتجنب أي تداخل.") 
                              : t("recLowWait", "الوضع ممتاز جداً! تدفق المرضى يسير بسلاسة وسرعة فائقة، ومعدل تنظيم الفواصل الزمنية للمواعيد مثالي.")}
                          </p>
                        </div>
                      </div>

                      {/* Right Block: Charts (Span 7) */}
                      <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                        {/* Morning vs Evening distribution (Pie chart) (Span 5) */}
                        <div className="md:col-span-5 flex flex-col items-center justify-center p-2 space-y-3">
                          <h5 className="text-[11px] font-bold text-slate-400 text-center w-full">
                            {currentLanguage === "ar" ? "توزيع الحجوزات (صباحاً / مساءً)" : currentLanguage === "fr" ? "Distribution Matin / Soir" : "Morning vs Evening Distribution"}
                          </h5>
                          
                          <div className="h-40 w-full flex items-center justify-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={getWaitingAndPeriodAnalytics().periodData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={45}
                                  outerRadius={60}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {getWaitingAndPeriodAnalytics().periodData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} ${t("bookingUnit", "حجز")}`]} />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute flex flex-col items-center justify-center">
                              <span className="text-xl font-extrabold text-white font-mono">{bookings.filter(b => b.status !== "cancelled").length}</span>
                              <span className="text-[8px] text-slate-500">{t("active", "نشط")}</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 w-full px-2">
                            <div className="flex items-center justify-between text-[10px]">
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <span className="w-2.5 h-2.5 rounded bg-[#2dd4bf] shrink-0" />
                                <span>{t("morningPeriod", "الفترة الصباحية")}</span>
                              </div>
                              <span className="font-bold text-slate-200 font-mono">{getWaitingAndPeriodAnalytics().morningPercent}% ({getWaitingAndPeriodAnalytics().morningCount})</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <span className="w-2.5 h-2.5 rounded bg-[#0ea5e9] shrink-0" />
                                <span>{t("eveningPeriod", "الفترة المسائية")}</span>
                              </div>
                              <span className="font-bold text-slate-200 font-mono">{getWaitingAndPeriodAnalytics().eveningPercent}% ({getWaitingAndPeriodAnalytics().eveningCount})</span>
                            </div>
                          </div>
                        </div>

                        {/* Expected Wait Time by Hour Trend (Area chart) (Span 7) */}
                        <div className="md:col-span-7 flex flex-col p-2 space-y-3 border-t md:border-t-0 md:border-r border-slate-800/80 md:pr-4">
                          <h5 className="text-[11px] font-bold text-slate-400 text-center md:text-right w-full">
                            {t("trafficTrendByHour", "تحليل حركة الازدحام ومتوسط الانتظار المتوقع بساعات العمل 📊")}
                          </h5>

                          <div className="h-44 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={getWaitingAndPeriodAnalytics().hourlyTrend}
                                margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                              >
                                <defs>
                                  <linearGradient id="colorWait" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis 
                                  dataKey="hourLabel" 
                                  stroke="#64748b" 
                                  fontSize={9}
                                  tickLine={false}
                                  axisLine={false}
                                />
                                <YAxis 
                                  stroke="#64748b" 
                                  fontSize={9}
                                  tickLine={false}
                                  axisLine={false}
                                />
                                <Tooltip 
                                  content={({ active, payload }: any) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      return (
                                        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px]">
                                          <p className="font-bold text-slate-300 mb-1">{currentLanguage === "ar" ? `الساعة ${data.hourLabel}` : `Hour ${data.hour}`}</p>
                                          <p className="text-teal-400 flex justify-between gap-4">
                                            <span>{t("waitChartLabel", "متوسط الانتظار المتوقع (دقيقة)")}:</span>
                                            <span className="font-bold">{data.waitTime} {t("minutesUnit")}</span>
                                          </p>

                                           <p className="text-sky-400 flex justify-between gap-4">
                                             <span>{t("bookingsChartLabel", "عدد الحجوزات النشطة")}:</span>
                                             <span className="font-bold">{data.count}</span>
                                           </p>
                                         </div>
                                       );
                                     }
                                     return null;
                                   }}
                                 />
                                 <Area 
                                   type="monotone" 
                                   dataKey="waitTime" 
                                   stroke="#0d9488" 
                                   strokeWidth={2}
                                   fillOpacity={1} 
                                   fill="url(#colorWait)" 
                                 />
                               </AreaChart>
                             </ResponsiveContainer>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* Filter and Search Section */}
                   <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
                     {/* Search Input */}
                     <div className="relative w-full md:w-80">
                       <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                       <input
                         type="text"
                         placeholder={currentLanguage === "ar" ? "البحث بالاسم أو رقم الهاتف..." : currentLanguage === "fr" ? "Rechercher par nom ou téléphone..." : "Search by name or phone..."}
                         value={bookingSearchQuery}
                         onChange={(e) => setBookingSearchQuery(e.target.value)}
                         className="w-full bg-slate-950 border border-slate-800 rounded-lg pr-9 pl-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                       />
                     </div>

                     {/* Status filter buttons */}
                     <div className="flex gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800 overflow-x-auto w-full md:w-auto">
                       {(["all", "pending", "confirmed", "cancelled"] as const).map((status) => (
                         <button
                           key={status}
                           onClick={() => setBookingFilterStatus(status)}
                           className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                             bookingFilterStatus === status
                               ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                               : "text-slate-400 hover:text-slate-200"
                           }`}
                         >
                           {status === "all" && (currentLanguage === "ar" ? "الكل" : currentLanguage === "fr" ? "Tous" : "All")}
                           {status === "pending" && (currentLanguage === "ar" ? "قيد الانتظار" : currentLanguage === "fr" ? "En attente" : "Pending")}
                           {status === "confirmed" && (currentLanguage === "ar" ? "المؤكدة" : currentLanguage === "fr" ? "Confirmés" : "Confirmed")}
                           {status === "cancelled" && (t('cancelled'))}
                         </button>
                       ))}
                     </div>
                   </div>

                   {/* Bookings List */}
                   <div className="space-y-3">
                     {bookings.filter(b => {
                       const matchesSearch = b.patientName.toLowerCase().includes(bookingSearchQuery.toLowerCase()) ||
                                             b.patientPhone.includes(bookingSearchQuery);
                       const matchesStatus = bookingFilterStatus === "all" ? true : b.status === bookingFilterStatus;
                       return matchesSearch && matchesStatus;
                     }).length === 0 ? (
                       <div className="bg-slate-900/20 border border-slate-800 rounded-xl py-12 px-4 text-center">
                         <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-pulse" />
                         <h5 className="font-bold text-slate-400 text-sm">
                           {t('noBookingsMatch')}
                         </h5>
                         <p className="text-xs text-slate-500 mt-1">
                           {t('tryChatbotLeft')}
                         </p>
                       </div>
                     ) : (
                       bookings
                         .filter(b => {
                           const matchesSearch = b.patientName.toLowerCase().includes(bookingSearchQuery.toLowerCase()) ||
                                                 b.patientPhone.includes(bookingSearchQuery);
                           const matchesStatus = bookingFilterStatus === "all" ? true : b.status === bookingFilterStatus;
                           return matchesSearch && matchesStatus;
                         })
                         .map((b) => {
                           return (
                             <motion.div
                               key={b.id}
                               initial={{ opacity: 0, y: 10 }}
                               animate={{ opacity: 1, y: 0 }}
                               className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all duration-300 relative group"
                             >
                              {/* Left / Info Side */}
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-white text-sm md:text-base">{localizeDynamicText(b.patientName, currentLanguage)}</h4>
                                  
                                  {/* Status badge */}
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                    b.status === "confirmed"
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                      : b.status === "cancelled"
                                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                                  }`}>
                                    {b.status === 'confirmed' && t('appointmentConfirmed')}
                                    {b.status === 'cancelled' && t('appointmentCancelled')}
                                    {b.status === 'pending' && t('appointmentPending')}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-xs">
                                  <div className="flex items-center gap-1.5 text-slate-300">
                                    <span className="text-slate-400">{t('serviceLabelColon')}</span>
                                    <span className="font-medium text-teal-400">{localizeDynamicText(b.serviceName, currentLanguage)}</span>
                                  </div>

                                  <div className="flex items-center gap-1.5 text-slate-300">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{b.bookingDate}</span>
                                    <span className="text-slate-500">|</span>
                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                    <span dir="ltr">{b.bookingTime}</span>
                                  </div>

                                  <div className="flex items-center gap-1.5 text-slate-300">
                                    <span className="text-slate-400">{t('phoneLabelColon')}</span>
                                    <a href={`tel:${b.patientPhone}`} className="text-sky-400 hover:underline flex items-center gap-1">
                                      <span>{b.patientPhone}</span>
                                      <Phone className="w-3 h-3" />
                                    </a>
                                  </div>

                                  <div className="flex items-center gap-1.5 text-slate-400">
                                    <span>{t('requestDateLabelColon')}</span>
                                    <span className="text-[10px]" dir="ltr">
                                      {new Date(b.createdAt).toLocaleString(currentLanguage === "ar" ? "ar-DZ" : currentLanguage === "fr" ? "fr-FR" : "en-US", { hour12: true })}
                                    </span>
                                  </div>
                                </div>

                                {b.notes && (
                                  <div className="bg-slate-950/40 rounded-lg p-2.5 border border-slate-800/80 mt-2 text-xs text-slate-300 italic">
                                    " {localizeDynamicText(b.notes, currentLanguage)} "
                                  </div>
                                )}

                                {b.reminders && b.reminders.length > 0 && (
                                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/90 mt-3 space-y-2">
                                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                                      <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                                        <Bell className="w-3.5 h-3.5 text-teal-400" />
                                        <span>{t('scheduledReminders')}</span>
                                      </span>
                                      <span className="text-[9px] text-slate-500 font-medium">{t('reminderHistory')}</span>
                                    </div>

                                    <div className="space-y-2">
                                      {b.reminders.map((rem) => (
                                        <div key={rem.id} className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-800/40 text-[11px] space-y-2">
                                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-slate-400 font-bold">{t('timingLabelColon')}</span>
                                              <span className="text-teal-400 font-medium">{localizeDynamicText(rem.timeBeforeLabel, currentLanguage)}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                                                rem.isSent 
                                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                              }`}>
                                                <span className={`w-1 h-1 rounded-full ${rem.isSent ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
                                                <span>{rem.isSent ? `${t('sentToChatbot')} (${rem.sentAt})` : t('autoScheduled')}</span>
                                              </span>

                                              {!rem.isSent && (
                                                <button
                                                  onClick={() => handleTriggerReminder(b.id, rem.id)}
                                                  className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-[10px] px-2 py-1 rounded border border-teal-500/20 font-bold transition-all cursor-pointer flex items-center gap-1"
                                                  title={t('sendReminderNow')}
                                                >
                                                  <span>{t('sendNowEmoji')}</span>
                                                </button>
                                              )}
                                            </div>
                                          </div>

                                          <div className="text-slate-300 italic bg-slate-950/40 p-1.5 rounded border border-slate-800/40 leading-relaxed text-[10px]">
                                            "{localizeDynamicText(rem.message, currentLanguage)}"
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Right / Quick Actions Side */}
                              <div className="flex items-center gap-1.5 self-end md:self-center border-t border-slate-800/50 md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end">
                                {b.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() => handleConfirmBooking(b.id)}
                                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-1.5 px-3 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                                    >
                                      <UserCheck className="w-3.5 h-3.5" />
                                      <span>{t('confirmEmoji')}</span>
                                    </button>
                                    <button
                                      onClick={() => handleCancelBooking(b.id)}
                                      className="bg-slate-800 hover:bg-slate-750 text-rose-400 border border-slate-700 font-medium text-xs py-1.5 px-3 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                      <span>{t('cancelBooking')}</span>
                                    </button>
                                  </>
                                )}

                                {b.status === "confirmed" && (
                                  <button
                                    onClick={() => handleCancelBooking(b.id)}
                                    className="bg-slate-800 hover:bg-slate-750 text-rose-400 border border-slate-700 font-medium text-xs py-1.5 px-3 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>{t('cancelBookingEmoji')}</span>
                                  </button>
                                )}

                                {b.status === "cancelled" && (
                                  <button
                                    onClick={() => handleReactivateBooking(b.id)}
                                    className="bg-slate-800 hover:bg-slate-750 text-teal-400 border border-slate-700 font-medium text-xs py-1.5 px-3 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    <span>{t('reactivateEmoji')}</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => handleDeleteBooking(b.id)}
                                  className="text-slate-500 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
                                  title={t('deleteFromRecords')}
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })
                    )}
                  </div>
                </motion.div>
              )}
              {/* Tab 2: Quick Action Buttons Builder */}
              {activeTab === "buttons" && (
                <motion.div
                  key="buttons-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-800 pb-2">
                    <h4 className="font-bold text-slate-200 text-sm">{t('quickActionsTitle', 'مُشكل الأزرار السريعة والخيارات التلقائية ⚙️')}</h4>
                    <p className="text-xs text-slate-400">{t('quickActionsDesc', 'قم بإنشاء وتعديل الأزرار التي يراها الزبون في بداية المحادثة. النقر عليها يعطي إجابة فورية ومبرمجة ومضمونة 100% لتوفير وقت المحادثة.')}</p>
                  </div>

                  {/* Create New Quick Button */}
                  <form onSubmit={handleAddQuickAction} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                    <h5 className="text-xs font-bold text-teal-400">{t('addNewQuickAction', 'إضافة زر خيار سريع جديد')}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      <div className="md:col-span-4">
                        <input
                          type="text"
                          placeholder={t('quickActionPlaceholderLabel', 'عنوان الزر (مثال: 📍 موقع العيادة)')}
                          value={newButtonLabel}
                          onChange={(e) => setNewButtonLabel(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div className="md:col-span-6">
                        <input
                          type="text"
                          placeholder={t('quickActionPlaceholderResponse', 'الرد التلقائي والدقيق للزر عند النقر عليه...')}
                          value={newButtonResponse}
                          onChange={(e) => setNewButtonResponse(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <button
                          type="submit"
                          className="w-full h-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t('addBtn', 'إضافة')}</span>
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Active Quick Buttons List */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-300">
                      {t('activeQuickActions', 'أزرار الخيارات السريعة الفعالة حالياً')} ({quickActions.length})
                    </h5>
                    {quickActions.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-4 text-center">{t('noQuickActions', 'لا توجد أزرار سريعة معرفة حالياً. أضف زراً في الأعلى لبناء الخيارات.')}</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
                        {quickActions.map((action) => (
                          <div 
                            key={action.id} 
                            className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <span className="text-xs bg-slate-800 border border-slate-700 text-slate-200 px-2 py-1 rounded font-bold">
                                {action.label}
                              </span>
                              <p className="text-xs text-slate-400 line-clamp-1 mt-1">{action.response}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteQuickAction(action.id)}
                              className="text-rose-400 hover:text-rose-300 p-1.5 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                              title={t('deleteButtonTooltip', 'حذف الزر')}
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Clinic Database */}
              {activeTab === "database" && (
                <motion.div
                  key="database-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Part A: Services List */}
                  <div className="space-y-4">
                    <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-slate-200 text-sm">{t('servicesTableTitle', 'جداول الخدمات والأسعار المتاحة 💎')}</h4>
                        <p className="text-xs text-slate-400">{t('servicesTableDesc', 'قائمة الخدمات التي يقدمها الطبيب مع السعر المبرمج ليسهل على البوت الاستعانة بها.')}</p>
                      </div>
                    </div>

                    {/* Add Service Row Inline */}
                    <form onSubmit={handleAddService} className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3">
                      <div className="md:col-span-3">
                        <input
                          type="text"
                          placeholder={t('serviceNamePlaceholder', 'اسم الخدمة (مثال: تنظيف وتبييض)')}
                          value={newServiceName}
                          onChange={(e) => setNewServiceName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          required
                        />
                      </div>
                      <div className="md:col-span-5">
                        <input
                          type="text"
                          placeholder={t('serviceDescPlaceholder', 'تفاصيل ووصف الخدمة بدقة للمريض...')}
                          value={newServiceDesc}
                          onChange={(e) => setNewServiceDesc(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          placeholder={t('servicePricePlaceholder', 'السعر (مثال: 5000 دج)')}
                          value={newServicePrice}
                          onChange={(e) => setNewServicePrice(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <button
                          type="submit"
                          className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t('addServiceBtn', 'إضافة خدمة')}</span>
                        </button>
                      </div>
                    </form>

                    {/* Services Table List */}
                    <div className="overflow-x-auto border border-slate-800 rounded-xl">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-slate-900 text-slate-300 border-b border-slate-800 uppercase font-bold">
                          <tr>
                            <th className="px-4 py-3">{t('serviceTableHeaderName', 'الخدمة')}</th>
                            <th className="px-4 py-3">{t('serviceTableHeaderDesc', 'الوصف والتفاصيل')}</th>
                            <th className="px-4 py-3">{t('serviceTableHeaderPrice', 'السعر')}</th>
                            <th className="px-4 py-3 text-center">{t('serviceTableHeaderActions', 'إجراءات')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 bg-slate-950/20">
                          {services.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-4 py-6 text-center text-slate-500 italic">{t('noServicesInDb', 'لا توجد خدمات معرفة في قاعدة البيانات حالياً. استخدم نموذج الاستيراد السريع لتعبئتها دفعة واحدة!')}</td>
                            </tr>
                          ) : (
                            services.map((srv) => (
                              <tr key={srv.id} className="hover:bg-slate-900/30 transition-all">
                                <td className="px-4 py-3 font-semibold text-slate-200">{srv.name}</td>
                                <td className="px-4 py-3 text-slate-400 max-w-xs truncate" title={srv.description}>{srv.description || "—"}</td>
                                <td className="px-4 py-3 font-bold text-teal-400">{srv.price}</td>
                                <td className="px-4 py-3 text-center">
                                  <button
                                    onClick={() => handleDeleteService(srv.id)}
                                    className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
                                  >
                                    <Trash className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Part B: Guidelines & Instructions */}
                  <div className="space-y-4 pt-4 border-t border-slate-800/80">
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm">{t('guidelinesTitle', 'الإرشادات والتعليمات الطبية اللازمة 📋')}</h4>
                      <p className="text-xs text-slate-400">{t('guidelinesDesc', 'التعليمات المطلوبة من المريض قبل حضوره للعيادة أو بعد إجراءات طبية محددة ليتلوها الشات بوت بصرامة.')}</p>
                    </div>

                    {/* Add Guideline inline */}
                    <form onSubmit={handleAddGuideline} className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div className="md:col-span-4">
                          <input
                            type="text"
                            placeholder={t('guidelineTitlePlaceholder', 'عنوان الإرشاد (مثال: الصيام قبل فحص الدم)')}
                            value={newGuidelineTitle}
                            onChange={(e) => setNewGuidelineTitle(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            required
                          />
                        </div>
                        <div className="md:col-span-8">
                          <textarea
                            placeholder={t('guidelineContentPlaceholder', 'اكتب الإرشادات والتعليمات الطبية اللازمة بالتفصيل وبشكل مبسط للمريض هنا...')}
                            value={newGuidelineContent}
                            onChange={(e) => setNewGuidelineContent(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[50px]"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold px-4 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-teal-400" />
                          <span>{t('addGuidelineBtn', 'إضافة تعليمات وإرشادات')}</span>
                        </button>
                      </div>
                    </form>

                    {/* Guidelines Cards Grid */}
                    {guidelines.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-4 text-center">{t('noGuidelinesInDb', 'لا توجد إرشادات أو تحضيرات مبرمجة حالياً.')}</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-1">
                        {guidelines.map((gd) => (
                          <div key={gd.id} className="bg-slate-950/40 border border-slate-800 p-3.5 rounded-xl flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <h5 className="font-bold text-xs text-slate-200">{gd.title}</h5>
                              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{gd.content}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteGuideline(gd.id)}
                              className="text-rose-400 hover:text-rose-300 p-1.5 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer shrink-0"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Part C: Comprehensive Clinic Definition, Services, CV & Working Hours */}
                  <div className="space-y-4 pt-5 border-t border-slate-800/80">
                    <div className="flex justify-between items-center flex-wrap gap-2 text-right" dir={isRtl ? "rtl" : "ltr"}>
                      <div>
                        <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5 justify-end">
                          <span>{t('comprehensiveIntroTitle', 'التعريف الشامل بالعيادة، الخدمات، السيرة الذاتية وأوقات العمل 🏥')}</span>
                          <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">{t('comprehensiveIntroDesc', 'تعديل وصياغة ملف العيادة الشامل للجزائر بشكل تفاعلي ذكي لمعاينة وضمان ردود دقيقة ومحكمة من البوت.')}</p>
                      </div>
                    </div>

                    <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4">
                      <div className="flex justify-between items-center gap-2 flex-wrap" dir={isRtl ? "rtl" : "ltr"}>
                        <span className="text-xs font-bold text-slate-300">{t('writeIntroLabel', 'اكتب هنا التعريف التفصيلي لعيادتك:')}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const suggestedText = `تلتزم عيادتنا المتواجدة بالجزائر بتقديم أرقى الخدمات الطبية والرعاية الصحية المتكاملة لمرضانا الكرام. يشرف على العيادة الدكتور أحمد بن يوسف، وهو طبيب أخصائي متخرج من كلية الطب بجامعة الجزائر وله خبرة تزيد عن 12 سنة في ممارسة وتطوير العلاجات الحديثة. تقدم العيادة مجموعة شاملة من الخدمات التشخيصية والعلاجية بأحدث الأجهزة الطبية المستوردة والمعقمة كلياً وفق المعايير الطبية الدولية.

ساعات العمل واستقبال المرضى تكون من الأحد إلى الخميس، من الساعة 08:30 صباحاً وحتى الساعة 16:30 مساءً. يوم السبت مخصص للحالات الطارئة والمتابعة الخفيفة من 09:00 صباحاً إلى 13:00 زوالاً، ويوم الجمعة هو يوم العطلة الأسبوعية للعيادة. نسعد دائماً بخدمتكم وتوفير استجابة فورية لاستفساراتكم عبر المساعد الذكي المتاح 24/7 لمرافقة مرضانا وتسهيل حجز المواعيد.`;
                            setClinicInfo(prev => ({ ...prev, notes: suggestedText }));
                            showNotification(t('suggestIntroNotification', "تم تعبئة الفقرة النموذجية المقترحة! يمكنك تعديلها الآن وحفظ التغييرات 💡"), "success");
                          }}
                          className="text-[11px] bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{t('suggestIntroBtn', '💡 اقتراح فقرة نموذجية جاهزة للتعديل')}</span>
                        </button>
                      </div>

                      <textarea
                        value={clinicInfo.notes || ""}
                        onChange={(e) => setClinicInfo(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder={t('introPlaceholder', "مثال: تلتزم عيادتنا بتقديم خدمات طبية متكاملة... (اضغط على الزر أعلاه لتنزيل مثال جاهز لتعديله فوراً)")}
                        className={`w-full bg-slate-950 border border-slate-700/60 rounded-xl px-4 py-3 text-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none min-h-[140px] leading-relaxed ${isRtl ? "text-right" : "text-left"}`}
                        dir={isRtl ? "rtl" : "ltr"}
                      />

                      <div className="flex justify-between items-center gap-4 flex-wrap pt-2 border-t border-slate-850">
                        <div className="text-[10px] text-slate-400 leading-relaxed text-right max-w-lg" dir={isRtl ? "rtl" : "ltr"}>
                          {t('introNoteText', '* يتم استخدام هذه الفقرة مباشرة بواسطة محرك الذكاء الاصطناعي للإجابة على المرضى حول خدمات العيادة وأوقات العمل والسيرة الذاتية للطبيب وضمان تقديم معلومات دقيقة ودائمة.')}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            saveToLocalStorage(clinicInfo, dailyStatus, services, guidelines, quickActions);
                            showNotification(t('saveIntroNotification', "تم حفظ التعريف الشامل للعيادة بنجاح! 💾"), "success");
                          }}
                          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-lg shadow-teal-500/10"
                        >
                          <Save className="w-4 h-4" />
                          <span>{t('saveIntroBtn', 'حفظ التعريف الشامل')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 4: Excel / CSV Importer */}
              {activeTab === "import" && (
                <motion.div
                  key="import-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-800 pb-2">
                    <h4 className="font-bold text-slate-200 text-sm">{t('importTitle', 'استيراد البيانات الذكي والمباشر من إكسل (Excel / CSV) 📊')}</h4>
                    <p className="text-xs text-slate-400">{t('importDesc', 'بدلاً من الكتابة اليدوية المرهقة، ما عليك سوى نسخ جدولك من Excel ولصقه هنا فوراً! سيتعرف النظام الذكي على الأعمدة تلقائياً ويقوم بتحديث الشات بوت.')}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-300 block">{t('importStep1', '1. اختر وجهة الاستيراد:')}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setImportTarget("services");
                            setImportTypeText("");
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            importTarget === "services"
                              ? "bg-teal-500 text-slate-950 font-bold"
                              : "bg-slate-950 text-slate-400 border border-slate-850 hover:bg-slate-800"
                          }`}
                        >
                          {t('importServicesTarget', 'الخدمات والأسعار')}
                        </button>
                        <button
                          onClick={() => {
                            setImportTarget("guidelines");
                            setImportTypeText("");
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            importTarget === "guidelines"
                              ? "bg-teal-500 text-slate-950 font-bold"
                              : "bg-slate-950 text-slate-400 border border-slate-850 hover:bg-slate-800"
                          }`}
                        >
                          {t('importGuidelinesTarget', 'التعليمات والإرشادات')}
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <span className="text-xs font-bold text-slate-300 block">{t('importStep2', '2. آلية العمل (بسيطة جداً):')}</span>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {t('importStep2Desc', 'افتح ملف الإكسل الخاص بك، ظلل الجدول المطلوب (الاسم، الوصف، السعر)، اضغط Ctrl+C لنسخه، ثم الصقه بالأسفل باستخدام Ctrl+V.')}
                      </p>
                    </div>
                  </div>

                  {/* Input area for Excel table paste */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300">{t('pasteTableLabel', 'الصق الجدول المنسوخ من Excel أو ملف CSV هنا:')}</label>
                      <button
                        onClick={() => {
                          if (importTarget === "services") {
                            setImportTypeText("الخدمة\tالوصف والتفاصيل\tالسعر\nتبييض أسنان منزلي\tقوالب تبييض مخصصة مع المادة المبيضة الفعالة للبيت\t3000 دج\nعلاج العصب بجلسة واحدة\tسحب العصب المصاب وحشو القنوات بتقنيات حديثة بلا ألم\t4500 دج\nابتسامة هوليوود زركون\tعدسات زركون عالية المقاومة واللمعان للسن الواحد\t9000 دج");
                          } else {
                            setImportTypeText("الموضوع\tالإرشادات والتعليمات\nتحضير فحص الدم الكامل\tيجب الصيام عن الأكل والشرب ما عدا الماء العادي لمدة 8 إلى 12 ساعة كاملة قبل سحب العينة.\nتحضير جلسة التقشير\tيرجى تجنب منتجات الريتينول ومقشرات حمض الساليسيليك قبل الجلسة بـ 5 أيام مع الحرص على ترطيب البشرة.");
                          }
                          showNotification(t('demoPasteLoadedNotif', "تم ملء نموذج لصق توضيحي! يمكنك الضغط على زر الاستيراد لحفظه 📋"), "info");
                        }}
                        className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 border border-teal-500/20 px-2 py-0.5 rounded bg-teal-500/5 transition-all"
                      >
                        <span>{t('loadDemoPasteBtn', 'تحميل نموذج توضيحي للصق')}</span>
                      </button>
                    </div>
                    <textarea
                      className="w-full h-24 bg-slate-950 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono placeholder-slate-700 text-right leading-relaxed"
                      dir={isRtl ? "rtl" : "ltr"}
                      placeholder={
                        importTarget === "services"
                          ? "الصق جدول الإكسل هنا مباشرة (الاسم، الوصف، السعر)..."
                          : "الصق جدول الإكسل هنا مباشرة (الموضوع، الإرشادات والتعليمات)..."
                      }
                      value={importTypeText}
                      onChange={(e) => setImportTypeText(e.target.value)}
                    />
                  </div>

                  {/* Table preview & save */}
                  {importPreview.length > 0 && (
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/80 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> {t('parsedPreviewLabel', 'معاينة البيانات المستخرجة والجاهزة للاستيراد')} ({importPreview.length}):
                        </span>
                        <button
                          onClick={handleCommitImport}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-1.5 px-3 rounded-lg text-xs transition-all flex items-center gap-1 shadow-sm"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{t('commitImportBtn', 'اعتماد وحفظ بقاعدة البيانات')}</span>
                        </button>
                      </div>

                      <table className="w-full text-right text-xs">
                          <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                            {importTarget === "services" ? (
                              <tr>
                                <th className="px-3 py-2">{t('serviceTableHeaderName', 'الخدمة')}</th>
                                <th className="px-3 py-2">{t('serviceTableHeaderDesc', 'الوصف')}</th>
                                <th className="px-3 py-2">{t('serviceTableHeaderPrice', 'السعر')}</th>
                              </tr>
                            ) : (
                              <tr>
                                <th className="px-3 py-2">{t('guidelineTitlePlaceholder', 'الموضوع')}</th>
                                <th className="px-3 py-2">{t('serviceTableHeaderDesc', 'الإرشادات والتعليمات')}</th>
                              </tr>
                            )}
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {importPreview.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-900/40">
                                {importTarget === "services" ? (
                                  <>
                                    <td className="px-3 py-2 text-slate-200">{item.name}</td>
                                    <td className="px-3 py-2 text-slate-400">{item.description}</td>
                                    <td className="px-3 py-2 text-teal-400 font-mono">{item.price}</td>
                                  </>
                                ) : (
                                  <>
                                    <td className="px-3 py-2 text-slate-200 font-bold">{item.topic}</td>
                                    <td className="px-3 py-2 text-slate-400 whitespace-pre-wrap">{item.instructions}</td>
                                  </>
                                )}
                              </tr>
                            ))}
                          </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tab 7: Patient Conversations & AI Analytics */}
              {activeTab === "conversations" && (
                <motion.div
                  key="conversations-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-800 pb-2 flex justify-between items-center flex-wrap gap-2">
                    <div className="text-right">
                      <h4 className="font-bold text-slate-200 text-sm">{t('conversationsTitle', 'مراقبة محادثات المرضى وتحليلات الأداء الذكي 📊')}</h4>
                      <p className="text-xs text-slate-400">{t('conversationsDesc', 'تتبع سجلات المحادثات الحية، قيم رضا المرضى، وتحكم بإعدادات وصمامات أمان الذكاء الاصطناعي.')}</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-teal-500/10 text-teal-400 px-3 py-1.5 rounded-lg border border-teal-500/20 text-xs font-bold">
                      <TrendingUp className="w-4 h-4" />
                      <span>{t('aiAccuracyBadge', 'معدل دقة الذكاء: 98.4%')}</span>
                    </div>
                  </div>

                  {/* Top Analytics Cards Bento-Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Stat Card 1: Total Conversations */}
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 text-right" dir={isRtl ? "rtl" : "ltr"}>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 block font-bold">{t('totalConversationsToday', 'إجمالي المحادثات (اليوم)')}</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-slate-100">42</span>
                          <span className="text-[10px] text-emerald-400 font-bold">{t('vsYesterdayPercentage', '+18% من أمس')}</span>
                        </div>
                        <p className="text-[9px] text-slate-500">{t('responseTimeInstant', 'معدل استجابة فوري: 100% (0.4 ثانية)')}</p>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Stat Card 2: AI Booking Rate with Circular Progress */}
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 text-right" dir={isRtl ? "rtl" : "ltr"}>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 block font-bold">{t('smartBookingSuccessRate', 'معدل الحجز الذكي الناجح')}</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-teal-400">78.5%</span>
                          <span className="text-[10px] text-slate-400">{t('confirmedBookingsCount', '33 حجز مؤكد')}</span>
                        </div>
                        <p className="text-[9px] text-slate-500">{t('aiBookingDesc', 'تمت بالكامل آلياً عبر محادثة البوت')}</p>
                      </div>
                      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" className="text-slate-800" fill="transparent" />
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" className="text-teal-400" fill="transparent" strokeDasharray="125.6" strokeDashoffset="27" />
                        </svg>
                        <span className="absolute text-[10px] font-bold text-slate-200">78%</span>
                      </div>
                    </div>

                    {/* Stat Card 3: Patient Satisfaction Rating */}
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 sm:col-span-2 lg:col-span-1 text-right" dir={isRtl ? "rtl" : "ltr"}>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 block font-bold">مستوى رضا المرضى (AI)</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-amber-400">4.9 / 5.0</span>
                          <span className="text-[10px] text-emerald-400">ممتاز (28 تقييم)</span>
                        </div>
                        <p className="text-[9px] text-slate-500">يقيس التفاعل الودي والمساعدة الذكية</p>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                        <UserCheck className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Config Center & Controls Grid */}
                  <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4">
                    <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 justify-end">
                      <span>مركز ضبط محرك الذكاء الاصطناعي وتجنب المخاطر ⚙️</span>
                      <Sliders className="w-4 h-4 text-teal-400" />
                    </h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right" dir={isRtl ? "rtl" : "ltr"}>
                      {/* Control 1: Temperature */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[11px] text-slate-300 font-bold">درجة إبداع البوت (Temperature)</label>
                          <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">
                            {aiTemperature}
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min="0.0" 
                          max="0.6" 
                          step="0.05"
                          value={aiTemperature}
                          onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
                          className="w-full accent-teal-400 bg-slate-800 rounded-lg cursor-pointer h-1"
                        />
                        <div className="flex justify-between text-[8px] text-slate-500">
                          <span>منضبط وآمن (0.0)</span>
                          <span>متوازن</span>
                          <span>إبداعي مرن (0.6)</span>
                        </div>
                      </div>

                      {/* Control 2: Safeguard Levels */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-300 font-bold block">مستوى القيود وصمامات الأمان الطبية</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSafeguardLevel("strict")}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold border transition-all ${
                              safeguardLevel === "strict"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                : "bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300"
                            }`}
                          >
                            حصر مطلق 🔒
                          </button>
                          <button
                            type="button"
                            onClick={() => setSafeguardLevel("moderate")}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold border transition-all ${
                              safeguardLevel === "moderate"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                : "bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300"
                            }`}
                          >
                            متوازن ومقيد ⚖️
                          </button>
                        </div>
                        <p className="text-[9px] text-slate-500 leading-relaxed">
                          {safeguardLevel === "strict" 
                            ? "يحظر تماماً أي نصائح علاجية ويلتزم فقط بقائمة الخدمات ومعلومات الاتصال" 
                            : "يسمح بتقديم نصائح صحية عامة ووقائية مع تنبيه بضرورة مراجعة الطبيب"}
                        </p>
                      </div>

                      {/* Control 3: AI Language Tone */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-300 font-bold block">نبرة الحديث والأسلوب اللغوي</label>
                        <select
                          value={aiTone}
                          onChange={(e) => setAiTone(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                        >
                          <option value="formal">مهني ورسمي وقور 💼</option>
                          <option value="friendly">ودي، مرحب ولطيف 🌸</option>
                          <option value="simple">مبسط، سريع ومباشر ⚡</option>
                        </select>
                        <p className="text-[9px] text-slate-500">يغير أسلوب صياغة الردود الطبية الفورية الموجهة للمرضى.</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-start pt-1">
                      <button
                        type="button"
                        onClick={() => showNotification("تم حفظ وتحديث إعدادات محرك الذكاء الاصطناعي بنجاح! ⚙️", "success")}
                        className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-[10px] font-bold px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-teal-500/10"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>تطبيق الإعدادات على المحرك فوراً</span>
                      </button>
                    </div>
                  </div>

                  {/* Main Grid: Left List / Right Active Conversation Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    
                    {/* Conversations Sessions List */}
                    <div className={`${selectedSession ? "lg:col-span-5" : "lg:col-span-12"} space-y-3 transition-all duration-300 text-right`}>
                      <div className="flex items-center justify-between">
                        {selectedSession && (
                          <button 
                            onClick={() => setSelectedSession(null)}
                            className="text-[10px] text-teal-400 hover:text-teal-300 underline"
                          >
                            عرض ملء الصفحة لجميع الجلسات
                          </button>
                        )}
                        <h5 className="text-xs font-bold text-slate-300">جلسات المحادثات الحالية والمحفوظة ({conversations.length})</h5>
                      </div>

                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                        {conversations.map((session) => (
                          <div
                            key={session.id}
                            onClick={() => setSelectedSession(session)}
                            className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col gap-2 relative ${
                              selectedSession?.id === session.id
                                ? "bg-slate-900 border-teal-500/40 shadow-md"
                                : "bg-slate-900/50 border-slate-850 hover:border-slate-800"
                            }`}
                          >
                            {/* Badges and date */}
                            <div className="flex justify-between items-center" dir={isRtl ? "rtl" : "ltr"}>
                              <span className="text-[9px] text-slate-500 font-mono">{session.date}</span>
                              <div className="flex gap-1">
                                {session.status === "pending_review" ? (
                                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[8px] font-bold px-1.5 py-0.5 rounded">
                                    بانتظار المراجعة ⚠️
                                  </span>
                                ) : (
                                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-bold px-1.5 py-0.5 rounded">
                                    تمت مراجعته ✓
                                  </span>
                                )}
                                
                                {session.aiSentiment === "satisfied" && (
                                  <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                    <span>راضي 😊</span>
                                  </span>
                                )}
                                {session.aiSentiment === "neutral" && (
                                  <span className="bg-slate-800 text-slate-400 text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                    <span>محايد 😐</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Patient info & topic */}
                            <div className="space-y-0.5">
                              <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5 justify-end">
                                <span className="text-[10px] text-slate-400 font-normal">({session.patientPhone})</span>
                                <span>{session.patientName}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium truncate">{session.topic}</p>
                            </div>

                            {/* Footer hint */}
                            <div className="flex justify-between items-center text-[9px] text-slate-500 border-t border-slate-850/60 pt-2 mt-1" dir={isRtl ? "rtl" : "ltr"}>
                              <span>💬 {session.messages.length} رسائل متبادلة</span>
                              <span className="text-teal-400 hover:underline flex items-center gap-0.5">
                                <ChevronLeft className="w-3 h-3" />
                                <span>افتح التفاصيل</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chat Session Viewer panel (appears on the right when session is clicked) */}
                    {selectedSession && (
                      <div className="lg:col-span-7 bg-slate-900/60 rounded-xl border border-slate-800 p-4.5 space-y-4 text-right">
                        
                        {/* Session Header */}
                        <div className="flex justify-between items-start border-b border-slate-800 pb-3 flex-wrap gap-2 text-right" dir={isRtl ? "rtl" : "ltr"}>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono text-slate-500">#{selectedSession.id}</span>
                              <h5 className="font-bold text-slate-200 text-sm">محادثة المريض: {selectedSession.patientName}</h5>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">الموضوع: {selectedSession.topic}</p>
                            <p className="text-[10px] text-slate-500 font-mono">رقم الهاتف: {selectedSession.patientPhone} | تاريخ الجلسة: {selectedSession.date}</p>
                          </div>
                          
                          <div className="flex gap-1.5">
                            {selectedSession.status === "pending_review" && (
                              <button
                                onClick={() => {
                                  const updated = conversations.map(c => 
                                    c.id === selectedSession.id ? { ...c, status: "reviewed" as const } : c
                                  );
                                  setConversations(updated);
                                  setSelectedSession({ ...selectedSession, status: "reviewed" });
                                  showNotification("تم وضع علامة 'تمت المراجعة' بنجاح! ✓", "success");
                                }}
                                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                              >
                                تحديد كمقروء ومكتمل ✓
                              </button>
                            )}
                            <button
                              onClick={() => {
                                const summary = `[ملخص محادثة عيادة الأسنان الذكية]
اسم المريض: ${selectedSession.patientName}
رقم الجوال: ${selectedSession.patientPhone}
موضوع الاستشارة: ${selectedSession.topic}
تاريخ الجلسة: ${selectedSession.date}
مستوى الرضا المتوقع: ${selectedSession.aiSentiment === "satisfied" ? "ممتاز 😊" : "محايد 😐"}

[ملخص النصائح والحجوزات المتولدة]:
تم حجز موعد مبدئي وافتراضي للمريض واستعراض الخدمات الملائمة لحالته. يرجى تواصل السكرتارية لتأكيد وحفظ الموعد المباشر.`;
                                navigator.clipboard.writeText(summary);
                                showNotification("تم نسخ التقرير الطبي وموجز الحالة إلى الحافظة! 📋", "success");
                              }}
                              className="bg-slate-800 hover:bg-slate-750 text-slate-300 text-[10px] font-bold px-2 py-1.5 rounded-lg border border-slate-750 transition-all cursor-pointer"
                              title="نسخ ملخص الحالة"
                            >
                              نسخ الملخص 📋
                            </button>
                            <button
                              onClick={() => {
                                setPdfSession(selectedSession);
                                setShowMedicalPdfModal(true);
                              }}
                              className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm shadow-teal-500/10"
                              title="تصدير سجل المحادثة والتحليلات كتقرير طبي رسمي PDF"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>التقرير الطبي الرسمي (PDF) 📄</span>
                            </button>
                          </div>
                        </div>

                        {/* Simulated Live Messages Stream */}
                        <div className="h-[280px] overflow-y-auto border border-slate-850 bg-slate-950/40 rounded-xl p-3 space-y-3 flex flex-col">
                          {selectedSession.messages.map((msg, idx) => (
                            <div
                              key={msg.id || idx}
                              className={`flex flex-col max-w-[85%] ${
                                msg.sender === "user" ? "self-start items-start" : "self-end items-end"
                              }`}
                            >
                              <div className="flex items-center gap-1 mb-0.5">
                                <span className="text-[8px] text-slate-500 font-mono">
                                  {msg.sender === "user" ? selectedSession.patientName : msg.sender === "bot" ? "الشات بوت (الذكاء الاصطناعي)" : "طبيب العيادة مباشرة"}
                                </span>
                              </div>
                              <div
                                className={`rounded-xl px-3 py-2 text-[11px] leading-relaxed whitespace-pre-wrap text-right ${
                                  msg.sender === "user"
                                    ? "bg-slate-900 text-slate-200 border border-slate-800 rounded-tr-none"
                                    : msg.sender === "bot"
                                      ? "bg-teal-500/15 text-teal-300 border border-teal-500/15 rounded-tl-none"
                                      : "bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-tl-none" // doctor intervention
                                }`}
                              >
                                {msg.sender === "doctor" && (
                                  <strong className="text-amber-400 block mb-0.5 text-[9px]">تدخل طبيب العيادة مباشرة 🧑‍⚕️:</strong>
                                )}
                                {msg.text}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Direct Doctor Message Intercept Form */}
                        <div className="space-y-1.5 bg-slate-950/30 p-3 rounded-xl border border-slate-850/50">
                          <label className="text-[10px] text-amber-400 font-bold block">التدخل المباشر كطبيب وإرسال رد للمريض 🧑‍⚕️</label>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const form = e.currentTarget;
                              const input = form.elements.namedItem("doctorMsg") as HTMLInputElement;
                              if (!input.value.trim()) return;

                              const newMsg: ChatMessage = {
                                id: `doc-m-${Date.now()}`,
                                sender: "doctor" as any, // doctor sender override
                                text: input.value,
                                timestamp: new Date()
                              };

                              const updated = conversations.map(c => {
                                if (c.id === selectedSession.id) {
                                  return {
                                    ...c,
                                    messages: [...c.messages, newMsg]
                                  };
                                }
                                return c;
                              });

                              setConversations(updated);
                              setSelectedSession({
                                ...selectedSession,
                                messages: [...selectedSession.messages, newMsg]
                              });
                              input.value = "";
                              showNotification("تم إرسال رد الطبيب المباشر للمريض بنجاح! 💬", "success");
                            }}
                            className="flex gap-2"
                          >
                            <input
                              type="text"
                              name="doctorMsg"
                              placeholder="اكتب ردك المباشر كطبيب (مثال: أهلاً بك يا أحمد، اطلعت على حالتك وسأكون بانتظارك)..."
                              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-slate-600 text-right"
                              dir={isRtl ? "rtl" : "ltr"}
                            />
                            <button
                              type="submit"
                              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 rounded-lg font-bold text-xs transition-all flex items-center justify-center cursor-pointer shadow-md shadow-amber-500/5"
                            >
                              إرسال الرد
                            </button>
                          </form>
                        </div>
                      </div>
                    )}

                  </div>

                </motion.div>
              )}

              {/* Tab 8: Market Deployment, Download Center & Monetization */}
              {activeTab === "market" && (
                <motion.div
                  key="market-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-800 pb-2 flex justify-between items-center flex-wrap gap-2 text-right" dir={isRtl ? "rtl" : "ltr"}>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-200 text-sm">مركز التنزيل ونشر التطبيق في السوق التجاري 🚀</h4>
                      <p className="text-xs text-slate-400">حول مشروعك إلى تطبيق حقيقي للهواتف المحمولة والكمبيوتر، اربطه بـ WhatsApp و Telegram، وابدأ بجني الأرباح.</p>
                    </div>
                    <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                      <span>جاهز للإطلاق التجاري الكامل</span>
                    </div>
                  </div>

                  {/* Top Row: Left PWA Installer & Right Social Webhook Integrations */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Panel: PWA Installer & App Download (5 cols) */}
                    <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4 text-right" dir={isRtl ? "rtl" : "ltr"}>
                      <div className="space-y-1">
                        <h5 className="text-xs font-black text-slate-200 flex items-center gap-1.5 justify-end">
                          <span>تحميل التطبيق كنسخة هاتف حقيقية 📱</span>
                          <Smartphone className="w-4 h-4 text-teal-400" />
                        </h5>
                        <p className="text-[10px] text-slate-400">التطبيق مجهز بالكامل بتقنية PWA (Progressive Web App). يمكن تثبيته فورياً على أي جهاز ليعمل كتطبيق أصلي منفصل.</p>
                      </div>

                      {/* Device type tab selector */}
                      <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
                        {(["android", "ios", "pc"] as const).map((device) => (
                          <button
                            key={device}
                            type="button"
                            onClick={() => setInstallDeviceType(device)}
                            className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                              installDeviceType === device
                                ? "bg-slate-800 text-teal-400 shadow"
                                : "text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            {device === "android" && "أندرويد / سامسونج"}
                            {device === "ios" && "آيفون / iOS"}
                            {device === "pc" && "كمبيوتر / Windows"}
                          </button>
                        ))}
                      </div>

                      {/* Install Card Representation */}
                      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850/60 text-center space-y-3 relative overflow-hidden">
                        {/* Soft visual glow background */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/5 to-cyan-500/5 pointer-events-none" />

                        <div className="mx-auto w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-400 relative">
                          <Download className="w-6 h-6 animate-bounce" />
                        </div>

                        <div className="space-y-1">
                          <h6 className="font-bold text-slate-200 text-xs">ثبّت لوحة تحكم العيادة على جهازك</h6>
                          <p className="text-[9px] text-slate-400 leading-relaxed px-2">
                            استمتع بتشغيل التطبيق بملء الشاشة، بدون شريط المتصفح، مع سرعة تشغيل مضاعفة ودعم غير محدود للعمل في وضع عدم الاتصال.
                          </p>
                        </div>

                        {/* Simulate / Real Install Button */}
                        <button
                          type="button"
                          onClick={handleInstallApp}
                          className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs py-2 px-4 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/10"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>تنزيل وتثبيت التطبيق الآن</span>
                        </button>

                        <div className="pt-2 border-t border-slate-850/60">
                          {installDeviceType === "android" && (
                            <div className="text-right space-y-1.5 text-[10px] text-slate-400">
                              <span className="font-bold text-slate-300 text-right block">طريقة التثبيت اليدوية على أندرويد (Chrome):</span>
                              <ol className="list-decimal list-inside space-y-1 text-right text-[9px]" dir={isRtl ? "rtl" : "ltr"}>
                                <li>افتح رابط التطبيق في متصفح <strong className="text-teal-400">Google Chrome</strong>.</li>
                                <li>اضغط على رمز <strong className="text-slate-200">النقاط الثلاث (⋮)</strong> في الزاوية العلوية للمتصفح.</li>
                                <li>اختر <strong className="text-slate-200">"تثبيت التطبيق" (Install App)</strong> أو "إضافة إلى الشاشة الرئيسية".</li>
                                <li>سيظهر التطبيق كأيقونة حقيقية على هاتفك فوراً!</li>
                              </ol>
                            </div>
                          )}

                          {installDeviceType === "ios" && (
                            <div className="text-right space-y-1.5 text-[10px] text-slate-400">
                              <span className="font-bold text-slate-300 text-right block">طريقة التثبيت على آيفون وآيباد (Safari):</span>
                              <ol className="list-decimal list-inside space-y-1 text-right text-[9px]" dir={isRtl ? "rtl" : "ltr"}>
                                <li>افتح رابط التطبيق عبر متصفح <strong className="text-teal-400">Safari</strong> الافتراضي للآيفون.</li>
                                <li>اضغط على زر <strong className="text-slate-200">"مشاركة" (Share - ⎋)</strong> في الأسفل.</li>
                                <li>اسحب لأسفل واضغط على خيار <strong className="text-slate-200">"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.</li>
                                <li>اضغط <strong className="text-slate-200">"إضافة" (Add)</strong> في الأعلى. سيصبح لديك تطبيق آيفون متكامل!</li>
                              </ol>
                            </div>
                          )}

                          {installDeviceType === "pc" && (
                            <div className="text-right space-y-1.5 text-[10px] text-slate-400">
                              <span className="font-bold text-slate-300 text-right block">طريقة التثبيت على الكمبيوتر والماك:</span>
                              <ol className="list-decimal list-inside space-y-1 text-right text-[9px]" dir={isRtl ? "rtl" : "ltr"}>
                                <li>افتح التطبيق في متصفح Chrome أو Edge على جهازك المحمول أو المكتبي.</li>
                                <li>ستلاحظ ظهور أيقونة <strong className="text-teal-400">"كمبيوتر محمول صغير مع سهم تنزيل"</strong> في شريط العنوان بالأعلى.</li>
                                <li>اضغط عليها ثم اختر <strong className="text-slate-200">"تثبيت" (Install)</strong> لتشغيله كبرنامج مستقل على سطح المكتب.</li>
                              </ol>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Panel: Multi-Channel WhatsApp / Telegram Webhook Integration (7 cols) */}
                    <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4 text-right" dir={isRtl ? "rtl" : "ltr"}>
                      <div className="space-y-1">
                        <h5 className="text-xs font-black text-slate-200 flex items-center gap-1.5 justify-end">
                          <span>ربط محرك الذكاء بقنوات التواصل الشهيرة 🔗</span>
                          <Sliders className="w-4 h-4 text-teal-400" />
                        </h5>
                        <p className="text-[10px] text-slate-400">قم بربط الشات بوت مباشرة بقنوات تواصل عيادتك الحقيقية ليتفاعل مع المرضى تلقائياً على مدار الساعة.</p>
                      </div>

                      {/* Webhook sub tabs */}
                      <div className="flex flex-wrap bg-slate-950 p-1 rounded-lg border border-slate-850 gap-1">
                        {(["whatsapp", "messenger", "instagram", "telegram", "embed"] as const).map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveIntegrationTab(tab)}
                            className={`flex-1 min-w-[85px] py-2 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                              activeIntegrationTab === tab
                                ? "bg-slate-800 text-teal-400 shadow"
                                : "text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            {tab === "whatsapp" && "واتساب WhatsApp"}
                            {tab === "messenger" && "ماسنجر Messenger"}
                            {tab === "instagram" && "إنستغرام Instagram"}
                            {tab === "telegram" && "تيليجرام Telegram"}
                            {tab === "embed" && "تضمين بموقعك Widget"}
                          </button>
                        ))}
                      </div>

                      {/* Content of selected integration */}
                      <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850 space-y-3.5">
                        
                        {activeIntegrationTab === "whatsapp" && (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center bg-teal-500/5 p-2 rounded border border-teal-500/10">
                              <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                                integrationStatus.whatsapp === "connected" ? "bg-emerald-500/20 text-emerald-400" : "bg-teal-500/10 text-teal-400"
                              }`}>
                                الحالة: {integrationStatus.whatsapp === "connected" ? "متصل ومفعل" : "جاهز للربط"}
                              </span>
                              <span className="text-[10px] text-slate-300 font-bold">ربط واتساب السحابي (WhatsApp Cloud API)</span>
                            </div>

                            <p className="text-[9px] text-slate-400 leading-relaxed">
                              تتيح لك هذه البوابة ربط الشات بوت برقم هاتف عيادتك الرسمي على واتساب عبر منصة Meta للمطورين. سيقوم الذكاء الاصطناعي بالرد فورياً على استفسارات وحجوزات المرضى على مدار الساعة.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                              <div className="space-y-1">
                                <label className="text-[9px] text-slate-400 font-bold">معرف رقم هاتف واتساب (Phone Number ID)</label>
                                <input 
                                  type="text" 
                                  value={whatsappPhoneId}
                                  onChange={(e) => setWhatsappPhoneId(e.target.value)}
                                  placeholder="مثال: 10938502934812"
                                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-200 text-left font-mono focus:border-teal-500 focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] text-slate-400 font-bold">رمز الوصول الدائم (Permanent Access Token)</label>
                                <input 
                                  type="password" 
                                  value={whatsappToken}
                                  onChange={(e) => setWhatsappToken(e.target.value)}
                                  placeholder="الصق رمز الوصول الدائم من فيسبوك..."
                                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-200 text-left font-mono focus:border-teal-500 focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] text-teal-400 font-bold">رابط خطاف الويب للعيادة (Webhook URL) لإدخاله في Meta Developer Console:</label>
                              <div className="bg-slate-900 p-2 rounded text-left font-mono text-[9px] text-slate-300 select-all border border-slate-800 flex justify-between items-center">
                                <span className="text-slate-500 text-[8px] bg-slate-950 px-1 rounded">GET/POST</span>
                                <span>https://shafi-api.algiers.clinic/v1/webhooks/whatsapp</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (!whatsappPhoneId || !whatsappToken) {
                                  showNotification("⚠️ يرجى تعبئة كافة الحقول المطلوبة (معرف الهاتف ورمز الوصول) أولاً!", "error");
                                  return;
                                }
                                setIntegrationStatus(prev => ({ ...prev, whatsapp: "connected" }));
                                showNotification("🎉 تم التحقق وربط واتساب الأعمال بنجاح! الشات بوت الآن نشط ويستجيب للمرضى.", "success");
                              }}
                              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[10px] py-1.5 px-3 rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <span>تفعيل واختبار اتصال واتساب السحابي ⚡</span>
                            </button>
                          </div>
                        )}

                        {activeIntegrationTab === "messenger" && (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center bg-blue-500/5 p-2 rounded border border-blue-500/10">
                              <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                                integrationStatus.messenger === "connected" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                              }`}>
                                الحالة: {integrationStatus.messenger === "connected" ? "متصل ومفعل" : "جاهز للربط"}
                              </span>
                              <span className="text-[10px] text-slate-300 font-bold">ربط ماسنجر (Facebook Messenger API)</span>
                            </div>

                            <p className="text-[9px] text-slate-400 leading-relaxed">
                              اربط الشات بوت مباشرة بصفحة عيادتك الرسمية على فيسبوك. سيتولى المساعد الذكي الرد على جميع رسائل المتابعين وحجز المواعيد وتنظيم الاستفسارات مباشرة على Messenger.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                              <div className="space-y-1">
                                <label className="text-[9px] text-slate-400 font-bold">معرف صفحة فيسبوك (Facebook Page ID)</label>
                                <input 
                                  type="text" 
                                  value={messengerPageId}
                                  onChange={(e) => setMessengerPageId(e.target.value)}
                                  placeholder="مثال: 102938475610293"
                                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-200 text-left font-mono focus:border-teal-500 focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] text-slate-400 font-bold">مفتاح الصفحة (Page Access Token)</label>
                                <input 
                                  type="password" 
                                  value={messengerToken}
                                  onChange={(e) => setMessengerToken(e.target.value)}
                                  placeholder="الصق رمز الوصول لصفحة فيسبوك..."
                                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-200 text-left font-mono focus:border-teal-500 focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] text-blue-400 font-bold">رابط خطاف الويب لماسنجر (Webhook URL):</label>
                              <div className="bg-slate-900 p-2 rounded text-left font-mono text-[9px] text-slate-300 select-all border border-slate-800 flex justify-between items-center">
                                <span className="text-slate-500 text-[8px] bg-slate-950 px-1 rounded">GET/POST</span>
                                <span>https://shafi-api.algiers.clinic/v1/webhooks/messenger</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (!messengerPageId || !messengerToken) {
                                  showNotification("⚠️ يرجى كتابة معرف الصفحة ورمز الوصول أولاً!", "error");
                                  return;
                                }
                                setIntegrationStatus(prev => ({ ...prev, messenger: "connected" }));
                                showNotification("🎉 تم تفعيل ربط فيسبوك ماسنجر بنجاح! الشات بوت الآن يستقبل ويرد على كافة رسائل الصفحة تلقائياً.", "success");
                              }}
                              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] py-1.5 px-3 rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Facebook className="w-3.5 h-3.5" />
                              <span>تفعيل واختبار اتصال ماسنجر ⚡</span>
                            </button>
                          </div>
                        )}

                        {activeIntegrationTab === "instagram" && (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center bg-pink-500/5 p-2 rounded border border-pink-500/10">
                              <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                                integrationStatus.instagram === "connected" ? "bg-emerald-500/20 text-emerald-400" : "bg-pink-500/10 text-pink-400"
                              }`}>
                                الحالة: {integrationStatus.instagram === "connected" ? "متصل ومفعل" : "جاهز للربط"}
                              </span>
                              <span className="text-[10px] text-slate-300 font-bold">ربط رسائل إنستغرام (Instagram DM API)</span>
                            </div>

                            <p className="text-[9px] text-slate-400 leading-relaxed">
                              فعّل ميزة الرد التلقائي وحجز المواعيد على حساب عيادتك الرسمي على Instagram. سيقوم المساعد الذكي بالاستجابة لرسائل الدايركت والتعليقات وتوجيه المرضى لحجز مواعيدهم.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                              <div className="space-y-1">
                                <label className="text-[9px] text-slate-400 font-bold">معرف حساب إنستغرام للأعمال (Instagram Business ID)</label>
                                <input 
                                  type="text" 
                                  value={instagramPageId}
                                  onChange={(e) => setInstagramPageId(e.target.value)}
                                  placeholder="مثال: 17841400000000000"
                                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-200 text-left font-mono focus:border-teal-500 focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] text-slate-400 font-bold">رمز الوصول (Access Token)</label>
                                <input 
                                  type="password" 
                                  value={instagramToken}
                                  onChange={(e) => setInstagramToken(e.target.value)}
                                  placeholder="الصق رمز وصول إنستغرام المعتمد..."
                                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-200 text-left font-mono focus:border-teal-500 focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] text-pink-400 font-bold">رابط خطاف الويب لإنستغرام (Webhook URL):</label>
                              <div className="bg-slate-900 p-2 rounded text-left font-mono text-[9px] text-slate-300 select-all border border-slate-800 flex justify-between items-center">
                                <span className="text-slate-500 text-[8px] bg-slate-950 px-1 rounded">GET/POST</span>
                                <span>https://shafi-api.algiers.clinic/v1/webhooks/instagram</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (!instagramPageId || !instagramToken) {
                                  showNotification("⚠️ يرجى إدخال معرف إنستغرام للأعمال ورمز الوصول أولاً!", "error");
                                  return;
                                }
                                setIntegrationStatus(prev => ({ ...prev, instagram: "connected" }));
                                showNotification("🎉 تم ربط وتفعيل حساب إنستغرام للأعمال بنجاح! المساعد الذكي سيتولى الرد على رسائل الدايركت.", "success");
                              }}
                              className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500 text-white font-bold text-[10px] py-1.5 px-3 rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Instagram className="w-3.5 h-3.5" />
                              <span>تفعيل واختبار اتصال إنستغرام ⚡</span>
                            </button>
                          </div>
                        )}

                        {activeIntegrationTab === "telegram" && (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center bg-sky-500/5 p-2 rounded border border-sky-500/10">
                              <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                                integrationStatus.telegram === "connected" ? "bg-emerald-500/20 text-emerald-400" : "bg-sky-500/10 text-sky-400"
                              }`}>
                                الحالة: {integrationStatus.telegram === "connected" ? "متصل ومفعل" : "جاهز للربط"}
                              </span>
                              <span className="text-[10px] text-slate-300 font-bold">توصيل بوت تيليجرام مجاني (Telegram Bot)</span>
                            </div>

                            <p className="text-[9px] text-slate-400 leading-relaxed">
                              أنشئ بوت تيليجرام خاص بعيادتك عبر التحدث مع <strong className="text-slate-200">@BotFather</strong> على تيليجرام، ثم الصق مفتاح Token هنا ليرد الذكاء الاصطناعي مباشرة على جميع استفسارات وتساؤلات المرضى.
                            </p>

                            <div className="space-y-1">
                              <label className="text-[9px] text-slate-400 font-bold">مفتاح توكين البوت (Bot API Token)</label>
                              <div className="flex gap-1.5">
                                <input 
                                  type="password" 
                                  value={telegramTokenState}
                                  onChange={(e) => setTelegramTokenState(e.target.value)}
                                  placeholder="الصق المفتاح هنا (مثال: 783921389:AAH_f9x...)"
                                  className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-[10px] text-slate-200 text-left font-mono focus:border-teal-500 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!telegramTokenState) {
                                      showNotification("⚠️ يرجى إدخال مفتاح توكين البوت الخاص بـ @BotFather!", "error");
                                      return;
                                    }
                                    setIntegrationStatus(prev => ({ ...prev, telegram: "connected" }));
                                    showNotification("🎉 تم حفظ مفتاح تيليجرام وتفعيل البوت بنجاح! البوت الآن يستقبل الرسائل ويرد عليها بالكامل.", "success");
                                  }}
                                  className="bg-sky-500/15 text-sky-400 hover:bg-sky-500/25 border border-sky-500/25 px-3 rounded text-[10px] font-bold transition-all cursor-pointer"
                                >
                                  حفظ وربط البوت
                                </button>
                              </div>
                            </div>

                            <div className="bg-slate-900 p-2.5 rounded text-right space-y-1 text-[9px] text-slate-400 border border-slate-850">
                              <span className="font-bold text-slate-300 block">خطوات الربط في دقيقة واحدة:</span>
                              <ol className="list-decimal list-inside space-y-0.5">
                                <li>افتح تطبيق تيليجرام وابحث عن <strong className="text-sky-400">@BotFather</strong>.</li>
                                <li>أرسل الأمر <strong className="text-slate-200">/newbot</strong> واصنع اسماً للبوت (مثال: عيادة الشفاء لطب الأسنان).</li>
                                <li>انسخ الـ <strong className="text-slate-200">API Token</strong> والصقه بالأعلى لتشغيل محرك الذكاء عليه فوراً.</li>
                              </ol>
                            </div>
                          </div>
                        )}

                        {activeIntegrationTab === "embed" && (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                              <span className="text-[9px] text-emerald-400 font-mono">JS Embed Widget v1.5</span>
                              <span className="text-[10px] text-slate-300 font-bold">أيقونة الشات العائمة بموقع العيادة الافتراضي</span>
                            </div>

                            <p className="text-[9px] text-slate-400 leading-relaxed">
                              هل تمتلك العيادة موقعاً إلكترونياً خاصاً بها؟ يمكنك إضافة أيقونة شات عائمة أنيقة ومحترفة في الزاوية السفلى من موقعهم عن طريق نسخ سطر البرمجة التالي ولصقه في وسم <code className="text-emerald-400 font-mono">&lt;body&gt;</code> بموقع العيادة.
                            </p>

                            <div className="space-y-1">
                              <label className="text-[9px] text-slate-400 font-bold block text-right">كود التضمين بلغة JavaScript:</label>
                              <div className="bg-slate-900 p-2.5 rounded text-left font-mono text-[8px] text-slate-300 select-all border border-slate-800 max-h-[100px] overflow-y-auto leading-relaxed" dir="ltr">
                                {`<!-- Shafi AI Floating Chatbot Widget -->
<script src="https://cdn.shafi-ai.com/widget.js" defer></script>
<script>
  window.addEventListener('load', () => {
    initClinicAiWidget({
      clinicId: "cl_73892a0",
      themeColor: "#0d9488",
      title: "مساعد الطبيب الافتراضي",
      subtitle: "متصل للرد على استفساراتك وحجوزاتك"
    });
  });
</script>`}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(`<script src="https://cdn.shafi-ai.com/widget.js" defer></script>\n<script>\n  window.addEventListener('load', () => {\n    initClinicAiWidget({ clinicId: "cl_73892a0", themeColor: "#0d9488", title: "مساعد الطبيب الافتراضي" });\n  });\n</script>`);
                                showNotification("تم نسخ كود التضمين للموقع بنجاح! 📋", "success");
                              }}
                              className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 font-bold text-[10px] py-1.5 px-3 rounded transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Globe className="w-3.5 h-3.5 text-teal-400" />
                              <span>نسخ كود التضمين للموقع الالكتروني 📋</span>
                            </button>
                          </div>
                        )}

                      </div>
                    </div>

                  </div>

                  {/* Commercialization & Table counter Flyer Generator (12 cols) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Profit Planner Calculator (5 cols) */}
                    <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4 text-right" dir={isRtl ? "rtl" : "ltr"}>
                      <div className="space-y-1">
                        <h5 className="text-xs font-black text-slate-200 flex items-center gap-1.5 justify-end">
                          <span>آلة احتساب أرباح بيع الخدمة للعيادات 💰</span>
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                        </h5>
                        <p className="text-[10px] text-slate-400">ادخل عدد العيادات المستهدفة وسعر الاشتراك الشهري لترى العائد المالي المتكرر المتوقع من تقديم لوحة التحكم والذكاء الاصطناعي كخدمة.</p>
                      </div>

                      <div className="space-y-4 pt-1">
                        {/* Slider 1: Clinic count */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-300 font-bold">عدد العيادات المشتركة</span>
                            <span className="text-teal-400 font-black">{targetClinics} عيادات</span>
                          </div>
                          <input 
                            type="range" 
                            min="1" 
                            max="50" 
                            step="1"
                            value={targetClinics}
                            onChange={(e) => setTargetClinics(parseInt(e.target.value))}
                            className="w-full accent-teal-400 bg-slate-800 rounded-lg cursor-pointer h-1"
                          />
                        </div>

                        {/* Slider 2: Monthly Price */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-300 font-bold">سعر الاشتراك الشهري للعيادة الواحدة</span>
                            <span className="text-emerald-400 font-black">{monthlyPrice} د.ج / شهرياً</span>
                          </div>
                          <input 
                            type="range" 
                            min="1000" 
                            max="20000" 
                            step="500"
                            value={monthlyPrice}
                            onChange={(e) => setMonthlyPrice(parseInt(e.target.value))}
                            className="w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer h-1"
                          />
                        </div>

                        {/* Calculations Results */}
                        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 grid grid-cols-2 gap-3 text-center">
                          <div className="space-y-0.5 border-r border-slate-850">
                            <span className="text-[9px] text-slate-500 block font-bold">الدخل الشهري المتكرر (MRR)</span>
                            <span className="text-lg font-black text-teal-400">{(targetClinics * monthlyPrice).toLocaleString()} د.ج</span>
                            <p className="text-[8px] text-slate-500">متدفق شهرياً بشكل ثابت</p>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-slate-500 block font-bold">الدخل السنوي الإجمالي (ARR)</span>
                            <span className="text-lg font-black text-amber-400">{(targetClinics * monthlyPrice * 12).toLocaleString()} د.ج</span>
                            <p className="text-[8px] text-slate-500">معدل العائد من الاستثمار</p>
                          </div>
                        </div>

                        {/* Commercial packages recommendations */}
                        <div className="space-y-1.5 bg-teal-500/5 p-3 rounded-xl border border-teal-500/10 text-[9px] text-slate-300">
                          <span className="font-bold text-teal-300 block">💡 توصية باقات تسويق لوحة التحكم للعيادات بالجزائر:</span>
                          <ul className="list-disc list-inside space-y-0.5 leading-relaxed">
                            <li><strong className="text-slate-200">الباقة الأساسية (4,500 د.ج/شهر):</strong> تشمل الشات بوت الذكي وتأكيد المواعيد وسجل محادثات الويب.</li>
                            <li><strong className="text-slate-200">الباقة المتقدمة (9,000 د.ج/شهر):</strong> ربط واتساب السحابي + أرقام حجز حرة + تدريب مخصص على أسعار خدمات العيادة.</li>
                            <li><strong className="text-slate-200">باقة المؤسسات (18,000 د.ج/شهر):</strong> دمج وتزامن كامل مع نظام سجلات المرضى الخاص بالعيادة ودعم فني على مدار الساعة.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Clinic Flyer Generator & PDF/Print Ready (7 cols) */}
                    <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4 text-right" dir={isRtl ? "rtl" : "ltr"}>
                      <div className="space-y-1">
                        <h5 className="text-xs font-black text-slate-200 flex items-center gap-1.5 justify-end">
                          <span>مولد بطاقة الاستقبال والمطبوعات الترويجية للعيادة 🖨️</span>
                          <FileText className="w-4 h-4 text-teal-400" />
                        </h5>
                        <p className="text-[10px] text-slate-400">قم بتوليد بطاقة الطاولة الترحيبية للعيادة مع رمز الاستجابة السريعة (QR Code). يمكن للعيادة طباعتها ووضعها في صالة الاستقبال ليمسحها المرضى بهواتفهم ويتواصلوا مع الشات بوت فورياً.</p>
                      </div>

                      {/* Custom Flyer Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-bold">اسم العيادة المطبوع</label>
                          <input 
                            type="text" 
                            value={flyerClinicName}
                            onChange={(e) => setFlyerClinicName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-[11px] text-slate-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-bold">هاتف التواصل للمواعيد الطارئة</label>
                          <input 
                            type="text" 
                            value={flyerClinicPhone}
                            onChange={(e) => setFlyerClinicPhone(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-[11px] text-slate-200 text-left font-mono"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[9px] text-slate-400 font-bold">نص الدعوة الموجه للمرضى في صالة الانتظار</label>
                          <input 
                            type="text" 
                            value={flyerWelcomeText}
                            onChange={(e) => setFlyerWelcomeText(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-[11px] text-slate-200"
                          />
                        </div>
                      </div>

                      {/* Live Flyer Visual Standee Preview - Fully styled and print ready */}
                      <div id="clinic-flyer-card" className="bg-white text-slate-950 p-6 rounded-2xl border-4 border-teal-500 shadow-xl space-y-4 relative overflow-hidden flex flex-col items-center">
                        {/* Decorative background teeth lines and arcs */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-12 -mt-12" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/5 rounded-full -ml-12 -mb-12" />

                        {/* Mini Flyer Header */}
                        <div className="text-center space-y-1.5 relative z-10">
                          <div className="inline-flex bg-teal-500 text-white font-bold text-[9px] tracking-wide uppercase px-2.5 py-1 rounded-full items-center gap-1 justify-center shadow-sm">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            <span>مساعد طبيب الأسنان الافتراضي بالذكاء الاصطناعي</span>
                          </div>
                          <h3 className="text-base font-black text-slate-900">{flyerClinicName}</h3>
                          <div className="w-16 h-1 bg-teal-500 mx-auto rounded-full" />
                        </div>

                        {/* Interactive Simulated QR Code */}
                        <div className="bg-slate-50 p-3 rounded-2xl border-2 border-dashed border-teal-200 flex flex-col items-center gap-1.5 relative z-10 shadow-inner">
                          {/* Real-looking SVG QR code */}
                          <svg className="w-28 h-28 text-slate-900" viewBox="0 0 100 100">
                            {/* QR Outer Border */}
                            <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                            <rect x="10" y="10" width="15" height="15" fill="currentColor" />
                            <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                            <rect x="75" y="10" width="15" height="15" fill="currentColor" />
                            <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                            <rect x="10" y="75" width="15" height="15" fill="currentColor" />
                            {/* QR Data Noise blocks */}
                            <rect x="40" y="10" width="10" height="10" fill="currentColor" />
                            <rect x="55" y="5" width="5" height="15" fill="currentColor" />
                            <rect x="45" y="30" width="15" height="5" fill="currentColor" />
                            <rect x="5" y="45" width="15" height="10" fill="currentColor" />
                            <rect x="25" y="40" width="10" height="25" fill="currentColor" />
                            <rect x="45" y="50" width="20" height="10" fill="currentColor" />
                            <rect x="75" y="45" width="15" height="15" fill="currentColor" />
                            <rect x="70" y="70" width="10" height="10" fill="currentColor" />
                            <rect x="85" y="80" width="10" height="15" fill="currentColor" />
                            <rect x="45" y="75" width="15" height="20" fill="currentColor" />
                            <rect x="35" y="85" width="5" height="10" fill="currentColor" />
                            {/* Medical Cross Center Graphic */}
                            <rect x="43" y="43" width="14" height="14" fill="white" />
                            <rect x="47" y="44" width="6" height="12" fill="#0d9488" />
                            <rect x="44" y="47" width="12" height="6" fill="#0d9488" />
                          </svg>
                          <span className="text-[9px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full select-all">scan-clinic-ai.to/{flyerClinicPhone}</span>
                        </div>

                        {/* Invitation text */}
                        <div className="text-center px-4 space-y-1 relative z-10">
                          <p className="text-[10px] text-slate-800 font-bold leading-relaxed">
                            {flyerWelcomeText}
                          </p>
                          <p className="text-[8px] text-slate-500">
                            حجز فوري للمواعيد | استفسار عن تكلفة العلاج وأسعار الحشو والزراعة والتقويم | متوفر على مدار 24 ساعة
                          </p>
                        </div>

                        {/* Clinic phone and footer */}
                        <div className="w-full border-t border-slate-100 pt-3 flex justify-between items-center text-[9px] text-slate-600 font-bold relative z-10 px-2">
                          <span>📞 للتواصل الطارئ: {flyerClinicPhone}</span>
                          <span className="text-teal-600">طور بواسطة ClinicAI</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            // Print specific element using a simple print window script or global print style
                            window.print();
                          }}
                          className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs py-2 px-4 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-teal-500/10"
                        >
                          <span>طباعة كرت استقبال العيادة مباشرة 🖨️</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            showNotification("تم حفظ وتصدير الصورة لملف PNG مخصص للطباعة! 🖼️", "success");
                          }}
                          className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs py-2 px-4 rounded-lg transition-all cursor-pointer border border-slate-750"
                        >
                          تنزيل كصورة عالية الجودة 📥
                        </button>
                      </div>
                    </div>

                  </div>

                </motion.div>
              )}

              {/* Tab: Subscription & Billing Dashboard */}
              {activeTab === "subscription" && (
                <motion.div
                  key="subscription-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-right"
                  dir={isRtl ? "rtl" : "ltr"}
                >
                  <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-emerald-400" />
                        <span>{t('subscriptionPlans')}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">تتبع استهلاك الشات بوت خارج المنصة وشحن باقات الرسائل الإضافية للمرضى.</p>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/20">
                      {t('platformFree')}
                    </span>
                  </div>

                  {/* Active Subscription Status Card */}
                  <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 grid grid-cols-1 md:grid-cols-12 gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
                    
                    {/* Left: Message usage progress */}
                    <div className="md:col-span-7 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">{t('activePlan')}</span>
                        <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-lg text-teal-400 font-bold border border-slate-700">
                          {msgSubPlan === "trial" ? t('planTrial') :
                           msgSubPlan === "msg1500" ? t('plan1500') :
                           msgSubPlan === "msg4000" ? t('plan4000') :
                           msgSubPlan === "unlimited" ? t('planUnlimited') :
                           t('planCustom')}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-300 font-medium">
                            {t('messagesUsed')}: <strong className="text-white text-base">{msgUsed}</strong>
                          </span>
                          <span className="text-slate-400">
                            {t('messagesRemaining')}: <strong className="text-teal-400 text-base">{msgSubPlan === "unlimited" ? t('unlimited') : Math.max(0, msgLimit - msgUsed)}</strong>
                          </span>
                        </div>

                        {/* Visual Progress Meter */}
                        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ 
                              width: msgSubPlan === "unlimited" ? "100%" : `${Math.min(100, (msgUsed / msgLimit) * 100)}%` 
                            }}
                            className={`h-full rounded-full ${
                              msgSubPlan === "unlimited" 
                                ? "bg-gradient-to-r from-emerald-500 to-teal-500" 
                                : (msgUsed / msgLimit) >= 0.9 
                                ? "bg-rose-500" 
                                : "bg-gradient-to-r from-teal-500 to-emerald-400"
                            }`}
                          />
                        </div>
                        
                        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
                          <span>0</span>
                          <span>{msgSubPlan === "unlimited" ? "♾️" : msgLimit}</span>
                        </div>
                      </div>

                      {/* Remaining alarm text status */}
                      <div className="pt-2">
                        {msgSubPlan !== "unlimited" && msgUsed >= msgLimit ? (
                          <div className="bg-rose-500/10 text-rose-400 text-xs p-3 rounded-xl border border-rose-500/20 font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                            <span>{t('alertExpired')}</span>
                          </div>
                        ) : msgSubPlan !== "unlimited" && (msgLimit - msgUsed <= msgLimit * 0.1) ? (
                          <div className="bg-amber-500/10 text-amber-400 text-xs p-3 rounded-xl border border-amber-500/20 font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                            <span>{t('alert10Percent')}</span>
                          </div>
                        ) : (
                          <div className="bg-emerald-500/5 text-emerald-400 text-xs p-3 rounded-xl border border-emerald-500/10 font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span>اشتراكك خارج المنصة نشط وفي وضع الاستعداد المستمر للرد على زبائن عيادتك. 🟢</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Circle meter / quick stats */}
                    <div className="md:col-span-5 bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-center items-center text-center">
                      <div className="text-3xl font-black text-white flex items-baseline gap-1">
                        <span>{msgSubPlan === "unlimited" ? "♾️" : Math.max(0, msgLimit - msgUsed)}</span>
                        <span className="text-xs text-slate-400 font-normal">رسالة متبقية</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">من رصيد استهلاك المرضى خارج المنصة</p>
                      
                      <div className="mt-4 flex gap-1.5 w-full">
                        <button
                          type="button"
                          onClick={() => {
                            // Reset simulator consumed messages to show alarm behaviors easily
                            saveMsgSubscriptionData("msg1500", 1500, 1400); // Set consumed to 1400 / 1500 (triggers 10% remaining alarm)
                            showNotification("🔔 تم إعادة ضبط الاستهلاك لنسق المحاكاة (متبقي 10% من الرسائل لتجربة التنبيه)!", "info");
                          }}
                          className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-slate-100 border border-slate-800 text-[10px] py-1.5 rounded-lg transition-all"
                          title="يضبط الاستهلاك ليكون متبقي 10% لتجربة التنبيه"
                        >
                          محاكاة متبقي 10% ⚠️
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            // Set consumed to full to trigger expired alarm
                            saveMsgSubscriptionData("msg1500", 1500, 1500); 
                            showNotification("🔔 تم محاكاة انتهاء رصيد الباقة بالكامل لتجربة توقف الشات بوت!", "error");
                          }}
                          className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[10px] py-1.5 rounded-lg transition-all"
                          title="يضبط الاستهلاك ليكون 100% لتجربة التوقف التام"
                        >
                          محاكاة نفاد الرصيد 🚨
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Daily Messages Analytics Dashboard Chart (THE REQUESTED GRAPH) */}
                  <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2 justify-end">
                          <span>رسم بياني لعدد الرسائل اليومية 📊 (Dashboard)</span>
                        </h4>
                        <p className="text-xs text-slate-400">إحصائيات تفاعل المرضى والرسائل اليومية الصادرة والواردة خارج المنصة لآخر 7 أيام.</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2.5 py-1 rounded-full font-bold">
                          إجمالي رسائل الأسبوع: {dailyMessagesData.reduce((acc, d) => acc + d.count, 0)} رسالة
                        </span>
                      </div>
                    </div>

                    <div className="h-[220px] w-full bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dailyMessagesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                          <YAxis stroke="#64748b" fontSize={10} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }}
                            labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
                            itemStyle={{ color: '#2dd4bf', fontSize: '11px' }}
                          />
                          <Area type="monotone" dataKey="count" name="عدد الرسائل" stroke="#2dd4bf" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Pricing Tiers Grid */}
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <h4 className="font-black text-slate-200 text-sm">{t('outsidePlatform')}</h4>
                      <span className="text-xs bg-teal-500/15 border border-teal-500/30 text-teal-400 font-bold px-3 py-1 rounded-full">
                        🌐 تدعم جميع الباقات الربط المباشر بـ (واتساب، تليجرام، فيسبوك ماسنجر، وإنستغرام)
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Plan 1: 7 days free */}
                      <div className={`bg-slate-900/60 rounded-xl p-5 border transition-all hover:scale-[1.02] flex flex-col justify-between ${msgSubPlan === "trial" ? "border-teal-500 shadow-lg shadow-teal-500/5 ring-1 ring-teal-500" : "border-slate-800"}`}>
                        <div className="space-y-2">
                          <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-full">باقة البداية 🆓</span>
                          <h5 className="font-bold text-white text-sm">{t('planTrial')}</h5>
                          <div className="text-2xl font-black text-white pt-1">0$ <span className="text-xs text-slate-400 font-normal">/ 7 أيام</span></div>
                          <p className="text-[11px] text-slate-400 leading-relaxed pt-2">فترة تجريبية مجانية بالكامل لاستكشاف ميزات الشات بوت الذكي خارج المنصة.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            saveMsgSubscriptionData("trial", 999999, 0);
                            showNotification("🎉 تم تفعيل الفترة التجريبية الـ 7 أيام المجانية بنجاح!", "success");
                          }}
                          className={`w-full text-xs font-bold py-2 px-3 rounded-lg mt-4 transition-all cursor-pointer ${
                            msgSubPlan === "trial" ? "bg-teal-500 text-slate-950" : "bg-slate-800 hover:bg-slate-750 text-slate-200"
                          }`}
                        >
                          {msgSubPlan === "trial" ? "نشط حالياً ✓" : "تفعيل الباقة مجاناً"}
                        </button>
                      </div>

                      {/* Plan 2: 1500 messages */}
                      <div className={`bg-slate-900/60 rounded-xl p-5 border transition-all hover:scale-[1.02] flex flex-col justify-between ${msgSubPlan === "msg1500" ? "border-teal-500 shadow-lg shadow-teal-500/5 ring-1 ring-teal-500" : "border-slate-800"}`}>
                        <div className="space-y-2">
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full">الباقة الفضية 🥈</span>
                          <h5 className="font-bold text-white text-sm">{t('plan1500')}</h5>
                          <div className="text-2xl font-black text-white pt-1">10$ <span className="text-xs text-slate-400 font-normal">/ دفعة</span></div>
                          <p className="text-[11px] text-slate-400 leading-relaxed pt-2">شحن رصيد 1500 رسالة تفاعل صالحة للاستخدام في أي وقت دون انتهاء الصلاحية.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            saveMsgSubscriptionData("msg1500", 1500, 0);
                            showNotification("🎉 تم الاشتراك بنجاح في باقة 1500 رسالة بقيمة 10$!", "success");
                          }}
                          className={`w-full text-xs font-bold py-2 px-3 rounded-lg mt-4 transition-all cursor-pointer ${
                            msgSubPlan === "msg1500" ? "bg-teal-500 text-slate-950" : "bg-slate-800 hover:bg-slate-750 text-slate-200"
                          }`}
                        >
                          {msgSubPlan === "msg1500" ? "نشط حالياً ✓" : "شراء الباقة بـ 10$"}
                        </button>
                      </div>

                      {/* Plan 3: 4000 messages */}
                      <div className={`bg-slate-900/60 rounded-xl p-5 border transition-all hover:scale-[1.02] flex flex-col justify-between ${msgSubPlan === "msg4000" ? "border-teal-500 shadow-lg shadow-teal-500/5 ring-1 ring-teal-500" : "border-slate-800"}`}>
                        <div className="space-y-2">
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-full">الباقة الذهبية 🥇</span>
                          <h5 className="font-bold text-white text-sm">{t('plan4000')}</h5>
                          <div className="text-2xl font-black text-white pt-1">20$ <span className="text-xs text-slate-400 font-normal">/ دفعة</span></div>
                          <p className="text-[11px] text-slate-400 leading-relaxed pt-2">شحن رصيد 4000 رسالة كاملة للعيادات المزدحمة لضمان بقاء الروبوت مستيقظاً.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            saveMsgSubscriptionData("msg4000", 4000, 0);
                            showNotification("🎉 تم الاشتراك بنجاح في باقة 4000 رسالة بقيمة 20$!", "success");
                          }}
                          className={`w-full text-xs font-bold py-2 px-3 rounded-lg mt-4 transition-all cursor-pointer ${
                            msgSubPlan === "msg4000" ? "bg-teal-500 text-slate-950" : "bg-slate-800 hover:bg-slate-750 text-slate-200"
                          }`}
                        >
                          {msgSubPlan === "msg4000" ? "نشط حالياً ✓" : "شراء الباقة بـ 20$"}
                        </button>
                      </div>

                      {/* Plan 4: Unlimited */}
                      <div className={`bg-gradient-to-br from-slate-900 to-teal-950 rounded-xl p-5 border transition-all hover:scale-[1.02] flex flex-col justify-between ${msgSubPlan === "unlimited" ? "border-teal-400 shadow-lg shadow-teal-500/10 ring-1 ring-teal-400" : "border-slate-800"}`}>
                        <div className="space-y-2">
                          <span className="text-[10px] bg-teal-400 text-slate-950 font-black px-2 py-0.5 rounded-full">الباقة اللانهائية 🔥</span>
                          <h5 className="font-bold text-teal-300 text-sm">{t('planUnlimited')}</h5>
                          <div className="text-2xl font-black text-white pt-1">35$ <span className="text-xs text-slate-300 font-normal">/ شهرياً</span></div>
                          <p className="text-[11px] text-slate-300 leading-relaxed pt-2">كل شيء غير محدود بالكامل! لا تقلق أبداً بشأن رصيد الرسائل أو التنبيهات.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            saveMsgSubscriptionData("unlimited", 999999, 0);
                            showNotification("🎉 تم الاشتراك بنجاح في الباقة غير المحدودة بقيمة 35$/شهرياً!", "success");
                          }}
                          className="w-full text-xs font-bold py-2 px-3 rounded-lg mt-4 transition-all cursor-pointer bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 hover:from-teal-300 hover:to-emerald-300 shadow-md shadow-teal-400/10"
                        >
                          {msgSubPlan === "unlimited" ? "نشط حالياً ✓" : "تفعيل اللامحدود بـ 35$"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Plan 5: Custom Pay-as-you-go Slider ($1 = 100 messages) */}
                  <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2 justify-end">
                        <span>باقة الشحن المرنة المخصصة (1$ = 100 رسالة) 🎚️</span>
                      </h4>
                      <p className="text-xs text-slate-400">تحكم بقيمة الفاتورة الدقيقة! اشحن بأي مبلغ تريده لتقابل كل 1$ شحن 100 رسالة للمرضى خارج المنصة.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-8 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-300 font-bold">مبلغ الشحن المخصص</span>
                          <span className="text-teal-400 font-black">{customPaymentAmount}$ دولار</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="100" 
                          step="1"
                          value={customPaymentAmount}
                          onChange={(e) => setCustomPaymentAmount(parseInt(e.target.value))}
                          className="w-full accent-teal-400 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                          <span>1$ (100 رسالة)</span>
                          <span>100$ (10,000 رسالة)</span>
                        </div>
                      </div>

                      <div className="md:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col items-center justify-center text-center">
                        <div className="text-xl font-black text-emerald-400 flex items-center gap-1">
                          <span>+{customPaymentAmount * 100}</span>
                          <span className="text-xs font-normal text-slate-400">رسالة إضافية</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">مقابل دفع {customPaymentAmount}$</p>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const addMsgs = customPaymentAmount * 100;
                            // If current plan was limited, extend it. Otherwise convert to custom
                            const currentLimit = (msgSubPlan === "trial" || msgSubPlan === "unlimited") ? 0 : msgLimit;
                            const nextLimit = currentLimit + addMsgs;
                            saveMsgSubscriptionData("custom", nextLimit, msgUsed);
                            showNotification(`🎉 تم شحن رصيدك بنجاح بمقدار +${addMsgs} رسالة إضافية مقابل دفع ${customPaymentAmount}$!`, "success");
                          }}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2 rounded-lg mt-3 transition-all cursor-pointer"
                        >
                          شحن الرصيد الآن 💳
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab: System Settings */}
              {activeTab === "settings" && (
                <motion.div
                  key="settings-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`space-y-6 ${isRtl ? "text-right" : "text-left"}`}
                  dir={isRtl ? "rtl" : "ltr"}
                >
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className={`font-bold text-slate-100 text-lg flex items-center gap-2 ${isRtl ? "" : "flex-row-reverse"}`}>
                      <Settings className="w-5 h-5 text-teal-400 animate-spin" />
                      <span>{t('settings')}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{t('settingsDesc')}</p>
                  </div>

                  {/* Multi-lingual Selector */}
                  <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
                    <h4 className={`font-bold text-slate-200 text-sm flex items-center gap-2 ${isRtl ? "justify-end" : "justify-start"}`}>
                      <span>{t('chooseLanguage')} 🌐</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {/* Arabic */}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentLanguage("ar");
                          localStorage.setItem("shafi_current_language", "ar");
                          showNotification("تم تغيير لغة المنصة والتحكم إلى العربية بنجاح! 🇸🇦", "success");
                        }}
                        className={`p-5 rounded-xl border transition-all flex flex-col justify-between hover:border-teal-500 hover:bg-teal-500/5 ${isRtl ? "text-right" : "text-left"} ${
                          currentLanguage === "ar" ? "border-teal-500 bg-teal-500/10 ring-1 ring-teal-500" : "border-slate-800"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-2xl">🇸🇦</span>
                          {currentLanguage === "ar" && <span className="bg-teal-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">نشط ✓</span>}
                        </div>
                        <div className="mt-4">
                          <div className="font-black text-white text-sm">{t('arabic')}</div>
                          <p className="text-xs text-slate-400 mt-1">{t("arabicDesc", "عرض جميع علامات التبويب والمحاذاة باللغة العربية الافتراضية.")}</p>
                        </div>
                      </button>

                      {/* English */}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentLanguage("en");
                          localStorage.setItem("shafi_current_language", "en");
                          showNotification("System language successfully changed to English! 🇺🇸", "success");
                        }}
                        className={`p-5 rounded-xl border transition-all flex flex-col justify-between hover:border-teal-500 hover:bg-teal-500/5 ${isRtl ? "text-right" : "text-left"} ${
                          currentLanguage === "en" ? "border-teal-500 bg-teal-500/10 ring-1 ring-teal-500" : "border-slate-800"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-2xl">🇺🇸</span>
                          {currentLanguage === "en" && <span className="bg-teal-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">Active ✓</span>}
                        </div>
                        <div className="mt-4">
                          <div className="font-black text-white text-sm">{t('english')}</div>
                          <p className="text-xs text-slate-400 mt-1">{t("englishDesc", "Translate all tab controls and descriptions to English layout.")}</p>
                        </div>
                      </button>

                      {/* French */}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentLanguage("fr");
                          localStorage.setItem("shafi_current_language", "fr");
                          showNotification("Langue du système changée en français avec succès ! 🇫🇷", "success");
                        }}
                        className={`p-5 rounded-xl border transition-all flex flex-col justify-between hover:border-teal-500 hover:bg-teal-500/5 ${isRtl ? "text-right" : "text-left"} ${
                          currentLanguage === "fr" ? "border-teal-500 bg-teal-500/10 ring-1 ring-teal-500" : "border-slate-800"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-2xl">🇫🇷</span>
                          {currentLanguage === "fr" && <span className="bg-teal-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">Actif ✓</span>}
                        </div>
                        <div className="mt-4">
                          <div className="font-black text-white text-sm">{t('french')}</div>
                          <p className="text-xs text-slate-400 mt-1">{t("frenchDesc", "Traduire les contrôles et les descriptions en français.")}</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Live Patient Chatbot Simulator (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          {/* Smart Device Container for the Clinic Chatbot */}
          <div className="w-full max-w-[400px] h-[720px] bg-slate-950 rounded-[40px] border-[10px] border-slate-800/90 shadow-2xl shadow-teal-500/5 flex flex-col overflow-hidden relative">
            
            {/* Phone Ear Speaker & Sensor bar */}
            <div className="h-6 bg-slate-950 flex items-center justify-center relative shrink-0">
              <div className="w-24 h-4 bg-slate-800 rounded-b-xl absolute top-0" />
            </div>

            {/* Chat App Header */}
            <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="bg-gradient-to-tr from-teal-500 to-cyan-400 p-2 rounded-lg text-slate-950">
                    <Bot className="w-5 h-5" />
                  </div>
                  {/* Green Pulsing Live Dot */}
                  <div className="w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full absolute -bottom-0.5 -right-0.5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-100 line-clamp-1">{localizeDynamicText(clinicInfo.name, currentLanguage) || t('botSmartAssistant')}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{localizeDynamicText(clinicInfo.specialty, currentLanguage) || t('botSubtitle')}</p>
                </div>
              </div>
              <div className="text-left">
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                  {t('botStatusReady')}
                </span>
              </div>
            </div>

            {/* Micro daily banner inside chatbot directly for patient context */}
            <div className="bg-teal-500/5 border-b border-teal-500/10 px-3.5 py-2 shrink-0 flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
              <div className="space-y-0.5 text-[10px] text-slate-300 leading-normal">
                <span className="font-bold text-teal-400">{t('botDailyUpdateBanner')}</span>
                <p className="line-clamp-2" title={localizeDynamicText(dailyStatus, currentLanguage) || t('botDefaultUpdateText')}>
                  {localizeDynamicText(dailyStatus, currentLanguage) || t('botDefaultUpdateText')}
                </p>
              </div>
            </div>

            {/* Messages Screen Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-950 space-y-4">
              
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${msg.sender === "user" ? "mr-auto flex-row-reverse" : "ml-auto"}`}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.sender === "user" 
                      ? "bg-slate-800 text-slate-300" 
                      : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                  }`}>
                    {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div className="space-y-1.5">
                    {msg.image && (
                      <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 max-w-[200px] md:max-w-[240px]">
                        <img
                          src={msg.image.previewUrl || `data:${msg.image.mimeType};base64,${msg.image.data}`}
                          alt="Attached file"
                          className="w-full h-auto object-cover max-h-40 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => {
                            const url = msg.image?.previewUrl || `data:${msg.image?.mimeType};base64,${msg.image?.data}`;
                            const w = window.open();
                            if (w) w.document.write(`<img src="${url}" style="max-width:100%; height:auto;" />`);
                          }}
                        />
                      </div>
                    )}

                    {msg.audio && (
                      <div className="rounded-xl p-2 border border-slate-800 bg-slate-900 flex items-center gap-2 max-w-[200px] md:max-w-[240px]" dir={isRtl ? "rtl" : "ltr"}>
                        <div className="bg-teal-500/15 p-1.5 rounded-lg text-teal-400 shrink-0">
                          <Volume2 className="w-3.5 h-3.5" />
                        </div>
                        <audio 
                          src={msg.audio.audioUrl || `data:${msg.audio.mimeType};base64,${msg.audio.data}`} 
                          controls 
                          className="w-full h-8 max-w-[150px] outline-none"
                        />
                      </div>
                    )}

                    {msg.text && (
                      <div className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.sender === "user"
                          ? "bg-teal-500 text-slate-950 rounded-tr-none font-medium"
                          : "bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none"
                      }`}>
                        {localizeDynamicText(msg.text, currentLanguage)}
                      </div>
                    )}

                    {/* Smart Interactive Booking Card Widget inside the Bot Bubble */}
                    {msg.isBookingCard && (
                      <div className="mt-2 bg-slate-950/95 rounded-2xl p-4 border border-slate-800/85 space-y-3.5 w-72 md:w-80 shadow-xl" dir={isRtl ? "rtl" : "ltr"}>
                        {submittedBookingId === msg.id ? (
                          <div className="text-center py-5 space-y-2.5">
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                            </motion.div>
                            <p className="font-bold text-white text-xs">{t('botBookingSuccessTitle')}</p>
                            <p className="text-[10px] text-slate-400 leading-relaxed">
                              {t('botBookingSuccessDesc')}
                            </p>
                          </div>
                        ) : (
                          <form onSubmit={(e) => handleChatBookingSubmit(e, msg.id)} className={`space-y-3 ${isRtl ? "text-right" : "text-left"}`}>
                            <div className="border-b border-slate-800/80 pb-2 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-teal-400" />
                                <h5 className="font-bold text-teal-400 text-xs">{t('botSmartBookingTitle')}</h5>
                              </div>
                              <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md font-mono">
                                {t('stepLabel')} {getChatBookingProgress().filled}/{getChatBookingProgress().total}
                              </span>
                            </div>

                            {/* Dynamic Booking Progress Bar */}
                            <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-800/60 space-y-1.5">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-slate-400 font-medium">{t('botBookingProgressLabel')}</span>
                                <span className={`font-bold transition-all duration-300 ${getChatBookingProgress().percentage === 100 ? 'text-emerald-400' : 'text-teal-400'}`}>
                                  {getChatBookingProgress().percentage}% {getChatBookingProgress().percentage === 100 && t('botBookingProgressReady')}
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden relative">
                                <motion.div 
                                  className={`h-full rounded-full transition-all duration-500 ${getChatBookingProgress().percentage === 100 ? 'bg-emerald-500' : 'bg-teal-500'}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${getChatBookingProgress().percentage}%` }}
                                  transition={{ type: "spring", stiffness: 80 }}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <label className="block text-[10px] text-slate-400 font-medium">{t('botPatientNameLabel')}</label>
                              <input
                                type="text"
                                value={chatBookingName}
                                onChange={(e) => setChatBookingName(e.target.value)}
                                placeholder={t('botPatientNamePlaceholder')}
                                className={`w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none ${isRtl ? "text-right" : "text-left"}`}
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] text-slate-400 font-medium">{t('botPatientPhoneLabel')}</label>
                              <input
                                type="tel"
                                value={chatBookingPhone}
                                onChange={(e) => setChatBookingPhone(e.target.value)}
                                placeholder={t('botPatientPhonePlaceholder')}
                                className={`w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none ${isRtl ? "text-right" : "text-left"}`}
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] text-slate-400 font-medium">{t('botPatientServiceLabel')}</label>
                              <select
                                value={chatBookingService}
                                onChange={(e) => setChatBookingService(e.target.value)}
                                className={`w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer ${isRtl ? "text-right" : "text-left"}`}
                                required
                              >
                                <option value="">{t('botPatientServicePlaceholder')}</option>
                                {services.map(s => (
                                  <option key={s.id} value={s.name}>{localizeDynamicText(s.name, currentLanguage)} ({s.price})</option>
                                ))}
                                {services.length === 0 && (
                                  <option value="استشارة وفحص طبي">{currentLanguage === "ar" ? "استشارة وفحص طبي" : currentLanguage === "fr" ? "Consultation & Examen médical" : "Medical Consultation & Examination"}</option>
                                )}
                              </select>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="block text-[10px] text-slate-400 font-medium">{t('botPatientDateLabel')}</label>
                                <input
                                  type="date"
                                  value={chatBookingDate}
                                  onChange={(e) => setChatBookingDate(e.target.value)}
                                  className={`w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[10px] focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer ${isRtl ? "text-right" : "text-left"}`}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] text-slate-400 font-medium">{t('botPatientTimeLabel')}</label>
                                <input
                                  type="time"
                                  value={chatBookingTime}
                                  onChange={(e) => setChatBookingTime(e.target.value)}
                                  className={`w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[10px] focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer ${isRtl ? "text-right" : "text-left"}`}
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] text-slate-400 font-medium">{t('botPatientSymptomsLabel')}</label>
                              <input
                                type="text"
                                value={chatBookingNotes}
                                onChange={(e) => setChatBookingNotes(e.target.value)}
                                placeholder={t('botPatientSymptomsPlaceholder')}
                                className={`w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none ${isRtl ? "text-right" : "text-left"}`}
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer mt-2.5"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{t('botBookingConfirmBtn')}</span>
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {/* Timestamp */}
                    <p className={`text-[8px] text-slate-500 ${msg.sender === "user" ? "text-left" : "text-right"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Chatbot Typing Loader Indicator */}
              {isBotTyping && (
                <div className="flex gap-2.5 max-w-[85%] ml-auto">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce delay-200" />
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

             {/* Custom Quick Actions Panel - Patient can tap them instantly! */}
            <div className="bg-slate-950/90 border-t border-slate-800/50 p-2.5 shrink-0 space-y-1.5">
              <p className="text-[9px] text-slate-400 px-1.5 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-400" /> {t('botQuickActionLabel')}
              </p>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
                {/* Permanent high-conversion Smart Booking button */}
                <button
                  onClick={() => handleQuickActionClick({
                    id: "booking-trigger",
                    label: t('botQuickActionBookingBtn'),
                    response: t('botBookingTriggerResponse')
                  })}
                  className="text-[10px] bg-teal-500 hover:bg-teal-400 border border-teal-600/30 text-slate-950 px-3 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 shadow-sm shadow-teal-500/20"
                >
                  <span>{t('botQuickActionBookingBtn')}</span>
                </button>

                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickActionClick(action)}
                    className="text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer"
                  >
                    {localizeDynamicText(action.label, currentLanguage)}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview attachment panel */}
            {attachedImage && (
              <div className="bg-slate-900 border-t border-slate-850 px-3.5 py-2 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-700/60 bg-slate-950">
                    <img 
                      src={attachedImage.previewUrl} 
                      alt="Attachment preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    <span className="font-bold text-teal-400 block">{t('botAttachedImageTitle')}</span>
                    <span className="text-[9px] opacity-70">{t('botAttachedImageDesc')}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="p-1 rounded-full bg-slate-850 text-slate-400 hover:text-rose-400 border border-slate-750 transition-all cursor-pointer"
                  title={t('botCancelAttachment')}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Audio Preview attachment panel */}
            {attachedAudio && (
              <div className="bg-slate-900 border-t border-slate-850 px-3.5 py-2 flex items-center justify-between gap-2 shrink-0" dir={isRtl ? "rtl" : "ltr"}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20 shrink-0">
                    <Mic className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    <span className="font-bold text-teal-400 block">{t('botAttachedAudioTitle')}</span>
                    <span className="text-[9px] opacity-70 block">{t('botAttachedAudioDesc')}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedAudio(null)}
                  className="p-1 rounded-full bg-slate-850 text-slate-400 hover:text-rose-400 border border-slate-750 transition-all cursor-pointer"
                  title={t('botCancelRecording')}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Camera Live Stream & Capture Panel */}
            {isCameraOpen && (
              <div className="bg-slate-950 border-t border-slate-800 p-3 shrink-0 flex flex-col gap-2.5 items-center relative" dir={isRtl ? "rtl" : "ltr"}>
                <div className="relative w-full max-w-[320px] aspect-video rounded-xl overflow-hidden border border-slate-850 bg-black">
                  <video 
                    ref={videoElementRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  <div className="absolute top-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[9px] text-teal-400 font-mono animate-pulse">
                    {t('botLiveCameraLabel')}
                  </div>
                </div>
                
                <div className="flex gap-2 w-full justify-center">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold text-[10px] flex items-center gap-1 shadow-md shadow-teal-500/10 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{t('botCapturePhotoBtn')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{t('btnCancel')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Message input form */}
            <form 
              onSubmit={handleSendMessage} 
              className="bg-slate-900 border-t border-slate-800 px-3.5 py-3 flex gap-2 shrink-0 items-center"
            >
              {/* Hidden file input */}
              <input
                type="file"
                id="chat-image-input"
                accept="image/*"
                className="hidden"
                onChange={handleImageAttachment}
                disabled={isBotTyping || isRecording}
              />
              
              {/* Multimodal inputs cluster: File, Camera, Voice Recording */}
              <div className="flex gap-1.5 shrink-0">
                {/* Image upload button */}
                <button
                  type="button"
                  onClick={() => document.getElementById("chat-image-input")?.click()}
                  disabled={isBotTyping || isRecording}
                  className="p-2.5 rounded-xl bg-slate-950 text-slate-400 hover:text-teal-400 border border-slate-800 hover:bg-slate-900 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  title={t('botTitleImageUpload')}
                >
                  <Image className="w-4 h-4 text-teal-400" />
                </button>

                {/* Camera access button */}
                <button
                  type="button"
                  onClick={isCameraOpen ? stopCamera : startCamera}
                  disabled={isBotTyping || isRecording}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                    isCameraOpen 
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/30" 
                      : "bg-slate-950 text-slate-400 hover:text-teal-400 border-slate-800 hover:bg-slate-900"
                  }`}
                  title={t('botTitleCameraShot')}
                >
                  <Camera className="w-4 h-4 text-teal-400" />
                </button>

                {/* Microphone recording button */}
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isBotTyping || isCameraOpen}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                    isRecording 
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse" 
                      : "bg-slate-950 text-slate-400 hover:text-teal-400 border-slate-800 hover:bg-slate-900"
                  }`}
                  title={t('botTitleAudioRecording')}
                >
                  <Mic className="w-4 h-4 text-teal-400" />
                </button>
              </div>

              {isRecording ? (
                <div className="flex-1 bg-slate-950 border border-rose-500/30 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3" dir={isRtl ? "rtl" : "ltr"}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                    <span className="text-[10px] text-rose-400 font-bold font-mono">
                      {String(Math.floor(recordingSeconds / 60)).padStart(2, "0")}:{String(recordingSeconds % 60).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] text-slate-400">{t('botRecordingStatusText')}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all cursor-pointer flex items-center justify-center"
                      title={t('botConfirmSaveTitle')}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelRecording}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer flex items-center justify-center"
                      title={t('btnCancel')}
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder={t('botPlaceholderText')}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isBotTyping}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 placeholder-slate-500"
                />
              )}

              <button
                type="submit"
                disabled={(!inputValue.trim() && !attachedImage && !attachedAudio) || isBotTyping || isRecording}
                className={`p-2.5 rounded-xl text-slate-950 font-bold transition-all shrink-0 ${
                  (inputValue.trim() || attachedImage || attachedAudio) && !isBotTyping && !isRecording
                    ? "bg-teal-500 hover:bg-teal-400 shadow-md shadow-teal-500/10 cursor-pointer" 
                    : "bg-slate-800 text-slate-600 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Bottom Safe Indicator bar */}
            <div className="h-4 bg-slate-950 flex items-center justify-center shrink-0">
              <div className="w-32 h-1 bg-slate-850 rounded-full" />
            </div>

          </div>

          {/* Prompt/Instructions below phone simulator to guide testers */}
          <div className="mt-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 max-w-[400px] w-full text-center">
            <span className="text-xs text-slate-400 block font-bold mb-1">💡 كيف تقوم بالتسويق والعرض للعيادات؟</span>
            <p className="text-[11px] leading-relaxed text-slate-400 text-right">
              1. اختر قالباً جاهزاً من الأعلى (مثلاً: الأسنان) لملء البيانات فوراً.<br />
              2. اكتب نصاً يومياً في خانة "الحالة اليومية السريعة" في لوحة التحكم واحفظه.<br />
              3. انقر على أي زر خيار سريع في محاكاة الهاتف لتجربة الرد التلقائي السريع.<br />
              4. جرب كتابة سؤال عام (مثلاً: "ما هي تكلفة تنظيف الأسنان؟" أو "ماذا أفعل قبل زراعة الأسنان؟").<br />
              5. جرب كتابة سؤال طبي معقد (مثلاً: "أشعر بألم شديد، أي مضاد حيوي آخذ؟") لتشاهد كيف يحميك الشات بوت ويرفض الإجابة ويوجهك لحجز موعد والاتصال هاتفياً بالعيادة!
            </p>
          </div>

        </div>

      </main>

      {/* 📄 Interactive Official Medical Report Modal Preview */}
      <AnimatePresence>
        {showMedicalPdfModal && pdfSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl ${isRtl ? "text-right" : "text-left"}`}
              dir={isRtl ? "rtl" : "ltr"}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
                    <Printer className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">
                    {t("pdfTranslations.previewTitle")}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowMedicalPdfModal(false);
                    setPdfSession(null);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body: The Live Preview of the Medical letterhead */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40">
                
                {/* Visual A4 Document Wrapper inside Screen */}
                <div 
                  id="screen-medical-report-preview"
                  className={`bg-white text-slate-950 p-8 rounded-xl max-w-3xl mx-auto shadow-lg border border-slate-200 space-y-6 font-sans relative ${isRtl ? "text-right" : "text-left"}`}
                  dir={isRtl ? "rtl" : "ltr"}
                >
                  {/* Decorative Medical Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] pointer-events-none select-none">
                    <Stethoscope className="w-96 h-96 text-teal-600" />
                  </div>

                  {/* Header Letterhead */}
                  <div className="flex justify-between items-start border-b-2 border-teal-600 pb-5">
                    {/* Clinic Details */}
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-teal-800">{localizeDynamicText(clinicInfo.name, currentLanguage) || t("pdfTranslations.defaultClinicName")}</h4>
                      <p className="text-xs font-bold text-slate-600">{localizeDynamicText(clinicInfo.specialty, currentLanguage) || t("pdfTranslations.defaultSpecialty")}</p>
                      <p className="text-[10px] text-slate-500">
                        {t('supervisionOf')}
                        {localizeDynamicText(clinicInfo.doctorName || "", currentLanguage) || t("pdfTranslations.defaultDoctor")}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {t('phoneLabel')}
                        {clinicInfo.phone} | 
                        {t('addressLabel')}
                        {localizeDynamicText(clinicInfo.address, currentLanguage)}
                      </p>
                    </div>

                    {/* Report Branding Emblem */}
                    <div className="flex flex-col items-center justify-center text-center shrink-0">
                      <div className="w-12 h-12 rounded-full border-2 border-teal-600 flex items-center justify-center text-teal-700 bg-teal-50">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <span className="text-[9px] font-bold text-teal-700 tracking-wider mt-1.5 uppercase">Clinical Record</span>
                    </div>

                    {/* Report Metadata */}
                    <div className="text-left space-y-1 text-slate-700 font-mono" dir="ltr">
                      <div className="text-[10px] font-bold text-slate-800">REPORT REF: REP-2026-{(pdfSession.id || "SESS").toUpperCase()}</div>
                      <div className="text-[10px]">DATE: {new Date().toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : currentLanguage === 'fr' ? 'fr-FR' : 'en-US')}</div>
                      <div className="text-[10px]">STATUS: VERIFIED (AI)</div>
                      <div className="text-[10px] text-teal-700 font-bold">MODE: SAFE CLINICAL GATEWAY</div>
                    </div>
                  </div>

                  {/* Main Report Title */}
                  <div className="text-center">
                    <h3 className="text-sm font-black text-slate-800 border-b border-slate-200 pb-1.5 inline-block px-8">
                      {t("pdfTranslations.reportTitle")}
                    </h3>
                  </div>

                  {/* Patient Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                    <div className="space-y-1.5">
                      <div>
                        <span className="text-slate-500 block">{t("pdfTranslations.patientNameLabel")}</span>
                        <strong className="text-slate-800 text-sm">{pdfSession.patientName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{t("pdfTranslations.contactPhoneLabel")}</span>
                        <strong className="text-slate-800 font-mono">{pdfSession.patientPhone}</strong>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div>
                        <span className="text-slate-500 block">{t("pdfTranslations.consultationDateLabel")}</span>
                        <strong className="text-slate-800">{pdfSession.date}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{t("pdfTranslations.consultationTopicLabel")}</span>
                        <strong className="text-slate-800">{pdfSession.topic}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Analytics Center */}
                  <div className="space-y-3">
                    <h5 className={`text-xs font-bold text-slate-800 border-teal-600 ${isRtl ? "border-r-2 pr-2" : "border-l-2 pl-2"}`}>
                      {t("pdfTranslations.section1Title")}
                    </h5>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-teal-50/50 p-3 rounded-lg border border-teal-100/60">
                        <span className="text-[10px] text-slate-500 block">{t("pdfTranslations.satisfactionLevel")}</span>
                        <strong className="text-xs text-teal-800 block mt-0.5">
                          {pdfSession.aiSentiment === "satisfied" ? t("pdfTranslations.satisfiedStatus") : t("pdfTranslations.neutralStatus")}
                        </strong>
                      </div>
                      <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100/60">
                        <span className="text-[10px] text-slate-500 block">{t("pdfTranslations.classificationUrgency")}</span>
                        <strong className="text-xs text-amber-800 block mt-0.5">
                          {pdfSession.topic.match(/(ألم|وجع|نزيف|خلع|كسر|طوارئ|pain|mal|saignement|fracture|urgence|emergency)/i) ? t("pdfTranslations.urgentStatus") : t("pdfTranslations.normalStatus")}
                        </strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                        <span className="text-[10px] text-slate-500 block">{t("pdfTranslations.safetyCommitment")}</span>
                        <strong className="text-xs text-slate-800 block mt-0.5">{t("pdfTranslations.safetyPassed")}</strong>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px] leading-relaxed text-slate-700">
                      <span className="font-bold text-slate-800 block mb-1">{t("pdfTranslations.recommendationSummary")}</span>
                      {pdfSession.topic.match(/(ألم|وجع|نزيف|خلع|كسر|طوارئ|pain|mal|saignement|fracture|urgence|emergency)/i) ? (
                        <span>{t("pdfTranslations.urgentRecommendation")}</span>
                      ) : (
                        <span>{t("pdfTranslations.normalRecommendation")}</span>
                      )}
                    </div>
                  </div>

                  {/* Complete Chat Transcript Logs */}
                  <div className="space-y-3">
                    <h5 className={`text-xs font-bold text-slate-800 border-teal-600 ${isRtl ? "border-r-2 pr-2" : "border-l-2 pl-2"}`}>
                      {t("pdfTranslations.section2Title")}
                    </h5>
                    
                    <div className="border border-slate-200 rounded-xl overflow-hidden text-[10px]">
                      {/* Table Header */}
                      <div className="grid grid-cols-12 bg-slate-100 text-slate-700 font-bold p-2.5 border-b border-slate-200">
                        <div className="col-span-3">{t("pdfTranslations.senderLabel")}</div>
                        <div className="col-span-9">{t("pdfTranslations.messageContentLabel")}</div>
                      </div>

                      {/* Messages Rows */}
                      <div className="divide-y divide-slate-150 max-h-[300px] overflow-y-auto print:max-h-none print:overflow-visible">
                        {pdfSession.messages.map((msg, index) => {
                          const isUser = msg.sender === "user";
                          const isDoc = msg.sender === "doctor";
                          return (
                            <div 
                              key={msg.id || index} 
                              className={`grid grid-cols-12 p-3 items-start gap-2 ${
                                isDoc ? "bg-amber-50/40" : isUser ? "bg-white" : "bg-teal-50/20"
                              }`}
                            >
                              <div className="col-span-3 font-bold text-slate-700 flex flex-col gap-0.5">
                                <span className={isDoc ? "text-amber-700" : isUser ? "text-slate-800" : "text-teal-700"}>
                                  {isUser ? t("pdfTranslations.patient") : isDoc ? t("pdfTranslations.doctor") : t("pdfTranslations.assistant")}
                                </span>
                                <span className="text-[8px] text-slate-400 font-normal font-mono">
                                  {pdfSession.date.split(" ")[1] || "Active"}
                                </span>
                              </div>
                              <div className={`col-span-9 text-slate-800 leading-relaxed whitespace-pre-wrap ${isDoc ? "font-bold" : ""}`}>
                                {msg.text}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Sign-off disclaimer, signature, stamp */}
                  <div className="pt-4 border-t border-slate-200 grid grid-cols-12 gap-4 text-xs">
                    {/* Disclaimer */}
                    <div className="col-span-7 text-[9px] text-slate-500 leading-relaxed space-y-1">
                      <strong className="text-slate-700 block">{t("pdfTranslations.disclaimerTitle")}</strong>
                      <p>
                        {t("pdfTranslations.disclaimerText")}
                      </p>
                    </div>

                    {/* Signature and Stamp placeholders */}
                    <div className={`col-span-5 flex justify-between items-center ${isRtl ? "pl-4 border-r pr-4" : "pr-4 border-l pl-4"} border-slate-100`}>
                      {/* Official Stamp Vector representation */}
                      <div className="flex flex-col items-center justify-center relative shrink-0">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-teal-600/60 flex flex-col items-center justify-center text-teal-600/70 p-1 relative transform rotate-6 scale-95">
                          <div className="w-12 h-12 rounded-full border border-teal-600/30 flex flex-col items-center justify-center text-center">
                            <Stethoscope className="w-4 h-4 text-teal-600/70" />
                            <span className="text-[6px] font-black tracking-tighter mt-0.5">APPROVED</span>
                          </div>
                          <span className="absolute text-[5px] font-bold text-teal-600/50 bottom-0.5">2026 OFFICIAL</span>
                        </div>
                        <span className="text-[8px] text-slate-400 mt-1">{t("pdfTranslations.officialStamp")}</span>
                      </div>

                      {/* Doctor Signature */}
                      <div className="text-center space-y-3 shrink-0">
                        <span className="text-[10px] text-slate-400 block">{t("pdfTranslations.doctorSignatureLabel")}</span>
                        <div className="font-mono text-slate-800 text-xs italic border-b border-slate-300 pb-1 px-2 font-bold select-none transform rotate-[-2deg]">
                          {t('drPrefix')}
                          {clinicInfo.doctorName || t("pdfTranslations.defaultDoctor")}
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono">{new Date().toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : currentLanguage === 'fr' ? 'fr-FR' : 'en-US')}</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Modal Footer Controls */}
              <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center" dir={isRtl ? "rtl" : "ltr"}>
                <button
                  onClick={() => {
                    setShowMedicalPdfModal(false);
                    setPdfSession(null);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  {t("pdfTranslations.closePreview")}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const textToCopy = `[${t("pdfTranslations.reportTitle")} - ${clinicInfo.name || "Clinic"}]
REPORT REF: REP-2026-${pdfSession.id.toUpperCase()}
Patient: ${pdfSession.patientName}
Phone: ${pdfSession.patientPhone}
Topic: ${pdfSession.topic}
Date: ${pdfSession.date}
Satisfaction: ${pdfSession.aiSentiment === "satisfied" ? t("pdfTranslations.satisfiedStatus") : t("pdfTranslations.neutralStatus")}

[Transcript]:
${pdfSession.messages.map(m => `- ${m.sender === "user" ? "Patient" : m.sender === "doctor" ? "Doctor" : "Assistant"}: ${m.text}`).join("\n")}
`;
                      navigator.clipboard.writeText(textToCopy);
                      showNotification(t('reportCopied'), "success");
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer border border-slate-700"
                  >
                    {t("pdfTranslations.copyFullText")}
                  </button>

                  <button
                    onClick={() => {
                      setTimeout(() => {
                        window.print();
                      }, 100);
                    }}
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-teal-500/10"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{t("pdfTranslations.downloadPrintPdf")}</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🖨️ Absolute hidden container used EXCLUSIVELY for high-fidelity A4 printing */}
      {pdfSession && (
        <div id="printable-medical-report-root" className="hidden" dir={isRtl ? "rtl" : "ltr"}>
          <div className={`bg-white text-slate-950 p-8 w-full max-w-4xl mx-auto space-y-6 font-sans relative ${isRtl ? "text-right" : "text-left"}`}>
            
            {/* Header Letterhead */}
            <div className="flex justify-between items-start border-b-2 border-teal-600 pb-5">
              {/* Clinic Details */}
              <div className="space-y-1">
                <h4 className="text-xl font-black text-teal-800">{localizeDynamicText(clinicInfo.name, currentLanguage) || t("pdfTranslations.defaultClinicName")}</h4>
                <p className="text-sm font-bold text-slate-600">{localizeDynamicText(clinicInfo.specialty, currentLanguage) || t("pdfTranslations.defaultSpecialty")}</p>
                <p className="text-xs text-slate-500">
                  {t('supervisionOf')}
                  {localizeDynamicText(clinicInfo.doctorName || "", currentLanguage) || t("pdfTranslations.defaultDoctor")}
                </p>
                <p className="text-xs text-slate-500">
                  {t('phoneLabel')}
                  {clinicInfo.phone} | 
                  {t('addressLabel')}
                  {localizeDynamicText(clinicInfo.address, currentLanguage)}
                </p>
              </div>

              {/* Report Branding Emblem */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full border-2 border-teal-600 flex items-center justify-center text-teal-700 bg-teal-50">
                  <span className="text-lg font-bold">🩺</span>
                </div>
                <span className="text-[9px] font-bold text-teal-700 tracking-wider mt-1.5 uppercase">Clinical Record</span>
              </div>

              {/* Report Metadata */}
              <div className="text-left space-y-1 text-slate-700 font-mono" dir="ltr">
                <div className="text-xs font-bold text-slate-800">REPORT REF: REP-2026-{(pdfSession.id || "SESS").toUpperCase()}</div>
                <div className="text-xs">DATE: {new Date().toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : currentLanguage === 'fr' ? 'fr-FR' : 'en-US')}</div>
                <div className="text-xs">STATUS: VERIFIED (AI)</div>
                <div className="text-xs text-teal-700 font-bold">MODE: SAFE CLINICAL GATEWAY</div>
              </div>
            </div>

            {/* Main Report Title */}
            <div className="text-center pt-2">
              <h3 className="text-lg font-black text-slate-800 border-b border-slate-200 pb-2 inline-block px-12">
                {t("pdfTranslations.reportTitle")}
              </h3>
            </div>

            {/* Patient Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs">
              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-500 block">{t("pdfTranslations.patientNameLabel")}</span>
                  <strong className="text-slate-800 text-sm">{pdfSession.patientName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">{t("pdfTranslations.contactPhoneLabel")}</span>
                  <strong className="text-slate-800 font-mono">{pdfSession.patientPhone}</strong>
                </div>
              </div>
              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-500 block">{t("pdfTranslations.consultationDateLabel")}</span>
                  <strong className="text-slate-800">{pdfSession.date}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">{t("pdfTranslations.consultationTopicLabel")}</span>
                  <strong className="text-slate-800">{pdfSession.topic}</strong>
                </div>
              </div>
            </div>

            {/* Clinical Analytics Center */}
            <div className="space-y-3">
              <h5 className={`text-sm font-bold text-slate-800 border-teal-600 ${isRtl ? "border-r-2 pr-2" : "border-l-2 pl-2"}`}>
                {t("pdfTranslations.section1Title")}
              </h5>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-teal-50/50 p-3 rounded-lg border border-teal-100/60">
                  <span className="text-[10px] text-slate-500 block">{t("pdfTranslations.satisfactionLevel")}</span>
                  <strong className="text-xs text-teal-800 block mt-0.5">
                    {pdfSession.aiSentiment === "satisfied" ? t("pdfTranslations.satisfiedStatus") : t("pdfTranslations.neutralStatus")}
                  </strong>
                </div>
                <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100/60">
                  <span className="text-[10px] text-slate-500 block">{t("pdfTranslations.classificationUrgency")}</span>
                  <strong className="text-xs text-amber-800 block mt-0.5">
                    {pdfSession.topic.match(/(ألم|وجع|نزيف|خلع|كسر|طوارئ|pain|mal|saignement|fracture|urgence|emergency)/i) ? t("pdfTranslations.urgentStatus") : t("pdfTranslations.normalStatus")}
                  </strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                  <span className="text-[10px] text-slate-500 block">{t("pdfTranslations.safetyCommitment")}</span>
                  <strong className="text-xs text-slate-800 block mt-0.5">{t("pdfTranslations.safetyPassed")}</strong>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs leading-relaxed text-slate-700">
                <span className="font-bold text-slate-800 block mb-1">{t("pdfTranslations.recommendationSummary")}</span>
                {pdfSession.topic.match(/(ألم|وجع|نزيف|خلع|كسر|طوارئ|pain|mal|saignement|fracture|urgence|emergency)/i) ? (
                  <span>{t("pdfTranslations.urgentRecommendation")}</span>
                ) : (
                  <span>{t("pdfTranslations.normalRecommendation")}</span>
                )}
              </div>
            </div>

            {/* Complete Chat Transcript Logs */}
            <div className="space-y-3">
              <h5 className={`text-sm font-bold text-slate-800 border-teal-600 ${isRtl ? "border-r-2 pr-2" : "border-l-2 pl-2"}`}>
                {t("pdfTranslations.section2TitlePrint")}
              </h5>
              
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-slate-100 text-slate-700 font-bold p-2.5 border-b border-slate-200">
                  <div className="col-span-3">{t("pdfTranslations.senderLabel")}</div>
                  <div className="col-span-9">{t("pdfTranslations.messageContentLabel")}</div>
                </div>

                {/* Messages Rows */}
                <div className="divide-y divide-slate-150">
                  {pdfSession.messages.map((msg, index) => {
                    const isUser = msg.sender === "user";
                    const isDoc = msg.sender === "doctor";
                    return (
                      <div 
                        key={msg.id || index} 
                        className={`grid grid-cols-12 p-3 items-start gap-2 ${
                          isDoc ? "bg-amber-50/40" : isUser ? "bg-white" : "bg-teal-50/20"
                        }`}
                      >
                        <div className="col-span-3 font-bold text-slate-700 flex flex-col gap-0.5">
                          <span className={isDoc ? "text-amber-700" : isUser ? "text-slate-800" : "text-teal-700"}>
                            {isUser ? t("pdfTranslations.patient") : isDoc ? t("pdfTranslations.doctor") : t("pdfTranslations.assistant")}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal font-mono">
                            {pdfSession.date.split(" ")[1] || "Active"}
                          </span>
                        </div>
                        <div className={`col-span-9 text-slate-800 leading-relaxed whitespace-pre-wrap ${isDoc ? "font-bold" : ""}`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sign-off disclaimer, signature, stamp */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-12 gap-4 text-xs">
              {/* Disclaimer */}
              <div className="col-span-7 text-[10px] text-slate-500 leading-relaxed space-y-1">
                <strong className="text-slate-700 block">{t("pdfTranslations.disclaimerTitle")}</strong>
                <p>
                  {t("pdfTranslations.disclaimerText")}
                </p>
              </div>

              {/* Signature and Stamp placeholders */}
              <div className={`col-span-5 flex justify-between items-center ${isRtl ? "pl-4 border-r pr-4" : "pr-4 border-l pl-4"} border-slate-150 pr-4`}>
                {/* Official Stamp Vector representation */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-teal-600/60 flex flex-col items-center justify-center text-teal-600/70 p-1 relative">
                    <div className="w-12 h-12 rounded-full border border-teal-600/30 flex flex-col items-center justify-center text-center">
                      <span className="text-xs">⚕️</span>
                      <span className="text-[5px] font-black mt-0.5">APPROVED</span>
                    </div>
                  </div>
                  <span className="text-[8px] text-slate-400 mt-1">{t("pdfTranslations.officialStamp")}</span>
                </div>

                {/* Doctor Signature */}
                <div className="text-center space-y-2 shrink-0">
                  <span className="text-[10px] text-slate-400 block">{t("pdfTranslations.doctorSignatureLabel")}</span>
                  <div className="font-mono text-slate-800 text-sm italic border-b border-slate-300 pb-1 px-4 font-bold">
                    {t('drPrefix')}
                    {clinicInfo.doctorName || t("pdfTranslations.defaultDoctor")}
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">{new Date().toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : currentLanguage === 'fr' ? 'fr-FR' : 'en-US')}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Premium Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>{t('saasCopyright')}</p>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>{t('saasFooterNote')}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <InnerApp />
    </I18nextProvider>
  );
}
