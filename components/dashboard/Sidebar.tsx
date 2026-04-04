"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Image as ImageIcon,
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
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashSidebarProps {
  name?: string;
  logo?: string;
  color?: string;
  slug?: string;
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
  { href: "/dashboard/gallery", label: "Galerie", icon: ImageIcon },
  { href: "/dashboard/pages", label: "Pages & Hero", icon: FileImage },
  { href: "/dashboard/promotions", label: "Promotions", icon: Tag },
  { href: "/dashboard/faq", label: "FAQ", icon: HelpCircle },
  { href: "/dashboard/team", label: "Équipe", icon: Users },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
];

export default function DashSidebar({
  name = "Mon Restaurant",
  logo,
  color = "#16a34a",
  slug = "",
}: DashSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const hex2rgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[232px] bg-white border-r border-zinc-100/80 flex flex-col z-40 shadow-[1px_0_20px_rgba(0,0,0,0.04)]">
      {/* Brand Header */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-3">
          {logo ? (
            <img
              src={logo}
              alt={name}
              className="w-9 h-9 rounded-xl object-cover ring-1 ring-black/5"
            />
          ) : (
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm"
              style={{ backgroundColor: color }}
            >
              {name[0]?.toUpperCase() || "R"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="font-bold text-zinc-900 text-sm truncate">{name}</p>
            <p className="text-[11px] text-zinc-400">Administration</p>
          </div>
        </div>

        {/* Bouton Voir mon site */}
        {slug && (
          <Link
            href={`/dashboard/preview?slug=${slug}`}
            className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all group hover:shadow-sm"
            style={{
              borderColor: hex2rgba(color, 0.3),
              color: color,
              backgroundColor: hex2rgba(color, 0.06),
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

      <div className="h-px bg-zinc-100 mx-5" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 px-3 py-[13px] rounded-xl text-[13px] font-medium relative transition-all",
                active
                  ? "text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50",
              )}
              style={active ? { backgroundColor: color } : undefined}
            >
              <Icon
                size={16}
                className={
                  active
                    ? "text-white"
                    : "text-zinc-400 group-hover:text-zinc-600"
                }
              />
              <span className="relative z-10">{label}</span>

              {active && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-xl -z-10"
                  style={{ backgroundColor: color }}
                  transition={{ type: "spring", bounce: 0.25, duration: 0.45 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Intelligence Data */}
      <div className="mx-3 mb-3">
        <Link
          href="/dashboard/analytics"
          className="block p-4 rounded-2xl border text-xs transition-all hover:shadow-sm"
          style={{
            backgroundColor: hex2rgba(color, 0.04),
            borderColor: hex2rgba(color, 0.2),
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} style={{ color }} />
            <span className="font-semibold" style={{ color }}>
              Intelligence Data
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-snug">
            Heures de pic • Top plats • Taux de conversion
          </p>
        </Link>
      </div>

      <div className="h-px bg-zinc-100 mx-5" />

      {/* User Section */}
      <div className="p-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-zinc-50 transition-colors group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ backgroundColor: color }}
          >
            {user?.email?.[0]?.toUpperCase() || "?"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-800 truncate">
              {user?.email}
            </p>
            <p className="text-[10px] text-zinc-400 -mt-0.5">Administrateur</p>
          </div>

          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
            title="Se déconnecter"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
