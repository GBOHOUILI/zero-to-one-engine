"use client";

// ═══════════════════════════════════════════════════════
// BACKUP PAGE
// ═══════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import { superAdminApi } from "@/lib/api";
import {
  HardDrive,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Download,
  RefreshCw,
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

export default function BackupPage() {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [triggered, setTriggered] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setBackups(await superAdminApi.listBackups());
    } catch {}
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function triggerBackup() {
    setTriggering(true);
    try {
      await superAdminApi.triggerBackup();
      setTriggered(true);
      setTimeout(() => setTriggered(false), 3000);
      await load();
    } catch {}
    setTriggering(false);
  }

  const lastBackup = backups[0];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Backup
          </h1>
          <p className="text-emerald-800 text-sm mt-0.5">
            Sauvegardes automatiques de la base de données
          </p>
        </div>
        <button
          onClick={triggerBackup}
          disabled={triggering}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            triggered
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-emerald-500 hover:bg-emerald-400 text-black"
          }`}
        >
          {triggering ? (
            <Loader2 size={15} className="animate-spin" />
          ) : triggered ? (
            <CheckCircle2 size={15} />
          ) : (
            <Play size={15} />
          )}
          {triggered ? "Déclenché !" : "Lancer un backup"}
        </button>
      </div>

      {/* Status card */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                lastBackup?.status === "SUCCESS"
                  ? "bg-emerald-500/15"
                  : "bg-red-500/10"
              }`}
            >
              <HardDrive
                size={20}
                className={
                  lastBackup?.status === "SUCCESS"
                    ? "text-emerald-400"
                    : "text-red-400"
                }
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {lastBackup?.status === "SUCCESS" ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <XCircle size={16} className="text-red-400" />
                )}
                <p className="text-white font-bold">
                  {loading
                    ? "Chargement…"
                    : lastBackup
                      ? `Dernier backup : ${lastBackup.status}`
                      : "Aucun backup effectué"}
                </p>
              </div>
              {lastBackup && (
                <>
                  <p className="text-emerald-700 text-sm">
                    {new Date(lastBackup.created_at).toLocaleString("fr-FR")}
                  </p>
                  {lastBackup.file_size && (
                    <p className="text-emerald-800 text-xs mt-0.5">
                      {(lastBackup.file_size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-emerald-700" />
            <p className="text-emerald-300 text-sm font-medium">
              Planification
            </p>
          </div>
          <p className="text-white font-bold">Quotidien à 02:00 UTC</p>
          <p className="text-emerald-800 text-xs mt-1">
            Stocké sur Cloudinary (raw)
          </p>
          <p className="text-emerald-800 text-xs">Rétention : 30 jours</p>
        </Card>
      </div>

      {/* Backup list */}
      <Card className="!p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-emerald-900/30 flex items-center justify-between">
          <p className="text-white font-bold">Historique ({backups.length})</p>
          <button
            onClick={load}
            className="text-emerald-700 hover:text-emerald-400 transition-colors"
          >
            <RefreshCw size={14} />
          </button>
        </div>
        <div className="divide-y divide-emerald-900/20">
          {loading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="animate-spin text-emerald-700" size={22} />
            </div>
          ) : backups.length === 0 ? (
            <p className="text-emerald-800 text-sm text-center py-10">
              Aucun backup enregistré
            </p>
          ) : (
            backups.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-emerald-500/3 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    b.status === "SUCCESS"
                      ? "bg-emerald-500/10"
                      : "bg-red-500/10"
                  }`}
                >
                  {b.status === "SUCCESS" ? (
                    <CheckCircle2 size={15} className="text-emerald-400" />
                  ) : (
                    <XCircle size={15} className="text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-emerald-300 text-sm font-medium font-mono truncate">
                    {b.filename ?? `backup_${b.id}`}
                  </p>
                  <p className="text-emerald-800 text-xs">
                    {new Date(b.created_at).toLocaleString("fr-FR")}
                    {b.file_size &&
                      ` · ${(b.file_size / 1024 / 1024).toFixed(1)} MB`}
                  </p>
                </div>
                {b.cloudinary_url && (
                  <a
                    href={b.cloudinary_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-emerald-700 hover:text-emerald-400 transition-colors"
                  >
                    <Download size={15} />
                  </a>
                )}
              </motion.div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
