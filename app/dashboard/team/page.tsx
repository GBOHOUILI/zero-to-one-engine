"use client";

import { useEffect, useState } from "react";
import { teamApi } from "@/lib/api";
import {
  PageHeader,
  Card,
  Btn,
  Input,
  Textarea,
  Modal,
  EmptyState,
  toast,
  Sk,
  Badge,
} from "@/components/dashboard/ui";
import { Plus, Trash2, Edit2, Users, Loader2 } from "lucide-react";

interface Member {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  position: number;
}

const blank = { name: "", role: "", bio: "", image_url: "", position: 0 };

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setMembers(await teamApi.getAll());
    } catch {}
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(blank);
    setModal(true);
  }
  function openEdit(m: Member) {
    setEditing(m);
    setForm({
      name: m.name,
      role: m.role,
      bio: m.bio || "",
      image_url: m.image_url || "",
      position: m.position,
    });
    setModal(true);
  }

  async function save() {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        role: form.role,
        bio: form.bio || undefined,
        image_url: form.image_url || undefined,
        position: form.position,
      };
      if (editing) {
        await teamApi.update(editing.id, payload);
        toast("Membre modifié");
      } else {
        await teamApi.create(payload);
        toast("Membre ajouté");
      }
      setModal(false);
      load();
    } catch (e: any) {
      toast(e.message, "err");
    }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce membre ?")) return;
    await teamApi.remove(id).catch((e: any) => toast(e.message, "err"));
    setMembers((p) => p.filter((m) => m.id !== id));
    toast("Supprimé");
  }

  const f = (k: keyof typeof blank, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <div>
      <PageHeader
        title="Équipe"
        sub={`${members.length} membre${members.length !== 1 ? "s" : ""}`}
        action={
          <Btn icon={<Plus size={15} />} onClick={openAdd}>
            Ajouter
          </Btn>
        }
      />

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Sk key={i} className="h-40" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aucun membre"
          sub="Ajoutez votre équipe pour la présenter sur votre site"
          action={
            <Btn icon={<Plus size={14} />} size="sm" onClick={openAdd}>
              Ajouter un membre
            </Btn>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <Card key={m.id} className="p-5 group">
              <div className="flex items-start gap-3">
                {m.image_url ? (
                  <img
                    src={m.image_url}
                    alt={m.name}
                    className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 ring-1 ring-black/5"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 text-xl font-black text-zinc-400">
                    {m.name[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {m.name}
                  </p>
                  <Badge color="blue">{m.role}</Badge>
                  {m.bio && (
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-2 line-clamp-2">
                      {m.bio}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Btn
                  variant="secondary"
                  size="sm"
                  icon={<Edit2 size={13} />}
                  onClick={() => openEdit(m)}
                >
                  Modifier
                </Btn>
                <Btn
                  variant="danger"
                  size="sm"
                  icon={<Trash2 size={13} />}
                  onClick={() => remove(m.id)}
                >
                  Supprimer
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? "Modifier le membre" : "Nouveau membre"}
      >
        <div className="space-y-4">
          <Input
            label="Nom *"
            value={form.name}
            onChange={(e) => f("name", e.target.value)}
            placeholder="Jean Dupont"
          />
          <Input
            label="Rôle *"
            value={form.role}
            onChange={(e) => f("role", e.target.value)}
            placeholder="Chef de cuisine"
          />
          <Textarea
            label="Biographie"
            value={form.bio}
            onChange={(e) => f("bio", e.target.value)}
            rows={3}
            placeholder="Présentation courte..."
          />
          <Input
            label="URL photo (Cloudinary)"
            value={form.image_url}
            onChange={(e) => f("image_url", e.target.value)}
            placeholder="https://res.cloudinary.com/..."
          />
          <Input
            label="Position"
            type="number"
            value={form.position}
            onChange={(e) => f("position", parseInt(e.target.value) || 0)}
          />
          <div className="flex gap-3 pt-2">
            <Btn
              variant="secondary"
              className="flex-1"
              onClick={() => setModal(false)}
            >
              Annuler
            </Btn>
            <Btn className="flex-1" loading={saving} onClick={save}>
              {editing ? "Modifier" : "Créer"}
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
