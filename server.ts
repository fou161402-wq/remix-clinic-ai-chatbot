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
  clinicInfo: any
): string {
  const clinicName = clinicInfo?.name || "العيادة الطبية";
  const specialty = clinicInfo?.specialty || "تخصص عام";
  const phone = clinicInfo?.phone || "غير محدد";
  const address = clinicInfo?.address || "غير محدد";

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

  const normQuery = normalizeArabic(query);

  if (!normQuery) {
    return `أهلاً بك في عيادة **${clinicName}**! كيف يمكنني مساعدتك اليوم؟`;
  }

  // 1. Quick Actions match
  if (Array.isArray(quickActions)) {
    for (const action of quickActions) {
      if (action.label && normQuery.includes(normalizeArabic(action.label))) {
        return action.response;
      }
    }
  }

  // 2. Greetings
  const greetings = ["مرحبا", "اهلا", "هلا", "سلام", "صبحك", "مساء", "مسيك", "هاي", "hello", "hi", "السلام عليكم"];
  if (greetings.some(g => normQuery.includes(normalizeArabic(g)))) {
    return `مرحباً بك في **${clinicName}** (${specialty})! 🦷\n\nأنا مساعدك الطبي الافتراضي، كيف يمكنني خدمتك اليوم؟\n\nيمكنك الاستفسار عن:\n- خدماتنا وأسعارنا 💰\n- حجز موعد جديد 📅\n- ساعات العمل وموقع العيادة ⏰\n- الإرشادات والتعليمات الطبية ℹ️`;
  }

  // 3. Address / Location
  const addressKeywords = ["عنوان", "مكان", "موقع", "وين", "خريطه", "خريطة", "لوكيشن", "location", "address"];
  if (addressKeywords.some(k => normQuery.includes(normalizeArabic(k)))) {
    let response = `📍 عنوان عيادة **${clinicName}**:\n${address}`;
    if (clinicInfo?.latitude && clinicInfo?.longitude) {
      response += `\n\n📌 يمكنك تتبع موقعنا الجغرافي المباشر على الخريطة من هنا:\nhttps://www.google.com/maps/search/?api=1&query=${clinicInfo.latitude},${clinicInfo.longitude}`;
    }
    response += `\n\nتشرفنا زيارتكم! هل تحتاج إلى مساعدة في حجز موعد؟`;
    return response;
  }

  // 4. Phone / Contact
  const contactKeywords = ["هاتف", "تواصل", "رقم", "جوال", "موبايل", "تلفون", "واتساب", "واتس", "phone", "contact", "whatsapp"];
  if (contactKeywords.some(k => normQuery.includes(normalizeArabic(k)))) {
    return `📞 يمكنك التواصل المباشر مع عيادة **${clinicName}** عبر الرقم التالي:\n**${phone}**\n\nيسعدنا الرد على استفساراتكم مكالمةً أو عبر الواتساب!`;
  }

  // 5. Booking / Appointment
  const bookingKeywords = ["حجز", "موعد", "احجز", "تسجيل", "مقابله", "زياره", "booking", "appointment"];
  if (bookingKeywords.some(k => normQuery.includes(normalizeArabic(k)))) {
    return `🗓️ لحجز موعد في عيادة **${clinicName}**:\n\n1. يمكنك ملء نموذج الحجز السريع في علامة تبويب **"الحجوزات المباشرة"** في لوحة التحكم وتأكيده فوراً.\n2. أو يمكنك الاتصال بنا مباشرة على الرقم: **${phone}**.\n\nيسعدنا اختيارك لنا لخدمتك!`;
  }

  // 6. Working Hours / Daily Status
  const hoursKeywords = ["ساعات", "اوقات", "عمل", "مفتوح", "دوام", "متى", "اليوم", "يوم", "hours", "open", "time"];
  if (hoursKeywords.some(k => normQuery.includes(normalizeArabic(k)))) {
    const status = dailyStatus || "العيادة تعمل بأوقاتها الاعتيادية ونستقبل حجوزاتكم يومياً.";
    let response = `⏰ **ساعات عمل العيادة وحالتها اليوم:**\n\n${status}`;
    if (clinicInfo?.notes) {
      response += `\n\n📌 **عن العيادة وأوقات الدوام:**\n${clinicInfo.notes}`;
    }
    response += `\n\nلأي استفسار طارئ، يمكنك الاتصال بنا مباشرة على الرقم: ${phone}`;
    return response;
  }

  // 6.5. About / Bio / Services Definition
  const aboutKeywords = ["تعريف", "عن العيادة", "من انتم", "من أنتم", "سيرة", "ذاتية", "دكتور", "طبيب", "خبرة", "الخدمات", "ماذا تقدم", "ماذا تقدمون", "معلومات", "about", "bio", "doctor", "cv"];
  if (aboutKeywords.some(k => normQuery.includes(normalizeArabic(k))) && clinicInfo?.notes) {
    return `ℹ️ **عن العيادة والطبيب والخدمات:**\n\n${clinicInfo.notes}\n\nيسعدنا خدمتكم في أي وقت!`;
  }

  // 7. Services & Prices
  const serviceKeywords = ["سعر", "تكلفه", "تكلفة", "كم", "اسعار", "أسعار", "خدمات", "خدمه", "علاج", "الخدمات", "prices", "services"];
  const isAskingGeneralServices = serviceKeywords.some(k => normQuery.includes(normalizeArabic(k)));

  // Try to match specific service
  if (Array.isArray(services)) {
    for (const s of services) {
      if (s.name && normQuery.includes(normalizeArabic(s.name))) {
        return `🦷 بخصوص خدمة **${s.name}**:\n\n📝 **الوصف:** ${s.description || "متوفرة بجودة عالية بأيدي متخصصين."}\n💰 **السعر:** ${s.price || "يرجى الاستفسار عند الفحص"}\n\nهل ترغب في حجز موعد لهذه الخدمة؟`;
      }
    }
  }

  if (isAskingGeneralServices && Array.isArray(services) && services.length > 0) {
    const servicesList = services.map(s => `- **${s.name}**: بسعر ${s.price || "غير محدد"} (${s.description || "لا يوجد وصف"})`).join("\n");
    return `🦷 **الخدمات والأسعار المتوفرة في عيادة ${clinicName}:**\n\n${servicesList}\n\nهل ترغب في حجز موعد لإحدى هذه الخدمات؟`;
  }

  // 8. Guidelines / Instructions
  if (Array.isArray(guidelines)) {
    for (const g of guidelines) {
      if (g.title && normQuery.includes(normalizeArabic(g.title))) {
        return `ℹ️ **إرشادات بخصوص ${g.title}:**\n\n${g.content}\n\nنتمنى لك دوام الصحة والعافية!`;
      }
    }
    
    const guidelinesKeywords = ["ارشادات", "إرشادات", "تعليمات", "نصائح", "نصيحه", "تحضير", "قبل", "guidelines", "instructions"];
    if (guidelinesKeywords.some(k => normQuery.includes(normalizeArabic(k)))) {
      const guidelinesList = guidelines.map(g => `- **${g.title}**: ${g.content.substring(0, 100)}...`).join("\n");
      return `ℹ️ **الإرشادات الطبية والتحضيرات المتوفرة لدينا:**\n\n${guidelinesList}\n\nيرجى اتباع هذه التعليمات لسلامتك ولضمان أفضل جودة علاجية.`;
    }
  }

  // Default response
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
      clinicInfo 
    } = req.body;

    const lastUserMessage = messages?.slice().reverse().find((m: any) => m.sender === "user" || m.role === "user");
    const userQuery = lastUserMessage?.text || "";

    // If Gemini API is not configured, gracefully run the local smart fallback
    if (!ai) {
      const localReply = getLocalResponse(userQuery, services, guidelines, dailyStatus, quickActions, clinicInfo);
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
      const systemInstruction = `
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

      const replyText = response.text || "عذراً، لم أستطع معالجة الرد حالياً. يرجى المحاولة مجدداً.";
      res.json({ reply: replyText });

    } catch (error: any) {
      console.warn("⚠️ Gemini API Error, falling back to local responder:", error);
      // Fallback to local response generator on any Gemini API failure (or invalid key)
      const localReply = getLocalResponse(userQuery, services, guidelines, dailyStatus, quickActions, clinicInfo);
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
