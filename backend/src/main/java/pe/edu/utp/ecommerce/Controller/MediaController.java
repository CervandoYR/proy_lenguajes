package pe.edu.utp.ecommerce.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pe.edu.utp.ecommerce.service.CloudinaryService;

import java.util.Collections;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final CloudinaryService cloudinaryService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String url = cloudinaryService.uploadImage(file);
            return ResponseEntity.ok(Collections.singletonMap("url", url));
        } catch (Exception e) {
            System.err.println("[MediaController Error]: " + e.getMessage());
            return ResponseEntity.badRequest().body("No se pudo procesar la imagen adjunta. Verifique que sea un archivo de imagen válido e intente nuevamente.");
        }
    }
}
