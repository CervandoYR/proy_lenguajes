package pe.edu.utp.ecommerce.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.ecommerce.model.Usuario;
import pe.edu.utp.ecommerce.service.UsuarioService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService service;

    @org.springframework.beans.factory.annotation.Autowired
    private javax.sql.DataSource dataSource;

    @GetMapping("/diagnostico-bd")
    public ResponseEntity<Map<String, Object>> diagnosticoBd() {
        Map<String, Object> info = new HashMap<>();
        try (java.sql.Connection conn = dataSource.getConnection()) {
            info.put("jdbcUrl", conn.getMetaData().getURL());
            info.put("dbUser", conn.getMetaData().getUserName());
            info.put("dbProduct", conn.getMetaData().getDatabaseProductName() + " " + conn.getMetaData().getDatabaseProductVersion());
            info.put("catalogOrSchema", conn.getCatalog());
        } catch (Exception e) {
            info.put("error", e.getMessage());
        }
        info.put("totalUsuarios", service.listarTodos().size());
        return ResponseEntity.ok(info);
    }

    @GetMapping
    public List<Usuario> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Usuario crear(@RequestBody Usuario usuario) {
        return service.guardar(usuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id,
                                              @RequestBody Usuario usuario) {
        return service.actualizar(id, usuario)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return service.eliminar(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    // ✅ ENDPOINT CORRECTO - Verifica que esté así
    @PostMapping("/{id}/validar-password")
    public ResponseEntity<Map<String, Boolean>> validarPassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String password = request.get("password");
        boolean isValid = service.validarPassword(id, password);

        Map<String, Boolean> response = new HashMap<>();
        response.put("valid", isValid);

        return ResponseEntity.ok(response);
    }
}