// templates/template1/pages/gallery/page.tsx
import { loadRestaurantConfig } from "@/lib/configLoader";
import HeroMenu from "../../components/HeroMenu";
import type { RestaurantConfig } from "@/lib/types";

interface GalleryPageProps {
  slug: string;
  config?: RestaurantConfig;
}

export default async function GalleryPageTemplate({
  slug,
  config: preloadedConfig,
}: GalleryPageProps) {
  const config = preloadedConfig ?? loadRestaurantConfig(slug);
  const primary = config.appearance?.colors?.primary ?? "#2f81d3";
  const gallery = config.pages?.gallery;

  // À défaut d'une galerie dédiée, on réutilise les photos des plats du menu
  const menuImages = config.menu.categories
    .flatMap((cat) => cat.items)
    .map((item) => item.image)
    .filter((src): src is string => Boolean(src));

  const images = gallery?.images?.length ? gallery.images : menuImages;

  return (
    <>
      <HeroMenu
        title={gallery?.title || "Notre Galerie"}
        subtitle={
          gallery?.subtitle || `Un aperçu en images de ${config.identity.name}`
        }
        background={config.appearance.hero_background}
        primaryColor={primary}
      />

      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          {images.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {images.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="break-inside-avoid rounded-2xl overflow-hidden shadow-md group"
                >
                  <img
                    src={src}
                    alt={`${config.identity.name} — photo ${index + 1}`}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg">
              La galerie sera bientôt disponible.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
