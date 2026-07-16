import { Link } from "react-router-dom";
import { Users, Package, ShoppingBag, TrendingUp, AlertTriangle, ArrowRight, Sparkles, CheckCircle2, PackageOpen } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import AdminLayout from "../../../layouts/AdminLayout";
import { useAdminDashboard } from "../useAdminDashboard";

export default function AdminDashboard() {
  const { loading, stats, salesTrend, topProducts, lowStock } = useAdminDashboard();

  if (loading) {
    return (
    <AdminLayout title="Visión General">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-surface-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-surface-800 rounded-2xl animate-pulse" />
          <div className="h-80 bg-surface-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Visión General">
      <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500 page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-100">Dashboard</h1>
          <p className="text-surface-400 mt-1">Resumen general y metricas de rendimiento</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-800 border border-surface-700 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-surface-400">Total Ingresos</p>
            <h3 className="text-2xl font-display font-bold text-slate-100">
              S/ {salesTrend.reduce((acc, curr) => acc + curr.total, 0).toFixed(2)}
            </h3>
          </div>
        </div>

        <div className="bg-surface-800 border border-surface-700 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-surface-400">Pedidos Activos</p>
            <h3 className="text-2xl font-display font-bold text-slate-100">{stats.pedidos}</h3>
          </div>
        </div>

        <div className="bg-surface-800 border border-surface-700 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-surface-400">Productos</p>
            <h3 className="text-2xl font-display font-bold text-slate-100">{stats.productos}</h3>
          </div>
        </div>

        <div className="bg-surface-800 border border-surface-700 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-surface-400">Usuarios Registrados</p>
            <h3 className="text-2xl font-display font-bold text-slate-100">{stats.usuarios}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafico de Tendencia de Ventas */}
        <div className="bg-surface-800 border border-surface-700 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-slate-100 mb-6">Tendencia de Ingresos (Ultimos 7 dias)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="fecha" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `S/ ${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f1f5f9' }}
                  itemStyle={{ color: '#38bdf8' }}
                  cursor={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                />
                <Line type="monotone" dataKey="total" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: '#38bdf8', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grafico de Top Productos */}
        <div className="bg-surface-800 border border-surface-700 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-slate-100 mb-6">Top 5 Productos Vendidos</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f1f5f9' }}
                  itemStyle={{ color: '#818cf8' }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                />
                <Bar dataKey="total" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Terminal Criptográfica de Alertas de Inventario & Logística (UX Nielsen & Apple) */}
      <div className="bg-surface-800/80 backdrop-blur-xl border border-surface-700/80 p-6 md:p-8 rounded-3xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-surface-700/60">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              lowStock.length > 0 ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            }`}>
              {lowStock.length > 0 ? <AlertTriangle className="w-6 h-6 animate-pulse" /> : <CheckCircle2 className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-display font-bold text-slate-100">Alertas e Inventario Crítico</h3>
                {lowStock.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {lowStock.length} requeridos
                  </span>
                )}
              </div>
              <p className="text-surface-400 text-xs sm:text-sm mt-0.5">
                Monitoreo continuo de stock en almacén central según heurísticas de prevención
              </p>
            </div>
          </div>
          
          <Link
            to="/admin/productos"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-900 hover:bg-brand-500 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all border border-surface-700 hover:border-brand-400 shadow-sm shrink-0 self-start sm:self-auto"
          >
            <span>Gestionar Catálogo Completo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {lowStock.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStock.map(p => {
              const agotado = p.stock <= 0;
              return (
                <div 
                  key={p.id} 
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                    agotado 
                      ? "bg-rose-950/20 border-rose-500/40 hover:border-rose-500 shadow-lg shadow-rose-500/5" 
                      : "bg-amber-950/20 border-amber-500/40 hover:border-amber-500 shadow-lg shadow-amber-500/5"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-900 flex shrink-0 items-center justify-center overflow-hidden border border-white/10">
                      {p.imagenUrl ? (
                        <img src={p.imagenUrl} alt={p.nombre} className="w-full h-full object-contain p-1" />
                      ) : (
                        <PackageOpen className="w-6 h-6 text-surface-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-bold text-slate-200 truncate block">{p.nombre}</span>
                      <span className="text-[11px] font-medium text-surface-400 uppercase tracking-wider block mt-0.5">
                        {p.categoria || "Hardware"} · <strong className="text-slate-300">S/ {Number(p.precio || 0).toFixed(2)}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    <span className={`flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full border ${
                      agotado 
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse" 
                        : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${agotado ? "bg-rose-500" : "bg-amber-400"}`} />
                      {agotado ? "AGOTADO (0)" : `${p.stock} UNID.`}
                    </span>
                    <Link
                      to="/admin/productos"
                      className="text-[11px] font-bold text-brand-400 hover:text-brand-300 hover:underline flex items-center gap-0.5"
                    >
                      <span>Reponer</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center bg-surface-900/40 rounded-2xl border border-surface-700/50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-200">Inventario Óptimo Verificado</h4>
            <p className="text-surface-400 text-xs sm:text-sm max-w-md mt-1">
              Todos los productos activos cuentan con más de 5 unidades en el almacén central. No se requieren acciones urgentes de reposición.
            </p>
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
}