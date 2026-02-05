// templates/template1/components/common/PromotionCard.tsx
import { RestaurantConfig } from "@/lib/types";
import Image from "next/image";

interface PromotionCardProps {
  promo: NonNullable<RestaurantConfig["marketing"]>["promotions"][number];
  primaryColor: string;
}

export default function PromotionCard({
  promo,
  primaryColor,
}: PromotionCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
      {/* Image si disponible, sinon placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        {/* Si tu ajoutes un champ image aux promotions dans la config plus tard */}
        {/* <Image src={promo.image || "/placeholder-promo.jpg"} alt={promo.title} fill className="object-cover" /> */}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h4
          className="text-xl font-bold mb-3 line-clamp-2"
          style={{ color: primaryColor }}
        >
          {promo.title}
        </h4>

        <p className="text-gray-700 mb-4 flex-grow line-clamp-4">
          {promo.description}
        </p>

        {/* CTA simple */}
        <a
          href={`https://wa.me/${promo.whatsapp || "numéro par défaut"}?text=Je%20suis%20intéressé%20par%20${encodeURIComponent(promo.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-block px-6 py-3 text-white font-medium rounded-lg text-center transition-colors hover:opacity-90"
          style={{ backgroundColor: primaryColor }}
        >
          Profiter de l'offre →
        </a>
      </div>
    </div>
  );
}
