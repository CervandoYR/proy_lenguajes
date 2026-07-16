package pe.edu.utp.ecommerce.Config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import pe.edu.utp.ecommerce.model.Producto;
import pe.edu.utp.ecommerce.repository.ProductoRepository;
import java.util.List;

@Component
public class TestDataLoader implements CommandLineRunner {

    private final ProductoRepository repo;
    private final JdbcTemplate jdbcTemplate;

    public TestDataLoader(ProductoRepository repo, JdbcTemplate jdbcTemplate) {
        this.repo = repo;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            jdbcTemplate.update("UPDATE productos SET version = 0 WHERE version IS NULL");
        } catch (Exception ignored) {}

        List<Producto> productos = repo.findAll();
        String testSpecs = "{\"Procesador\":\"Intel Core i9 14900K\",\"Memoria RAM\":\"32GB DDR5 6000MHz\",\"Almacenamiento\":\"2TB NVMe SSD Gen4\",\"Tarjeta Grafica\":\"NVIDIA GeForce RTX 4080 Super\",\"Fuente de Poder\":\"850W 80+ Gold\",\"Garantia\":\"12 Meses\"}";
        String testImages = "[\"https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800\",\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800\",\"https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=800\"]";

        for (int i = 0; i < Math.min(4, productos.size()); i++) {
            Producto p = productos.get(i);
            p.setEspecificaciones(testSpecs);
            p.setImagenesAdicionales(testImages);
            if (p.getImagenUrl() == null || p.getImagenUrl().isEmpty()) {
                p.setImagenUrl("https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800");
            }
            p.setModelo3dUrl("");
            if (p.getVersion() == null) {
                p.setVersion(0L);
            }
            repo.save(p);
        }
    }
}
