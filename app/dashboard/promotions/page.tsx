"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { promotionsApi } from "@/lib/api";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  Tag,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from "lucide-react";

interface Promo {
  id: string;
  title: string;
  description?: string;
  active: boolean;
  created_at: string;
}

function PromoForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Promo>;
  onSave: (d: any) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [desc, setDesc] = useState(initial?.description || "");
  return (
    <div className="bg-zinc-50 border border-dashed border-zinc-300 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium mb-1">
        <Sparkles size={14} />
        {initial?.id ? "Modifier la promotion" : "Nouvelle promotion"}
      </div>
      <div>
        <label className="text-xs text-zinc-500 font-medium mb-1.5 block uppercase tracking-wider">
          Titre *
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: -20% ce weekend"
          className="w-full border border-zinc-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 transition-colors"
        />
      </div>
      <div>
        <label className="text-xs text-zinc-500 font-medium mb-1.5 block uppercase tracking-wider">
          Description
        </label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={2}
          placeholder="Détails de l'offre, conditions, etc."
          className="w-full border border-zinc-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 transition-colors resize-none"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={() =>
            onSave({
              title,
              description: desc,
              active: initial?.active ?? true,
            })
          }
          disabled={!title.trim()}
          className="flex items-center gap-2 px-5 py-2 bg-zinc-900 disabled:opacity-40 text-white rounded-xl text-sm font-bold transition-all"
        >
          <Check size={14} />
          {initial?.id ? "Modifier" : "Créer"}
        </button>
      </div>
    </div>
  );
}

export default function PromotionsPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  async function load() {
    try {
      setPromos(await promotionsApi.getAll());
    } catch {}
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function create(d: any) {
    await promotionsApi.create(d).catch(() => {});
    setAdding(false);
    load();
  }

  async function edit(id: string, d: any) {
    await promotionsApi.update(id, d).catch(() => {});
    setEditing(null);
    load();
  }

  async function toggle(id: string, active: boolean) {
    await promotionsApi.toggle(id, !active).catch(() => {});
    setPromos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !active } : p)),
    );
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette promotion ?")) return;
    await promotionsApi.remove(id).catch(() => {});
    setPromos((prev) => prev.filter((p) => p.id !== id));
  }

  const active = promos.filter((p) => p.active);
  const inactive = promos.filter((p) => !p.active);

  if (loading)
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-zinc-300" size={28} />
      </div>
    );

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-zinc-900 tracking-tight">
            Promotions
          </h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            <span className="text-emerald-600 font-medium">
              {active.length} active{active.length !== 1 ? "s" : ""}
            </span>
            {inactive.length > 0 &&
              ` · ${inactive.length} inactive${inactive.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          disabled={adding}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-700 text-white rounded-xl text-sm font-bold transition-all"
        >
          <Plus size={15} />
          Nouvelle promotion
        </button>
      </div>

      {/* Form ajout */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <PromoForm onSave={create} onCancel={() => setAdding(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Promos actives */}
      {active.length > 0 && (
        <div>
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-3">
            Actives
          </p>
          <div className="space-y-3">
            {active.map((promo, i) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                {editing === promo.id ? (
                  <PromoForm
                    initial={promo}
                    onSave={(d) => edit(promo.id, d)}
                    onCancel={() => setEditing(null)}
                  />
                ) : (
                  <div className="bg-white border border-zinc-100 rounded-2xl p-5 flex items-start gap-4 hover:border-zinc-200 hover:shadow-sm transition-all group">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Tag size={16} className="text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-zinc-900">
                          {promo.title}
                        </p>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                          ACTIVE
                        </span>
                      </div>
                      {promo.description && (
                        <p className="text-zinc-500 text-sm mt-1">
                          {promo.description}
                        </p>
                      )}
                      <p className="text-zinc-300 text-xs mt-2">
                        Créée le{" "}
                        {new Date(promo.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={() => toggle(promo.id, promo.active)}
                        className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors"
                        title="Désactiver"
                      >
                        <ToggleRight size={18} />
                      </button>
                      <button
                        onClick={() => setEditing(promo.id)}
                        className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => remove(promo.id)}
                        className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Promos inactives */}
      {inactive.length > 0 && (
        <div>
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-3">
            Inactives
          </p>
          <div className="space-y-2">
            {inactive.map((promo) => (
              <div
                key={promo.id}
                className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 flex items-center gap-3 group"
              >
                <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Tag size={13} className="text-zinc-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-400 line-through">
                    {promo.title}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggle(promo.id, promo.active)}
                    className="p-1.5 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Activer"
                  >
                    <ToggleLeft size={16} />
                  </button>
                  <button
                    onClick={() => remove(promo.id)}
                    className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {promos.length === 0 && !adding && (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tag size={22} className="text-zinc-300" />
          </div>
          <p className="text-zinc-500 font-medium">
            Aucune promotion pour l'instant
          </p>
          <p className="text-zinc-400 text-sm mt-1">
            Créez une offre pour attirer de nouveaux clients
          </p>
        </div>
      )}
    </div>
  );
}
