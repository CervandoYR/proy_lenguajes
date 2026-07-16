package pe.edu.utp.ecommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.utp.ecommerce.model.DetallePedido;
import pe.edu.utp.ecommerce.model.Pedido;
import pe.edu.utp.ecommerce.model.Producto;
import pe.edu.utp.ecommerce.repository.DetallePedidoRepository;
import pe.edu.utp.ecommerce.repository.PedidoRepository;
import pe.edu.utp.ecommerce.repository.ProductoRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DetallePedidoService {

    private final DetallePedidoRepository repository;
    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;

    public List<DetallePedido> listarTodos() {
        return repository.findAll();
    }

    public Optional<DetallePedido> buscarPorId(Long id) {
        return repository.findById(id);
    }

    /**
     * Crea un detalle usando el constructor con snapshot.
     * Recibe idPedido, idProducto y cantidad.
     * El snapshot (nombreProducto, precioUnitario, subtotal) se calcula automáticamente.
     */
    public DetallePedido crear(Long idPedido, Long idProducto, Integer cantidad) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado: " + idPedido));

        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + idProducto));

        // Usa el constructor del model que ya hace el snapshot
        DetallePedido detalle = new DetallePedido(pedido, producto, cantidad);
        return repository.save(detalle);
    }

    /**
     * Solo permite actualizar la cantidad (recalcula subtotal con el precio snapshot).
     * No se toca el precio ni el nombre porque son snapshot histórico.
     */
    public Optional<DetallePedido> actualizarCantidad(Long id, Integer nuevaCantidad) {
        return repository.findById(id).map(d -> {
            d.setCantidad(nuevaCantidad);
            // Recalcula subtotal usando el precio snapshot guardado
            d.setSubtotal(d.getPrecioUnitario().multiply(BigDecimal.valueOf(nuevaCantidad)));
            return repository.save(d);
        });
    }

    public boolean eliminar(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
