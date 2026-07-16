package pe.edu.utp.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
@Getter @Setter @NoArgsConstructor
public class Pago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_pedido", nullable = false, unique = true)
    private Pedido pedido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Metodo metodo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoPago estado = EstadoPago.PENDIENTE;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(length = 150)
    private String referencia;

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;

    public enum Metodo { TARJETA, TRANSFERENCIA, EFECTIVO, YAPE, PLIN }
    public enum EstadoPago { PENDIENTE, APROBADO, RECHAZADO, REEMBOLSADO }

    public Pago(Pedido pedido, Metodo metodo, BigDecimal monto) {
        this.pedido = pedido;
        this.metodo = metodo;
        this.monto = monto;
        this.estado = EstadoPago.PENDIENTE;
    }
}
