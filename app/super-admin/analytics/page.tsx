"use client";

import { useEffect, useState } from "react";
import { superAdminApi } from "@/lib/api";
import {
  AreaChart,
  HorizontalBars,
  DonutChart,
  ChartLegend,
} from "@/components/charts";
import {
  TrendingUp,
  Store,
  CreditCard,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#0d1a12] border border-emerald-900/40 rounded-2xl p-6 ${className}`}
    >
      {children}
    </div>
  );
}
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-emerald-900/20 rounded-xl animate-pulse ${className}`}
    />
  );
}

export default function SuperAdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [productPerf, setProductPerf] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      superAdminApi.getPlatformStats().then(setStats),
      superAdminApi.getProductPerformance().then(setProductPerf),
    ]).finally(() => setLoading(false));
  }, []);

  const overview = stats?.overview ?? {};

  // Revenue par plan
  const revenueByPlan = productPerf?.by_plan ?? [];
  const planDonut = revenueByPlan.slice(0, 4).map((p: any, i: number) => ({
    label: p.plan,
    value: p.revenue,
    color: ["#22c55e", "#16a34a", "#15803d", "#166534"][i] ?? "#052e16",
  }));

  // MRR evolution (simulation depuis données)
  const mrrData =
    stats?.mrr_history?.map((m: any) => ({ label: m.month, value: m.mrr })) ??
    [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Analytics Plateforme
        </h1>
        <p className="text-emerald-800 text-sm mt-0.5">
          Vue globale des revenus et de la performance
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total restaurants",
            value: overview.totalRestaurants ?? "—",
            icon: Store,
          },
          {
            label: "Revenus totaux",
            value: overview.totalRevenue
              ? `${(overview.totalRevenue / 1000).toFixed(0)}k FCFA`
              : "—",
            icon: TrendingUp,
          },
          {
            label: "MRR",
            value: overview.monthlyRevenue
              ? `${(overview.monthlyRevenue / 1000).toFixed(0)}k FCFA`
              : "—",
            icon: CreditCard,
          },
          {
            label: "Commandes platform",
            value: overview.totalOrders ?? "—",
            icon: ShoppingBag,
          },
        ].map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#0d1a12] border border-emerald-900/40 rounded-2xl p-5 hover:border-emerald-800/50 transition-all"
          >
            <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-3">
              <Icon size={16} className="text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
            <p className="text-emerald-800 text-sm mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* MRR evolution */}
        <Card>
          <div className="mb-4">
            <p className="text-white font-bold">Évolution du MRR</p>
            <p className="text-emerald-800 text-xs mt-0.5">
              Monthly Recurring Revenue
            </p>
          </div>
          {loading ? (
            <Skeleton className="h-28" />
          ) : mrrData.length > 1 ? (
            <AreaChart data={mrrData} color="#22c55e" height={110} />
          ) : (
            <div className="flex items-center justify-center h-24 text-emerald-800 text-sm">
              Pas encore d'historique MRR
            </div>
          )}
        </Card>

        {/* Revenus par plan */}
        <Card>
          <div className="mb-4">
            <p className="text-white font-bold">Revenus par plan</p>
            <p className="text-emerald-800 text-xs mt-0.5">
              Répartition du chiffre d'affaires
            </p>
          </div>
          <div className="flex items-center gap-6">
            {loading ? (
              <Skeleton className="w-32 h-32 rounded-full" />
            ) : (
              <DonutChart
                data={
                  planDonut.length > 0
                    ? planDonut
                    : [{ label: "Aucun", value: 1, color: "#1a3320" }]
                }
                size={130}
                thickness={20}
                centerValue={
                  planDonut.length > 0
                    ? `${(planDonut.reduce((s: number, d: any) => s + d.value, 0) / 1000).toFixed(0)}k`
                    : "—"
                }
                centerLabel="FCFA"
              />
            )}
            <ChartLegend
              items={planDonut.map((d: any) => ({
                ...d,
                value: `${(d.value / 1000).toFixed(0)}k`,
              }))}
            />
          </div>
        </Card>
      </div>

      {/* Restaurants top */}
      <Card>
        <div className="mb-5">
          <p className="text-white font-bold">Top restaurants par commandes</p>
          <p className="text-emerald-800 text-xs mt-0.5">
            Les plus actifs sur la plateforme
          </p>
        </div>
        {loading ? (
          <Skeleton className="h-40" />
        ) : (
          <HorizontalBars
            data={(productPerf?.top_restaurants ?? [])
              .slice(0, 8)
              .map((r: any) => ({
                label: r.name,
                value: r.orders,
                sub: `${(r.revenue / 1000).toFixed(0)}k FCFA`,
              }))}
            color="#22c55e"
          />
        )}
      </Card>

      {/* Paiements récents */}
      <Card className="!p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-emerald-900/30 flex items-center justify-between">
          <p className="text-white font-bold">Derniers paiements</p>
          <span className="text-emerald-700 text-xs">10 plus récents</span>
        </div>
        <div className="divide-y divide-emerald-900/20">
          {loading ? (
            <div className="p-6">
              <Loader2
                className="animate-spin text-emerald-700 mx-auto"
                size={20}
              />
            </div>
          ) : (
            stats?.recentPayments?.map((p: any, i: number) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-emerald-500/3 transition-colors"
              >
                <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CreditCard size={14} className="text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-emerald-300 text-sm font-medium truncate">
                    {p.restaurant}
                  </p>
                  <p className="text-emerald-800 text-xs">
                    {p.method} · {new Date(p.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-black">
                    {(p.amount / 1000).toFixed(0)}k FCFA
                  </p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      p.status === "COMPLETED"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </motion.div>
            ))
          )}
          {!loading && !stats?.recentPayments?.length && (
            <p className="text-emerald-800 text-sm text-center py-8">
              Aucun paiement récent
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
