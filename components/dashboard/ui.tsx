"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, Check, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

//  Helpers brand

export function getBrand(): string {
  if (typeof window === "undefined") return "#16a34a";
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue("--brand")
      .trim() || "#16a34a"
  );
}

export function hex2rgba(hex: string, a: number): string {
  if (!hex || hex.length < 7) return `rgba(22,163,74,${a})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// DarkModeContext
// Géré via classe 'dark' sur <html> + localStorage('dash-dark')

export function getDashDark(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("dash-dark") === "1";
}

export function setDashDark(v: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem("dash-dark", v ? "1" : "0");
  document.documentElement.classList.toggle("dark", v);
}

// Card

export function Card({
  children,
  className = "",
  onClick,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const dark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");
  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        "rounded-2xl border transition-all duration-200",
        dark
          ? "bg-zinc-900 border-zinc-800 text-zinc-100"
          : "bg-white border-zinc-100 text-zinc-900",
        onClick && "cursor-pointer hover:shadow-md hover:-translate-y-0.5",
        className,
      )}
    >
      {children}
    </div>
  );
}

// PageHeader

export function PageHeader({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-[22px] font-black tracking-tight text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
        {sub && <p className="text-zinc-400 text-sm mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// Btn

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Btn({
  variant = "primary",
  size = "md",
  loading,
  icon,
  children,
  className = "",
  ...props
}: BtnProps) {
  const brand = getBrand();
  const base =
    "inline-flex items-center gap-2 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  const sz = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm";
  const variants: Record<string, string> = {
    primary: "text-white",
    secondary:
      "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700",
    ghost:
      "bg-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
  };
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(base, sz, variants[variant], className)}
      style={
        variant === "primary"
          ? { backgroundColor: brand, ...props.style }
          : props.style
      }
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
      {children}
    </button>
  );
}

// Input

export function Input({
  label,
  error,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        {...props}
        className={cn(
          "w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors",
          "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100",
          "border-zinc-200 dark:border-zinc-700",
          "focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20",
          error && "border-red-400",
          className,
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// Textarea

export function Textarea({
  label,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={cn(
          "w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors resize-none",
          "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100",
          "border-zinc-200 dark:border-zinc-700",
          "focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20",
          className,
        )}
      />
    </div>
  );
}

// Select

export function Select({
  label,
  options,
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        {...props}
        className={cn(
          "w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors",
          "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100",
          "border-zinc-200 dark:border-zinc-700",
          "focus:border-[var(--brand)]",
          className,
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Toggle

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  const brand = getBrand();
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className="w-11 h-6 rounded-full transition-colors"
          style={{ backgroundColor: checked ? brand : "#e4e4e7" }}
        />
        <div
          className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
            checked && "translate-x-5",
          )}
        />
      </div>
      {label && (
        <span className="text-sm text-zinc-700 dark:text-zinc-300">
          {label}
        </span>
      )}
    </label>
  );
}

// Badge

export function Badge({
  children,
  color = "zinc",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  const colors: Record<string, string> = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    red: "bg-red-50 text-red-700 border-red-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    zinc: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border",
        colors[color] || colors.zinc,
      )}
    >
      {children}
    </span>
  );
}

// Modal

export function Modal({
  open,
  onClose,
  title,
  children,
  width = "max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 w-full",
          width,
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <p className="font-bold text-zinc-900 dark:text-zinc-100">
              {title}
            </p>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// Toast

let toastFn: ((msg: string, type?: "ok" | "err") => void) | null = null;

export function ToastProvider() {
  const [toasts, setToasts] = useState<
    { id: number; msg: string; type: "ok" | "err" }[]
  >([]);

  useEffect(() => {
    toastFn = (msg, type = "ok") => {
      const id = Date.now();
      setToasts((p) => [...p, { id, msg, type }]);
      setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
    };
    return () => {
      toastFn = null;
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border animate-fade-up pointer-events-auto",
            t.type === "ok"
              ? "bg-white border-emerald-100 text-emerald-700"
              : "bg-white border-red-100 text-red-600",
          )}
        >
          {t.type === "ok" ? <Check size={14} /> : <X size={14} />}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

export function toast(msg: string, type: "ok" | "err" = "ok") {
  toastFn?.(msg, type);
}

// EmptyState

export function EmptyState({
  icon: Icon,
  title,
  sub,
  action,
}: {
  icon: any;
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
        <Icon size={22} className="text-zinc-300 dark:text-zinc-600" />
      </div>
      <p className="font-semibold text-zinc-600 dark:text-zinc-300">{title}</p>
      {sub && <p className="text-zinc-400 text-sm mt-1">{sub}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// Skeleton

export function Sk({ className = "" }: { className?: string }) {
  return (
    <div className={cn("shimmer rounded-xl dark:bg-zinc-800", className)} />
  );
}

// SaveBtn (avec état)

export function SaveBtn({
  onSave,
  label = "Sauvegarder",
}: {
  onSave: () => Promise<void>;
  label?: string;
}) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  async function handle() {
    setState("loading");
    try {
      await onSave();
      setState("done");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("idle");
    }
  }
  return (
    <Btn
      onClick={handle}
      loading={state === "loading"}
      icon={state === "done" ? <Check size={14} /> : undefined}
    >
      {state === "done" ? "Sauvegardé !" : label}
    </Btn>
  );
}

// Tabs

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; icon?: any }[];
  active: string;
  onChange: (id: string) => void;
}) {
  const brand = getBrand();
  return (
    <div className="flex gap-1 border-b border-zinc-100 dark:border-zinc-800 mb-6">
      {tabs.map((t) => {
        const isActive = t.id === active;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all",
              isActive
                ? "border-b-2"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200",
            )}
            style={isActive ? { borderBottomColor: brand, color: brand } : {}}
          >
            {Icon && <Icon size={14} />}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// FileUpload

export function FileUpload({
  accept = "image/*",
  onFile,
  label = "Choisir un fichier",
  preview,
}: {
  accept?: string;
  onFile: (f: File) => void;
  label?: string;
  preview?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 transition-all w-full justify-center"
      >
        {label}
      </button>
      {preview && (
        <div className="relative rounded-xl overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-800">
          <img
            src={preview}
            alt="preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
