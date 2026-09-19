// templates/template1/pages/menu/[id]/page.tsx
import { loadRestaurantConfig } from "@/lib/configLoader";
import type { RestaurantConfig } from "@/lib/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, Flame } from "lucide-react";

interface MenuDetailPageProps {
  slug: string;
  itemId: string;
  config?: RestaurantConfig;
}

export default async function MenuDetailPageTemplate({
  slug,
  itemId,
  config: preloadedConfig,
}: MenuDetailPageProps) {
  const config = preloadedConfig ?? loadRestaurantConfig(slug);
  const primary = config.appearance?.colors?.primary ?? "#2f81d3";
  const currency = config.menu.currency;

  const item = config.menu.categories
    .flatMap((cat) => cat.items)
    .find((i) => i.id === itemId);

  if (!item) {
    notFound();
  }

  const isAvailable = item.available ?? true;
  const whatsappMessage = encodeURIComponent(
    `Bonjour ! Je souhaite commander ${item.name} (${item.price.toFixed(2)} ${currency}) chez ${config.identity.name}`,
  );
  const whatsappHref = `https://wa.me/${config.contact.whatsapp.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`;

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link
          href={`/${slug}/menu`}
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-8 font-medium"
        >
          <ChevronLeft size={18} />
          Retour au menu
        </Link>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover aspect-square"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
                Pas de photo disponible
              </div>
            )}
          </div>

          {/* Détails */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {item.name}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              {item.preparationTime && (
                <span className="flex items-center gap-1.5">
                  <Clock size={16} /> {item.preparationTime}
                </span>
              )}
              {item.calories && (
                <span className="flex items-center gap-1.5">
                  <Flame size={16} /> {item.calories} cal
                </span>
              )}
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {item.fullDescription ||
                item.shortDescription ||
                "Un plat préparé avec soin à partir d'ingrédients frais."}
            </p>

            <div
              className="text-4xl font-black mb-8"
              style={{ color: primary }}
            >
              {item.price.toFixed(2)} {currency}
            </div>

            {item.ingredients?.length ? (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Ingrédients
                </h3>
                <p className="text-gray-600">{item.ingredients.join(", ")}</p>
              </div>
            ) : null}

            {item.accompaniments?.length ? (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Accompagnements
                </h3>
                <p className="text-gray-600">
                  {item.accompaniments.join(", ")}
                </p>
              </div>
            ) : null}

            {item.allergens?.length ? (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Allergènes</h3>
                <p className="text-gray-600">{item.allergens.join(", ")}</p>
              </div>
            ) : null}

            {item.nutritionalInfo && (
              <div className="mb-8 grid grid-cols-3 gap-4 text-center">
                {item.nutritionalInfo.proteins !== undefined && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xl font-bold text-gray-900">
                      {item.nutritionalInfo.proteins}g
                    </div>
                    <div className="text-xs text-gray-500">Protéines</div>
                  </div>
                )}
                {item.nutritionalInfo.carbs !== undefined && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xl font-bold text-gray-900">
                      {item.nutritionalInfo.carbs}g
                    </div>
                    <div className="text-xs text-gray-500">Glucides</div>
                  </div>
                )}
                {item.nutritionalInfo.fats !== undefined && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xl font-bold text-gray-900">
                      {item.nutritionalInfo.fats}g
                    </div>
                    <div className="text-xs text-gray-500">Lipides</div>
                  </div>
                )}
              </div>
            )}

            {isAvailable ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full md:w-auto text-center px-10 py-4 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: primary }}
              >
                Commander sur WhatsApp →
              </a>
            ) : (
              <button
                disabled
                className="w-full md:w-auto px-10 py-4 bg-gray-200 text-gray-400 rounded-xl font-bold text-lg cursor-not-allowed"
              >
                Indisponible actuellement
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
