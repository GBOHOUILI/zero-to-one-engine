"use client";

import { useEffect, useState } from "react";
import { ordersApi, analyticsApi, subscriptionApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import {
  PeakHoursChart,
  DonutChart,
  HorizontalBars,
  RadialProgress,
  SparkLine,
  hexToRgba,
} from "@/components/charts";
import {
  ShoppingBag,
  Eye,
  MousePointerClick,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// ─── Shimmer skeleton ─────────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-zinc-100 rounded-xl animate-pulse ${className}`} />
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, icon: Icon, color, sub, trend, spark }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 border border-zinc-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: hexToRgba(color, 0.1) }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-2">
            {spark && <SparkLine values={spark} color={color} />}
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${trend >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}
            >
              {trend >= 0 ? "+" : ""}
              {trend}%
            </span>
          </div>
        )}
      </div>
      <p className="text-[34px] font-black text-zinc-900 leading-none">
        {value ?? "—"}
      </p>
      <p className="text-zinc-500 text-sm font-medium mt-1">{label}</p>
      {sub && <p className="text-zinc-400 text-xs mt-0.5">{sub}</p>}
    </motion.div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-zinc-100 p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <p className="font-bold text-zinc-900">{title}</p>
        {sub && <p className="text-zinc-400 text-xs mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardOverview() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [profileScore, setProfileScore] = useState<any>(null);
  const [peakHours, setPeakHours] = useState<any[]>([]);
  const [topItems, setTopItems] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [brand, setBrand] = useState("#16a34a");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = document.documentElement.style.getPropertyValue("--brand");
    if (stored) setBrand(stored);

    Promise.allSettled([
      ordersApi.getStats().then(setOrders),
      analyticsApi.getDashboard().then(setAnalytics),
      analyticsApi.getProfileScore().then(setProfileScore),
      analyticsApi.getPeakHours().then(setPeakHours),
      analyticsApi.getTopItems().then((d) => setTopItems(d.slice(0, 6))),
      subscriptionApi.getMy().then(setSubscription),
    ]).finally(() => setReady(true));
  }, []);

  // Donut data pour les statuts commandes
  const byStatus = orders?.by_status ?? [];
  const donutData = [
    {
      label: "Confirmées",
      value: byStatus.find((s: any) => s.status === "CONFIRMED")?.count ?? 0,
      color: "#16a34a",
    },
    {
      label: "En attente",
      value: byStatus.find((s: any) => s.status === "PENDING")?.count ?? 0,
      color: "#f59e0b",
    },
    {
      label: "Annulées",
      value: byStatus.find((s: any) => s.status === "CANCELLED")?.count ?? 0,
      color: "#ef4444",
    },
  ].filter((d) => d.value > 0);

  const totalOrders = orders?.total_orders ?? 0;
  const scoreVal = profileScore?.score ?? 0;
  const scoreColor =
    scoreVal >= 80 ? "#16a34a" : scoreVal >= 50 ? "#f59e0b" : "#ef4444";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
          {greeting} 👋
        </h1>
        <p className="text-zinc-400 text-sm mt-0.5">
          Vue d'ensemble de votre restaurant
        </p>
      </div>

      {/* Subscription banner */}
      {subscription?.status === "EXPIRED" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
        >
          <AlertCircle size={18} />
          <span>
            Votre abonnement a expiré. Votre menu n'est plus visible en ligne.
          </span>
          <Link
            href="/dashboard/settings"
            className="ml-auto font-bold underline"
          >
            Renouveler →
          </Link>
        </motion.div>
      )}

      {/* KPI row */}
      {!ready ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Commandes"
            value={totalOrders}
            icon={ShoppingBag}
            color="#8b5cf6"
            sub={`${(orders?.potential_revenue ?? 0).toLocaleString("fr-FR")} FCFA`}
          />
          <KpiCard
            label="Vues du site"
            value={analytics?.summary?.totalViews ?? 0}
            icon={Eye}
            color="#3b82f6"
          />
          <KpiCard
            label="Clics WhatsApp"
            value={analytics?.summary?.whatsappClicks ?? 0}
            icon={MousePointerClick}
            color={brand}
          />
          <KpiCard
            label="Conversion"
            value={analytics?.summary?.conversionRate ?? "0%"}
            icon={TrendingUp}
            color="#f59e0b"
            sub="vues → commandes"
          />
        </div>
      )}

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Peak hours */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Activité par heure"
              sub="Nombre de commandes · cliquez sur une barre"
            />
            {!ready ? (
              <Skeleton className="h-32" />
            ) : (
              <PeakHoursChart data={peakHours} color={brand} />
            )}
          </Card>
        </div>

        {/* Donut commandes */}
        <Card>
          <CardHeader title="Statut commandes" />
          <div className="flex flex-col items-center gap-4">
            {!ready ? (
              <Skeleton className="w-40 h-40 rounded-full" />
            ) : (
              <DonutChart
                data={
                  donutData.length > 0
                    ? donutData
                    : [{ label: "Aucune", value: 1, color: "#e4e4e7" }]
                }
                size={140}
                thickness={22}
                centerValue={String(totalOrders)}
                centerLabel="total"
              />
            )}
            <div className="w-full space-y-2">
              {donutData.map((d) => (
                <div
                  key={d.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="text-xs text-zinc-600">{d.label}</span>
                  </div>
                  <span className="text-xs font-bold text-zinc-800">
                    {d.value}
                  </span>
                </div>
              ))}
              {donutData.length === 0 && (
                <p className="text-zinc-400 text-xs text-center">
                  Aucune commande
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Top plats */}
        <Card>
          <CardHeader
            title="Top plats commandés"
            sub="Par nombre de commandes"
            action={
              <Link
                href="/dashboard/analytics"
                className="text-xs text-zinc-400 hover:text-zinc-700 flex items-center gap-1"
              >
                Voir tout <ArrowRight size={11} />
              </Link>
            }
          />
          {!ready ? (
            <Skeleton className="h-40" />
          ) : topItems.length > 0 ? (
            <HorizontalBars
              data={topItems.map((item) => ({
                label: item.name,
                value: item.times_ordered,
                sub: `${(item.total_revenue / 1000).toFixed(0)}k FCFA`,
              }))}
              color={brand}
            />
          ) : (
            <p className="text-zinc-400 text-sm">
              Aucune donnée pour l'instant
            </p>
          )}
        </Card>

        {/* Score + Dernières commandes */}
        <div className="space-y-5">
          {/* Profile score */}
          <Card>
            <CardHeader
              title="Score de complétude"
              sub="Profil complet = plus de conversions"
            />
            <div className="flex items-center gap-5">
              {!ready ? (
                <Skeleton className="w-20 h-20 rounded-full" />
              ) : (
                <RadialProgress value={scoreVal} size={84} color={scoreColor} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: scoreColor }}>
                  {scoreVal >= 80
                    ? "Excellent !"
                    : scoreVal >= 50
                      ? "À améliorer"
                      : "Incomplet"}
                </p>
                {profileScore?.missing?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {profileScore.missing.slice(0, 4).map((m: string) => (
                      <span
                        key={m}
                        className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-100"
                      >
                        {m}
                      </span>
                    ))}
                    {profileScore.missing.length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full">
                        +{profileScore.missing.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Recent orders */}
          <Card className="!p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100">
              <div className="flex items-center justify-between">
                <p className="font-bold text-zinc-900 text-sm">
                  Dernières commandes
                </p>
                <Link
                  href="/dashboard/orders"
                  className="text-xs text-zinc-400 hover:text-zinc-700"
                >
                  Voir tout →
                </Link>
              </div>
            </div>
            <div className="divide-y divide-zinc-50">
              {!orders?.recent_orders?.length ? (
                <p className="text-zinc-400 text-sm text-center py-6">
                  Aucune commande
                </p>
              ) : (
                orders.recent_orders.slice(0, 3).map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-50/50 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: hexToRgba(brand, 0.1) }}
                    >
                      <ShoppingBag size={13} style={{ color: brand }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-zinc-900 font-mono">
                        #{order.short_id}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {order.items?.length ?? 0} article
                        {(order.items?.length ?? 0) > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-black text-zinc-900">
                        {order.total_amount?.toLocaleString("fr-FR")} FCFA
                      </p>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          order.status === "CONFIRMED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
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
            label: "Uploader des photos",
            href: "/dashboard/gallery",
            color: "#3b82f6",
          },
          {
            label: "Créer une promo",
            href: "/dashboard/promotions",
            color: "#f59e0b",
          },
          {
            label: "Prévisualiser le site",
            href: "/dashboard/preview",
            color: brand,
          },
        ].map(({ label, href, color }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 px-4 py-3 bg-white border border-zinc-100 rounded-xl text-sm font-medium text-zinc-700 hover:border-zinc-200 hover:bg-zinc-50/70 hover:shadow-sm transition-all"
          >
            <Zap size={14} style={{ color }} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
