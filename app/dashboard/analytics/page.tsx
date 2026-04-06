"use client";

import { useEffect, useState } from "react";
import { analyticsApi } from "@/lib/api";
import {
  PeakHoursChart,
  AreaChart,
  DonutChart,
  HorizontalBars,
  RadialProgress,
  hexToRgba,
  ChartLegend,
} from "@/components/charts";
import {
  Eye,
  MousePointerClick,
  TrendingUp,
  Award,
  Clock,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-zinc-100 rounded-xl animate-pulse ${className}`} />
  );
}

function MetricCard({ label, value, icon: Icon, color, sub, delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl p-5 border border-zinc-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: hexToRgba(color, 0.1) }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <ArrowUpRight size={14} className="text-zinc-300" />
      </div>
      <p className="text-[34px] font-black text-zinc-900 leading-none">
        {value ?? "—"}
      </p>
      <p className="text-zinc-500 text-sm font-medium mt-1.5">{label}</p>
      {sub && <p className="text-zinc-400 text-xs mt-0.5">{sub}</p>}
    </motion.div>
  );
}

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

export default function AnalyticsPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [peakHours, setPeakHours] = useState<any[]>([]);
  const [topItems, setTopItems] = useState<any[]>([]);
  const [funnel, setFunnel] = useState<any[]>([]);
  const [score, setScore] = useState<any>(null);
  const [brand, setBrand] = useState("#16a34a");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const b = document.documentElement.style.getPropertyValue("--brand");
    if (b) setBrand(b);

    Promise.allSettled([
      analyticsApi.getDashboard().then(setDashboard),
      analyticsApi.getPeakHours().then(setPeakHours),
      analyticsApi.getTopItems().then((d) => setTopItems(d.slice(0, 8))),
      analyticsApi.getConversionFunnel().then(setFunnel),
      analyticsApi.getProfileScore().then(setScore),
    ]).finally(() => setLoading(false));
  }, []);

  const summary = dashboard?.summary ?? {};
  const scoreColor =
    score?.score >= 80 ? "#16a34a" : score?.score >= 50 ? "#f59e0b" : "#ef4444";
  const peakHour = peakHours.reduce(
    (max, h) => (h.orders > max.orders ? h : max),
    { orders: 0, label: "—" },
  );

  // Données area chart (vues par jour simulées depuis funnel)
  const areaData = funnel
    .filter((h) => h.views > 0)
    .map((h) => ({
      label: h.label,
      value: h.views,
    }));

  // Donut conversion
  const totalViews = summary.totalViews ?? 0;
  const totalClicks = summary.whatsappClicks ?? 0;
  const donutConv = [
    { label: "Clics WA", value: totalClicks, color: brand },
    {
      label: "Vues sans clic",
      value: Math.max(totalViews - totalClicks, 0),
      color: hexToRgba(brand, 0.15),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
          Analytics
        </h1>
        <p className="text-zinc-400 text-sm mt-0.5">
          Performance de votre restaurant en temps réel
        </p>
      </div>

      {/* KPIs */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Vues totales"
            value={totalViews}
            icon={Eye}
            color="#3b82f6"
            delay={0}
          />
          <MetricCard
            label="Clics WhatsApp"
            value={totalClicks}
            icon={MousePointerClick}
            color={brand}
            delay={0.05}
          />
          <MetricCard
            label="Taux de conversion"
            value={summary.conversionRate ?? "0%"}
            icon={TrendingUp}
            color="#8b5cf6"
            sub="vues → clics WA"
            delay={0.1}
          />
          <MetricCard
            label="Score profil"
            value={`${score?.score ?? 0}%`}
            icon={Award}
            color={scoreColor}
            sub={
              score?.missing?.length
                ? `${score.missing.length} manquants`
                : "Complet !"
            }
            delay={0.15}
          />
        </div>
      )}

      {/* Insight callout */}
      {peakHour.orders > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4 p-5 rounded-2xl border"
          style={{
            backgroundColor: hexToRgba(brand, 0.05),
            borderColor: hexToRgba(brand, 0.2),
          }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: brand }}
          >
            <Clock size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-zinc-900">
              Pic de commandes à {peakHour.label}
            </p>
            <p className="text-zinc-600 text-sm mt-0.5">
              Assurez-vous d'être disponible sur WhatsApp à cette heure pour
              maximiser vos conversions.
            </p>
          </div>
        </motion.div>
      )}

      {/* Charts row 1 : Peak hours (large) + Donut conversion */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-bold text-zinc-900">Heures de pic</p>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Commandes par heure de la journée
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-400">Heure de pic</p>
                <p className="text-sm font-bold" style={{ color: brand }}>
                  {peakHour.label}
                </p>
              </div>
            </div>
            {loading ? (
              <Skeleton className="h-36" />
            ) : (
              <PeakHoursChart data={peakHours} color={brand} />
            )}
          </Card>
        </div>

        <Card>
          <div className="mb-4">
            <p className="font-bold text-zinc-900">Tunnel de conversion</p>
            <p className="text-zinc-400 text-xs mt-0.5">
              Vues qui deviennent des clics WhatsApp
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            {loading ? (
              <Skeleton className="w-36 h-36 rounded-full" />
            ) : (
              <DonutChart
                data={donutConv}
                size={144}
                thickness={24}
                centerValue={summary.conversionRate ?? "0%"}
                centerLabel="taux"
              />
            )}
            <ChartLegend
              items={donutConv.map((d) => ({ ...d, value: String(d.value) }))}
            />
          </div>
        </Card>
      </div>

      {/* Charts row 2 : Area vues + Top items */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Area chart vues */}
        <Card>
          <div className="mb-4">
            <p className="font-bold text-zinc-900">Évolution des vues</p>
            <p className="text-zinc-400 text-xs mt-0.5">
              Par heure sur les dernières 24h
            </p>
          </div>
          {loading ? (
            <Skeleton className="h-28" />
          ) : areaData.length > 1 ? (
            <AreaChart data={areaData} color={brand} height={110} />
          ) : (
            <div className="flex items-center justify-center h-24 text-zinc-400 text-sm">
              Pas assez de données
            </div>
          )}
        </Card>

        {/* Top items */}
        <Card>
          <div className="mb-4">
            <p className="font-bold text-zinc-900">Top plats</p>
            <p className="text-zinc-400 text-xs mt-0.5">
              Par nombre de commandes · barre = part relative
            </p>
          </div>
          {loading ? (
            <Skeleton className="h-40" />
          ) : topItems.length > 0 ? (
            <HorizontalBars
              data={topItems.map((item, i) => ({
                label: item.name,
                value: item.times_ordered,
                sub: `${(item.total_revenue / 1000).toFixed(0)}k FCFA`,
                color: i === 0 ? "#f59e0b" : brand,
              }))}
              color={brand}
            />
          ) : (
            <p className="text-zinc-400 text-sm">Aucune commande enregistrée</p>
          )}
        </Card>
      </div>

      {/* Profile score détail */}
      {score && score.missing?.length > 0 && (
        <Card>
          <div className="flex items-start gap-6">
            <RadialProgress
              value={score.score}
              size={96}
              color={scoreColor}
              label="Complétude"
            />
            <div className="flex-1">
              <p className="font-bold text-zinc-900 mb-0.5">
                Améliorez votre profil
              </p>
              <p className="text-zinc-500 text-sm mb-4">
                Un profil complet augmente votre taux de conversion de{" "}
                <strong>+35%</strong>.
              </p>
              <div className="flex flex-wrap gap-2">
                {score.missing.map((m: string) => {
                  const LABELS: Record<string, string> = {
                    logo: "🖼️ Logo",
                    slogan: "✍️ Slogan",
                    contact: "📱 WhatsApp",
                    social: "📲 Réseaux",
                    opening_hours: "🕐 Horaires",
                    hero_media: "🎬 Hero photo",
                    gallery: "📸 Galerie",
                    menu: "🍽️ Menu",
                    faq: "❓ FAQ",
                    testimonials: "⭐ Avis",
                  };
                  return (
                    <span
                      key={m}
                      className="text-xs px-3 py-1.5 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded-full font-medium hover:border-zinc-300 transition-colors cursor-default"
                    >
                      {LABELS[m] || m}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
