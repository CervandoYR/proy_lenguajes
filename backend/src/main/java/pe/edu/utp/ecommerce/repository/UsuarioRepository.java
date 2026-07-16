package pe.edu.utp.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.ecommerce.model.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
}
