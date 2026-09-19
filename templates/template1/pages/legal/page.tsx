// templates/template1/pages/legal/page.tsx
import { loadRestaurantConfig } from "@/lib/configLoader";
import HeroMenu from "../../components/HeroMenu";
import type { RestaurantConfig } from "@/lib/types";

interface LegalPageProps {
  slug: string;
  config?: RestaurantConfig;
}

export default async function LegalPageTemplate({
  slug,
  config: preloadedConfig,
}: LegalPageProps) {
  const config = preloadedConfig ?? loadRestaurantConfig(slug);
  const primary = config.appearance?.colors?.primary ?? "#2f81d3";
  const { identity, contact } = config;

  return (
    <>
      <HeroMenu
        title="Mentions légales"
        subtitle={identity.name}
        background={config.appearance.hero_background}
        primaryColor={primary}
      />

      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl space-y-10 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Éditeur du site
            </h2>
            <p>
              Ce site est édité par <strong>{identity.name}</strong>
              {contact.address ? `, situé au ${contact.address}` : ""}.
            </p>
            {contact.email && (
              <p>
                Contact :{" "}
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:underline"
                  style={{ color: primary }}
                >
                  {contact.email}
                </a>
              </p>
            )}
            {contact.phone && <p>Téléphone : {contact.phone}</p>}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Hébergement
            </h2>
            <p>
              Ce site est propulsé par la plateforme Zero To One, dédiée à la
              présence digitale des restaurants et commerces au Bénin.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble des contenus présents sur ce site (textes, images,
              logo) est la propriété de {identity.name}, sauf mention contraire,
              et ne peut être reproduit sans autorisation préalable.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Données personnelles
            </h2>
            <p>
              Les informations transmises via WhatsApp ou nos formulaires de
              contact sont utilisées uniquement pour traiter vos demandes et
              commandes, et ne sont pas cédées à des tiers.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
