package mk.mandm.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mk.mandm.model.enums.Unit;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "order_items",
        indexes = @Index(name = "idx_order_items_order", columnList = "order_id"))
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Order order;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Unit unit;

    // quantity: KG can be decimal; UNIT must be integer (validated in service)
    @Column(nullable = false, precision = 12, scale = 3)
    private BigDecimal quantity;

    // snapshot at submission (MKD per unit)
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal priceMkdSnapshot;

    @Column(nullable = false)
    private boolean packed = false;

    @Column(name = "packed_at")
    private Instant packedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "packed_by_id")
    private User packedBy;
}
