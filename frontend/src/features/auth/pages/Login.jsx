import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, ArrowLeft, Eye, EyeOff, ShieldCheck, Truck, Headphones, CheckCircle2 } from "lucide-react";
import useAuthStore from "../authStore";
import { login as loginRequest } from "../authService";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginRequest(form);
      login(data.user, data.token);
      
      toast.success("¡Bienvenido de vuelta a Servitek!");

      if (data.user.rol === "ADMIN") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data || "Revisa tu correo y contraseña. Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-4xl relative z-10 px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-surface-400 hover:text-slate-200 text-sm mb-6 transition-colors no-underline font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la tienda</span>
        </Link>

        <div className="bg-surface-900 border border-surface-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Panel - Value Proposition & Security (Apple Pro Style) */}
          <div className="md:col-span-5 bg-gradient-to-br from-surface-950/90 to-surface-900 p-8 sm:p-10 border-b md:border-b-0 md:border-r border-surface-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/25 border border-brand-400/30">
                  <span className="font-display font-extrabold text-white text-xl">S</span>
                </div>
                <div>
                  <span className="font-display font-bold text-xl text-slate-100 tracking-tight block">SERVITEK</span>
                  <span className="text-[11px] text-brand-400 font-bold uppercase tracking-wider block">Tienda & Soporte Oficial</span>
                </div>
              </div>

              <h3 className="text-xl font-display font-bold text-white mb-3">
                Tu portal de tecnología en Perú
              </h3>
              <p className="text-surface-400 text-sm leading-relaxed mb-8">
                Accede a tu cuenta para gestionar tus pedidos y acceder a beneficios exclusivos:
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/15 text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Seguimiento en Tiempo Real</h4>
                    <p className="text-xs text-surface-400 m-0">Rastrea tus envíos en Lima y provincias al instante.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Garantía Directa</h4>
                    <p className="text-xs text-surface-400 m-0">Descarga tus comprobantes y gestiona garantías fácilmente.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Atención Prioritaria</h4>
                    <p className="text-xs text-surface-400 m-0">Asesoría experta sin esperas innecesarias.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-surface-800/80 flex items-center gap-2 text-xs text-surface-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Conexión cifrada y segura (SSL)</span>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-surface-900">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-surface-400 text-sm mb-8 leading-relaxed">
              Ingresa tu correo y contraseña para acceder a tu panel.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="ejemplo@correo.com"
                  required
                  className="w-full bg-surface-950 border border-surface-800 rounded-xl px-4 py-3.5 text-slate-100 text-sm focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition-all shadow-inner"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Contraseña
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    placeholder="Escribe tu contraseña"
                    required
                    className="w-full bg-surface-950 border border-surface-800 rounded-xl pl-4 pr-12 py-3.5 text-slate-100 text-sm focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition-all shadow-inner"
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

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-sans font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-500/25 border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] mt-4"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verificando datos...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Entrar a mi cuenta</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-surface-800 text-center">
              <p className="text-sm text-surface-400 m-0">
                ¿Aún no tienes una cuenta en Servitek?{" "}
                <Link
                  to="/register"
                  className="text-brand-400 no-underline font-bold hover:text-brand-300 hover:underline transition-colors ml-1"
                >
                  Regístrate gratis aquí
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}