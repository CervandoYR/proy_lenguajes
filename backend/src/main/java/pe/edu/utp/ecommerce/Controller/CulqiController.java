package pe.edu.utp.ecommerce.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.ecommerce.DTO.CulqiRequest;
import pe.edu.utp.ecommerce.service.CulqiService;

import java.util.Collections;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class CulqiController {

    private final CulqiService culqiService;

    @PostMapping("/procesar")
    public ResponseEntity<?> procesarPago(@RequestBody CulqiRequest request) {
        try {
            String resultado = culqiService.procesarPago(request);
            return ResponseEntity.ok(Collections.singletonMap("mensaje", resultado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}
