package pe.edu.utp.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "direcciones")
@Getter @Setter @NoArgsConstructor
public class Direccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_direccion")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 60)
    private String alias = "Casa";

    @Column(nullable = false, length = 255)
    private String calle;

    @Column(nullable = false, length = 100)
    private String ciudad;

    @Column(nullable = false, length = 100)
    private String departamento;

    @Column(name = "codigo_postal", length = 10)
    private String codigoPostal;

    @Column(length = 255)
    private String referencia;

    @Column(name = "latitud")
    private Double latitud;

    @Column(name = "longitud")
    private Double longitud;

    @Column(nullable = false)
    private Boolean predeterminada = false;

    public Direccion(Usuario usuario, String alias, String calle,
                     String ciudad, String departamento) {
        this.usuario = usuario;
        this.alias = alias;
        this.calle = calle;
        this.ciudad = ciudad;
        this.departamento = departamento;
        this.predeterminada = false;
    }
}
