"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ordersApi } from "@/lib/api";
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowUpRight,
  Package,
} from "lucide-react";

const STATUS: Record<
  string,
  { label: string; color: string; bg: string; icon: any }
> = {
  PENDING: {
    label: "En attente",
    color: "#f59e0b",
    bg: "#fef3c7",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmée",
    color: "#22c55e",
    bg: "#dcfce7",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Annulée",
    color: "#ef4444",
    bg: "#fee2e2",
    icon: XCircle,
  },
};

function StatPill({ label, value, sub, color = "#6b7280" }: any) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-zinc-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className="text-3xl font-black text-zinc-900" style={{ color }}>
        {value}
      </p>
      {sub && <p className="text-zinc-400 text-xs mt-1.5">{sub}</p>}
    </div>
  );
}

export default function OrdersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi
      .getStats()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-zinc-300" size={28} />
      </div>
    );

  const byStatus = data?.by_status || [];
  const confirmed =
    byStatus.find((s: any) => s.status === "CONFIRMED")?.count || 0;
  const pending = byStatus.find((s: any) => s.status === "PENDING")?.count || 0;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-zinc-900 tracking-tight">
          Commandes
        </h1>
        <p className="text-zinc-400 text-sm mt-0.5">
          Toutes les commandes reçues via votre menu WhatsApp
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatPill
          label="Total commandes"
          value={data?.total_orders ?? 0}
          sub="depuis le début"
        />
        <StatPill
          label="CA potentiel"
          value={
            data?.potential_revenue
              ? `${(data.potential_revenue / 1000).toFixed(0)}k FCFA`
              : "0 FCFA"
          }
          sub="toutes commandes"
          color="#16a34a"
        />
        <StatPill label="Confirmées" value={confirmed} color="#16a34a" />
        <StatPill label="En attente" value={pending} color="#f59e0b" />
      </div>

      {/* Infos tunnel WhatsApp */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-emerald-100 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Package size={18} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-zinc-900">
              Comment fonctionne le tunnel de commande ?
            </p>
            <p className="text-zinc-600 text-sm mt-1 leading-relaxed">
              Quand un client clique <strong>"Commander"</strong> sur votre
              menu, une commande est créée automatiquement avec un ID unique{" "}
              <code className="text-xs bg-emerald-100 px-1.5 py-0.5 rounded font-mono">
                #ZO-XXXXX
              </code>
              . Le client est redirigé vers votre WhatsApp avec le détail
              pré-rempli. Vous recevez aussi un email de notification
              instantanée.
            </p>
          </div>
        </div>
      </div>

      {/* Tableau commandes récentes */}
      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <p className="font-semibold text-zinc-900">Commandes récentes</p>
          <span className="text-xs text-zinc-400">10 dernières</span>
        </div>

        {!data?.recent_orders?.length ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={22} className="text-zinc-300" />
            </div>
            <p className="text-zinc-500 font-medium">
              Aucune commande pour l'instant
            </p>
            <p className="text-zinc-400 text-sm mt-1">
              Les commandes apparaîtront ici dès qu'un client commandera via
              votre menu
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {data.recent_orders.map((order: any, i: number) => {
              const sc = STATUS[order.status] || STATUS.PENDING;
              const StatusIcon = sc.icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={16} className="text-zinc-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-zinc-900 font-mono text-sm">
                        #{order.short_id}
                      </p>
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ color: sc.color, backgroundColor: sc.bg }}
                      >
                        <StatusIcon size={10} />
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-xs mt-0.5">
                      {order.items?.length || 0} article
                      {(order.items?.length || 0) > 1 ? "s" : ""}
                      {order.customer_phone && ` · ${order.customer_phone}`}
                      {order.note && ` · "${order.note}"`}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-zinc-900">
                      {order.total_amount?.toLocaleString("fr-FR")} FCFA
                    </p>
                    <p className="text-zinc-400 text-xs mt-0.5">
                      {new Date(order.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Items les plus commandés */}
      {data?.recent_orders?.length > 0 && (
        <div className="bg-white rounded-2xl border border-zinc-100 p-6">
          <p className="font-semibold text-zinc-900 mb-4">
            Détail de la dernière commande
          </p>
          <div className="space-y-2">
            {data.recent_orders[0]?.items?.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-3 py-2 border-b border-zinc-50 last:border-0"
              >
                <span className="w-6 h-6 bg-zinc-100 rounded-lg flex items-center justify-center text-xs font-bold text-zinc-500">
                  {item.quantity}
                </span>
                <span className="flex-1 text-sm text-zinc-700">
                  {item.name}
                </span>
                <span className="text-sm font-semibold text-zinc-900">
                  {item.subtotal?.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
