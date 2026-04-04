"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import Clock from "@/components/super-admin/Clock";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // if (!isAuthenticated) {
    //   router.push("/login");
    //   return;
    // }

    if (user?.role !== "SUPER_ADMIN") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-[#080f0b]">
      <div className="flex">
        {/* Sidebar fixe */}
        <SuperAdminSidebar />

        {/* Contenu */}
        <main className="ml-60 flex-1 min-h-screen">
          <div className="p-8 max-w-7xl mx-auto">{children}</div>
        </main>
        <div className="flex justify-end mb-6">
          <Clock />
        </div>
      </div>
    </div>
  );
}
