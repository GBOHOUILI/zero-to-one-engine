"use client";

import { useEffect, useState } from "react";
import { superAdminApi } from "@/lib/api";
import { DonutChart, ChartLegend } from "@/components/charts";
import {
  CreditCard,
  Plus,
  Check,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
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

const METHOD_LABELS: Record<string, string> = {
  MTN_MOMO: "MTN MoMo",
  MOOV_MONEY: "Moov Money",
  CASH: "Espèces",
  WAVE: "Wave",
  VISA: "Visa",
  MASTERCARD: "Mastercard",
};

export default function SubscriptionsPage() {
  const [payments, setPayments] = useState<any>({ data: [], meta: {} });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [plan, setPlan] = useState({
    name: "",
    price: "",
    billing_period: "monthly",
    max_menu_items: "30",
    analytics: false,
    custom_domain: false,
  });
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setPayments(await superAdminApi.getPayments(page));
    } catch {}
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, [page]);

  async function createPlan() {
    setCreating(true);
    // superAdminApi.createPlan(plan) — à implémenter
    setCreating(false);
    setShowPlanForm(false);
  }

  const data = payments?.data ?? [];
  const meta = payments?.meta ?? {};

  // Donut méthodes de paiement
  const methodCounts: Record<string, number> = {};
  data.forEach((p: any) => {
    methodCounts[p.method] = (methodCounts[p.method] ?? 0) + p.amount;
  });
  const methodDonut = Object.entries(methodCounts)
    .slice(0, 4)
    .map(([k, v], i) => ({
      label: METHOD_LABELS[k] || k,
      value: v as number,
      color: ["#22c55e", "#16a34a", "#f59e0b", "#3b82f6"][i] ?? "#052e16",
    }));

  const totalRevenue = data.reduce((s: number, p: any) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Abonnements
          </h1>
          <p className="text-emerald-800 text-sm mt-0.5">
            Gestion des plans et paiements
          </p>
        </div>
        <button
          onClick={() => setShowPlanForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-sm transition-colors"
        >
          <Plus size={15} /> Nouveau plan
        </button>
      </div>

      {/* Stats */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {[
            {
              label: "Revenus affichés",
              value: `${(totalRevenue / 1000).toFixed(0)}k FCFA`,
            },
            { label: "Paiements", value: meta.total ?? "—" },
          ].map(({ label, value }) => (
            <Card key={label}>
              <p className="text-3xl font-black text-white">{value}</p>
              <p className="text-emerald-800 text-sm mt-1">{label}</p>
            </Card>
          ))}
        </div>
        <Card>
          <p className="text-white font-bold mb-3">Par méthode</p>
          <div className="flex flex-col items-center gap-3 overflow-visible">
            <DonutChart
              data={
                methodDonut.length > 0
                  ? methodDonut
                  : [{ label: "Aucun", value: 1, color: "#1a3320" }]
              }
              size={140}
              thickness={20}
              centerValue={`${(totalRevenue / 1000).toFixed(0)}k`}
              centerLabel="FCFA"
            />
            <ChartLegend
              items={methodDonut.map((d) => ({
                ...d,
                value: `${(d.value / 1000).toFixed(0)}k`,
              }))}
            />
          </div>
        </Card>
      </div>

      {/* Payments table */}
      <Card className="!p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-emerald-900/30 flex items-center justify-between">
          <p className="text-white font-bold">Historique des paiements</p>
          <span className="text-emerald-700 text-xs">
            {meta.total ?? 0} enregistrements
          </span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-emerald-900/20">
              {[
                "Restaurant",
                "Montant",
                "Méthode",
                "Ref.",
                "Date",
                "Statut",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-emerald-700 text-xs font-mono uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center">
                  <Loader2
                    className="animate-spin text-emerald-700 mx-auto"
                    size={20}
                  />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-emerald-800 text-sm"
                >
                  Aucun paiement
                </td>
              </tr>
            ) : (
              data.map((p: any, i: number) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-emerald-900/20 hover:bg-emerald-500/3 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="text-emerald-300 text-sm font-medium">
                      {p.restaurant ?? "—"}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-white font-black text-sm">
                      {(p.amount / 1000).toFixed(0)}k FCFA
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-emerald-500 text-xs font-medium">
                      {METHOD_LABELS[p.method] ?? p.method}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-emerald-700 font-mono text-xs">
                      {p.transaction_ref ?? "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-emerald-700 text-xs">
                    {p.paid_at
                      ? new Date(p.paid_at).toLocaleDateString("fr-FR")
                      : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        p.status === "COMPLETED"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : p.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>

        {meta.lastPage > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-emerald-900/30">
            <p className="text-emerald-800 text-xs">
              Page {page}/{meta.lastPage} · {meta.total} paiements
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
      </Card>

      {/* Modal nouveau plan */}
      {showPlanForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d1a12] border border-emerald-900/40 rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold">Nouveau plan</h2>
              <button
                onClick={() => setShowPlanForm(false)}
                className="text-emerald-700 hover:text-emerald-400"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { field: "name", label: "Nom du plan", placeholder: "Starter" },
                {
                  field: "price",
                  label: "Prix (FCFA/mois)",
                  placeholder: "15000",
                  type: "number",
                },
                {
                  field: "max_menu_items",
                  label: "Max plats",
                  placeholder: "30",
                  type: "number",
                },
              ].map(({ field, label, placeholder, type }) => (
                <div key={field}>
                  <label className="text-emerald-700 text-xs font-medium mb-1.5 block uppercase tracking-wider">
                    {label}
                  </label>
                  <input
                    type={type || "text"}
                    placeholder={placeholder}
                    value={(plan as any)[field]}
                    onChange={(e) =>
                      setPlan({ ...plan, [field]: e.target.value })
                    }
                    className="w-full bg-emerald-900/20 border border-emerald-900/40 text-emerald-300 placeholder-emerald-900 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>
              ))}
              <div className="flex gap-4">
                {[
                  { field: "analytics", label: "Analytics" },
                  { field: "custom_domain", label: "Domaine perso" },
                ].map(({ field, label }) => (
                  <label
                    key={field}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(plan as any)[field]}
                      onChange={(e) =>
                        setPlan({ ...plan, [field]: e.target.checked })
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-emerald-300 text-sm">{label}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={createPlan}
                disabled={!plan.name || !plan.price || creating}
                className="w-full px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2"
              >
                {creating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                Créer le plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
