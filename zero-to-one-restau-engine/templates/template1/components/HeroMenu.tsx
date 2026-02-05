// templates/template1/components/HeroMenu.tsx
interface HeroMenuProps {
  title?: string;
  subtitle?: string;
  background?: {
    type: "image" | "video";
    url: string;
    poster?: string;
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    alt?: string;
  };
  primaryColor: string;
}

export default function HeroMenu({
  title = "Notre Carte",
  subtitle = "Découvrez nos saveurs authentiques",
  background,
  primaryColor,
}: HeroMenuProps) {
  const primary = primaryColor ?? "#2f81d3";

  // Fallback background
  const fallbackBg = {
    type: "image",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=2070&q=80&auto=format&fit=crop",
    alt: "Fond menu élégant",
  };

  const bg = background || fallbackBg;
  const bgUrl = bg.url;
  const posterUrl = bg.poster || bg.url;

  return (
    <section
      className="relative h-[45vh] md:h-[50vh] flex items-center justify-center overflow-hidden"
      role="banner"
      aria-label={title}
    >
      {/* Background */}
      {bg.type === "video" ? (
        <video
          autoPlay={bg.autoplay ?? true}
          muted={bg.muted ?? true}
          loop={bg.loop ?? true}
          playsInline
          preload="metadata"
          poster={posterUrl}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={bgUrl} type="video/mp4" />
          <img
            src={posterUrl}
            alt={bg.alt || "Fond vidéo menu"}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${bgUrl}')` }}
        />
      )}

      {/* Overlay simple */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Contenu texte centré */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-6 text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
