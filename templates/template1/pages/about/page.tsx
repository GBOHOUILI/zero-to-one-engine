// templates/template1/pages/about/page.tsx
import { loadRestaurantConfig } from "@/lib/configLoader";
import HeroMenu from "../../components/HeroMenu";
import type { RestaurantConfig } from "@/lib/types";

interface AboutPageProps {
  slug: string;
  config?: RestaurantConfig;
}

export default async function AboutPageTemplate({
  slug,
  config: preloadedConfig,
}: AboutPageProps) {
  const config = preloadedConfig ?? loadRestaurantConfig(slug);
  const primary = config.appearance?.colors?.primary ?? "#2f81d3";
  const about = config.pages?.about;

  return (
    <>
      <HeroMenu
        title={about?.title || `À propos de ${config.identity.name}`}
        subtitle={about?.subtitle || config.identity.slogan}
        background={config.appearance.hero_background}
        primaryColor={primary}
      />

      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed whitespace-pre-line text-center">
            {about?.text ||
              config.identity.description ||
              `${config.identity.name} vous accueille avec passion et vous propose une cuisine préparée avec des ingrédients soigneusement sélectionnés.`}
          </p>
        </div>
      </section>

      {/* Infos pratiques issues de business */}
      {config.business && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-8 max-w-5xl grid gap-10 md:grid-cols-3 text-center">
            {config.business.services?.length ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Nos services
                </h3>
                <ul className="text-gray-600 space-y-1">
                  {config.business.services.map((service) => (
                    <li key={service} className="capitalize">
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {config.business.capacity ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Capacité d&apos;accueil
                </h3>
                <p className="text-gray-600">
                  {config.business.capacity} places assises
                </p>
              </div>
            ) : null}

            {config.business.payment_methods?.length ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Moyens de paiement
                </h3>
                <ul className="text-gray-600 space-y-1">
                  {config.business.payment_methods.map((method) => (
                    <li key={method} className="capitalize">
                      {method}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      )}

      {/* Galerie d'images optionnelle depuis pages.about.images */}
      {about?.images?.length ? (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 lg:px-8 max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {about.images.map((src) => (
              <div
                key={src}
                className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md"
              >
                <img
                  src={src}
                  alt={config.identity.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section
        className="py-16 text-center text-white"
        style={{ backgroundColor: primary }}
      >
        <div className="container mx-auto px-6 max-w-3xl">
          <h3 className="text-3xl font-bold mb-4">
            Envie de découvrir notre carte ?
          </h3>
          <a
            href={`/${config.slug}/menu`}
            className="inline-block mt-4 px-10 py-4 bg-white rounded-full font-bold hover:shadow-xl transition-all"
            style={{ color: primary }}
          >
            Voir le menu →
          </a>
        </div>
      </section>
    </>
  );
}
