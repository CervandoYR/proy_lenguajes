import AdminLayout from "../../../layouts/AdminLayout";
import { Package, Search, ChevronDown, Trash2 } from "lucide-react";
import { usePedidosAdmin } from "../usePedidos";

const getStatusColor = (estado) => {
  switch (estado) {
    case "PENDIENTE": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "PAGADO": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "EN_PROCESO": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "ENVIADO": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    case "ENTREGADO": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "CANCELADO": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    default: return "bg-surface-800 text-surface-400 border-surface-700";
  }
};

export default function AdminPedidos() {
  const { pedidos, loading, cambiarEstado, eliminar } = usePedidosAdmin();

  return (
    <AdminLayout title="Gestion de Pedidos">
      <div className="bg-surface-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-surface-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Buscar pedido por ID..."
                className="w-full bg-surface-900 border border-surface-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-900/50 text-surface-400 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-surface-400">
                    Cargando pedidos...
                  </td>
                </tr>
              ) : pedidos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-surface-400">
                    No hay pedidos registrados
                  </td>
                </tr>
              ) : (
                pedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-surface-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium">#{pedido.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-slate-200">{pedido.usuario.nombre}</p>
                        <p className="text-xs text-surface-500">{pedido.usuario.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-surface-400">
                      {new Date(pedido.fechaPedido).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-400">
                      S/ {pedido.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(pedido.estado)}`}>
                        {pedido.estado.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={pedido.estado}
                          onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                          className="bg-surface-800 border border-surface-600 text-slate-200 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2 cursor-pointer"
                        >
                          <option value="PENDIENTE">PENDIENTE</option>
                          <option value="PAGADO">PAGADO</option>
                          <option value="EN_PROCESO">EN PROCESO</option>
                          <option value="ENVIADO">ENVIADO</option>
                          <option value="ENTREGADO">ENTREGADO</option>
                          <option value="CANCELADO">CANCELADO</option>
                        </select>
                        <button
                          onClick={() => eliminar(pedido.id)}
                          className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-colors cursor-pointer active:scale-95"
                          title="Eliminar pedido"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
