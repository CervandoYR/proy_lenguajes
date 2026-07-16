package pe.edu.utp.ecommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.utp.ecommerce.model.Pago;
import pe.edu.utp.ecommerce.repository.PagoRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository repository;

    public List<Pago> listarTodos() {
        return repository.findAll();
    }

    public Optional<Pago> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Pago guardar(Pago pago) {
        return repository.save(pago);
    }

    public Optional<Pago> actualizarEstado(Long id, Pago.EstadoPago nuevoEstado) {
        return repository.findById(id).map(p -> {
            p.setEstado(nuevoEstado);
            return repository.save(p);
        });
    }

    public boolean eliminar(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
