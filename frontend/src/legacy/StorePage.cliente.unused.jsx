import { useEffect, useState, useMemo } from "react";
import { Search, SlidersHorizontal, X as XIcon } from "lucide-react";
import API from "../../services/api";
import StoreLayout from "../../components/StoreLayout";
import HeroSlider from "../../components/HeroSlider";
import ProductCard from "../../components/ProductCard";

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API}/productos`).then((r) => r.json()),
          fetch(`${API}/categorias`).then((r) => r.json()),
        ]);
        setProducts(prodRes.filter((p) => p.activo));
        setCategories(catRes.filter((c) => c.activo));
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchTerm ||
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.categoria?.id);

      const price = Number(p.precio);
      const matchesPriceMin = !priceMin || price >= Number(priceMin);
      const matchesPriceMax = !priceMax || price <= Number(priceMax);

      return matchesSearch && matchesCategory && matchesPriceMin && matchesPriceMax;
    });
  }, [products, searchTerm, selectedCategories, priceMin, priceMax]);

  function toggleCategory(catId) {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  }

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategories([]);
    setPriceMin("");
    setPriceMax("");
  }

  const hasActiveFilters = searchTerm || selectedCategories.length > 0 || priceMin || priceMax;

  return (
    <StoreLayout>
      <HeroSlider />

      <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-10">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-100 mb-2">
            Nuestros Productos
          </h2>
          <p className="text-surface-400 text-sm">
            Encuentra el equipo perfecto para tus necesidades
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-900 border border-surface-700/50 text-sm text-slate-300 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-brand-500 rounded-full" />
            )}
          </button>

          <aside
            className={`w-full lg:w-64 shrink-0 space-y-6 ${
              filtersOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-surface-900 border border-surface-700/50 rounded-xl p-5 space-y-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 !bg-surface-800 !border-surface-700/50"
                />
              </div>

              <div>
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                  Categorias
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2.5 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="!w-4 !h-4 !p-0 rounded border-surface-600 bg-surface-800 text-brand-500 accent-[var(--color-brand-500)] cursor-pointer"
                      />
                      <span className="text-sm text-surface-400 group-hover:text-slate-300 transition-colors">
                        {cat.nombre}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                  Rango de precio
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="!bg-surface-800 !border-surface-700/50 text-center"
                  />
                  <span className="text-surface-500 text-xs shrink-0">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="!bg-surface-800 !border-surface-700/50 text-center"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs text-surface-400 hover:text-rose-400 bg-surface-800 hover:bg-surface-800/80 border border-surface-700/50 cursor-pointer transition-colors"
                >
                  <XIcon className="w-3 h-3" />
                  Limpiar filtros
                </button>
              )}
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-surface-700 border-t-brand-500 rounded-full animate-spin" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-surface-600 mx-auto mb-4" />
                <p className="text-surface-400 text-sm mb-1">
                  No se encontraron productos
                </p>
                <p className="text-surface-500 text-xs">
                  Intenta ajustar los filtros de busqueda
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-brand-400 text-sm hover:underline cursor-pointer bg-transparent border-none"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-surface-400 text-sm">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "producto" : "productos"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
