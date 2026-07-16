package pe.edu.utp.ecommerce.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.ecommerce.model.DetallePedido;
import pe.edu.utp.ecommerce.service.DetallePedidoService;

import java.util.List;

@RestController
@RequestMapping("/api/detalle-pedido")
@RequiredArgsConstructor
public class DetallePedidoController {

    private final DetallePedidoService service;

    @GetMapping
    public List<DetallePedido> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetallePedido> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/detalle-pedido?idPedido=1&idProducto=3&cantidad=2
     * No recibe un JSON de DetallePedido completo porque el snapshot
     * se construye automáticamente en el service a partir del producto real.
     */
    @PostMapping
    public ResponseEntity<DetallePedido> crear(
            @RequestParam Long idPedido,
            @RequestParam Long idProducto,
            @RequestParam Integer cantidad) {
        try {
            DetallePedido detalle = service.crear(idPedido, idProducto, cantidad);
            return ResponseEntity.ok(detalle);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * PATCH /api/detalle-pedido/{id}/cantidad?valor=5
     * Solo se puede cambiar la cantidad; el precio snapshot no se modifica.
     */
    @PatchMapping("/{id}/cantidad")
    public ResponseEntity<DetallePedido> actualizarCantidad(
            @PathVariable Long id,
            @RequestParam Integer valor) {
        return service.actualizarCantidad(id, valor)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return service.eliminar(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
