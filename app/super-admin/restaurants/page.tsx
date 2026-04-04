"use client";

import { useEffect, useState } from "react";
import { superAdminApi } from "@/lib/api";
import {
  Search,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  Store,
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  active: { label: "Actif", color: "#22c55e", bg: "#22c55e15" },
  suspended: { label: "Suspendu", color: "#ef4444", bg: "#ef444415" },
  incomplete: { label: "Incomplet", color: "#f59e0b", bg: "#f59e0b15" },
};

export default function SuperAdminRestaurants() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  // Form state
  const [form, setForm] = useState({
    adminEmail: "",
    name: "",
    type: "africain",
    template: "default",
    primaryColor: "#22c55e",
    currency: "XOF",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await superAdminApi.getRestaurants({
        search,
        page,
        limit: 10,
      });
      setRestaurants(data.items ?? data);
      setMeta(data.meta);
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [search, page]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    try {
      await superAdminApi.createRestaurant(form);
      setShowCreate(false);
      load();
    } catch (err: any) {
      setCreateError(err.message);
    }
    setCreating(false);
  }

  async function handleStatusChange(id: string, status: string) {
    await superAdminApi.updateStatus(id, status).catch(() => {});
    load();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Restaurants</h1>
          <p className="text-emerald-800 text-sm mt-0.5">
            {meta?.total ?? "—"} restaurants sur la plateforme
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-sm transition-colors"
        >
          <Plus size={16} />
          Nouveau restaurant
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-700"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Rechercher par nom ou slug…"
          className="w-full bg-[#0d1a12] border border-emerald-900/40 text-emerald-300 placeholder-emerald-900 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-600 transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-[#0d1a12] border border-emerald-900/40 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-emerald-900/40">
              <th className="text-left px-5 py-3.5 text-emerald-700 text-xs font-mono uppercase tracking-wider">
                Restaurant
              </th>
              <th className="text-left px-5 py-3.5 text-emerald-700 text-xs font-mono uppercase tracking-wider">
                Slug
              </th>
              <th className="text-left px-5 py-3.5 text-emerald-700 text-xs font-mono uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-5 py-3.5 text-emerald-700 text-xs font-mono uppercase tracking-wider">
                Créé le
              </th>
              <th className="text-right px-5 py-3.5 text-emerald-700 text-xs font-mono uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <Loader2
                    className="animate-spin text-emerald-700 mx-auto"
                    size={24}
                  />
                </td>
              </tr>
            ) : restaurants.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-emerald-800">
                  Aucun restaurant trouvé
                </td>
              </tr>
            ) : (
              restaurants.map((r) => {
                const sc = STATUS_CONFIG[r.status] || STATUS_CONFIG.incomplete;
                return (
                  <tr
                    key={r.id}
                    className="border-b border-emerald-900/20 hover:bg-emerald-500/3 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {r.logo_url ? (
                          <img
                            src={r.logo_url}
                            alt={r.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Store size={14} className="text-emerald-600" />
                          </div>
                        )}
                        <div>
                          <p className="text-emerald-300 text-sm font-medium">
                            {r.name}
                          </p>
                          <p className="text-emerald-800 text-xs">{r.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-emerald-600 font-mono text-xs">
                        {r.slug}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: sc.color, backgroundColor: sc.bg }}
                      >
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-emerald-700 text-xs">
                      {new Date(r.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {r.status !== "active" && (
                          <button
                            onClick={() => handleStatusChange(r.id, "active")}
                            className="text-emerald-700 hover:text-emerald-400 transition-colors"
                            title="Activer"
                          >
                            <CheckCircle2 size={15} />
                          </button>
                        )}
                        {r.status === "active" && (
                          <button
                            onClick={() =>
                              handleStatusChange(r.id, "suspended")
                            }
                            className="text-emerald-700 hover:text-red-400 transition-colors"
                            title="Suspendre"
                          >
                            <XCircle size={15} />
                          </button>
                        )}
                        <a
                          href={`/${r.slug}`}
                          target="_blank"
                          className="text-emerald-700 hover:text-emerald-400 transition-colors"
                          title="Voir le site"
                        >
                          <ExternalLink size={15} />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {meta && meta.lastPage > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-emerald-900/30">
            <p className="text-emerald-800 text-xs">
              Page {page} sur {meta.lastPage} · {meta.total} résultats
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 text-emerald-700 hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
                disabled={page === meta.lastPage}
                className="p-1.5 text-emerald-700 hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Créer restaurant */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d1a12] border border-emerald-900/40 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-white font-bold text-lg mb-5">
              Nouveau restaurant
            </h2>
            {createError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {createError}
              </div>
            )}
            <form onSubmit={handleCreate} className="space-y-4">
              {[
                {
                  field: "adminEmail",
                  label: "Email de l'admin",
                  type: "email",
                  placeholder: "admin@restaurant.bj",
                },
                {
                  field: "name",
                  label: "Nom du restaurant",
                  type: "text",
                  placeholder: "Le Bon Goût",
                },
              ].map(({ field, label, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-emerald-700 text-xs font-medium mb-1.5 uppercase tracking-wider">
                    {label}
                  </label>
                  <input
                    type={type}
                    required
                    placeholder={placeholder}
                    value={(form as any)[field]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                    className="w-full bg-emerald-900/20 border border-emerald-900/40 text-emerald-300 placeholder-emerald-900 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition-all"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-700 text-xs font-medium mb-1.5 uppercase tracking-wider">
                    Devise
                  </label>
                  <select
                    value={form.currency}
                    onChange={(e) =>
                      setForm({ ...form, currency: e.target.value })
                    }
                    className="w-full bg-emerald-900/20 border border-emerald-900/40 text-emerald-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                  >
                    <option value="XOF">XOF (FCFA)</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-emerald-700 text-xs font-medium mb-1.5 uppercase tracking-wider">
                    Couleur
                  </label>

                  <div className="relative h-10 w-full p-1 border border-emerald-900/40 text-emerald-700 rounded-lg">
                    <input
                      type="color"
                      value={form.primaryColor}
                      onChange={(e) =>
                        setForm({ ...form, primaryColor: e.target.value })
                      }
                      className="absolute inset-0 w-full h-full cursor-pointer rounded-lg appearance-none border-0 p-0 bg-transparent"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 px-4 py-2.5 border border-emerald-900/40 text-emerald-700 rounded-xl text-sm font-medium hover:text-emerald-400 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Création…
                    </>
                  ) : (
                    "Créer"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
