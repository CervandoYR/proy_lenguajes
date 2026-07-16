import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ShoppingBag, User, Pencil, KeyRound, MapPin, Phone, ShieldCheck, Sparkles, CheckCircle2, AlertCircle, X, Zap, PhoneCall, PackageCheck, Boxes, UserCheck, Shield, Navigation, Compass, Settings, ArrowRight } from "lucide-react";
import StoreLayout from "../../../layouts/StoreLayout";
import useAuthStore from "../../auth/authStore";
import OrderHistory from "../../pedidos/pages/OrderHistory";
import { validarPasswordActual, updateUsuario } from "../../usuarios/usuariosService";
import { toast } from "sonner";

function ProfileEditModal({ user, onClose, onSaved, initialTab = "datos" }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab === "direccion" ? "datos" : initialTab);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    nombre: user?.nombre || "",
    telefono: user?.telefono || "",
    direccion: user?.direccion || "",
    password: "",
    currentPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === "seguridad" && form.password) {
        if (!form.currentPassword) {
          toast.error("Debes ingresar tu contraseña actual para cambiarla");
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

      // Datos personales o Seguridad tab
      const payload = {
        ...user,
        nombre: form.nombre,
        telefono: form.telefono,
        direccion: form.direccion,
      };
      if (form.password) {
        payload.password = form.password;
      }

      const data = await updateUsuario(user.id, payload);
      toast.success("Perfil actualizado correctamente");
      onSaved(data);
    } catch (err) {
      toast.error("Error al actualizar los datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-surface-950/85 backdrop-blur-md animate-in fade-in duration-200" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-surface-900/95 border border-surface-700/80 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[92vh] flex flex-col">
        <div className="p-6 pb-4 flex items-center justify-between border-b border-surface-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500/20 to-amber-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
              {activeTab === 'direccion' ? <MapPin className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white tracking-tight">
                Ajustes de mi Cuenta
              </h2>
              <p className="text-xs text-surface-400">Actualiza tus datos, seguridad y ubicación GPS de envío</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-800/80 hover:bg-surface-700 text-surface-400 hover:text-white transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Apple Pro 2-Tab Segmented Control (Atomic Sheet) */}
        <div className="px-6 pt-4 shrink-0">
          <div className="bg-surface-950 p-1.5 rounded-2xl border border-surface-800 flex gap-1.5 overflow-x-auto no-scrollbar">
            <button 
              type="button"
              className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'datos' 
                  ? 'bg-surface-800 text-white shadow-lg shadow-black/20 border border-surface-700/80 text-brand-400' 
                  : 'text-surface-400 hover:text-slate-200 hover:bg-surface-900/50'
              }`}
              onClick={() => setActiveTab('datos')}
            >
              <User className="w-4 h-4 text-brand-400" />
              <span>Datos Personales</span>
            </button>
            <button 
              type="button"
              className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'seguridad' 
                  ? 'bg-surface-800 text-white shadow-lg shadow-black/20 border border-surface-700/80 text-amber-400' 
                  : 'text-surface-400 hover:text-slate-200 hover:bg-surface-900/50'
              }`}
              onClick={() => setActiveTab('seguridad')}
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Seguridad</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {activeTab === "datos" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div>
                  <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-2">Nombre Completo</label>
                  <div className="group rounded-2xl bg-surface-950/80 border border-surface-800 p-1.5 flex items-center focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-surface-900/90 border border-surface-800 flex items-center justify-center text-surface-400 group-focus-within:text-brand-400 group-focus-within:bg-brand-500/10 transition-all shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      required 
                      value={form.nombre} 
                      onChange={e => setForm({...form, nombre: e.target.value})} 
                      className="w-full bg-transparent border-0 px-3.5 py-1 text-sm text-slate-100 focus:outline-none placeholder-surface-600" 
                      placeholder="Tu nombre completo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-2">Teléfono de Contacto</label>
                  <div className="group rounded-2xl bg-surface-950/80 border border-surface-800 p-1.5 flex items-center focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-surface-900/90 border border-surface-800 flex items-center justify-center text-surface-400 group-focus-within:text-brand-400 group-focus-within:bg-brand-500/10 transition-all shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input 
                      type="tel" 
                      value={form.telefono} 
                      onChange={e => setForm({...form, telefono: e.target.value})} 
                      className="w-full bg-transparent border-0 px-3.5 py-1 text-sm text-slate-100 focus:outline-none placeholder-surface-600" 
                      placeholder="Ej: 999 999 999" 
                    />
                  </div>
                  <p className="text-[11px] text-surface-400 mt-1.5 ml-1">Usado exclusivamente para coordinaciones y avisos de entrega rápida.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-2">Resumen de Dirección (Lectura rápida)</label>
                  <div className="group rounded-2xl bg-surface-950/80 border border-surface-800 p-1.5 flex items-start">
                    <div className="w-10 h-10 rounded-xl bg-surface-900/90 border border-surface-800 flex items-center justify-center text-surface-400 shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <textarea 
                      rows="2" 
                      disabled
                      value={user?.direccion || "Sin dirección registrada"} 
                      className="w-full bg-transparent border-0 px-3.5 py-1.5 text-sm text-surface-300 focus:outline-none resize-none leading-relaxed opacity-80" 
                    />
                  </div>
                  <p 
                    className="text-[11px] text-amber-400 font-semibold mt-2 ml-1 flex items-center gap-1 cursor-pointer hover:underline bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl" 
                    onClick={() => {
                      onClose();
                      navigate("/cuenta/ajustes?tab=direccion");
                    }}
                  >
                    <span>👉 Para actualizar con mapa GPS o calle exacta sin conflictos de scroll, entra a "Ajustes a pantalla completa 📍"</span>
                  </p>
                </div>
              </div>
            )}

            {activeTab === "seguridad" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-surface-950/70 border border-surface-800/90 rounded-2xl p-4.5 flex gap-3.5 items-start">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 mb-1">Protección de Cuenta Servitek</h4>
                    <p className="text-xs text-surface-300 leading-relaxed">
                      Tu contraseña actual está protegida de forma segura. Si deseas conservarla intacta, simplemente deja en blanco el campo de nueva contraseña y continúa navegando con tranquilidad.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-2">Nueva Contraseña (Opcional)</label>
                  <div className="group rounded-2xl bg-surface-950/80 border border-surface-800 p-1.5 flex items-center focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-surface-900/90 border border-surface-800 flex items-center justify-center text-surface-400 group-focus-within:text-brand-400 group-focus-within:bg-brand-500/10 transition-all shrink-0">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input 
                      type="password" 
                      value={form.password} 
                      onChange={e => setForm({...form, password: e.target.value})} 
                      className="w-full bg-transparent border-0 px-3.5 py-1 text-sm text-slate-100 focus:outline-none placeholder-surface-600" 
                      placeholder="••••••••" 
                      minLength="6" 
                    />
                  </div>
                </div>

                {form.password && (
                  <div className="animate-in fade-in duration-300 pt-1">
                    <label className="block text-xs font-semibold text-brand-400 uppercase tracking-wider mb-2">Confirma con tu Contraseña Actual</label>
                    <div className="group rounded-2xl bg-surface-950/80 border border-brand-500/40 p-1.5 flex items-center focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input 
                        type="password" 
                        required 
                        value={form.currentPassword} 
                        onChange={e => setForm({...form, currentPassword: e.target.value})} 
                        className="w-full bg-transparent border-0 px-3.5 py-1 text-sm text-slate-100 focus:outline-none placeholder-surface-500" 
                        placeholder="Ingresa tu contraseña actual para autorizar" 
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-surface-800/80 flex justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white bg-surface-800/60 hover:bg-surface-800 rounded-2xl transition-all border border-surface-700/60 cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="px-6 py-3 text-sm font-bold text-slate-950 bg-gradient-to-r from-brand-400 to-brand-500 hover:from-brand-300 hover:to-brand-400 rounded-2xl transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ClienteDashboard() {
  const navigate = useNavigate();
  const { user, setUser, logout: logoutZustand } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState("datos");

  function logout() {
    logoutZustand();
    navigate("/login");
  }

  function openModal(tab = "datos") {
    setModalInitialTab(tab);
    setIsEditModalOpen(true);
  }

  const userInitials = user?.nombre 
    ? user.nombre.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase() 
    : "SV";

  const isDireccionLista = Boolean(user?.direccion && user?.direccion.trim() !== "");
  const isTelefonoListo = Boolean(user?.telefono && user?.telefono.trim() !== "");

  return (
    <StoreLayout>
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        
        {/* Hero Welcome Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-surface-900 via-surface-900/95 to-brand-950/40 border border-surface-800/90 p-6 sm:p-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/3 -mb-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[22px] bg-gradient-to-br from-surface-800 via-surface-900 to-surface-950 border border-surface-700/80 p-1 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/15 via-transparent to-transparent" />
                  <div className="w-full h-full rounded-[18px] bg-surface-900/95 border border-surface-700/60 flex flex-col items-center justify-center relative z-10 p-1.5 text-center">
                    <div className="w-7 h-7 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-1 shadow-inner">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <span className="font-display font-extrabold text-[11px] sm:text-xs text-slate-100 tracking-wider truncate max-w-full px-1">
                      {user?.nombre?.split(" ")[0] || "Cliente"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-[11px] font-bold text-brand-400 tracking-wide uppercase">
                    <Sparkles className="w-3 h-3" />
                    Miembro Servitek Pro
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-bold text-emerald-400 tracking-wide uppercase">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Activo
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  Hola, {user?.nombre || "Cliente"}
                </h1>
                <p className="text-surface-300 text-sm sm:text-base">
                  Tu centro de control para pedidos, ensamblajes y gestión personal.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-stretch md:self-auto">
              <button 
                type="button"
                onClick={logout} 
                className="w-full md:w-auto px-5 py-3 rounded-2xl bg-surface-800/80 hover:bg-surface-800 border border-surface-700/80 hover:border-surface-600 text-slate-300 hover:text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-surface-400" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Left Column: Mis Pedidos (2 Spans) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-surface-900/60 border border-surface-800/90 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6 border-b border-surface-800/80 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shadow-sm">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-white tracking-tight">Mis Pedidos</h2>
                    <p className="text-xs text-surface-400">Historial y seguimiento de tus adquisiciones</p>
                  </div>
                </div>
              </div>
              
              <OrderHistory />
            </div>
          </div>

          {/* Right Column: Datos de la Cuenta (1 Span) */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-surface-900/60 border border-surface-800/90 rounded-3xl p-6 shadow-xl space-y-5">
              
              <div className="flex items-center justify-between border-b border-surface-800/80 pb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <User className="w-5 h-5 text-brand-400" />
                  <h3 className="font-display font-bold text-base text-white tracking-tight">Datos de la Cuenta</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/cuenta/ajustes?tab=datos")}
                    className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors cursor-pointer"
                    title="Abrir configuración de cuenta a pantalla completa"
                  >
                    Ajustes de mi cuenta →
                  </button>
                  <button 
                    type="button"
                    onClick={() => openModal("datos")}
                    className="px-3 py-1.5 rounded-xl bg-surface-800 hover:bg-brand-500/15 text-surface-300 hover:text-brand-400 text-xs font-semibold transition-all border border-surface-700/60 hover:border-brand-500/30 flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer shrink-0"
                    title="Editar Perfil"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>
                </div>
              </div>

              {/* Identity Card */}
              <div className="bg-surface-950/80 border border-surface-800/80 rounded-2xl p-4 space-y-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-surface-400 block mb-0.5">Titular de la cuenta</span>
                  <span className="text-slate-100 font-semibold text-sm sm:text-base block truncate">{user?.nombre || "Sin nombre"}</span>
                </div>
                <div className="pt-2 border-t border-surface-800/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-surface-400 block mb-0.5">Correo Electrónico</span>
                  <span className="text-brand-400 font-medium text-xs sm:text-sm block truncate">{user?.email || "Sin email"}</span>
                </div>
              </div>

              {/* Logistics Section Header */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-surface-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Logística y Contacto</span>
                </h4>

                {/* Telefono Module */}
                {isTelefonoListo ? (
                  <div className="bg-surface-950/80 border border-surface-800/80 rounded-2xl p-4 flex items-start justify-between gap-3 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-surface-400">Teléfono registrado</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <p className="text-slate-200 font-medium text-sm">{user?.telefono}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => openModal("datos")}
                      className="text-surface-400 hover:text-brand-400 p-1.5 rounded-lg hover:bg-surface-900 transition-colors cursor-pointer"
                      title="Modificar teléfono"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => openModal("datos")}
                    className="group bg-amber-500/5 border border-amber-500/25 hover:border-amber-500/50 rounded-2xl p-4 cursor-pointer transition-all duration-300 space-y-3 shadow-sm hover:shadow-amber-500/5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 items-start">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Teléfono pendiente</span>
                      </span>
                      <span className="text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                        Recomendado
                      </span>
                    </div>
                    <p className="text-xs text-surface-300 leading-relaxed">Añade tu número para coordinar entregas y avisos de transporte en tiempo real.</p>
                    <div className="pt-1 flex items-center justify-between gap-2 border-t border-amber-500/15">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-400 font-bold text-xs group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-sm">
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>+ Añadir Teléfono</span>
                      </span>
                      <span className="text-[11px] text-surface-400 font-medium">Avisos SMS/Call</span>
                    </div>
                  </div>
                )}

                {/* Direccion Module */}
                {isDireccionLista ? (
                  <div className="bg-surface-950/80 border border-surface-800/80 rounded-2xl p-4 flex items-start justify-between gap-3 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-surface-400">Dirección principal GPS</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <p className="text-slate-200 font-medium text-sm leading-relaxed">{user?.direccion}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => navigate("/cuenta/ajustes?tab=direccion")}
                      className="text-surface-400 hover:text-brand-400 p-1.5 rounded-lg hover:bg-surface-900 transition-colors shrink-0 cursor-pointer"
                      title="Modificar dirección y mapa GPS a pantalla completa"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => navigate("/cuenta/ajustes?tab=direccion")}
                    className="group bg-brand-500/5 border border-brand-500/30 hover:border-brand-500/50 rounded-2xl p-4 cursor-pointer transition-all duration-300 space-y-3 shadow-sm hover:shadow-brand-500/5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 items-start">
                      <span className="text-xs font-bold text-brand-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Dirección no registrada</span>
                      </span>
                      <span className="text-[10px] font-bold bg-brand-500/15 text-brand-400 border border-brand-500/30 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                        Vital para envío
                      </span>
                    </div>
                    <p className="text-xs text-surface-300 leading-relaxed">Completa tu dirección en el mapa GPS para que tus futuros checkouts sean automáticos.</p>
                    <div className="pt-1 flex items-center justify-between gap-2 border-t border-brand-500/15">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/15 text-brand-400 font-bold text-xs group-hover:bg-brand-500 group-hover:text-slate-950 transition-all shadow-sm">
                        <Zap className="w-3.5 h-3.5" />
                        <span>+ Añadir Dirección 📍</span>
                      </span>
                      <span className="text-[11px] text-surface-400 font-medium">Mapa & Checkout</span>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>

        </div>

      </div>

      {isEditModalOpen && (
        <ProfileEditModal 
          user={user} 
          initialTab={modalInitialTab}
          onClose={() => setIsEditModalOpen(false)} 
          onSaved={(updatedUser) => {
            setUser(updatedUser);
            setIsEditModalOpen(false);
          }} 
        />
      )}
    </StoreLayout>
  );
}