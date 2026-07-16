package pe.edu.utp.ecommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.utp.ecommerce.DTO.ProductoDTO;
import pe.edu.utp.ecommerce.model.Categoria;
import pe.edu.utp.ecommerce.model.Producto;
import pe.edu.utp.ecommerce.repository.CategoriaRepository;
import pe.edu.utp.ecommerce.repository.ProductoRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository repository;
    private final CategoriaRepository categoriaRepository;

    public List<Producto> listarTodos() {
        return repository.findAll();
    }

    public Optional<Producto> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Producto guardar(ProductoDTO dto) {
        Categoria cat = categoriaRepository.findById(dto.categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Producto p = new Producto();
        p.setCategoria(cat);
        p.setNombre(dto.nombre);
        p.setDescripcion(dto.descripcion);
        p.setPrecio(dto.precio);
        p.setStock(dto.stock);
        p.setImagenUrl(dto.imagenUrl);
        p.setImagenesAdicionales(dto.imagenesAdicionales);
        p.setEspecificaciones(dto.especificaciones);
        p.setModelo3dUrl(dto.modelo3dUrl);
        if (dto.activo != null) p.setActivo(dto.activo);
        if (dto.destacado != null) p.setDestacado(dto.destacado);

        return repository.save(p);
    }

    public Optional<Producto> actualizar(Long id, ProductoDTO dto) {
        return repository.findById(id).map(p -> {
            // Actualizar categoría si se proporciona
            if (dto.categoriaId != null) {
                Categoria cat = categoriaRepository.findById(dto.categoriaId)
                        .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
                p.setCategoria(cat);
            }

            // Actualizar campos solo si vienen en el DTO
            if (dto.nombre != null) p.setNombre(dto.nombre);
            if (dto.descripcion != null) p.setDescripcion(dto.descripcion);
            if (dto.precio != null) p.setPrecio(dto.precio);
            if (dto.stock != null) p.setStock(dto.stock);
            if (dto.imagenUrl != null) p.setImagenUrl(dto.imagenUrl);
            if (dto.imagenesAdicionales != null) p.setImagenesAdicionales(dto.imagenesAdicionales);
            if (dto.especificaciones != null) p.setEspecificaciones(dto.especificaciones);
            if (dto.modelo3dUrl != null) p.setModelo3dUrl(dto.modelo3dUrl);
            if (dto.activo != null) p.setActivo(dto.activo);
            if (dto.destacado != null) p.setDestacado(dto.destacado);

            return repository.save(p);
        });
    }

    public Optional<Producto> toggleDestacado(Long id) {
        return repository.findById(id).map(p -> {
            boolean actual = p.getDestacado() != null && p.getDestacado();
            p.setDestacado(!actual);
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