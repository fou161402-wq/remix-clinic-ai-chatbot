export interface ClinicInfo {
  name: string;
  specialty: string;
  phone: string;
  address: string;
  doctorName?: string;
  workHours?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
}

export interface ClinicService {
  id: string;
  name: string;
  description: string;
  price: string;
  duration?: string;
}

export interface ClinicGuideline {
  id: string;
  title: string;
  content: string;
  name?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  response: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot" | "doctor";
  text: string;
  timestamp: Date;
  isQuickAction?: boolean;
  isBookingCard?: boolean; // To show an interactive booking card inside the chat stream!
  image?: {
    data: string; // base64 string
    mimeType: string;
    previewUrl?: string;
  };
  audio?: {
    data: string; // base64 string
    mimeType: string;
    audioUrl?: string;
  };
}

export interface BookingReminder {
  id: string;
  timeBefore: string; // e.g. "30_mins", "2_hours", "1_day", "2_days"
  timeBeforeLabel: string; // e.g. "قبل الموعد بـ 30 دقيقة"
  message: string;
  scheduledTime: string; // ISO string or human-readable
  isSent: boolean;
  sentAt?: string;
}

export interface Booking {
  id: string;
  patientName: string;
  patientPhone: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  reminders?: BookingReminder[];
}

export interface ChatSession {
  id: string;
  patientName: string;
  patientPhone: string;
  topic: string;
  date: string;
  status: "reviewed" | "pending_review";
  messages: ChatMessage[];
  aiSentiment?: "satisfied" | "neutral" | "frustrated";
}

// SaaS Specific Types
export interface SubscriptionPlan {
  id: "free" | "starter" | "pro";
  name: string;
  price: number; // in SAR
  maxAppointments: number;
  features: string[];
}

export interface SaaSBilling {
  id: string;
  planId: "free" | "starter" | "pro";
  amount: number;
  date: string;
  status: "paid" | "failed";
}

export interface SaasTenant {
  id: string;
  email: string;
  password?: string;
  doctorName: string;
  clinicName: string;
  specialty: string;
  phone: string;
  address: string;
  workHours?: string;
  dailyStatus?: string;
  notes?: string;
  
  // Subscription info
  subscription: {
    planId: "free" | "starter" | "pro";
    status: "active" | "expired" | "past_due";
    createdAt: string;
    expiresAt: string;
    trialEndsAt?: string;
  };
  billingHistory: SaaSBilling[];
  
  // Clinic private database states
  services: ClinicService[];
  guidelines: ClinicGuideline[];
  quickActions: QuickAction[];
  bookings: Booking[];
  conversations: ChatSession[];
  
  // AI Settings
  aiTemperature: number;
  safeguardLevel: "strict" | "moderate";
  aiTone: "formal" | "friendly" | "simple";
}

