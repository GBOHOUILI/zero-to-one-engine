"use client";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  identity: {
    name: string;
    slogan?: string;
  };
  colors?: {
    // ← colors est optionnel
    primary?: string;
    secondary?: string;
  };
  contact: {
    whatsapp: string;
  };
  heroBackground?: {
    type: "image" | "video";
    url: string;
    poster?: string;
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
  };
}

export default function Hero({
  identity,
  colors = {}, // ← fallback objet vide par défaut
  contact,
  heroBackground,
}: HeroProps) {
  // Fallbacks couleurs – jamais de crash
  const primary = colors.primary ?? "#3B82F6";
  const secondary = colors.secondary ?? "#ffffff"; // blanc visible en fallback

  const fallbackImage =
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop";

  const bgType = heroBackground?.type ?? "image";
  const bgUrl = heroBackground?.url ?? fallbackImage;
  const posterUrl = heroBackground?.poster ?? fallbackImage;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      role="banner"
      aria-label={`Bienvenue chez ${identity.name}`}
    >
      {/* Background dynamique */}
      {bgType === "video" && heroBackground ? (
        <div className="absolute inset-0">
          <video
            autoPlay={heroBackground.autoplay ?? true}
            muted={heroBackground.muted ?? true}
            loop={heroBackground.loop ?? true}
            playsInline
            preload="metadata"
            poster={posterUrl}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={bgUrl} type="video/mp4" />
            <img
              src={posterUrl}
              alt={`Ambiance du restaurant ${identity.name}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </video>
        </div>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${bgUrl}')`,
            filter: "brightness(0.68) contrast(1.08) saturate(1.05)",
          }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/60" />

      {/* Contenu */}
      <div className="relative z-10 container mx-auto px-5 sm:px-8 lg:px-12 text-center pt-20 sm:pt-28 pb-24">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
          <p className="text-sm sm:text-base uppercase tracking-[0.3em] font-medium text-white/90 animate-fade-in">
            Bienvenue à
          </p>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white drop-shadow-2xl animate-fade-in-up">
            {identity.name.split(" ").map((word, index) => (
              <span
                key={word}
                className="inline-block"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {word}
                {index < identity.name.split(" ").length - 1 && (
                  <span
                    className="inline-block w-4 sm:w-6"
                    aria-hidden="true"
                  />
                )}
              </span>
            ))}
          </h1>

          {identity.slogan && (
            <p
              className="text-lg sm:text-xl md:text-2xl font-light text-white/95 max-w-3xl mx-auto leading-relaxed animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              {identity.slogan}
            </p>
          )}

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 pt-8 animate-fade-in"
            style={{ animationDelay: "600ms" }}
          >
            <a
              href="#menu"
              className="inline-flex px-8 sm:px-12 py-4 rounded-full text-base sm:text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
              style={{
                backgroundColor: secondary,
                color: primary,
              }}
            >
              Découvrir le Menu
            </a>

            <a
              href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}?text=Bonjour%2C%20je%20souhaite%20réserver%20une%20table%20chez%20${encodeURIComponent(identity.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-8 sm:px-12 py-4 rounded-full text-base sm:text-lg font-semibold border-2 border-white/70 text-white transition-all duration-300 hover:bg-white/15 hover:border-white hover:scale-105 active:scale-95"
            >
              Réserver une Table
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#story"
        className="absolute bottom-12 sm:bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow z-20"
        aria-label="Découvrir la suite"
      >
        <span className="text-xs sm:text-sm uppercase tracking-wider text-white/80 font-medium">
          Découvrir
        </span>
        <ChevronDown className="text-white/90" size={32} strokeWidth={2.5} />
      </a>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-14px);
          }
        }
        .animate-fade-in {
          animation: fade-in 1.3s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.1s ease-out forwards;
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}
