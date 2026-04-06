"use client";

import { useEffect, useState, useCallback } from "react";
import { superAdminApi, superAdminRestaurantApi } from "@/lib/api";
import {
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Store,
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  RefreshCw,
  Trash2,
  KeyRound,
  LayoutDashboard,
  Palette,
  BarChart2,
  AlertTriangle,
  Copy,
  Check,
  Globe,
  Mail,
  Phone,
  Calendar,
  Tag,
  Layers,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Status = "active" | "suspended" | "incomplete";

const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; bg: string }
> = {
  active: { label: "Actif", color: "#22c55e", bg: "#22c55e15" },
  suspended: { label: "Suspendu", color: "#ef4444", bg: "#ef444415" },
  incomplete: { label: "Incomplet", color: "#f59e0b", bg: "#f59e0b15" },
};

const TEMPLATES = [
  "default",
  "template1",
  "template2",
  "template3",
  "template4",
  "classic",
  "modern",
  "minimalist",
];
const CURRENCIES = ["XOF", "EUR", "USD", "GBP", "MAD", "NGN", "GHS"];

// ─── Petit utilitaire copier ─────────────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="text-emerald-800 hover:text-emerald-500 transition-colors"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

// ─── Drawer détails restaurant ────────────────────────────────────────────────
function RestaurantDrawer({
  restaurant,
  onClose,
  onRefresh,
}: {
  restaurant: any;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [tab, setTab] = useState<"infos" | "design" | "analytics" | "danger">(
    "infos",
  );
  const [detail, setDetail] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [menuCategories, setMenuCategories] = useState<any[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  // ─── Formulaire identité ───────────────────────────────────────────────
  const [formIdentity, setFormIdentity] = useState({
    name: restaurant.name || "",
    type: restaurant.type || "",
    currency: restaurant.currency || "XOF",
  });

  // ─── Formulaire design ────────────────────────────────────────────────
  const [formDesign, setFormDesign] = useState({
    primary_color: restaurant.primary_color || "#22c55e",
    secondary_color: restaurant.secondary_color || "#ffffff",
    font_family: restaurant.font_family || "Inter",
    template: restaurant.template || "default",
    dark_mode: restaurant.dark_mode ?? false,
  });

  // ─── Danger zone ──────────────────────────────────────────────────────
  const [confirmDelete, setConfirmDelete] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [resettingPwd, setResettingPwd] = useState(false);

  const showMsg = (type: "ok" | "err", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  };

  // Charger les détails complets
  useEffect(() => {
    setLoadingDetail(true);
    Promise.all([
      superAdminRestaurantApi.getById(restaurant.id),
      superAdminRestaurantApi.getMenuCategories(restaurant.id).catch(() => []),
      tab === "analytics"
        ? superAdminRestaurantApi.getAnalytics(restaurant.id).catch(() => null)
        : Promise.resolve(null),
    ])
      .then(([det, cats, ana]) => {
        setDetail(det);
        setMenuCategories(cats);
        if (ana) setAnalytics(ana);
        setFormIdentity({
          name: det.name || "",
          type: det.type || "",
          currency: det.currency || "XOF",
        });
        setFormDesign({
          primary_color: det.primary_color || "#22c55e",
          secondary_color: det.secondary_color || "#ffffff",
          font_family: det.font_family || "Inter",
          template: det.template || "default",
          dark_mode: det.dark_mode ?? false,
        });
      })
      .finally(() => setLoadingDetail(false));
  }, [restaurant.id]);

  // Charger analytics quand on va sur cet onglet
  useEffect(() => {
    if (tab === "analytics" && !analytics) {
      superAdminRestaurantApi
        .getAnalytics(restaurant.id)
        .then(setAnalytics)
        .catch(() => {});
    }
  }, [tab]);

  const saveIdentity = async () => {
    setSaving(true);
    try {
      await superAdminRestaurantApi.updateIdentity(restaurant.id, formIdentity);
      showMsg("ok", "Identité mise à jour ✓");
      onRefresh();
    } catch (e: any) {
      showMsg("err", e.message || "Erreur");
    }
    setSaving(false);
  };

  const saveDesign = async () => {
    setSaving(true);
    try {
      await superAdminRestaurantApi.updateDesign(restaurant.id, formDesign);
      showMsg("ok", "Design mis à jour ✓");
      onRefresh();
    } catch (e: any) {
      showMsg("err", e.message || "Erreur");
    }
    setSaving(false);
  };

  const changeStatus = async (status: Status) => {
    try {
      await superAdminRestaurantApi.updateStatus(restaurant.id, status);
      showMsg("ok", `Statut changé → ${status}`);
      onRefresh();
    } catch (e: any) {
      showMsg("err", e.message || "Erreur");
    }
  };

  const resetPassword = async () => {
    setResettingPwd(true);
    try {
      await superAdminRestaurantApi.resetAdminPassword(restaurant.id);
      showMsg("ok", "Email de reset envoyé ✓");
    } catch (e: any) {
      showMsg("err", e.message || "Erreur");
    }
    setResettingPwd(false);
  };

  const hardDelete = async () => {
    if (confirmDelete !== restaurant.slug) return;
    setDeleting(true);
    try {
      await superAdminRestaurantApi.hardDelete(restaurant.id);
      onClose();
      onRefresh();
    } catch (e: any) {
      showMsg("err", e.message || "Erreur suppression");
      setDeleting(false);
    }
  };

  const sc =
    STATUS_CONFIG[restaurant.status as Status] || STATUS_CONFIG.incomplete;

  const TABS = [
    { id: "infos", label: "Infos", icon: LayoutDashboard },
    { id: "design", label: "Design", icon: Palette },
    { id: "analytics", label: "Stats", icon: BarChart2 },
    { id: "danger", label: "Danger", icon: AlertTriangle },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-2xl bg-[#060f09] border-l border-emerald-900/40 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-emerald-900/30">
          <div className="flex items-center gap-3">
            {restaurant.logo_url ? (
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="w-10 h-10 rounded-xl object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Store size={16} className="text-emerald-600" />
              </div>
            )}
            <div>
              <h2 className="text-white font-bold text-base">
                {restaurant.name}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs text-emerald-700">
                  {restaurant.slug}
                </span>
                <CopyBtn text={restaurant.slug} />
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ color: sc.color, backgroundColor: sc.bg }}
                >
                  {sc.label}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/${restaurant.slug}`}
              target="_blank"
              className="p-1.5 text-emerald-700 hover:text-emerald-400 transition-colors"
              title="Voir le site"
            >
              <ExternalLink size={16} />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-700 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Toast */}
        {msg && (
          <div
            className={`mx-6 mt-4 px-4 py-2.5 rounded-lg text-sm font-medium ${
              msg.type === "ok"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex px-6 pt-4 gap-1 border-b border-emerald-900/30">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-colors ${
                tab === id
                  ? "text-emerald-300 border-b-2 border-emerald-500 -mb-px bg-emerald-500/5"
                  : "text-emerald-700 hover:text-emerald-500"
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loadingDetail ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-emerald-700" size={24} />
            </div>
          ) : // ── INFOS ──────────────────────────────────────────────────────
          tab === "infos" ? (
            <div className="space-y-6">
              {/* Statut rapide */}
              <div>
                <p className="text-emerald-700 text-xs font-medium uppercase tracking-wider mb-3">
                  Statut
                </p>
                <div className="flex gap-2">
                  {(["active", "suspended", "incomplete"] as Status[]).map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => changeStatus(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          restaurant.status === s
                            ? "border-current"
                            : "border-transparent opacity-50 hover:opacity-80"
                        }`}
                        style={{
                          color: STATUS_CONFIG[s].color,
                          backgroundColor: STATUS_CONFIG[s].bg,
                          borderColor:
                            restaurant.status === s
                              ? STATUS_CONFIG[s].color
                              : "transparent",
                        }}
                      >
                        {STATUS_CONFIG[s].label}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Identité */}
              <div>
                <p className="text-emerald-700 text-xs font-medium uppercase tracking-wider mb-3">
                  Identité
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-emerald-800 text-xs mb-1">
                      Nom du restaurant
                    </label>
                    <input
                      value={formIdentity.name}
                      onChange={(e) =>
                        setFormIdentity({
                          ...formIdentity,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-emerald-900/20 border border-emerald-900/40 text-emerald-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-emerald-800 text-xs mb-1">
                        Type
                      </label>
                      <input
                        value={formIdentity.type}
                        onChange={(e) =>
                          setFormIdentity({
                            ...formIdentity,
                            type: e.target.value,
                          })
                        }
                        placeholder="Africain, Sushi..."
                        className="w-full bg-emerald-900/20 border border-emerald-900/40 text-emerald-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-emerald-800 text-xs mb-1">
                        Devise
                      </label>
                      <select
                        value={formIdentity.currency}
                        onChange={(e) =>
                          setFormIdentity({
                            ...formIdentity,
                            currency: e.target.value,
                          })
                        }
                        className="w-full bg-emerald-900/20 border border-emerald-900/40 text-emerald-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={saveIdentity}
                    disabled={saving}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : null}
                    Enregistrer
                  </button>
                </div>
              </div>

              {/* Infos techniques */}
              <div>
                <p className="text-emerald-700 text-xs font-medium uppercase tracking-wider mb-3">
                  Informations
                </p>
                <div className="bg-emerald-900/10 rounded-xl p-4 space-y-2.5">
                  {[
                    { icon: Tag, label: "ID", value: detail?.id },
                    { icon: Globe, label: "Slug", value: detail?.slug },
                    {
                      icon: Layers,
                      label: "Template",
                      value: detail?.template,
                    },
                    {
                      icon: Calendar,
                      label: "Créé le",
                      value: detail?.created_at
                        ? new Date(detail.created_at).toLocaleDateString(
                            "fr-FR",
                            { day: "2-digit", month: "long", year: "numeric" },
                          )
                        : "—",
                    },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 text-emerald-700 text-xs">
                        <Icon size={12} /> {label}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-emerald-500">
                          {value || "—"}
                        </span>
                        {value && <CopyBtn text={String(value)} />}
                      </div>
                    </div>
                  ))}
                  {detail?.custom_domains?.length > 0 && (
                    <div>
                      <p className="text-emerald-800 text-xs mb-1.5 flex items-center gap-1">
                        <Globe size={11} /> Domaines personnalisés
                      </p>
                      {detail.custom_domains.map((d: any) => (
                        <div key={d.id} className="flex items-center gap-1.5">
                          <span className="font-mono text-xs text-emerald-600">
                            {d.hostname}
                          </span>
                          {d.isPrimary && (
                            <span className="text-xs text-emerald-700 bg-emerald-900/30 px-1.5 rounded">
                              primaire
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Catégories menu */}
              {menuCategories.length > 0 && (
                <div>
                  <p className="text-emerald-700 text-xs font-medium uppercase tracking-wider mb-3">
                    Menu · {menuCategories.length} catégorie
                    {menuCategories.length > 1 ? "s" : ""}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {menuCategories.map((cat: any) => (
                      <span
                        key={cat.id}
                        className="px-2.5 py-1 bg-emerald-900/20 text-emerald-600 text-xs rounded-lg border border-emerald-900/30"
                      >
                        {cat.name}
                        {cat._count?.items != null && (
                          <span className="ml-1 text-emerald-800">
                            ({cat._count.items})
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reset mot de passe */}
              <div className="pt-2 border-t border-emerald-900/30">
                <button
                  onClick={resetPassword}
                  disabled={resettingPwd}
                  className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-400 transition-colors disabled:opacity-50"
                >
                  {resettingPwd ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <KeyRound size={14} />
                  )}
                  Envoyer un email de reset mot de passe à l'admin
                </button>
              </div>
            </div>
          ) : // ── DESIGN ──────────────────────────────────────────────────────
          tab === "design" ? (
            <div className="space-y-5">
              <p className="text-emerald-700 text-xs font-medium uppercase tracking-wider">
                Design & Apparence
              </p>

              {/* Aperçu couleurs */}
              <div className="flex items-center gap-3 p-4 bg-emerald-900/10 rounded-xl border border-emerald-900/30">
                <div
                  className="w-12 h-12 rounded-xl border-2 border-white/10"
                  style={{ backgroundColor: formDesign.primary_color }}
                />
                <div
                  className="w-12 h-12 rounded-xl border-2 border-white/10"
                  style={{ backgroundColor: formDesign.secondary_color }}
                />
                <div>
                  <p className="text-emerald-400 text-sm font-medium">
                    {formDesign.template}
                  </p>
                  <p className="text-emerald-700 text-xs">
                    {formDesign.font_family} ·{" "}
                    {formDesign.dark_mode ? "Dark" : "Light"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-800 text-xs mb-1.5">
                    Couleur principale
                  </label>
                  <div className="relative h-10 border border-emerald-900/40 rounded-lg overflow-hidden">
                    <input
                      type="color"
                      value={formDesign.primary_color}
                      onChange={(e) =>
                        setFormDesign({
                          ...formDesign,
                          primary_color: e.target.value,
                        })
                      }
                      className="absolute inset-0 w-full h-full cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-emerald-800 text-xs mb-1.5">
                    Couleur secondaire
                  </label>
                  <div className="relative h-10 border border-emerald-900/40 rounded-lg overflow-hidden">
                    <input
                      type="color"
                      value={formDesign.secondary_color}
                      onChange={(e) =>
                        setFormDesign({
                          ...formDesign,
                          secondary_color: e.target.value,
                        })
                      }
                      className="absolute inset-0 w-full h-full cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-emerald-800 text-xs mb-1.5">
                  Template
                </label>
                <select
                  value={formDesign.template}
                  onChange={(e) =>
                    setFormDesign({ ...formDesign, template: e.target.value })
                  }
                  className="w-full bg-emerald-900/20 border border-emerald-900/40 text-emerald-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                >
                  {TEMPLATES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-emerald-800 text-xs mb-1.5">
                  Police
                </label>
                <input
                  value={formDesign.font_family}
                  onChange={(e) =>
                    setFormDesign({
                      ...formDesign,
                      font_family: e.target.value,
                    })
                  }
                  placeholder="Inter, Poppins, Raleway..."
                  className="w-full bg-emerald-900/20 border border-emerald-900/40 text-emerald-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() =>
                    setFormDesign({
                      ...formDesign,
                      dark_mode: !formDesign.dark_mode,
                    })
                  }
                  className={`w-10 h-5 rounded-full transition-colors ${formDesign.dark_mode ? "bg-emerald-500" : "bg-emerald-900/50"}`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${formDesign.dark_mode ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </div>
                <span className="text-emerald-600 text-sm">Mode sombre</span>
              </label>

              <button
                onClick={saveDesign}
                disabled={saving}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                Enregistrer le design
              </button>
            </div>
          ) : // ── ANALYTICS ──────────────────────────────────────────────────
          tab === "analytics" ? (
            <div className="space-y-5">
              <p className="text-emerald-700 text-xs font-medium uppercase tracking-wider">
                Statistiques
              </p>
              {!analytics ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2
                    className="animate-spin text-emerald-700"
                    size={20}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Vues totales",
                      value:
                        analytics.totalViews ?? analytics.total_views ?? "—",
                    },
                    {
                      label: "Vues ce mois",
                      value:
                        analytics.monthlyViews ??
                        analytics.monthly_views ??
                        "—",
                    },
                    {
                      label: "Clics WhatsApp",
                      value:
                        analytics.whatsappClicks ??
                        analytics.whatsapp_clicks ??
                        "—",
                    },
                    {
                      label: "Vues articles",
                      value: analytics.itemViews ?? analytics.item_views ?? "—",
                    },
                    {
                      label: "Commandes totales",
                      value:
                        analytics.totalOrders ?? analytics.total_orders ?? "—",
                    },
                    {
                      label: "Panier moyen",
                      value:
                        (analytics.avgBasket ?? analytics.avg_basket)
                          ? `${analytics.avgBasket ?? analytics.avg_basket} ${restaurant.currency ?? "XOF"}`
                          : "—",
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-emerald-900/10 border border-emerald-900/30 rounded-xl p-4"
                    >
                      <p className="text-emerald-800 text-xs mb-1">{label}</p>
                      <p className="text-emerald-300 text-xl font-bold">
                        {String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // ── DANGER ZONE ─────────────────────────────────────────────────
            <div className="space-y-6">
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1">
                  ⚠️ Zone dangereuse
                </p>
                <p className="text-red-500/70 text-xs">
                  Les actions ci-dessous sont irréversibles.
                </p>
              </div>

              {/* Changer statut en suspendu */}
              {restaurant.status !== "suspended" && (
                <div className="p-4 bg-emerald-900/10 border border-emerald-900/30 rounded-xl">
                  <p className="text-emerald-300 text-sm font-medium mb-1">
                    Suspendre le restaurant
                  </p>
                  <p className="text-emerald-700 text-xs mb-3">
                    Le site devient inaccessible, l'admin ne peut plus se
                    connecter.
                  </p>
                  <button
                    onClick={() => changeStatus("suspended")}
                    className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm rounded-lg hover:bg-amber-500/20 transition-colors"
                  >
                    Suspendre
                  </button>
                </div>
              )}

              {/* Réactiver */}
              {restaurant.status === "suspended" && (
                <div className="p-4 bg-emerald-900/10 border border-emerald-900/30 rounded-xl">
                  <p className="text-emerald-300 text-sm font-medium mb-1">
                    Réactiver le restaurant
                  </p>
                  <button
                    onClick={() => changeStatus("active")}
                    className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg hover:bg-emerald-500/20 transition-colors"
                  >
                    Réactiver
                  </button>
                </div>
              )}

              {/* Suppression totale */}
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-3">
                <p className="text-red-400 text-sm font-medium">
                  Supprimer définitivement
                </p>
                <p className="text-red-500/60 text-xs">
                  Supprime le restaurant, l'admin, toutes les données (menus,
                  commandes, analytics…). Cette action est{" "}
                  <strong className="text-red-400">irréversible</strong>.
                </p>
                <p className="text-red-500/70 text-xs">
                  Tapez le slug{" "}
                  <code className="text-red-400 bg-red-500/10 px-1 rounded">
                    {restaurant.slug}
                  </code>{" "}
                  pour confirmer.
                </p>
                <input
                  value={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.value)}
                  placeholder={restaurant.slug}
                  className="w-full bg-red-500/5 border border-red-500/20 text-red-400 placeholder-red-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={hardDelete}
                  disabled={confirmDelete !== restaurant.slug || deleting}
                  className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed border border-red-500/30 text-red-400 font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Supprimer définitivement
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function SuperAdminRestaurants() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | Status>("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  // Form create
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    adminEmail: "",
    name: "",
    type: "",
    template: "default",
    primaryColor: "#22c55e",
    currency: "XOF",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await superAdminApi.getRestaurants({
        search,
        status: statusFilter || undefined,
        page,
        limit: 10,
      });
      setRestaurants(data.items ?? data);
      setMeta(data.meta);
    } catch {}
    setLoading(false);
  }, [search, statusFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    try {
      await superAdminApi.createRestaurant(form);
      setShowCreate(false);
      setForm({
        adminEmail: "",
        name: "",
        type: "",
        template: "default",
        primaryColor: "#22c55e",
        currency: "XOF",
      });
      load();
    } catch (err: any) {
      setCreateError(err.message);
    }
    setCreating(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Restaurants</h1>
          <p className="text-emerald-800 text-sm mt-0.5">
            {meta?.total ?? "—"} restaurants sur la plateforme
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-sm transition-colors"
        >
          <Plus size={16} />
          Nouveau restaurant
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-700"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher par nom ou slug…"
            className="w-full bg-[#0d1a12] border border-emerald-900/40 text-emerald-300 placeholder-emerald-900 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-600 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as any);
            setPage(1);
          }}
          className="bg-[#0d1a12] border border-emerald-900/40 text-emerald-600 rounded-xl px-3 py-3 text-sm focus:outline-none"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="suspended">Suspendu</option>
          <option value="incomplete">Incomplet</option>
        </select>
        <button
          onClick={load}
          className="p-3 text-emerald-700 hover:text-emerald-400 border border-emerald-900/40 rounded-xl transition-colors"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0d1a12] border border-emerald-900/40 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-emerald-900/40">
              {["Restaurant", "Slug", "Template", "Statut", "Créé le", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3.5 text-emerald-700 text-xs font-mono uppercase tracking-wider last:text-right"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <Loader2
                    className="animate-spin text-emerald-700 mx-auto"
                    size={24}
                  />
                </td>
              </tr>
            ) : restaurants.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-emerald-800">
                  Aucun restaurant trouvé
                </td>
              </tr>
            ) : (
              restaurants.map((r) => {
                const sc =
                  STATUS_CONFIG[r.status as Status] || STATUS_CONFIG.incomplete;
                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="border-b border-emerald-900/20 hover:bg-emerald-500/3 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {r.logo_url ? (
                          <img
                            src={r.logo_url}
                            alt={r.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Store size={14} className="text-emerald-600" />
                          </div>
                        )}
                        <div>
                          <p className="text-emerald-300 text-sm font-medium">
                            {r.name}
                          </p>
                          <p className="text-emerald-800 text-xs">
                            {r.type || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-emerald-600 font-mono text-xs">
                        {r.slug}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-emerald-700 text-xs">
                        {r.template || "default"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: sc.color, backgroundColor: sc.bg }}
                      >
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-emerald-700 text-xs">
                      {new Date(r.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <a
                        href={`/${r.slug}`}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="text-emerald-800 hover:text-emerald-400 transition-colors inline-block"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {meta && meta.lastPage > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-emerald-900/30">
            <p className="text-emerald-800 text-xs">
              Page {page} sur {meta.lastPage} · {meta.total} résultats
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 text-emerald-700 hover:text-emerald-400 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
                disabled={page === meta.lastPage}
                className="p-1.5 text-emerald-700 hover:text-emerald-400 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer détails */}
      {selected && (
        <RestaurantDrawer
          restaurant={selected}
          onClose={() => setSelected(null)}
          onRefresh={() => {
            load();
            setSelected(null);
          }}
        />
      )}

      {/* Modal créer */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d1a12] border border-emerald-900/40 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-white font-bold text-lg mb-5">
              Nouveau restaurant
            </h2>
            {createError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {createError}
              </div>
            )}
            <form onSubmit={handleCreate} className="space-y-4">
              {[
                {
                  field: "adminEmail",
                  label: "Email de l'admin",
                  type: "email",
                  placeholder: "admin@restaurant.bj",
                },
                {
                  field: "name",
                  label: "Nom du restaurant",
                  type: "text",
                  placeholder: "Le Bon Goût",
                },
                {
                  field: "type",
                  label: "Type (optionnel)",
                  type: "text",
                  placeholder: "Africain, Fast-food…",
                },
              ].map(({ field, label, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-emerald-700 text-xs font-medium mb-1.5 uppercase tracking-wider">
                    {label}
                  </label>
                  <input
                    type={type}
                    required={field !== "type"}
                    placeholder={placeholder}
                    value={(form as any)[field]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                    className="w-full bg-emerald-900/20 border border-emerald-900/40 text-emerald-300 placeholder-emerald-900 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-700 text-xs font-medium mb-1.5 uppercase tracking-wider">
                    Devise
                  </label>
                  <select
                    value={form.currency}
                    onChange={(e) =>
                      setForm({ ...form, currency: e.target.value })
                    }
                    className="w-full bg-emerald-900/20 border border-emerald-900/40 text-emerald-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-emerald-700 text-xs font-medium mb-1.5 uppercase tracking-wider">
                    Couleur principale
                  </label>
                  <div className="relative h-10 w-full border border-emerald-900/40 rounded-lg overflow-hidden">
                    <input
                      type="color"
                      value={form.primaryColor}
                      onChange={(e) =>
                        setForm({ ...form, primaryColor: e.target.value })
                      }
                      className="absolute inset-0 w-full h-full cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 px-4 py-2.5 border border-emerald-900/40 text-emerald-700 rounded-xl text-sm font-medium hover:text-emerald-400 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Création…
                    </>
                  ) : (
                    "Créer"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
