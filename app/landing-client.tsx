"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Check,
  X,
  Menu as MenuIcon,
  Phone,
  Mail,
  TrendingUp,
  BarChart2,
  ShoppingBag,
  Star,
  Globe,
  ImageIcon,
  Brain,
  Shield,
  Clock,
  Zap,
  Gift,
  Users,
  Award,
} from "lucide-react";

/* ─── Données statiques ──────────────────────────────────── */
const NAV_LINKS = [
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#comment-ca-marche", label: "Comment ça marche" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "#temoignages", label: "Témoignages" },
];

const STATS = [
  { value: "24h", label: "Pour être en ligne et vendre" },
  { value: "0%", label: "Commission sur vos commandes" },
  { value: "4", label: "Templates premium inclus" },
  { value: "3", label: "Mois offerts au lancement" },
];

const FEATURES = [
  {
    icon: ShoppingBag,
    title: "Commandes WhatsApp sans commission",
    desc: "Vos clients composent leur panier, vous recevez la commande directement sur WhatsApp. Aucun intermédiaire, 100% de la vente vous revient.",
    tag: "Zéro commission",
    color: "#16a34a",
  },
  {
    icon: BarChart2,
    title: "Analytics & Intelligence Data",
    desc: "Identifiez vos heures de pointe, vos plats stars, votre taux de conversion. Prenez des décisions qui augmentent votre CA.",
    tag: "Données temps réel",
    color: "#2563eb",
  },
  {
    icon: ImageIcon,
    title: "4 templates personnalisables",
    desc: "Gastronomique, fast-food, café ou bar. Couleurs, polices, médias hero — tout s'adapte à votre identité en quelques clics.",
    tag: "Sans coder",
    color: "#7c3aed",
  },
  {
    icon: Globe,
    title: "Domaine personnalisé inclus",
    desc: "Connectez votre-restaurant.com ou utilisez votre sous-domaine gratuit. SSL automatique, redirections gérées.",
    tag: "Plan Pro",
    color: "#d97706",
  },
  {
    icon: Brain,
    title: "Intelligence prédictive",
    desc: "Scorez votre profil, détectez les points d'amélioration, comparez-vous aux meilleurs restaurants de la plateforme.",
    tag: "IA incluse",
    color: "#db2777",
  },
  {
    icon: Shield,
    title: "Backup & sécurité automatiques",
    desc: "Vos données sauvegardées chaque nuit. Architecture multi-tenant sécurisée. Votre restaurant protégé 24/7.",
    tag: "Plan Pro",
    color: "#0d9488",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Créez votre compte en 2 min",
    desc: "Email, nom du restaurant, type de cuisine. L'activation se fait après le règlement des frais de mise en ligne (40 000 FCFA une seule fois).",
    icon: "🏗️",
  },
  {
    num: "02",
    title: "Choisissez et personnalisez",
    desc: "Sélectionnez votre template, uploadez votre menu, ajoutez vos photos. Tout depuis un dashboard pensé pour les non-développeurs.",
    icon: "🎨",
  },
  {
    num: "03",
    title: "Publiez et commencez à vendre",
    desc: "Votre site est en ligne sous 24h. Partagez le lien sur WhatsApp et Instagram. Les commandes arrivent directement sur votre téléphone.",
    icon: "🚀",
  },
  {
    num: "04",
    title: "Analysez et multipliez vos revenus",
    desc: "Suivez vos vues, clics WhatsApp, plats stars. Identifiez ce qui rapporte et doublez la mise.",
    icon: "📈",
  },
];

/* ── TARIFS ── */
const SETUP_PRICE = "40 000";
const DOMAIN_OPTION = "12 500";
const LAUNCH_MONTHS_FREE = 3;

const PLANS = [
  {
    name: "Starter",
    price: "5 000",
    period: "/ mois",
    desc: "Site en ligne, menu visible. Idéal pour démarrer.",
    features: [
      { ok: true, text: "1 template au choix" },
      { ok: true, text: "Menu jusqu'à 20 plats" },
      { ok: true, text: "Galerie 10 photos" },
      { ok: true, text: "Site visible publiquement" },
      { ok: false, text: "Commandes WhatsApp" },
      { ok: false, text: "Analytics avancés" },
      { ok: false, text: "Domaine personnalisé" },
    ],
    cta: "Choisir Starter",
    featured: false,
    note: null,
  },
  {
    name: "Pro",
    price: "15 000",
    period: "/ mois",
    desc: "Tout inclus pour analyser, vendre et maximiser vos revenus.",
    features: [
      { ok: true, text: "Tous les templates" },
      { ok: true, text: "Menu & galerie illimités" },
      { ok: true, text: "Commandes WhatsApp actives" },
      { ok: true, text: "Analytics complets" },
      { ok: true, text: "Intelligence Data & rapports" },
      { ok: true, text: "Promotions & témoignages" },
      { ok: true, text: "Domaine personnalisé (+12 500 F)" },
    ],
    cta: "Choisir Pro",
    featured: true,
    badge: "Le plus rentable",
    note: "3 premiers mois offerts au lancement 🎁",
  },
];

