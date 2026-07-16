import { Link } from "react-router-dom";
import { Monitor, Cpu, Headset, Laptop, ArrowRight, Sparkles } from "lucide-react";

export default function CategoryBento() {
  return (
    <div className="py-24 bg-surface-950 border-y border-surface-800 relative overflow-hidden">
      {/* Decorative subtle gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-900 border border-surface-700 text-xs font-bold text-brand-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Encuentra el equipo ideal para ti</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-5 tracking-tight">
            Tecnología diseñada para tu día a día
          </h2>
          <p className="text-surface-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Seleccionamos y preparamos cada producto pensando en lo que realmente necesitas: velocidad para trabajar sin interrupciones, gráficos fluidos y durabilidad comprobada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[620px]">
          
          {/* Laptops - Large Featured Card (Span 7) */}
          <Link to="/?categoria=laptops" className="group relative rounded-3xl overflow-hidden md:col-span-7 bg-surface-900 border border-surface-800 hover:border-brand-500/50 transition-all duration-500 flex flex-col justify-end p-8 md:p-12 no-underline shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/60 to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=2042" 
              alt="Laptops de alto rendimiento" 
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
            
            <div className="relative z-20 max-w-xl">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/20 backdrop-blur-md flex items-center justify-center mb-6 border border-brand-500/30 text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                <Laptop className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-2 block">
                Para Arquitectura, Ingeniería & Gaming
              </span>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-3 tracking-tight">
                Laptops y Portátiles Potentes
              </h3>
              <p className="text-surface-300 text-sm md:text-base leading-relaxed mb-6">
                Olvídate de pantallas congeladas o cargas lentas. Trabaja con planos 3D, edición en 4K o disfruta de tus juegos favoritos en alta definición donde quieras.
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-bold text-white bg-surface-800/80 hover:bg-brand-500 px-5 py-2.5 rounded-xl border border-surface-700 transition-all">
                <span>Ver laptops disponibles</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Right Column Stack (Span 5) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            
            {/* Componentes - Top Card */}
            <Link to="/?categoria=componentes" className="group relative rounded-3xl overflow-hidden flex-1 bg-surface-900 border border-surface-800 hover:border-amber-500/50 transition-all duration-500 flex flex-col justify-end p-8 no-underline shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/70 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2070" 
                alt="Componentes para PC" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
              <div className="relative z-20">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 backdrop-blur-md flex items-center justify-center mb-4 border border-amber-500/30 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  Componentes para tu PC
                </h3>
                <p className="text-surface-300 text-sm leading-relaxed mb-4">
                  Actualiza o arma tu computadora de escritorio desde cero con piezas compatibles, garantizadas y listas para instalar.
                </p>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 group-hover:underline">
                  Explora tarjetas de video y procesadores →
                </span>
              </div>
            </Link>

            {/* Perifericos - Bottom Card */}
            <Link to="/?categoria=perifericos" className="group relative rounded-3xl overflow-hidden flex-1 bg-surface-900 border border-surface-800 hover:border-cyan-500/50 transition-all duration-500 flex flex-col justify-end p-8 no-underline shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/70 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=2071" 
                alt="Perifericos y Accesorios" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
              <div className="relative z-20">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 backdrop-blur-md flex items-center justify-center mb-4 border border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                  <Headset className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  Accesorios y Periféricos
                </h3>
                <p className="text-surface-300 text-sm leading-relaxed mb-4">
                  Teclados cómodos, audífonos claros y monitores nítidos que cuidan tu vista en jornadas largas de estudio o trabajo.
                </p>
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 group-hover:underline">
                  Ver monitores y accesorios →
                </span>
              </div>
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}
