package mk.mandm.dto.order;

import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDate;
import java.util.List;

public record CreateOrderRequest(
        LocalDate deliveryDate,
        String notes,
        @NotEmpty List<OrderItemRequest> items
) {}
