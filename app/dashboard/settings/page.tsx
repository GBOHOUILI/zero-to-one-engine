"use client";

import { useEffect, useState } from "react";
import { restaurantApi, subscriptionApi, businessInfoApi } from "@/lib/api";
import {
  PageHeader,
  Card,
  Input,
  Select,
  Toggle,
  Tabs,
  SaveBtn,
  toast,
  Sk,
  Badge,
} from "@/components/dashboard/ui";
import {
  Palette,
  Phone,
  Clock,
  Share2,
  CreditCard,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const DAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];
const TEMPLATES = [
  { value: "default", label: "Default" },
  { value: "classic", label: "Classic" },
  { value: "modern", label: "Modern" },
  { value: "minimalist", label: "Minimalist" },
  { value: "template1", label: "Template 1" },
  { value: "template2", label: "Template 2" },
  { value: "template3", label: "Template 3" },
  { value: "template4", label: "Template 4" },
];
const TABS = [
  { id: "design", label: "Design", icon: Palette },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "hours", label: "Horaires", icon: Clock },
  { id: "socials", label: "Réseaux", icon: Share2 },
  { id: "business", label: "Business", icon: CreditCard },
];

export default function SettingsPage() {
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("design");
  const [design, setDesign] = useState({
    primary_color: "#16a34a",
    secondary_color: "",
    font_family: "",
    template: "default",
    dark_mode: false,
  });
  const [contact, setContact] = useState({
    whatsapp: "",
    phone: "",
    email: "",
    address: "",
    google_maps_url: "",
  });
  const [socials, setSocials] = useState({
    facebook: "",
    instagram: "",
    tiktok: "",
  });
  const [hours, setHours] = useState<any[]>([]);
  const [biz, setBiz] = useState({
    delivery_fee: 0,
    capacity: 0,
    services: [] as string[],
    payment_methods: [] as string[],
  });

  const sd = (k: string, v: any) => {
    setDesign((p) => ({ ...p, [k]: v }));
    if (k === "primary_color")
      document.documentElement.style.setProperty("--brand", v);
  };

  useEffect(() => {
    Promise.allSettled([
      restaurantApi.getMyInfo().then((r) => {
        setDesign({
          primary_color: r.primary_color || "#16a34a",
          secondary_color: r.secondary_color || "",
          font_family: r.font_family || "",
          template: r.template || "default",
          dark_mode: !!r.dark_mode,
        });
        setContact({
          whatsapp: r.contacts?.whatsapp || "",
          phone: r.contacts?.phone || "",
          email: r.contacts?.email || "",
          address: r.contacts?.address || "",
          google_maps_url: r.contacts?.google_maps_url || "",
        });
        setSocials({
          facebook: r.social_links?.facebook || "",
          instagram: r.social_links?.instagram || "",
          tiktok: r.social_links?.tiktok || "",
        });
        const ex = r.opening_hours || [];
        setHours(
          DAYS.map((_, i) => ({
            day_of_week: i,
            open_time: "08:00",
            close_time: "22:00",
            is_closed: false,
            ...ex.find((h: any) => h.day_of_week === i),
          })),
        );
      }),
      subscriptionApi.getMy().then(setSub),
      businessInfoApi
        .get()
        .then((b) => {
          if (b)
            setBiz({
              delivery_fee: b.delivery_fee || 0,
              capacity: b.capacity || 0,
              services: b.services || [],
              payment_methods: b.payment_methods || [],
            });
        })
        .catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const inp =
    "w-full border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm outline-none bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:border-[var(--brand)]";

  if (loading)
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Sk key={i} className="h-32" />
        ))}
      </div>
    );

  return (
    <div>
      <PageHeader title="Paramètres" sub="Configuration de votre restaurant" />

      {sub && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-sm mb-5 ${sub.status === "ACTIVE" ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800/50 dark:text-emerald-400" : "bg-red-50 border-red-200 text-red-700"}`}
        >
          {sub.status === "ACTIVE" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>
            Plan <strong>{sub.plan?.name}</strong> ·{" "}
            {sub.status === "ACTIVE" ? `Actif jusqu'au` : "Expiré le"}{" "}
            {new Date(sub.end_date).toLocaleDateString("fr-FR")}
          </span>
        </div>
      )}

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "design" && (
        <Card className="p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1.5 block">
                Couleur principale
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={design.primary_color}
                  onChange={(e) => sd("primary_color", e.target.value)}
                  className="h-10 w-16 border border-zinc-200 dark:border-zinc-700 rounded-xl cursor-pointer"
                />
                <code className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
                  {design.primary_color}
                </code>
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1.5 block">
                Couleur secondaire
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={design.secondary_color || "#ffffff"}
                  onChange={(e) => sd("secondary_color", e.target.value)}
                  className="h-10 w-16 border border-zinc-200 dark:border-zinc-700 rounded-xl cursor-pointer"
                />
                <code className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
                  {design.secondary_color || "—"}
                </code>
              </div>
            </div>
          </div>
          <Select
            label="Template"
            value={design.template}
            onChange={(e) => sd("template", e.target.value)}
            options={TEMPLATES}
          />
          <div>
            <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1.5 block">
              Police
            </label>
            <input
              value={design.font_family}
              onChange={(e) => sd("font_family", e.target.value)}
              placeholder="Poppins, Inter…"
              className={inp}
            />
          </div>
          <Toggle
            label="Mode sombre pour le site public"
            checked={design.dark_mode}
            onChange={(v) => sd("dark_mode", v)}
          />
          <p className="text-xs text-zinc-400">
            Le dark mode du dashboard est indépendant — bouton dans la sidebar.
          </p>
          <SaveBtn
            onSave={async () => {
              await restaurantApi.updateDesign({
                primary_color: design.primary_color,
                secondary_color: design.secondary_color || undefined,
                font_family: design.font_family || undefined,
                template: design.template,
                dark_mode: design.dark_mode,
              });
              toast("Design sauvegardé");
            }}
          />
        </Card>
      )}

      {tab === "contact" && (
        <Card className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1.5 block">
                WhatsApp *
              </label>
              <input
                value={contact.whatsapp}
                onChange={(e) =>
                  setContact((p) => ({ ...p, whatsapp: e.target.value }))
                }
                placeholder="+229 61 00 00 01"
                className={inp}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1.5 block">
                Téléphone
              </label>
              <input
                value={contact.phone}
                onChange={(e) =>
                  setContact((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="+229 21 00 00 01"
                className={inp}
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) =>
                setContact((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="contact@monresto.bj"
              className={inp}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1.5 block">
              Adresse
            </label>
            <input
              value={contact.address}
              onChange={(e) =>
                setContact((p) => ({ ...p, address: e.target.value }))
              }
              placeholder="Cadjehoun, Cotonou"
              className={inp}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1.5 block">
              Google Maps URL
            </label>
            <input
              value={contact.google_maps_url}
              onChange={(e) =>
                setContact((p) => ({ ...p, google_maps_url: e.target.value }))
              }
              placeholder="https://maps.google.com/..."
              className={inp}
            />
          </div>
          <SaveBtn
            onSave={async () => {
              await restaurantApi.updateContact(contact);
              toast("Contact sauvegardé");
            }}
          />
        </Card>
      )}

      {tab === "hours" && (
        <Card className="p-6">
          <div className="space-y-3">
            {hours.map((h, i) => (
              <div
                key={h.day_of_week}
                className="flex items-center gap-4 py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
              >
                <span className="w-24 text-sm font-medium text-zinc-700 dark:text-zinc-300 flex-shrink-0">
                  {DAYS[h.day_of_week]}
                </span>
                <Toggle
                  checked={!h.is_closed}
                  onChange={(v) => {
                    const n = [...hours];
                    n[i] = { ...h, is_closed: !v };
                    setHours(n);
                  }}
                  label={h.is_closed ? "Fermé" : "Ouvert"}
                />
                {!h.is_closed && (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={h.open_time}
                      onChange={(e) => {
                        const n = [...hours];
                        n[i] = { ...h, open_time: e.target.value };
                        setHours(n);
                      }}
                      className="border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none"
                    />
                    <span className="text-zinc-400">–</span>
                    <input
                      type="time"
                      value={h.close_time}
                      onChange={(e) => {
                        const n = [...hours];
                        n[i] = { ...h, close_time: e.target.value };
                        setHours(n);
                      }}
                      className="border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <SaveBtn
              onSave={async () => {
                await restaurantApi.updateOpeningHours(hours);
                toast("Horaires sauvegardés");
              }}
            />
          </div>
        </Card>
      )}

      {tab === "socials" && (
        <Card className="p-6 space-y-4">
          {["facebook", "instagram", "tiktok"].map((k) => (
            <div key={k}>
              <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1.5 block">
                {k[0].toUpperCase() + k.slice(1)}
              </label>
              <input
                value={(socials as any)[k]}
                onChange={(e) =>
                  setSocials((p) => ({ ...p, [k]: e.target.value }))
                }
                placeholder={`https://${k}.com/monresto`}
                className={inp}
              />
            </div>
          ))}
          <SaveBtn
            onSave={async () => {
              await restaurantApi.updateSocialLinks(socials);
              toast("Réseaux sauvegardés");
            }}
          />
        </Card>
      )}

      {tab === "business" && (
        <Card className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1.5 block">
                Frais de livraison (FCFA)
              </label>
              <input
                type="number"
                value={biz.delivery_fee}
                onChange={(e) =>
                  setBiz((p) => ({
                    ...p,
                    delivery_fee: parseInt(e.target.value) || 0,
                  }))
                }
                className={inp}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1.5 block">
                Capacité (couverts)
              </label>
              <input
                type="number"
                value={biz.capacity}
                onChange={(e) =>
                  setBiz((p) => ({
                    ...p,
                    capacity: parseInt(e.target.value) || 0,
                  }))
                }
                className={inp}
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1.5 block">
              Services (virgule)
            </label>
            <input
              value={biz.services.join(", ")}
              onChange={(e) =>
                setBiz((p) => ({
                  ...p,
                  services: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="dine-in, takeaway, delivery"
              className={inp}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1.5 block">
              Paiements (virgule)
            </label>
            <input
              value={biz.payment_methods.join(", ")}
              onChange={(e) =>
                setBiz((p) => ({
                  ...p,
                  payment_methods: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="cash, mtn-money, wave"
              className={inp}
            />
          </div>
          <SaveBtn
            onSave={async () => {
              await businessInfoApi.update(biz);
              toast("Business sauvegardé");
            }}
          />
        </Card>
      )}
    </div>
  );
}
