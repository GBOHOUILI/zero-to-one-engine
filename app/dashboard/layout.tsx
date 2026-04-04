"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { restaurantApi } from "@/lib/api";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if (!isAuthenticated) {
    //   router.push("/login");
    //   return;
    // }
    if (user?.role === "SUPER_ADMIN") {
      router.push("/super-admin");
      return;
    }

    restaurantApi
      .getMyInfo()
      .then(setRestaurant)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="animate-spin text-zinc-400" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      <DashboardSidebar
        restaurantName={restaurant?.name}
        restaurantLogo={restaurant?.logo_url}
        primaryColor={restaurant?.primary_color}
        slug={restaurant?.slug}
      />
      <main className="ml-60 flex-1 min-h-screen">
        <div className="max-w-7xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
