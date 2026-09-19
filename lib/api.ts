import { useAuthStore } from "./auth-store";
import type {
  AnalyticsDashboard,
  AuthUser,
  Backup,
  BasketBenchmark,
  ConversionFunnelStep,
  CreateRestaurantPayload,
  Faq,
  GalleryImage,
  ItemsPaginatedResult,
  LoginResponse,
  MenuCategory,
  MenuItem,
  OpeningHour,
  Order,
  OrderStats,
  PageConfig,
  PaginatedResult,
  Payment,
  PeakHour,
  Plan,
  PlatformStats,
  ProductPerformance,
  ProfileScore,
  Promotion,
  QueryParams,
  Report,
  Restaurant,
  RestaurantProfileScore,
  Subscription,
  SupportTicket,
  TeamMember,
  TemplatePerformance,
  Testimonial,
  TopMenuItem,
} from "./api-types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("zto_token");
}

function cleanParams(params: QueryParams) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  );
}

// Endpoints publics : un 401 ici est une réponse métier normale
// (mauvais identifiants, token de reset invalide...), pas une session
// expirée. Ils ne doivent jamais déclencher le mécanisme de refresh/logout.
const PUBLIC_AUTH_PATHS = [
  "/auth/login",
  "/auth/refresh",
  "/auth/forgot-password",
];

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken(); // access token
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...(options.headers as Record<string, string>),
  };

  let res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // Si 401 → tentative de refresh (jamais pour les endpoints publics)
  if (res.status === 401 && !PUBLIC_AUTH_PATHS.includes(path)) {
    const refreshToken = localStorage.getItem("zto_refresh_token");

    if (!refreshToken) {
      // Pas de refresh token → déconnexion
      useAuthStore.getState().logout();
      window.location.href = "/login";
      throw new Error("Session expirée");
    }

    if (isRefreshing) {
      // Attendre que le refresh en cours se termine
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => apiFetch(path, options));
    }

    isRefreshing = true;

    try {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!refreshRes.ok) throw new Error("Refresh failed");

      const { access_token, refresh_token } = await refreshRes.json();

      // Mise à jour du store + localStorage
      const { user } = useAuthStore.getState();
      if (user) {
        useAuthStore.getState().setAuth(user, access_token, refresh_token);
      }

      // Relancer les requêtes en file d’attente
      processQueue();

      // Réessayer la requête originale avec le nouveau token
      headers.Authorization = `Bearer ${access_token}`;
      res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    } catch (err) {
      processQueue(err);
      useAuthStore.getState().logout();
      window.location.href = "/login";
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    } finally {
      isRefreshing = false;
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || err?.message || `Erreur ${res.status}`,
    );
  }

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => apiFetch<AuthUser>("/auth/me"),
  logout: () => apiFetch("/auth/logout", { method: "POST" }),
  forgotPassword: (email: string) =>
    apiFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};

