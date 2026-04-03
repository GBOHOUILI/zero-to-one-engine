"use client";

import { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  ExternalLink,
  X,
} from "lucide-react";

const SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

type Device = "desktop" | "tablet" | "mobile";

const DEVICE_CONFIG: Record<
  Device,
  { width: string; label: string; icon: any }
> = {
  desktop: { width: "100%", label: "Bureau", icon: Monitor },
  tablet: { width: "768px", label: "Tablette", icon: Tablet },
  mobile: { width: "390px", label: "Mobile", icon: Smartphone },
};

const PAGES = [
  { label: "Accueil", path: "" },
  { label: "Menu", path: "/menu" },
  { label: "Galerie", path: "/gallery" },
  { label: "À propos", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const [device, setDevice] = useState<Device>("desktop");
  const [activePage, setActivePage] = useState("");
  const [key, setKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const siteUrl = `${SITE_BASE}/${slug}${activePage}`;
  const config = DEVICE_CONFIG[device];

  function refresh() {
    setKey((k) => k + 1);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Prévisualisation</h1>
          <p className="text-zinc-500 text-sm">
            Voir votre site tel qu'il apparaît aux visiteurs
          </p>
        </div>
        <a
          href={siteUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
        >
          <ExternalLink size={14} />
          Ouvrir dans un onglet
        </a>
      </div>

      {/* Controls */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-center gap-4 flex-wrap">
        {/* Page tabs */}
        <div className="flex gap-1 flex-wrap">
          {PAGES.map((p) => (
            <button
              key={p.path}
              onClick={() => setActivePage(p.path)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activePage === p.path
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Device switcher */}
          <div className="flex items-center gap-1 bg-zinc-100 rounded-lg p-1">
            {(Object.entries(DEVICE_CONFIG) as [Device, any][]).map(
              ([d, cfg]) => (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  title={cfg.label}
                  className={`p-1.5 rounded-md transition-all ${
                    device === d
                      ? "bg-white shadow text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  <cfg.icon size={16} />
                </button>
              ),
            )}
          </div>

          <button
            onClick={refresh}
            className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
            title="Rafraîchir"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* URL bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-xl text-sm text-zinc-500 font-mono">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="ml-2 truncate">{siteUrl}</span>
      </div>

      {/* iframe container */}
      <div
        className="bg-zinc-200 rounded-2xl p-4 flex justify-center"
        style={{ minHeight: "70vh" }}
      >
        <div
          className="bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300"
          style={{ width: config.width, maxWidth: "100%" }}
        >
          {slug ? (
            <iframe
              ref={iframeRef}
              key={key}
              src={siteUrl}
              className="w-full"
              style={{ height: "70vh", border: "none" }}
              title="Prévisualisation du site"
            />
          ) : (
            <div className="flex items-center justify-center h-96 text-zinc-400 text-sm">
              Aucun restaurant configuré
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
