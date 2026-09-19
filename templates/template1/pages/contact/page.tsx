// templates/template1/pages/contact/page.tsx
import { loadRestaurantConfig } from "@/lib/configLoader";
import HeroMenu from "../../components/HeroMenu";
import type { RestaurantConfig } from "@/lib/types";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";

interface ContactPageProps {
  slug: string;
  config?: RestaurantConfig;
}

export default async function ContactPageTemplate({
  slug,
  config: preloadedConfig,
}: ContactPageProps) {
  const config = preloadedConfig ?? loadRestaurantConfig(slug);
  const primary = config.appearance?.colors?.primary ?? "#2f81d3";
  const { contact, business } = config;

  const whatsappHref = `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Bonjour ! Je vous contacte au sujet de ${config.identity.name}.`,
  )}`;

  return (
    <>
      <HeroMenu
        title="Contactez-nous"
        subtitle={`Nous sommes à votre écoute chez ${config.identity.name}`}
        background={config.appearance.hero_background}
        primaryColor={primary}
      />

      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl grid gap-10 md:grid-cols-2">
          {/* Coordonnées */}
          <div className="space-y-6">
            {contact.address && (
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-full shrink-0"
                  style={{ backgroundColor: `${primary}15` }}
                >
                  <MapPin size={24} style={{ color: primary }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Adresse</h3>
                  <p className="text-gray-600">{contact.address}</p>
                  {contact.google_maps && (
                    <a
                      href={contact.google_maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline"
                      style={{ color: primary }}
                    >
                      Voir sur Google Maps →
                    </a>
                  )}
                </div>
              </div>
            )}

            {contact.phone && (
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-full shrink-0"
                  style={{ backgroundColor: `${primary}15` }}
                >
                  <Phone size={24} style={{ color: primary }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Téléphone</h3>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="text-gray-600 hover:underline"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
            )}

            {contact.email && (
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-full shrink-0"
                  style={{ backgroundColor: `${primary}15` }}
                >
                  <Mail size={24} style={{ color: primary }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-gray-600 hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4">
              <div
                className="p-3 rounded-full shrink-0"
                style={{ backgroundColor: `${primary}15` }}
              >
                <MessageCircle size={24} style={{ color: primary }} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:underline"
                >
                  Nous écrire directement →
                </a>
              </div>
            </div>
          </div>

          {/* Horaires */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Clock size={24} style={{ color: primary }} />
              <h3 className="text-xl font-semibold text-gray-900">
                Horaires d&apos;ouverture
              </h3>
            </div>
            {business?.opening_hours?.length ? (
              <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 overflow-hidden">
                {business.opening_hours.map((h) => (
                  <li
                    key={h.day}
                    className="flex justify-between px-5 py-3 bg-white"
                  >
                    <span className="font-medium text-gray-800">{h.day}</span>
                    <span className="text-gray-600">
                      {h.open} - {h.close}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">
                Contactez-nous directement pour connaître nos horaires.
              </p>
            )}
          </div>
        </div>
      </section>

      <section
        className="py-16 text-center text-white"
        style={{ backgroundColor: primary }}
      >
        <div className="container mx-auto px-6 max-w-2xl">
          <h3 className="text-3xl font-bold mb-6">
            Une question, une réservation ?
          </h3>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-white rounded-full font-bold hover:shadow-xl transition-all"
            style={{ color: primary }}
          >
            Discuter sur WhatsApp →
          </a>
        </div>
      </section>
    </>
  );
}
