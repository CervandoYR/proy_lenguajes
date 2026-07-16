package pe.edu.utp.ecommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.utp.ecommerce.model.DetallePedido;
import pe.edu.utp.ecommerce.model.Pedido;
import pe.edu.utp.ecommerce.model.Producto;
import pe.edu.utp.ecommerce.model.Usuario;
import pe.edu.utp.ecommerce.repository.PedidoRepository;
import pe.edu.utp.ecommerce.repository.ProductoRepository;


import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository repository;
    private final ProductoRepository productoRepository;

    public List<Pedido> listarTodos() {
        return repository.findAll();
    }

    public Optional<Pedido> buscarPorId(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public Pedido guardar(Pedido pedido) {
        Usuario usuario = pedido.getUsuario();
        if (usuario == null) {
            throw new IllegalArgumentException("El pedido debe tener un usuario asociado.");
        }
        if (usuario.getDireccion() == null || usuario.getDireccion().trim().isEmpty()) {
            throw new IllegalStateException("El usuario no tiene una dirección registrada.");
        }

        if (pedido.getDetalles() != null) {
            for (DetallePedido detalle : pedido.getDetalles()) {
                // Obtener el producto completo desde la BD
                Producto prod = productoRepository.findById(detalle.getProducto().getId())
                        .orElseThrow(() -> new IllegalArgumentException("El producto seleccionado en tu carrito (ID: " + detalle.getProducto().getId() + ") ya no se encuentra disponible o fue actualizado en el catálogo. Por favor, vacía tu carrito y agrégalo nuevamente."));

                // Validar stock
                if (prod.getStock() < detalle.getCantidad()) {
                    throw new IllegalStateException("Stock insuficiente para: " + prod.getNombre());
                }

                // Descontar stock
                prod.setStock(prod.getStock() - detalle.getCantidad());
                productoRepository.save(prod); // Esto actualiza la versión

                // ✅ REASIGNAR el producto recuperado al detalle (evita el problema de version null)
                detalle.setProducto(prod);

                // Completar datos del detalle
                detalle.setPedido(pedido);
                detalle.setNombreProducto(prod.getNombre());

                // Si no viene precio unitario, usar el del producto
                if (detalle.getPrecioUnitario() == null) {
                    detalle.setPrecioUnitario(prod.getPrecio());
                }

                // ✅ CALCULAR EL SUBTOTAL (cantidad * precio unitario)
                BigDecimal subtotal = detalle.getPrecioUnitario()
                        .multiply(BigDecimal.valueOf(detalle.getCantidad()));
                detalle.setSubtotal(subtotal);
            }
        }

        // Guardar el pedido (cascada guardará los detalles)
        return repository.save(pedido);
    }

    public Optional<Pedido> actualizarEstado(Long id, Pedido.Estado nuevoEstado) {
        return repository.findById(id).map(p -> {
            p.setEstado(nuevoEstado);
            return repository.save(p);
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
