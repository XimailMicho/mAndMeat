package mk.mandm.controller;

import jakarta.validation.Valid;
import mk.mandm.dto.order.CreateOrderRequest;
import mk.mandm.dto.order.OrderResponse;
import mk.mandm.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partner/orders")
@PreAuthorize("hasRole('PARTNER')")
public class PartnerOrderController {

    private final OrderService orderService;

    public PartnerOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> submit(@Valid @RequestBody CreateOrderRequest req) {
        return ResponseEntity.ok(orderService.partnerSubmit(req));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> myOrders() {
        return ResponseEntity.ok(orderService.partnerMyOrders());
    }
}
