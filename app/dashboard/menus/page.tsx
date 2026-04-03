"use client";

import { useEffect, useState, useRef } from "react";
import { menusApi } from "@/lib/api";
import {
  Plus,
  Trash2,
  Edit2,
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Loader2,
  Image,
  X,
  Check,
} from "lucide-react";

// ─── Types légers ────────────────────────────────────────────────────────────
interface Category {
  id: string;
  name: string;
  icon?: string;
  position: number;
  menu_items: Item[];
}
interface Item {
  id: string;
  name: string;
  price: number;
  available: boolean;
  image_url?: string;
  short_description?: string;
}

// ─── Sous-composant: Form item ────────────────────────────────────────────────
function ItemForm({
  categoryId,
  onSuccess,
  onCancel,
  initial,
}: {
  categoryId: string;
  onSuccess: () => void;
  onCancel: () => void;
  initial?: Item;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [price, setPrice] = useState(String(initial?.price || ""));
  const [desc, setDesc] = useState(initial?.short_description || "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function save() {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("price", price);
      fd.append("short_description", desc);
      fd.append("category_id", categoryId);
      fd.append("category_type", "plat");
      if (file) fd.append("image", file);

      if (initial) {
        await menusApi.updateItem(initial.id, fd);
      } else {
        await menusApi.createItem(fd);
      }
      onSuccess();
    } catch {}
    setLoading(false);
  }

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-zinc-500 font-medium mb-1 block">
            Nom du plat *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Poulet braisé"
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-400"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 font-medium mb-1 block">
            Prix (FCFA) *
          </label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            placeholder="3500"
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-400"
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-zinc-500 font-medium mb-1 block">
          Description courte
        </label>
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description affichée sur la carte"
          className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-400"
        />
      </div>
      <div className="flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-600 hover:bg-zinc-100 transition-colors"
        >
          <Image size={13} />
          {file
            ? file.name
            : initial?.image_url
              ? "Changer la photo"
              : "Ajouter une photo"}
        </button>
        {file && (
          <span className="text-xs text-zinc-400 truncate max-w-[120px]">
            {file.name}
          </span>
        )}
        <div className="ml-auto flex gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={save}
            disabled={!name || !price || loading}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-zinc-900 hover:bg-zinc-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {loading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Check size={12} />
            )}
            {initial ? "Modifier" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function MenusPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCats, setOpenCats] = useState<Set<string>>(new Set());
  const [addingItem, setAddingItem] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showCatForm, setShowCatForm] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("");

  async function load() {
    setLoading(true);
    try {
      setCategories(await menusApi.getCategories());
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function toggleCat(id: string) {
    setOpenCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function createCategory() {
    if (!newCatName.trim()) return;
    await menusApi
      .createCategory({ name: newCatName, icon: newCatIcon || undefined })
      .catch(() => {});
    setNewCatName("");
    setNewCatIcon("");
    setShowCatForm(false);
    load();
  }

  async function deleteCategory(id: string) {
    if (!confirm("Supprimer cette catégorie ? Elle doit être vide.")) return;
    await menusApi.deleteCategory(id).catch((e) => alert(e.message));
    load();
  }

  async function deleteItem(id: string) {
    if (!confirm("Supprimer ce plat ?")) return;
    await menusApi.deleteItem(id).catch(() => {});
    load();
  }

  async function toggleAvail(id: string, current: boolean) {
    await menusApi.toggleAvailability(id, !current).catch(() => {});
    load();
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-zinc-400" size={28} />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Menu</h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            {categories.length} catégorie{categories.length > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowCatForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Catégorie
        </button>
      </div>

      {/* New category form */}
      {showCatForm && (
        <div className="bg-white border-2 border-dashed border-zinc-200 rounded-2xl p-5">
          <p className="text-sm font-medium text-zinc-700 mb-3">
            Nouvelle catégorie
          </p>
          <div className="flex gap-3">
            <input
              value={newCatIcon}
              onChange={(e) => setNewCatIcon(e.target.value)}
              placeholder="🍽️"
              maxLength={4}
              className="w-16 border border-zinc-200 rounded-lg px-3 py-2 text-center text-lg focus:outline-none"
            />
            <input
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Nom de la catégorie (ex: Entrées)"
              className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-400"
            />
            <button
              onClick={() => {
                setShowCatForm(false);
                setNewCatName("");
              }}
              className="p-2 text-zinc-400 hover:text-zinc-600"
            >
              <X size={16} />
            </button>
            <button
              onClick={createCategory}
              disabled={!newCatName.trim()}
              className="px-4 py-2 bg-zinc-900 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
            >
              Créer
            </button>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border border-zinc-100 rounded-2xl overflow-hidden"
          >
            {/* Cat header */}
            <div
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-zinc-50 transition-colors"
              onClick={() => toggleCat(cat.id)}
            >
              <GripVertical size={16} className="text-zinc-300 cursor-grab" />
              <span className="text-lg">{cat.icon || "📂"}</span>
              <div className="flex-1">
                <p className="font-semibold text-zinc-900">{cat.name}</p>
                <p className="text-xs text-zinc-400">
                  {cat.menu_items.length} plat
                  {cat.menu_items.length > 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCategory(cat.id);
                }}
                className="p-1.5 text-zinc-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
              {openCats.has(cat.id) ? (
                <ChevronUp size={16} className="text-zinc-400" />
              ) : (
                <ChevronDown size={16} className="text-zinc-400" />
              )}
            </div>

            {/* Items */}
            {openCats.has(cat.id) && (
              <div className="border-t border-zinc-100 p-4 space-y-2">
                {cat.menu_items.map((item) => (
                  <div key={item.id}>
                    {editingItem === item.id ? (
                      <ItemForm
                        categoryId={cat.id}
                        initial={item}
                        onSuccess={() => {
                          setEditingItem(null);
                          load();
                        }}
                        onCancel={() => setEditingItem(null)}
                      />
                    ) : (
                      <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-zinc-50 transition-colors group">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                            <Image size={14} className="text-zinc-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${item.available ? "text-zinc-900" : "text-zinc-400 line-through"}`}
                          >
                            {item.name}
                          </p>
                          {item.short_description && (
                            <p className="text-xs text-zinc-400 truncate">
                              {item.short_description}
                            </p>
                          )}
                        </div>
                        <span className="font-semibold text-zinc-700 text-sm">
                          {item.price.toLocaleString("fr-FR")} FCFA
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleAvail(item.id, item.available)}
                            className={`p-1.5 rounded-lg transition-colors ${item.available ? "text-emerald-500 hover:bg-emerald-50" : "text-zinc-400 hover:bg-zinc-100"}`}
                            title={item.available ? "Désactiver" : "Activer"}
                          >
                            {item.available ? (
                              <Eye size={14} />
                            ) : (
                              <EyeOff size={14} />
                            )}
                          </button>
                          <button
                            onClick={() => setEditingItem(item.id)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add item */}
                {addingItem === cat.id ? (
                  <ItemForm
                    categoryId={cat.id}
                    onSuccess={() => {
                      setAddingItem(null);
                      load();
                    }}
                    onCancel={() => setAddingItem(null)}
                  />
                ) : (
                  <button
                    onClick={() => setAddingItem(cat.id)}
                    className="flex items-center gap-2 w-full py-2.5 px-3 text-sm text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 rounded-xl transition-colors border-2 border-dashed border-zinc-100"
                  >
                    <Plus size={14} /> Ajouter un plat
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-16 text-zinc-400">
            <p className="font-medium">Aucune catégorie pour l'instant</p>
            <p className="text-sm mt-1">
              Créez votre première catégorie pour commencer
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
