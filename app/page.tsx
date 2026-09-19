import type { Metadata } from "next";
import LandingClient from "./landing-client";

export const metadata: Metadata = {
  title:
    "Zero To One — Votre restaurant en ligne en 24h | SaaS Restauration Afrique",
  description:
    "Créez le site professionnel de votre restaurant en 24h. Menu interactif, commandes WhatsApp, analytics temps réel. La plateforme SaaS pensée pour les restaurateurs d'Afrique de l'Ouest.",
  keywords: [
    "restaurant en ligne Bénin",
    "site web restaurant Afrique",
    "menu digital restaurant",
    "SaaS restauration Cotonou",
    "commandes WhatsApp restaurant",
    "créer site restaurant",
    "logiciel gestion restaurant",
    "restaurant numérique Abidjan Dakar",
  ],
  authors: [{ name: "Zero To One", url: "https://zerotoone.app" }],
  creator: "Zero To One",
  publisher: "Zero To One",
  metadataBase: new URL("https://zerotoone.app"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Zero To One — Votre restaurant en ligne en 24h",
    description:
      "Menu interactif, commandes WhatsApp, analytics en temps réel. Rejoignez les restaurants qui ont transformé leur présence digitale.",
    url: "https://zerotoone.app",
    siteName: "Zero To One",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zero To One — Votre restaurant en ligne en 24h",
    description:
      "La plateforme SaaS qui donne à chaque restaurant une vitrine digitale professionnelle.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function Home() {
  return <LandingClient />;
}
