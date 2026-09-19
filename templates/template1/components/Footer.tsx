import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";

interface FooterProps {
  identity: {
    name: string;
    slogan?: string;
    logo?: string;
    title?: string;
    description?: string;
  };
  contact: {
    whatsapp: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  business?: {
    opening_hours?: { day: string; open: string; close: string }[];
  };
  marketing?: {
    newsletter?: boolean;
    social_links?: {
      facebook?: string;
      instagram?: string;
      tiktok?: string;
    };
  };
  slug: string;
}

export default function Footer({
  identity,
  contact,
  business = {},
  marketing = {},
  slug,
}: FooterProps) {
  const nav = (path: string) => `/${slug}${path}`;
  const social = marketing.social_links ?? {};
  const hasSocial = social.facebook || social.instagram || social.tiktok;

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Colonne 1 : Identité */}
          <div>
            <h3 className="text-2xl font-bold mb-4">{identity.name}</h3>
            {identity.slogan && (
              <p className="text-gray-400">{identity.slogan}</p>
            )}
            {identity.logo && (
              <img
                src={identity.logo}
                alt={identity.name}
                className="h-12 mt-4"
              />
            )}
          </div>

          {/* Colonne 2 : Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href={nav("")} className="hover:text-amber-400">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href={nav("/about")} className="hover:text-amber-400">
                  À propos
                </Link>
              </li>
              <li>
                <Link href={nav("/menu")} className="hover:text-amber-400">
                  Menu
                </Link>
              </li>
              <li>
                <Link href={nav("/gallery")} className="hover:text-amber-400">
                  Galerie
                </Link>
              </li>
              <li>
                <Link href={nav("/contact")} className="hover:text-amber-400">
                  Contact
                </Link>
              </li>
              <li>
                <Link href={nav("/legal")} className="hover:text-amber-400">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Horaires */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Horaires</h4>
            {business.opening_hours?.length ? (
              <ul className="space-y-2 text-gray-300">
                {business.opening_hours.map((h) => (
                  <li key={h.day}>
                    {h.day} : {h.open} - {h.close}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">Horaires communiqués sur demande</p>
            )}
          </div>

          {/* Colonne 4 : Contact + Réseaux */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              {contact.address && (
                <li className="flex items-start gap-2">
                  <MapPin size={18} className="mt-0.5 shrink-0" />
                  <span>{contact.address}</span>
                </li>
              )}
              {contact.phone && (
                <li className="flex items-center gap-2">
                  <Phone size={18} className="shrink-0" />
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="hover:text-amber-400"
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.email && (
                <li className="flex items-center gap-2">
                  <Mail size={18} className="shrink-0" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-amber-400"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
            </ul>

            {hasSocial && (
              <div className="mt-6 flex gap-4">
                {social.facebook && (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="hover:text-amber-400"
                  >
                    <Facebook size={22} />
                  </a>
                )}
                {social.instagram && (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="hover:text-amber-400"
                  >
                    <Instagram size={22} />
                  </a>
                )}
                {social.tiktok && (
                  <a
                    href={social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="hover:text-amber-400 text-sm font-bold"
                  >
                    TikTok
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} {identity.name}. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
