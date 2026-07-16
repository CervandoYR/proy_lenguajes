import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    title: "Laptops Gamer",
    subtitle: "Rendimiento sin limites para los gamers mas exigentes",
    cta: "Ver catalogo",
    gradient: "from-blue-950/80 via-surface-950/60 to-surface-950",
    accent: "text-brand-400",
  },
  {
    title: "Workstations Profesionales",
    subtitle: "Potencia de nivel empresarial para creativos y desarrolladores",
    cta: "Explorar equipos",
    gradient: "from-indigo-950/80 via-surface-950/60 to-surface-950",
    accent: "text-indigo-400",
  },
  {
    title: "Ofertas Especiales",
    subtitle: "Hasta 30% de descuento en equipos seleccionados este mes",
    cta: "Ver ofertas",
    gradient: "from-emerald-950/80 via-surface-950/60 to-surface-950",
    accent: "text-emerald-400",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning]
  );

  const goNext = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const goPrev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext]);

  const slide = SLIDES[current];

  function scrollToCatalog(e) {
    e.preventDefault();
    const el = document.getElementById("catalogo");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative overflow-hidden bg-surface-950">
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} transition-all duration-700`} />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-brand-500 rounded-full blur-[128px]" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-indigo-500 rounded-full blur-[96px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-2xl">
          <div
            className="transition-all duration-500 ease-out"
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? "translateY(20px)" : "translateY(0)",
            }}
          >
            <span className={`inline-block text-xs font-semibold uppercase tracking-widest mb-4 ${slide.accent}`}>
              Servitek Technologies
            </span>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-100 tracking-tight mb-5 leading-tight">
              {slide.title}
            </h1>

            <p className="text-surface-400 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              {slide.subtitle}
            </p>

            <a
              href="#catalogo"
              onClick={scrollToCatalog}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-display font-bold text-sm rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/25 no-underline"
            >
              {slide.cta}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6">
          <button
            onClick={goPrev}
            className="p-2 rounded-full bg-surface-800/60 hover:bg-surface-700 border border-surface-700/50 transition-all cursor-pointer backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4 text-slate-300" />
          </button>

          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer border-none ${
                  i === current
                    ? "w-8 bg-brand-500"
                    : "w-3 bg-surface-600 hover:bg-surface-500"
                }`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            className="p-2 rounded-full bg-surface-800/60 hover:bg-surface-700 border border-surface-700/50 transition-all cursor-pointer backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
