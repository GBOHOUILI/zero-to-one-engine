// templates/template1/components/common/TestimonialCarousel.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import type { RestaurantConfig } from "@/lib/types";

interface TestimonialCarouselProps {
  testimonials: NonNullable<RestaurantConfig["testimonials"]>;
  primaryColor: string;
}

export default function TestimonialCarousel({
  testimonials,
  primaryColor,
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Initialiser à 1 pour éviter l'erreur d'hydratation (serveur = client au premier rendu)
  const [visibleCount, setVisibleCount] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  // Calculer le nombre de témoignages visibles selon la taille d'écran
  const getVisibleCount = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1024) return 3; // lg: 3 cartes
    if (window.innerWidth >= 768) return 2; // md: 2 cartes
    return 1; // mobile: 1 carte
  };

  // Après le montage, calculer le bon nombre de colonnes
  useEffect(() => {
    setIsMounted(true);
    setVisibleCount(getVisibleCount());
  }, []);

  // Mettre à jour le nombre visible au redimensionnement
  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - visibleCount);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-défilement
  useEffect(() => {
    if (!isHovered && testimonials.length > visibleCount) {
      const interval = setInterval(next, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered, next, testimonials.length, visibleCount]);

  // Gestion du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  if (testimonials.length === 0) return null;

  return (
    <div
      className="relative max-w-7xl mx-auto px-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-3 md:px-4"
              style={{ width: `${100 / visibleCount}%` }}
            >
              <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 md:p-8 h-full flex flex-col">
                {/* Guillemets décoratifs */}
                <div className="mb-4">
                  <svg
                    className="w-10 h-10 opacity-20"
                    style={{ color: primaryColor }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Texte du témoignage */}
                <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 flex-grow italic">
                  {testimonial.text}
                </p>

                {/* Auteur et note */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="font-bold text-gray-900">
                      {testimonial.author}
                    </p>
                    {testimonial.role && (
                      <p className="text-sm text-gray-500 mt-1">
                        {testimonial.role}
                      </p>
                    )}
                  </div>

                  {/* Étoiles de notation */}
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5"
                        style={{ color: primaryColor }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Boutons de navigation */}
      {testimonials.length > visibleCount && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
            style={{
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s, transform 0.3s",
            }}
            aria-label="Témoignage précédent"
          >
            <svg
              className="w-6 h-6"
              style={{ color: primaryColor }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10"
            style={{
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s, transform 0.3s",
            }}
            aria-label="Témoignage suivant"
          >
            <svg
              className="w-6 h-6"
              style={{ color: primaryColor }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Indicateurs de pagination */}
      {testimonials.length > visibleCount && (
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(maxIndex + 1)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-8 h-3 bg-opacity-100"
                  : "w-3 h-3 bg-opacity-40 hover:bg-opacity-60"
              }`}
              style={{ backgroundColor: primaryColor }}
              aria-label={`Aller au groupe de témoignages ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
