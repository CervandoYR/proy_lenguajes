import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const SLIDES = [
  {
    id: 1,
    title: "Trabaja, estudia o juega sin lentitud ni interrupciones",
    subtitle: "Laptops y Portátiles de Alto Calibre",
    description: "Equipos preparados para renderizar en 3D, editar videos profesionales o correr tus programas y juegos más exigentes con total fluidez.",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=2068",
    color: "from-brand-600/60 via-surface-950/80 to-surface-950",
    badgeText: "Listo para envío en Lima y Provincias"
  },
  {
    id: 2,
    title: "El setup que cuida tu vista e impulsa tu trabajo diario",
    subtitle: "Monitores Nítidos & Periféricos Ergonómicos",
    description: "Pantallas de alta tasa de refresco y accesorios cómodos que hacen que pasar horas creando o estudiando sea un verdadero placer y no canse tus ojos.",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=2042",
    color: "from-amber-600/60 via-surface-950/80 to-surface-950",
    badgeText: "Garantía Oficial y Soporte Directo"
  },
  {
    id: 3,
    title: "Equipos probados, configurados y listos para encender",
    subtitle: "Atención y Asesoría Humana",
    description: "Te ayudamos a elegir sin tecnicismos complicados la computadora exacta que se ajusta a tu presupuesto y a lo que haces todos los días.",
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=2070",
    color: "from-cyan-600/60 via-surface-950/80 to-surface-950",
    badgeText: "Asesoría gratuita por WhatsApp"
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prev = () => setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div className="relative w-full min-h-[620px] sm:min-h-[640px] md:h-[680px] overflow-hidden bg-surface-950 select-none flex items-center">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover scale-105 transform group-hover:scale-100 transition-transform duration-[12000ms] ease-out filter brightness-[0.7]"
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} mix-blend-normal opacity-90`} />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center py-16 sm:py-0">
            <div className="container-custom relative z-20 w-full px-6 sm:px-12 md:px-6">
              <div className="max-w-3xl space-y-5 sm:space-y-6 pb-12 sm:pb-0 transition-all duration-1000 transform translate-y-0 opacity-100">
                
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-brand-500/25 border border-brand-500/40 backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-300 shrink-0" />
                    <span className="text-[11px] sm:text-xs font-bold text-brand-200 tracking-wide uppercase">{slide.subtitle}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3 sm:py-1.5 rounded-full bg-surface-900/80 border border-surface-700 text-[11px] sm:text-xs font-semibold text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{slide.badgeText}</span>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl font-display font-bold text-white leading-[1.15] sm:leading-[1.12] tracking-tight">
                  {slide.title}
                </h1>

                <p className="text-sm sm:text-lg md:text-xl text-surface-300 max-w-2xl font-normal leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {slide.description}
                </p>

                <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-md sm:max-w-none">
                  <Link 
                    to="/?categoria=" 
                    className="px-6 py-3.5 sm:px-8 sm:py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-sans font-bold text-sm sm:text-base transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2.5 shadow-xl shadow-brand-500/30 no-underline active:scale-95"
                  >
                    <span>Ver catálogo disponible</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                  <Link 
                    to="/soporte" 
                    className="px-6 py-3.5 sm:px-6 sm:py-4 bg-surface-900/90 hover:bg-surface-800 text-slate-200 border border-surface-700 rounded-xl font-sans font-semibold text-sm sm:text-base transition-all flex items-center justify-center no-underline active:scale-95"
                  >
                    Asesoría personalizada
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controls (Ocultos en móvil pequeño para evitar que tapen el texto, visibles en sm+) */}
      <button 
        onClick={prev} 
        className="hidden sm:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3.5 rounded-xl bg-surface-900/60 hover:bg-surface-800 backdrop-blur-md border border-surface-700 text-white transition-all hover:scale-105 cursor-pointer shadow-lg active:scale-95"
        title="Anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button 
        onClick={next} 
        className="hidden sm:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3.5 rounded-xl bg-surface-900/60 hover:bg-surface-800 backdrop-blur-md border border-surface-700 text-white transition-all hover:scale-105 cursor-pointer shadow-lg active:scale-95"
        title="Siguiente"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots navigation */}
      <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3 bg-surface-950/80 backdrop-blur-md px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-surface-800">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 rounded-full cursor-pointer border-none ${
              index === current ? "w-6 sm:w-8 h-2 sm:h-2.5 bg-brand-500 shadow-md shadow-brand-500/50" : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-surface-600 hover:bg-surface-400"
            }`}
            title={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
