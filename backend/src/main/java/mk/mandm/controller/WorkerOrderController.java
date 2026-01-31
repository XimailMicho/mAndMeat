package mk.mandm.controller;

import mk.mandm.dto.order.OrderResponse;
import mk.mandm.dto.order.SetPackedRequest;
import mk.mandm.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/worker/orders")
@PreAuthorize("hasRole('WORKER')")
public class WorkerOrderController {

    private final OrderService orderService;

    public WorkerOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> queue() {
        return ResponseEntity.ok(orderService.workerQueue());
    }
    @PatchMapping("/{orderId}/items/{itemId}/packed")
    public ResponseEntity<Void> setPacked(
            @PathVariable Long orderId,
            @PathVariable Long itemId,
            @RequestBody SetPackedRequest req
    ) {
        orderService.workerSetPacked(orderId, itemId, req.packed());
        return ResponseEntity.noContent().build();
    }

}
