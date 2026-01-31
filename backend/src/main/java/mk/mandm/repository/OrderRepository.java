package mk.mandm.repository;

import mk.mandm.model.Order;
import mk.mandm.model.enums.OrderStatus;
import mk.mandm.model.Partner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByPartnerOrderByCreatedAtDesc(Partner partner);
    List<Order> findByStatusInOrderByCreatedAtDesc(Collection<OrderStatus> statuses);
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);
}
