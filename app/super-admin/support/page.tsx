"use client";

import { useEffect, useState } from "react";
import { superAdminApi } from "@/lib/api";
import {
  LifeBuoy,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PRIORITY: Record<string, { label: string; color: string; bg: string }> = {
  LOW: { label: "Faible", color: "#6b7280", bg: "#f4f4f5" },
  MEDIUM: { label: "Moyen", color: "#f59e0b", bg: "#fef3c7" },
  HIGH: { label: "Élevé", color: "#ef4444", bg: "#fee2e2" },
};
const STATUS: Record<string, { label: string; icon: any; color: string }> = {
  OPEN: { label: "Ouvert", icon: Clock, color: "#f59e0b" },
  IN_PROGRESS: { label: "En cours", icon: MessageSquare, color: "#3b82f6" },
  RESOLVED: { label: "Résolu", icon: CheckCircle2, color: "#22c55e" },
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

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setTickets(await superAdminApi.getSupportTickets());
    } catch {}
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function sendReply() {
    if (!reply.trim() || !selected) return;
    setSending(true);
    try {
      await superAdminApi.replyTicket(selected.id, reply);
      setReply("");
      await load();
      // Refresh selected
      setSelected((prev: any) => ({
        ...prev,
        messages: [
          ...(prev.messages ?? []),
          {
            id: Date.now(),
            content: reply,
            sender_role: "SUPER_ADMIN",
            created_at: new Date().toISOString(),
          },
        ],
      }));
    } catch {}
    setSending(false);
  }

  const open = tickets.filter((t) => t.status !== "RESOLVED").length;
  const resolved = tickets.filter((t) => t.status === "RESOLVED").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Support
          </h1>
          <p className="text-emerald-800 text-sm mt-0.5">
            {open} ticket{open !== 1 ? "s" : ""} ouvert{open !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-3">
          {[
            { label: "Ouverts", value: open, color: "#f59e0b" },
            { label: "Résolus", value: resolved, color: "#22c55e" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-[#0d1a12] border border-emerald-900/40 rounded-xl px-4 py-2 text-right"
            >
              <p className="text-xl font-black" style={{ color }}>
                {value}
              </p>
              <p className="text-emerald-800 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`grid gap-5 ${selected ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}
      >
        {/* Ticket list */}
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-emerald-900/30">
            <p className="text-white font-bold">Tickets ({tickets.length})</p>
          </div>
          <div className="divide-y divide-emerald-900/20 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="py-10 flex justify-center">
                <Loader2 className="animate-spin text-emerald-700" size={22} />
              </div>
            ) : tickets.length === 0 ? (
              <p className="text-emerald-800 text-sm text-center py-10">
                Aucun ticket de support
              </p>
            ) : (
              tickets.map((t, i) => {
                const sc = STATUS[t.status] ?? STATUS.OPEN;
                const pc = PRIORITY[t.priority ?? "LOW"] ?? PRIORITY.LOW;
                const StatusIcon = sc.icon;
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelected(t)}
                    className={`flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors ${
                      selected?.id === t.id
                        ? "bg-emerald-500/8"
                        : "hover:bg-emerald-500/3"
                    }`}
                  >
                    <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <LifeBuoy size={15} className="text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-emerald-300 text-sm font-semibold truncate">
                          {t.subject}
                        </p>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0"
                          style={{
                            color: pc.color,
                            backgroundColor: pc.bg + "20",
                          }}
                        >
                          {pc.label}
                        </span>
                      </div>
                      <p className="text-emerald-700 text-xs truncate">
                        {t.restaurant?.name ?? "Restaurant inconnu"}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <StatusIcon size={10} style={{ color: sc.color }} />
                        <span
                          className="text-[10px]"
                          style={{ color: sc.color }}
                        >
                          {sc.label}
                        </span>
                        <span className="text-emerald-900 text-[10px]">·</span>
                        <span className="text-emerald-800 text-[10px]">
                          {new Date(t.created_at).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </Card>

        {/* Thread */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card className="flex flex-col" style={{ height: "600px" }}>
                {/* Thread header */}
                <div className="flex items-start gap-3 px-5 py-4 border-b border-emerald-900/30">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">
                      {selected.subject}
                    </p>
                    <p className="text-emerald-700 text-xs mt-0.5">
                      {selected.restaurant?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-emerald-700 hover:text-emerald-400"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {(selected.messages ?? []).map((msg: any, i: number) => {
                    const isSA = msg.sender_role === "SUPER_ADMIN";
                    return (
                      <div
                        key={msg.id ?? i}
                        className={`flex ${isSA ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                            isSA
                              ? "bg-emerald-500/15 text-emerald-300"
                              : "bg-emerald-900/30 text-emerald-400"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">
                            {msg.content}
                          </p>
                          <p className="text-[10px] opacity-50 mt-1">
                            {new Date(msg.created_at).toLocaleTimeString(
                              "fr-FR",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {!selected.messages?.length && (
                    <p className="text-emerald-800 text-sm text-center py-4">
                      Aucun message. Répondez pour commencer.
                    </p>
                  )}
                </div>

                {/* Reply */}
                <div className="px-5 py-4 border-t border-emerald-900/30">
                  <div className="flex gap-2">
                    <input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && !e.shiftKey && sendReply()
                      }
                      placeholder="Votre réponse… (Entrée pour envoyer)"
                      className="flex-1 bg-emerald-900/20 border border-emerald-900/40 text-emerald-300 placeholder-emerald-900 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600"
                    />
                    <button
                      onClick={sendReply}
                      disabled={!reply.trim() || sending}
                      className="p-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black rounded-xl transition-colors"
                    >
                      {sending ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Send size={15} />
                      )}
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
