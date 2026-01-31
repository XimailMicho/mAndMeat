package mk.mandm.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mk.mandm.model.enums.Unit;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    // soft-disable product for new orders
    @Column(nullable = false)
    private boolean active = true;

    // which units this product can be ordered in (KG only, UNIT only, or both)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_allowed_units", joinColumns = @JoinColumn(name = "product_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "unit", nullable = false)
    private Set<Unit> allowedUnits = new HashSet<>();
}