const TESTIMONIALS = [
  {
    stars: 5,
    text: "En 24h, mon menu était en ligne. Je reçois des commandes directement sur WhatsApp même quand je suis en cuisine. C'est 20% de CA en plus sans rien changer à mon fonctionnement.",
    name: "Aminata Mbaye",
    role: "Chez Aminata, Dakar",
    initials: "AM",
    bg: "#166534",
  },
  {
    stars: 5,
    text: "Les analytics m'ont montré que mes meilleures ventes sont entre 12h et 13h30. J'ai réorganisé ma brigade. En un mois j'avais récupéré 3x le prix de l'abonnement.",
    name: "Koffi Tano",
    role: "Le Fumoir Moderne, Abidjan",
    initials: "KT",
    bg: "#1e3a5f",
  },
  {
    stars: 5,
    text: "Je cherchais quelque chose de professionnel sans payer une agence web. Zero To One c'est exactement ça — beau, rapide, pensé pour l'Afrique. Et le support répond vraiment.",
    name: "Rose Chabi",
    role: "Café des Artistes, Cotonou",
    initials: "RC",
    bg: "#064e3b",
  },
];

const FAQS = [
  {
    q: "Quels sont les frais pour démarrer ?",
    a: `La mise en ligne de votre restaurant nécessite un règlement unique de ${SETUP_PRICE} FCFA (frais de création et configuration). Si vous souhaitez connecter votre propre nom de domaine (.bj, .com...), une option à ${DOMAIN_OPTION} FCFA est disponible. Aucun compte n'est activé sans ce règlement — cela nous permet de garantir un onboarding personnalisé pour chaque restaurant.`,
  },
  {
    q: "Pourquoi y a-t-il des frais de mise en ligne ?",
    a: "Ces frais couvrent la configuration initiale de votre espace (template, slug, domaine technique, SSL), l'accompagnement à la prise en main et la garantie de qualité de votre présence en ligne. Contrairement aux plateformes génériques, chaque restaurant est traité comme un vrai projet.",
  },
  {
    q: "Qu'est-ce qui se passe si j'arrête de payer l'abonnement ?",
    a: "Votre site passe automatiquement en mode Starter : toujours visible, mais les commandes WhatsApp et les analytics sont suspendus. Pas de suppression — votre contenu est préservé. Vous reprenez là où vous en étiez dès la prochaine recharge.",
  },
  {
    q: "Comment fonctionnent les commandes WhatsApp ?",
    a: "Vos clients sélectionnent leurs plats, composent leur panier et valident. La commande arrive directement sur votre WhatsApp Business sous forme de message structuré. Zéro commission, zéro intermédiaire — 100% des revenus vous reviennent. Disponible à partir du plan Pro.",
  },
  {
    q: "En combien de temps mon site est-il en ligne ?",
    a: "En moins de 24h après réception du paiement de mise en ligne. Notre équipe configure votre espace et vous livre les accès directement. Certains restaurateurs sont opérationnels le jour même.",
  },
  {
    q: "Puis-je changer de template après la création ?",
    a: "Oui, à tout moment depuis votre dashboard. Votre contenu (menus, photos, textes) migre automatiquement vers le nouveau template. Le changement est instantané.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Orange Money, Wave, MTN Mobile Money, carte bancaire (Visa/Mastercard). Pour l'abonnement mensuel, le paiement est sans engagement avec annulation possible à tout moment.",
  },
  {
    q: "Comment prendre rendez-vous pour une démo ?",
    a: "Envoyez un email à zerotooneresto@gmail.com ou appelez le +229 01 43 39 76 75. Notre équipe vous rappelle sous 24h pour une démonstration personnalisée.",
  },
];

/* ── Comparaison ZTO vs Agence ── */
const COMPARISON_ROWS = [
  {
    label: "Mise en ligne",
    agence: "500k – 2M FCFA",
    zto: "40 000 FCFA",
    highlight: true,
  },
  {
    label: "Délai",
    agence: "3 à 8 semaines",
    zto: "Moins de 24h",
    highlight: false,
  },
  {
    label: "Abonnement mensuel",
    agence: "Maintenance 30–80k/mois",
    zto: "Dès 5 000 FCFA/mois",
    highlight: true,
  },
  {
    label: "Mises à jour menu",
    agence: "Facturation supplémentaire",
    zto: "En autonomie, illimité",
    highlight: false,
  },
  {
    label: "Analytics",
    agence: "Non inclus",
    zto: "Intégrés nativement",
    highlight: true,
  },
  {
    label: "Commandes WhatsApp",
    agence: "Développement custom requis",
    zto: "Natif, 0% commission",
    highlight: false,
  },
];

