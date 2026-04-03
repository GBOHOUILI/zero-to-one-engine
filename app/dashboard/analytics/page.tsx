"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { analyticsApi } from "@/lib/api";
import {
  Eye,
  MousePointerClick,
  TrendingUp,
  Star,
  Loader2,
  Clock,
  ArrowUpRight,
  Award,
  Activity,
} from "lucide-react";

function MetricCard({ label, value, icon: Icon, color, sub, trend }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 border border-zinc-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + "15" }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
            <ArrowUpRight size={10} />
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-zinc-900 leading-none mb-1.5">
        {value}
      </p>
      <p className="text-zinc-500 text-sm font-medium">{label}</p>
      {sub && <p className="text-zinc-400 text-xs mt-0.5">{sub}</p>}
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [peakHours, setPeakHours] = useState<any[]>([]);
  const [topItems, setTopItems] = useState<any[]>([]);
  const [funnel, setFunnel] = useState<any[]>([]);
  const [score, setScore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      analyticsApi.getDashboard().then(setDashboard),
      analyticsApi.getPeakHours().then(setPeakHours),
      analyticsApi.getTopItems().then((d) => setTopItems(d.slice(0, 8))),
      analyticsApi.getConversionFunnel().then(setFunnel),
      analyticsApi.getProfileScore().then(setScore),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-zinc-300" size={28} />
      </div>
    );

  const summary = dashboard?.summary || {};
  const maxOrders = Math.max(...peakHours.map((h) => h.orders), 1);
  const peakHour = peakHours.reduce(
    (max, h) => (h.orders > max.orders ? h : max),
    { orders: 0, label: "" },
  );

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-zinc-900 tracking-tight">
          Analytics
        </h1>
        <p className="text-zinc-400 text-sm mt-0.5">
          Performance de votre restaurant — données en temps réel
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Vues du site"
          value={summary.totalViews ?? 0}
          icon={Eye}
          color="#3b82f6"
        />
        <MetricCard
          label="Clics WhatsApp"
          value={summary.whatsappClicks ?? 0}
          icon={MousePointerClick}
          color="#16a34a"
          trend="→ cmd"
        />
        <MetricCard
          label="Conversion"
          value={summary.conversionRate ?? "0%"}
          icon={TrendingUp}
          color="#8b5cf6"
          sub="vues → clics"
        />
        <MetricCard
          label="Score profil"
          value={`${score?.score ?? 0}%`}
          icon={Award}
          color={
            score?.score >= 80
              ? "#16a34a"
              : score?.score >= 50
                ? "#f59e0b"
                : "#ef4444"
          }
          sub={
            score?.missing?.length
              ? `${score.missing.length} éléments manquants`
              : "Profil complet !"
          }
        />
      </div>

      {/* Heure de pic insight */}
      {peakHour.orders > 0 && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-zinc-900">
              Pic de commandes : {peakHour.label}
            </p>
            <p className="text-zinc-600 text-sm mt-0.5">
              Vos clients commandent le plus à <strong>{peakHour.label}</strong>
              . Assurez-vous d'être disponible sur WhatsApp à cette heure.
            </p>
          </div>
        </div>
      )}

      {/* Heatmap heures */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-bold text-zinc-900">Activité par heure</p>
            <p className="text-zinc-400 text-xs mt-0.5">
              Nombre de commandes par heure de la journée
            </p>
          </div>
          <Activity size={16} className="text-zinc-300" />
        </div>
        <div className="flex items-end gap-1 h-28">
          {peakHours.map((h, i) => {
            const isPeak =
              h.orders === Math.max(...peakHours.map((x) => x.orders));
            const height = Math.max(4, (h.orders / maxOrders) * 100);
            return (
              <motion.div
                key={h.hour}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.02, duration: 0.4 }}
                className="flex-1 flex flex-col items-center justify-end group relative"
                style={{ height: "100px" }}
              >
                <div
                  className="w-full rounded-t-sm cursor-default"
                  style={{
                    height: `${height}%`,
                    backgroundColor: isPeak ? "#16a34a" : "#16a34a25",
                    minHeight: "4px",
                  }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {h.label}: {h.orders}
                </div>
                {h.hour % 6 === 0 && (
                  <span className="text-[9px] text-zinc-400 mt-1 absolute bottom-[-18px]">
                    {h.label}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
        <div className="mt-6 flex items-center gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-600" /> Heure de pic
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-100" /> Autres heures
          </div>
        </div>
      </div>

      {/* Top items + Funnel */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Top plats */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-bold text-zinc-900">Top plats commandés</p>
              <p className="text-zinc-400 text-xs mt-0.5">
                Par nombre de commandes
              </p>
            </div>
            <Star size={16} className="text-zinc-300" />
          </div>
          <div className="space-y-3">
            {topItems.length === 0 && (
              <p className="text-zinc-400 text-sm">Aucune donnée disponible</p>
            )}
            {topItems.map((item, i) => {
              const maxRev = Math.max(...topItems.map((x) => x.times_ordered));
              const pct = (item.times_ordered / maxRev) * 100;
              return (
                <div key={item.item_id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                          i === 0
                            ? "bg-amber-100 text-amber-600"
                            : i === 1
                              ? "bg-zinc-100 text-zinc-500"
                              : i === 2
                                ? "bg-orange-50 text-orange-500"
                                : "bg-zinc-50 text-zinc-400"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-zinc-800 truncate max-w-[160px]">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-bold text-zinc-700">
                        {item.times_ordered}×
                      </span>
                      <p className="text-[10px] text-zinc-400">
                        {(item.total_revenue / 1000).toFixed(0)}k FCFA
                      </p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: i === 0 ? "#f59e0b" : "#16a34a",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Funnel conversion */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-bold text-zinc-900">Tunnel de conversion</p>
              <p className="text-zinc-400 text-xs mt-0.5">
                Vues → commandes par heure
              </p>
            </div>
            <TrendingUp size={16} className="text-zinc-300" />
          </div>
          <div className="space-y-2.5">
            {funnel
              .slice(0, 8)
              .filter((h) => h.views > 0)
              .map((h) => {
                const rate = parseFloat(h.conversion_rate);
                return (
                  <div key={h.hour} className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400 font-mono w-10 flex-shrink-0">
                      {h.label}
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, rate * 3)}%`,
                            backgroundColor:
                              rate >= 20
                                ? "#16a34a"
                                : rate >= 10
                                  ? "#f59e0b"
                                  : "#e5e7eb",
                          }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500 font-medium w-10 text-right flex-shrink-0">
                        {h.conversion_rate}
                      </span>
                    </div>
                  </div>
                );
              })}
            {funnel.filter((h) => h.views > 0).length === 0 && (
              <p className="text-zinc-400 text-sm">
                Pas encore de données de conversion
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Profil score détail */}
      {score && score.missing?.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Award size={18} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-zinc-900">
                Améliorez votre score de complétude
              </p>
              <p className="text-zinc-600 text-sm mt-0.5 mb-4">
                Score actuel :{" "}
                <strong className="text-amber-700">{score.score}%</strong> · Un
                profil complet = plus de conversions
              </p>
              <div className="flex flex-wrap gap-2">
                {score.missing.map((m: string) => {
                  const LABELS: Record<string, string> = {
                    logo: "🖼️ Ajouter un logo",
                    slogan: "✍️ Ajouter un slogan",
                    contact: "📱 Configurer WhatsApp",
                    social: "📲 Réseaux sociaux",
                    opening_hours: "🕐 Horaires d'ouverture",
                    hero_media: "🎬 Photo/vidéo hero",
                    gallery: "📸 Galerie (3+ photos)",
                    menu: "🍽️ Menu (5+ plats)",
                    faq: "❓ FAQ (2+ questions)",
                    testimonials: "⭐ Témoignages",
                  };
                  return (
                    <span
                      key={m}
                      className="text-xs px-3 py-1.5 bg-white border border-amber-200 text-amber-700 rounded-full font-medium"
                    >
                      {LABELS[m] || m}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
