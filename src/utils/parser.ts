import { ClinicService, ClinicGuideline } from "../types";

export function parseExcelOrCsvToServices(text: string, lang: "ar" | "en" | "fr" = "ar"): ClinicService[] {
  if (!text.trim()) return [];

  // Determine delimiter
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
  if (lines.length === 0) return [];

  const firstLine = lines[0];
  let delimiter = "\t"; // Default to Excel tab-separated
  if (!firstLine.includes("\t") && firstLine.includes(",")) {
    delimiter = ",";
  } else if (!firstLine.includes("\t") && firstLine.includes(";")) {
    delimiter = ";";
  }

  // Parse rows
  const matrix = lines.map(line => {
    // Basic CSV splitting (handling simple cases, we can improve this)
    if (delimiter === ",") {
      // split by comma but respect quotes
      const result = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    }
    return line.split(delimiter).map(cell => cell.trim().replace(/^"|"$/g, ""));
  });

  if (matrix.length < 2) {
    // If only one line, treat it as data without headers
    return matrix.map((row, index) => ({
      id: `service-${Date.now()}-${index}`,
      name: row[0] || (lang === "en" ? "Unknown Service" : lang === "fr" ? "Service Inconnu" : "خدمة غير معروفة"),
      description: row[1] || "",
      price: row[2] || (lang === "en" ? "Unspecified" : lang === "fr" ? "Non spécifié" : "غير محدد"),
    }));
  }

  // Check if first row has headers
  const headers = matrix[0].map(h => h.toLowerCase().trim());
  const hasHeaders = headers.some(h => 
    ["الخدمة", "الاسم", "name", "service", "السعر", "سعر", "price", "cost", "الوصف", "التفاصيل", "description", "details", "nom", "tarif", "coût", "cout", "prestation", "détails"].includes(h)
  );

  let dataRows = matrix;
  let nameIdx = 0;
  let descIdx = 1;
  let priceIdx = 2;

  if (hasHeaders) {
    dataRows = matrix.slice(1);
    // Find column indexes
    const foundNameIdx = headers.findIndex(h => h.includes("الخدمة") || h.includes("الاسم") || h.includes("name") || h.includes("service") || h.includes("nom") || h.includes("prestation"));
    const foundDescIdx = headers.findIndex(h => h.includes("الوصف") || h.includes("التفاصيل") || h.includes("description") || h.includes("details") || h.includes("desc") || h.includes("détails"));
    const foundPriceIdx = headers.findIndex(h => h.includes("السعر") || h.includes("سعر") || h.includes("price") || h.includes("cost") || h.includes("tarif") || h.includes("coût") || h.includes("cout") || h.includes("montant"));

    if (foundNameIdx !== -1) nameIdx = foundNameIdx;
    if (foundDescIdx !== -1) descIdx = foundDescIdx;
    if (foundPriceIdx !== -1) priceIdx = foundPriceIdx;
  }

  return dataRows.map((row, index) => ({
    id: `service-import-${Date.now()}-${index}`,
    name: row[nameIdx] || (lang === "en" ? `Service ${index + 1}` : lang === "fr" ? `Service ${index + 1}` : `خدمة ${index + 1}`),
    description: row[descIdx] || "",
    price: row[priceIdx] || (lang === "en" ? "Unspecified" : lang === "fr" ? "Non spécifié" : "غير محدد"),
  }));
}

export function parseExcelOrCsvToGuidelines(text: string, lang: "ar" | "en" | "fr" = "ar"): ClinicGuideline[] {
  if (!text.trim()) return [];

  const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
  if (lines.length === 0) return [];

  const firstLine = lines[0];
  let delimiter = "\t"; 
  if (!firstLine.includes("\t") && firstLine.includes(",")) {
    delimiter = ",";
  } else if (!firstLine.includes("\t") && firstLine.includes(";")) {
    delimiter = ";";
  }

  const matrix = lines.map(line => {
    if (delimiter === ",") {
      const result = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    }
    return line.split(delimiter).map(cell => cell.trim().replace(/^"|"$/g, ""));
  });

  if (matrix.length < 2) {
    return matrix.map((row, index) => ({
      id: `guideline-${Date.now()}-${index}`,
      title: row[0] || (lang === "en" ? "General Guideline" : lang === "fr" ? "Directive Générale" : "إرشاد عام"),
      content: row[1] || "",
    }));
  }

  const headers = matrix[0].map(h => h.toLowerCase().trim());
  const hasHeaders = headers.some(h => 
    ["الموضوع", "العنوان", "title", "subject", "guideline", "الإرشادات", "التعليمات", "content", "details", "info", "sujet", "titre", "directive", "instruction", "contenu", "texte"].includes(h)
  );

  let dataRows = matrix;
  let titleIdx = 0;
  let contentIdx = 1;

  if (hasHeaders) {
    dataRows = matrix.slice(1);
    const foundTitleIdx = headers.findIndex(h => h.includes("الموضوع") || h.includes("العنوان") || h.includes("title") || h.includes("subject") || h.includes("sujet") || h.includes("titre") || h.includes("directive"));
    const foundContentIdx = headers.findIndex(h => h.includes("الإرشادات") || h.includes("التعليمات") || h.includes("content") || h.includes("details") || h.includes("text") || h.includes("contenu") || h.includes("texte") || h.includes("instruction"));

    if (foundTitleIdx !== -1) titleIdx = foundTitleIdx;
    if (foundContentIdx !== -1) contentIdx = foundContentIdx;
  }

  return dataRows.map((row, index) => ({
    id: `guideline-import-${Date.now()}-${index}`,
    title: row[titleIdx] || (lang === "en" ? `Guideline ${index + 1}` : lang === "fr" ? `Directive ${index + 1}` : `إرشاد ${index + 1}`),
    content: row[contentIdx] || "",
  }));
}