/* ─── Composants ─────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left text-slate-800 font-medium text-sm hover:text-emerald-700 transition-colors"
      >
        <span>{q}</span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-64 pb-5" : "max-h-0"}`}
      >
        <p className="text-slate-500 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

/* ── Calculateur ROI interactif ── */
function RoiCalculator() {
  const ORDER_OPTIONS = [10, 20, 50, 100];
  const BASKET_OPTIONS = [
    { label: "3 000 F", value: 3000 },
    { label: "5 000 F", value: 5000 },
    { label: "8 000 F", value: 8000 },
  ];

  const [orders, setOrders] = useState(50);
  const [basket, setBasket] = useState(3000);

  const weeklyRevenue = orders * basket;
  const monthlyRevenue = weeklyRevenue * 4;
  const formattedMonthly =
    monthlyRevenue >= 1000000
      ? `${(monthlyRevenue / 1000000).toFixed(1)}M`
      : `${(monthlyRevenue / 1000).toFixed(0)}k`;
  const roi = Math.round(monthlyRevenue / 15000);

  return (
    <div className="zto-card-dark p-8 zto-reveal zto-delay-2">
      <p className="text-emerald-600 text-xs font-mono uppercase tracking-wider mb-5">
        Calculateur de revenus
      </p>
      <div className="space-y-5">
        <div>
          <p className="text-emerald-700 text-xs mb-2">
            Commandes WhatsApp / semaine (estimé)
          </p>
          <div className="grid grid-cols-4 gap-2">
            {ORDER_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setOrders(n)}
                className={`py-2 text-sm font-bold rounded-xl border transition-all ${
                  orders === n
                    ? "bg-emerald-600 border-emerald-500 text-white"
                    : "zto-btn-ghost-dark"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-emerald-700 text-xs mb-2">Panier moyen estimé</p>
          <div className="grid grid-cols-3 gap-2">
            {BASKET_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setBasket(opt.value)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  basket === opt.value
                    ? "bg-emerald-600 border-emerald-500 text-white"
                    : "zto-btn-ghost-dark"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 text-center mt-4">
          <p className="text-emerald-600 text-xs mb-2">
            Revenus supplémentaires / mois
          </p>
          <p className="text-white font-black text-4xl">
            {formattedMonthly}
            <span className="text-emerald-500 text-lg"> FCFA</span>
          </p>
          <p className="text-emerald-700 text-xs mt-2">
            Pour {orders} commandes/sem · panier {(basket / 1000).toFixed(0)}k F
          </p>
          {roi > 0 && (
            <div className="mt-3 bg-emerald-600/20 rounded-lg px-3 py-1.5 inline-block">
              <p className="text-emerald-400 text-xs font-bold">
                ROI × {roi} — abonnement Pro rentabilisé en{" "}
                {roi > 4 ? "quelques jours" : "1 semaine"}
              </p>
            </div>
          )}
        </div>
      </div>
      <Link
        href="/login"
        className="zto-btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 mt-6"
      >
        Commencer à générer des revenus <ArrowRight size={14} />
      </Link>
    </div>
  );
}

/* ─── Landing principale ─────────────────────────────────── */
export default function LandingClient() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("zto-visible"),
        ),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".zto-reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document
      .getElementById(id.replace("#", ""))
      ?.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
  };

  return (
    <div className="bg-[#f8faf8] text-slate-800 min-h-screen">
      <style>{`
        .zto-reveal { opacity: 0; transform: translateY(20px); transition: opacity .55s ease, transform .55s ease; }
        .zto-visible { opacity: 1; transform: none; }
        .zto-delay-1 { transition-delay: .1s; }
        .zto-delay-2 { transition-delay: .2s; }
        .zto-delay-3 { transition-delay: .3s; }
        .zto-delay-4 { transition-delay: .4s; }
        .zto-grid-bg { background-image: linear-gradient(rgba(22,163,74,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,.05) 1px, transparent 1px); background-size: 40px 40px; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .zto-float { animation: float 6s ease-in-out infinite; }
        @keyframes zto-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .zto-blink { animation: zto-pulse 2s infinite; }
        .sa-gradient { background: linear-gradient(135deg,#16a34a 0%,#15803d 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .zto-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; }
        .zto-card:hover { border-color: #bbf7d0; box-shadow: 0 4px 20px rgba(22,163,74,.08); }
        .zto-card-dark { background: #0f1f14; border: 1px solid rgba(34,197,94,.15); border-radius: 16px; }
        .zto-card-dark:hover { border-color: rgba(34,197,94,.3); }
        .zto-btn-primary { background: #16a34a; color: #fff; font-weight: 700; border-radius: 10px; transition: background .2s, transform .15s; }
        .zto-btn-primary:hover { background: #15803d; transform: translateY(-1px); }
        .zto-btn-ghost { border: 1px solid #d1fae5; color: #15803d; border-radius: 10px; background: #f0fdf4; transition: all .2s; }
        .zto-btn-ghost:hover { border-color: #86efac; background: #dcfce7; color: #166534; }
        .zto-btn-ghost-dark { border: 1px solid rgba(34,197,94,.25); color: #86efac; border-radius: 10px; transition: all .2s; }
        .zto-btn-ghost-dark:hover { border-color: rgba(34,197,94,.5); background: rgba(34,197,94,.06); color: #4ade80; }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes countdown-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.7;transform:scale(1.04)} }
        .zto-countdown { animation: countdown-pulse 3s ease-in-out infinite; }
      `}</style>

      {/* ════════════════════════════════════════ NAV */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">Z</span>
            </div>
            <span className="text-slate-900 font-black tracking-tight text-lg">
              Zero <span className="text-emerald-600">To</span> One
            </span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-slate-500 hover:text-emerald-700 text-sm font-medium transition-colors"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-slate-500 hover:text-emerald-700 text-sm font-medium transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/login"
              className="zto-btn-primary px-4 py-2 text-sm flex items-center gap-1.5"
            >
              Démarrer <ArrowRight size={14} />
            </Link>
          </div>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden text-slate-600 p-1"
          >
            <MenuIcon size={22} />
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden bg-white border-t border-slate-200 px-5 py-4 space-y-3 shadow-lg">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="block w-full text-left text-slate-500 hover:text-emerald-700 text-sm py-1.5"
              >
                {l.label}
              </button>
            ))}
            <Link
              href="/login"
              className="zto-btn-primary block text-center px-4 py-2.5 text-sm mt-3"
            >
              Démarrer gratuitement
            </Link>
          </div>
        )}
      </nav>

      {/* ════════════════════════════════════════ HERO */}
      <section className="relative min-h-screen flex items-center zto-grid-bg pt-16 bg-[#f8faf8]">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-400 opacity-[0.06] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              {/* Badge lancement */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full mb-3 zto-reveal">
                <Gift size={13} className="text-amber-600" />
                <span className="text-amber-700 text-xs font-semibold tracking-wide">
                  Offre de lancement · 3 mois gratuits sur le plan Pro
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full mb-6 zto-reveal">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full zto-blink" />
                <span className="text-emerald-700 text-xs font-semibold tracking-wider uppercase">
                  Lancement Afrique de l'Ouest
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6 text-slate-900 zto-reveal zto-delay-1">
                Votre restaurant en ligne.{" "}
                <span className="sa-gradient">Vos revenus multipliés.</span>
              </h1>

              <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-lg zto-reveal zto-delay-2">
                Zero To One transforme votre restaurant en une vitrine digitale
                professionnelle — menu interactif, commandes WhatsApp sans
                commission, analytics qui vous révèlent comment gagner plus.
              </p>

              <div className="flex flex-wrap gap-3 mb-10 zto-reveal zto-delay-3">
                <Link
                  href="/login"
                  className="zto-btn-primary px-6 py-3.5 text-base flex items-center gap-2"
                >
                  Créer mon site <ArrowRight size={16} />
                </Link>
                <button
                  onClick={() => scrollTo("#comment-ca-marche")}
                  className="zto-btn-ghost px-6 py-3.5 text-base"
                >
                  Voir comment ça marche
                </button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 zto-reveal zto-delay-4">
                {STATS.map((s) => (
                  <div
                    key={s.value}
                    className="border-l-2 border-emerald-400 pl-3"
                  >
                    <p className="text-2xl font-black text-slate-900">
                      {s.value}
                    </p>
                    <p className="text-slate-400 text-xs leading-tight mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — mockup dashboard */}
            <div className="hidden lg:flex justify-center zto-reveal zto-delay-2">
              <div className="relative zto-float">
                <div className="w-[420px] bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                  <div className="bg-slate-50 px-4 py-3 flex items-center gap-3 border-b border-slate-200">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                    </div>
                    <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-slate-400 font-mono border border-slate-200">
                      chez-aminata.zerotoone.app
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 zto-blink" />
                  </div>

                  <div className="p-5 space-y-4 bg-[#f8faf8]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-900 font-black text-base">
                          Tableau de bord
                        </p>
                        <p className="text-slate-400 text-xs">
                          Chez Aminata · En ligne
                        </p>
                      </div>
                      <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-mono border border-emerald-200">
                        Live ●
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { n: "247", l: "Vues aujourd'hui", c: "#16a34a" },
                        { n: "18", l: "Commandes", c: "#2563eb" },
                        { n: "87k", l: "FCFA générés", c: "#7c3aed" },
                      ].map((s) => (
                        <div
                          key={s.l}
                          className="bg-white rounded-xl p-3 border border-slate-200"
                        >
                          <p
                            className="font-black text-lg"
                            style={{ color: s.c }}
                          >
                            {s.n}
                          </p>
                          <p className="text-slate-400 text-[10px] leading-tight">
                            {s.l}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white rounded-xl p-3 space-y-2 border border-slate-200">
                      <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">
                        Plats stars
                      </p>
                      {[
                        { n: "Thiéboudiène", p: "3 500 F", pct: 82 },
                        { n: "Yassa Poulet", p: "4 000 F", pct: 65 },
                        { n: "Mafé Poisson", p: "3 200 F", pct: 48 },
                      ].map((item) => (
                        <div key={item.n} className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="flex justify-between mb-0.5">
                              <p className="text-slate-700 text-xs font-medium">
                                {item.n}
                              </p>
                              <p className="text-slate-400 text-xs">{item.p}</p>
                            </div>
                            <div className="h-1 bg-slate-100 rounded-full">
                              <div
                                className="h-1 rounded-full bg-emerald-500"
                                style={{ width: `${item.pct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 bg-[#25D366]/8 border border-[#25D366]/25 rounded-xl px-3 py-2.5">
                      <div className="w-6 h-6 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[10px] font-black">
                          W
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-[#15803d] text-xs font-semibold">
                          3 nouvelles commandes
                        </p>
                        <p className="text-slate-400 text-[10px]">
                          Reçues via WhatsApp · il y a 5min
                        </p>
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-200">
                        +3
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-8 -top-6 bg-white border border-slate-200 px-4 py-3 shadow-lg rounded-2xl w-44">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={12} className="text-emerald-500" />
                    <p className="text-slate-400 text-xs">Ce mois-ci</p>
                  </div>
                  <p className="text-slate-900 font-black text-xl">+87k</p>
                  <p className="text-slate-400 text-xs">FCFA générés</p>
                </div>

                <div className="absolute -left-6 -bottom-4 bg-white border border-slate-200 px-3 py-2 shadow-lg rounded-xl">
                  <p className="text-emerald-600 text-xs font-bold">
                    0% de commission
                  </p>
                  <p className="text-slate-400 text-[10px]">100% pour vous</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-400">
          <span className="text-xs font-mono tracking-wider">DÉFILER</span>
          <ChevronDown size={14} className="animate-bounce" />
        </div>
      </section>

      {/* ════════════════════════════════════════ BANNER */}
      <section className="bg-emerald-600 py-4 overflow-hidden">
        <div
          className="flex items-center gap-12 whitespace-nowrap"
          style={{ animation: "marquee 20s linear infinite" }}
        >
          {Array(6)
            .fill([
              "💰 Générez plus sans changer votre cuisine",
              "📊 Analytics qui révèlent vos meilleures heures",
              "🚀 En ligne en moins de 24h",
              "✅ Zéro commission sur vos ventes",
              "🎁 3 mois offerts au lancement",
            ])
            .flat()
            .map((t, i) => (
              <span
                key={i}
                className="text-white font-bold text-sm flex-shrink-0"
              >
                {t} <span className="mx-6 opacity-40">·</span>
              </span>
            ))}
        </div>
      </section>

      {/* ════════════════════════════════════════ FONCTIONNALITÉS */}
      <section id="fonctionnalites" className="py-24 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 zto-reveal">
            <span className="text-emerald-600 text-xs font-mono uppercase tracking-widest">
              Fonctionnalités
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4 text-slate-900">
              Tout ce dont vous avez besoin
              <br />
              <span className="sa-gradient">pour vendre plus</span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Une plateforme complète pensée pour les restaurateurs africains.
              Pas d'outils bricolés — une solution qui génère des revenus.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`zto-card p-6 transition-all hover:-translate-y-1 zto-reveal zto-delay-${(i % 3) + 1}`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${f.color}12` }}
                >
                  <f.icon size={18} style={{ color: f.color }} />
                </div>
                <h3 className="text-slate-900 font-bold text-base mb-2">
                  {f.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {f.desc}
                </p>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ color: f.color, backgroundColor: `${f.color}10` }}
                >
                  {f.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ COMMENT ÇA MARCHE */}
      <section id="comment-ca-marche" className="py-24 px-5 bg-[#f8faf8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 zto-reveal">
            <span className="text-emerald-600 text-xs font-mono uppercase tracking-widest">
              Comment ça marche
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4 text-slate-900">
              De zéro à en ligne et en train
              <br />
              <span className="sa-gradient">de vendre en 4 étapes</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-0">
              {STEPS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left flex gap-5 p-5 rounded-xl transition-all ${
                    activeStep === i
                      ? "bg-emerald-50 border border-emerald-200"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <span
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm transition-all ${
                      activeStep === i
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {s.num}
                  </span>
                  <div>
                    <p
                      className={`font-bold mb-1 ${activeStep === i ? "text-emerald-800" : "text-slate-700"}`}
                    >
                      {s.title}
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="zto-card p-10 flex flex-col items-center justify-center min-h-64 text-center lg:sticky lg:top-24">
              <div className="text-5xl mb-4">{STEPS[activeStep].icon}</div>
              <h3 className="text-slate-900 font-black text-xl mb-3">
                {STEPS[activeStep].title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                {STEPS[activeStep].desc}
              </p>
              <Link
                href="/login"
                className="zto-btn-primary mt-6 px-5 py-2.5 text-sm flex items-center gap-2 inline-flex"
              >
                Commencer maintenant <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ COMPARAISON */}
      <section className="py-24 px-5 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 zto-reveal">
            <span className="text-emerald-600 text-xs font-mono uppercase tracking-widest">
              Pourquoi Zero To One
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4 text-slate-900">
              Agence web vs Zero To One
              <br />
              <span className="sa-gradient">les chiffres parlent</span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm">
              Une agence facture entre 500 000 et 2 000 000 FCFA pour un site
              restaurant — sans analytics ni commandes intégrées. Zero To One
              vous donne plus, pour moins, en 24h.
            </p>
          </div>

          <div className="zto-card overflow-hidden zto-reveal">
            {/* Header */}
            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
              <div className="p-4 text-xs font-mono uppercase tracking-wider text-slate-400">
                Critère
              </div>
              <div className="p-4 text-center">
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  🏢 Agence web classique
                </span>
              </div>
              <div className="p-4 text-center">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  ⚡ Zero To One
                </span>
              </div>
            </div>
            {COMPARISON_ROWS.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 border-b border-slate-100 last:border-0 ${row.highlight ? "bg-emerald-50/40" : ""}`}
              >
                <div className="p-4 text-sm font-medium text-slate-700 flex items-center">
                  {row.label}
                </div>
                <div className="p-4 text-sm text-slate-400 text-center flex items-center justify-center">
                  <span className="flex items-center gap-1.5">
                    <X size={13} className="text-red-300 flex-shrink-0" />
                    {row.agence}
                  </span>
                </div>
                <div className="p-4 text-sm text-emerald-700 font-semibold text-center flex items-center justify-center">
                  <span className="flex items-center gap-1.5">
                    <Check
                      size={13}
                      className="text-emerald-500 flex-shrink-0"
                    />
                    {row.zto}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center zto-reveal">
            <Link
              href="/login"
              className="zto-btn-primary px-8 py-3.5 text-sm inline-flex items-center gap-2"
            >
              Créer mon site maintenant <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ ROI SECTION */}
      <section className="py-24 px-5 bg-[#0b1a10] relative overflow-hidden">
        <div className="absolute inset-0 zto-grid-bg opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-emerald-500 opacity-[0.05] rounded-full blur-[100px]" />

        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="zto-reveal">
              <span className="text-emerald-500 text-xs font-mono uppercase tracking-widest">
                Retour sur investissement
              </span>
              <h2 className="text-3xl md:text-4xl font-black mt-3 mb-6 text-white">
                15 000 FCFA investis.
                <br />
                <span className="sa-gradient">Combien vous rapportez ?</span>
              </h2>
              <p className="text-emerald-800 leading-relaxed mb-8">
                Nos restaurateurs Pro génèrent en moyenne 15 000 FCFA
                supplémentaires par semaine grâce aux commandes WhatsApp et à
                l'optimisation via les analytics. L'abonnement est rentabilisé
                en moins de 7 jours.
              </p>
              <div className="space-y-4">
                {[
                  {
                    icon: "💬",
                    txt: "Commandes WhatsApp sans commission = revenus directs",
                    n: "+100%",
                  },
                  {
                    icon: "📈",
                    txt: "Analytics → meilleures décisions → CA en hausse",
                    n: "+20% CA",
                  },
                  {
                    icon: "⏱️",
                    txt: "Gagnez du temps admin = plus de temps en cuisine",
                    n: "-3h/semaine",
                  },
                ].map((r) => (
                  <div
                    key={r.txt}
                    className="flex items-start gap-4 zto-card-dark p-4"
                  >
                    <span className="text-xl flex-shrink-0">{r.icon}</span>
                    <p className="text-emerald-700 text-sm flex-1">{r.txt}</p>
                    <span className="text-emerald-400 font-black text-sm flex-shrink-0">
                      {r.n}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculateur interactif */}
            <RoiCalculator />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ TARIFS */}
      <section id="tarifs" className="py-24 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 zto-reveal">
            <span className="text-emerald-600 text-xs font-mono uppercase tracking-widest">
              Tarifs
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4 text-slate-900">
              Des prix clairs.
              <br />
              <span className="sa-gradient">
                Un retour sur investissement immédiat.
              </span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Démarrez avec les frais de mise en ligne une seule fois, puis
              choisissez votre abonnement mensuel.
            </p>
          </div>

          {/* Setup fee */}
          <div className="max-w-3xl mx-auto mb-6 zto-reveal">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap size={18} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-slate-900 font-bold text-sm mb-1">
                  Frais de mise en ligne uniques —{" "}
                  <span className="text-amber-700">{SETUP_PRICE} FCFA</span>
                </p>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Couvrent la configuration complète de votre espace (template,
                  slug, SSL, onboarding personnalisé). Réglés une seule fois,
                  pour toujours. Option domaine personnalisé (.bj / .com) en
                  supplément :{" "}
                  <strong className="text-slate-700">
                    {DOMAIN_OPTION} FCFA
                  </strong>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Offre lancement */}
          <div className="max-w-3xl mx-auto mb-10 zto-reveal">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 zto-countdown">
                <Gift size={18} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-slate-900 font-bold text-sm mb-1">
                  Offre de lancement ·{" "}
                  <span className="text-emerald-700">
                    {LAUNCH_MONTHS_FREE} mois offerts sur le plan Pro
                  </span>
                </p>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Pour tout restaurant qui s'inscrit durant la période de
                  lancement, les {LAUNCH_MONTHS_FREE} premiers mois du plan Pro
                  sont{" "}
                  <strong className="text-slate-700">
                    entièrement gratuits
                  </strong>
                  . 45 000 FCFA d'économies dès le départ. Places limitées.
                </p>
              </div>
              <div className="flex-shrink-0 bg-emerald-600 text-white rounded-xl px-4 py-2 text-center">
                <p className="text-xs font-mono">Économies</p>
                <p className="text-lg font-black">45k F</p>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {PLANS.map((p, i) => (
              <div
                key={p.name}
                className={`relative rounded-2xl p-6 transition-all zto-reveal zto-delay-${i + 1} ${
                  p.featured
                    ? "bg-emerald-50 border-2 border-emerald-400"
                    : "bg-white border border-slate-200"
                }`}
              >
                {p.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-black px-4 py-1 rounded-full whitespace-nowrap">
                    ⭐ {p.badge}
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="text-slate-900 font-black text-xl mb-1">
                    {p.name}
                  </h3>
                  <p className="text-slate-500 text-sm">{p.desc}</p>
                </div>
                <div className="mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-400 text-sm">FCFA</span>
                    <span className="text-slate-900 font-black text-4xl">
                      {p.price}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">{p.period}</p>
                </div>
                {p.note && (
                  <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                    <p className="text-amber-700 text-xs font-semibold">
                      🎁 {p.note}
                    </p>
                  </div>
                )}
                <ul className="space-y-2.5 mb-7 mt-4">
                  {p.features.map((f) => (
                    <li key={f.text} className="flex items-center gap-2.5">
                      {f.ok ? (
                        <Check
                          size={14}
                          className="text-emerald-600 flex-shrink-0"
                        />
                      ) : (
                        <X size={14} className="text-slate-300 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${f.ok ? "text-slate-700" : "text-slate-300"}`}
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`w-full py-2.5 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                    p.featured ? "zto-btn-primary" : "zto-btn-ghost"
                  }`}
                >
                  {p.cta} <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>

          {/* Anti-churn note */}
          <div className="max-w-2xl mx-auto mt-6 zto-reveal">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
              <Shield
                size={16}
                className="text-slate-400 flex-shrink-0 mt-0.5"
              />
              <p className="text-slate-500 text-xs leading-relaxed">
                <strong className="text-slate-700">
                  Aucune suppression de données.
                </strong>{" "}
                Si vous ne renouvelez pas, votre site passe en mode Starter —
                toujours visible, WhatsApp et analytics suspendus. Vous reprenez
                exactement là où vous en étiez dès la prochaine recharge.
              </p>
            </div>
          </div>

          <p className="text-center text-slate-400 text-xs mt-6">
            Les abonnements démarrent après les 3 mois offerts · Annulation
            possible à tout moment · Aucun engagement
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════ TÉMOIGNAGES */}
      <section id="temoignages" className="py-24 px-5 bg-[#f8faf8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 zto-reveal">
            <span className="text-emerald-600 text-xs font-mono uppercase tracking-widest">
              Témoignages
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4 text-slate-900">
              Ils ont transformé
              <br />
              <span className="sa-gradient">leur présence digitale</span>
            </h2>
            <p className="text-slate-500">
              De Cotonou à Abidjan, de Dakar à Lomé.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`zto-card p-6 zto-reveal zto-delay-${i + 1}`}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array(t.stars)
                    .fill(0)
                    .map((_, j) => (
                      <Star
                        key={j}
                        size={13}
                        className="text-amber-400 fill-amber-400"
                      />
                    ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                    style={{ backgroundColor: t.bg }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-slate-900 text-sm font-bold">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ FAQ */}
      <section className="py-24 px-5 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 zto-reveal">
            <span className="text-emerald-600 text-xs font-mono uppercase tracking-widest">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 text-slate-900">
              Questions fréquentes
            </h2>
          </div>
          <div className="zto-reveal">
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ CTA CONTACT */}
      <section className="py-24 px-5 bg-[#0b1a10] relative overflow-hidden">
        <div className="absolute inset-0 zto-grid-bg opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500 opacity-[0.05] rounded-full blur-[100px]" />

        <div className="max-w-3xl mx-auto text-center relative zto-reveal">
          <span className="text-emerald-500 text-xs font-mono uppercase tracking-widest">
            Démarrez aujourd'hui
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 mb-5 leading-tight text-white">
            Votre restaurant mérite
            <br />
            <span className="sa-gradient">une vitrine qui vend.</span>
          </h2>
          <p className="text-emerald-800 text-lg mb-10 max-w-xl mx-auto">
            Rejoignez les restaurants qui ont transformé leur présence digitale.
            3 mois offerts, rentabilisé en une semaine.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link
              href="/login"
              className="zto-btn-primary px-8 py-4 text-base flex items-center gap-2"
            >
              Créer mon compte <ArrowRight size={16} />
            </Link>
            <a
              href="mailto:zerotooneresto@gmail.com"
              className="zto-btn-ghost-dark px-8 py-4 text-base flex items-center gap-2"
            >
              <Mail size={16} /> Demander une démo
            </a>
          </div>

          <p className="text-emerald-900 text-sm mb-8">
            Frais de mise en ligne : {SETUP_PRICE} FCFA · 3 mois Pro offerts ·
            Annulation en 1 clic
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-emerald-900/30">
            <a
              href="mailto:zerotooneresto@gmail.com"
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-400 transition-colors text-sm"
            >
              <Mail size={14} />
              zerotooneresto@gmail.com
            </a>
            <a
              href="tel:+2290143397675"
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-400 transition-colors text-sm"
            >
              <Phone size={14} />
              +229 01 43 39 76 75
            </a>
            <div className="flex items-center gap-2 text-emerald-900 text-sm">
              <Clock size={14} />
              Réponse sous 24h
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ FOOTER */}
      <footer className="bg-[#040a06] border-t border-emerald-900/20 py-12 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <a href="#" className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-xs">Z</span>
                </div>
                <span className="text-white font-black">Zero To One</span>
              </a>
              <p className="text-emerald-900 text-sm leading-relaxed max-w-xs">
                La plateforme SaaS qui donne à chaque restaurant une présence
                digitale professionnelle — pensée pour l'Afrique.
              </p>
              <div className="flex gap-4 mt-5">
                <a
                  href="mailto:zerotooneresto@gmail.com"
                  className="text-emerald-800 hover:text-emerald-500 transition-colors"
                >
                  <Mail size={15} />
                </a>
                <a
                  href="tel:+2290143397675"
                  className="text-emerald-800 hover:text-emerald-500 transition-colors"
                >
                  <Phone size={15} />
                </a>
              </div>
            </div>
            <div>
              <p className="text-emerald-600 text-xs font-mono uppercase tracking-wider mb-4">
                Produit
              </p>
              <ul className="space-y-2.5">
                {["Fonctionnalités", "Templates", "Tarifs", "Analytics"].map(
                  (l) => (
                    <li key={l}>
                      <button
                        onClick={() => scrollTo(`#${l.toLowerCase()}`)}
                        className="text-emerald-900 hover:text-emerald-500 text-sm transition-colors"
                      >
                        {l}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <p className="text-emerald-600 text-xs font-mono uppercase tracking-wider mb-4">
                Contact
              </p>
              <ul className="space-y-2.5 text-sm text-emerald-900">
                <li>
                  <a
                    href="mailto:zerotooneresto@gmail.com"
                    className="hover:text-emerald-500 transition-colors break-all"
                  >
                    zerotooneresto@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+2290143397675"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    +229 01 43 39 76 75
                  </a>
                </li>
                <li className="text-emerald-900">Cotonou, Bénin</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-emerald-900/20">
            <p className="text-emerald-900 text-xs">
              © {new Date().getFullYear()} Zero To One. Tous droits réservés.
            </p>
            <p className="text-emerald-900 text-xs">
              Fait avec ❤️ pour les restaurateurs d'Afrique
            </p>
          </div>
        </div>
      </footer>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Zero To One",
            applicationCategory: "BusinessApplication",
            description:
              "Plateforme SaaS pour créer le site web de votre restaurant en 24h. Menu digital, commandes WhatsApp, analytics.",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "5000",
              priceCurrency: "XOF",
              description: "Plan Starter — 5 000 FCFA/mois",
            },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+229-01-43-39-76-75",
              email: "zerotooneresto@gmail.com",
              contactType: "customer support",
              areaServed: ["BJ", "CI", "SN", "TG"],
              availableLanguage: "French",
            },
            url: "https://zerotoone.app",
          }),
        }}
      />
    </div>
  );
}
