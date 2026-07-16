import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getPedidos,
  getMisPedidos,
  actualizarEstadoPedido,
  eliminarPedido,
} from "./pedidosService";

/** Hook para el panel admin: todos los pedidos */
export function usePedidosAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPedidos();
      setPedidos(data);
    } catch (err) {
      toast.error("Error al cargar los pedidos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await actualizarEstadoPedido(id, nuevoEstado);
      toast.success("Estado del pedido actualizado");
      cargar();
    } catch (err) {
      toast.error("Error al actualizar el estado");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este pedido permanentemente?")) return;
    try {
      await eliminarPedido(id);
      toast.success("Pedido eliminado correctamente");
      cargar();
    } catch (err) {
      toast.error("Error al eliminar el pedido");
    }
  };

  return { pedidos, loading, recargar: cargar, cambiarEstado, eliminar };
}

/** Hook para el cliente: "mis pedidos" */
export function useMisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMisPedidos();
      setPedidos(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { pedidos, loading, error, recargar: cargar };
}
