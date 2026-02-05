// templates/template1/components/MenuList.tsx
import MenuCard from "./MenuCard";

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

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

type Props = {
  categories: MenuCategory[];
  currency: string;
  restaurantName: string;
  whatsapp: string;
  primaryColor?: string;
  secondaryColor?: string;
};

export default function MenuList({
  categories,
  currency,
  restaurantName,
  whatsapp,
  primaryColor = "#2f81d3",
  secondaryColor = "#FFC107",
}: Props) {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {categories.map((cat) => (
          <div key={cat.id} id={cat.id} className="mb-16 md:mb-20 scroll-mt-32">
            {/* Titre de catégorie */}
            <div className="text-center mb-10 md:mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {cat.name}
              </h3>
              {cat.description && (
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {cat.description}
                </p>
              )}
            </div>
            {/* Grille de plats - 3 colonnes max pour des cartes plus larges */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {cat.items.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  currency={currency}
                  restaurantName={restaurantName}
                  whatsapp={whatsapp}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
