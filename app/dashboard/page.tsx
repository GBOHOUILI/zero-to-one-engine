"use client";

import { useEffect, useState } from "react";
import { ordersApi, analyticsApi, subscriptionApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import {
  ShoppingBag,
  Eye,
  MousePointerClick,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
  Zap,
  Star,
} from "lucide-react";
import Link from "next/link";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-zinc-100 hover:border-zinc-200 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-500 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-zinc-900">{value}</p>
          {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + "18" }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </div>
  );
}

function ProfileScoreBar({
  score,
  missing,
}: {
  score: number;
  missing: string[];
}) {
  const color = score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label =
    score >= 80 ? "Excellent" : score >= 50 ? "À améliorer" : "Incomplet";

  return (
    <div className="bg-white rounded-2xl p-6 border border-zinc-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-semibold text-zinc-900">Score de complétude</p>
          <p className="text-xs text-zinc-400 mt-0.5">
            Un profil complet = plus de conversions
          </p>
        </div>
        <span className="text-2xl font-black" style={{ color }}>
          {score}%
        </span>
      </div>
      <div className="h-2 bg-zinc-100 rounded-full mb-4">
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      {missing.length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 mb-2 font-medium">
            Éléments manquants :
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missing.slice(0, 5).map((m) => (
              <span
                key={m}
                className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardOverview() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [profileScore, setProfileScore] = useState<any>(null);
  const [peakHours, setPeakHours] = useState<any[]>([]);
  const [topItems, setTopItems] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    ordersApi
      .getStats()
      .then(setOrders)
      .catch(() => {});
    analyticsApi
      .getDashboard()
      .then(setAnalytics)
      .catch(() => {});
    analyticsApi
      .getProfileScore()
      .then(setProfileScore)
      .catch(() => {});
    analyticsApi
      .getPeakHours()
      .then(setPeakHours)
      .catch(() => {});
    analyticsApi
      .getTopItems()
      .then((d) => setTopItems(d.slice(0, 5)))
      .catch(() => {});
    subscriptionApi
      .getMy()
      .then(setSubscription)
      .catch(() => {});
  }, []);

  const maxOrders = Math.max(...peakHours.map((h) => h.orders), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Bonjour 👋</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Voici ce qui se passe sur votre restaurant aujourd'hui.
        </p>
      </div>

      {/* Subscription warning */}
      {subscription?.status === "EXPIRED" && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle size={18} />
          <span>
            Votre abonnement a expiré. Votre menu n'est plus visible en ligne.
          </span>
          <Link
            href="/dashboard/settings"
            className="ml-auto font-medium underline"
          >
            Renouveler
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Commandes totales"
          value={orders?.total_orders ?? "—"}
          icon={ShoppingBag}
          color="#8b5cf6"
          sub={`${(orders?.potential_revenue ?? 0).toLocaleString("fr-FR")} FCFA potentiels`}
        />
        <StatCard
          label="Vues du site"
          value={analytics?.summary?.totalViews ?? "—"}
          icon={Eye}
          color="#3b82f6"
        />
        <StatCard
          label="Clics WhatsApp"
          value={analytics?.summary?.whatsappClicks ?? "—"}
          icon={MousePointerClick}
          color="#22c55e"
        />
        <StatCard
          label="Taux de conversion"
          value={analytics?.summary?.conversionRate ?? "—"}
          icon={TrendingUp}
          color="#f59e0b"
          sub="vues → commandes"
        />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Peak hours chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-zinc-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-semibold text-zinc-900">Heures de pic</p>
              <p className="text-xs text-zinc-400">
                Quand vos clients commandent le plus
              </p>
            </div>
            <Clock size={16} className="text-zinc-400" />
          </div>
          <div className="flex items-end gap-1 h-32">
            {peakHours.map((h) => (
              <div
                key={h.hour}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full flex flex-col justify-end"
                  style={{ height: "100px" }}
                >
                  <div
                    className="w-full rounded-t-sm transition-all"
                    style={{
                      height: `${Math.max(4, (h.orders / maxOrders) * 100)}%`,
                      backgroundColor:
                        h.orders === Math.max(...peakHours.map((x) => x.orders))
                          ? "#22c55e"
                          : "#22c55e30",
                    }}
                  />
                </div>
                {h.hour % 4 === 0 && (
                  <span className="text-[9px] text-zinc-400">{h.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Profile score */}
        <div>
          <ProfileScoreBar
            score={profileScore?.score ?? 0}
            missing={profileScore?.missing ?? []}
          />
        </div>
      </div>

      {/* Top items + recent orders */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top plats */}
        <div className="bg-white rounded-2xl p-6 border border-zinc-100">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-zinc-900">Top plats commandés</p>
            <Star size={15} className="text-zinc-400" />
          </div>
          <div className="space-y-3">
            {topItems.length === 0 && (
              <p className="text-zinc-400 text-sm">
                Aucune commande pour l'instant
              </p>
            )}
            {topItems.map((item, i) => (
              <div key={item.item_id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-800 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {item.times_ordered} commandes
                  </p>
                </div>
                <span className="text-sm font-semibold text-zinc-700">
                  {item.total_revenue.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/dashboard/analytics"
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700 mt-4 transition-colors"
          >
            Voir tout <ArrowRight size={12} />
          </Link>
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl p-6 border border-zinc-100">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-zinc-900">Dernières commandes</p>
            <ShoppingBag size={15} className="text-zinc-400" />
          </div>
          <div className="space-y-3">
            {!orders?.recent_orders?.length && (
              <p className="text-zinc-400 text-sm">
                Aucune commande pour l'instant
              </p>
            )}
            {orders?.recent_orders?.slice(0, 5).map((order: any) => (
              <div key={order.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag size={14} className="text-violet-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-800">
                    #{order.short_id}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {order.items?.length} article
                    {order.items?.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-zinc-800">
                    {order.total_amount.toLocaleString("fr-FR")} FCFA
                  </p>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      order.status === "CONFIRMED"
                        ? "bg-green-50 text-green-700"
                        : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700 mt-4 transition-colors"
          >
            Voir tout <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Ajouter un plat",
            href: "/dashboard/menus",
            color: "#8b5cf6",
          },
          {
            label: "Uploader une photo",
            href: "/dashboard/gallery",
            color: "#3b82f6",
          },
          {
            label: "Créer une promo",
            href: "/dashboard/promotions",
            color: "#f59e0b",
          },
          {
            label: "Voir mon site",
            href: "/dashboard/preview",
            color: "#22c55e",
          },
        ].map(({ label, href, color }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-zinc-100 rounded-xl text-sm font-medium text-zinc-700 hover:border-zinc-200 hover:bg-zinc-50 transition-all"
          >
            <Zap size={14} style={{ color }} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
