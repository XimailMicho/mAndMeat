package mk.mandm.dto.order;

import jakarta.validation.constraints.NotNull;

public record AdminCreateOrderRequest(
        @NotNull Long partnerId,
        CreateOrderRequest order
) {}
