package mk.mandm.dto.order;

import mk.mandm.model.enums.Unit;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        Long productId,
        String productName,
        Unit unit,
        BigDecimal quantity,
        BigDecimal priceMkdSnapshot,
        BigDecimal lineTotalMkd
) {}
