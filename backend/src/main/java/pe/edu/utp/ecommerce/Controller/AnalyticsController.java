package pe.edu.utp.ecommerce.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.utp.ecommerce.model.Producto;
import pe.edu.utp.ecommerce.repository.DetallePedidoRepository;
import pe.edu.utp.ecommerce.repository.PedidoRepository;
import pe.edu.utp.ecommerce.repository.ProductoRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final PedidoRepository pedidoRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final ProductoRepository productoRepository;

    @GetMapping("/sales-trend")
    public ResponseEntity<List<Map<String, Object>>> getSalesTrend() {
        return ResponseEntity.ok(pedidoRepository.findSalesTrend());
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<Map<String, Object>>> getTopProducts() {
        return ResponseEntity.ok(detallePedidoRepository.findTopSellingProducts());
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Map<String, Object>>> getLowStock() {
        List<Producto> lowStockProducts = productoRepository.findAll().stream()
                .filter(p -> p.getStock() < 5)
                .collect(Collectors.toList());

        List<Map<String, Object>> response = lowStockProducts.stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("nombre", p.getNombre());
            map.put("stock", p.getStock());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
