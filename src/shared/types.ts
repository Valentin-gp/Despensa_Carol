export interface BusinessProfile {
  name: string;
  tagline: string;
  description: string;
  address: string;
  addressReference: string;
  city: string;
  phone: string;
  whatsapp: string;
  mapsUrl: string;
  facebookUrl: string;
  latitude: number | null;
  longitude: number | null;
  updatedAt: string;
}

export interface BusinessHour {
  dayOfWeek: number; // 0 = domingo ... 6 = sábado
  opens: string; // "07:00"
  closes: string; // "21:00"
  closed: boolean;
  note: string;
}

export interface ServiceItem {
  id: number;
  kind: 'servicio' | 'rubro';
  name: string;
  description: string;
}

export interface PaymentMethod {
  id: number;
  code: string;
  name: string;
  description: string;
  detail: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface Promotion {
  id: number;
  product: string;
  title: string;
  body: string;
  regularPrice: number | null;
  promoPrice: number | null;
  startsOn: string | null;
  endsOn: string | null;
  conditions: string;
}

export interface SiteData {
  profile: BusinessProfile;
  hours: BusinessHour[];
  services: ServiceItem[];
  paymentMethods: PaymentMethod[];
  faqs: Faq[];
  promotions: Promotion[];
}

export type ChatTopic = 'horario' | 'ubicacion' | 'pagos' | 'servicios' | 'promociones' | 'contacto';

export interface ChatRequest {
  message?: string;
  topic?: ChatTopic;
}

export interface ChatResponse {
  reply: string;
  source: 'datos' | 'ia';
}

export interface ApiErrorBody {
  error: string;
  message?: string;
}
