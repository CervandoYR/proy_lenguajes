package pe.edu.utp.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.ecommerce.model.Pago;

public interface PagoRepository extends JpaRepository<Pago, Long> {
}
