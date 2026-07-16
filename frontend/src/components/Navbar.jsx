import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LogOut, Search, ChevronDown, LayoutGrid, Cpu, UserCheck, Boxes, Settings, ShieldCheck, Headphones } from "lucide-react";
import { useCart } from "../features/carrito/CartContext";
import useAuthStore from "../features/auth/authStore";
import { getCategorias } from "../features/categorias/categoriasService";
import { getProductos } from "../features/productos/productosService";

export default function Navbar({ onCartToggle }) {
  const { cartCount } = useCart();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  
  // Categories State
  const [categorias, setCategorias] = useState([]);
  const [isCatMenuOpen, setIsCatMenuOpen] = useState(false);
  const catMenuRef = useRef(null);

  // User Dropdown State
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (catMenuRef.current && !catMenuRef.current.contains(event.target)) {
        setIsCatMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setIsCatMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    // Fetch categories for the dropdown
    getCategorias()
      .then((data) => setCategorias(data.filter(c => c.activo)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const delay = setTimeout(async () => {
        try {
          const data = await getProductos();
          const query = searchQuery.toLowerCase().trim();
          const results = data.filter(p => {
            const matchNombre = p.nombre && p.nombre.toLowerCase().includes(query);
            const matchCat = p.categoria?.nombre && p.categoria.nombre.toLowerCase().includes(query);
            const matchDesc = p.descripcion && p.descripcion.toLowerCase().includes(query);
            const matchMarca = p.marca && p.marca.toLowerCase().includes(query);
            return matchNombre || matchCat || matchDesc || matchMarca;
          }).slice(0, 6);
          setSearchResults(results);
          setIsSearchOpen(true);
        } catch (e) {
          console.error(e);
        }
      }, 200);
      return () => clearTimeout(delay);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  const getSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  return (
    <nav className="sticky top-0 z-50 bg-surface-950/85 backdrop-blur-2xl border-b border-surface-800 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-6">
          <Link to="/" className="flex items-center gap-3 no-underline shrink-0 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-400 to-amber-500 p-0.5 shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-all shrink-0">
              <div className="w-full h-full bg-surface-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-transparent" />
                <div className="relative flex items-center gap-0.5">
                  <Cpu className="w-4 h-4 text-brand-400" />
                  <span className="font-display font-black text-base tracking-tighter text-white">ST</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-display font-bold text-lg text-slate-100 tracking-tight leading-none group-hover:text-brand-400 transition-colors">
                SERVITEK
              </span>
              <span className="text-[10px] text-surface-400 font-sans tracking-wide">
                Especialistas en Hardware
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-7 shrink-0">
            <Link 
              to="/" 
              onClick={(e) => {
                if (location.pathname === "/") {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="text-sm font-semibold text-slate-300 hover:text-brand-400 transition-colors no-underline"
            >
              Inicio
            </Link>

            <div className="relative" ref={catMenuRef}>
              <button 
                onClick={() => setIsCatMenuOpen(!isCatMenuOpen)}
                className={`text-sm font-semibold transition-all flex items-center gap-1.5 focus:outline-none cursor-pointer select-none ${isCatMenuOpen ? 'text-brand-400' : 'text-slate-300 hover:text-brand-400'}`}
              >
                Productos
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCatMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCatMenuOpen && (
                <div className="absolute top-full left-0 mt-5 w-72 bg-surface-900 border border-surface-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 p-2.5">
                  <div className="px-3.5 py-2 text-xs font-bold text-surface-400 uppercase tracking-wider mb-1">
                    Explora por Categoría
                  </div>
                  <ul className="flex flex-col gap-1 list-none p-0 m-0">
                    <li>
                      <Link
                        to="/?categoria="
                        onClick={() => setIsCatMenuOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-slate-200 hover:bg-brand-500/15 hover:text-brand-400 transition-all no-underline"
                      >
                        <LayoutGrid className="w-4 h-4 text-brand-400 shrink-0" />
                        <span>Todo el Catálogo Disponible</span>
                      </Link>
                    </li>
                    {categorias.map(c => (
                      <li key={c.id}>
                        <Link
                          to={`/?categoria=${c.slug || c.id}`}
                          onClick={() => setIsCatMenuOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-slate-200 hover:bg-surface-800 hover:text-brand-300 transition-all no-underline"
                        >
                          <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div>
                          <span>{c.nombre}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Link to="/quienes-somos" className="text-sm font-semibold text-slate-300 hover:text-brand-400 transition-colors no-underline">
              Confianza & Respaldo
            </Link>
            <Link to="/soporte" className="text-sm font-semibold text-slate-300 hover:text-brand-400 transition-colors no-underline">
              Ayuda & Soporte
            </Link>
          </div>          {/* Search Bar (Spotlight-inspired UX & Apple HIG / Nielsen) */}
          <div className="flex-1 max-w-md relative group/search" ref={searchRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-surface-400 group-focus-within/search:text-brand-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="¿Qué buscas? (ej. HP Laptop, monitor 240Hz...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if(searchQuery.trim().length > 0) setIsSearchOpen(true); }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setIsSearchOpen(false);
                  } else if (e.key === "Enter" && searchResults.length > 0) {
                    navigate(`/producto/${searchResults[0].id}/${getSlug(searchResults[0].nombre)}`);
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }
                }}
                className="block w-full pl-10 pr-4 py-2.5 border border-surface-700/80 rounded-xl leading-5 bg-surface-900/95 text-slate-100 placeholder-surface-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition-all text-sm shadow-inner"
              />
            </div>

            {/* Dropdown Results (Ancho independiente sm:w-[500px] md:w-[540px] para evitar que se apriete o recorte el título) */}
            {isSearchOpen && (
              <div className="absolute mt-2.5 left-0 sm:-left-6 md:-left-12 w-[calc(100vw-2rem)] sm:w-[500px] md:w-[540px] max-w-[92vw] bg-surface-900/95 backdrop-blur-2xl border border-surface-700/90 rounded-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 p-2">
                <div className="px-3.5 py-2 border-b border-surface-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-surface-400 uppercase tracking-wider">
                    Resultados instantáneos
                  </span>
                  <span className="text-[10px] font-mono text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2.5 py-0.5 rounded-full font-bold">
                    {searchResults.length} {searchResults.length === 1 ? "coincidencia" : "coincidencias"}
                  </span>
                </div>

                {searchResults.length > 0 ? (
                  <ul className="max-h-[380px] overflow-y-auto py-1.5 list-none p-0 m-0 divide-y divide-surface-800/60">
                    {searchResults.map((p) => (
                      <li key={p.id}>
                        <Link
                          to={`/producto/${p.id}/${getSlug(p.nombre)}`}
                          onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                          className="flex items-center gap-4 px-3.5 py-3 hover:bg-surface-800/90 rounded-xl transition-all group no-underline"
                        >
                          <div className="w-13 h-13 sm:w-14 sm:h-14 bg-surface-950 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-surface-700/80 p-1.5 shadow-sm group-hover:border-brand-500/50 transition-colors">
                            {p.imagenUrl ? (
                              <img src={p.imagenUrl} alt={p.nombre} className="w-full h-full object-contain" />
                            ) : (
                              <Search className="w-5 h-5 text-surface-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pr-2">
                            <span className="inline-block text-[10px] font-mono font-bold text-brand-400/90 uppercase tracking-wider mb-0.5">
                              {p.categoria?.nombre || "Hardware"}
                            </span>
                            <h4 className="text-xs sm:text-sm font-display font-bold text-slate-100 line-clamp-2 leading-snug group-hover:text-brand-300 transition-colors m-0">
                              {p.nombre}
                            </h4>
                            <span className="text-[11px] font-mono text-emerald-400/90 flex items-center gap-1.5 mt-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Envío inmediato
                            </span>
                          </div>
                          <div className="shrink-0 text-right">
                            <span className="block text-xs sm:text-sm font-display font-black text-slate-100 bg-surface-950 border border-surface-700/80 px-3 py-1.5 rounded-xl shadow-inner group-hover:border-brand-500/40 group-hover:bg-brand-500/10 group-hover:text-brand-300 transition-all font-mono">
                              S/ {Number(p.precio).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[9px] font-mono text-surface-500 block mt-1">IGV Incl.</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-5 py-10 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center mx-auto text-surface-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <p className="text-surface-300 text-sm font-medium m-0">
                      No encontramos coincidencias para <span className="text-brand-400 font-bold">"{searchQuery}"</span>
                    </p>
                    <p className="text-surface-500 text-xs m-0">
                      Prueba buscando por marca (ej. HP, ASUS, NVIDIA) o categoría (Laptop, Monitor).
                    </p>
                  </div>
                )}

                <div className="px-3.5 py-2.5 border-t border-surface-800/80 bg-surface-950/60 rounded-b-xl flex items-center justify-between text-[11px] font-mono text-surface-400">
                  <span>💡 Tip: <kbd className="px-1.5 py-0.5 rounded bg-surface-800 border border-surface-700 text-slate-300 font-bold text-[10px]">Enter</kbd> abrir 1º resultado</span>
                  <span><kbd className="px-1.5 py-0.5 rounded bg-surface-800 border border-surface-700 text-slate-300 font-bold text-[10px]">Esc</kbd> cerrar</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3.5 shrink-0">
            <button
              id="cart-toggle"
              onClick={onCartToggle}
              className="relative px-3.5 py-2.5 rounded-xl bg-surface-800 hover:bg-surface-700 border border-surface-700 transition-all cursor-pointer active:scale-95 flex items-center gap-2"
              title="Ver tu carrito de compras"
            >
              <ShoppingCart className="w-5 h-5 text-slate-200" />
              <span className="hidden sm:inline text-xs font-bold text-slate-200">Carrito</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-brand-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="hidden md:block relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/40 active:scale-95 group ${
                    isUserMenuOpen
                      ? "bg-surface-800 border-brand-500/60 text-white shadow-lg shadow-black/20"
                      : "bg-surface-800/90 hover:bg-surface-800 border-surface-700/80 hover:border-brand-500/40 text-slate-200"
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0 group-hover:bg-brand-500/25 transition-colors">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-semibold group-hover:text-white transition-colors">{user.nombre?.split(" ")[0]}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-surface-400 transition-transform duration-300 ${isUserMenuOpen ? "rotate-180 text-brand-400" : ""}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-3 w-64 bg-surface-900/95 backdrop-blur-2xl border border-surface-700/90 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 p-2">
                    <div className="px-3 py-2.5 border-b border-surface-800/80 mb-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-surface-400 m-0">Mi Cuenta Servitek</p>
                      <p className="text-xs font-semibold text-slate-200 truncate m-0 mt-0.5">{user.email}</p>
                    </div>

                    <ul className="flex flex-col gap-1 list-none p-0 m-0">
                      <li>
                        <Link
                          to={user.rol === "ADMIN" ? "/admin" : "/dashboard"}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-brand-500/15 hover:text-brand-400 focus:outline-none focus:bg-brand-500/15 focus:text-brand-400 transition-all no-underline"
                        >
                          <User className="w-4 h-4 text-brand-400 shrink-0" />
                          <span>Mi Cuenta</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={user.rol === "ADMIN" ? "/admin" : "/cuenta/ajustes?tab=inicio"}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-emerald-500/15 hover:text-emerald-400 focus:outline-none focus:bg-emerald-500/15 focus:text-emerald-400 transition-all no-underline"
                        >
                          <Boxes className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Mis Pedidos</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/cuenta/ajustes?tab=datos"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-amber-500/15 hover:text-amber-400 focus:outline-none focus:bg-amber-500/15 focus:text-amber-400 transition-all no-underline"
                        >
                          <Settings className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Ajustes de mi Cuenta</span>
                        </Link>
                      </li>
                    </ul>

                    <div className="pt-1 mt-1 border-t border-surface-800/80">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/15 focus:outline-none focus:bg-rose-500/15 transition-all cursor-pointer bg-transparent border-none text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold transition-all no-underline active:scale-95 shadow-md shadow-brand-500/20"
              >
                <User className="w-4 h-4" />
                Ingresar
              </Link>
            )}

            <button
              className="md:hidden p-2.5 rounded-xl bg-surface-800 hover:bg-surface-700 border border-surface-700 cursor-pointer active:scale-95 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menú de navegación"
            >
              {mobileOpen ? (
                <X className="w-6 h-6 text-brand-400" />
              ) : (
                <Menu className="w-6 h-6 text-slate-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Flotante (Apple Glassmorphism - No empuja la página hacia abajo) */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full border-b border-surface-700 bg-surface-900/95 backdrop-blur-2xl shadow-2xl max-h-[85vh] overflow-y-auto px-5 py-6 space-y-5 z-50 animate-in slide-in-from-top-3 duration-200">
          <div className="space-y-1">
            <Link
              to="/"
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:text-brand-400 hover:bg-surface-800 transition-all no-underline"
              onClick={() => setMobileOpen(false)}
            >
              <span>Inicio</span>
            </Link>
            <Link
              to="/?categoria="
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:text-brand-400 hover:bg-surface-800 transition-all no-underline"
              onClick={() => setMobileOpen(false)}
            >
              <span>Catálogo Completo</span>
            </Link>
            <Link
              to="/soporte"
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:text-brand-400 hover:bg-surface-800 transition-all no-underline"
              onClick={() => setMobileOpen(false)}
            >
              <span>Soporte & Asesoría VIP</span>
            </Link>
          </div>

          <div className="space-y-2 pt-3 border-t border-surface-800">
            <div className="px-4 text-[11px] font-bold text-surface-400 uppercase tracking-wider">
              Categorías Rápidas
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Monitores", slug: "monitores" },
                { name: "Laptops", slug: "laptops" },
                { name: "Componentes", slug: "componentes" },
                { name: "Almacenamiento", slug: "almacenamiento" },
                { name: "Periféricos", slug: "perifericos" },
                { name: "Redes", slug: "redes" }
              ].map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/?categoria=${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-xl bg-surface-800/80 hover:bg-brand-500/20 hover:text-brand-300 text-xs font-medium text-slate-300 text-center transition-all no-underline truncate border border-surface-700/50"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-surface-800 space-y-1">
            <div className="px-4 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Servitek Oficial
            </div>
            <Link
              to="/quienes-somos"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:text-brand-400 hover:bg-surface-800 transition-all no-underline"
            >
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>Confianza & Respaldo</span>
            </Link>
            <Link
              to="/soporte"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:text-brand-400 hover:bg-surface-800 transition-all no-underline"
            >
              <Headphones className="w-4 h-4 text-brand-400" />
              <span>Ayuda & Soporte Técnico</span>
            </Link>
          </div>

          {user ? (
            <div className="space-y-2 pt-4 border-t border-surface-800">
              <div className="px-4 py-1 text-[11px] font-bold text-brand-400 uppercase tracking-wider">
                Sesión: {user.nombre?.split(" ")[0]} ({user.rol})
              </div>
              <div className="space-y-1">
                <Link
                  to={user.rol === "ADMIN" ? "/admin" : "/dashboard"}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:text-brand-400 hover:bg-surface-800 transition-all no-underline"
                  onClick={() => setMobileOpen(false)}
                >
                  <User className="w-4 h-4 text-brand-400" />
                  <span>Mi Panel de Cuenta</span>
                </Link>
                <Link
                  to={user.rol === "ADMIN" ? "/admin" : "/cuenta/ajustes?tab=inicio"}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:text-emerald-400 hover:bg-surface-800 transition-all no-underline"
                  onClick={() => setMobileOpen(false)}
                >
                  <Boxes className="w-4 h-4 text-emerald-400" />
                  <span>Mis Pedidos</span>
                </Link>
                <Link
                  to="/cuenta/ajustes?tab=datos"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:text-amber-400 hover:bg-surface-800 transition-all no-underline"
                  onClick={() => setMobileOpen(false)}
                >
                  <Settings className="w-4 h-4 text-amber-400" />
                  <span>Ajustes de mi Cuenta</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/15 transition-all cursor-pointer bg-transparent border-none text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-surface-800">
              <Link
                to="/login"
                className="w-full py-3.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30 no-underline active:scale-95"
                onClick={() => setMobileOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>Ingresar / Crear Cuenta</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
