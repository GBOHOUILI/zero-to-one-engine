"use client";

import { useEffect, useState } from "react";
import { restaurantApi, subscriptionApi } from "@/lib/api";
import { Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-zinc-100 rounded-2xl p-6">
      <div className="mb-5">
        <h2 className="font-semibold text-zinc-900">{title}</h2>
        {desc && <p className="text-zinc-500 text-sm mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 font-medium mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors";

const DAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

export default function SettingsPage() {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  // Form states
  const [identity, setIdentity] = useState({ name: "", slogan: "" });
  const [contact, setContact] = useState({
    whatsapp: "",
    phone: "",
    email: "",
    address: "",
  });
  const [socials, setSocials] = useState({
    facebook: "",
    instagram: "",
    tiktok: "",
  });
  const [design, setDesign] = useState({
    primary_color: "#22c55e",
    template: "default",
    dark_mode: false,
  });
  const [hours, setHours] = useState<any[]>([]);

  useEffect(() => {
    restaurantApi
      .getMyInfo()
      .then((r) => {
        setRestaurant(r);
        setIdentity({ name: r.name || "", slogan: r.slogan || "" });
        setContact({
          whatsapp: r.contacts?.whatsapp || "",
          phone: r.contacts?.phone || "",
          email: r.contacts?.email || "",
          address: r.contacts?.address || "",
        });
        setSocials({
          facebook: r.social_links?.facebook || "",
          instagram: r.social_links?.instagram || "",
          tiktok: r.social_links?.tiktok || "",
        });
        setDesign({
          primary_color: r.primary_color || "#22c55e",
          template: r.template || "default",
          dark_mode: r.dark_mode || false,
        });
        // Init horaires par défaut si vide
        const existingHours = r.opening_hours || [];
        const defaultHours = DAYS.map((_, i) => ({
          day_of_week: i,
          open_time: "08:00",
          close_time: "22:00",
          is_closed: false,
          ...existingHours.find((h: any) => h.day_of_week === i),
        }));
        setHours(defaultHours);
      })
      .catch(() => {});

    subscriptionApi
      .getMy()
      .then(setSubscription)
      .catch(() => {});
  }, []);

  async function save(section: string, fn: () => Promise<any>) {
    setSaving(section);
    try {
      await fn();
      setSaved(section);
      setTimeout(() => setSaved(null), 2500);
    } catch {}
    setSaving(null);
  }

  const SaveBtn = ({ section }: { section: string }) => (
    <button
      onClick={() => {
        if (section === "identity")
          save(section, () => restaurantApi.updateIdentity(identity));
        if (section === "contact")
          save(section, () => restaurantApi.updateContact(contact));
        if (section === "socials")
          save(section, () => restaurantApi.updateSocialLinks(socials));
        if (section === "design")
          save(section, () => restaurantApi.updateDesign(design));
        if (section === "hours")
          save(section, () => restaurantApi.updateOpeningHours(hours));
      }}
      disabled={saving === section}
      className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
    >
      {saving === section ? (
        <Loader2 size={14} className="animate-spin" />
      ) : saved === section ? (
        <CheckCircle2 size={14} className="text-emerald-400" />
      ) : (
        <Save size={14} />
      )}
      {saved === section ? "Sauvegardé !" : "Sauvegarder"}
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Paramètres</h1>
        <p className="text-zinc-500 text-sm mt-0.5">
          Configuration de votre restaurant
        </p>
      </div>

      {/* Abonnement */}
      {subscription && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-sm ${
            subscription.status === "ACTIVE"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {subscription.status === "ACTIVE" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>
            Abonnement {subscription.plan?.name} ·{" "}
            {subscription.status === "ACTIVE"
              ? "Actif jusqu'au "
              : "Expiré le "}
            {new Date(subscription.end_date).toLocaleDateString("fr-FR")}
          </span>
        </div>
      )}

      {/* Identité */}
      <Section title="Identité" desc="Nom et slogan affichés sur votre site">
        <div className="space-y-4">
          <Field label="Nom du restaurant">
            <input
              value={identity.name}
              onChange={(e) =>
                setIdentity({ ...identity, name: e.target.value })
              }
              className={inputCls}
              placeholder="Mon Restaurant"
            />
          </Field>
          <Field label="Slogan">
            <input
              value={identity.slogan}
              onChange={(e) =>
                setIdentity({ ...identity, slogan: e.target.value })
              }
              className={inputCls}
              placeholder="Saveurs authentiques, moments partagés"
            />
          </Field>
          <div className="flex justify-end">
            <SaveBtn section="identity" />
          </div>
        </div>
      </Section>

      {/* Design */}
      <Section
        title="Design & Apparence"
        desc="Personnalisez l'aspect visuel de votre site"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Couleur principale">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={design.primary_color}
                  onChange={(e) =>
                    setDesign({ ...design, primary_color: e.target.value })
                  }
                  className="h-10 w-16 border border-zinc-200 rounded-lg cursor-pointer"
                />
                <span className="text-sm text-zinc-600 font-mono">
                  {design.primary_color}
                </span>
              </div>
            </Field>
            <Field label="Template">
              <select
                value={design.template}
                onChange={(e) =>
                  setDesign({ ...design, template: e.target.value })
                }
                className={inputCls}
              >
                {[
                  "default",
                  "template1",
                  "template2",
                  "template3",
                  "template4",
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={design.dark_mode}
              onChange={(e) =>
                setDesign({ ...design, dark_mode: e.target.checked })
              }
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-zinc-700">Mode sombre</span>
          </label>
          <div className="flex justify-end">
            <SaveBtn section="design" />
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section
        title="Contact"
        desc="Informations affichées sur votre page contact"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="WhatsApp *">
              <input
                value={contact.whatsapp}
                onChange={(e) =>
                  setContact({ ...contact, whatsapp: e.target.value })
                }
                className={inputCls}
                placeholder="+229 61 00 00 01"
              />
            </Field>
            <Field label="Téléphone">
              <input
                value={contact.phone}
                onChange={(e) =>
                  setContact({ ...contact, phone: e.target.value })
                }
                className={inputCls}
                placeholder="+229 21 00 00 01"
              />
            </Field>
          </div>
          <Field label="Email">
            <input
              value={contact.email}
              onChange={(e) =>
                setContact({ ...contact, email: e.target.value })
              }
              className={inputCls}
              placeholder="contact@monresto.bj"
              type="email"
            />
          </Field>
          <Field label="Adresse">
            <input
              value={contact.address}
              onChange={(e) =>
                setContact({ ...contact, address: e.target.value })
              }
              className={inputCls}
              placeholder="Cadjehoun, Cotonou"
            />
          </Field>
          <div className="flex justify-end">
            <SaveBtn section="contact" />
          </div>
        </div>
      </Section>

      {/* Réseaux sociaux */}
      <Section title="Réseaux sociaux">
        <div className="space-y-4">
          {[
            {
              key: "facebook",
              label: "Facebook",
              placeholder: "https://facebook.com/monresto",
            },
            {
              key: "instagram",
              label: "Instagram",
              placeholder: "https://instagram.com/monresto",
            },
            {
              key: "tiktok",
              label: "TikTok",
              placeholder: "https://tiktok.com/@monresto",
            },
          ].map(({ key, label, placeholder }) => (
            <Field key={key} label={label}>
              <input
                value={(socials as any)[key]}
                onChange={(e) =>
                  setSocials({ ...socials, [key]: e.target.value })
                }
                className={inputCls}
                placeholder={placeholder}
              />
            </Field>
          ))}
          <div className="flex justify-end">
            <SaveBtn section="socials" />
          </div>
        </div>
      </Section>

      {/* Horaires */}
      <Section title="Horaires d'ouverture">
        <div className="space-y-2">
          {hours.map((h, i) => (
            <div key={h.day_of_week} className="flex items-center gap-4 py-2">
              <span className="w-24 text-sm text-zinc-700 font-medium">
                {DAYS[h.day_of_week]}
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={h.is_closed}
                  onChange={(e) => {
                    const next = [...hours];
                    next[i] = { ...h, is_closed: e.target.checked };
                    setHours(next);
                  }}
                  className="w-4 h-4"
                />
                <span className="text-xs text-zinc-500">Fermé</span>
              </label>
              {!h.is_closed && (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={h.open_time}
                    onChange={(e) => {
                      const next = [...hours];
                      next[i] = { ...h, open_time: e.target.value };
                      setHours(next);
                    }}
                    className="border border-zinc-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none"
                  />
                  <span className="text-zinc-400 text-sm">–</span>
                  <input
                    type="time"
                    value={h.close_time}
                    onChange={(e) => {
                      const next = [...hours];
                      next[i] = { ...h, close_time: e.target.value };
                      setHours(next);
                    }}
                    className="border border-zinc-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none"
                  />
                </div>
              )}
              {h.is_closed && (
                <span className="text-zinc-400 text-sm italic flex-1">
                  Fermé ce jour
                </span>
              )}
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <SaveBtn section="hours" />
          </div>
        </div>
      </Section>
    </div>
  );
}
