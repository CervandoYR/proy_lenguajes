package pe.edu.utp.ecommerce.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import pe.edu.utp.ecommerce.DTO.CulqiRequest;
import pe.edu.utp.ecommerce.model.Pago;
import pe.edu.utp.ecommerce.model.Pedido;
import pe.edu.utp.ecommerce.repository.PagoRepository;
import pe.edu.utp.ecommerce.repository.PedidoRepository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CulqiService {

    @Value("${culqi.private-key}")
    private String privateKey;

    private final PedidoRepository pedidoRepository;
    private final PagoRepository pagoRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public String procesarPago(CulqiRequest request) throws Exception {
        Pedido pedido = pedidoRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (pedido.getEstado() == Pedido.Estado.PAGADO) {
            throw new RuntimeException("El pedido ya se encuentra pagado");
        }

        // Convertir soles a centimos para Culqi
        long amountInCents = request.getAmount().multiply(new java.math.BigDecimal("100")).longValue();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(privateKey);

        Map<String, Object> body = new HashMap<>();
        body.put("amount", amountInCents);
        body.put("currency_code", "PEN");
        body.put("email", request.getEmail());
        body.put("source_id", request.getToken());
        body.put("description", "Orden #" + pedido.getId());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            // Si la llave privada es de prueba/dummy o el token fue generado con prefijo de simulación en sandbox
            if (privateKey.equals("sk_test_dummy_key_replace_me") || request.getToken().startsWith("tok_test_sim_")) {
                String token = request.getToken();
                if (token.contains("40000400") || token.contains("insufficient_funds")) {
                    throw new RuntimeException("El saldo de tu tarjeta no es suficiente para realizar esta compra. Por favor, intenta con otra tarjeta o medio de pago.");
                }
                if (token.contains("40000200") || token.contains("stolen_card")) {
                    throw new RuntimeException("La tarjeta fue reportada como robada o perdida. Por favor, utiliza otra tarjeta para finalizar tu pago.");
                }
                if (token.contains("54000200") || token.contains("incorrect_cvv")) {
                    throw new RuntimeException("El código de seguridad (CVV) ingresado es incorrecto. Por favor, verifica los 3 o 4 dígitos e inténtalo de nuevo.");
                }
                // Escenario de éxito
                String chargeId = "chr_test_" + UUID.randomUUID().toString().substring(0, 16);
                registrarPagoExitoso(pedido, chargeId);
                return chargeId;
            }

            ResponseEntity<Map> response = restTemplate.postForEntity("https://api.culqi.com/v2/charges", entity, Map.class);
            
            if (response.getStatusCode() == HttpStatus.CREATED || response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = response.getBody();
                String chargeId = (String) responseBody.get("id");
                registrarPagoExitoso(pedido, chargeId);
                return chargeId;
            } else {
                throw new RuntimeException("Error al confirmar el cargo en la pasarela de pago.");
            }
        } catch (HttpStatusCodeException httpEx) {
            String responseBody = httpEx.getResponseBodyAsString();
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(responseBody);
                if (root.has("user_message")) {
                    throw new RuntimeException(root.get("user_message").asText());
                } else if (root.has("merchant_message")) {
                    throw new RuntimeException(root.get("merchant_message").asText());
                } else if (root.has("message")) {
                    throw new RuntimeException(root.get("message").asText());
                }
            } catch (RuntimeException rex) {
                throw rex;
            } catch (Exception parseEx) {
                // Si no se puede parsear JSON, ignorar y usar estado general
            }
            throw new RuntimeException("Rechazo Culqi (" + httpEx.getStatusCode() + "): " + httpEx.getStatusText());
        } catch (RuntimeException rex) {
            throw rex;
        } catch (Exception e) {
            throw new RuntimeException("El cargo fue rechazado: " + e.getMessage());
        }
    }

    private void registrarPagoExitoso(Pedido pedido, String chargeId) {
        pedido.setEstado(Pedido.Estado.PAGADO);
        pedidoRepository.save(pedido);

        Pago pago = new Pago();
        pago.setPedido(pedido);
        pago.setMonto(pedido.getTotal());
        pago.setMetodo(Pago.Metodo.TARJETA);
        pago.setEstado(Pago.EstadoPago.APROBADO);
        pago.setReferencia(chargeId);
        pago.setFechaPago(LocalDateTime.now());
        
        pagoRepository.save(pago);
    }
}
