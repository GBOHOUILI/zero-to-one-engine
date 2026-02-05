"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  identity: { name: string; logo?: string };
  contact: { whatsapp: string };
  colors?: {
    primary?: string;
    secondary?: string;
  };
  slug: string; // Obligatoire pour préfixer les liens
}

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/story", label: "Notre Histoire" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Galerie" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Header({
  identity,
  contact,
  colors = {},
  slug,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fallbacks couleurs – jamais de crash
  const primary = colors.primary ?? "#3B82F6";
  const secondary = colors.secondary ?? "#ffffff";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // check initial
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fonction pour préfixer les liens internes avec le slug
  const getLink = (path: string) => {
    if (path.startsWith("#")) return path; // ancres restent inchangées
    return `/${slug}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500 ease-in-out
        ${
          isScrolled
            ? "backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-xl"
            : "bg-transparent border-b border-transparent"
        }
      `}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo → Accueil du resto */}
          <a href={`/${slug}`} className="flex items-center gap-3 z-20">
            {identity.logo && (
              <img
                src={identity.logo}
                alt={identity.name}
                className="h-9 sm:h-11 w-auto object-contain drop-shadow-md"
              />
            )}
            <span
              className={`
                text-xl sm:text-2xl font-bold tracking-tight
                transition-colors duration-300
                ${isScrolled ? `text-[${secondary}]` : "text-white drop-shadow-lg"}
              `}
            >
              {identity.name}
            </span>
          </a>

          {/* Navigation Desktop */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={getLink(link.href)}
                  className={`
                    text-sm xl:text-base font-medium
                    transition-all duration-300 hover:scale-105
                    ${
                      isScrolled
                        ? `text-[${secondary}] hover:text-white`
                        : "text-white hover:text-[#ffffff] drop-shadow-md"
                    }
                  `}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA Desktop */}
          <a
            href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}?text=Bonjour%2C%20je%20souhaite%20réserver%20une%20table%20chez%20${encodeURIComponent(identity.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              hidden lg:inline-flex items-center px-6 py-2.5 rounded-full text-sm font-semibold
              transition-all duration-300 hover:scale-105 active:scale-95 shadow-md
              ${
                isScrolled
                  ? `bg-[${secondary}] text-[${primary}] hover:brightness-110 hover:shadow-lg`
                  : "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
              }
            `}
          >
            Réserver
          </a>

          {/* Burger Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`
              lg:hidden z-20 p-2 rounded-full transition-all duration-300
              ${isScrolled ? "hover:bg-white/10" : "hover:bg-white/20"}
            `}
            aria-label="Ouvrir ou fermer le menu"
          >
            {isMenuOpen ? (
              <X
                size={28}
                className={isScrolled ? `text-[${secondary}]` : "text-white"}
              />
            ) : (
              <Menu
                size={28}
                className={isScrolled ? `text-[${secondary}]` : "text-white"}
              />
            )}
          </button>
        </nav>

        {/* Menu Mobile – panneau glass */}
        {isMenuOpen && (
          <div
            className={`
              lg:hidden absolute top-full left-0 right-0
              backdrop-blur-xl bg-white/10 border-t border-white/20 shadow-2xl
              py-8 px-6 transition-all duration-400
            `}
          >
            <ul className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={getLink(link.href)}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      block py-3 text-lg font-medium
                      transition-colors hover:text-[${secondary}]
                      text-[${secondary}]
                    `}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {/* CTA dans menu mobile */}
              <li className="pt-4">
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}?text=Bonjour%2C%20je%20souhaite%20réserver%20une%20table%20chez%20${encodeURIComponent(identity.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    block text-center py-4 rounded-xl font-semibold
                    bg-[${secondary}] text-[${primary}]
                    hover:brightness-110 transition-all shadow-md
                  `}
                >
                  Réserver une table
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
