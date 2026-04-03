"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user?.role !== "SUPER_ADMIN") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-[#080f0b] flex">
      <SuperAdminSidebar />
      <main className="ml-60 flex-1 min-h-screen">
        <div className="max-w-7xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
