package mk.mandm.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mk.mandm.model.enums.OrderStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "orders",
        indexes = {
                @Index(name = "idx_orders_status_createdat", columnList = "status,created_at"),
                @Index(name = "idx_orders_partner_createdat", columnList = "partner_id,created_at")
        }
)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // who the order is for
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "partner_id", nullable = false)
    private Partner partner;

    // who created it (partner or admin)
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @Column(name="created_at", nullable=false)
    private Instant createdAt;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    // admin approval info (nullable)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_id")
    private User approvedBy;

    private Instant approvedAt;

    // if rejected
    private String rejectionReason;

    // optional delivery date; null means pickup/unscheduled
    private LocalDate deliveryDate;

    @Column(length = 2000)
    private String notes;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
}
