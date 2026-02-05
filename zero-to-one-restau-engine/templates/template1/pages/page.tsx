// templates/template1/pages/page.tsx
import { loadRestaurantConfig } from "@/lib/configLoader";
import HeroSection from "../components/HeroSection";
import PromotionCard from "../components/common/PromotionCard";
import TestimonialCarousel from "../components/common/TestimonialCarousel";
import MenuCard from "../components/MenuCard";
import Link from "next/link";
import type { RestaurantConfig } from "@/lib/types";

interface HomePageProps {
  slug: string;
  config?: RestaurantConfig;
}

export default async function HomePageTemplate({
  slug,
  config: preloadedConfig,
}: HomePageProps) {
  const config = preloadedConfig ?? loadRestaurantConfig(slug);
  const colors = config.appearance.colors ?? {
    primary: "#3B82F6",
    secondary: "#ffffff",
  };

  // Sélection des teasers : premier plat de chaque catégorie
  const teaserItems = config.menu.categories
    .map((cat) => cat.items[0])
    .filter(Boolean)
    .slice(0, 6); // on prend jusqu'à 6 pour avoir assez, mais on limite l'affichage à 3 par ligne

  return (
    <>
      {/* Hero personnalisé */}
      <HeroSection
        identity={{
          name: config.identity.name,
          slogan: config.identity.slogan,
          logo: config.identity.logo,
          type: config.identity.type,
        }}
        contact={{ whatsapp: config.contact.whatsapp }}
        colors={colors}
        heroBackground={config.appearance.hero_background}
      />

      {/* Texte d'accueil depuis pages.home */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            {config.pages?.home?.title ||
              `Bienvenue chez ${config.identity.name}`}
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            {config.pages?.home?.text ||
              config.identity.slogan ||
              "Découvrez nos spécialités préparées avec passion et des ingrédients frais."}
          </p>
          {config.pages?.home?.subtitle && (
            <p className="text-lg text-gray-600 mt-4 italic">
              {config.pages.home.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Teaser plats : 3 par ligne + bouton "Voir plus" */}
      {teaserItems.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 text-center md:text-left">
                Nos plats à découvrir
              </h3>

              {/* Bouton "Voir plus" */}
              <Link
                href="/menu"
                className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-white border-2 border-gray-300 rounded-full text-gray-800 font-medium hover:bg-gray-100 hover:border-gray-400 transition-all"
              >
                Voir plus de plats
                <span className="ml-2">→</span>
              </Link>
            </div>

            {/* Grille : 1 colonne mobile, 2 tablette, 3 desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teaserItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  currency={config.menu.currency}
                  restaurantName={config.identity.name}
                  whatsapp={config.contact.whatsapp}
                  primaryColor={colors.primary}
                  secondaryColor={colors.secondary}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promotions */}
      {config.marketing?.promotions?.length ? (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Nos Offres du Moment
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {config.marketing.promotions.map((promo, index) => (
                <PromotionCard
                  key={index}
                  promo={promo}
                  primaryColor={colors.primary}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Témoignages en carrousel */}
      {config.marketing?.testimonials?.length ? (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Ce que disent nos clients
            </h3>
            <TestimonialCarousel
              testimonials={config.marketing.testimonials}
              primaryColor={colors.primary}
            />
          </div>
        </section>
      ) : null}

      {/* CTA final */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-center">
        <div className="container mx-auto px-6">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à passer commande ?
          </h3>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90">
            Nous préparons votre commande avec soin et vous la livrons
            rapidement.
          </p>
          <a
            href={`https://wa.me/${config.contact.whatsapp.replace(/[^0-9]/g, "")}?text=Bonjour%20!%20Je%20souhaite%20commander...`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-5 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-1"
            style={{ backgroundColor: colors.primary }}
          >
            Commander maintenant →
          </a>
        </div>
      </section>
    </>
  );
}
