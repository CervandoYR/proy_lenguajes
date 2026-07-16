package pe.edu.utp.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.ecommerce.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    java.util.List<Producto> findByCategoriaId(Long categoriaId);
}