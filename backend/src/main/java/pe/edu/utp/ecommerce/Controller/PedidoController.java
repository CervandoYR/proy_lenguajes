package pe.edu.utp.ecommerce.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.ecommerce.model.Pedido;
import pe.edu.utp.ecommerce.model.Usuario;
import pe.edu.utp.ecommerce.repository.PedidoRepository;
import pe.edu.utp.ecommerce.repository.UsuarioRepository;
import pe.edu.utp.ecommerce.service.PedidoService;
import org.springframework.dao.OptimisticLockingFailureException;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService service;
    private final UsuarioRepository usuarioRepository;
    private final PedidoRepository pedidoRepository;

    @GetMapping("/mis-pedidos")
    public ResponseEntity<List<Pedido>> misPedidos(org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(pedidoRepository.findByUsuario(usuario));
    }

    @GetMapping
    public List<Pedido> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Pedido pedido,
                                   org.springframework.security.core.Authentication authentication) {
        // 1. Obtener el usuario autenticado
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Asignar el usuario al pedido (sobrescribe cualquier usuario que venga en el body)
        pedido.setUsuario(usuario);

        // 3. Validar que el usuario tenga dirección
        if (usuario.getDireccion() == null || usuario.getDireccion().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("error", "No se puede generar el pedido porque el usuario no tiene una dirección registrada."));
        }

        // 4. Guardar el pedido
        try {
            Pedido nuevo = service.guardar(pedido);
            return ResponseEntity.ok(nuevo);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        } catch (OptimisticLockingFailureException e) {
            // Captura específica para bloqueo optimista
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Collections.singletonMap("error", "El inventario fue actualizado por otro usuario. Por favor, revisa tu carrito e intenta nuevamente."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Error inesperado: " + e.getMessage()));
        }
    }

    // Endpoint dedicado para cambiar el estado del pedido
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Pedido> actualizarEstado(@PathVariable Long id,
                                                   @RequestParam Pedido.Estado estado) {
        return service.actualizarEstado(id, estado)
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