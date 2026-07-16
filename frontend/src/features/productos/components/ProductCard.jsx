import { useState } from "react";
import { ShoppingCart, AlertTriangle, Check, Sparkles, ArrowRight } from "lucide-react";
import { useCart } from "../../carrito/CartContext";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  const slug = product.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const productUrl = `/producto/${product.id}/${slug}`;

  // Lógica para mostrar imagen
  let displayImage = product.imagenUrl;
  if (!displayImage && product.imagenesAdicionales) {
    try {
      const parsedImages = JSON.parse(product.imagenesAdicionales);
      if (Array.isArray(parsedImages) && parsedImages.length > 0) {
        displayImage = parsedImages[0];
      }
    } catch (e) {
      // JSON inválido, no hacer nada
    }
  }

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <div className="group bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-1.5 flex flex-col relative">
      <Link to={productUrl} className="relative aspect-[4/3] bg-surface-950/60 overflow-hidden block p-3 flex items-center justify-center">
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.nombre}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-md"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-900 rounded-xl">
            <ShoppingCart className="w-12 h-12 text-surface-600" />
          </div>
        )}

        {product.categoria && (
          <span className="absolute top-3 left-3 bg-surface-900/90 backdrop-blur-md text-xs font-bold text-slate-200 px-3 py-1 rounded-lg border border-surface-700 shadow-sm">
            {product.categoria.nombre}
          </span>
        )}

        {isLowStock && !isOutOfStock && (
          <span className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-slate-950 text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-amber-500/20 border border-amber-300 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 fill-slate-950 text-slate-950" />
            <span>⚡ ¡Solo {product.stock} unid.!</span>
          </span>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-surface-950/85 flex flex-col items-center justify-center backdrop-blur-md p-4 text-center transition-all">
            <span className="text-rose-400 font-extrabold text-xs tracking-wider uppercase bg-rose-500/15 border border-rose-500/30 px-4 py-2 rounded-full shadow-lg shadow-rose-500/10">
              🔴 Agotado temporalmente
            </span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link to={productUrl} className="hover:text-brand-400 transition-colors no-underline">
          <h3 className="font-sans font-bold text-slate-100 text-base leading-snug mb-2 line-clamp-2 min-h-[3rem]">
            {product.nombre}
          </h3>
        </Link>

        {product.descripcion && (
          <p className="text-surface-400 text-xs leading-relaxed mb-4 line-clamp-2">
            {product.descripcion}
          </p>
        )}

        {/* Indicador Universal de Stock (Heurística Nielsen #1 Visibilidad del Estado & Diseño Apple) */}
        <div className="mb-4">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>Agotado (0 disp.)</span>
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>¡Stock crítico! Quedan {product.stock} unid.</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Stock disponible ({product.stock} unid.)</span>
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-surface-800/80 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-surface-400">Precio de Lista</span>
            <span className="font-sans font-extrabold text-lg sm:text-xl text-white tracking-tight">
              S/ {Number(product.precio).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 shadow-md ${
              justAdded
                ? "bg-emerald-500 text-slate-950 shadow-emerald-500/25 scale-105"
                : isOutOfStock
                ? "bg-surface-800 text-surface-500 cursor-not-allowed shadow-none"
                : "bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/25 active:scale-95"
            }`}
            title="Añadir a tu pedido"
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 shrink-0 stroke-[3]" />
                <span>¡Añadido!</span>
              </>
            ) : isOutOfStock ? (
              <span>Sin stock</span>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 shrink-0" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
