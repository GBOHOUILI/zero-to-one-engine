"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { galleryApi } from "@/lib/api";
import {
  Upload,
  Trash2,
  GripVertical,
  Edit2,
  Check,
  X,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";

interface GalleryItem {
  id: string;
  image_url: string;
  alt_text?: string;
  position: number;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingAlt, setEditingAlt] = useState<string | null>(null);
  const [altValue, setAltValue] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    try {
      setItems(await galleryApi.getAll());
    } catch {}
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      Array.from(files)
        .slice(0, 20)
        .forEach((f) => fd.append("files", f));
      await galleryApi.upload(fd);
      await load();
    } catch (e: any) {
      setError(e.message || "Erreur lors de l'upload");
    }
    setUploading(false);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  async function saveAlt(id: string) {
    await galleryApi.updateAltText(id, altValue).catch(() => {});
    setEditingAlt(null);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, alt_text: altValue } : i)),
    );
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette image ?")) return;
    await galleryApi.remove(id).catch(() => {});
    setItems((prev) => prev.filter((i) => i.id !== id));
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
            Galerie
          </h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            {items.length} photo{items.length !== 1 ? "s" : ""} · jusqu'à 20
            images
          </p>
        </div>
        <div className="flex gap-2">
          {items.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Vider toute la galerie ?"))
                  galleryApi.removeAll().then(load);
              }}
              className="flex items-center gap-1.5 px-3 py-2 border border-zinc-200 text-zinc-500 hover:text-red-500 hover:border-red-200 rounded-xl text-sm font-medium transition-all"
            >
              <Trash2 size={14} />
              Tout supprimer
            </button>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-700 text-white rounded-xl text-sm font-bold transition-all"
          >
            <Upload size={14} />
            Uploader des photos
          </button>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          <AlertCircle size={16} />
          {error}
          <button onClick={() => setError("")} className="ml-auto">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !uploading && fileRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200
          ${
            dragOver
              ? "border-zinc-400 bg-zinc-50 scale-[1.01]"
              : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50"
          }
        `}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={28} className="animate-spin text-zinc-400" />
            <p className="text-zinc-500 text-sm font-medium">
              Upload en cours…
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center">
              <Upload size={22} className="text-zinc-400" />
            </div>
            <div>
              <p className="text-zinc-700 font-medium text-sm">
                Glissez vos photos ici
              </p>
              <p className="text-zinc-400 text-xs mt-0.5">
                ou cliquez pour sélectionner · JPG, PNG, WebP · max 10MB/image
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
                className="group relative bg-zinc-100 rounded-xl overflow-hidden aspect-square"
              >
                <img
                  src={item.image_url}
                  alt={item.alt_text || ""}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-end p-2">
                  <div className="w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-y-1.5">
                    {/* Alt text */}
                    {editingAlt === item.id ? (
                      <div className="flex gap-1">
                        <input
                          value={altValue}
                          onChange={(e) => setAltValue(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Texte alternatif"
                          autoFocus
                          className="flex-1 bg-black/60 text-white placeholder-white/40 rounded-lg px-2.5 py-1.5 text-xs outline-none border border-white/20"
                        />
                        <button
                          onClick={() => saveAlt(item.id)}
                          className="p-1.5 bg-emerald-500 rounded-lg text-white"
                        >
                          <Check size={12} />
                        </button>
                        <button
                          onClick={() => setEditingAlt(null)}
                          className="p-1.5 bg-black/40 rounded-lg text-white"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAlt(item.id);
                            setAltValue(item.alt_text || "");
                          }}
                          className="p-1.5 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
                          title="Modifier l'alt text"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(item.id);
                          }}
                          className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Position badge */}
                <div className="absolute top-2 left-2 w-5 h-5 bg-black/60 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-[10px] font-bold">
                    {i + 1}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ImageIcon size={24} className="text-zinc-300" />
          </div>
          <p className="text-zinc-500 font-medium">
            Aucune photo dans la galerie
          </p>
          <p className="text-zinc-400 text-sm mt-1">
            Ajoutez des photos pour attirer vos clients
          </p>
        </div>
      )}
    </div>
  );
}
