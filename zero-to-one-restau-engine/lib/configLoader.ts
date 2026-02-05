import fs from "fs";
import path from "path";
import { RestaurantConfig } from "./types";

export function loadRestaurantConfig(slug: string): RestaurantConfig {
  const filePath = path.join(
    process.cwd(),
    "data",
    "restaurants",
    `${slug}.json`,
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`Restaurant "${slug}" non trouvé`);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  let rawConfig: Partial<RestaurantConfig>; // <- ici on cast directement

  try {
    rawConfig = JSON.parse(fileContent) as Partial<RestaurantConfig>;
  } catch (err) {
    throw new Error(`JSON invalide pour "${slug}": ${(err as Error).message}`);
  }

  // Validation champs obligatoires (minimaliste mais stricte)
  if (!rawConfig.id) throw new Error("Champ obligatoire manquant : id");
  if (!rawConfig.slug) throw new Error("Champ obligatoire manquant : slug");
  if (!rawConfig.identity?.name)
    throw new Error("Nom du restaurant manquant (identity.name)");
  if (!rawConfig.contact?.whatsapp)
    throw new Error("WhatsApp manquant (contact.whatsapp)");
  if (!rawConfig.menu?.categories?.length)
    throw new Error("Menu invalide : aucune catégorie définie");
  if (!rawConfig.appearance?.template)
    throw new Error("Template manquant (appearance.template)");

  // Normalisation du menu
  rawConfig.menu!.categories.forEach((category, catIndex) => {
    if (!category.name) {
      throw new Error(`Catégorie sans nom (index ${catIndex})`);
    }
    if (!category.items?.length) {
      throw new Error(`La catégorie "${category.name}" ne contient aucun plat`);
    }
    category.items.forEach((item, itemIndex) => {
      if (!item.name) {
        throw new Error(
          `Plat sans nom dans "${category.name}" (index ${itemIndex})`,
        );
      }
      if (typeof item.price !== "number") {
        throw new Error(`Prix invalide pour le plat "${item.name}"`);
      }
      item.available = item.available ?? true;
    });
  });

  // Fallbacks et normalisation des sections optionnelles
  const config: RestaurantConfig = {
    id: rawConfig.id!,
    slug: rawConfig.slug!,
    domain: rawConfig.domain,
    identity: rawConfig.identity!,
    contact: rawConfig.contact!,
    menu: {
      currency: rawConfig.menu?.currency || "FCFA",
      categories: rawConfig.menu!.categories,
    },
    business: {
      id: rawConfig.business?.id || rawConfig.id!,
      opening_hours: rawConfig.business?.opening_hours || [],
      delivery_fee: rawConfig.business?.delivery_fee ?? 0,
      services: rawConfig.business?.services || ["sur place"],
      capacity: rawConfig.business?.capacity ?? 0,
      payment_methods: rawConfig.business?.payment_methods || ["cash"],
    },
    appearance: {
      template: rawConfig.appearance?.template ?? "template1",
      colors: {
        primary: rawConfig.appearance?.colors?.primary ?? "#3B82F6",
        secondary: rawConfig.appearance?.colors?.secondary ?? "#ffffff",
      },
      show_images: rawConfig.appearance?.show_images ?? true,
      typography: rawConfig.appearance?.typography ?? "system-ui, sans-serif",
      dark_mode: rawConfig.appearance?.dark_mode ?? false,
      hero_background: rawConfig.appearance?.hero_background ?? undefined,
      menu_hero_background:
        rawConfig.appearance?.menu_hero_background ?? undefined,
    },
    marketing: {
      newsletter: rawConfig.marketing?.newsletter ?? false,
      social_links: rawConfig.marketing?.social_links || {},
      testimonials: rawConfig.marketing?.testimonials || [],
      promotions: rawConfig.marketing?.promotions || [],
      seo_keywords: rawConfig.marketing?.seo_keywords || [],
    },
    analytics: {
      views: rawConfig.analytics?.views ?? 0,
      whatsapp_clicks: rawConfig.analytics?.whatsapp_clicks ?? 0,
      conversion_rate: rawConfig.analytics?.conversion_rate ?? 0,
      last_update: rawConfig.analytics?.last_update || new Date().toISOString(),
    },
    pages: rawConfig.pages || {},
  };

  // Vérification finale du template
  const templatePath = path.join(
    process.cwd(),
    "templates",
    config.appearance.template,
  );
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template "${config.appearance.template}" introuvable`);
  }

  // Log utile en dev
  if (process.env.NODE_ENV === "development") {
    if (!rawConfig.appearance?.colors) {
      console.warn(
        `[configLoader] ${slug} : appearance.colors manquant → fallbacks appliqués`,
      );
    }
  }

  return config;
}
