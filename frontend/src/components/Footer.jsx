import { Mail, Phone, MapPin, ShieldCheck, HelpCircle, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-surface-900 border-t border-surface-800 mt-auto text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                <span className="font-display font-extrabold text-white text-base">S</span>
              </div>
              <span className="font-display font-bold text-xl text-slate-100 tracking-tight">
                SERVITEK
              </span>
            </div>
            <p className="text-surface-400 text-sm leading-relaxed mb-6">
              Te ayudamos a elegir y disfrutar de la tecnología correcta. Laptops, monitores y componentes con garantía oficial y soporte real en todo el Perú.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20 w-fit">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Compra 100% Protegida</span>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm text-slate-100 mb-4 uppercase tracking-wider">
              Categorías Principales
            </h4>
            <ul className="space-y-3 list-none p-0 m-0">
              <li>
                <Link to="/?categoria=1" className="text-surface-400 hover:text-brand-400 text-sm transition-colors no-underline">
                  Laptops y Portátiles
                </Link>
              </li>
              <li>
                <Link to="/?categoria=2" className="text-surface-400 hover:text-brand-400 text-sm transition-colors no-underline">
                  Componentes para PC
                </Link>
              </li>
              <li>
                <Link to="/?categoria=3" className="text-surface-400 hover:text-brand-400 text-sm transition-colors no-underline">
                  Periféricos y Accesorios
                </Link>
              </li>
              <li>
                <Link to="/?categoria=" className="text-surface-400 hover:text-brand-400 text-sm transition-colors no-underline font-semibold text-slate-300">
                  Ver Todo el Catálogo →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm text-slate-100 mb-4 uppercase tracking-wider">
              Te Ayudamos
            </h4>
            <ul className="space-y-3 list-none p-0 m-0">
              <li>
                <Link to="/soporte" className="text-surface-400 hover:text-brand-400 text-sm transition-colors no-underline flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-400 shrink-0" />
                  Soporte Técnico y Dudas
                </Link>
              </li>
              <li>
                <Link to="/quienes-somos" className="text-surface-400 hover:text-brand-400 text-sm transition-colors no-underline flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-brand-400 shrink-0" />
                  Nuestra Garantía en Perú
                </Link>
              </li>
              <li>
                <Link to="/#catalogo" className="text-surface-400 hover:text-brand-400 text-sm transition-colors no-underline">
                  Cómo comprar paso a paso
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm text-slate-100 mb-4 uppercase tracking-wider">
              Atención Directa
            </h4>
            <ul className="space-y-3.5 list-none p-0 m-0">
              <li className="flex items-start gap-3 text-surface-400 text-sm">
                <Mail className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-slate-200">Correo Electrónico</span>
                  ventas@servitek.pe
                </div>
              </li>
              <li className="flex items-start gap-3 text-surface-400 text-sm">
                <Phone className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-slate-200">Atención WhatsApp</span>
                  +51 987 654 321
                </div>
              </li>
              <li className="flex items-start gap-3 text-surface-400 text-sm">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-slate-200">Oficina Principal</span>
                  Lima, Perú (Envíos a nivel nacional)
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-surface-400 text-xs m-0">
            © {new Date().getFullYear()} Servitek Technologies SAC. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-xs text-surface-400">
            <span className="hover:text-slate-200 transition-colors cursor-pointer">Términos de Garantía</span>
            <span className="hover:text-slate-200 transition-colors cursor-pointer">Políticas de Envío</span>
            <span className="hover:text-slate-200 transition-colors cursor-pointer">Privacidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
