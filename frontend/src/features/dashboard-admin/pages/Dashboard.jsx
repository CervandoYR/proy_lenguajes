import { Users, Package, ShoppingBag, TrendingUp, AlertTriangle } from "lucide-react";
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

      {/* Alertas de Inventario */}
      <div className="bg-surface-800 border border-surface-700 p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-rose-500" />
          <h3 className="text-lg font-semibold text-slate-100">Alertas de Stock Bajo</h3>
        </div>
        
        {lowStock.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStock.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-surface-900 border border-rose-500/30 rounded-xl">
                <span className="text-sm font-medium text-slate-300 truncate pr-4">{p.nombre}</span>
                <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400">
                  {p.stock} unid.
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-surface-900/50 rounded-xl border border-surface-700/50">
            <p className="text-emerald-400 font-medium">Todos los productos cuentan con stock saludable.</p>
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
}