import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not defined. The local fallback matcher will be active.");
}

// Local Response Generator Fallback for Zero-Error PWA Experience
function getLocalResponse(
  query: string,
  services: any[],
  guidelines: any[],
  dailyStatus: string,
  quickActions: any[],
  clinicInfo: any,
  language: string = "ar"
): string {
  const clinicName = clinicInfo?.name || (language === "ar" ? "العيادة الطبية" : language === "fr" ? "la clinique" : "the clinic");
  const specialty = clinicInfo?.specialty || (language === "ar" ? "تخصص عام" : language === "fr" ? "généraliste" : "general specialty");
  const phone = clinicInfo?.phone || (language === "ar" ? "غير محدد" : language === "fr" ? "non défini" : "not specified");
  const address = clinicInfo?.address || (language === "ar" ? "غير محدد" : language === "fr" ? "non défini" : "not specified");

  const normalizeArabic = (text: string): string => {
    if (!text) return "";
    return text
      .replace(/[أإآا]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/[ىي]/g, "ي")
      .replace(/[\u064B-\u0652]/g, "") // remove diacritics
      .trim()
      .toLowerCase();
  };

  const normQuery = query ? query.trim().toLowerCase() : "";
  const normQueryAr = normalizeArabic(query);

  if (!normQuery) {
    if (language === "fr") {
      return `Bienvenue chez **${clinicName}** ! Comment puis-je vous aider aujourd'hui ?`;
    } else if (language === "en") {
      return `Welcome to **${clinicName}**! How can I help you today?`;
    }
    return `أهلاً بك في عيادة **${clinicName}**! كيف يمكنني مساعدتك اليوم؟`;
  }

  // Helper matching
  const matchesKeyword = (arKeywords: string[], enKeywords: string[], frKeywords: string[]): boolean => {
    const isArMatch = arKeywords.some(k => normQueryAr.includes(normalizeArabic(k)));
    const isEnMatch = enKeywords.some(k => normQuery.includes(k.toLowerCase()));
    const isFrMatch = frKeywords.some(k => normQuery.includes(k.toLowerCase()));
    return isArMatch || isEnMatch || isFrMatch;
  };

  // 1. Quick Actions match
  if (Array.isArray(quickActions)) {
    for (const action of quickActions) {
      if (action.label) {
        if (normQuery.includes(action.label.toLowerCase()) || normQueryAr.includes(normalizeArabic(action.label))) {
          return action.response;
        }
      }
    }
  }

  // 2. Greetings
  if (matchesKeyword(
    ["مرحبا", "اهلا", "هلا", "سلام", "صبحك", "مساء", "مسيك", "هاي", "السلام عليكم"],
    ["hello", "hi", "hey", "greetings", "good morning", "good evening"],
    ["bonjour", "salut", "bonsoir", "coucou", "allô"]
  )) {
    if (language === "fr") {
      return `Bienvenue chez **${clinicName}** (${specialty}) ! 🦷\n\nJe suis votre assistant médical virtuel, comment puis-je vous aider aujourd'hui ?\n\nVous pouvez vous renseigner sur :\n- Nos services & tarifs 💰\n- Réserver un nouveau rendez-vous 📅\n- Horaires de travail & adresse de la clinique ⏰\n- Directives & instructions médicales ℹ️`;
    } else if (language === "en") {
      return `Welcome to **${clinicName}** (${specialty}) ! 🦷\n\nI am your virtual medical assistant, how can I help you today?\n\nYou can ask about:\n- Our services & prices 💰\n- Book a new appointment 📅\n- Working hours & clinic location ⏰\n- Medical guidelines & instructions ℹ️`;
    }
    return `مرحباً بك في **${clinicName}** (${specialty})! 🦷\n\nأنا مساعدك الطبي الافتراضي، كيف يمكنني خدمتك اليوم؟\n\nيمكنك الاستفسار عن:\n- خدماتنا وأسعارنا 💰\n- حجز موعد جديد 📅\n- ساعات العمل وموقع العيادة ⏰\n- الإرشادات والتعليمات الطبية ℹ️`;
  }

  // 3. Address / Location
  if (matchesKeyword(
    ["عنوان", "مكان", "موقع", "وين", "خريطه", "خريطة", "لوكيشن"],
    ["location", "address", "where", "map", "gps", "find us"],
    ["adresse", "lieu", "localisation", "carte", "où", "trouver", "gps"]
  )) {
    if (language === "fr") {
      let response = `📍 Adresse de la clinique **${clinicName}** :\n${address}`;
      if (clinicInfo?.latitude && clinicInfo?.longitude) {
        response += `\n\n📌 Vous pouvez suivre notre position géographique en direct sur la carte ici :\nhttps://www.google.com/maps/search/?api=1&query=${clinicInfo.latitude},${clinicInfo.longitude}`;
      }
      response += `\n\nNous nous réjouissons de votre visite ! Avez-vous besoin d'aide pour prendre un rendez-vous ?`;
      return response;
    } else if (language === "en") {
      let response = `📍 Address of **${clinicName}**:\n${address}`;
      if (clinicInfo?.latitude && clinicInfo?.longitude) {
        response += `\n\n📌 You can follow our live map location here:\nhttps://www.google.com/maps/search/?api=1&query=${clinicInfo.latitude},${clinicInfo.longitude}`;
      }
      response += `\n\nWe look forward to your visit! Do you need help booking an appointment?`;
      return response;
    } else {
      let response = `📍 عنوان عيادة **${clinicName}**:\n${address}`;
      if (clinicInfo?.latitude && clinicInfo?.longitude) {
        response += `\n\n📌 يمكنك تتبع موقعنا الجغرافي المباشر على الخريطة من هنا:\nhttps://www.google.com/maps/search/?api=1&query=${clinicInfo.latitude},${clinicInfo.longitude}`;
      }
      response += `\n\nتشرفنا زيارتكم! هل تحتاج إلى مساعدة في حجز موعد؟`;
      return response;
    }
  }

  // 4. Phone / Contact
  if (matchesKeyword(
    ["هاتف", "تواصل", "رقم", "جوال", "موبايل", "تلفون", "واتساب", "واتس"],
    ["phone", "contact", "whatsapp", "call", "mobile", "telephone", "number"],
    ["téléphone", "contact", "whatsapp", "appeler", "mobile", "numéro", "tel"]
  )) {
    if (language === "fr") {
      return `📞 Vous pouvez contacter la clinique **${clinicName}** directement au :\n**${phone}**\n\nNous sommes ravis de répondre à vos demandes par appel ou via WhatsApp !`;
    } else if (language === "en") {
      return `📞 You can contact **${clinicName}** directly at:\n**${phone}**\n\nWe are happy to answer your inquiries via phone call or WhatsApp!`;
    }
    return `📞 يمكنك التواصل المباشر مع عيادة **${clinicName}** عبر الرقم التالي:\n**${phone}**\n\nيسعدنا الرد على استفساراتكم مكالمةً أو عبر الواتساب!`;
  }

  // 5. Booking / Appointment
  if (matchesKeyword(
    ["حجز", "موعد", "احجز", "تسجيل", "مقابله", "زياره"],
    ["booking", "appointment", "book", "reserve", "visit", "schedule"],
    ["réservation", "rendez-vous", "réserver", "rdv", "visite", "programmer"]
  )) {
    if (language === "fr") {
      return `🗓️ Pour réserver un rendez-vous à la clinique **${clinicName}** :\n\n1. Vous pouvez remplir le formulaire de réservation rapide dans l'onglet **"Réservations Directes"** du tableau de bord et le confirmer instantanément.\n2. Ou vous pouvez nous appeler directement au : **${phone}**.\n\nNous sommes ravis de vous servir !`;
    } else if (language === "en") {
      return `🗓️ To book an appointment at **${clinicName}**:\n\n1. You can fill out the quick booking form in the **"Direct Bookings"** tab on the dashboard and confirm it instantly.\n2. Or you can call us directly at: **${phone}**.\n\nWe are pleased to serve you!`;
    }
    return `🗓️ لحجز موعد في عيادة **${clinicName}**:\n\n1. يمكنك ملء نموذج الحجز السريع في علامة تبويب **"الحجوزات المباشرة"** في لوحة التحكم وتأكيده فوراً.\n2. أو يمكنك الاتصال بنا مباشرة على الرقم: **${phone}**.\n\nيسعدنا اختيارك لنا لخدمتك!`;
  }

  // 6. Working Hours / Daily Status
  if (matchesKeyword(
    ["ساعات", "اوقات", "عمل", "مفتوح", "دوام", "متى", "اليوم", "يوم"],
    ["hours", "open", "time", "schedule", "when", "today", "work"],
    ["horaire", "ouvert", "fermé", "quand", "aujourd'hui", "travail", "temps"]
  )) {
    if (language === "fr") {
      const status = dailyStatus || "La clinique fonctionne selon ses horaires habituels et accepte les réservations.";
      let response = `⏰ **Horaires de travail et statut aujourd'hui :**\n\n${status}`;
      if (clinicInfo?.notes) {
        response += `\n\n📌 **À propos de la clinique & horaires :**\n${clinicInfo.notes}`;
      }
      response += `\n\nPour toute demande urgente, contactez-nous directement au : ${phone}`;
      return response;
    } else if (language === "en") {
      const status = dailyStatus || "The clinic is operating during normal working hours and welcoming bookings.";
      let response = `⏰ **Clinic hours & status today:**\n\n${status}`;
      if (clinicInfo?.notes) {
        response += `\n\n📌 **About the clinic & hours:**\n${clinicInfo.notes}`;
      }
      response += `\n\nFor any urgent inquiry, call us directly at: ${phone}`;
      return response;
    } else {
      const status = dailyStatus || "العيادة تعمل بأوقاتها الاعتيادية ونستقبل حجوزاتكم يومياً.";
      let response = `⏰ **ساعات عمل العيادة وحالتها اليوم:**\n\n${status}`;
      if (clinicInfo?.notes) {
        response += `\n\n📌 **عن العيادة وأوقات الدوام:**\n${clinicInfo.notes}`;
      }
      response += `\n\nلأي استفسار طارئ، يمكنك الاتصال بنا مباشرة على الرقم: ${phone}`;
      return response;
    }
  }

  // 6.5. About / Bio / Services Definition
  if (matchesKeyword(
    ["تعريف", "عن العيادة", "من انتم", "من أنتم", "سيرة", "ذاتية", "دكتور", "طبيب", "خبرة", "معلومات"],
    ["about", "bio", "doctor", "cv", "who are we", "info", "experience"],
    ["à propos", "bio", "docteur", "médecin", "cv", "qui sommes-nous", "info", "expérience"]
  ) && clinicInfo?.notes) {
    if (language === "fr") {
      return `ℹ️ **À propos de la clinique, du médecin et des services :**\n\n${clinicInfo.notes}\n\nNous sommes heureux de vous servir à tout moment !`;
    } else if (language === "en") {
      return `ℹ️ **About the clinic, doctor, and services:**\n\n${clinicInfo.notes}\n\nWe are happy to serve you at any time!`;
    }
    return `ℹ️ **عن العيادة والطبيب والخدمات:**\n\n${clinicInfo.notes}\n\nيسعدنا خدمتكم في أي وقت!`;
  }

  // 7. Services & Prices
  const isAskingGeneralServices = matchesKeyword(
    ["سعر", "تكلفه", "تكلفة", "كم", "اسعار", "أسعار", "خدمات", "خدمه", "علاج", "الخدمات"],
    ["price", "cost", "how much", "prices", "services", "service", "treatment"],
    ["tarif", "prix", "coût", "combien", "tarifs", "services", "service", "traitement"]
  );

  // Try to match specific service
  if (Array.isArray(services)) {
    for (const s of services) {
      if (s.name && (normQuery.includes(s.name.toLowerCase()) || normQueryAr.includes(normalizeArabic(s.name)))) {
        if (language === "fr") {
          return `🦷 Concernant le service **${s.name}** :\n\n📝 **Description :** ${s.description || "Disponible avec une haute qualité."}\n💰 **Tarif :** ${s.price || "Veuillez vous renseigner lors de l'examen"}\n\nSouhaitez-vous prendre rendez-vous pour ce service ?`;
        } else if (language === "en") {
          return `🦷 Regarding **${s.name}**:\n\n📝 **Description:** ${s.description || "Available with high quality."}\n💰 **Price:** ${s.price || "Please inquire during examination"}\n\nWould you like to book an appointment for this service?`;
        }
        return `🦷 بخصوص خدمة **${s.name}**:\n\n📝 **الوصف:** ${s.description || "متوفرة بجودة عالية بأيدي متخصصين."}\n💰 **السعر:** ${s.price || "يرجى الاستفسار عند الفحص"}\n\nهل ترغب في حجز موعد لهذه الخدمة؟`;
      }
    }
  }

  if (isAskingGeneralServices && Array.isArray(services) && services.length > 0) {
    if (language === "fr") {
      const servicesList = services.map(s => `- **${s.name}** : au tarif de ${s.price || "non défini"} (${s.description || "pas de description"})`).join("\n");
      return `🦷 **Services et tarifs disponibles à la clinique ${clinicName} :**\n\n${servicesList}\n\nSouhaitez-vous prendre un rendez-vous pour l'un de ces services ?`;
    } else if (language === "en") {
      const servicesList = services.map(s => `- **${s.name}**: priced at ${s.price || "not specified"} (${s.description || "no description"})`).join("\n");
      return `🦷 **Services and prices available at ${clinicName}:**\n\n${servicesList}\n\nWould you like to book an appointment for one of these services?`;
    } else {
      const servicesList = services.map(s => `- **${s.name}**: بسعر ${s.price || "غير محدد"} (${s.description || "لا يوجد وصف"})`).join("\n");
      return `🦷 **الخدمات والأسعار المتوفرة في عيادة ${clinicName}:**\n\n${servicesList}\n\nهل ترغب في حجز موعد لإحدى هذه الخدمات؟`;
    }
  }

  // 8. Guidelines / Instructions
  if (Array.isArray(guidelines)) {
    for (const g of guidelines) {
      if (g.title && (normQuery.includes(g.title.toLowerCase()) || normQueryAr.includes(normalizeArabic(g.title)))) {
        if (language === "fr") {
          return `ℹ️ **Directives concernant ${g.title} :**\n\n${g.content}\n\nNous vous souhaitons une excellente santé !`;
        } else if (language === "en") {
          return `ℹ️ **Guidelines for ${g.title}:**\n\n${g.content}\n\nWe wish you continuous health and wellness!`;
        }
        return `ℹ️ **إرشادات بخصوص ${g.title}:**\n\n${g.content}\n\nنتمنى لك دوام الصحة والعافية!`;
      }
    }
    
    if (matchesKeyword(
      ["ارشادات", "إرشادات", "تعليمات", "نصائح", "نصيحه", "تحضير", "قبل"],
      ["guidelines", "instructions", "advice", "preparations", "tips"],
      ["directives", "instructions", "conseils", "préparations", "recommandations"]
    )) {
      const guidelinesList = guidelines.map(g => `- **${g.title}**: ${g.content.substring(0, 100)}...`).join("\n");
      if (language === "fr") {
        return `ℹ️ **Directives médicales et préparations disponibles :**\n\n${guidelinesList}\n\nVeuillez suivre ces instructions pour votre sécurité et pour garantir la meilleure qualité de traitement.`;
      } else if (language === "en") {
        return `ℹ️ **Medical guidelines and preparations available:**\n\n${guidelinesList}\n\nPlease follow these instructions for your safety and to ensure the best treatment quality.`;
      } else {
        const guidelinesList = guidelines.map(g => `- **${g.title}**: ${g.content.substring(0, 100)}...`).join("\n");
        return `ℹ️ **الإرشادات الطبية والتحضيرات المتوفرة لدينا:**\n\n${guidelinesList}\n\nيرجى اتباع هذه التعليمات لسلامتك ولضمان أفضل جودة علاجية.`;
      }
    }
  }

  // Default response
  if (language === "fr") {
    return `Bienvenue chez **${clinicName}** ! 🌸\n\nJe n'ai pas tout à fait compris votre demande, mais je peux vous répondre sur :\n- Nos différents services et tarifs.\n- La réservation de rendez-vous et les horaires.\n- L'adresse et le numéro de téléphone de la clinique.\n\nVous pouvez taper des mots-clés comme "tarifs", "adresse" ou "contact" pour obtenir une réponse instantanée, ou nous appeler directement au : **${phone}**.`;
  } else if (language === "en") {
    return `Welcome to **${clinicName}** ! 🌸\n\nI didn't quite understand your inquiry, but I can answer you about:\n- Our various services and prices.\n- Booking appointments and working hours.\n- Clinic address and phone number.\n\nYou can type keywords like "prices", "location", or "contact" to get an instant answer, or call us directly at: **${phone}**.`;
  }
  return `أهلاً بك في عيادة **${clinicName}**! 🌸\n\nلم أفهم استفسارك بدقة، ولكن يمكنني إجابتك عن:\n- خدماتنا المتنوعة وأسعارنا.\n- حجز المواعيد وأوقات العمل.\n- عنوان العيادة ورقم الهاتف.\n\nيمكنك كتابة كلمة مثل "أسعار" أو "موقع" أو "اتصال" للحصول على الإجابة الفورية، أو التواصل معنا مباشرة على الرقم: **${phone}**.`;
}

