package pe.edu.utp.ecommerce.DTO;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String codigo;
    private String nuevaPassword;
}
