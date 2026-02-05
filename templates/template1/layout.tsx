// templates/template1/layout.tsx
"use client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppCTA from "./components/WhatsAppCTA";
import type { RestaurantConfig } from "@/lib/types";

interface TemplateProps {
  config: RestaurantConfig;
  children: React.ReactNode;
}

export default function Template1Layout({ config, children }: TemplateProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        identity={config.identity}
        contact={config.contact}
        colors={
          config.appearance.colors ?? {
            primary: "#3B82F6",
            secondary: "#ffffff",
          }
        }
        slug={config.slug}
      />

      <main className="flex-1">{children}</main>

      <WhatsAppCTA contact={config.contact} />

      <Footer
        identity={config.identity}
        marketing={config.marketing ?? { newsletter: false, social_links: {} }}
      />
    </div>
  );
}
