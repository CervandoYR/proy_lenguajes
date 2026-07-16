import { useState, useEffect } from "react";
import { useLocation, Link, useSearchParams } from "react-router-dom";
import StoreLayout from "../../../layouts/StoreLayout";
import HeroCarousel from "../components/HeroCarousel";
import BrandSlider from "../components/BrandSlider";
import FeaturedCarousel from "../components/FeaturedCarousel";
import CategoryBento from "../components/CategoryBento";
import ProductCard from "../../productos/components/ProductCard";
import CategoryCarousel from "../components/CategoryCarousel";
import { Search, ShoppingCart, Star, Filter, ShieldCheck, Truck, Clock } from "lucide-react";
import { getProductos } from "../../productos/productosService";
import { getCategorias } from "../../categorias/categoriasService";
import { useCart } from "../../carrito/CartContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function StorePage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [catSeleccionada, setCatSeleccionada] = useState("");
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  const [showDropdown, setShowDropdown] = useState(false);

  const location = useLocation();

  useEffect(() => {
    cargarDatos();
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaQuery = searchParams.get("categoria");

  useEffect(() => {
    if (categoriaQuery !== null) {
      setCatSeleccionada(categoriaQuery);
      setTimeout(() => {
        const el = document.getElementById("catalogo");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      setCatSeleccionada("");
    }
  }, [categoriaQuery]);

  useEffect(() => {
    if (location.hash === "#catalogo") {
      const el = document.getElementById("catalogo");
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location, loading]);

  async function cargarDatos() {
    setLoading(true);
    try {
      const [productosData, categoriasData] = await Promise.all([
        getProductos(),
        getCategorias(),
      ]);
      setProductos(productosData.filter(p => p.activo));
      setCategorias(categoriasData.filter(c => c.activo));
    } catch (err) {
      toast.error("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  }

  const productosFiltrados = productos.filter((p) => {
    const matchCat = catSeleccionada 
      ? (p.categoria?.slug === catSeleccionada || String(p.categoria?.id) === String(catSeleccionada))
      : true;
    const matchSearch = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchSearch;
  });

  const searchResults = busqueda.length > 0 
    ? productosFiltrados.slice(0, 4) 
    : [];

  const navigate = useNavigate();

  const handleAdd = (producto) => {
    addToCart(producto);
    toast.success(`${producto.nombre} agregado al carrito`, {
      action: {
        label: "Ver carrito →",
        onClick: () => navigate("/carrito"),
      },
      duration: 4000,
    });
  };

  return (
    <StoreLayout>
      <HeroCarousel />

      {/* Nielsen Trust & Humanized Benefits Bar */}
      <div className="bg-surface-900/90 py-12 border-b border-surface-800 shadow-md">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-surface-950 border border-surface-800/80 hover:border-brand-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-brand-500/15 text-brand-400 flex items-center justify-center shrink-0 border border-brand-500/20">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-100 font-sans font-bold text-base mb-1">Envío Seguro a tu Puerta</h4>
                <p className="text-surface-400 text-xs leading-relaxed m-0">Embalaje reforzado y envíos puntuales y rastreables en Lima y todo el Perú.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-surface-950 border border-surface-800/80 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-100 font-sans font-bold text-base mb-1">Garantía Oficial y Cambio Directo</h4>
                <p className="text-surface-400 text-xs leading-relaxed m-0">Equipos 100% nuevos, originales y respaldados por nuestra garantía en Perú.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-surface-950 border border-surface-800/80 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-100 font-sans font-bold text-base mb-1">Asesoría Humana por WhatsApp</h4>
                <p className="text-surface-400 text-xs leading-relaxed m-0">Te ayudamos a elegir tu equipo sin enredos ni palabras complicadas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BrandSlider />
      
      {productos.length > 0 && <FeaturedCarousel products={productos} />}
      
      <CategoryBento />

      {/* Catalogo Principal */}
      <div id="catalogo" className="py-24 bg-surface-950 border-t border-surface-800">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                Catálogo de Productos
              </h2>
              <p className="text-surface-400 mt-2 text-sm sm:text-base max-w-xl">
                Encuentra y compara fácilmente el equipo o componente ideal para tu profesión, estudio o entretenimiento.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3.5 w-full md:w-auto relative">
              <div 
                className="relative flex-1 md:w-80"
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Buscar (ej. Laptop arquitectura, monitor 240Hz...)"
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    setShowDropdown(true);
                  }}
                  className="w-full bg-surface-900 border border-surface-700 text-slate-100 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition-all shadow-inner"
                />

                {/* Dropdown Predictivo */}
                {showDropdown && busqueda.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-surface-900 border border-surface-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {searchResults.length > 0 ? (
                      searchResults.map((p) => (
                        <div 
                          key={p.id} 
                          className="flex items-center gap-3.5 p-3.5 hover:bg-surface-800 cursor-pointer transition-all border-b border-surface-800/60 last:border-0"
                          onClick={() => {
                            setBusqueda(p.nombre);
                            setShowDropdown(false);
                          }}
                        >
                          <div className="w-11 h-11 bg-surface-950 rounded-xl p-1.5 shrink-0 flex items-center justify-center border border-surface-800">
                            {p.imagenUrl ? (
                              <img src={p.imagenUrl} alt={p.nombre} className="w-full h-full object-contain" />
                            ) : (
                              <div className="text-[9px] font-bold text-surface-500">STK</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-200 truncate m-0">{p.nombre}</p>
                            <p className="text-xs font-semibold text-brand-400 m-0 mt-0.5">S/ {Number(p.precio).toLocaleString("es-PE", { minimumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-5 text-center text-sm text-surface-400">
                        No encontramos resultados para <span className="text-slate-200 font-semibold">"{busqueda}"</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
                <select
                  value={catSeleccionada}
                  onChange={(e) => {
                    setCatSeleccionada(e.target.value);
                    if (e.target.value) {
                      setSearchParams({ categoria: e.target.value });
                    } else {
                      setSearchParams({});
                    }
                  }}
                  className="w-full sm:w-56 bg-surface-900 border border-surface-700 text-slate-100 rounded-xl pl-11 pr-8 py-3 text-sm appearance-none focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition-all cursor-pointer shadow-inner font-semibold"
                >
                  <option value="">Todas las Categorías</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.slug || c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-surface-900 border border-surface-800 rounded-2xl p-5 animate-pulse">
                  <div className="w-full aspect-[4/3] bg-surface-800 rounded-xl mb-4" />
                  <div className="h-4 bg-surface-800 rounded w-1/3 mb-2" />
                  <div className="h-5 bg-surface-800 rounded w-full mb-4" />
                  <div className="h-8 bg-surface-800 rounded w-1/2 mt-auto" />
                </div>
              ))}
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="text-center py-20 bg-surface-900 rounded-3xl border border-surface-800 max-w-lg mx-auto">
              <Search className="w-14 h-14 text-surface-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-slate-200 mb-1">No encontramos productos</h3>
              <p className="text-surface-400 text-sm">Intenta ajustar tu búsqueda o seleccionar otra categoría en el menú superior.</p>
            </div>
          ) : (busqueda || catSeleccionada) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productosFiltrados.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {categorias.map(cat => {
                const prods = productosFiltrados.filter(p => p.categoria?.id === cat.id);
                if (prods.length === 0) return null;
                return <CategoryCarousel key={cat.id} category={cat} products={prods} />;
              })}
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
}
