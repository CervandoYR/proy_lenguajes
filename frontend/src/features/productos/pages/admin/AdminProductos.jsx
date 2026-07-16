import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, Search, PackageOpen, Image as ImageIcon, Box, List as ListIcon, Info, X, Eye, Sparkles } from "lucide-react";
import AdminLayout from "../../../../layouts/AdminLayout";
import { createProducto, updateProducto, uploadMedia } from "../../productosService";
import { useProductosAdmin } from "../../useProductos";
import { toast } from "sonner";

function ProductoModal({ categorias, producto, onClose, onSaved }) {
  const [activeTab, setActiveTab] = useState("info");
  const [form, setForm] = useState({
    categoriaId: "",
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagenUrl: "",
    imagenesAdicionales: "[]",
    especificaciones: "{}",
    modelo3dUrl: "",
    activo: true,
    destacado: false,
  });

  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Specifications State
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [specsList, setSpecsList] = useState([]);

  // Additional Images State
  const [additionalImageUrl, setAdditionalImageUrl] = useState("");
  const [additionalImagesList, setAdditionalImagesList] = useState([]);

  useEffect(() => {
    setForm({
      categoriaId: producto?.categoria?.id ?? producto?.categoriaId ?? "",
      nombre: producto?.nombre ?? "",
      descripcion: producto?.descripcion ?? "",
      precio: producto?.precio ?? "",
      stock: producto?.stock ?? "",
      imagenUrl: producto?.imagenUrl ?? "",
      imagenesAdicionales: producto?.imagenesAdicionales ?? "[]",
      especificaciones: producto?.especificaciones ?? "{}",
      modelo3dUrl: producto?.modelo3dUrl ?? "",
      activo: producto?.activo ?? true,
      destacado: producto?.destacado ?? false,
    });

    try {
      const parsedSpecs = producto?.especificaciones ? JSON.parse(producto.especificaciones) : {};
      setSpecsList(Object.entries(parsedSpecs).map(([k, v]) => ({ key: k, value: v })));
    } catch (e) {
      setSpecsList([]);
    }

    try {
      const parsedImgs = producto?.imagenesAdicionales ? JSON.parse(producto.imagenesAdicionales) : [];
      setAdditionalImagesList(parsedImgs);
    } catch (e) {
      setAdditionalImagesList([]);
    }
  }, [producto]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const addSpec = () => {
    if (!specKey || !specValue) return;
    setSpecsList([...specsList, { key: specKey, value: specValue }]);
    setSpecKey("");
    setSpecValue("");
  };

  const removeSpec = (index) => {
    const newList = [...specsList];
    newList.splice(index, 1);
    setSpecsList(newList);
  };

  const addAdditionalImage = () => {
    if (!additionalImageUrl) return;
    setAdditionalImagesList([...additionalImagesList, additionalImageUrl]);
    setAdditionalImageUrl("");
  };

  const removeAdditionalImage = (index) => {
    const newList = [...additionalImagesList];
    newList.splice(index, 1);
    setAdditionalImagesList(newList);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre.trim() || !form.categoriaId || !form.precio || parseFloat(form.precio) <= 0 || form.stock === "" || parseInt(form.stock) < 0) {
      toast.error("Por favor completa los campos requeridos correctamente.");
      return;
    }
    setLoading(true);

    try {
      let finalImageUrl = form.imagenUrl;

      if (archivo) {
        const formData = new FormData();
        formData.append("file", archivo);
        const data = await uploadMedia(formData);
        finalImageUrl = data.url;
      }

      // Build specs object
      const specsObj = {};
      specsList.forEach(s => { specsObj[s.key] = s.value; });

      const payload = {
        ...form,
        categoriaId: Number(form.categoriaId),
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock),
        imagenUrl: finalImageUrl,
        imagenesAdicionales: JSON.stringify(additionalImagesList),
        especificaciones: JSON.stringify(specsObj),
      };

      if (producto) {
        await updateProducto(producto.id, payload);
      } else {
        await createProducto(payload);
      }

      toast.success(producto ? "Producto actualizado" : "Producto creado");
      onSaved();
    } catch (err) {
      toast.error(err.response?.data || "Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm">
      <div className="bg-surface-900 border border-surface-700/50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        <div className="flex items-center justify-between p-6 border-b border-surface-800 bg-surface-900/50">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <PackageOpen className="w-5 h-5 text-brand-400" />
            {producto ? "Editar Producto" : "Nuevo Producto"}
          </h3>
          <button type="button" className="text-surface-400 hover:text-white transition-all cursor-pointer active:scale-95 p-1 rounded-md hover:bg-surface-800" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-surface-800 bg-surface-950/50">
          <button type="button" onClick={() => setActiveTab("info")} className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${activeTab === "info" ? "border-brand-500 text-brand-400 bg-brand-500/5" : "border-transparent text-surface-400 hover:text-surface-200"}`}>
            <Info className="w-4 h-4" /> Info Basica
          </button>
          <button type="button" onClick={() => setActiveTab("media")} className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${activeTab === "media" ? "border-brand-500 text-brand-400 bg-brand-500/5" : "border-transparent text-surface-400 hover:text-surface-200"}`}>
            <ImageIcon className="w-4 h-4" /> Multimedia
          </button>
          <button type="button" onClick={() => setActiveTab("specs")} className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${activeTab === "specs" ? "border-brand-500 text-brand-400 bg-brand-500/5" : "border-transparent text-surface-400 hover:text-surface-200"}`}>
            <ListIcon className="w-4 h-4" /> Especificaciones
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden flex-1">
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            
            {activeTab === "info" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-surface-300">Categoria</label>
                    <select value={form.categoriaId} onChange={set("categoriaId")} required className="w-full bg-surface-800 border border-surface-700 text-slate-200 rounded-xl px-4 py-2.5 focus:border-brand-500 focus:outline-none transition-colors">
                      <option value="">Seleccionar...</option>
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-surface-300">Estado</label>
                    <select value={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.value === "true" })} className="w-full bg-surface-800 border border-surface-700 text-slate-200 rounded-xl px-4 py-2.5 focus:border-brand-500 focus:outline-none transition-colors">
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface-800/80 border border-surface-700 rounded-xl hover:border-brand-500/50 transition-colors">
                  <div>
                    <label className="text-sm font-medium text-slate-200 block flex items-center gap-1.5 cursor-pointer" onClick={() => setForm({ ...form, destacado: !form.destacado })}>
                      <Sparkles className="w-4 h-4 text-brand-400" />
                      Destacado en Oferta (Carrusel Principal)
                    </label>
                    <span className="text-xs text-surface-400">Si se activa, el producto aparecerá en el carrusel "Equipos Destacados en Oferta" de la tienda</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.destacado || false}
                    onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                    className="w-5 h-5 accent-brand-500 rounded cursor-pointer shrink-0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-surface-300">Nombre del Producto</label>
                  <input value={form.nombre} onChange={set("nombre")} required className="w-full bg-surface-800 border border-surface-700 text-slate-200 rounded-xl px-4 py-2.5 focus:border-brand-500 focus:outline-none transition-colors" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-surface-300">Descripcion</label>
                  <textarea value={form.descripcion} onChange={set("descripcion")} rows="3" className="w-full bg-surface-800 border border-surface-700 text-slate-200 rounded-xl px-4 py-2.5 focus:border-brand-500 focus:outline-none transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-surface-300">Precio (S/)</label>
                    <input type="number" step="0.01" value={form.precio} onChange={set("precio")} required className="w-full bg-surface-800 border border-surface-700 text-slate-200 rounded-xl px-4 py-2.5 focus:border-brand-500 focus:outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-surface-300">Stock</label>
                    <input type="number" value={form.stock} onChange={set("stock")} required className="w-full bg-surface-800 border border-surface-700 text-slate-200 rounded-xl px-4 py-2.5 focus:border-brand-500 focus:outline-none transition-colors" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "media" && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-white font-medium border-b border-surface-800 pb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-brand-400" /> Imagen Principal
                  </h4>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-surface-300">Subir nueva imagen (Reemplaza URL si se selecciona)</label>
                    <label className="flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-surface-600 rounded-xl cursor-pointer hover:border-brand-500 hover:bg-brand-500/5 transition-all text-sm w-full bg-surface-800">
                      <Upload className="w-5 h-5 text-surface-400" />
                      <span className="text-surface-300">{archivo ? archivo.name : "Click para explorar archivos locales"}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => setArchivo(e.target.files[0])} />
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-surface-300">O ingresar URL de Imagen</label>
                    <input value={form.imagenUrl} onChange={set("imagenUrl")} placeholder="https://..." className="w-full bg-surface-800 border border-surface-700 text-slate-200 rounded-xl px-4 py-2.5 focus:border-brand-500 focus:outline-none transition-colors" />
                  </div>
                  {form.imagenUrl && !archivo && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-surface-700 bg-surface-900">
                      <img src={form.imagenUrl} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium border-b border-surface-800 pb-2 flex items-center gap-2">
                    <ListIcon className="w-4 h-4 text-brand-400" /> Galeria Adicional
                  </h4>
                  <div className="flex gap-2">
                    <input 
                      value={additionalImageUrl} 
                      onChange={(e) => setAdditionalImageUrl(e.target.value)} 
                      placeholder="URL de imagen adicional..." 
                      className="flex-1 bg-surface-800 border border-surface-700 text-slate-200 rounded-xl px-4 py-2.5 focus:border-brand-500 focus:outline-none transition-colors"
                      onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); addAdditionalImage(); } }}
                    />
                    <button type="button" onClick={addAdditionalImage} className="px-4 py-2 bg-surface-700 hover:bg-brand-500 text-white rounded-xl transition-colors">
                      Agregar
                    </button>
                  </div>
                  {additionalImagesList.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-4">
                      {additionalImagesList.map((img, idx) => (
                        <div key={idx} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-surface-700 bg-surface-900">
                          <img src={img} alt={`Adicional ${idx}`} className="w-full h-full object-contain" />
                          <button type="button" onClick={() => removeAdditionalImage(idx)} className="absolute top-1 right-1 p-1 bg-rose-500/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium border-b border-surface-800 pb-2 flex items-center gap-2">
                    <Box className="w-4 h-4 text-brand-400" /> Modelo 3D
                  </h4>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-surface-300">URL del modelo (.glb / .gltf)</label>
                    <input value={form.modelo3dUrl} onChange={set("modelo3dUrl")} placeholder="https://..." className="w-full bg-surface-800 border border-surface-700 text-slate-200 rounded-xl px-4 py-2.5 focus:border-brand-500 focus:outline-none transition-colors" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="space-y-6">
                <p className="text-sm text-surface-400">Agrega especificaciones tecnicas en formato Clave/Valor (Ej. Procesador : Intel Core i9).</p>
                
                <div className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium text-surface-300">Clave</label>
                    <input 
                      value={specKey} 
                      onChange={(e) => setSpecKey(e.target.value)} 
                      placeholder="Ej. Memoria RAM" 
                      className="w-full bg-surface-800 border border-surface-700 text-slate-200 rounded-xl px-4 py-2.5 focus:border-brand-500 focus:outline-none transition-colors" 
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium text-surface-300">Valor</label>
                    <input 
                      value={specValue} 
                      onChange={(e) => setSpecValue(e.target.value)} 
                      placeholder="Ej. 32GB DDR5" 
                      className="w-full bg-surface-800 border border-surface-700 text-slate-200 rounded-xl px-4 py-2.5 focus:border-brand-500 focus:outline-none transition-colors"
                      onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); addSpec(); } }}
                    />
                  </div>
                  <button type="button" onClick={addSpec} className="px-6 py-2.5 bg-surface-700 hover:bg-brand-500 text-white rounded-xl transition-colors h-[42px] mb-0.5">
                    Añadir
                  </button>
                </div>

                {specsList.length > 0 && (
                  <div className="mt-6 border border-surface-700 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-surface-800 text-surface-400 border-b border-surface-700">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Característica</th>
                          <th className="px-4 py-3 font-semibold">Detalle</th>
                          <th className="px-4 py-3 text-right w-16">Quitar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-700/50 bg-surface-900/50">
                        {specsList.map((spec, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-3 text-slate-200 font-medium">{spec.key}</td>
                            <td className="px-4 py-3 text-surface-300">{spec.value}</td>
                            <td className="px-4 py-3 text-right">
                              <button type="button" onClick={() => removeSpec(idx)} className="text-surface-500 hover:text-rose-400 transition-colors">
                                <Trash2 className="w-4 h-4 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-surface-800 bg-surface-900">
            <button type="submit" className="w-full py-3 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center cursor-pointer active:scale-95" disabled={loading}>
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Guardar Producto"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProductos() {
  const { productos, categorias, loading, recargar, eliminarProducto, toggleDestacado } = useProductosAdmin();
  const [busqueda, setBusqueda] = useState("");
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);

  async function handleDelete(id) {
    if (!confirm("Eliminar producto?")) return;
    eliminarProducto(id);
  }

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <AdminLayout title="Productos">
      <div className="page pb-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-2">
              <PackageOpen className="w-6 h-6 text-brand-400" />
              Inventario Central
            </h1>
            <p className="text-surface-400 mt-1">Gestiona el catalogo, modelos 3D y especificaciones de tus equipos.</p>
          </div>
          <button
            onClick={() => {
              setEditando(null);
              setModal(true);
            }}
            className="w-full md:w-auto px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 border border-brand-400/30"
          >
            <Plus className="w-5 h-5" /> Nuevo Producto
          </button>
        </div>

        <div className="bg-surface-800/50 backdrop-blur-md border border-surface-700/50 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-surface-700/50 flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-800/30">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-900 border border-surface-700 text-slate-200 rounded-xl focus:border-brand-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="text-sm text-surface-400">
              Mostrando <span className="text-slate-200 font-semibold">{productosFiltrados.length}</span> productos
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-900/50 border-b border-surface-700/50 text-surface-400 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Producto</th>
                  <th className="px-6 py-4 font-semibold">Categoria</th>
                  <th className="px-6 py-4 font-semibold text-right">Precio</th>
                  <th className="px-6 py-4 font-semibold text-center">Stock</th>
                  <th className="px-6 py-4 font-semibold text-center">Estado</th>
                  <th className="px-6 py-4 font-semibold text-center">En Oferta</th>
                  <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700/30 text-sm">
                {productosFiltrados.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-800/30 transition-colors group">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-900 flex shrink-0 items-center justify-center overflow-hidden border border-surface-700">
                        {p.imagenUrl ? <img src={p.imagenUrl} className="w-full h-full object-contain" alt={p.nombre} /> : <span className="text-[10px] text-surface-600">IMG</span>}
                      </div>
                      <div>
                        <div className="font-medium text-slate-200 group-hover:text-brand-300 transition-colors line-clamp-1">{p.nombre}</div>
                        <div className="text-xs text-surface-500 truncate max-w-xs">{p.descripcion}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-700 text-surface-300">
                        {p.categoria?.nombre || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-200">
                      S/ {Number(p.precio).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {p.stock === 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-sm animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Agotado (0)
                        </span>
                      ) : p.stock <= 5 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                          Crítico ({p.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Óptimo ({p.stock})
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        p.activo ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-surface-700 text-surface-400 border border-surface-600"
                      }`}>
                        {p.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleDestacado(p.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                          p.destacado
                            ? "bg-brand-500/20 text-brand-400 border border-brand-500/40 hover:bg-brand-500/30 shadow-sm"
                            : "bg-surface-700 text-surface-400 border border-surface-600 hover:bg-surface-600 hover:text-surface-200"
                        }`}
                        title="Click para agregar o quitar del carrusel de ofertas"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${p.destacado ? "text-brand-400 fill-brand-400" : ""}`} />
                        {p.destacado ? "En Oferta" : "Normal"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <a
                          href={`/producto/${p.id}/${p.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-surface-800 hover:bg-emerald-500 text-slate-300 hover:text-white rounded-xl transition-all duration-200 cursor-pointer hover:scale-110 active:scale-90 shadow-sm hover:shadow-emerald-500/30 border border-surface-700/80 hover:border-emerald-400 flex items-center justify-center"
                          title="Previsualizar en tienda"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setEditando(p);
                            setModal(true);
                          }}
                          className="p-2.5 bg-surface-800 hover:bg-brand-500 text-slate-300 hover:text-white rounded-xl transition-all duration-200 cursor-pointer hover:scale-110 active:scale-90 shadow-sm hover:shadow-brand-500/30 border border-surface-700/80 hover:border-brand-400 flex items-center justify-center"
                          title="Editar producto"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="p-2.5 bg-surface-800 hover:bg-rose-500 text-slate-300 hover:text-white rounded-xl transition-all duration-200 cursor-pointer hover:scale-110 active:scale-90 shadow-sm hover:shadow-rose-500/30 border border-surface-700/80 hover:border-rose-400 flex items-center justify-center"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {productosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-surface-400">
                      No se encontraron productos en el inventario.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {modal && (
          <ProductoModal
            categorias={categorias}
            producto={editando}
            onClose={() => setModal(false)}
            onSaved={() => {
              setModal(false);
              recargar();
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}