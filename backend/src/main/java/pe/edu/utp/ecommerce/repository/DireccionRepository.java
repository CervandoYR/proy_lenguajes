package pe.edu.utp.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.ecommerce.model.Direccion;
import java.util.List;

public interface DireccionRepository extends JpaRepository<Direccion, Long> {
    List<Direccion> findByUsuarioId(Long usuarioId);
}
