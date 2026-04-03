const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("zto_token");
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

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
    apiFetch<{ access_token: string; refresh_token: string; user: any }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    ),
  me: () => apiFetch<any>("/auth/me"),
  logout: () => apiFetch("/auth/logout", { method: "POST" }),
  forgotPassword: (email: string) =>
    apiFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};

export const restaurantApi = {
  getMyInfo: () => apiFetch<any>("/resto-admin/my-restaurant"),
  updateIdentity: (d: any) =>
    apiFetch("/resto-admin/my-restaurant/identity", {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
  updateContact: (d: any) =>
    apiFetch("/resto-admin/my-restaurant/contact", {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
  updateOpeningHours: (d: any[]) =>
    apiFetch("/resto-admin/my-restaurant/opening-hours", {
      method: "PUT",
      body: JSON.stringify(d),
    }),
  updateSocialLinks: (d: any) =>
    apiFetch("/resto-admin/my-restaurant/social-links", {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
  updateDesign: (d: any) =>
    apiFetch("/resto-admin/my-restaurant/design", {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
};

export const menusApi = {
  getCategories: () => apiFetch<any[]>("/resto-admin/menus/categories"),
  createCategory: (d: any) =>
    apiFetch("/resto-admin/menus/categories", {
      method: "POST",
      body: JSON.stringify(d),
    }),
  updateCategory: (id: string, d: any) =>
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
  getItems: (p?: any) => {
    const q = p ? "?" + new URLSearchParams(p).toString() : "";
    return apiFetch<{ data: any[]; meta: any }>(`/resto-admin/menus/items${q}`);
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
  getAll: () => apiFetch<any[]>("/resto-admin/gallery"),
  upload: (fd: FormData) =>
    apiFetch<any>("/resto-admin/gallery/upload", { method: "POST", body: fd }),
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
  getStats: () => apiFetch<any>("/resto-admin/orders/stats"),
};

export const analyticsApi = {
  getDashboard: () => apiFetch<any>("/resto-admin/analytics/dashboard"),
  getStats: () => apiFetch<any>("/resto-admin/analytics/stats"),
  getPeakHours: () => apiFetch<any[]>("/resto-admin/intelligence/peak-hours"),
  getTopItems: () => apiFetch<any[]>("/resto-admin/intelligence/top-items"),
  getConversionFunnel: () =>
    apiFetch<any[]>("/resto-admin/intelligence/conversion-funnel"),
  getProfileScore: () =>
    apiFetch<any>("/resto-admin/intelligence/profile-score"),
};

export const faqApi = {
  getAll: () => apiFetch<any[]>("/resto-admin/faq"),
  create: (d: any) =>
    apiFetch("/resto-admin/faq", { method: "POST", body: JSON.stringify(d) }),
  update: (id: string, d: any) =>
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
  getAll: () => apiFetch<any[]>("/resto-admin/promotions"),
  create: (d: any) =>
    apiFetch("/resto-admin/promotions", {
      method: "POST",
      body: JSON.stringify(d),
    }),
  update: (id: string, d: any) =>
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
  get: () => apiFetch<any>("/resto-admin/business-info"),
  update: (d: any) =>
    apiFetch("/resto-admin/business-info", {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
};

export const subscriptionApi = {
  getMy: () => apiFetch<any>("/resto-admin/subscription/my"),
  getPlans: () => apiFetch<any[]>("/plans"),
};

export const superAdminApi = {
  getRestaurants: (p?: any) => {
    const q = p ? "?" + new URLSearchParams(p).toString() : "";
    return apiFetch<any>(`/super-admin/restaurants${q}`);
  },
  createRestaurant: (d: any) =>
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
    apiFetch<any>("/super-admin/analytics/platform-stats"),
  getProductPerformance: () =>
    apiFetch<any>("/super-admin/analytics/product-performance"),
  getAllOrders: (page = 1) => apiFetch<any>(`/super-admin/orders?page=${page}`),
  getPeakHours: () => apiFetch<any[]>("/super-admin/intelligence/peak-hours"),
  getBasketBenchmark: () =>
    apiFetch<any>("/super-admin/intelligence/basket-benchmark"),
  getTemplatePerformance: () =>
    apiFetch<any[]>("/super-admin/intelligence/template-performance"),
  getProfileScores: () =>
    apiFetch<any[]>("/super-admin/intelligence/profile-scores"),
  getPayments: (page = 1) =>
    apiFetch<any>(`/super-admin/payments?page=${page}`),
  listBackups: () => apiFetch<any[]>("/super-admin/backup"),
  triggerBackup: () =>
    apiFetch("/super-admin/backup/trigger", { method: "POST" }),
  getSupportTickets: () => apiFetch<any[]>("/super-admin/support/tickets"),
  replyTicket: (id: string, content: string) =>
    apiFetch(`/super-admin/support/tickets/${id}/reply`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    }),
  getReports: () => apiFetch<any[]>("/super-admin/reports"),
  updateReportStatus: (id: string, status: string) =>
    apiFetch(`/super-admin/reports/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
