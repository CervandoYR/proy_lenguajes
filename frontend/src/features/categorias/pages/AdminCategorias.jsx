import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "../../../layouts/AdminLayout";
import { useCategorias } from "../useCategorias";

function CategoriaModal({ categoria, onClose, onSaved }) {
  const [form, setForm] = useState({
    nombre: "",
    slug: "",
    descripcion: "",
    activo: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoria) {
      setForm({
        nombre: categoria.nombre,
        slug: categoria.slug,
        descripcion: categoria.descripcion || "",
        activo: categoria.activo,
      });
    }
  }, [categoria]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const autoSlug = (nombre) => {
    const slug = nombre.toLowerCase().trim().replace(/[\s\W-]+/g, "-");
    setForm({ ...form, nombre, slug });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSaved(categoria, form);
      toast.success(categoria ? "Categoria actualizada" : "Categoria creada");
    } catch (err) {
      toast.error("Error al guardar la categoria");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{categoria ? "Editar Categoria" : "Nueva Categoria"}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nombre</label>
            <input
              value={form.nombre}
              onChange={(e) => autoSlug(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Slug (URL amistosa)</label>
            <input value={form.slug} onChange={set("slug")} required />
          </div>

          <div className="field">
            <label>Descripcion</label>
            <input value={form.descripcion} onChange={set("descripcion")} />
          </div>

          <div className="field">
            <label>Estado</label>
            <select
              value={form.activo}
              onChange={(e) => setForm({ ...form, activo: e.target.value === "true" })}
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminCategorias() {
  const { categorias, loading, guardarCategoria, eliminarCategoria } = useCategorias();
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);

  async function eliminar(id) {
    if (!confirm("Eliminar categoria?")) return;
    try {
      await eliminarCategoria(id);
      toast.success("Categoria eliminada");
    } catch (err) {
      toast.error("Error al eliminar la categoria (puede tener productos asociados)");
    }
  }

  function abrirNuevo() {
    setEditando(null);
    setModal(true);
  }

  function abrirEditar(c) {
    setEditando(c);
    setModal(true);
  }

  return (
    <AdminLayout title="Categorias">
      <div className="page">
        <div className="section-header">
          <h2>Categorias</h2>
          <button className="btn btn-primary" onClick={abrirNuevo}>
            <Plus className="w-4 h-4" />
            Nuevo
          </button>
        </div>

        {loading ? (
          <p className="loading">Cargando...</p>
        ) : (
          <div className="bg-surface-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Slug</th>
                  <th>Descripcion</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((c) => (
                  <tr key={c.id}>
                    <td>#{c.id}</td>
                    <td className="font-medium">{c.nombre}</td>
                    <td className="text-surface-400">{c.slug}</td>
                    <td className="truncate max-w-xs">{c.descripcion}</td>
                    <td>
                      <span className={`badge ${c.activo ? "badge-active" : "badge-inactive"}`}>
                        {c.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-secondary btn-sm" onClick={() => abrirEditar(c)}>
                          <Pencil className="w-3.5 h-3.5" />
                          Editar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => eliminar(c.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modal && (
          <CategoriaModal
            categoria={editando}
            onClose={() => setModal(false)}
            onSaved={async (cat, form) => {
              await guardarCategoria(cat, form);
              setModal(false);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
