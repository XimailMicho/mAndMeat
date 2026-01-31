package mk.mandm.service;

import mk.mandm.dto.order.*;
import mk.mandm.model.*;
import mk.mandm.model.enums.*;
import mk.mandm.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.EnumSet;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ProductPriceRepository productPriceRepository;
    private final PartnerRepository partnerRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderService(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            ProductPriceRepository productPriceRepository,
            PartnerRepository partnerRepository,
            UserRepository userRepository,
            OrderItemRepository orderItemRepository
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.productPriceRepository = productPriceRepository;
        this.partnerRepository = partnerRepository;
        this.userRepository = userRepository;
        this.orderItemRepository = orderItemRepository;
    }


    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Current user not found."));
    }

    @Transactional
    public OrderResponse partnerSubmit(CreateOrderRequest req) {
        User creator = currentUser();
        if (!(creator instanceof Partner partner)) {
            throw new IllegalArgumentException("Only partners can submit partner orders.");
        }

        Order o = buildOrderFromRequest(req, partner, creator);
        o.setStatus(OrderStatus.SUBMITTED);

        Order saved = orderRepository.save(o);
        return toResponse(saved);
    }

    @Transactional
    public OrderResponse adminCreateApproved(AdminCreateOrderRequest req) {
        User admin = currentUser();
        if (admin.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Only admins can create approved orders.");
        }

        Partner partner = partnerRepository.findById(req.partnerId())
                .orElseThrow(() -> new IllegalArgumentException("Partner not found."));

        Order o = buildOrderFromRequest(req.order(), partner, admin);
        o.setStatus(OrderStatus.APPROVED);
        o.setApprovedBy(admin);
        o.setApprovedAt(o.getCreatedAt());

        Order saved = orderRepository.save(o);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> partnerMyOrders() {
        User u = currentUser();
        if (!(u instanceof Partner partner)) {
            throw new IllegalArgumentException("Only partners can view partner orders.");
        }
        return orderRepository.findByPartnerOrderByCreatedAtDesc(partner).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> workerQueue() {
        // worker should only see APPROVED+
        EnumSet<OrderStatus> visible = EnumSet.of(
                OrderStatus.APPROVED,
                OrderStatus.IN_PROGRESS,
                OrderStatus.READY,
                OrderStatus.DELIVERED
        );
        return orderRepository.findByStatusInOrderByCreatedAtDesc(visible).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> adminSubmittedQueue() {
        return orderRepository.findByStatusOrderByCreatedAtDesc(OrderStatus.SUBMITTED)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public void adminApprove(Long orderId) {
        User admin = currentUser();
        if (admin.getRole() != Role.ADMIN) throw new IllegalArgumentException("Admin only.");

        Order o = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found."));

        if (o.getStatus() != OrderStatus.SUBMITTED) {
            throw new IllegalArgumentException("Only SUBMITTED orders can be approved.");
        }

        o.setStatus(OrderStatus.APPROVED);
        o.setApprovedBy(admin);
        o.setApprovedAt(Instant.now());
        o.setRejectionReason(null);
    }

    @Transactional
    public void adminReject(Long orderId, String reason) {
        User admin = currentUser();
        if (admin.getRole() != Role.ADMIN) throw new IllegalArgumentException("Admin only.");

        Order o = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found."));

        if (o.getStatus() != OrderStatus.SUBMITTED) {
            throw new IllegalArgumentException("Only SUBMITTED orders can be rejected.");
        }

        o.setStatus(OrderStatus.REJECTED);
        o.setRejectionReason(reason == null ? "Rejected" : reason);
    }
    @Transactional(readOnly = true)
    public List<OrderResponse> adminAllOrders() {
        return orderRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void workerSetPacked(Long orderId, Long itemId, boolean packed) {
        User worker = currentUser();
        if (worker.getRole() != Role.WORKER) {
            throw new IllegalArgumentException("Worker only.");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found."));

        // Only allow packing for orders workers can work on
        if (!(order.getStatus() == OrderStatus.APPROVED
                || order.getStatus() == OrderStatus.IN_PROGRESS
                || order.getStatus() == OrderStatus.READY)) {
            throw new IllegalArgumentException("Order is not in a packable state.");
        }

        OrderItem item = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Order item not found."));

        if (!item.getOrder().getId().equals(orderId)) {
            throw new IllegalArgumentException("Item does not belong to this order.");
        }

        // Update packed fields
        item.setPacked(packed);
        if (packed) {
            item.setPackedAt(Instant.now());
            item.setPackedBy(worker);
        } else {
            item.setPackedAt(null);
            item.setPackedBy(null);
        }

        // Recompute status based on ALL items packed state
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);

        boolean anyPacked = items.stream().anyMatch(OrderItem::isPacked);
        boolean allPacked = !items.isEmpty() && items.stream().allMatch(OrderItem::isPacked);

        if (allPacked) {
            order.setStatus(OrderStatus.READY);
        } else if (anyPacked) {
            order.setStatus(OrderStatus.IN_PROGRESS);
        } else {
            // revert behavior (optional, but matches your stated rule)
            order.setStatus(OrderStatus.APPROVED);
        }
    }



    private Order buildOrderFromRequest(CreateOrderRequest req, Partner partner, User creator) {
        if (req.items() == null || req.items().isEmpty()) {
            throw new IllegalArgumentException("Order must have at least one item.");
        }

        Order o = new Order();
        o.setPartner(partner);
        o.setCreatedBy(creator);
        o.setCreatedAt(Instant.now());
        o.setDeliveryDate(req.deliveryDate());
        o.setNotes(req.notes());

        for (OrderItemRequest ir : req.items()) {
            Product product = productRepository.findById(ir.productId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + ir.productId()));

            if (!product.isActive()) {
                throw new IllegalArgumentException("Product is inactive: " + product.getName());
            }
            if (!product.getAllowedUnits().contains(ir.unit())) {
                throw new IllegalArgumentException("Unit " + ir.unit() + " not allowed for product " + product.getName());
            }

            // validate quantity rule: UNIT must be integer
            if (ir.unit() == Unit.UNIT) {
                if (ir.quantity().scale() > 0 && ir.quantity().stripTrailingZeros().scale() > 0) {
                    throw new IllegalArgumentException("UNIT quantity must be a whole number for product " + product.getName());
                }
            }

            ProductPrice currentPrice = productPriceRepository
                    .findFirstByProductAndUnitAndValidToIsNull(product, ir.unit())
                    .orElseThrow(() -> new IllegalArgumentException("No current price for " + product.getName() + " in " + ir.unit()));

            OrderItem oi = new OrderItem();
            oi.setOrder(o);
            oi.setProduct(product);
            oi.setUnit(ir.unit());
            oi.setQuantity(ir.quantity());
            oi.setPriceMkdSnapshot(currentPrice.getPriceMkd());

            o.getItems().add(oi);
        }

        return o;
    }

    private OrderResponse toResponse(Order o) {

        List<OrderItemResponse> items = o.getItems().stream().map(oi -> {
            BigDecimal lineTotal = oi.getPriceMkdSnapshot().multiply(oi.getQuantity());

            return new OrderItemResponse(
                    oi.getId(),
                    oi.getProduct().getId(),
                    oi.getProduct().getName(),
                    oi.getUnit(),
                    oi.getQuantity(),
                    oi.getPriceMkdSnapshot(),
                    lineTotal,
                    oi.isPacked(),
                    oi.getPackedAt(),
                    oi.getPackedBy() != null ? oi.getPackedBy().getEmail() : null
            );
        }).toList();

        BigDecimal total = items.stream()
                .map(OrderItemResponse::lineTotalMkd)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new OrderResponse(
                o.getId(),
                o.getPartner().getId(),
                o.getPartner().getEmail(),
                o.getStatus(),
                o.getCreatedAt(),
                o.getDeliveryDate(),
                o.getNotes(),
                total,
                o.getRejectionReason(),
                items
        );
    }

}
