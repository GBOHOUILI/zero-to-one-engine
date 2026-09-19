"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Image as Img,
  ShoppingBag,
  BarChart3,
  Settings,
  HelpCircle,
  Tag,
  Users,
  Eye,
  FileImage,
  LogOut,
  ChevronRight,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";

function h2r(hex: string, a: number) {
  if (!hex || hex.length < 7) return `rgba(22,163,74,${a})`;
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

const NAV = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/dashboard/menus", label: "Menu & Plats", icon: UtensilsCrossed },
  { href: "/dashboard/orders", label: "Commandes", icon: ShoppingBag },
  { href: "/dashboard/gallery", label: "Galerie", icon: Img },
  { href: "/dashboard/pages", label: "Pages & Hero", icon: FileImage },
  { href: "/dashboard/promotions", label: "Promotions", icon: Tag },
  { href: "/dashboard/faq", label: "FAQ", icon: HelpCircle },
  { href: "/dashboard/team", label: "Équipe", icon: Users },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
];

export interface DashSidebarProps {
  restaurantName?: string;
  restaurantLogo?: string;
  primaryColor?: string;
  slug?: string;
  darkMode?: boolean;
  onToggleDark?: () => void;
}

export default function DashboardSidebar({
  restaurantName: name = "Mon Restaurant",
  restaurantLogo: logo,
  primaryColor: c = "#16a34a",
  slug = "",
  darkMode = false,
  onToggleDark,
}: DashSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);
  const bg = darkMode ? "#18181b" : "#fff";
  const border = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const muted = darkMode ? "#71717a" : "#a1a1aa";
  const fg = darkMode ? "#f4f4f5" : "#18181b";
  const navInactive = darkMode ? "#a1a1aa" : "#52525b";

  return (
    <aside
      className="fixed left-0 top-0 h-full w-[232px] flex flex-col z-40 transition-colors duration-300"
      style={{
        backgroundColor: bg,
        borderRight: `1px solid ${border}`,
        boxShadow: darkMode ? "none" : "1px 0 20px rgba(0,0,0,0.04)",
      }}
    >
      {/* Brand */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-3">
          {logo ? (
            <img
              src={logo}
              alt={name}
              className="w-9 h-9 rounded-xl object-cover ring-1 ring-black/5 flex-shrink-0"
            />
          ) : (
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
              style={{ backgroundColor: c }}
            >
              {name[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-sm truncate" style={{ color: fg }}>
              {name}
            </p>
            <p className="text-[11px]" style={{ color: muted }}>
              Administration
            </p>
          </div>
        </div>
        {slug && (
          <Link
            href={`/dashboard/preview?slug=${slug}`}
            className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all group"
            style={{
              borderColor: h2r(c, 0.3),
              color: c,
              backgroundColor: h2r(c, 0.06),
            }}
          >
            <Eye size={13} />
            <span className="flex-1">Voir mon site</span>
            <ChevronRight
              size={12}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        )}
      </div>

      <div className="h-px mx-5" style={{ backgroundColor: border }} />

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 px-3 py-[11px] rounded-xl text-[13px] font-medium relative transition-all"
              style={{
                backgroundColor: active ? c : "transparent",
                color: active ? "#fff" : navInactive,
              }}
              onMouseEnter={(e) => {
                if (!active)
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!active)
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "transparent";
              }}
            >
              <Icon
                size={15}
                style={{
                  color: active ? "#fff" : darkMode ? "#71717a" : "#a1a1aa",
                }}
              />
              <span>{label}</span>
              {active && (
                <motion.div
                  layoutId="dash-nav"
                  className="absolute inset-0 rounded-xl -z-10"
                  style={{ backgroundColor: c }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Intelligence promo */}
      <div className="mx-3 mb-3">
        <Link
          href="/dashboard/analytics"
          className="block p-3.5 rounded-2xl border text-xs transition-all hover:shadow-sm"
          style={{ backgroundColor: h2r(c, 0.05), borderColor: h2r(c, 0.2) }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={13} style={{ color: c }} />
            <span className="font-semibold" style={{ color: c }}>
              Intelligence Data
            </span>
          </div>
          <p className="text-[11px] leading-snug" style={{ color: muted }}>
            Heures de pic • Top plats • Conversion
          </p>
        </Link>
      </div>

      <div className="h-px mx-5" style={{ backgroundColor: border }} />

      {/* Dark toggle */}
      {onToggleDark && (
        <div className="px-4 pt-2 pb-1">
          <button
            onClick={onToggleDark}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={{ color: muted }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = darkMode
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                "transparent";
            }}
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            {darkMode ? "Mode clair" : "Mode sombre"}
            <div
              className="ml-auto w-8 h-4 rounded-full relative transition-colors"
              style={{ backgroundColor: darkMode ? c : "#e4e4e7" }}
            >
              <div
                className={cn(
                  "absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform",
                  darkMode ? "translate-x-4" : "translate-x-0.5",
                )}
              />
            </div>
          </button>
        </div>
      )}

      {/* User */}
      <div className="p-3">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl group cursor-default">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ backgroundColor: c }}
          >
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate" style={{ color: fg }}>
              {user?.email}
            </p>
            <p className="text-[10px]" style={{ color: muted }}>
              Resto Admin
            </p>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            title="Déconnexion"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
