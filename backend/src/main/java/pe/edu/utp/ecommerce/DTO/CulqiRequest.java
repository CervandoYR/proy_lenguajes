package pe.edu.utp.ecommerce.DTO;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CulqiRequest {
    private String token; // The card token tok_test_...
    private BigDecimal amount;
    private String email;
    private Long orderId;
}
