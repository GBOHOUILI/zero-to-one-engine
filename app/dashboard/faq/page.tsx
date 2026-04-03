"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqApi } from "@/lib/api";
import {
  Plus,
  Trash2,
  Edit2,
  GripVertical,
  Check,
  X,
  Loader2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Faq {
  id: string;
  question: string;
  answer: string;
  position: number;
}

function FaqEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Faq>;
  onSave: (q: string, a: string) => void;
  onCancel: () => void;
}) {
  const [q, setQ] = useState(initial?.question || "");
  const [a, setA] = useState(initial?.answer || "");
  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3">
      <div>
        <label className="text-xs text-zinc-500 font-medium mb-1.5 block">
          Question
        </label>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Faites-vous la livraison ?"
          className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-400 bg-white"
        />
      </div>
      <div>
        <label className="text-xs text-zinc-500 font-medium mb-1.5 block">
          Réponse
        </label>
        <textarea
          value={a}
          onChange={(e) => setA(e.target.value)}
          rows={3}
          placeholder="Oui, nous livrons dans un rayon de 5km. Contactez-nous sur WhatsApp."
          className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-400 bg-white resize-none"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700"
        >
          Annuler
        </button>
        <button
          onClick={() => onSave(q, a)}
          disabled={!q.trim() || !a.trim()}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-zinc-900 disabled:opacity-40 text-white rounded-lg text-sm font-medium"
        >
          <Check size={13} />
          {initial?.id ? "Modifier" : "Ajouter"}
        </button>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    try {
      setFaqs(await faqApi.getAll());
    } catch {}
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function save(q: string, a: string) {
    await faqApi.create({ question: q, answer: a }).catch(() => {});
    setAdding(false);
    load();
  }

  async function saveEdit(id: string, q: string, a: string) {
    await faqApi.update(id, { question: q, answer: a }).catch(() => {});
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette FAQ ?")) return;
    await faqApi.remove(id).catch(() => {});
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  }

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
            FAQ
          </h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            Questions fréquentes affichées sur votre site · {faqs.length} entrée
            {faqs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          disabled={adding}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-700 text-white rounded-xl text-sm font-bold transition-all"
        >
          <Plus size={15} />
          Ajouter une FAQ
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
            <FaqEditor onSave={save} onCancel={() => setAdding(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste */}
      <div className="space-y-2">
        <AnimatePresence>
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white border border-zinc-100 rounded-xl overflow-hidden hover:border-zinc-200 transition-all"
            >
              {editing === faq.id ? (
                <div className="p-4">
                  <FaqEditor
                    initial={faq}
                    onSave={(q, a) => saveEdit(faq.id, q, a)}
                    onCancel={() => setEditing(null)}
                  />
                </div>
              ) : (
                <>
                  <div
                    className="flex items-center gap-3 px-4 py-4 cursor-pointer"
                    onClick={() =>
                      setExpanded(expanded === faq.id ? null : faq.id)
                    }
                  >
                    <GripVertical
                      size={16}
                      className="text-zinc-200 cursor-grab flex-shrink-0"
                    />
                    <div className="w-6 h-6 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <HelpCircle size={13} className="text-zinc-400" />
                    </div>
                    <p className="flex-1 font-medium text-zinc-800 text-sm">
                      {faq.question}
                    </p>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditing(faq.id);
                        }}
                        className="p-1.5 text-zinc-300 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-all"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(faq.id);
                        }}
                        className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                      {expanded === faq.id ? (
                        <ChevronUp size={15} className="text-zinc-400 ml-1" />
                      ) : (
                        <ChevronDown size={15} className="text-zinc-400 ml-1" />
                      )}
                    </div>
                  </div>
                  <AnimatePresence>
                    {expanded === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 pl-[60px] text-sm text-zinc-500 leading-relaxed border-t border-zinc-50 pt-3">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {faqs.length === 0 && !adding && (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HelpCircle size={22} className="text-zinc-300" />
            </div>
            <p className="text-zinc-500 font-medium">
              Aucune FAQ pour l'instant
            </p>
            <p className="text-zinc-400 text-sm mt-1">
              Ajoutez des questions fréquentes pour rassurer vos clients
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
