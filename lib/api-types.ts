// Types miroir des modèles Prisma du backend (zero-to-one-api/prisma/schema.prisma).
// Ce fichier ne couvre que les champs consommés par le frontend.

export type Role = "SUPER_ADMIN" | "RESTO_ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  restaurantId?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export interface Contact {
  restaurant_id?: string;
  whatsapp: string;
  phone?: string;
  email?: string;
  address?: string;
  google_maps_url?: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
}

export interface BusinessInfo {
  delivery_fee?: number;
  services?: string[];
  capacity?: number;
  payment_methods?: string[];
}

export interface OpeningHour {
  id?: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed?: boolean;
}

export interface PageConfig {
  id: string;
  restaurant_id: string;
  page_slug: string;
  hero_media_type: "image" | "video";
  hero_media_url: string;
  hero_poster_url?: string;
  hero_autoplay?: boolean;
  hero_muted?: boolean;
  hero_loop?: boolean;
  page_title?: string;
  page_subtitle?: string;
  page_text?: string;
  page_images?: string[];
  page_videos?: string[];
  updated_at?: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id?: string;
  name: string;
  position: number;
  icon?: string;
  // Présent sur GET /resto-admin/menus/categories (items nichés) ; absent
  // sur GET /super-admin/.../menus/categories (résumé avec _count uniquement).
  menu_items?: MenuItem[];
  _count?: { items?: number };
}

export interface MenuItemVariant {
  name: string;
  priceDiff: number;
}

export interface MenuNutritionalInfo {
  proteins?: number;
  carbs?: number;
  fats?: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  restaurant_id?: string;
  name: string;
  short_description?: string;
  full_description?: string;
  price: number;
  image_url?: string;
  available: boolean;
  category_type: "plat" | "boisson";
  ingredients?: string[];
  allergens?: string[];
  accompaniments?: string[];
  preparation_time?: string;
  calories?: number;
  nutritional_info?: MenuNutritionalInfo;
  variants?: MenuItemVariant[];
  position?: number;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryImage {
  id: string;
  restaurant_id?: string;
  image_url: string;
  alt_text?: string;
  position: number;
}

export interface Testimonial {
  id: string;
  restaurant_id?: string;
  author: string;
  text: string;
  rating: number;
  visible: boolean;
  created_at?: string;
}

export interface Promotion {
  id: string;
  restaurant_id?: string;
  title: string;
  description?: string;
  active: boolean;
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  billing_period: string;
  custom_domain: boolean;
  max_menu_items: number;
  analytics: boolean;
  features: Record<string, unknown>;
  active: boolean;
}

export interface Subscription {
  id: string;
  restaurant_id: string;
  plan_id: string;
  plan?: Plan;
  start_date: string;
  end_date: string;
  status: string;
  created_at?: string;
}

export interface Payment {
  id: string;
  restaurant_id: string;
  restaurant?: string;
  subscription_id?: string;
  amount: number;
  method: string;
  status: string;
  transaction_ref?: string;
  paid_at?: string;
  created_at?: string;
}

export interface Faq {
  id: string;
  restaurant_id?: string;
  question: string;
  answer: string;
  position: number;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMember {
  id: string;
  restaurant_id?: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  position: number;
  created_at?: string;
  updated_at?: string;
}

export interface SupportMessage {
  id: string | number;
  ticket_id?: string;
  sender_id?: string;
  sender_role?: "SUPER_ADMIN" | "RESTO_ADMIN" | string;
  content: string;
  is_admin?: boolean;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED" | "RESOLVED" | string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  restaurant_id: string;
  restaurant?: { name: string };
  messages?: SupportMessage[];
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  subject?: string;
  type: "BUG" | "CONTENT" | "PAYMENT" | "OTHER" | string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  description: string;
  page_url?: string;
  status: "PENDING" | "INVESTIGATING" | "FIXED" | "REJECTED" | string;
  restaurant_id: string;
  restaurant?: { name: string };
  reporter_id: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id?: string;
  item_id: string;
  name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderStatusCount {
  status: string;
  count: number;
}

export interface OrderStats {
  by_status: OrderStatusCount[];
  total_orders: number;
  potential_revenue: number;
  recent_orders: Order[];
}

export interface Order {
  id: string;
  short_id: string;
  restaurant_id: string;
  customer_phone?: string;
  note?: string;
  total_amount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  slogan?: string;
  logo_url?: string;
  type: string;
  template: string;
  primary_color: string;
  secondary_color?: string;
  font_family?: string;
  show_images: boolean;
  dark_mode: boolean;
  currency: string;
  seo_keywords?: string[];
  newsletter_enabled: boolean;
  status: string;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
  contacts?: Contact;
  social_links?: SocialLinks;
  business_info?: BusinessInfo;
  opening_hours?: OpeningHour[];
  custom_domains?: {
    id: string;
    hostname: string;
    isPrimary: boolean;
  }[];
}

interface PageMeta {
  total: number;
  page: number;
  limit: number;
  lastPage?: number;
  [key: string]: unknown;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PageMeta;
}

// GET /super-admin/restaurants pagine avec `items`, pas `data`.
export interface ItemsPaginatedResult<T> {
  items: T[];
  meta: PageMeta;
}

export interface CreateRestaurantPayload {
  adminEmail: string;
  name: string;
  type: string;
  template: string;
  primaryColor: string;
  currency: string;
}

export interface AnalyticsSummary {
  totalViews?: number;
  whatsappClicks?: number;
  conversionRate?: number;
  [key: string]: unknown;
}

export interface AnalyticsDashboard {
  summary?: AnalyticsSummary;
  [key: string]: unknown;
}

export interface PeakHour {
  hour: number;
  label: string;
  orders: number;
  revenue: number;
}

export interface TopMenuItem {
  name: string;
  times_ordered: number;
  total_revenue: number;
}

export interface ConversionFunnelStep {
  label: string;
  views: number;
  [key: string]: unknown;
}

export interface ProfileScore {
  score: number;
  missing?: string[];
}

export interface PlatformStatsOverview {
  totalRestaurants?: number;
  activeSubscriptions?: number;
  totalRevenue?: number;
  monthlyRevenue?: number;
  totalOrders?: number;
  conversionRate?: string;
  [key: string]: unknown;
}

export interface PlatformStatsPayment {
  id: string;
  restaurant: string;
  method: string;
  date: string;
  amount: number;
  status: string;
}

export interface PlatformStats {
  overview?: PlatformStatsOverview;
  mrr_history?: { month: string; mrr: number }[];
  recentPayments?: PlatformStatsPayment[];
  [key: string]: unknown;
}

export interface Backup {
  id: string;
  status: "SUCCESS" | "FAILED" | string;
  created_at: string;
  filename?: string;
  file_size?: number;
  cloudinary_url?: string;
}

export interface ProductPerformance {
  by_plan?: { plan: string; revenue: number }[];
  top_restaurants?: { name: string; orders: number; revenue: number }[];
}

export interface BasketBenchmark {
  platform?: { avg_basket: number };
  by_restaurant?: { name: string; avg_basket: number }[];
}

export interface TemplatePerformance {
  template: string;
  restaurants: number;
  avg_basket: number;
  total_orders?: number;
}

export interface RestaurantProfileScore {
  restaurant_id: string;
  name: string;
  score: number;
}

// Filtres de listing (query params), simples clés scalaires.
export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;
