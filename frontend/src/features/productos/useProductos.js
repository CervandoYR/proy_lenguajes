import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getProductos, deleteProducto, toggleDestacadoProducto } from "./productosService";
import { getCategorias } from "../categorias/categoriasService";

/**
 * Hook para el panel admin: carga productos + categorias juntos
 * (igual que hacia antes Productos.jsx con Promise.all).
 */
export function useProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [productosData, categoriasData] = await Promise.all([
        getProductos(),
        getCategorias(),
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
    } catch (err) {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const eliminarProducto = async (id) => {
    try {
      await deleteProducto(id);
      toast.success("Producto eliminado");
      cargar();
    } catch (err) {
      toast.error("Error al eliminar producto");
    }
  };

  const toggleDestacado = async (id) => {
    try {
      await toggleDestacadoProducto(id);
      toast.success("Estado de oferta en carrusel actualizado");
      cargar();
    } catch (err) {
      toast.error("Error al actualizar estado en carrusel");
    }
  };

  return { productos, categorias, loading, recargar: cargar, eliminarProducto, toggleDestacado };
}

/** Hook para el catalogo publico (tienda) */
export function useProductosPublicos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activo = true;
    async function cargar() {
      setLoading(true);
      try {
        const [productosData, categoriasData] = await Promise.all([
          getProductos(),
          getCategorias(),
        ]);
        if (activo) {
          setProductos(productosData);
          setCategorias(categoriasData);
        }
      } finally {
        if (activo) setLoading(false);
      }
    }
    cargar();
    return () => {
      activo = false;
    };
  }, []);

  return { productos, categorias, loading };
}
