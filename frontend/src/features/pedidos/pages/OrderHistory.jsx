import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Package, CheckCircle2, Clock, Truck, Home, Sparkles, ArrowRight, Cpu, Boxes, ShieldCheck } from "lucide-react";
import { useMisPedidos } from "../usePedidos";

const ESTADOS_ORDEN = ["PENDIENTE", "PAGADO", "EN_PROCESO", "ENVIADO", "ENTREGADO"];

const ESTADOS_INFO = {
  PENDIENTE: {
    label: "Orden Recibida",
    desc: "Confirmando inventario de componentes y verificación bancaria del pago.",
    icon: Clock,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30"
  },
  PAGADO: {
    label: "Pago Confirmado",
    desc: "Tu pago fue verificado. Asignando técnicos y separando piezas en almacén.",
    icon: CheckCircle2,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30"
  },
  EN_PROCESO: {
    label: "Ensamblaje & Test",
    desc: "Técnicos especialistas están ensamblando tu equipo y realizando pruebas de estrés (benchmarking).",
    icon: Cpu,
    color: "text-brand-400 bg-brand-500/10 border-brand-500/30"
  },
  ENVIADO: {
    label: "En Camino",
    desc: "Equipo empaquetado con protección anti-impacto. En ruta con courier hacia tu domicilio.",
    icon: Truck,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/30"
  },
  ENTREGADO: {
    label: "Entregado con Éxito",
    desc: "¡Tu equipo Servitek ha sido entregado en tu puerta! Disfruta del máximo rendimiento.",
    icon: Home,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
  }
};

export default function OrderHistory() {
  const { pedidos, loading, error } = useMisPedidos();

  useEffect(() => {
    if (error) toast.error("Error al cargar el historial de pedidos");
  }, [error]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-surface-800 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-surface-900/90 to-surface-950 border border-surface-800/80 p-8 sm:p-12 text-center shadow-xl animate-in fade-in duration-500">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-brand-500/20 via-surface-800 to-amber-500/20 border border-brand-500/30 flex items-center justify-center shadow-lg shadow-brand-500/10 text-brand-400 relative group">
            <Boxes className="w-9 h-9 text-brand-400 group-hover:scale-110 transition-transform duration-300" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-display font-bold text-white tracking-tight">
              Tu estación de trabajo está esperando
            </h3>
            <p className="text-surface-300 text-sm sm:text-base leading-relaxed">
              Aún no tienes pedidos en marcha. Cuando adquieras tus equipos en Servitek, podrás hacer seguimiento aquí en tiempo real de cada fase: desde el ensamblaje técnico y control de calidad hasta la entrega en tu puerta.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/?categoria=laptops"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-sm transition-all duration-300 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 active:scale-95 no-underline"
            >
              <span>Explorar Laptops & Equipos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/?categoria=componentes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-surface-800/80 hover:bg-surface-800 text-slate-200 border border-surface-700 font-semibold text-sm transition-all duration-300 hover:border-surface-600 active:scale-95 no-underline"
            >
              <span>Ver Componentes PC</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pedidos.map((pedido) => {
        const currentStepIndex = ESTADOS_ORDEN.indexOf(pedido.estado);
        const isCancelled = pedido.estado === "CANCELADO";
        const statusInfo = ESTADOS_INFO[pedido.estado] || ESTADOS_INFO.PENDIENTE;
        const StatusIcon = statusInfo.icon;

        return (
          <div key={pedido.id} className="bg-surface-900/90 border border-surface-800 rounded-3xl p-6 sm:p-7 hover:border-surface-700 transition-all duration-300 shadow-xl space-y-6">
            
            {/* Header: Order ID & Total */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-surface-800/90 border border-surface-700/80 flex items-center justify-center text-brand-400">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base font-display font-bold text-white tracking-tight">Pedido #{pedido.id}</p>
                  <p className="text-xs text-surface-400 mt-0.5">{new Date(pedido.fechaPedido).toLocaleDateString("es-PE", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-surface-400 block mb-0.5">Monto Total</span>
                <span className="font-display font-bold text-xl text-slate-100">
                  S/ {pedido.total.toFixed(2)}
                </span>
              </div>
            </div>

            {!isCancelled ? (
              <div className="space-y-6">
                
                {/* Live Status Description Box */}
                <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${statusInfo.color}`}>
                  <div className="w-9 h-9 rounded-xl bg-surface-950/60 border border-current flex items-center justify-center shrink-0 mt-0.5">
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-100">{statusInfo.label}</h4>
                      {pedido.estado === "EN_PROCESO" && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-surface-200 leading-relaxed mt-1">{statusInfo.desc}</p>
                  </div>
                </div>

                {/* 5-Step Hardware Tracking Timeline */}
                <div className="relative py-4 pb-8 px-2 sm:px-6">
                  <div className="absolute top-8 left-6 right-6 h-1 bg-surface-800 -translate-y-1/2 rounded-full" />
                  <div
                    className="absolute top-8 left-6 h-1 bg-gradient-to-r from-brand-500 to-amber-400 -translate-y-1/2 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                    style={{ width: `${(currentStepIndex / (ESTADOS_ORDEN.length - 1)) * (100 - 12)}%` }}
                  />

                  <div className="relative flex justify-between">
                    {ESTADOS_ORDEN.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isActive = idx === currentStepIndex;
                      const stepInfo = ESTADOS_INFO[step] || {};
                      const StepIcon = stepInfo.icon || Clock;

                      return (
                        <div key={step} className="flex flex-col items-center group">
                          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center relative z-10 transition-all duration-500 border-2 ${
                            isActive
                              ? "bg-surface-900 border-brand-400 text-brand-400 shadow-[0_0_20px_rgba(56,189,248,0.5)] scale-110"
                              : isCompleted
                                ? "bg-gradient-to-tr from-brand-500 to-brand-400 border-brand-400 text-slate-950 shadow-md font-bold"
                                : "bg-surface-900 border-surface-800 text-surface-600"
                          }`}>
                            <StepIcon className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] sm:text-xs mt-3 font-bold absolute -bottom-6 whitespace-nowrap transition-colors ${
                            isActive ? "text-brand-400 scale-105" : isCompleted ? "text-slate-200" : "text-surface-500"
                          }`}>
                            {stepInfo.label || step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-center">
                <p className="text-rose-400 font-bold text-sm">Este pedido ha sido CANCELADO.</p>
              </div>
            )}

            {/* Purchased Items List */}
            <div className="space-y-3 border-t border-surface-800/80 pt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-surface-400 mb-3 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-brand-400" />
                <span>Específicacion de Hardware Adquirido</span>
              </h4>
              <div className="space-y-2">
                {pedido.detalles?.map((d) => (
                  <div key={d.id} className="flex justify-between items-center text-sm bg-surface-950/70 p-3 rounded-xl border border-surface-800/80">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-surface-900 flex items-center justify-center text-xs font-bold text-brand-400 border border-surface-800 shadow-sm">
                        {d.cantidad}x
                      </span>
                      <span className="text-slate-200 font-medium text-xs sm:text-sm">{d.producto?.nombre || "Producto"}</span>
                    </div>
                    <span className="text-slate-300 font-bold text-xs sm:text-sm shrink-0">S/ {d.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
