import AdminLayout from "../../../layouts/AdminLayout";
import { Users, Shield, User } from "lucide-react";
import { useUsuarios } from "../useUsuarios";

export default function AdminUsuarios() {
  const { usuarios, loading, cambiarRol } = useUsuarios();

  return (
    <AdminLayout title="Usuarios">
      <div className="page">
        <div className="section-header border-b border-surface-700/50 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-brand-400" />
            <h2 className="text-xl font-display font-bold">Gestion de Usuarios</h2>
          </div>
        </div>

        {loading ? (
          <p className="text-surface-400 text-center py-10">Cargando usuarios...</p>
        ) : (
          <div className="bg-surface-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface-800/50 text-surface-400 uppercase text-xs font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4">Registro</th>
                  <th className="px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700/50">
                {usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-surface-400">#{u.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-brand-400" />
                        </div>
                        <span className="font-medium text-slate-200">{u.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300">{u.email}</p>
                      <p className="text-xs text-surface-500">{u.telefono || "Sin telefono"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex w-fit items-center gap-1.5 ${
                        u.rol === "ADMIN"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : "bg-surface-800 text-surface-300 border-surface-700"
                      }`}>
                        {u.rol === "ADMIN" && <Shield className="w-3 h-3" />}
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-surface-400 text-sm">
                      {u.fechaRegistro ? new Date(u.fechaRegistro).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => cambiarRol(u.id, u)}
                        className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm hover:shadow-md border ${
                          u.rol === "ADMIN"
                            ? "text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 hover:shadow-rose-500/5"
                            : "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 hover:shadow-emerald-500/5"
                        }`}
                        title={`Cambiar rol a ${u.rol === "ADMIN" ? "CLIENTE" : "ADMIN"}`}
                      >
                        {u.rol === "ADMIN" ? "Quitar Admin" : "Hacer Admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