export const restaurantApi = {
  getMyInfo: () => apiFetch<Restaurant>("/resto-admin/my-restaurant"),
  updateIdentity: (d: Partial<Restaurant>) =>
    apiFetch("/resto-admin/my-restaurant/identity", {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
  updateContact: (d: Partial<Restaurant["contacts"]>) =>
    apiFetch("/resto-admin/my-restaurant/contact", {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
  updateOpeningHours: (d: OpeningHour[]) =>
    apiFetch("/resto-admin/my-restaurant/opening-hours", {
      method: "PUT",
      body: JSON.stringify(d),
    }),
  updateSocialLinks: (d: Partial<Restaurant["social_links"]>) =>
    apiFetch("/resto-admin/my-restaurant/social-links", {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
  updateDesign: (
    d: Partial<
      Pick<
        Restaurant,
        | "template"
        | "primary_color"
        | "secondary_color"
        | "font_family"
        | "show_images"
        | "dark_mode"
      >
    >,
  ) =>
    apiFetch("/resto-admin/my-restaurant/design", {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
};

export const menusApi = {
  getCategories: () =>
    apiFetch<MenuCategory[]>("/resto-admin/menus/categories"),
  createCategory: (d: Partial<MenuCategory>) =>
    apiFetch("/resto-admin/menus/categories", {
      method: "POST",
      body: JSON.stringify(d),
    }),
  updateCategory: (id: string, d: Partial<MenuCategory>) =>
    apiFetch(`/resto-admin/menus/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
  deleteCategory: (id: string) =>
    apiFetch(`/resto-admin/menus/categories/${id}`, { method: "DELETE" }),
  reorderCategories: (cats: { id: string; position: number }[]) =>
    apiFetch("/resto-admin/menus/categories/reorder", {
      method: "POST",
      body: JSON.stringify({ categories: cats }),
    }),
  getItems: (p?: QueryParams) => {
    const q = p
      ? "?" +
        new URLSearchParams(cleanParams(p) as Record<string, string>).toString()
      : "";
    return apiFetch<PaginatedResult<MenuItem>>(`/resto-admin/menus/items${q}`);
  },
  createItem: (fd: FormData) =>
    apiFetch("/resto-admin/menus/items", { method: "POST", body: fd }),
  updateItem: (id: string, fd: FormData) =>
    apiFetch(`/resto-admin/menus/items/${id}`, { method: "PATCH", body: fd }),
  deleteItem: (id: string) =>
    apiFetch(`/resto-admin/menus/items/${id}`, { method: "DELETE" }),
  toggleAvailability: (id: string, available: boolean) =>
    apiFetch(`/resto-admin/menus/items/${id}/availability`, {
      method: "PATCH",
      body: JSON.stringify({ available }),
    }),
};

export const galleryApi = {
  getAll: () => apiFetch<GalleryImage[]>("/resto-admin/gallery"),
  upload: (fd: FormData) =>
    apiFetch<GalleryImage>("/resto-admin/gallery/upload", {
      method: "POST",
      body: fd,
    }),
  reorder: (items: { id: string; position: number }[]) =>
    apiFetch("/resto-admin/gallery/reorder", {
      method: "POST",
      body: JSON.stringify({ items }),
    }),
  updateAltText: (id: string, alt_text: string) =>
    apiFetch(`/resto-admin/gallery/${id}/alt-text`, {
      method: "PATCH",
      body: JSON.stringify({ alt_text }),
    }),
  remove: (id: string) =>
    apiFetch(`/resto-admin/gallery/${id}`, { method: "DELETE" }),
  removeAll: () => apiFetch("/resto-admin/gallery", { method: "DELETE" }),
};

export const ordersApi = {
  getStats: () => apiFetch<OrderStats>("/resto-admin/orders/stats"),
};

export const analyticsApi = {
  getDashboard: () =>
    apiFetch<AnalyticsDashboard>("/resto-admin/analytics/dashboard"),
  getStats: () => apiFetch<AnalyticsDashboard>("/resto-admin/analytics/stats"),
  getPeakHours: () =>
    apiFetch<PeakHour[]>("/resto-admin/intelligence/peak-hours"),
  getTopItems: () =>
    apiFetch<TopMenuItem[]>("/resto-admin/intelligence/top-items"),
  getConversionFunnel: () =>
    apiFetch<ConversionFunnelStep[]>(
      "/resto-admin/intelligence/conversion-funnel",
    ),
  getProfileScore: () =>
    apiFetch<ProfileScore>("/resto-admin/intelligence/profile-score"),
};

export const faqApi = {
  getAll: () => apiFetch<Faq[]>("/resto-admin/faq"),
  create: (d: Partial<Faq>) =>
    apiFetch("/resto-admin/faq", { method: "POST", body: JSON.stringify(d) }),
  update: (id: string, d: Partial<Faq>) =>
    apiFetch(`/resto-admin/faq/${id}`, {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
  reorder: (items: { id: string; position: number }[]) =>
    apiFetch("/resto-admin/faq/reorder", {
      method: "POST",
      body: JSON.stringify({ items }),
    }),
  remove: (id: string) =>
    apiFetch(`/resto-admin/faq/${id}`, { method: "DELETE" }),
};

export const promotionsApi = {
  getAll: () => apiFetch<Promotion[]>("/resto-admin/promotions"),
  create: (d: Partial<Promotion>) =>
    apiFetch("/resto-admin/promotions", {
      method: "POST",
      body: JSON.stringify(d),
    }),
  update: (id: string, d: Partial<Promotion>) =>
    apiFetch(`/resto-admin/promotions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
  toggle: (id: string, active: boolean) =>
    apiFetch(`/resto-admin/promotions/${id}/toggle`, {
      method: "PATCH",
      body: JSON.stringify({ active }),
    }),
  remove: (id: string) =>
    apiFetch(`/resto-admin/promotions/${id}`, { method: "DELETE" }),
};

export const businessInfoApi = {
  get: () =>
    apiFetch<Restaurant["business_info"]>("/resto-admin/business-info"),
  update: (d: Partial<Restaurant["business_info"]>) =>
    apiFetch("/resto-admin/business-info", {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
};

export const subscriptionApi = {
  getMy: () => apiFetch<Subscription>("/resto-admin/subscription/my"),
  getPlans: () => apiFetch<Plan[]>("/plans"),
};

export const superAdminApi = {
  getRestaurants: (p?: QueryParams) => {
    const q = p
      ? "?" +
        new URLSearchParams(cleanParams(p) as Record<string, string>).toString()
      : "";
    return apiFetch<ItemsPaginatedResult<Restaurant>>(
      `/super-admin/restaurants${q}`,
    );
  },
  createRestaurant: (d: CreateRestaurantPayload) =>
    apiFetch("/super-admin/restaurants", {
      method: "POST",
      body: JSON.stringify(d),
    }),
  updateStatus: (id: string, status: string) =>
    apiFetch(`/super-admin/restaurants/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  hardDelete: (id: string) =>
    apiFetch(`/super-admin/restaurants/${id}/hard-delete`, {
      method: "DELETE",
    }),
  getPlatformStats: () =>
    apiFetch<PlatformStats>("/super-admin/analytics/platform-stats"),
  getProductPerformance: () =>
    apiFetch<ProductPerformance>("/super-admin/analytics/product-performance"),
  getAllOrders: (page = 1) =>
    apiFetch<PaginatedResult<Order>>(`/super-admin/orders?page=${page}`),
  getPeakHours: () =>
    apiFetch<PeakHour[]>("/super-admin/intelligence/peak-hours"),
  getBasketBenchmark: () =>
    apiFetch<BasketBenchmark>("/super-admin/intelligence/basket-benchmark"),
  getTemplatePerformance: () =>
    apiFetch<TemplatePerformance[]>(
      "/super-admin/intelligence/template-performance",
    ),
  getProfileScores: () =>
    apiFetch<RestaurantProfileScore[]>(
      "/super-admin/intelligence/profile-scores",
    ),
  getPayments: (page = 1) =>
    apiFetch<PaginatedResult<Payment>>(`/super-admin/payments?page=${page}`),
  listBackups: () => apiFetch<Backup[]>("/super-admin/backup"),
  triggerBackup: () =>
    apiFetch("/super-admin/backup/trigger", { method: "POST" }),
  getSupportTickets: () =>
    apiFetch<SupportTicket[]>("/super-admin/support/tickets"),
  replyTicket: (id: string, content: string) =>
    apiFetch(`/super-admin/support/tickets/${id}/reply`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    }),
  getReports: () => apiFetch<Report[]>("/super-admin/reports"),
  updateReportStatus: (id: string, status: string) =>
    apiFetch(`/super-admin/reports/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

// ─── Extensions super-admin pour la gestion complète des restaurants ──────────
export const superAdminRestaurantApi = {
  getById: (id: string) =>
    apiFetch<Restaurant>(`/super-admin/restaurants/${id}`),
  resetAdminPassword: (id: string) =>
    apiFetch(`/super-admin/restaurants/${id}/reset-password`, {
      method: "POST",
    }),
  updateIdentity: (id: string, d: Partial<Restaurant>) =>
    apiFetch(`/super-admin/restaurants/${id}/identity`, {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
  updateDesign: (
    id: string,
    d: Partial<
      Pick<
        Restaurant,
        | "template"
        | "primary_color"
        | "secondary_color"
        | "font_family"
        | "show_images"
        | "dark_mode"
      >
    >,
  ) =>
    apiFetch(`/super-admin/restaurants/${id}/design`, {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
  updateStatus: (id: string, status: string) =>
    apiFetch(`/super-admin/restaurants/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  hardDelete: (id: string) =>
    apiFetch(`/super-admin/restaurants/${id}/hard-delete`, {
      method: "DELETE",
    }),
  getMenuCategories: (restaurantId: string) =>
    apiFetch<MenuCategory[]>(
      `/super-admin/restaurants/${restaurantId}/menus/categories`,
    ),
  getAnalytics: (restaurantId: string) =>
    apiFetch<AnalyticsDashboard>(
      `/super-admin/analytics/restaurant/${restaurantId}/dashboard`,
    ),
};

// ─── TEAM ─────────────────────────────────────────────────────────────────────

export const teamApi = {
  getAll: () => apiFetch<TeamMember[]>("/resto-admin/team"),
  create: (d: Partial<TeamMember>) =>
    apiFetch("/resto-admin/team", { method: "POST", body: JSON.stringify(d) }),
  update: (id: string, d: Partial<TeamMember>) =>
    apiFetch(`/resto-admin/team/${id}`, {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
  remove: (id: string) =>
    apiFetch(`/resto-admin/team/${id}`, { method: "DELETE" }),
};

// ─── PAGE CONFIG ──────────────────────────────────────────────────────────────

export const pageConfigApi = {
  getAll: () => apiFetch<PageConfig[]>("/resto-admin/page-config"),
  getOne: (slug: string) =>
    apiFetch<PageConfig>(`/resto-admin/page-config/${slug}`),
  update: (slug: string, d: Partial<PageConfig>) =>
    apiFetch(`/resto-admin/page-config/${slug}`, {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
  uploadHeroMedia: (slug: string, fd: FormData) =>
    apiFetch(`/resto-admin/page-config/${slug}/hero-media`, {
      method: "POST",
      body: fd,
    }),
  removeHeroMedia: (slug: string) =>
    apiFetch(`/resto-admin/page-config/${slug}/hero-media`, {
      method: "DELETE",
    }),
  remove: (slug: string) =>
    apiFetch(`/resto-admin/page-config/${slug}`, { method: "DELETE" }),
};

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

export const testimonialsApi = {
  getAll: (restaurantId: string) =>
    apiFetch<Testimonial[]>(`/testimonials/${restaurantId}`),
  toggleVisibility: (id: string, visible: boolean) =>
    apiFetch(`/resto-admin/testimonials/${id}/visibility`, {
      method: "PATCH",
      body: JSON.stringify({ visible }),
    }),
  remove: (id: string) =>
    apiFetch(`/resto-admin/testimonials/${id}`, { method: "DELETE" }),
};

// ─── SUPER ADMIN — restaurant detail tabs ─────────────────────────────────────

export const saRestaurantDetailApi = {
  // Menus
  getCategories: (rid: string) =>
    apiFetch<MenuCategory[]>(
      `/super-admin/restaurants/${rid}/menus/categories`,
    ),
  // Business info
  getBusinessInfo: (rid: string) =>
    apiFetch<Restaurant["business_info"]>(
      `/super-admin/restaurants/${rid}/business-info`,
    ),
  updateBusinessInfo: (rid: string, d: Partial<Restaurant["business_info"]>) =>
    apiFetch(`/super-admin/restaurants/${rid}/business-info`, {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
  // Page config
  getPageConfigs: (rid: string) =>
    apiFetch<PageConfig[]>(`/super-admin/restaurants/${rid}/page-config`),
  // Team
  getTeam: (rid: string) =>
    apiFetch<TeamMember[]>(`/super-admin/restaurants/${rid}/team`),
  // Testimonials
  getTestimonials: (rid: string) =>
    apiFetch<Testimonial[]>(`/super-admin/restaurants/${rid}/testimonials`),
  // Subscriptions assign
  assignSubscription: (d: {
    restaurantId: string;
    planId: string;
    status?: string;
  }) =>
    apiFetch("/super-admin/subscriptions/assign", {
      method: "POST",
      body: JSON.stringify(d),
    }),
  getPlans: () => apiFetch<Plan[]>("/plans"),
};
