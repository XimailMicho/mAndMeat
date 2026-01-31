package mk.mandm.dto.order;

import mk.mandm.model.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record OrderResponse(
        Long id,
        Long partnerId,
        String partnerEmail,
        OrderStatus status,
        Instant createdAt,
        LocalDate deliveryDate,
        String notes,
        BigDecimal totalMkd,
        String rejectionReason,
        List<OrderItemResponse> items
) {}
