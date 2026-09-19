"use client";

import { useEffect, useState } from "react";
import { pageConfigApi } from "@/lib/api";
import {
  PageHeader,
  Card,
  Btn,
  Input,
  Textarea,
  Toggle,
  Tabs,
  SaveBtn,
  toast,
  Sk,
} from "@/components/dashboard/ui";
import { FileImage, Image, Video, Trash2, Upload, Loader2 } from "lucide-react";

const PAGES = [
  { id: "home", label: "Accueil", icon: FileImage },
  { id: "menu", label: "Menu", icon: FileImage },
  { id: "gallery", label: "Galerie", icon: Image },
  { id: "about", label: "À propos", icon: FileImage },
  { id: "contact", label: "Contact", icon: FileImage },
];

function PageEditor({ slug }: { slug: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setData(await pageConfigApi.getOne(slug));
    } catch {
      setData({});
    }
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, [slug]);

  async function save() {
    setSaving(true);
    try {
      await pageConfigApi.update(slug, {
        page_title: data.page_title,
        page_subtitle: data.page_subtitle,
        page_text: data.page_text,
        hero_autoplay: data.hero_autoplay,
        hero_muted: data.hero_muted,
        hero_loop: data.hero_loop,
      });
      toast("Page sauvegardée");
    } catch (e: any) {
      toast(e.message, "err");
    }
    setSaving(false);
  }

  async function uploadHero(type: "image" | "video", file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("page_slug", slug);
      fd.append("hero_autoplay", "true");
      fd.append("hero_muted", "true");
      fd.append("hero_loop", "true");
      await pageConfigApi.uploadHeroMedia(slug, fd);
      toast("Média héro mis à jour");
      load();
    } catch (e: any) {
      toast(e.message, "err");
    }
    setUploading(false);
  }

  async function removeHero() {
    if (!confirm("Supprimer le média héro ?")) return;
    try {
      await pageConfigApi.removeHeroMedia(slug);
      toast("Supprimé");
      load();
    } catch (e: any) {
      toast(e.message, "err");
    }
  }

  const set = (k: string, v: any) => setData((p: any) => ({ ...p, [k]: v }));

  if (loading)
    return (
      <div className="grid gap-4">
        <Sk className="h-48" />
        <Sk className="h-32" />
      </div>
    );

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      {/* Textes de la page */}
      <Card className="p-6 space-y-4">
        <p className="font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Contenu de la page
        </p>
        <Input
          label="Titre"
          value={data?.page_title || ""}
          onChange={(e) => set("page_title", e.target.value)}
          placeholder="Titre affiché sur la page"
        />
        <Input
          label="Sous-titre"
          value={data?.page_subtitle || ""}
          onChange={(e) => set("page_subtitle", e.target.value)}
          placeholder="Accroche courte"
        />
        <Textarea
          label="Texte principal"
          value={data?.page_text || ""}
          onChange={(e) => set("page_text", e.target.value)}
          rows={4}
          placeholder="Description de la page..."
        />
        <SaveBtn onSave={save} />
      </Card>

      {/* Héro media */}
      <Card className="p-6">
        <p className="font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Médias du héro
        </p>

        {/* Aperçu */}
        {data?.hero_media_url ? (
          <div className="relative rounded-xl overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-800 mb-4">
            {data.hero_media_type === "video" ? (
              <video
                src={data.hero_media_url}
                poster={data.hero_poster_url}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={data.hero_media_url}
                alt="hero"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute top-2 right-2">
              <button
                onClick={removeHero}
                className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
            <div className="absolute bottom-2 left-2">
              <span className="text-[10px] px-2 py-0.5 bg-black/60 text-white rounded-full font-mono">
                {data.hero_media_type === "video" ? "🎬 Vidéo" : "🖼️ Image"}
              </span>
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-4">
            <div className="text-center">
              <FileImage
                size={32}
                className="text-zinc-300 dark:text-zinc-600 mx-auto mb-2"
              />
              <p className="text-zinc-400 text-sm">Aucun média héro</p>
            </div>
          </div>
        )}

        {/* Upload buttons */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadHero("image", f);
              }}
            />
            <div className="flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 transition-all">
              {uploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Image size={14} />
              )}
              Image
            </div>
          </label>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadHero("video", f);
              }}
            />
            <div className="flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 transition-all">
              {uploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Video size={14} />
              )}
              Vidéo
            </div>
          </label>
        </div>

        {/* Options vidéo */}
        <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
            Options vidéo
          </p>
          <Toggle
            label="Lecture automatique"
            checked={data?.hero_autoplay ?? true}
            onChange={(v) => set("hero_autoplay", v)}
          />
          <Toggle
            label="Silencieux"
            checked={data?.hero_muted ?? true}
            onChange={(v) => set("hero_muted", v)}
          />
          <Toggle
            label="Boucle"
            checked={data?.hero_loop ?? true}
            onChange={(v) => set("hero_loop", v)}
          />
        </div>
      </Card>
    </div>
  );
}

export default function PagesPage() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div>
      <PageHeader
        title="Pages & Héro"
        sub="Configurez le contenu et les médias de chaque page"
      />
      <Tabs tabs={PAGES} active={activeTab} onChange={setActiveTab} />
      <PageEditor key={activeTab} slug={activeTab} />
    </div>
  );
}
