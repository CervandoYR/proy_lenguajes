package pe.edu.utp.ecommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.utp.ecommerce.model.Categoria;
import pe.edu.utp.ecommerce.repository.CategoriaRepository;

import java.text.Normalizer;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository repository;

    public List<Categoria> listarTodas() {
        return repository.findAll();
    }

    public Optional<Categoria> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Categoria guardar(Categoria categoria) {
        // Si no mandan slug, lo generamos desde el nombre
        if (categoria.getSlug() == null || categoria.getSlug().isBlank()) {
            categoria.setSlug(generarSlug(categoria.getNombre()));
        }
        return repository.save(categoria);
    }

    public Optional<Categoria> actualizar(Long id, Categoria datos) {
        return repository.findById(id).map(c -> {
            c.setNombre(datos.getNombre());
            // Si mandan slug nuevo lo usamos, si no, lo regeneramos desde el nombre
            if (datos.getSlug() != null && !datos.getSlug().isBlank()) {
                c.setSlug(datos.getSlug());
            } else {
                c.setSlug(generarSlug(datos.getNombre()));
            }
            c.setDescripcion(datos.getDescripcion());
            c.setActivo(datos.getActivo());
            return repository.save(c);
        });
    }

    public boolean eliminar(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Convierte un nombre en slug URL-friendly.
     * Ejemplo: "Ropa Deportiva"   → "ropa-deportiva"
     *          "Electrónica y más!" → "electronica-y-mas"
     */
    private String generarSlug(String nombre) {
        return Normalizer
                .normalize(nombre, Normalizer.Form.NFD)  // descompone tildes: á → a + ́
                .replaceAll("\\p{M}", "")                 // elimina diacríticos (tildes, ñ → n)
                .toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")          // elimina caracteres especiales
                .replaceAll("[\\s]+", "-")                 // espacios → guión
                .replaceAll("-+", "-");                    // guiones dobles → uno solo
    }
}