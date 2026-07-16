package pe.edu.utp.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.ecommerce.model.DetallePedido;

import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Map;

public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {
    @Query("SELECT d.producto.nombre as name, SUM(d.cantidad) as total FROM DetallePedido d GROUP BY d.producto.nombre ORDER BY total DESC LIMIT 5")
    List<Map<String, Object>> findTopSellingProducts();
}
