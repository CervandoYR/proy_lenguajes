package pe.edu.utp.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "productos")
@Getter @Setter @NoArgsConstructor
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(name = "imagen_url", columnDefinition = "LONGTEXT")
    private String imagenUrl;

    @Column(name = "imagenes_adicionales", columnDefinition = "LONGTEXT")
    private String imagenesAdicionales;

    @Column(name = "especificaciones", columnDefinition = "LONGTEXT")
    private String especificaciones;

    @Column(name = "modelo_3d_url", columnDefinition = "LONGTEXT")
    private String modelo3dUrl;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "destacado")
    private Boolean destacado = false;

    public Boolean getDestacado() {
        return destacado != null && destacado;
    }

    @Column(name = "fecha_creacion", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;


    @Version
    @Column(name = "version")
    private Long version = 0L;

    public Producto(Categoria categoria, String nombre, String descripcion,
                    BigDecimal precio, Integer stock) {
        this.categoria = categoria;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.activo = true;
        this.destacado = false;
        this.fechaCreacion = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
        if (this.version == null) {
            this.version = 0L;
        }
    }
    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDateTime.now();
        if (this.version == null) {
            this.version = 0L;
        }
    }
    @PostLoad
    public void postLoad() {
        if (this.version == null) {
            this.version = 0L;
        }
    }
}
