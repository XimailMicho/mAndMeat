package mk.mandm.dto.order;

import mk.mandm.model.enums.Unit;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderItemResponse(
        Long id,
        Long productId,
        String productName,
        Unit unit,
        BigDecimal quantity,
        BigDecimal priceMkdSnapshot,
        BigDecimal lineTotalMkd,
        boolean packed,
        Instant packedAt,
        String packedByEmail
) {}
