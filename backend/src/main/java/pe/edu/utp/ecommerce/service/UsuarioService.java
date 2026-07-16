package pe.edu.utp.ecommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pe.edu.utp.ecommerce.model.Usuario;
import pe.edu.utp.ecommerce.repository.UsuarioRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;
    private final BCryptPasswordEncoder encoder;

    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Usuario guardar(Usuario usuario) {
        String hash = encoder.encode(usuario.getPassword());
        usuario.setPasswordHash(hash);
        return repository.save(usuario);
    }

    public Optional<Usuario> actualizar(Long id, Usuario datos) {
        return repository.findById(id).map(u -> {
            u.setNombre(datos.getNombre());
            u.setEmail(datos.getEmail());
            u.setTelefono(datos.getTelefono());
            if (datos.getDireccion() != null) {
                u.setDireccion(datos.getDireccion());
            }
            if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
                u.setPasswordHash(encoder.encode(datos.getPassword()));
            }
            u.setRol(datos.getRol());
            u.setActivo(datos.getActivo());
            return repository.save(u);
        });
    }

    public boolean eliminar(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    // ✅ MÉTODO PARA VALIDAR CONTRASEÑA
    public boolean validarPassword(Long id, String rawPassword) {
        Optional<Usuario> userOpt = repository.findById(id);
        if (userOpt.isEmpty()) {
            return false;
        }
        Usuario usuario = userOpt.get();
        return encoder.matches(rawPassword, usuario.getPasswordHash());
    }
}