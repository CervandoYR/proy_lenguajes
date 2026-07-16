package pe.edu.utp.ecommerce.DTO;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
