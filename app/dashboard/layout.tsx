"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { restaurantApi } from "@/lib/api";
import type { Restaurant } from "@/lib/api-types";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { ToastProvider } from "@/components/dashboard/ui";
import { Loader2 } from "lucide-react";

const DARK_KEY = "dash-dark";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [dashDark, setDashDark] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user?.role === "SUPER_ADMIN") {
      router.push("/super-admin");
      return;
    }

    restaurantApi
      .getMyInfo()
      .then((r) => {
        setRestaurant(r);
        if (r?.primary_color)
          document.documentElement.style.setProperty(
            "--brand",
            r.primary_color,
          );
        const stored = localStorage.getItem(DARK_KEY);
        const dark = stored !== null ? stored === "1" : !!r?.dark_mode;
        setDashDark(dark);
        document.documentElement.classList.toggle("dark", dark);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, user, router]);

  function toggleDark() {
    const next = !dashDark;
    setDashDark(next);
    localStorage.setItem(DARK_KEY, next ? "1" : "0");
    document.documentElement.classList.toggle("dark", next);
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="animate-spin text-zinc-400" size={28} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-zinc-950 flex transition-colors">
      <DashboardSidebar
        restaurantName={restaurant?.name}
        restaurantLogo={restaurant?.logo_url}
        primaryColor={restaurant?.primary_color}
        slug={restaurant?.slug}
        darkMode={dashDark}
        onToggleDark={toggleDark}
      />
      <main className="ml-[232px] flex-1 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-8">{children}</div>
      </main>
      <ToastProvider />
    </div>
  );
}
