// templates/template1/pages/menu/page.tsx
import { loadRestaurantConfig } from "@/lib/configLoader";
import MenuNavigation from "../../components/MenuNavigation";
import MenuList from "../../components/MenuList";
import HeroMenu from "../../components/HeroMenu"; // nouveau
import type { RestaurantConfig } from "@/lib/types";

interface MenuPageProps {
  slug: string;
  config?: RestaurantConfig;
}

export default async function MenuPageTemplate({
  slug,
  config: preloadedConfig,
}: MenuPageProps) {
  const config = preloadedConfig ?? loadRestaurantConfig(slug);

  console.log("Menu hero background:", config.appearance.menu_hero_background);
  console.log("Fallback hero background:", config.appearance.hero_background);
  console.log(
    "Background choisi:",
    config.appearance.menu_hero_background || config.appearance.hero_background,
  );
  console.log("Apparence complète:", config.appearance);

  const primary = config.appearance?.colors?.primary ?? "#2f81d3";
  const secondary = config.appearance?.colors?.secondary ?? "#FFC107";

  // Background : menu_hero_background > hero_background > undefined (fallback dans HeroMenu)
  const menuBg =
    config.appearance.menu_hero_background || config.appearance.hero_background;

  return (
    <>
      {/* Hero menu simple */}
      <HeroMenu
        title="Notre Carte"
        subtitle={
          config.identity.slogan ||
          "Saveurs authentiques préparées avec passion"
        }
        background={menuBg}
        primaryColor={primary}
      />

      {/* Contenu menu */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <MenuNavigation
            categories={config.menu.categories.map((cat) => ({
              id: cat.id,
              name: cat.name,
            }))}
            primary={primary}
            secondary={secondary}
          />

          <MenuList
            categories={config.menu.categories}
            currency={config.menu.currency}
            restaurantName={config.identity.name}
            whatsapp={config.contact.whatsapp}
            primaryColor={primary}
            secondaryColor={secondary}
          />
        </div>
      </section>
    </>
  );
}
