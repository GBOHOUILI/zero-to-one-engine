"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { access_token, refresh_token, user } = await authApi.login(
        email,
        password,
      );

      setAuth(user, access_token, refresh_token);

      // Redirection selon le rôle
      router.push(user.role === "SUPER_ADMIN" ? "/super-admin" : "/dashboard");
    } catch (err: any) {
      setError(err.message || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050a06] flex overflow-hidden">
      {/* Gauche — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16">
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Green glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500 opacity-[0.06] rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-black font-black text-lg">Z</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Zero To One
            </span>
          </div>
        </div>
        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-xs font-medium tracking-wider uppercase">
                Plateforme SaaS · Bénin
              </span>
            </div>
            <h1 className="text-5xl font-black text-white leading-[1.05] tracking-tight">
              La restauration
              <br />
              <span className="sa-gradient">digitale africaine.</span>
            </h1>
            <p className="text-zinc-500 text-lg mt-5 max-w-sm leading-relaxed">
              Gérez votre menu, vos commandes et votre présence en ligne depuis
              un seul tableau de bord.
            </p>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { n: "1 150+", l: "restaurants" },
              { n: "98%", l: "satisfaction" },
              { n: "12k+", l: "commandes/mois" },
            ].map(({ n, l }) => (
              <div
                key={l}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4"
              >
                <p className="text-white font-black text-2xl">{n}</p>
                <p className="text-zinc-600 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-zinc-700 text-xs">
            © {new Date().getFullYear()} Zero To One — Cotonou, Bénin
          </p>
        </div>
      </div>

      {/* Droite — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 bg-[#070d09]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-black font-black">Z</span>
            </div>
            <span className="text-white font-bold text-lg">Zero To One</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black text-white">Connexion</h2>
            <p className="text-zinc-600 text-sm mt-1">
              Accédez à votre espace administration
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@restaurant.bj"
                className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-emerald-500/60 text-white placeholder-zinc-700 rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-emerald-500/60 text-white placeholder-zinc-700 rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a
                href="/forgot-password"
                className="text-emerald-500 hover:text-emerald-400 text-xs transition-colors"
              >
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full mt-2 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50 text-black font-bold rounded-xl py-3.5 text-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
