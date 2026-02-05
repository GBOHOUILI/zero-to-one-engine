"use client";
import { useState, useEffect, useRef } from "react";

interface MenuNavigationProps {
  categories: { id: string; name: string }[];
  primary?: string; // couleur principale du resto
  secondary?: string; // couleur secondaire (texte actif)
}

export default function MenuNavigation({
  categories,
  primary = "#2f81d3", // fallback bleu si pas fourni
  secondary = "#ffffff", // fallback blanc
}: MenuNavigationProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "");
  const navRef = useRef<HTMLDivElement>(null);

  // Détection de la catégorie visible au scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180; // offset header + marge
      let found = false;

      for (const category of categories) {
        const element = document.getElementById(category.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveCategory(category.id);
            found = true;
            break;
          }
        }
      }

      // Si rien trouvé (scroll en haut), activer la première
      if (!found && categories.length > 0) {
        setActiveCategory(categories[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // check initial

    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  // Scroll smooth vers la catégorie
  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      const yOffset = -120; // espace pour header sticky + marge esthétique
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm"
      aria-label="Navigation des catégories du menu"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center gap-3 py-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;

            return (
              <li key={cat.id} className="snap-start">
                <button
                  onClick={() => scrollToCategory(cat.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    px-6 py-2.5 rounded-full font-medium text-sm whitespace-nowrap
                    transition-all duration-300 ease-out
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${primary}]/50
                    ${
                      isActive
                        ? `bg-[${primary}] text-[${secondary}] shadow-lg scale-105`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                    }
                  `}
                  style={{
                    backgroundColor: isActive ? primary : undefined,
                    color: isActive ? secondary : undefined,
                  }}
                >
                  {cat.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
