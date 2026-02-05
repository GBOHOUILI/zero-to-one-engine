// templates/template1/components/MenuCard.tsx
"use client";
import { useState } from "react";
import { Plus, Minus, Clock, Flame } from "lucide-react";
import Link from "next/link";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  shortDescription?: string;
  fullDescription?: string;
  image?: string;
  images?: string[];
  available?: boolean;
  ingredients?: string[];
  allergens?: string[];
  accompaniments?: string[];
  preparationTime?: string | number;
  servingSize?: string;
  calories?: number;
  categoryType?: string;
  tags?: string[];
  nutritionalInfo?: {
    proteins?: number;
    carbs?: number;
    fats?: number;
  };
}

type Props = {
  item: MenuItem;
  currency: string;
  restaurantName: string;
  whatsapp: string;
  primaryColor?: string;
  secondaryColor?: string;
};

export default function MenuCard({
  item,
  currency,
  restaurantName,
  whatsapp,
  primaryColor = "#2f81d3",
  secondaryColor = "#FFC107",
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const isAvailable = item.available ?? true;

  const whatsappMessage = encodeURIComponent(
    `Bonjour ! Je souhaite commander ${quantity} × ${item.name} (${(item.price * quantity).toFixed(2)} ${currency}) chez ${restaurantName}`,
  );

  const detailUrl = `/menu/${item.id}`;

  return (
    <div
      className={`
        group relative bg-white rounded-2xl overflow-hidden
        transition-all duration-500 ease-out
        ${!isAvailable ? "opacity-75" : ""}
      `}
      style={{
        boxShadow: isHovered
          ? `0 20px 60px -15px ${primaryColor}40, 0 10px 30px -10px ${primaryColor}30`
          : "0 4px 20px rgba(0, 0, 0, 0.08)",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Effet de brillance au survol */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 0%, ${primaryColor}08 50%, transparent 100%)`,
        }}
      />

      {/* Bordure gradient au survol */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}30, ${secondaryColor}30)`,
          padding: "2px",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Image principale avec overlay gradient */}
      {item.image && (
        <div className="relative h-72 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />

          {/* Gradient overlay pour meilleure lisibilité */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(to bottom, transparent 0%, ${primaryColor}15 100%)`,
            }}
          />

          {/* Badge indisponible */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider shadow-2xl animate-pulse">
                Indisponible
              </span>
            </div>
          )}

          {/* Tags avec effet glassmorphism */}
          {isAvailable && item.tags && item.tags.length > 0 && (
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {item.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg border border-white/30 transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: `${primaryColor}dd`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Info rapide en bas de l'image */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
            <div className="flex items-center gap-4 text-white text-xs">
              {item.preparationTime && (
                <div className="flex items-center gap-1.5 backdrop-blur-sm bg-white/20 px-3 py-1.5 rounded-full">
                  <Clock size={14} />
                  <span className="font-medium">{item.preparationTime}</span>
                </div>
              )}
              {item.calories && (
                <div className="flex items-center gap-1.5 backdrop-blur-sm bg-white/20 px-3 py-1.5 rounded-full">
                  <Flame size={14} />
                  <span className="font-medium">{item.calories} cal</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contenu */}
      <div className="p-8 relative">
        {/* Titre avec effet gradient au survol */}
        <h4 className="text-2xl font-bold mb-4" style={{ color: "#1f2937" }}>
          {item.name}
        </h4>

        {item.shortDescription && (
          <p className="text-gray-600 mb-6 line-clamp-2 text-base leading-relaxed">
            {item.shortDescription}
          </p>
        )}

        {/* Prix */}
        <div className="flex items-center justify-between mb-7">
          <div className="relative">
            <span
              className="text-4xl font-black tracking-tight relative z-10"
              style={{ color: primaryColor }}
            >
              {item.price.toFixed(2)} {currency}
            </span>
          </div>

          {isAvailable && (
            <div
              className="flex items-center gap-3 rounded-full px-5 py-3 shadow-inner transition-all duration-300"
              style={{
                backgroundColor: isHovered ? `${primaryColor}10` : "#f3f4f6",
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="transition-all duration-300 disabled:opacity-40 hover:scale-110 active:scale-95"
                style={{ color: quantity > 1 ? primaryColor : "#9ca3af" }}
                aria-label="Diminuer quantité"
                disabled={quantity <= 1}
              >
                <Minus size={22} strokeWidth={2.5} />
              </button>
              <span
                className="font-bold w-10 text-center text-xl"
                style={{ color: primaryColor }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="transition-all duration-300 hover:scale-110 active:scale-95"
                style={{ color: primaryColor }}
                aria-label="Augmenter quantité"
              >
                <Plus size={22} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        {/* Total avec animation */}
        {isAvailable && quantity > 1 && (
          <div
            className="mb-6 text-center p-4 rounded-xl transition-all duration-300"
            style={{
              backgroundColor: `${secondaryColor}15`,
              border: `2px solid ${secondaryColor}40`,
            }}
          >
            <span className="text-base text-gray-700 font-medium">
              Total :{" "}
              <strong className="text-xl" style={{ color: secondaryColor }}>
                {(item.price * quantity).toFixed(2)} {currency}
              </strong>
            </span>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-4">
          <Link
            href={detailUrl}
            className="
              flex-1 py-4 px-6 rounded-xl font-semibold text-center text-base
              transition-all duration-300
              border-2 border-gray-900 text-gray-900
              hover:bg-gray-900 hover:text-white
              active:scale-95
              relative overflow-hidden group/btn
            "
          >
            <span className="relative z-10">Voir détails</span>
            {/* Effet de remplissage au survol */}
            <div className="absolute inset-0 bg-gray-500 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out" />
          </Link>

          {isAvailable ? (
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex-1 py-4 px-6 text-white rounded-xl font-bold text-base
                text-center transition-all duration-300
                hover:shadow-xl active:scale-95
                relative overflow-hidden group/order
              "
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
              }}
            >
              <span className="relative z-10">Commander</span>
              {/* Effet de brillance animé */}
              <div
                className="absolute inset-0 opacity-0 group-hover/order:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, transparent, ${secondaryColor}40, transparent)`,
                }}
              />
            </a>
          ) : (
            <button
              disabled
              className="
                flex-1 py-4 px-6 bg-gray-200 text-gray-400 rounded-xl font-semibold text-base
                text-center cursor-not-allowed border-2 border-gray-300
              "
            >
              Indisponible
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
