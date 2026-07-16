package pe.edu.utp.ecommerce.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import pe.edu.utp.ecommerce.model.Producto;
import pe.edu.utp.ecommerce.repository.ProductoRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    @Value("${gemini.api-key:placeholder}")
    private String geminiApiKey;

    private final ProductoRepository productoRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message is required"));
        }

        if ("placeholder".equals(geminiApiKey) || geminiApiKey.trim().isEmpty()) {
            return ResponseEntity.ok(Map.of("response", "La API Key de Gemini no esta configurada. Por favor, revisa el archivo INSTRUCCIONES_GEMINI.md."));
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=" + geminiApiKey;

            List<Producto> productos = productoRepository.findAll();
            String inventario = productos.stream()
                    .filter(Producto::getActivo)
                    .map(p -> {
                        String slug = getSlug(p.getNombre());
                        String productoUrl = "/producto/" + p.getId() + "/" + slug;
                        return String.format("- ID: %d | Producto: %s | Precio: S/ %.2f | Categoria: %s | Stock: %d | Enlace directo: [%s](%s)\n  Desc: %s",
                                p.getId(), p.getNombre(), p.getPrecio(),
                                p.getCategoria() != null ? p.getCategoria().getNombre() : "N/A",
                                p.getStock(), p.getNombre(), productoUrl, p.getDescripcion());
                    })
                    .collect(Collectors.joining("\n"));

            String systemInstruction = "Eres Servitek AI, el especialista técnico de Servitek Technologies. "
                    + "REGLA DE ORO DE BREVEDAD ESTILO APPLE (HIG): Responde de forma ULTRA CONCISA, ejecutiva y directa al grano. "
                    + "ESTRICTAMENTE PROHIBIDO hacer introducciones largas o ensayos (NO digas 'Como ingeniero de sistemas entiendo que...'). "
                    + "Inicia con 1 sola frase corta y clara (ej. 'Para estudios y oficina te recomiendo estas 2 excelentes opciones:') y luego las alternativas en viñetas. "
                    + "ESTRICTAMENTE PROHIBIDO usar emojis. "
                    + "REGLA DE ENLACES: Siempre que recomiendes productos, DEBES poner el enlace en formato Markdown exacto tal como aparece en el inventario, "
                    + "y debajo 1 o 2 líneas clave resumiendo en viñetas cortas por qué conviene para su necesidad (ej. '• Pantalla 120Hz súper fluida\n• SSD rápido para encender al instante'). "
                    + "No excedas las 80 palabras en total por respuesta. "
                    + "Basa tus recomendaciones EXCLUSIVAMENTE en el siguiente inventario real y actualizado de nuestra tienda:\n\n" + inventario;

            Map<String, Object> body = new HashMap<>();

            List<Map<String, Object>> contents = new ArrayList<>();
            contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", systemInstruction + "\n\nConsulta del cliente: " + userMessage))));

            body.put("contents", contents);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> geminiResponse = callGeminiWithRetry(url, entity);

            if (geminiResponse.getStatusCode() == HttpStatus.OK && geminiResponse.getBody() != null) {
                Map<String, Object> respBody = geminiResponse.getBody();
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) respBody.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        String textResponse = (String) parts.get(0).get("text");
                        return ResponseEntity.ok(Map.of("response", textResponse));
                    }
                }
            }

            return ResponseEntity.ok(Map.of("response",
                    "Te presento las mejores alternativas de nuestro catálogo en base a tu consulta:\n\n" + generarFallbackProductos(userMessage)));

        } catch (org.springframework.web.client.HttpServerErrorException.ServiceUnavailable e) {
            // Gemini esta saturado (503) incluso despues de reintentar.
            return ResponseEntity.ok(Map.of("response",
                    "El motor de IA está procesando un alto volumen de consultas en este momento. Sin embargo, basado en tu búsqueda sobre **" + userMessage + "**, te comparto enlaces directos a opciones destacadas de nuestra tienda para que puedas revisarlas de inmediato:\n\n" + generarFallbackProductos(userMessage)));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("response",
                    "Mis sensores principales están sincronizándose, pero aquí tienes acceso directo a las mejores alternativas en nuestra tienda para tu consulta:\n\n" + generarFallbackProductos(userMessage)));
        }
    }

    private String getSlug(String name) {
        if (name == null || name.trim().isEmpty()) return "producto";
        return name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)+", "");
    }

    private String generarFallbackProductos(String consulta) {
        String query = consulta != null ? consulta.toLowerCase() : "";
        List<Producto> productos = productoRepository.findAll();
        List<Producto> filtrados = productos.stream()
                .filter(Producto::getActivo)
                .filter(p -> {
                    String nombre = p.getNombre() != null ? p.getNombre().toLowerCase() : "";
                    String cat = p.getCategoria() != null && p.getCategoria().getNombre() != null ? p.getCategoria().getNombre().toLowerCase() : "";
                    String desc = p.getDescripcion() != null ? p.getDescripcion().toLowerCase() : "";
                    if (query.contains("laptop") || query.contains("estudio") || query.contains("colegio") || query.contains("universidad") || query.contains("clase")) {
                        return nombre.contains("laptop") || cat.contains("laptop") || desc.contains("laptop");
                    }
                    if (query.contains("monitor") || query.contains("pantalla") || query.contains("hz")) {
                        return nombre.contains("monitor") || cat.contains("monitor");
                    }
                    if (query.contains("gpu") || query.contains("tarjeta") || query.contains("video") || query.contains("rtx") || query.contains("juego") || query.contains("gamer")) {
                        return nombre.contains("rtx") || cat.contains("gpu") || nombre.contains("rx") || nombre.contains("hp");
                    }
                    return nombre.contains(query) || cat.contains(query) || desc.contains(query);
                })
                .limit(3)
                .collect(Collectors.toList());

        if (filtrados.isEmpty()) {
            filtrados = productos.stream().filter(Producto::getActivo).limit(3).collect(Collectors.toList());
        }

        return filtrados.stream()
                .map(p -> String.format("- **[%s](%s)** — S/ %.2f\n  • %s",
                        p.getNombre(),
                        "/producto/" + p.getId() + "/" + getSlug(p.getNombre()),
                        p.getPrecio(),
                        p.getCategoria() != null ? p.getCategoria().getNombre() : "Disponibilidad inmediata en Servitek"))
                .collect(Collectors.joining("\n\n"));
    }

    /**
     * Llama a Gemini con hasta 3 intentos si responde 503 (alta demanda),
     * esperando un poco mas entre cada intento (backoff simple).
     */
    private ResponseEntity<Map> callGeminiWithRetry(String url, HttpEntity<Map<String, Object>> entity) {
        int maxAttempts = 3;
        long delayMs = 800;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return restTemplate.postForEntity(url, entity, Map.class);
            } catch (org.springframework.web.client.HttpServerErrorException.ServiceUnavailable e) {
                if (attempt == maxAttempts) {
                    throw e;
                }
                try {
                    Thread.sleep(delayMs);
                } catch (InterruptedException ignored) {
                    Thread.currentThread().interrupt();
                }
                delayMs *= 2; // backoff exponencial simple: 800ms, 1600ms
            }
        }
        // Inalcanzable, pero el compilador lo requiere
        throw new IllegalStateException("No se pudo contactar a Gemini");
    }
}