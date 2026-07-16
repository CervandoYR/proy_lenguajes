import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound, Mail, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck } from "lucide-react";
import { forgotPassword, resetPassword } from "../authService";
import { toast } from "sonner";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // "email" o "codigo"
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSolicitarCodigo(e) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Ingresa un correo electrónico válido");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email.trim());
      toast.success("Si tu correo está registrado, hemos enviado un código de seguridad de 6 dígitos a tu bandeja.");
      setStep("codigo");
    } catch (err) {
      toast.error(err?.response?.data || "Ocurrió un error al procesar tu solicitud.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRestablecerPassword(e) {
    e.preventDefault();
    if (!codigo || codigo.trim().length < 6) {
      toast.error("Ingresa el código de 6 dígitos que te enviamos por correo");
      return;
    }
    if (nuevaPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (nuevaPassword !== confirmarPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email: email.trim(),
        codigo: codigo.trim(),
        nuevaPassword,
      });
      toast.success("¡Tu contraseña ha sido restablecida correctamente! Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data || "El código es incorrecto o ha expirado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Luces y fondo difuminado estilo Apple */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full mx-auto relative z-10">
        {/* Enlace para volver */}
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-surface-400 hover:text-slate-200 text-sm font-medium transition-colors mb-8 no-underline group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Volver al inicio de sesión</span>
        </Link>

        {/* Tarjeta del formulario */}
        <div className="bg-surface-900 border border-surface-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-6 shadow-inner">
            <KeyRound className="w-7 h-7" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mb-2">
            {step === "email" ? "Restablecer Contraseña" : "Código de Verificación"}
          </h1>

          <p className="text-surface-400 text-sm mb-8 leading-relaxed">
            {step === "email"
              ? "Ingresa el correo asociado a tu cuenta de Servitek y te enviaremos un código numérico de seguridad para autorizar el cambio."
              : `Hemos enviado un código de 6 dígitos a ${email}. Verifícalo en tu bandeja de entrada o en la carpeta de correo no deseado.`}
          </p>

          {step === "email" ? (
            <form onSubmit={handleSolicitarCodigo} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    required
                    className="w-full bg-surface-950 border border-surface-800 rounded-xl px-4 py-3.5 text-slate-100 text-sm focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition-all shadow-inner"
                  />
                  <Mail className="w-5 h-5 text-surface-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-sans font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-500/25 border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Enviando código...</span>
                  </>
                ) : (
                  <span>Enviar código de seguridad →</span>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRestablecerPassword} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 text-center">
                  Código de 6 Dígitos
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  required
                  className="w-full bg-surface-950 border border-surface-800 rounded-xl py-4 text-center font-mono text-2xl font-bold tracking-[0.3em] text-brand-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  placeholder="Repite tu nueva contraseña"
                  required
                  minLength={6}
                  className="w-full bg-surface-950 border border-surface-800 rounded-xl px-4 py-3.5 text-slate-100 text-sm focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition-all shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-sans font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-500/25 border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verificando y guardando...</span>
                  </>
                ) : (
                  <span>Restablecer e ingresar →</span>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-xs text-surface-400 hover:text-slate-200 underline cursor-pointer bg-transparent border-none"
                >
                  ¿No recibiste el código o te equivocaste de correo?
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-surface-800/80 flex items-center justify-between text-xs text-surface-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verificación cifrada 2FA</span>
            </div>
            <span>Servitek Perú</span>
          </div>
        </div>
      </div>
    </div>
  );
}
