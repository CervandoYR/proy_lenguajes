import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { 
  User, MapPin, KeyRound, ArrowLeft, ShieldCheck, Phone, 
  Sparkles, Compass, CheckCircle2, AlertCircle, Navigation, 
  Loader2, Save, Cpu, Layers, Boxes, Package, ShoppingBag
} from "lucide-react";
import StoreLayout from "../../../layouts/StoreLayout";
import useAuthStore from "../../auth/authStore";
import OrderHistory from "../../pedidos/pages/OrderHistory";
import { validarPasswordActual, updateUsuario } from "../../usuarios/usuariosService";
import { getDireccionesPorUsuario, crearDireccion, actualizarDireccion } from "../../direcciones/direccionesService";
import InteractiveAddressMap from "../../direcciones/components/InteractiveAddressMap";
import { toast } from "sonner";

export default function AccountSettingsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, setUser } = useAuthStore();
  
  const initialTabFromUrl = searchParams.get("tab") || "datos";
  const [activeTab, setActiveTab] = useState(initialTabFromUrl);
  const [loading, setLoading] = useState(false);

  // Sync tab with URL parameter cleanly
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["inicio", "datos", "direccion", "seguridad"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab }, { replace: true });
  };

  // Personal data state
  const [form, setForm] = useState({
    nombre: user?.nombre || "",
    telefono: user?.telefono || "",
    direccion: user?.direccion || "",
    password: "",
    currentPassword: ""
  });

  // Multi-field structured address state synced with InteractiveAddressMap & DB
  const [addressForm, setAddressForm] = useState({
    id: null,
    alias: "Casa",
    calle: user?.direccion ? user.direccion.split(",")[0].trim() : "",
    ciudad: "Miraflores",
    departamento: "Lima",
    codigoPostal: "15001",
    referencia: "",
    latitud: -12.0464,
    longitud: -77.0428
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        nombre: user.nombre || "",
        telefono: user.telefono || "",
        direccion: user.direccion || ""
      }));
    }
    if (user?.id) {
      getDireccionesPorUsuario(user.id).then((dirs) => {
        if (dirs && dirs.length > 0) {
          const main = dirs.find(d => d.predeterminada) || dirs[0];
          setAddressForm({
            id: main.id,
            alias: main.alias || "Casa",
            calle: main.calle || "",
            ciudad: main.ciudad || "Miraflores",
            departamento: main.departamento || "Lima",
            codigoPostal: main.codigoPostal || "15001",
            referencia: main.referencia || "",
            latitud: main.latitud || -12.0464,
            longitud: main.longitud || -77.0428
          });
        }
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === "seguridad") {
        if (!form.password) {
          toast.error("Debes ingresar una nueva contraseña para actualizar");
          setLoading(false);
          return;
        }
        if (!form.currentPassword) {
          toast.error("Debes ingresar tu contraseña actual para confirmar el cambio");
          setLoading(false);
          return;
        }
        const valid = await validarPasswordActual(user.id, form.currentPassword);
        if (!valid.valid) {
          toast.error("La contraseña actual es incorrecta");
          setLoading(false);
          return;
        }
      }

      if (activeTab === "direccion") {
        if (!addressForm.calle.trim()) {
          toast.error("Por favor ingresa la calle, avenida o número");
          setLoading(false);
          return;
        }

        const direccionPayload = {
          usuario: { id: user.id },
          alias: addressForm.alias,
          calle: addressForm.calle,
          ciudad: addressForm.ciudad,
          departamento: addressForm.departamento,
          codigoPostal: addressForm.codigoPostal,
          referencia: addressForm.referencia,
          latitud: addressForm.latitud,
          longitud: addressForm.longitud,
          predeterminada: true
        };

        if (addressForm.id) {
          await actualizarDireccion(addressForm.id, direccionPayload);
        } else {
          await crearDireccion(direccionPayload);
        }

        const fullDirStr = `${addressForm.calle}, ${addressForm.ciudad} - ${addressForm.departamento}`;
        const userPayload = { ...user, direccion: fullDirStr };
        const updated = await updateUsuario(user.id, userPayload);
        
        setUser(updated);
        toast.success("📍 Dirección y coordenadas en el mapa guardadas exitosamente");
        setLoading(false);
        return;
      }

      // Datos personales o Seguridad tab
      const payload = {
        ...user,
        nombre: form.nombre,
        telefono: form.telefono,
        direccion: form.direccion,
      };
      if (activeTab === "seguridad" && form.password) {
        payload.password = form.password;
      }

      const data = await updateUsuario(user.id, payload);
      setUser(data);
      if (activeTab === "seguridad") {
        setForm(prev => ({ ...prev, password: "", currentPassword: "" }));
        toast.success("🛡️ Contraseña actualizada y protegida con éxito");
      } else {
        toast.success("👤 Datos personales actualizados correctamente");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar la configuración de cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StoreLayout>
      <div className="min-h-screen bg-surface-950/40 pb-20">
        
        {/* Top Header Section with Hexagonal Core Brand Identity */}
        <div className="bg-surface-900/90 border-b border-surface-800/90 sticky top-0 z-40 backdrop-blur-md shadow-lg">
          <div className="max-w-5xl mx-auto px-6 py-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Link 
                  to="/dashboard" 
                  className="w-10 h-10 rounded-2xl bg-surface-800/80 hover:bg-surface-700 border border-surface-700 flex items-center justify-center text-surface-300 hover:text-white transition-all shadow-sm group cursor-pointer"
                  title="Volver a Mi Cuenta"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform text-brand-400" />
                </Link>

                <div className="flex items-center gap-3">
                  {/* Hexagonal ST Core Badge */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500/20 via-surface-900 to-amber-500/20 border border-brand-500/30 p-0.5 flex items-center justify-center shadow-md relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-500/15 to-transparent" />
                    <Cpu className="w-6 h-6 text-brand-400 relative z-10" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 border border-brand-500/25 px-2 py-0.5 rounded-md">
                        Servitek Pro Center
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight mt-0.5">
                      Ajustes de mi Cuenta
                    </h1>
                  </div>
                </div>
              </div>

              <div className="text-xs text-surface-400 flex items-center gap-2 sm:justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sesión autenticada para <strong className="text-slate-200">{user?.email}</strong></span>
              </div>
            </div>

            {/* Apple Pro Segmented Navigation Tabs */}
            <div className="bg-surface-950/90 p-1.5 rounded-2xl border border-surface-800/90 flex gap-1.5 overflow-x-auto no-scrollbar max-w-3xl">
              <button
                type="button"
                onClick={() => handleTabChange("inicio")}
                className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === "inicio"
                    ? "bg-surface-800 text-white shadow-lg shadow-black/30 border border-surface-700 text-emerald-400"
                    : "text-surface-400 hover:text-slate-200 hover:bg-surface-900/60"
                }`}
              >
                <Boxes className={`w-4 h-4 ${activeTab === "inicio" ? "text-emerald-400" : "text-surface-400"}`} />
                <span>Inicio / Pedidos 📦</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("datos")}
                className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === "datos"
                    ? "bg-surface-800 text-white shadow-lg shadow-black/30 border border-surface-700 text-brand-400"
                    : "text-surface-400 hover:text-slate-200 hover:bg-surface-900/60"
                }`}
              >
                <User className={`w-4 h-4 ${activeTab === "datos" ? "text-brand-400" : "text-surface-400"}`} />
                <span>Datos Personales</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("direccion")}
                className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === "direccion"
                    ? "bg-surface-800 text-white shadow-lg shadow-black/30 border border-brand-500/40 text-amber-400"
                    : "text-surface-400 hover:text-slate-200 hover:bg-surface-900/60"
                }`}
              >
                <MapPin className={`w-4 h-4 ${activeTab === "direccion" ? "text-amber-400" : "text-surface-400"}`} />
                <span>Dirección & Envío 📍</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("seguridad")}
                className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === "seguridad"
                    ? "bg-surface-800 text-white shadow-lg shadow-black/30 border border-surface-700 text-amber-400"
                    : "text-surface-400 hover:text-slate-200 hover:bg-surface-900/60"
                }`}
              >
                <KeyRound className={`w-4 h-4 ${activeTab === "seguridad" ? "text-amber-400" : "text-surface-400"}`} />
                <span>Seguridad</span>
              </button>
            </div>

          </div>
        </div>

        {/* Main Content Sections */}
        <div className="max-w-5xl mx-auto px-6 py-8">
          
          {/* TAB 0: INICIO / PEDIDOS */}
          {activeTab === "inicio" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-gradient-to-r from-emerald-500/10 via-surface-900 to-brand-500/10 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 uppercase">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Cuenta Activa
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-[11px] font-bold text-brand-400 uppercase">
                      <Sparkles className="w-3 h-3" />
                      Miembro Servitek Pro
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                    Panel General de Inicio y Seguimiento
                  </h2>
                  <p className="text-xs sm:text-sm text-surface-300">
                    Bienvenido a tu centro unificado. Consulta el estado de tus compras de hardware y navega a tus ajustes espaciales.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    to="/"
                    className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Explorar Equipos</span>
                  </Link>
                </div>
              </div>

              <div className="bg-surface-900/80 border border-surface-800/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-surface-800 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Boxes className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
                        Mis Pedidos & Ensamblajes en Curso
                      </h3>
                      <p className="text-xs text-surface-400">Monitoreo en tiempo real de cada adquisición y control de calidad</p>
                    </div>
                  </div>
                </div>

                <OrderHistory />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* TAB 1: DATOS PERSONALES */}
            {activeTab === "datos" && (
              <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                <div className="bg-surface-900/80 border border-surface-800/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div>
                    <h2 className="text-lg font-display font-bold text-white tracking-tight flex items-center gap-2">
                      <User className="w-5 h-5 text-brand-400" />
                      <span>Información de Identidad y Contacto</span>
                    </h2>
                    <p className="text-xs text-surface-400 mt-1">
                      Estos datos se utilizan en la emisión de boletas, facturas y comunicaciones de ensamblaje.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-2">
                        Nombre Completo del Titular *
                      </label>
                      <div className="group rounded-2xl bg-surface-950 border border-surface-800 p-2 flex items-center focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all duration-300">
                        <div className="w-11 h-11 rounded-xl bg-surface-900 border border-surface-800 flex items-center justify-center text-surface-400 group-focus-within:text-brand-400 group-focus-within:bg-brand-500/10 transition-all shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          required
                          value={form.nombre}
                          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                          className="w-full bg-transparent border-0 px-4 py-1.5 text-base text-slate-100 focus:outline-none placeholder-surface-600"
                          placeholder="Tu nombre y apellidos completos"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-2">
                        Teléfono Móvil o Contacto de Entrega
                      </label>
                      <div className="group rounded-2xl bg-surface-950 border border-surface-800 p-2 flex items-center focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all duration-300">
                        <div className="w-11 h-11 rounded-xl bg-surface-900 border border-surface-800 flex items-center justify-center text-surface-400 group-focus-within:text-brand-400 group-focus-within:bg-brand-500/10 transition-all shrink-0">
                          <Phone className="w-5 h-5" />
                        </div>
                        <input
                          type="tel"
                          value={form.telefono}
                          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                          className="w-full bg-transparent border-0 px-4 py-1.5 text-base text-slate-100 focus:outline-none placeholder-surface-600"
                          placeholder="Ej: 999 888 777"
                        />
                      </div>
                      <p className="text-xs text-surface-400 mt-2 ml-1">
                        Recibirás avisos por SMS o llamada directa antes del despacho de tus componentes y hardware.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-surface-800/80">
                      <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-2">
                        Resumen de Dirección (Solo Lectura)
                      </label>
                      <div className="rounded-2xl bg-surface-950/60 border border-surface-800/60 p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                          <span className="text-sm text-slate-300 font-medium">
                            {user?.direccion || "Sin dirección registrada"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleTabChange("direccion")}
                          className="px-3 py-1.5 rounded-xl bg-surface-800 hover:bg-brand-500/20 text-brand-400 text-xs font-bold transition-all border border-surface-700/80 shrink-0 cursor-pointer"
                        >
                          Ir al Mapa GPS →
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-surface-800/80 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3.5 text-sm sm:text-base font-bold text-slate-950 bg-gradient-to-r from-brand-400 via-brand-500 to-amber-500 hover:from-brand-300 hover:to-amber-400 rounded-2xl transition-all shadow-xl shadow-brand-500/25 active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      <span>Guardar Datos Personales</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DIRECCION & ENVIO A PANTALLA COMPLETA */}
            {activeTab === "direccion" && (
              <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
                
                <div className="bg-gradient-to-r from-brand-500/10 via-surface-900 to-amber-500/10 border border-brand-500/30 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 shrink-0 shadow-inner">
                      <Navigation className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white">
                        Geolocalización y Sincronización Dinámica Servitek Pro
                      </h2>
                      <p className="text-xs sm:text-sm text-surface-300 mt-0.5 leading-relaxed">
                        Mueve el marcador en el mapa o escribe tu calle para fijar tu ubicación exacta de entrega.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 bg-brand-500/15 text-brand-400 border border-brand-500/30 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Precisión GPS Exacta</span>
                  </div>
                </div>

                {/* Full-width Isolated Map Container */}
                <div className="space-y-4">
                  <InteractiveAddressMap
                    initialLat={addressForm.latitud}
                    initialLng={addressForm.longitud}
                    externalStreet={addressForm.calle}
                    externalCity={addressForm.ciudad}
                    externalState={addressForm.departamento}
                    heightClass="h-[450px] sm:h-[520px]"
                    onAddressSelect={(data) => {
                      setAddressForm((prev) => ({
                        ...prev,
                        ...(data.calle && { calle: data.calle }),
                        ...(data.ciudad && { ciudad: data.ciudad }),
                        ...(data.departamento && { departamento: data.departamento }),
                        ...(data.codigoPostal && { codigoPostal: data.codigoPostal }),
                        ...(data.latitud !== undefined && { latitud: data.latitud }),
                        ...(data.longitud !== undefined && { longitud: data.longitud }),
                      }));
                    }}
                  />
                </div>

                {/* Isolated Form Section Below Map */}
                <div className="bg-surface-900/80 border border-surface-800/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div className="border-b border-surface-800 pb-4 flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-base font-display font-bold text-white tracking-tight flex items-center gap-2">
                      <Compass className="w-5 h-5 text-brand-400" />
                      <span>Específicos de Entrega (Tabla Direcciones de Base de Datos)</span>
                    </h3>
                    <span className="text-xs font-mono text-surface-400 bg-surface-950 px-3 py-1 rounded-lg border border-surface-800 flex items-center gap-2">
                      <span>Lat: {addressForm.latitud?.toFixed(5)} | Lng: {addressForm.longitud?.toFixed(5)}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Sincronizado" />
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-2">
                        Alias del Lugar
                      </label>
                      <select
                        value={addressForm.alias}
                        onChange={(e) => setAddressForm({ ...addressForm, alias: e.target.value })}
                        className="w-full bg-surface-950 border border-surface-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-brand-500 transition-all shadow-inner"
                      >
                        <option value="Casa">🏠 Casa / Domicilio</option>
                        <option value="Oficina">🏢 Oficina / Trabajo</option>
                        <option value="Almacén">📦 Almacén / Taller</option>
                        <option value="Otro">📍 Otro Lugar</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider">
                          Calle, Avenida, Jirón y Número *
                        </label>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          ⚡ Sincronizado dinámicamente con Mapa
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        value={addressForm.calle}
                        onChange={(e) => setAddressForm({ ...addressForm, calle: e.target.value })}
                        placeholder="Ej: Av. Javier Prado Este 1234, Dpto 502"
                        className="w-full bg-surface-950 border border-surface-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-brand-500 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-2">
                        Distrito / Ciudad
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.ciudad}
                        onChange={(e) => setAddressForm({ ...addressForm, ciudad: e.target.value })}
                        placeholder="Ej: Miraflores"
                        className="w-full bg-surface-950 border border-surface-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-brand-500 transition-all shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-2">
                        Departamento / Región
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.departamento}
                        onChange={(e) => setAddressForm({ ...addressForm, departamento: e.target.value })}
                        placeholder="Ej: Lima"
                        className="w-full bg-surface-950 border border-surface-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-brand-500 transition-all shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-2">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        value={addressForm.codigoPostal}
                        onChange={(e) => setAddressForm({ ...addressForm, codigoPostal: e.target.value })}
                        placeholder="Ej: 15001"
                        className="w-full bg-surface-950 border border-surface-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-brand-500 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-2">
                      Indicaciones o Referencias Exactas para el Repartidor / Courier
                    </label>
                    <input
                      type="text"
                      value={addressForm.referencia}
                      onChange={(e) => setAddressForm({ ...addressForm, referencia: e.target.value })}
                      placeholder="Ej: Frente al parque central, reja negra, tocar intercomunicador 301"
                      className="w-full bg-surface-950 border border-surface-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-brand-500 transition-all shadow-inner"
                    />
                  </div>

                  <div className="pt-6 border-t border-surface-800/80 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3.5 text-sm sm:text-base font-bold text-slate-950 bg-gradient-to-r from-brand-400 via-brand-500 to-amber-500 hover:from-brand-300 hover:to-amber-400 rounded-2xl transition-all shadow-xl shadow-brand-500/25 active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      <span>Guardar Dirección & Coordenadas GPS</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: SEGURIDAD */}
            {activeTab === "seguridad" && (
              <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                <div className="bg-surface-900/80 border border-surface-800/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                  
                  <div className="bg-surface-950/70 border border-surface-800/90 rounded-2xl p-5 flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100 mb-1">Protección de Criptografía Servitek Pro</h3>
                      <p className="text-xs sm:text-sm text-surface-300 leading-relaxed">
                        Tu contraseña se almacena con cifrado BCrypt de alta seguridad. Para cambiarla, por motivos de protección integral, requerimos validar tu contraseña actual.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-2">
                        Nueva Contraseña Deseada *
                      </label>
                      <div className="group rounded-2xl bg-surface-950 border border-surface-800 p-2 flex items-center focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/10 transition-all duration-300">
                        <div className="w-11 h-11 rounded-xl bg-surface-900 border border-surface-800 flex items-center justify-center text-surface-400 group-focus-within:text-amber-400 group-focus-within:bg-amber-500/10 transition-all shrink-0">
                          <KeyRound className="w-5 h-5" />
                        </div>
                        <input
                          type="password"
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          className="w-full bg-transparent border-0 px-4 py-1.5 text-base text-slate-100 focus:outline-none placeholder-surface-600"
                          placeholder="Mínimo 6 caracteres"
                          minLength="6"
                        />
                      </div>
                    </div>

                    {form.password && (
                      <div className="animate-in fade-in duration-300 pt-2">
                        <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                          Autoriza con tu Contraseña Actual *
                        </label>
                        <div className="group rounded-2xl bg-surface-950 border border-amber-500/40 p-2 flex items-center focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all duration-300">
                          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                            <KeyRound className="w-5 h-5" />
                          </div>
                          <input
                            type="password"
                            required
                            value={form.currentPassword}
                            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                            className="w-full bg-transparent border-0 px-4 py-1.5 text-base text-slate-100 focus:outline-none placeholder-surface-500"
                            placeholder="Introduce tu contraseña actual para verificar"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-surface-800/80 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading || !form.password}
                      className="px-8 py-3.5 text-sm sm:text-base font-bold text-slate-950 bg-gradient-to-r from-brand-400 via-brand-500 to-amber-500 hover:from-brand-300 hover:to-amber-400 rounded-2xl transition-all shadow-xl shadow-brand-500/25 active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                      <span>Actualizar Contraseña de Seguridad</span>
                    </button>
                  </div>

                </div>
              </div>
            )}

          </form>
        </div>

      </div>
    </StoreLayout>
  );
}