const app = express();
const PORT = 3000;

// Middleware to disable caching for index.html, sw.js, and manifest.json to force instant updates on mobile
app.use((req, res, next) => {
  const url = req.url.split("?")[0];
  if (url === "/" || url === "/index.html" || url === "/sw.js" || url === "/manifest.json") {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
  next();
});

app.use(express.json({ limit: "50mb" }));

  // API endpoint for chatbot responses
  app.post("/api/chat", async (req, res) => {
    const { 
      messages, 
      services, 
      guidelines, 
      dailyStatus, 
      quickActions,
      clinicInfo,
      language
    } = req.body;

    const currentLanguage = language || "ar";
    const lastUserMessage = messages?.slice().reverse().find((m: any) => m.sender === "user" || m.role === "user");
    const userQuery = lastUserMessage?.text || "";

    // If Gemini API is not configured, gracefully run the local smart fallback
    if (!ai) {
      const localReply = getLocalResponse(userQuery, services, guidelines, dailyStatus, quickActions, clinicInfo, currentLanguage);
      return res.json({ reply: localReply });
    }

    try {
      // Base configuration variables
      const clinicName = clinicInfo?.name || "العيادة الطبية";
      const specialty = clinicInfo?.specialty || "تخصص عام";
      const phone = clinicInfo?.phone || "غير محدد";
      const address = clinicInfo?.address || "غير محدد";

      // Build structured knowledge text
      let servicesText = "";
      if (Array.isArray(services) && services.length > 0) {
        servicesText = services.map(s => `- الخدمة: ${s.name}\n  التفاصيل: ${s.description || "لا يوجد"}\n  السعر: ${s.price || "غير محدد"}`).join("\n");
      } else {
        servicesText = "لم يتم تحديد خدمات في قاعدة البيانات بعد.";
      }

      let guidelinesText = "";
      if (Array.isArray(guidelines) && guidelines.length > 0) {
        guidelinesText = guidelines.map(g => `- الموضوع: ${g.title}\n  الإرشادات والتعليمات: ${g.content}`).join("\n");
      } else {
        guidelinesText = "لم يتم تحديد إرشادات تحضيرية بعد.";
      }

      let quickActionsText = "";
      if (Array.isArray(quickActions) && quickActions.length > 0) {
        quickActionsText = quickActions.map(a => `- خيار سريع: ${a.label}\n  الرد التلقائي المحدد له: ${a.response}`).join("\n");
      }

      // Construct a very strong system instruction that forbids extrapolation, learning, or self-inference
      let systemInstruction = "";
      if (currentLanguage === "fr") {
        systemInstruction = `
Vous êtes un chatbot intelligent et assistant administratif dédié à "${clinicName}" (${specialty}).
Votre objectif principal est d'aider les patients et clients et de répondre à leurs demandes sur la base exclusive de la "Base de données de la clinique" ci-jointe.

Données actuelles de la clinique :
- Nom de la clinique : ${clinicName}
- Spécialité : ${specialty}
- Téléphone : ${phone}
- Adresse : ${address} ${clinicInfo?.latitude && clinicInfo?.longitude ? `(Lien direct vers la carte : https://www.google.com/maps/search/?api=1&query=${clinicInfo.latitude},${clinicInfo.longitude})` : ""}
- Biographie, services, notes et horaires : ${clinicInfo?.notes || "Non spécifié."}

Statut quotidien rédigé par le médecin (très important pour aujourd'hui) :
"${dailyStatus || "Aucun statut exceptionnel pour aujourd'hui, la clinique fonctionne selon ses horaires habituels."}"

Services et tarifs disponibles :
${servicesText}

Directives médicales et préparations nécessaires :
${guidelinesText}

Actions rapides disponibles :
${quickActionsText}

⚠️ Règles de sécurité strictes que vous ne devez jamais contourner :
1. Répondez exclusivement et directement à partir des données mentionnées ci-dessus uniquement.
2. Il est strictement interdit de deviner, d'extrapoler, ou de fournir des diagnostics médicaux ou des conseils de traitement non formulés littéralement dans la base de données.
3. N'inventez jamais et ne devinez pas les horaires, services, tarifs ou médecins s'ils ne figurent pas dans les données.
4. Si un patient pose des questions sur des symptômes personnels (ex: "J'ai mal à X, que dois-je faire ?") ou toute question médicale complexe, vous ne devez pas y répondre du tout et l'orienter immédiatement vers la prise de rendez-vous ou l'appel de la clinique au (${phone}).
5. Répondez dans un français poli, clair et professionnel, adapté à une clinique médicale haut de gamme.
6. Si la question dépasse le cadre de notre clinique ou si vous n'avez pas la réponse, dites poliment : "Désolé, cette information n'est pas disponible dans la base de données de la clinique actuellement. Veuillez consulter la clinique ou appeler directement le médecin au ${phone} pour plus de détails."
7. Lorsque le patient envoie une image (ex: rapport médical, radiographie, dent cassée, éruption cutanée) ou un enregistrement audio, accueillez-le et décrivez/analysez-le avec précision, mais rappelez-lui strictement que le médecin doit effectuer un examen clinique pour définir le plan de traitement exact.
`;
      } else if (currentLanguage === "en") {
        systemInstruction = `
You are a smart chatbot and administrative assistant dedicated to "${clinicName}" (${specialty}).
Your main goal is to assist patients and customers and answer their inquiries based strictly on the attached "Clinic Database" only.

Current Clinic Data:
- Clinic Name: ${clinicName}
- Specialty: ${specialty}
- Phone: ${phone}
- Address: ${address} ${clinicInfo?.latitude && clinicInfo?.longitude ? `(Direct navigation map link: https://www.google.com/maps/search/?api=1&query=${clinicInfo.latitude},${clinicInfo.longitude})` : ""}
- Biography, services, notes, and working hours: ${clinicInfo?.notes || "Not specified."}

Daily Status written by the doctor (very important for today):
"${dailyStatus || "No exceptional status for today, the clinic is operating in its normal hours."}"

Available Services & Prices:
${servicesText}

Pre-operative/medical instructions and guidelines:
${guidelinesText}

Available Quick Actions:
${quickActionsText}

⚠️ Strict safety rules you must never bypass:
1. Answer exclusively and directly from the data mentioned above only.
2. It is strictly forbidden to guess, extrapolate, self-infer, or provide medical diagnoses or treatment advice not literally stated in the database.
3. Never invent or guess working hours, services, prices, or doctors if they are not in the data.
4. If a patient asks about personal symptoms (e.g., "I feel pain in X, what should I do?") or any complex medical question, you must not answer at all and immediately direct them to book an appointment or call the clinic at (${phone}).
5. Answer in a polite, clear, and professional English language matching high-end clinics.
6. If the question is outside our clinic scope or you do not have its answer, say politely: "Sorry, this information is not available in the clinic database currently. Please visit the clinic or call the doctor directly at ${phone} for details."
7. When the patient sends an image (e.g. medical report, x-ray, broken tooth, skin rash) or an audio recording, welcome them and describe/analyze it accurately, but strictly remind them that the doctor needs to perform a physical exam to set the exact treatment plan.
`;
      } else {
        systemInstruction = `
أنت شات بوت ذكي ومساعد إداري مخصص لـ "${clinicName}" (${specialty}).
هدفك الأساسي هو مساعدة المرضى والزبائن والإجابة عن استفساراتهم بناءً على "قاعدة بيانات العيادة" المرفقة فقط.

بيانات العيادة الحالية:
- اسم العيادة: ${clinicName}
- التخصص: ${specialty}
- رقم الهاتف للتواصل: ${phone}
- عنوان العيادة: ${address} ${clinicInfo?.latitude && clinicInfo?.longitude ? `(رابط موقع الخريطة الجغرافي للملاحة المباشرة: https://www.google.com/maps/search/?api=1&query=${clinicInfo.latitude},${clinicInfo.longitude})` : ""}
- تعريف العيادة، الخدمات، السيرة الذاتية وأوقات العمل والتواصل: ${clinicInfo?.notes || "لم يتم تحديد سيرة ذاتية أو أوقات عمل تفصيلية في ملف العيادة بعد."}

الحالة اليومية المكتوبة من قبل الطبيب (مهمة جداً لليوم):
"${dailyStatus || "لا توجد حالة استثنائية لليوم، العيادة تعمل بأوقاتها الاعتيادية."}"

الخدمات والأسعار المتاحة:
${servicesText}

الإرشادات الطبية والتحضيرات اللازمة قبل المجيء:
${guidelinesText}

خيارات الرد السريع المتاحة ومحتواها:
${quickActionsText}

⚠️ قواعد صارمة وحاسمة لا يمكنك تجاوزها أبداً (تعليمات الأمان وحماية الطبيب):
1. الإجابة حصرياً ومباشرةً من البيانات المذكورة أعلاه فقط.
2. يُمنع منعاً باتاً الاجتهاد، أو التخمين، أو الاستنتاج، أو التعلم الذاتي، أو تقديم تشخيصات طبية أو نصائح علاجية غير منصوص عليها حرفياً في قاعدة البيانات المرفقة.
3. لا تقم أبداً باختراع أو تخمين أوقات العمل أو الخدمات أو الأسعار أو الأطباء إذا لم تكن موجودة في البيانات.
4. إذا سأل المريض عن أعراض مرضية شخصية (مثل: "أشعر بألم في كذا، ماذا أفعل؟") أو أي سؤال طبي معقد أو سؤال ليس له إجابة واضحة ومباشرة في البيانات أعلاه، يجب عليك عدم الإجابة إطلاقاً وتوجيه المريض فوراً ومباشرةً لحجز موعد مع الطبيب أو الاتصال بالعيادة هاتفياً عبر الرقم (${phone}).
5. يجب أن تحرص على ألا يستغني المريض عن الطبيب بسبب إجاباتك. العيادة هي مشروع ربحي، وأي تبرع بنصائح طبية خارج النطاق قد يضر بالمرضى ويضيع أرباح العيادة.
6. إذا كان السؤال خارج نطاق عيادتنا أو تخصصنا أو لا تملك إجابته من البيانات، قل بلطف واحترام: "عذراً، هذه المعلومة غير متوفرة في قاعدة بيانات العيادة حالياً. يرجى مراجعة العيادة أو الاتصال بالطبيب مباشرة عبر الرقم ${phone} للحصول على التفاصيل."
7. أجب بلغة عربية مهذبة، واضحة، ومهنية تناسب العيادات الطبية الراقية.
8. عندما يرسل لك المريض صورة (مثل تقرير طبي، صورة أشعة، صورة لسن مكسور، أو طفح جلدي) أو تسجيلاً صوتياً، يمكنك بكل ترحيب وفخر قراءة الصورة وتحليلها بدقة أو سماع التسجيل الصوتي وفهمه بدقة، ثم أجب بلطف وبشكل طبي ملائم، ولكن احرص دائماً على عدم إعطاء تشخيص نهائي أو علاج، وذكّر المريض دائماً بأن الطبيب يحتاج لفحصه سريرياً لتحديد الخطة العلاجية الدقيقة.
`;
      }

      // Structure messages for Gemini API
      // Supports multimodal messages with base64 images and audio
      const contents = messages.map((m: any) => {
        const parts: any[] = [];
        if (m.text) {
          parts.push({ text: m.text });
        }
        if (m.image && m.image.data && m.image.mimeType) {
          parts.push({
            inlineData: {
              mimeType: m.image.mimeType,
              data: m.image.data,
            },
          });
        }
        if (m.audio && m.audio.data && m.audio.mimeType) {
          parts.push({
            inlineData: {
              mimeType: m.audio.mimeType,
              data: m.audio.data,
            },
          });
        }
        // Fallback to empty text if both empty
        if (parts.length === 0) {
          parts.push({ text: "" });
        }
        return {
          role: m.sender === "user" ? "user" : "model",
          parts: parts,
        };
      });

      // Call Gemini API using gemini-3.5-flash for text and image chatting
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.2, // Low temperature to minimize creativity and strictly stick to knowledge
          topP: 0.8,
        }
      });

      const replyText = response.text || (currentLanguage === "ar" ? "عذراً، لم أستطع معالجة الرد حالياً. يرجى المحاولة مجدداً." : currentLanguage === "fr" ? "Désolé, je n'ai pas pu traiter la réponse pour le moment. Veuillez réessayer." : "Sorry, I could not process the response at the moment. Please try again.");
      res.json({ reply: replyText });

    } catch (error: any) {
      console.warn("⚠️ Gemini API Error, falling back to local responder:", error);
      // Fallback to local response generator on any Gemini API failure (or invalid key)
      const localReply = getLocalResponse(userQuery, services, guidelines, dailyStatus, quickActions, clinicInfo, currentLanguage);
      res.json({ reply: localReply });
    }
  });

  // Serve client files & optionally start server
  async function startServer() {
    if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    // Only start listening if we're not running in a serverless environment like Vercel
    if (!process.env.VERCEL) {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
      });
    }
  }

// Start setup
startServer();

export default app;
