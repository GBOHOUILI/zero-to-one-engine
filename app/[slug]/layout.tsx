// app/[slug]/layout.tsx
import { loadRestaurantConfig } from "@/lib/configLoader";
import type { RestaurantConfig } from "@/lib/types";
import Template1Layout from "@/templates/template1/layout";
import Link from "next/link";
import type { Metadata } from "next"; // ← Ajoute cette ligne

export default async function RestaurantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let config: RestaurantConfig;
  try {
    config = loadRestaurantConfig(slug);
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Restaurant non trouvé
          </h1>
          <p className="text-gray-600 mb-6">
            Le restaurant &quot;{slug}&quot; n&apos;existe pas ou la
            configuration est invalide.
          </p>
          <p className="text-gray-600 mb-6">
            {error instanceof Error ? error.message : String(error)}
          </p>
          <Link href="/" className="text-blue-600 hover:underline">
            Retour à l`&apos`accueil
          </Link>
        </div>
      </div>
    );
  }

  const templateLayouts: Record<
    string,
    React.ComponentType<{ config: RestaurantConfig; children: React.ReactNode }>
  > = {
    template1: Template1Layout,
  };

  const SelectedLayout =
    templateLayouts[config.appearance.template] || Template1Layout;

  return <SelectedLayout config={config}>{children}</SelectedLayout>;
}

// Typage correct + async
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // ← Ajoute : Promise<Metadata>
  const { slug } = await params;

  try {
    const config = loadRestaurantConfig(slug);
    return {
      title: config.identity.name || "Restaurant Non Trouvé",
      description:
        config.identity.slogan || "Découvrez notre carte et passez commande",
      // Tu peux ajouter beaucoup plus ici plus tard
      // openGraph: { ... },
      // twitter: { ... },
      // alternates: { canonical: `https://${config.domain || slug + '.localhost'}` },
    };
  } catch {
    return {
      title: "Restaurant Non Trouvé",
      description: "Ce restaurant n'existe pas.",
    };
  }
}
