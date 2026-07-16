import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import StoreLayout from "../../../layouts/StoreLayout";
import ProductCard from "../components/ProductCard";
import { getProductoById, getProductosPorCategoria } from "../productosService";
import { useCart } from "../../carrito/CartContext";
import { toast } from "sonner";
import { ChevronRight, Home, ShoppingCart, ShieldCheck, Truck, Package, Box, ZoomIn, Info, Plus, Minus, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import '@google/model-viewer';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);
  const [qty, setQty] = useState(1);
  
  // Media State
  const [allImages, setAllImages] = useState([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0); 
  const [isZooming, setIsZooming] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imgContainerRef = useRef(null);

  const { addToCart, items } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    setQty(1);
    fetchData();
  }, [id]);

  async function fetchData() {
    setLoading(true);
    try {
      const data = await getProductoById(id);
      setProduct(data);
      setQty(1);

      // Process images
      let images = [];
      if (data.imagenUrl) images.push(data.imagenUrl);
      if (data.imagenesAdicionales) {
        try {
          const parsed = JSON.parse(data.imagenesAdicionales);
          if (Array.isArray(parsed)) images = [...images, ...parsed];
        } catch (e) {
          console.error("Error parsing imagenesAdicionales", e);
        }
      }
      setAllImages(images);
      setActiveMediaIndex(0);

      if (data.categoria) {
        const recList = (await getProductosPorCategoria(data.categoria.id))
          .filter(p => p.id !== data.id)
          .slice(0, 4);
        setRecommended(recList);
      }
    } catch (error) {
      console.error("Error al cargar el producto", error);
    } finally {
      setLoading(false);
    }
  }

  const handleMouseMove = (e) => {
    if (!imgContainerRef.current) return;
    const { left, top, width, height } = imgContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    const existing = items.find(i => i.product.id === product.id);
    const currentInCart = existing ? existing.quantity : 0;
    if (currentInCart + qty > product.stock) {
      toast.error(`Límite de inventario alcanzado (${product.stock} disponibles). Ya tienes ${currentInCart} unidades en tu carrito.`);
      return;
    }
    addToCart(product, qty);
    toast.success(`${qty}x ${product.nombre} agregado(s) al carrito`, {
      icon: <ShoppingCart className="w-4 h-4 text-brand-500" />,
      action: {
        label: "Ir a pagar →",
        onClick: () => navigate("/checkout"),
      },
      duration: 4000,
    });
  };

  if (loading) {
    return (
      <StoreLayout>
        <div className="min-h-screen bg-surface-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      </StoreLayout>
    );
  }

  if (!product) {
    return (
      <StoreLayout>
        <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-display font-bold text-white mb-4">Producto no encontrado</h1>
          <Link to="/" className="text-brand-400 hover:underline">Volver al inicio</Link>
        </div>
      </StoreLayout>
    );
  }

  const isOutOfStock = product.stock === 0;

  // Process specifications
  let specifications = null;
  if (product.especificaciones) {
    try {
      specifications = JSON.parse(product.especificaciones);
    } catch (e) {
      console.error("Error parsing especificaciones", e);
    }
  }

  // Media calculations
  const has3D = !!product.modelo3dUrl;
  const isViewing3D = has3D && activeMediaIndex === 0;
  const activeImage = !has3D ? allImages[activeMediaIndex] : (activeMediaIndex > 0 ? allImages[activeMediaIndex - 1] : null);

  return (
    <StoreLayout>
      <div className="min-h-screen bg-surface-950 pt-24 pb-20">
        <div className="container-custom max-w-7xl mx-auto">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-surface-400 mb-10 overflow-x-auto whitespace-nowrap pb-2">
            <Link to="/" className="hover:text-brand-400 transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/?categoria=#catalogo" className="hover:text-brand-400 cursor-pointer transition-colors">Productos</Link>
            <ChevronRight className="w-4 h-4" />
            <Link 
              to={product.categoria ? `/?categoria=${product.categoria.slug || product.categoria.id}#catalogo` : "/?categoria=#catalogo"} 
              className="hover:text-brand-400 cursor-pointer transition-colors"
            >
              {product.categoria?.nombre || "Hardware"}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-200 font-medium truncate max-w-xs">{product.nombre}</span>
          </nav>

          {/* Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
              <div 
                ref={imgContainerRef}
                onMouseEnter={() => !isViewing3D && setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
                className="bg-surface-900/50 backdrop-blur-xl border border-white/5 rounded-3xl flex items-center justify-center relative aspect-square group overflow-hidden cursor-crosshair"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/5 to-purple-500/5 pointer-events-none" />
                
                {isViewing3D ? (
                  <model-viewer
                    src={product.modelo3dUrl}
                    auto-rotate
                    camera-controls
                    shadow-intensity="1"
                    environment-image="neutral"
                    style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                  ></model-viewer>
                ) : activeImage ? (
                  <>
                    <img 
                      src={activeImage} 
                      alt={product.nombre} 
                      className={`w-full h-full object-contain p-8 relative z-10 transition-opacity duration-300 ${isZooming ? 'opacity-0' : 'opacity-100'}`}
                    />
                    {isZooming && (
                      <div 
                        className="absolute inset-0 z-20"
                        style={{
                          backgroundImage: `url(${activeImage})`,
                          backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                          backgroundSize: '250%',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                    )}
                    <ZoomIn className={`absolute top-6 right-6 w-6 h-6 text-surface-500 transition-opacity duration-300 ${isZooming ? 'opacity-0' : 'opacity-100'}`} />
                  </>
                ) : (
                  <Package className="w-32 h-32 text-surface-700 relative z-10" />
                )}
              </div>

              {/* Thumbnails */}
              {(allImages.length > 1 || (has3D && allImages.length > 0)) && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {has3D && (
                    <button 
                      onClick={() => setActiveMediaIndex(0)}
                      className={`w-20 h-20 shrink-0 rounded-xl flex items-center justify-center border-2 transition-all ${activeMediaIndex === 0 ? 'border-brand-500 bg-brand-500/10' : 'border-surface-700 bg-surface-900 hover:border-surface-500'}`}
                    >
                      <Box className="w-8 h-8 text-brand-400" />
                      <span className="absolute bottom-1 text-[10px] font-bold text-brand-400 uppercase">3D View</span>
                    </button>
                  )}
                  {allImages.map((img, idx) => {
                    const actualIndex = has3D ? idx + 1 : idx;
                    return (
                      <button 
                        key={idx}
                        onClick={() => setActiveMediaIndex(actualIndex)}
                        className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all p-2 bg-surface-900 ${activeMediaIndex === actualIndex ? 'border-brand-500 bg-brand-500/10' : 'border-surface-700 hover:border-surface-500'}`}
                      >
                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="inline-flex px-3 py-1 bg-surface-800 border border-white/10 rounded-full text-xs font-semibold tracking-wider text-brand-400 uppercase mb-4 w-fit">
                {product.categoria?.nombre || "Hardware"}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white leading-tight mb-4">
                {product.nombre}
              </h1>
              
              <p className="text-surface-400 leading-relaxed mb-8">
                {product.descripcion || "Un componente esencial de alto rendimiento diseñado para maximizar tu productividad y llevar tu experiencia gaming al siguiente nivel."}
              </p>

              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-end gap-4">
                  <span className="text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-surface-400">
                    S/ {Number(product.precio).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Barra y Alerta de Disponibilidad transaccional (Apple & Nielsen Heuristics) */}
                {isOutOfStock ? (
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-300">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-rose-200">Agotado Temporalmente</h4>
                      <p className="text-xs text-rose-300/80 mt-0.5 leading-relaxed">
                        Este componente se encuentra en proceso de reabastecimiento en nuestro almacén central. Pronto estará disponible con nuevas unidades.
                      </p>
                    </div>
                  </div>
                ) : product.stock <= 5 ? (
                  <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2.5 shadow-lg shadow-amber-500/5">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        ⚡ ¡Atención! Stock crítico en almacén
                      </span>
                      <span>Quedan solo {product.stock} unid.</span>
                    </div>
                    <div className="w-full h-2 bg-surface-900 rounded-full overflow-hidden border border-amber-500/20">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, (product.stock / 5) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-amber-300/80 leading-normal">
                      Alta demanda actual. Te recomendamos asegurar tu orden antes de que se agoten las existencias.
                    </p>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold w-fit">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>En stock ({product.stock} disponibles) · Entrega exprés y garantía directa</span>
                  </div>
                )}
              </div>

              {/* Specifications Preview */}
              {specifications && Object.keys(specifications).length > 0 && (
                <div className="mb-8 p-6 bg-surface-900 border border-surface-800 rounded-2xl">
                  <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-brand-400" />
                    Especificaciones Clave
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {Object.entries(specifications).slice(0, 6).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-xs text-surface-500 uppercase font-medium">{key}</span>
                        <span className="text-sm text-slate-200 font-semibold truncate" title={value}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-8 mt-auto">
                <div className="flex items-center gap-3 p-4 bg-surface-900 border border-white/5 rounded-2xl">
                  <Truck className="w-8 h-8 text-brand-400" />
                  <div>
                    <h4 className="text-slate-200 font-bold text-sm">Envío Seguro</h4>
                    <p className="text-surface-400 text-xs">A todo el Perú</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-surface-900 border border-white/5 rounded-2xl">
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  <div>
                    <h4 className="text-slate-200 font-bold text-sm">Garantía Real</h4>
                    <p className="text-surface-400 text-xs">12 meses directa</p>
                  </div>
                </div>
              </div>

              {/* Selector de Cantidad + Acción Principal */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {!isOutOfStock && (
                  <div className="flex items-center justify-between sm:justify-start bg-surface-900 border border-white/10 rounded-2xl p-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      disabled={qty <= 1}
                      className="w-11 h-11 rounded-xl bg-surface-800 hover:bg-surface-700 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer border-none"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-14 text-center font-display font-bold text-lg text-white">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      disabled={qty >= product.stock}
                      className="w-11 h-11 rounded-xl bg-surface-800 hover:bg-surface-700 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer border-none"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-4 px-8 bg-brand-500 hover:bg-brand-400 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.6)] active:scale-95 cursor-pointer border-none"
                >
                  <ShoppingCart className="w-6 h-6 shrink-0" />
                  <span>{isOutOfStock ? "Agotado Temporalmente" : `Agregar al carrito (${qty})`}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Full Specifications Table */}
          {specifications && Object.keys(specifications).length > 0 && (
            <div className="mb-20 pt-10 border-t border-white/10">
              <h2 className="text-3xl font-display font-bold text-white mb-8">Especificaciones Técnicas</h2>
              <div className="bg-surface-900/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {Object.entries(specifications).map(([key, value], idx) => (
                      <tr key={key} className={`border-b border-white/5 last:border-0 ${idx % 2 === 0 ? 'bg-surface-800/30' : 'bg-transparent'}`}>
                        <th className="py-4 px-8 font-semibold text-surface-300 w-1/3">{key}</th>
                        <td className="py-4 px-8 text-slate-200">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recommended Products */}
          {recommended.length > 0 && (
            <div className="pt-10 border-t border-white/10">
              <h2 className="text-3xl font-display font-bold text-white mb-8">Productos Recomendados</h2>
              <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide">
                {recommended.map(rec => (
                  <div key={rec.id} className="min-w-[280px] sm:min-w-[300px] snap-start">
                    <ProductCard product={rec} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
}
