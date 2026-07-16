import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "./categoriasService";

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (err) {
      toast.error("Error al cargar categorias");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // No atrapan el error aqui: el componente decide el mensaje de toast
  // segun el contexto (crear/editar vs eliminar).
  const guardarCategoria = async (categoria, form) => {
    if (categoria) {
      await updateCategoria(categoria.id, form);
    } else {
      await createCategoria(form);
    }
    await cargar();
  };

  const eliminarCategoria = async (id) => {
    await deleteCategoria(id);
    await cargar();
  };

  return { categorias, loading, recargar: cargar, guardarCategoria, eliminarCategoria };
}
