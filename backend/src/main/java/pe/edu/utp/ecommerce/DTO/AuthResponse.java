package pe.edu.utp.ecommerce.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.edu.utp.ecommerce.model.Usuario;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private UsuarioDTO user;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UsuarioDTO {
        private Long id;
        private String email;
        private String nombre;
        private String rol;
        private String telefono;    // ✅ Nuevo
        private String direccion;   // ✅ Nuevo

        
        public static UsuarioDTO fromUsuario(Usuario u) {
            return new UsuarioDTO(u.getId(), u.getEmail(), u.getNombre(), u.getRol().name(),u.getTelefono(),u.getDireccion());
        }
    }
}
