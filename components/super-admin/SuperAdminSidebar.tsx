"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import {
  LayoutDashboard,
  Store,
  CreditCard,
  BarChart2,
  Brain,
  HardDrive,
  LifeBuoy,
  AlertTriangle,
  LogOut,
  Shield,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/super-admin", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/super-admin/restaurants", label: "Restaurants", icon: Store },
  {
    href: "/super-admin/subscriptions",
    label: "Abonnements",
    icon: CreditCard,
  },
  { href: "/super-admin/analytics", label: "Analytics", icon: BarChart2 },
  {
    href: "/super-admin/intelligence",
    label: "Intelligence Data",
    icon: Brain,
  },
  { href: "/super-admin/support", label: "Support", icon: LifeBuoy },
  { href: "/super-admin/reports", label: "Signalements", icon: AlertTriangle },
  { href: "/super-admin/backup", label: "Backup", icon: HardDrive },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/super-admin" ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-[#0d1a12] flex flex-col z-40 border-r border-emerald-900/30">
      {/* Brand */}
      <div className="p-5 border-b border-emerald-900/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
            <Shield size={18} className="text-black" />
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-tight">
              Zero To One
            </p>
            <p className="text-emerald-700 text-xs font-mono">Super Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-4 pb-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-l-2",
                active
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500"
                  : "text-emerald-900 hover:text-emerald-300 hover:bg-emerald-500/5 border-transparent",
              )}
            >
              <Icon
                size={16}
                className={active ? "text-emerald-400" : "text-emerald-800"}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-emerald-900/30">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black text-xs font-black flex-shrink-0">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-emerald-300 text-xs font-medium truncate">
              {user?.email}
            </p>
            <p className="text-emerald-800 text-xs">Administrateur</p>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="text-emerald-900 hover:text-red-400 transition-colors"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
