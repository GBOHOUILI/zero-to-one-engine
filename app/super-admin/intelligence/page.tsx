"use client";

import { useEffect, useState } from "react";
import { superAdminApi } from "@/lib/api";
import {
  PeakHoursChart,
  DonutChart,
  HorizontalBars,
  AreaChart,
  ChartLegend,
} from "@/components/charts";
import { Brain, TrendingUp, Store, AlertTriangle, Loader2 } from "lucide-react";
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
      className={`bg-[#0d1a12] border border-emerald-900/40 rounded-2xl p-6 hover:border-emerald-800/50 transition-all ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({
  title,
  sub,
  icon: Icon,
}: {
  title: string;
  sub?: string;
  icon?: any;
}) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <p className="text-white font-bold">{title}</p>
        {sub && <p className="text-emerald-800 text-xs mt-0.5">{sub}</p>}
      </div>
      {Icon && <Icon size={16} className="text-emerald-700" />}
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

export default function IntelligencePage() {
  const [peakHours, setPeakHours] = useState<any[]>([]);
  const [basket, setBasket] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      superAdminApi.getPeakHours().then(setPeakHours),
      superAdminApi.getBasketBenchmark().then(setBasket),
      superAdminApi.getTemplatePerformance().then(setTemplates),
      superAdminApi.getProfileScores().then(setScores),
    ]).finally(() => setLoading(false));
  }, []);

  // Donut templates
  const templateDonut = templates.slice(0, 4).map((t, i) => ({
    label: t.template,
    value: t.restaurants,
    color: ["#22c55e", "#16a34a", "#15803d", "#166534"][i] ?? "#052e16",
  }));

  // Score distribution donut
  const scoreRanges = [
    {
      label: "Excellent (80+)",
      value: scores.filter((s) => s.score >= 80).length,
      color: "#22c55e",
    },
    {
      label: "Moyen (50-79)",
      value: scores.filter((s) => s.score >= 50 && s.score < 80).length,
      color: "#f59e0b",
    },
    {
      label: "Faible (<50)",
      value: scores.filter((s) => s.score < 50).length,
      color: "#ef4444",
    },
  ].filter((d) => d.value > 0);

  // Basket benchmark as horizontal bars
  const basketBars =
    basket?.by_restaurant?.slice(0, 8).map((r: any) => ({
      label: r.name,
      value: Math.round(r.avg_basket),
      sub: `${(r.avg_basket / 1000).toFixed(1)}k FCFA`,
    })) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain size={18} className="text-emerald-500" />
            <span className="text-emerald-600 text-xs font-mono uppercase tracking-wider">
              IA & Data
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Intelligence Data
          </h1>
          <p className="text-emerald-800 text-sm mt-0.5">
            Analyse comportementale de la plateforme
          </p>
        </div>
        <div className="text-right">
          <p className="text-emerald-700 text-xs">
            {scores.length} restaurants analysés
          </p>
        </div>
      </div>

      {/* KPIs Intelligence */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Panier moyen platform",
            value: basket
              ? `${Math.round(basket.platform?.avg_basket / 1000)}k FCFA`
              : "—",
            icon: TrendingUp,
          },
          {
            label: "Restos analysés",
            value: scores.length || "—",
            icon: Store,
          },
          {
            label: "Score moyen",
            value: scores.length
              ? `${Math.round(scores.reduce((s, r) => s + r.score, 0) / scores.length)}%`
              : "—",
            icon: Brain,
          },
          {
            label: "À risque churn",
            value: scores.filter((s) => s.score < 40).length || "0",
            icon: AlertTriangle,
          },
        ].map(({ label, value, icon: Icon }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
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

      {/* Row 1 : Peak hours plateforme + Donut templates */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Heures de pic — Plateforme"
              sub="Commandes agrégées de tous les restaurants"
              icon={TrendingUp}
            />
            {loading ? (
              <Skeleton className="h-36" />
            ) : (
              <PeakHoursChart data={peakHours} color="#22c55e" />
            )}
          </Card>
        </div>

        <Card>
          <CardHeader
            title="Répartition des templates"
            sub="Restaurants par template actif"
          />
          <div className="flex flex-col items-center gap-4">
            {loading ? (
              <Skeleton className="w-36 h-36 rounded-full" />
            ) : (
              <DonutChart
                data={
                  templateDonut.length > 0
                    ? templateDonut
                    : [{ label: "Aucun", value: 1, color: "#1a3320" }]
                }
                size={140}
                thickness={22}
                centerValue={String(
                  templates.reduce((s, t) => s + t.restaurants, 0),
                )}
                centerLabel="restos"
              />
            )}
            <ChartLegend items={templateDonut} />
          </div>
        </Card>
      </div>

      {/* Row 2 : Basket benchmark + Score distribution */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Basket benchmark */}
        <Card>
          <CardHeader
            title="Panier moyen par restaurant"
            sub="Classement · vs moyenne plateforme"
            icon={TrendingUp}
          />
          <div className="mb-4 flex items-center gap-3 p-3 bg-emerald-900/20 rounded-xl">
            <div className="w-2 h-8 rounded-full bg-emerald-500 flex-shrink-0" />
            <div>
              <p className="text-emerald-300 text-xs font-medium">
                Moyenne plateforme
              </p>
              <p className="text-white font-black text-lg">
                {basket?.platform?.avg_basket
                  ? `${(basket.platform.avg_basket / 1000).toFixed(1)}k FCFA`
                  : "—"}
              </p>
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-48" />
          ) : basketBars.length > 0 ? (
            <HorizontalBars
              data={basketBars}
              color="#22c55e"
              showValue={false}
            />
          ) : (
            <p className="text-emerald-800 text-sm">
              Pas encore de données de panier
            </p>
          )}
        </Card>

        {/* Score distribution */}
        <Card>
          <CardHeader
            title="Distribution des scores"
            sub="Qualité des profils restaurants"
            icon={Brain}
          />
          <div className="flex items-center gap-6 mb-5">
            {loading ? (
              <Skeleton className="w-36 h-36 rounded-full" />
            ) : (
              <DonutChart
                data={
                  scoreRanges.length > 0
                    ? scoreRanges
                    : [{ label: "Aucun", value: 1, color: "#1a3320" }]
                }
                size={130}
                thickness={20}
                centerValue={String(scores.length)}
                centerLabel="restos"
              />
            )}
            <div className="flex-1 space-y-3">
              {scoreRanges.map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-emerald-300 text-xs">{r.label}</span>
                    <span className="text-white text-xs font-bold">
                      {r.value}
                    </span>
                  </div>
                  <div className="h-1.5 bg-emerald-900/40 rounded-full">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${(r.value / Math.max(scores.length, 1)) * 100}%`,
                        backgroundColor: r.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Restos à risque */}
          <div className="border-t border-emerald-900/30 pt-4">
            <p className="text-emerald-700 text-xs font-medium mb-3 uppercase tracking-wider">
              Restaurants à risque
            </p>
            <div className="space-y-2">
              {loading ? (
                <Skeleton className="h-16" />
              ) : (
                scores
                  .filter((r) => r.score < 50)
                  .slice(0, 4)
                  .map((r) => (
                    <div
                      key={r.restaurant_id}
                      className="flex items-center gap-3"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-400 text-[11px] font-bold">
                          {r.name?.[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-emerald-300 text-xs font-medium truncate">
                            {r.name}
                          </p>
                          <span
                            className={`text-[10px] font-bold ${r.score < 30 ? "text-red-400" : "text-amber-400"}`}
                          >
                            {r.score}%
                          </span>
                        </div>
                        <div className="h-1 bg-emerald-900/40 rounded-full">
                          <div
                            className="h-1 rounded-full"
                            style={{
                              width: `${r.score}%`,
                              backgroundColor:
                                r.score < 30 ? "#ef4444" : "#f59e0b",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
              )}
              {!loading && scores.filter((r) => r.score < 50).length === 0 && (
                <p className="text-emerald-800 text-xs">
                  Aucun restaurant à risque 🎉
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Template performance table */}
      <Card>
        <CardHeader
          title="Performance par template"
          sub="Panier moyen · restaurants · taux de conversion estimé"
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-emerald-900/30">
                {[
                  "Template",
                  "Restaurants",
                  "Panier moyen",
                  "Total commandes",
                  "Tendance",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-4 text-emerald-700 text-xs font-mono uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    <Loader2
                      className="animate-spin text-emerald-700 mx-auto"
                      size={20}
                    />
                  </td>
                </tr>
              ) : (
                templates.map((t, i) => (
                  <motion.tr
                    key={t.template}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-emerald-900/20 hover:bg-emerald-500/3 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-8 rounded-full bg-emerald-500/30 flex-shrink-0">
                          <div
                            className="w-full rounded-full bg-emerald-500 transition-all"
                            style={{
                              height: `${Math.min(100, i === 0 ? 100 : 70 - i * 15)}%`,
                            }}
                          />
                        </div>
                        <span className="text-emerald-300 font-semibold text-sm">
                          {t.template}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-white font-bold">
                        {t.restaurants}
                      </span>
                      <span className="text-emerald-800 text-xs ml-1">
                        restos
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-400 font-black">
                        {(t.avg_basket / 1000).toFixed(1)}k
                      </span>
                      <span className="text-emerald-800 text-xs ml-1">
                        FCFA
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-emerald-300 text-sm">
                      {t.total_orders ?? "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          i === 0
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-emerald-900/40 text-emerald-700"
                        }`}
                      >
                        {i === 0 ? "↑ Top" : "—"}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
