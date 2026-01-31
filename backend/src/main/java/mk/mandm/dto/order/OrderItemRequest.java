package mk.mandm.dto.order;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import mk.mandm.model.enums.Unit;

import java.math.BigDecimal;

public record OrderItemRequest(
        @NotNull Long productId,
        @NotNull Unit unit,
        @NotNull @DecimalMin("0.001") BigDecimal quantity
) {}
