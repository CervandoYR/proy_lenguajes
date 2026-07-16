package pe.edu.utp.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.ecommerce.model.Categoria;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    Optional<Categoria> findBySlug(String slug);
    Optional<Categoria> findByNombre(String nombre);
}