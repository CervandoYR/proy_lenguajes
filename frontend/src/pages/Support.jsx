import StoreLayout from "../layouts/StoreLayout";
import { Headphones, Mail, MessageSquare, Phone, LifeBuoy } from "lucide-react";

export default function Support() {
  return (
    <StoreLayout>
      <div className="relative bg-surface-950 overflow-hidden min-h-screen">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="py-24 relative z-10">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="text-center mb-16 transition-all duration-1000 translate-y-0 opacity-100">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6 backdrop-blur-md">
                <LifeBuoy className="w-4 h-4 text-brand-400" />
                <span className="text-xs font-bold text-brand-300 tracking-wider uppercase">Soporte 24/7</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white mb-6 leading-tight tracking-tight">
                Centro de <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">
                  Asistencia
                </span>
              </h1>
              <p className="text-xl text-surface-300 max-w-2xl mx-auto font-light leading-relaxed">
                Estamos aqui para ayudarte. Encuentra respuestas a preguntas frecuentes o contactanos directamente para asistencia tecnica nivel experto.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              <div className="group bg-surface-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-3xl text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-brand-500/50">
                <div className="w-20 h-20 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 transform group-hover:scale-110 transition-transform duration-500">
                  <Phone className="w-10 h-10 text-brand-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-3">Llamanos</h3>
                <p className="text-surface-400 mb-6 text-sm">Atencion personalizada<br/>Lunes a Sabado, 9am - 6pm</p>
                <a href="tel:+51999999999" className="inline-block px-8 py-4 rounded-full bg-brand-500/10 text-brand-400 font-bold hover:bg-brand-500 hover:text-white transition-colors duration-300 border border-brand-500/20 hover:border-brand-500">
                  +51 999 999 999
                </a>
              </div>

              <div className="group bg-surface-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-3xl text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-500/50">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 transform group-hover:scale-110 transition-transform duration-500">
                  <Mail className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-3">Escribenos</h3>
                <p className="text-surface-400 mb-6 text-sm">Envianos tus consultas tecnicas<br/>Te responderemos en 24h</p>
                <a href="mailto:soporte@servitek.com" className="inline-block px-8 py-4 rounded-full bg-emerald-500/10 text-emerald-400 font-bold hover:bg-emerald-500 hover:text-white transition-colors duration-300 border border-emerald-500/20 hover:border-emerald-500">
                  soporte@servitek.com
                </a>
              </div>
            </div>

            <div className="bg-surface-900/50 backdrop-blur-2xl border border-white/10 p-10 lg:p-16 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                <MessageSquare className="w-64 h-64 text-brand-500" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-10 flex items-center gap-4">
                  <div className="p-3 bg-brand-500/20 rounded-xl text-brand-400">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  Preguntas Frecuentes
                </h2>
                
                <div className="space-y-6 text-left max-w-3xl">
                  {[
                    {
                      q: "¿Que medios de pago aceptan?",
                      a: "Aceptamos todas las tarjetas de credito/debito Visa, Mastercard, AMEX a traves de nuestra pasarela de pagos segura (Culqi). Tambien aceptamos transferencias bancarias."
                    },
                    {
                      q: "¿Tienen envio a provincias?",
                      a: "Si, realizamos envios a todo el Peru. El costo de envio se calcula automaticamente al momento de finalizar la compra dependiendo de la region asegurando su equipo al 100%."
                    },
                    {
                      q: "¿Cual es el tiempo de garantia?",
                      a: "Todos nuestros equipos ensamblados cuentan con 12 a 24 meses de garantia directa con nosotros. Los componentes individuales tienen 12 meses."
                    }
                  ].map((faq, i) => (
                    <div key={i} className="group p-8 bg-surface-950/50 backdrop-blur-md rounded-2xl border border-white/5 hover:border-brand-500/30 transition-colors duration-300">
                      <h4 className="text-lg font-bold text-slate-100 mb-3 group-hover:text-brand-400 transition-colors">{faq.q}</h4>
                      <p className="text-surface-400 leading-relaxed font-light">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
