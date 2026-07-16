package pe.edu.utp.ecommerce.Config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import pe.edu.utp.ecommerce.model.Categoria;
import pe.edu.utp.ecommerce.model.Producto;
import pe.edu.utp.ecommerce.model.Usuario;
import pe.edu.utp.ecommerce.repository.CategoriaRepository;
import pe.edu.utp.ecommerce.repository.DetallePedidoRepository;
import pe.edu.utp.ecommerce.repository.PagoRepository;
import pe.edu.utp.ecommerce.repository.PedidoRepository;
import pe.edu.utp.ecommerce.repository.ProductoRepository;
import pe.edu.utp.ecommerce.repository.UsuarioRepository;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final PedidoRepository pedidoRepository;
    private final PagoRepository pagoRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            jdbcTemplate.update("ALTER TABLE productos MODIFY COLUMN imagen_url LONGTEXT");
            jdbcTemplate.update("ALTER TABLE productos MODIFY COLUMN modelo_3d_url LONGTEXT");
            jdbcTemplate.update("ALTER TABLE productos MODIFY COLUMN imagenes_adicionales LONGTEXT");
            jdbcTemplate.update("ALTER TABLE productos MODIFY COLUMN especificaciones LONGTEXT");
            jdbcTemplate.update("ALTER TABLE direcciones ADD COLUMN latitud DOUBLE");
            jdbcTemplate.update("ALTER TABLE direcciones ADD COLUMN longitud DOUBLE");
            jdbcTemplate.update("ALTER TABLE direcciones ADD COLUMN referencia VARCHAR(255)");
        } catch (Exception ignored) {}
        // Limpieza automática e integral de usuarios de prueba antiguos ("cervando@servitek.pe") y sus relaciones
        for (String emailToDelete : java.util.List.of("cervando@servitek.pe")) {
            usuarioRepository.findByEmail(emailToDelete).ifPresent(u -> {
                try {
                    Long uid = u.getId();
                    try { jdbcTemplate.update("DELETE FROM items_carrito WHERE id_carrito IN (SELECT id_carrito FROM carritos WHERE id_usuario = ?)", uid); } catch (Exception ignored) {}
                    try { jdbcTemplate.update("DELETE FROM carritos WHERE id_usuario = ?", uid); } catch (Exception ignored) {}
                    try { jdbcTemplate.update("DELETE FROM detalle_pedidos WHERE id_pedido IN (SELECT id_pedido FROM pedidos WHERE id_usuario = ?)", uid); } catch (Exception ignored) {}
                    try { jdbcTemplate.update("DELETE FROM pedidos WHERE id_usuario = ?", uid); } catch (Exception ignored) {}
                    try { jdbcTemplate.update("DELETE FROM direcciones WHERE id_usuario = ?", uid); } catch (Exception ignored) {}
                    try { jdbcTemplate.update("DELETE FROM valoraciones WHERE id_usuario = ?", uid); } catch (Exception ignored) {}
                    try { jdbcTemplate.update("DELETE FROM notificaciones WHERE id_usuario = ?", uid); } catch (Exception ignored) {}
                    try { jdbcTemplate.update("DELETE FROM tokens_recuperacion WHERE id_usuario = ?", uid); } catch (Exception ignored) {}
                    usuarioRepository.delete(u);
                    System.out.println("[Servitek] Usuario y sus dependencias eliminados exitosamente -> " + emailToDelete);
                } catch (Exception e) {
                    System.out.println("[Servitek] No se pudo eliminar el usuario " + emailToDelete + ": " + e.getMessage());
                }
            });
        }

        if (usuarioRepository.findByEmail("admin@servitek.pe").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNombre("Administrador Servitek");
            admin.setEmail("admin@servitek.pe");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRol(Usuario.Rol.ADMIN);
            admin.setTelefono("987654321");
            usuarioRepository.save(admin);
            System.out.println("[Servitek] Usuario ADMIN creado exitosamente -> Email: admin@servitek.pe | Password: admin123");
        } else {
            // Asegurar que el usuario admin mantenga el rol ADMIN y la contraseña admin123 siempre activa
            Usuario admin = usuarioRepository.findByEmail("admin@servitek.pe").get();
            admin.setRol(Usuario.Rol.ADMIN);
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            usuarioRepository.save(admin);
            System.out.println("[Servitek] Usuario ADMIN verificado/actualizado -> Email: admin@servitek.pe | Password: admin123");
        }

        // 1. Verificar y cargar las 6 Categorías oficiales
        Categoria laptops = categoriaRepository.findBySlug("laptops")
                .orElseGet(() -> categoriaRepository.save(
                        new Categoria("Laptops", "laptops", "Portátiles ultraligeras y estaciones de potencia para arquitectura, desarrollo y gaming")));
        Categoria computadoras = categoriaRepository.findBySlug("computadoras-escritorio")
                .orElseGet(() -> categoriaRepository.save(
                        new Categoria("Computadoras de Escritorio", "computadoras-escritorio", "Torres armadas de alto rendimiento, Mac Mini y estaciones de escritorio profesionales")));
        Categoria monitores = categoriaRepository.findBySlug("monitores")
                .orElseGet(() -> categoriaRepository.save(
                        new Categoria("Monitores", "monitores", "Pantallas OLED, QHD y 4K con alta tasa de refresco para productividad y gaming competitivo")));
        Categoria perifericos = categoriaRepository.findBySlug("perifericos")
                .orElseGet(() -> categoriaRepository.save(
                        new Categoria("Perifericos", "perifericos", "Teclados mecánicos, mouse ultraligeros y audífonos de alta fidelidad con cancelación de ruido")));
        Categoria componentes = categoriaRepository.findBySlug("componentes")
                .orElseGet(() -> categoriaRepository.save(
                        new Categoria("Componentes", "componentes", "Procesadores, memorias RAM DDR5, discos SSD NVMe Gen4 y tarjetas gráficas de última generación")));
        Categoria accesorios = categoriaRepository.findBySlug("accesorios")
                .orElseGet(() -> categoriaRepository.save(
                        new Categoria("Accesorios", "accesorios", "Hubs multipuerto USB-C, soportes ergonómicos de aluminio y accesorios de máxima durabilidad")));

        System.out.println("[Servitek] 6 Categorías verificadas/creadas con éxito.");

        // 2. Si hay menos de 30 productos (ej. datos de prueba antiguos o primera ejecución), cargamos los 30 productos reales
        if (productoRepository.count() < 30) {
            pagoRepository.deleteAll();
            detallePedidoRepository.deleteAll();
            pedidoRepository.deleteAll();
            productoRepository.deleteAll(); // Limpiar productos de prueba antiguos sin JSON para garantizar catálogo limpio

            // Laptops
            crearProducto(laptops,
                    "Apple MacBook Air 13\" M4",
                    "Ultrafina con chip M4 y pantalla Liquid Retina de 13.6 pulgadas para productividad silenciosa sin ventilador.",
                    new BigDecimal("5319.05"), 15,
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000",
                    "{\"Procesador\": \"Chip Apple M4 (10 núcleos CPU, 8 núcleos GPU)\", \"RAM\": \"16GB memoria unificada\", \"Almacenamiento\": \"256GB SSD ultrarrápido\", \"Pantalla\": \"Liquid Retina 13.6 pulgadas 500 nits\", \"Batería\": \"Hasta 18 horas de autonomía\"}");

            crearProducto(laptops,
                    "Lenovo Legion Pro 5 16IRX9",
                    "Potencia extrema para gaming y 3D con Intel Core i9 de 14ta generación y gráfica dedicada RTX 4070 de 8GB.",
                    new BigDecimal("8187.08"), 8,
                    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=1000",
                    "{\"Procesador\": \"Intel Core i9-14900HX (24 núcleos)\", \"Tarjeta Gráfica\": \"NVIDIA GeForce RTX 4070 8GB GDDR6\", \"RAM\": \"32GB DDR5 5600MHz dual-channel\", \"Almacenamiento\": \"1TB SSD NVMe PCIe 4.0\", \"Pantalla\": \"16 pulgadas WQXGA (2560x1600) 165Hz IPS\"}");

            crearProducto(laptops,
                    "ASUS TUF Gaming A15",
                    "Durabilidad grado militar con Ryzen 7 y RTX 4060 para jugar en 1080p a 144Hz con refrigeración mejorada.",
                    new BigDecimal("4511.06"), 12,
                    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=1000",
                    "{\"Procesador\": \"AMD Ryzen 7 7735HS (8 núcleos / 16 hilos)\", \"Tarjeta Gráfica\": \"NVIDIA GeForce RTX 4060 8GB GDDR6\", \"RAM\": \"16GB DDR5 4800MHz\", \"Almacenamiento\": \"512GB SSD NVMe M.2\", \"Pantalla\": \"15.6 pulgadas FHD (1920x1080) 144Hz\"}");

            crearProducto(laptops,
                    "HP Pavilion 15",
                    "Portátil ligera y confiable para oficina y universidad con Core i5 de 13ra generación y 16GB de RAM.",
                    new BigDecimal("2659.05"), 20,
                    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000",
                    "{\"Procesador\": \"Intel Core i5-1335U (10 núcleos)\", \"RAM\": \"16GB DDR4 3200MHz\", \"Almacenamiento\": \"512GB SSD PCIe NVMe\", \"Pantalla\": \"15.6 pulgadas FHD (1920x1080) IPS\", \"Gráficos\": \"Intel Iris Xe Graphics\"}");

            crearProducto(laptops,
                    "Dell Inspiron 15 3520",
                    "Eficiencia diaria para tareas ágiles con pantalla FHD fluida de 120Hz y almacenamiento SSD NVMe.",
                    new BigDecimal("2279.05"), 25,
                    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=1000",
                    "{\"Procesador\": \"Intel Core i5-1235U (10 núcleos / 12 hilos)\", \"RAM\": \"8GB DDR4 2666MHz (ampliable)\", \"Almacenamiento\": \"512GB SSD M.2 NVMe\", \"Pantalla\": \"15.6 pulgadas FHD (1920x1080) 120Hz WVA antirreflejo\", \"Gráficos\": \"Intel Iris Xe\"}");

            crearProducto(laptops,
                    "MSI Katana 15 B13V",
                    "Rendimiento competitivo en eSports impulsado por Core i7 y arquitectura Ada Lovelace RTX 4050 con teclado RGB.",
                    new BigDecimal("4277.07"), 14,
                    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=1000",
                    "{\"Procesador\": \"Intel Core i7-13620H (10 núcleos)\", \"Tarjeta Gráfica\": \"NVIDIA GeForce RTX 4050 6GB GDDR6\", \"RAM\": \"16GB DDR5 5200MHz\", \"Almacenamiento\": \"512GB SSD NVMe PCIe Gen4\", \"Pantalla\": \"15.6 pulgadas FHD (1920x1080) 144Hz IPS\"}");

            crearProducto(laptops,
                    "Apple MacBook Pro 16\" M4 Pro",
                    "Estación de trabajo móvil definitiva para creadores y desarrolladores con autonomía extrema de hasta 24 horas.",
                    new BigDecimal("12349.05"), 5,
                    "https://images.unsplash.com/photo-1537498425277-c283d32ef9db?auto=format&fit=crop&q=80&w=1000",
                    "{\"Procesador\": \"Chip Apple M4 Pro (14 núcleos CPU, 20 núcleos GPU)\", \"RAM\": \"24GB memoria unificada\", \"Almacenamiento\": \"512GB SSD ultrarrápido\", \"Pantalla\": \"Liquid Retina XDR 16.2 pulgadas (3456x2234) ProMotion 120Hz\", \"Puertos\": \"3x Thunderbolt 5, HDMI 2.1, SDXC, MagSafe 3\"}");

            crearProducto(laptops,
                    "Samsung Galaxy Book4 Pro",
                    "Diseño ultra delgado en aluminio con pantalla táctil Dynamic AMOLED 2K y procesador con inteligencia artificial.",
                    new BigDecimal("5921.06"), 9,
                    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=1000",
                    "{\"Procesador\": \"Intel Core Ultra 7 155H con NPU dedicada para IA\", \"RAM\": \"16GB LPDDR5X\", \"Almacenamiento\": \"512GB SSD NVMe PCIe 4.0\", \"Pantalla\": \"AMOLED 14 pulgadas 2.8K (2880x1800) 120Hz táctil y Glare Free\", \"Peso\": \"1.23 kg ultraligero\"}");

            // Computadoras de Escritorio
            crearProducto(computadoras,
                    "Lenovo Legion Tower 5i",
                    "Torre gaming lista para jugar en 2K Ultra con chasis optimizado para flujo de aire y tarjeta gráfica RTX 4070.",
                    new BigDecimal("7359.08"), 7,
                    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1000",
                    "{\"Procesador\": \"Intel Core i7-14700F (20 núcleos / 28 hilos)\", \"Tarjeta Gráfica\": \"NVIDIA GeForce RTX 4070 12GB GDDR6X\", \"RAM\": \"32GB DDR5 5600MHz dual-channel\", \"Almacenamiento\": \"1TB SSD NVMe PCIe 4.0\", \"Conectividad\": \"Wi-Fi 6E, Bluetooth 5.3 y LAN Gigabit 2.5G\"}");

            crearProducto(computadoras,
                    "HP OMEN 25L",
                    "Estación de escritorio compacta y ampliable con procesador Ryzen 7, refrigeración líquida y gráficos RTX 4060 Ti de 16GB.",
                    new BigDecimal("6974.07"), 6,
                    "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1000",
                    "{\"Procesador\": \"AMD Ryzen 7 7700X (8 núcleos / 16 hilos hasta 5.4 GHz)\", \"Tarjeta Gráfica\": \"NVIDIA GeForce RTX 4060 Ti 16GB GDDR6\", \"RAM\": \"32GB DDR5 Kingston FURY RGB\", \"Almacenamiento\": \"1TB SSD WD Black NVMe PCIe 4.0\", \"Refrigeración\": \"Enfriamiento líquido AIO 120mm RGB\"}");

            crearProducto(computadoras,
                    "Apple Mac Mini M4",
                    "Cubo supercompacto de 12.7 cm con potencia de sobremesa superior e IA integrada Apple Intelligence.",
                    new BigDecimal("3134.05"), 18,
                    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000",
                    "{\"Procesador\": \"Chip Apple M4 (10 núcleos CPU, 10 núcleos GPU)\", \"RAM\": \"16GB memoria unificada\", \"Almacenamiento\": \"256GB SSD PCIe\", \"Puertos Frontales\": \"2x USB-C y conector de audífonos de alta impedancia\", \"Puertos Traseros\": \"3x Thunderbolt 4, HDMI 2.1 y Gigabit Ethernet\"}");

            crearProducto(computadoras,
                    "ASUS ROG Strix G16CH",
                    "Máquina eSports de nivel profesional equipada con procesador i9 extrema y tarjeta gráfica RTX 4070 Super.",
                    new BigDecimal("8999.10"), 4,
                    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000",
                    "{\"Procesador\": \"Intel Core i9-14900F (24 núcleos / 32 hilos)\", \"Tarjeta Gráfica\": \"NVIDIA GeForce RTX 4070 Super 12GB GDDR6X\", \"RAM\": \"32GB DDR5 6000MHz blindada\", \"Almacenamiento\": \"2TB SSD NVMe Gen4x4 ultrarrápido\", \"Chasis\": \"Iluminación Aura Sync ARGB frontal y asa de transporte\"}");

            // Monitores
            crearProducto(monitores,
                    "ASUS ROG Swift PG27AQDM",
                    "Monitor OLED competitivo con negros puros, tiempo de respuesta casi instantáneo de 0.03ms y 240Hz nativos.",
                    new BigDecimal("3289.06"), 10,
                    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000",
                    "{\"Pantalla\": \"26.5 pulgadas OLED QHD (2560x1440)\", \"Tasa de Refresco\": \"240Hz nativos\", \"Tiempo de Respuesta\": \"0.03ms GTG (gris a gris)\", \"Sincronización\": \"NVIDIA G-Sync Compatible y AMD FreeSync Premium\", \"Refrigeración\": \"Disipador térmico personalizado sin ventilador\"}");

            crearProducto(monitores,
                    "Samsung Odyssey OLED G8 27\"",
                    "Resolución 4K UHD en panel QD-OLED con tratamiento Glare Free para jugar en máxima fidelidad sin reflejos.",
                    new BigDecimal("5519.08"), 8,
                    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000",
                    "{\"Pantalla\": \"27 pulgadas QD-OLED 4K UHD (3840x2160)\", \"Tasa de Refresco\": \"240Hz\", \"Tiempo de Respuesta\": \"0.03ms GTG\", \"Tratamiento de Pantalla\": \"Antirreflejo Glare Free de última generación\", \"Protección Térmica\": \"Samsung Pulsating Heat Pipe para evitar quemado de imagen\"}");

            crearProducto(monitores,
                    "Dell UltraSharp U2723QE",
                    "Primer monitor con tecnología IPS Black del mundo con contraste 2000:1 y hub USB-C de 90W para profesionales del color.",
                    new BigDecimal("2754.05"), 14,
                    "https://images.unsplash.com/photo-1527443195645-1133f7f28990?auto=format&fit=crop&q=80&w=1000",
                    "{\"Pantalla\": \"27 pulgadas 4K UHD (3840x2160) IPS Black\", \"Color\": \"98% DCI-P3 y 100% sRGB calibrado de fábrica Delta E < 2\", \"Conectividad\": \"Hub USB-C con 90W Power Delivery, RJ45 Ethernet 1Gbps y DisplayPort Out\", \"Ergonomía\": \"Ajuste total de altura, inclinación, giro y pivotaje\"}");

            crearProducto(monitores,
                    "LG 27GP850-B",
                    "El referente en monitores gaming QHD con panel Nano IPS veloz y colores vívidos certificados VESA HDR400.",
                    new BigDecimal("1519.05"), 22,
                    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000",
                    "{\"Pantalla\": \"27 pulgadas QHD (2560x1440) Nano IPS\", \"Tasa de Refresco\": \"165Hz (overclockeable a 180Hz)\", \"Tiempo de Respuesta\": \"1ms GTG real\", \"Sincronización\": \"NVIDIA G-Sync Compatible y AMD FreeSync Premium\", \"HDR\": \"VESA DisplayHDR 400 y 98% DCI-P3\"}");

            crearProducto(monitores,
                    "BenQ MOBIUZ EX270QM",
                    "Inmersión total con tasa de refresco ultra fluida de 240Hz, tecnología inteligente HDRi y audio treVolo 2.1 integrado.",
                    new BigDecimal("2067.06"), 11,
                    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=1000",
                    "{\"Pantalla\": \"27 pulgadas QHD (2560x1440) Fast IPS\", \"Tasa de Refresco\": \"240Hz\", \"Tiempo de Respuesta\": \"1ms GTG\", \"Audio\": \"Sistema de sonido 2.1 treVolo con subwoofer de 5W y DSP independiente\", \"Inteligencia Visual\": \"Sensor HDRi para optimización automática según luz ambiental\"}");

            // Perifericos
            crearProducto(perifericos,
                    "Logitech G Pro X Superlight 2",
                    "El mouse inalámbrico de eSports más popular del mundo, ahora con switches híbridos LIGHTFORCE y peso récord de 60 gramos.",
                    new BigDecimal("616.55"), 28,
                    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=1000",
                    "{\"Sensor\": \"HERO 2 de hasta 32,000 DPI con seguimiento submicrónico\", \"Peso\": \"60 gramos ultraligero sin agujeros\", \"Switches\": \"Híbridos óptico-mecánicos LIGHTFORCE duraderos\", \"Autonomía\": \"Hasta 95 horas de batería continua en movimiento\", \"Conectividad\": \"LIGHTSPEED inalámbrico USB-C de baja latencia\"}");

            crearProducto(perifericos,
                    "Razer BlackWidow V4",
                    "Teclado mecánico completo con switches táctiles ruidosos, dial de control multifunción e iluminación RGB envolvente.",
                    new BigDecimal("743.07"), 16,
                    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=1000",
                    "{\"Switches\": \"Razer Green táctiles y con clic audible de alta precisión\", \"Iluminación\": \"Razer Chroma RGB por tecla y underglow lateral de 2 lados\", \"Controles\": \"Dial de mando multifunción y 4 teclas multimedia dedicadas\", \"Ergonomía\": \"Reposamuñecas magnético acolchado de piel sintética premium\", \"Tasa de Sondeo\": \"Hasta 8000 Hz HyperPolling\"}");

            crearProducto(perifericos,
                    "Keychron K8 Pro",
                    "Teclado mecánico TKL personalizable al 100% con soporte QMK/VIA y amortiguación de sonido de doble capa.",
                    new BigDecimal("426.55"), 24,
                    "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000",
                    "{\"Formato\": \"Tenkeyless (TKL) 87 teclas sin pad numérico\", \"Conectividad\": \"Inalámbrico Bluetooth 5.1 (3 dispositivos) y cableado USB-C\", \"Personalización\": \"Hot-swappable compatible con switches mecánicos de 3 y 5 pines\", \"Software\": \"Programable vía web QMK y VIA para macros y capas de teclas\", \"Cuerpo\": \"Marco de aluminio macizo y teclas PBT de doble inyección\"}");

            crearProducto(perifericos,
                    "SteelSeries Arctis Nova Pro",
                    "Audio acústico de grado audiófilo con cancelación de ruido activa y sistema de baterías intercambiables en caliente.",
                    new BigDecimal("1195.08"), 7,
                    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=1000",
                    "{\"Transductores\": \"Neodimio Hi-Res Audio con sonido espacial 360\", \"Cancelación de Ruido\": \"Cancelación de ruido activa (ANC) híbrida con modo transparencia\", \"Batería\": \"Sistema Infinity Power con 2 baterías intercambiables en caliente\", \"Estación Base\": \"Estación base inalámbrica con pantalla OLED y ecualizador de 10 bandas\", \"Conectividad\": \"Doble conexión simultánea 2.4 GHz inalámbrico + Bluetooth\"}");

            crearProducto(perifericos,
                    "Logitech StreamCam",
                    "Cámara web 1080p a 60 fps con encuadre automático por IA y montura giratoria para video vertical y horizontal.",
                    new BigDecimal("569.05"), 19,
                    "https://images.unsplash.com/photo-1587826504074-a01c402179d6?auto=format&fit=crop&q=80&w=1000",
                    "{\"Resolución de Video\": \"Full HD 1080p a 60 fps fluidos sin parpadeo\", \"Óptica\": \"Lente de cristal premium con campo de visión de 78 grados y f/2.0\", \"Inteligencia Artificial\": \"Encuadre automático y exposición inteligente por reconocimiento facial\", \"Conexión\": \"USB-C 3.1 Gen 1 para transferencia sin latencia\", \"Soporte\": \"Montaje versátil para monitor y trípode con giro instantáneo a modo vertical 9:16\"}");

            crearProducto(perifericos,
                    "HyperX Cloud II",
                    "El clásico indiscutible en audífonos de gaming por su comodidad legendaria de espuma viscoelástica y sonido envolvente 7.1.",
                    new BigDecimal("360.05"), 30,
                    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=1000",
                    "{\"Altavoces\": \"Dinámicos de 53 mm con imanes de neodimio de sonido claro\", \"Sonido\": \"Sonido envolvente virtual 7.1 controlado desde caja de audio USB\", \"Construcción\": \"Estructura de aluminio duradera diseñada para soportar años de uso\", \"Almohadillas\": \"Espuma viscoelástica 100% memory foam y piel sintética premium\", \"Micrófono\": \"Desmontable con cancelación de ruido pasiva y certificado para Discord\"}");

            // Componentes
            crearProducto(componentes,
                    "Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz",
                    "Kit dual-channel de memoria RAM DDR5 de altísima frecuencia con latencia optimizada CL36 y disipador térmico de aluminio.",
                    new BigDecimal("563.06"), 25,
                    "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=1000",
                    "{\"Capacidad\": \"32GB (Kit 2x16GB dual-channel)\", \"Tipo y Frecuencia\": \"DDR5 6000 MHz (PC5-48000)\", \"Latencia\": \"CL36-36-36-76 a 1.35V\", \"Compatibilidad\": \"Perfiles duales Intel XMP 3.0 y AMD EXPO integrados\", \"Disipador\": \"Aluminio macizo de bajo perfil compatible con disipadores de aire grandes\"}");

            crearProducto(componentes,
                    "WD Black SN850X 2TB NVMe",
                    "Unidad SSD PCIe Gen4 ultrarrápida con velocidades de lectura de 7300 MB/s y disipador térmico compatible con PC y PS5.",
                    new BigDecimal("696.57"), 20,
                    "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=1000",
                    "{\"Capacidad\": \"2TB SSD M.2 2280\", \"Interfaz\": \"PCIe Gen4 x4 NVMe 1.4\", \"Velocidad de Lectura\": \"Hasta 7,300 MB/s secuenciales\", \"Velocidad de Escritura\": \"Hasta 6,600 MB/s secuenciales\", \"Refrigeración\": \"Disipador térmico integrado de perfil bajo oficial para PlayStation 5 y PC\"}");

            crearProducto(componentes,
                    "ASUS ROG Strix RTX 4070 Ti Super OC",
                    "Potencia gráfica sin concesiones con 16GB VRAM GDDR6X, refrigeración masiva de tres ventiladores y DLSS 3 Frame Generation.",
                    new BigDecimal("3548.09"), 6,
                    "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=1000",
                    "{\"Memoria de Video\": \"16GB GDDR6X 256-bit de ultra velocidad\", \"Arquitectura\": \"NVIDIA Ada Lovelace con DLSS 3.5 e IA\", \"Refrigeración\": \"Triple ventilador Axial-tech con rotación alterna y cámara de vapor\", \"Frecuencia del Reloj\": \"Modo OC hasta 2670 MHz\", \"Conectores de Poder\": \"1x cable de alimentación de 16 pines (12VHPWR)\"}");

            crearProducto(componentes,
                    "AMD Ryzen 7 7800X3D",
                    "El rey indiscutible de los procesadores para gaming en el mundo gracias a sus 104 MB de caché 3D V-Cache en socket AM5.",
                    new BigDecimal("1597.06"), 16,
                    "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=1000",
                    "{\"Núcleos e Hilos\": \"8 núcleos físicos / 16 hilos de procesamiento simultáneo\", \"Frecuencia Máxima\": \"Hasta 5.0 GHz en modo Boost automático\", \"Memoria Caché\": \"104 MB totales (Tecnología AMD 3D V-Cache de 2da generación)\", \"Zócalo (Socket)\": \"AMD AM5 (Plataforma DDR5 / PCIe 5.0)\", \"Consumo Térmico (TDP)\": \"120W de alta eficiencia térmica\"}");

            crearProducto(componentes,
                    "Corsair RM850x",
                    "Fuente de alimentación 100% modular de 850W con certificación 80 Plus Gold, condensadores japoneses y ventilador ultrasilencioso.",
                    new BigDecimal("569.05"), 22,
                    "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=1000",
                    "{\"Potencia Continua\": \"850 Watts reales a 50°C de temperatura ambiente\", \"Certificación de Eficiencia\": \"80 Plus Gold (más del 90% de eficiencia en cargas típicas)\", \"Cableado\": \"100% modular con cables negros planos fáciles de enrutear\", \"Ventilador\": \"135 mm con rodamiento de levitación magnética ML120 y modo Zero RPM\", \"Componentes\": \"Condensadores electrolíticos 100% japoneses clasificados a 105°C\"}");

            // Accesorios
            crearProducto(accesorios,
                    "Anker 555 USB-C Hub (8 en 1)",
                    "El concentrador multipuerto definitivo con salida de video HDMI 4K a 60Hz, red Gigabit y carga passthrough de 100W.",
                    new BigDecimal("236.55"), 27,
                    "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=1000",
                    "{\"Salida de Video\": \"HDMI 4K a 60Hz ultra nítido sin parpadeos\", \"Puertos USB de Datos\": \"2x USB-A 3.2 Gen 2 (10 Gbps) + 1x USB-C de datos (10 Gbps)\", \"Carga de Portátil\": \"Puerto USB-C Power Delivery (PD) de 100W passthrough\", \"Red y Tarjetas\": \"Puerto Ethernet RJ45 1 Gbps + ranuras SD y microSD de alta velocidad\", \"Chasis\": \"Aluminio cepillado disipador del calor exterior\"}");

            crearProducto(accesorios,
                    "Rain Design mStand",
                    "Soporte ergonómico fabricado en una sola pieza de aluminio anodizado que eleva tu portátil a la altura de tu vista y disipa el calor.",
                    new BigDecimal("189.05"), 29,
                    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=1000",
                    "{\"Material\": \"Aluminio anodizado macizo pulido con chorro de arena (estilo Apple)\", \"Ergonomía\": \"Eleva la pantalla de la laptop 15 cm a la altura ideal de los ojos\", \"Refrigeración\": \"Panel de aluminio con ranura trasera que actúa como disipador térmico natural\", \"Gestión de Cables\": \"Orificio trasero con anillo organizador para cables limpios\", \"Compatibilidad\": \"Universal para todas las laptops y MacBooks de 11 a 17 pulgadas\"}");

            System.out.println("[Servitek] 30 productos reales del mercado peruanos cargados con éxito.");
        }

        // 3. Redondear y estandarizar todos los precios del catálogo para que siempre terminen en .90 (ej. S/ 4511.90)
        List<Producto> todos = productoRepository.findAll();
        boolean cambiaronPrecios = false;
        for (Producto p : todos) {
            if (p.getPrecio() != null) {
                BigDecimal parteEntera = p.getPrecio().setScale(0, java.math.RoundingMode.FLOOR);
                BigDecimal nuevoPrecio = parteEntera.add(new BigDecimal("0.90"));
                if (p.getPrecio().compareTo(nuevoPrecio) != 0) {
                    p.setPrecio(nuevoPrecio);
                    cambiaronPrecios = true;
                }
            }
        }
        if (cambiaronPrecios) {
            productoRepository.saveAll(todos);
            System.out.println("[Servitek] Todos los precios han sido estandarizados a terminación .90 (ej. S/ 4511.90).");
        }
    }

    private Producto crearProducto(Categoria cat, String nombre, String desc, BigDecimal precio, int stock, String imagenUrl, String specsJson) {
        Producto p = new Producto(cat, nombre, desc, precio, stock);
        p.setImagenUrl(imagenUrl);
        p.setEspecificaciones(specsJson);
        p.setActivo(true);
        return productoRepository.save(p);
    }
}
