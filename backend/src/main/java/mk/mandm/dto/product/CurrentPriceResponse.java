package mk.mandm.dto.product;

import mk.mandm.model.enums.Unit;

import java.math.BigDecimal;

public record CurrentPriceResponse(
        Unit unit,
        BigDecimal priceMkd
) {}
