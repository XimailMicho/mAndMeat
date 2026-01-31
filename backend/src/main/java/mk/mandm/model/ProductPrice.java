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
@Table(name = "product_prices",
        indexes = {
                @Index(name = "idx_price_product_unit", columnList = "product_id,unit"),
                @Index(name = "idx_price_validto", columnList = "validTo")
        })
public class ProductPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Unit unit;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal priceMkd;

    @Column(nullable = false)
    private Instant validFrom;

    // null = current price
    private Instant validTo;
}
