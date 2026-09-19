"use client";

import { useEffect, useState, useCallback } from "react";
import { superAdminApi } from "@/lib/api";
import type { Report } from "@/lib/api-types";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

const STATUS: Record<
  string,
  { label: string; color: string; bg: string; icon: LucideIcon }
> = {
  PENDING: {
    label: "En attente",
    color: "#f59e0b",
    bg: "#f59e0b15",
    icon: Clock,
  },
  REVIEWED: {
    label: "Examiné",
    color: "#3b82f6",
    bg: "#3b82f615",
    icon: RefreshCw,
  },
  RESOLVED: {
    label: "Résolu",
    color: "#22c55e",
    bg: "#22c55e15",
    icon: CheckCircle2,
  },
};

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#0d1a12] border border-emerald-900/40 rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    return superAdminApi
      .getReports()
      .then(setReports)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let ignore = false;
    superAdminApi
      .getReports()
      .then((data) => {
        if (!ignore) setReports(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  async function updateStatus(id: string, status: string) {
    await superAdminApi.updateReportStatus(id, status).catch(() => {});
    setReports((p) => p.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  const pending = reports.filter((r) => r.status === "PENDING").length;
  const resolved = reports.filter((r) => r.status === "RESOLVED").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Signalements
          </h1>
          <p className="text-emerald-800 text-sm mt-0.5">
            {pending} en attente · {resolved} résolus
          </p>
        </div>
        <button
          onClick={load}
          className="p-2 text-emerald-700 hover:text-emerald-400 transition-colors"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-emerald-900/30">
          <p className="text-white font-bold">
            Tous les signalements ({reports.length})
          </p>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="animate-spin text-emerald-700" size={22} />
          </div>
        ) : reports.length === 0 ? (
          <div className="py-12 text-center">
            <AlertTriangle
              size={28}
              className="text-emerald-900 mx-auto mb-2"
            />
            <p className="text-emerald-800 text-sm">
              Aucun signalement pour l&apos;instant
            </p>
          </div>
        ) : (
          <div className="divide-y divide-emerald-900/20">
            {reports.map((r, i) => {
              const sc = STATUS[r.status] ?? STATUS.PENDING;
              const Ic = sc.icon;
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-4 px-6 py-4 hover:bg-emerald-500/3 transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: sc.bg }}
                  >
                    <Ic size={15} style={{ color: sc.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-emerald-300 text-sm font-semibold">
                        {r.subject || "Signalement sans titre"}
                      </p>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ color: sc.color, backgroundColor: sc.bg }}
                      >
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-emerald-700 text-xs">
                      {r.restaurant?.name || "Restaurant inconnu"}
                    </p>
                    {r.description && (
                      <p className="text-emerald-800 text-xs mt-1 line-clamp-2">
                        {r.description}
                      </p>
                    )}
                    <p className="text-emerald-900 text-[10px] mt-1">
                      {new Date(r.created_at).toLocaleString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    {r.status !== "REVIEWED" && (
                      <button
                        onClick={() => updateStatus(r.id, "REVIEWED")}
                        className="text-[11px] px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                      >
                        Examiner
                      </button>
                    )}
                    {r.status !== "RESOLVED" && (
                      <button
                        onClick={() => updateStatus(r.id, "RESOLVED")}
                        className="text-[11px] px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
                      >
                        Résoudre
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
