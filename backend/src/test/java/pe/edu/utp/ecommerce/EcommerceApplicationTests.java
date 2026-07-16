package pe.edu.utp.ecommerce;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class EcommerceApplicationTests {

    @org.springframework.beans.factory.annotation.Autowired
    private pe.edu.utp.ecommerce.repository.UsuarioRepository usuarioRepository;

    @org.springframework.beans.factory.annotation.Autowired
    private javax.sql.DataSource dataSource;

	@Test
	void contextLoads() throws Exception {
        System.out.println("=== DIAGNOSTICO BASE DE DATOS LOCAL ===");
        try (java.sql.Connection conn = dataSource.getConnection()) {
            System.out.println("JDBC URL CONECTADO: " + conn.getMetaData().getURL());
            System.out.println("USER CONECTADO: " + conn.getMetaData().getUserName());
        }
        System.out.println("LISTA DE USUARIOS EN ESTA BASE DE DATOS:");
        usuarioRepository.findAll().forEach(u -> 
            System.out.println(" -> ID: " + u.getId() + " | Email: " + u.getEmail() + " | Nombre: " + u.getNombre())
        );
        System.out.println("=== FIN DIAGNOSTICO ===");
	}
}
