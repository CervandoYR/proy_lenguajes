import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, ArrowLeft, Eye, EyeOff, ShieldCheck, Zap, HeartHandshake, CheckCircle2 } from "lucide-react";
import { register } from "../authService";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", email: "", password: "", telefono: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await register(form);
      toast.success("¡Tu cuenta en Servitek fue creada con éxito!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data || "No pudimos completar tu registro. Verifica los datos ingresados.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-4xl relative z-10 px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-surface-400 hover:text-slate-200 text-sm mb-6 transition-colors no-underline font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la tienda</span>
        </Link>

        <div className="bg-surface-900 border border-surface-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:grid md:grid-cols-12">
          
          {/* Left Panel - Value Proposition & Progressive Disclosure Info */}
          <div className="order-2 md:order-1 md:col-span-5 bg-gradient-to-br from-surface-950/90 to-surface-900 p-8 sm:p-10 border-t md:border-t-0 md:border-r border-surface-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/25 border border-brand-400/30">
                  <span className="font-display font-extrabold text-white text-xl">S</span>
                </div>
                <div>
                  <span className="font-display font-bold text-xl text-slate-100 tracking-tight block">SERVITEK</span>
                  <span className="text-[11px] text-brand-400 font-bold uppercase tracking-wider block">Cuenta de Cliente</span>
                </div>
              </div>

              <h3 className="text-xl font-display font-bold text-white mb-3">
                Crea tu cuenta en segundos
              </h3>
              <p className="text-surface-400 text-sm leading-relaxed mb-8">
                Diseñado para tu comodidad. Te pedimos solo lo esencial para empezar:
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/15 text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Registro Rápido y Sin Fricción</h4>
                    <p className="text-xs text-surface-400 m-0">Sin formularios interminables ni datos innecesarios.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Guarda tu Carrito</h4>
                    <p className="text-xs text-surface-400 m-0">Tus configuraciones e historial siempre disponibles.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Dirección al Pagar o en tu Perfil</h4>
                    <p className="text-xs text-surface-400 m-0">Agrega tus direcciones de envío con calma cuando las necesites.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-surface-800/80 flex items-center gap-2 text-xs text-surface-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Protección y privacidad de tus datos</span>
            </div>
          </div>

          {/* Right Panel - Register Form */}
          <div className="order-1 md:order-2 md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-surface-900">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mb-2">
              Registrar Nueva Cuenta
            </h2>
            <p className="text-surface-400 text-sm mb-6 leading-relaxed">
              Completa estos 4 datos para unirte a Servitek Technologies.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Nombre y Apellido
                </label>
                <input
                  value={form.nombre}
                  onChange={set("nombre")}
                  placeholder="Ej. Carlos Mendoza"
                  required
                  className="w-full bg-surface-950 border border-surface-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="carlos@ejemplo.com"
                  required
                  className="w-full bg-surface-950 border border-surface-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Contraseña Segura (mínimo 6 caracteres)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    placeholder="Crea una contraseña segura"
                    required
                    minLength={6}
                    className="w-full bg-surface-950 border border-surface-800 rounded-xl pl-4 pr-12 py-3 text-slate-100 text-sm focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-slate-200 transition-colors cursor-pointer p-1 border-none bg-transparent flex items-center justify-center"
                    title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Teléfono móvil (opcional para coordinar envíos)
                </label>
                <input
                  value={form.telefono}
                  onChange={set("telefono")}
                  placeholder="Ej. 987 654 321"
                  className="w-full bg-surface-950 border border-surface-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition-all shadow-inner"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-sans font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-500/25 border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] mt-6"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creando tu cuenta...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Crear mi cuenta ahora</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-surface-800 text-center">
              <p className="text-sm text-surface-400 m-0">
                ¿Ya tienes una cuenta en Servitek?{" "}
                <Link
                  to="/login"
                  className="text-brand-400 no-underline font-bold hover:text-brand-300 hover:underline transition-colors ml-1"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}