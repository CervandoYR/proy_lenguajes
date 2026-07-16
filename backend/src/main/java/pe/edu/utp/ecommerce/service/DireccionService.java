package pe.edu.utp.ecommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.utp.ecommerce.model.Direccion;
import pe.edu.utp.ecommerce.model.Usuario;
import pe.edu.utp.ecommerce.repository.DireccionRepository;
import pe.edu.utp.ecommerce.repository.UsuarioRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DireccionService {

    private final DireccionRepository repository;
    private final UsuarioRepository usuarioRepository;

    public List<Direccion> listarTodas() {
        return repository.findAll();
    }

    public List<Direccion> listarPorUsuario(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId);
    }

    public Optional<Direccion> buscarPorId(Long id) {
        return repository.findById(id);
    }

    private void sincronizarUsuario(Direccion direccion) {
        if (direccion.getUsuario() != null && direccion.getUsuario().getId() != null) {
            if (Boolean.TRUE.equals(direccion.getPredeterminada())) {
                usuarioRepository.findById(direccion.getUsuario().getId()).ifPresent(u -> {
                    String strDir = direccion.getCalle() + ", " + direccion.getCiudad() + " - " + direccion.getDepartamento();
                    u.setDireccion(strDir);
                    usuarioRepository.save(u);
                });
            }
        }
    }

    public Direccion guardar(Direccion direccion) {
        Direccion guardada = repository.save(direccion);
        sincronizarUsuario(guardada);
        return guardada;
    }

    public Optional<Direccion> actualizar(Long id, Direccion datos) {
        return repository.findById(id).map(d -> {
            d.setAlias(datos.getAlias());
            d.setCalle(datos.getCalle());
            d.setCiudad(datos.getCiudad());
            d.setDepartamento(datos.getDepartamento());
            d.setCodigoPostal(datos.getCodigoPostal());
            d.setPredeterminada(datos.getPredeterminada());
            d.setReferencia(datos.getReferencia());
            d.setLatitud(datos.getLatitud());
            d.setLongitud(datos.getLongitud());
            Direccion actualizada = repository.save(d);
            sincronizarUsuario(actualizada);
            return actualizada;
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
