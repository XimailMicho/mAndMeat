package mk.mandm.controller;

import jakarta.validation.Valid;
import mk.mandm.dto.order.AdminCreateOrderRequest;
import mk.mandm.dto.order.OrderResponse;
import mk.mandm.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> all() {
        return ResponseEntity.ok(orderService.adminAllOrders());
    }


    @GetMapping("/submitted")
    public ResponseEntity<List<OrderResponse>> submittedQueue() {
        return ResponseEntity.ok(orderService.adminSubmittedQueue());
    }

    @PostMapping("/create-approved")
    public ResponseEntity<OrderResponse> createApproved(@Valid @RequestBody AdminCreateOrderRequest req) {
        return ResponseEntity.ok(orderService.adminCreateApproved(req));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Void> approve(@PathVariable Long id) {
        orderService.adminApprove(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Void> reject(@PathVariable Long id, @RequestBody(required = false) String reason) {
        orderService.adminReject(id, reason);
        return ResponseEntity.ok().build();
    }

}
