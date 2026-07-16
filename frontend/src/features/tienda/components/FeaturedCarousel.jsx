import { ChevronRight, ChevronLeft, ShoppingCart, Sparkles, Tag } from "lucide-react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../carrito/CartContext";
import { toast } from "sonner";

export default function FeaturedCarousel({ products }) {
  const scrollRef = useRef(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleAdd = (producto) => {
    addToCart(producto);
    toast.success(`¡Listo! ${producto.nombre} está en tu carrito`, {
      action: {
        label: "Ir a pagar →",
        onClick: () => navigate("/checkout"),
      },
      duration: 4000,
    });
  };

  return (
    <div className="py-20 bg-surface-900 border-b border-surface-800 relative select-none">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Tag className="w-3.5 h-3.5" />
              <span>Descuentos Directos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-100 tracking-tight">
              Equipos Destacados en Oferta
            </h2>
            <p className="text-surface-400 mt-2 text-sm sm:text-base max-w-xl">
              Modelos seleccionados con alta demanda, listos para enviar hoy mismo a tu domicilio o provincia.
            </p>
          </div>
        </div>
      </div>

      <div className="relative group/carousel mt-2 w-full">
        <button 
          onClick={() => scroll("left")} 
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-2xl bg-surface-800/90 hover:bg-surface-700 border border-surface-700 text-slate-100 shadow-2xl opacity-0 group-hover/carousel:opacity-100 transition-all hover:scale-105 hidden md:flex cursor-pointer active:scale-95"
          title="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button 
          onClick={() => scroll("right")} 
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-2xl bg-surface-800/90 hover:bg-surface-700 border border-surface-700 text-slate-100 shadow-2xl opacity-0 group-hover/carousel:opacity-100 transition-all hover:scale-105 hidden md:flex cursor-pointer active:scale-95"
          title="Siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 px-6 lg:px-16 xl:px-24 w-full scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.slice(0, 6).map((producto) => {
            const slug = producto.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            const productUrl = `/producto/${producto.id}/${slug}`;
            
            let displayImage = producto.imagenUrl;
            if (!displayImage && producto.imagenesAdicionales) {
              try {
                const parsedImages = JSON.parse(producto.imagenesAdicionales);
                if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                  displayImage = parsedImages[0];
                }
              } catch (e) {}
            }

            const ahorro = (producto.precio * 0.15).toFixed(0);

            return (
              <div key={producto.id} className="min-w-[310px] sm:min-w-[360px] snap-start">
                <div className="bg-surface-950 border border-surface-800 hover:border-brand-500/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col group">
                  <Link to={productUrl} className="relative aspect-square mb-5 bg-surface-900/80 rounded-xl overflow-hidden flex items-center justify-center p-5 block cursor-pointer">
                    {displayImage ? (
                      <img src={displayImage} alt={producto.nombre} className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-20 h-20 bg-surface-800 rounded-full flex items-center justify-center text-surface-500 font-bold text-xs">
                        SERVITEK
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md">
                      Ahorras S/ {ahorro}
                    </div>
                  </Link>

                  <div className="flex-1 flex flex-col">
                    <span className="text-xs text-brand-400 font-bold tracking-wider uppercase mb-1.5">
                      {producto.categoria?.nombre || "Destacado"}
                    </span>
                    <Link to={productUrl} className="no-underline">
                      <h3 className="font-sans font-bold text-base text-slate-100 leading-snug line-clamp-2 mb-3 group-hover:text-brand-400 transition-colors cursor-pointer min-h-[3rem]">
                        {producto.nombre}
                      </h3>
                    </Link>
                    
                    <div className="mt-auto pt-4 border-t border-surface-800 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs text-surface-400 line-through block mb-0.5">
                          S/ {(producto.precio * 1.15).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-xl font-sans font-extrabold text-white tracking-tight">
                          S/ {Number(producto.precio).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => { e.preventDefault(); handleAdd(producto); }}
                        className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 flex items-center gap-2 text-white font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-md shadow-brand-500/20 border-none"
                        title="Agregar rápido"
                      >
                        <ShoppingCart className="w-4 h-4 shrink-0" />
                        <span>Comprar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
