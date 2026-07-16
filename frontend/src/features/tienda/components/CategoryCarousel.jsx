import { ChevronRight, ChevronLeft, LayoutGrid } from "lucide-react";
import { useRef } from "react";
import ProductCard from "../../productos/components/ProductCard";

export default function CategoryCarousel({ category, products }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="py-12 border-b border-surface-800 last:border-b-0">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
              <LayoutGrid className="w-6 h-6 text-brand-400" />
              {category.nombre}
            </h2>
            {category.descripcion && (
              <p className="text-surface-400 mt-1 text-sm">{category.descripcion}</p>
            )}
          </div>
        </div>
      </div>

      <div className="relative group/carousel mt-4 w-full">
        <button 
          onClick={() => scroll("left")} 
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-surface-800 border border-surface-700 text-slate-200 shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-all hover:scale-110 hover:bg-surface-700 hidden md:flex cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button 
          onClick={() => scroll("right")} 
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-surface-800 border border-surface-700 text-slate-200 shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-all hover:scale-110 hover:bg-surface-700 hidden md:flex cursor-pointer active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 px-6 lg:px-16 xl:px-24 w-full scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((producto) => (
            <div key={producto.id} className="w-[280px] sm:w-[300px] shrink-0 snap-start">
              <ProductCard product={producto} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
