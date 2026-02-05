export default function Footer({
  identity,
  marketing = {}, // fallback objet vide
}: {
  identity: { name: string; slogan?: string; logo?: string };
  marketing?: {
    newsletter?: boolean;
    socials?: { facebook?: string; instagram?: string };
  };
}) {
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

          {/* Colonne 2 : Navigation (exemple) */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <a href="#hero" className="hover:text-amber-400">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#story" className="hover:text-amber-400">
                  Histoire
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-400">
                  Menu
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-amber-400">
                  Galerie
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-amber-400">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-400">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Horaires */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Horaires</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Mardi - Samedi : 19h00 - 22h30</li>
              <li>Dimanche : Brunch 11h00 - 15h00</li>
              <li>Lundi : Fermé</li>
            </ul>
          </div>

          {/* Colonne 4 : Contact + Réseaux */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-300">42 Avenue des Champs-Élysées</p>
            <p className="text-gray-300">75008 Paris, France</p>
            <p className="mt-2">+33 1 23 45 67 89</p>
            <p>contact@lamaisondoree.fr</p>

            {marketing?.socials && (
              <div className="mt-6 flex gap-4">
                {marketing.socials.facebook && (
                  <a
                    href={marketing.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-2xl hover:text-amber-400">FB</span>
                  </a>
                )}
                {marketing.socials.instagram && (
                  <a
                    href={marketing.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-2xl hover:text-amber-400">IG</span>
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
