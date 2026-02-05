// Identité du restaurant
interface Identity {
  name: string;
  slogan?: string;
  logo?: string;
  type: "gastronomique" | "fast-food" | "café" | "bar" | "street-food"; // peut etre complété
}

// Informations de contact
interface Contact {
  whatsapp: string;
  phone?: string;
  email?: string;
  address?: string;
  google_maps?: string; // Lien Google Maps
}

// Élément de menu (plat ou boisson)
interface MenuItem {
  id: string;
  name: string;
  price: number;
  shortDescription?: string; // affichage carte
  fullDescription?: string; // page détail
  image?: string; // URL image
  available?: boolean; // default true
  categoryType?: "plat" | "boisson"; // pour filtrer si besoin
  // Champs pour page détail
  ingredients?: string[]; // ex: ["tomate", "mozzarella", "basilic"]
  allergens?: string[]; // ex: ["gluten", "lait"]
  accompaniments?: string[]; // ex: ["frites", "salade"]
  preparationTime?: string; // ex: "10-15 min"
  calories?: number; // kcal
  nutritionalInfo?: {
    proteins?: number;
    carbs?: number;
    fats?: number;
  };
  // Optionnel : variantes / tailles
  variants?: {
    name: string;
    priceDiff: number;
  }[];
}

// Catégorie de menu
interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

// Menu complet
interface Menu {
  currency: "FCFA" | "EUR" | "USD";
  categories: MenuCategory[];
}

// Informations business
interface OpeningHour {
  day: string; // Exemple: "Lundi"
  open: string; // Format "HH:MM"
  close: string; // Format "HH:MM"
}

interface Business {
  id: string;
  opening_hours?: OpeningHour[];
  delivery_fee?: number; // livraison
  services?: string[]; // Exemple: ["sur place", "à emporter", "livraison", service traiteur]
  capacity?: number; // Nombre de places assises
  payment_methods?: string[]; // Exemple: ["cash", "mobile money", "carte bancaire"]
}

// Apparence et design
interface Colors {
  primary: string; // Obligatoire
  secondary?: string; // Optionnel
}

interface BackgroundMedia {
  type: "image" | "video";
  url: string; // URL absolue (https://... ou /assets/...)
  alt?: string; // pour image
  poster?: string; // image de fallback pour vidéo (première frame)
  autoplay?: boolean; // default true
  muted?: boolean; // default true
  loop?: boolean; // default true
}

interface Appearance {
  template: "template1" | "template2" | "template3" | "template4";
  colors: Colors;
  show_images?: boolean;
  typography?: string;
  dark_mode?: boolean;
  hero_background?: BackgroundMedia; // hero général (accueil)
  menu_hero_background?: BackgroundMedia; // ← NOUVEAU : hero spécifique menu
}

// Marketing et communication
interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
}

interface Testimonial {
  author: string;
  text: string;
}

interface Promotion {
  title: string;
  description: string;
}

interface Marketing {
  newsletter?: boolean;
  social_links?: SocialLinks;
  testimonials?: Testimonial[];
  promotions?: Promotion[];
  seo_keywords?: string[];
}

// Analytics et suivi
interface Analytics {
  views: number; // Nombre de vues
  whatsapp_clicks: number; // Nombre de clics WhatsApp
  conversion_rate: number; // Pourcentage
  last_update: string; // Date ISO string
}

interface PageContent {
  title?: string;
  subtitle?: string;
  text?: string;
  images?: string[];
  videos?: string[];
}

interface Pages {
  home?: PageContent;
  about?: PageContent;
  menu?: Menu;
  team?: PageContent;
  gallery?: PageContent;
  faq?: { question: string; answer: string }[];
  contact?: PageContent;
  reservation?: PageContent;
  testimonials?: Testimonial[];
  services?: PageContent;
  blog?: { title: string; content: string; date: string; image?: string }[];
}

// Configuration principale du restaurant
export interface RestaurantConfig {
  id: string;
  slug: string;
  domain?: string;
  identity: Identity;
  contact: Contact;
  menu: Menu;
  business?: Business;
  appearance: Appearance;
  marketing?: Marketing;
  analytics?: Analytics;
  pages?: Pages;
}
