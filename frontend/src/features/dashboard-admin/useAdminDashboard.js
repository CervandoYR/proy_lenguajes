import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getUsuarios } from "../usuarios/usuariosService";
import { getProductos } from "../productos/productosService";
import { getPedidos } from "../pedidos/pedidosService";
import { getSalesTrend, getTopProducts, getLowStock } from "./analyticsService";

export function useAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ usuarios: 0, productos: 0, pedidos: 0 });
  const [salesTrend, setSalesTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const [usuarios, productos, pedidos] = await Promise.all([
        getUsuarios(),
        getProductos(),
        getPedidos(),
      ]);

      setStats({
        usuarios: usuarios.length || 0,
        productos: productos.length || 0,
        pedidos: pedidos.length || 0,
      });

      const [trend, top, low] = await Promise.all([
        getSalesTrend(),
        getTopProducts(),
        getLowStock(),
      ]);

      // Reverse so oldest is first for the line chart
      setSalesTrend(trend.reverse());
      setTopProducts(top);
      setLowStock(low);
    } catch (err) {
      toast.error("Error al cargar las metricas del dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return { loading, stats, salesTrend, topProducts, lowStock, recargar: cargarDatos };
}
