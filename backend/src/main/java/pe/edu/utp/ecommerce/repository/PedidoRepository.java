package pe.edu.utp.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.ecommerce.model.Pedido;

import org.springframework.data.jpa.repository.Query;
import pe.edu.utp.ecommerce.model.Usuario;
import java.util.List;
import java.util.Map;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuario(Usuario usuario);

    @Query("SELECT DATE(p.fechaPedido) as fecha, SUM(p.total) as total FROM Pedido p GROUP BY DATE(p.fechaPedido) ORDER BY fecha DESC LIMIT 7")
    List<Map<String, Object>> findSalesTrend();
}
