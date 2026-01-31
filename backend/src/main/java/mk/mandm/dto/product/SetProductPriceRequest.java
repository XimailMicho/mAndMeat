package mk.mandm.dto.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import mk.mandm.model.enums.Unit;

import java.math.BigDecimal;

public record SetProductPriceRequest(
        @NotNull Unit unit,
        @NotNull @DecimalMin(value = "0.01") BigDecimal priceMkd
) {}
