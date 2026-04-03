"use client";

import { useEffect, useState } from "react";
import { superAdminApi } from "@/lib/api";
import {
  Store,
  Users,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  AlertTriangle,
  ArrowRight,
  Zap,
  Activity,
  Brain,
} from "lucide-react";
import Link from "next/link";

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  color = "#22c55e",
}: {
  label: string;
  value: string | number;
  icon: any;
  trend?: string;
  color?: string;
}) {
  return (
    <div className="bg-[#0d1a12] border border-emerald-900/40 rounded-2xl p-6 hover:border-emerald-700/40 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <Icon size={18} className="text-emerald-400" />
        </div>
        {trend && (
          <span className="text-xs text-emerald-500 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-white mb-1">{value}</p>
      <p className="text-emerald-800 text-sm font-medium">{label}</p>
    </div>
  );
}

export default function SuperAdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [templatePerf, setTemplatePerf] = useState<any[]>([]);

  useEffect(() => {
    superAdminApi
      .getPlatformStats()
      .then(setStats)
      .catch(() => {});
    superAdminApi
      .getProfileScores()
      .then((d) => setScores(d.slice(0, 5)))
      .catch(() => {});
    superAdminApi
      .getTemplatePerformance()
      .then(setTemplatePerf)
      .catch(() => {});
  }, []);

  const overview = stats?.overview;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-600 text-xs font-mono uppercase tracking-wider">
              Plateforme live
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">Tableau de bord</h1>
          <p className="text-emerald-800 text-sm mt-0.5">
            Vue globale de la plateforme Zero To One
          </p>
        </div>
        <div className="text-right">
          <p className="text-emerald-500 text-xs font-mono">
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Restaurants actifs"
          value={overview?.totalRestaurants ?? "—"}
          icon={Store}
        />
        <StatCard
          label="Abonnements actifs"
          value={overview?.activeSubscriptions ?? "—"}
          icon={CreditCard}
          trend={overview?.conversionRate}
        />
        <StatCard
          label="Revenus totaux"
          value={
            overview?.totalRevenue
              ? `${(overview.totalRevenue / 1000).toFixed(0)}k FCFA`
              : "—"
          }
          icon={TrendingUp}
        />
        <StatCard
          label="Ce mois"
          value={
            overview?.monthlyRevenue
              ? `${(overview.monthlyRevenue / 1000).toFixed(0)}k FCFA`
              : "—"
          }
          icon={Activity}
          trend="MRR"
        />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Restaurants à risque */}
        <div className="lg:col-span-2 bg-[#0d1a12] border border-emerald-900/40 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-white font-semibold">Restaurants à risque</p>
              <p className="text-emerald-800 text-xs mt-0.5">
                Score de complétude faible = risque de churn
              </p>
            </div>
            <AlertTriangle size={16} className="text-amber-500" />
          </div>
          <div className="space-y-3">
            {scores.length === 0 && (
              <p className="text-emerald-800 text-sm">Chargement…</p>
            )}
            {scores.map((r) => (
              <div key={r.restaurant_id} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-400 text-xs font-bold">
                    {r.name?.[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-emerald-300 text-sm font-medium truncate">
                      {r.name}
                    </p>
                    <span
                      className={`text-xs font-bold ${r.score < 40 ? "text-red-400" : r.score < 70 ? "text-amber-400" : "text-emerald-400"}`}
                    >
                      {r.score}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-emerald-900/40 rounded-full">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${r.score}%`,
                        backgroundColor:
                          r.score < 40
                            ? "#ef4444"
                            : r.score < 70
                              ? "#f59e0b"
                              : "#22c55e",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/super-admin/intelligence"
            className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-400 mt-5 transition-colors"
          >
            Voir tous les scores <ArrowRight size={12} />
          </Link>
        </div>

        {/* Template performance */}
        <div className="bg-[#0d1a12] border border-emerald-900/40 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white font-semibold">Templates</p>
            <Brain size={15} className="text-emerald-700" />
          </div>
          <div className="space-y-3">
            {templatePerf.slice(0, 5).map((t, i) => (
              <div key={t.template} className="flex items-center gap-3">
                <span className="text-emerald-700 font-mono text-xs w-4">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-emerald-300 text-sm font-medium">
                    {t.template}
                  </p>
                  <p className="text-emerald-800 text-xs">
                    {t.restaurants} restos
                  </p>
                </div>
                <span className="text-emerald-400 text-sm font-bold">
                  {(t.avg_basket / 1000).toFixed(1)}k
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent payments */}
      <div className="bg-[#0d1a12] border border-emerald-900/40 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-white font-semibold">Derniers paiements</p>
          <Link
            href="/super-admin/subscriptions"
            className="text-xs text-emerald-700 hover:text-emerald-400 transition-colors"
          >
            Voir tout <ArrowRight size={12} className="inline" />
          </Link>
        </div>
        <div className="space-y-2">
          {stats?.recentPayments?.map((p: any) => (
            <div
              key={p.id}
              className="flex items-center gap-4 py-2.5 border-b border-emerald-900/30 last:border-0"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <CreditCard size={14} className="text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-emerald-300 text-sm font-medium truncate">
                  {p.restaurant}
                </p>
                <p className="text-emerald-800 text-xs">{p.method}</p>
              </div>
              <div className="text-right">
                <p className="text-white text-sm font-bold">
                  {(p.amount / 1000).toFixed(0)}k FCFA
                </p>
                <p className="text-emerald-800 text-xs">
                  {new Date(p.date).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          ))}
          {!stats?.recentPayments?.length && (
            <p className="text-emerald-800 text-sm">Aucun paiement récent</p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Nouveau restaurant",
            href: "/super-admin/restaurants",
            icon: Store,
          },
          {
            label: "Voir commandes",
            href: "/super-admin/analytics",
            icon: ShoppingBag,
          },
          {
            label: "Intelligence Data",
            href: "/super-admin/intelligence",
            icon: Brain,
          },
          {
            label: "Déclencher backup",
            href: "/super-admin/backup",
            icon: Zap,
          },
        ].map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 px-4 py-3 bg-emerald-500/5 border border-emerald-900/40 rounded-xl text-sm font-medium text-emerald-700 hover:text-emerald-300 hover:border-emerald-700/40 hover:bg-emerald-500/10 transition-all"
          >
            <Icon size={14} className="text-emerald-500" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
