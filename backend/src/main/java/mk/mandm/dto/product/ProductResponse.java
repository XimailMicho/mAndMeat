package mk.mandm.dto.product;

import mk.mandm.model.enums.Unit;

import java.util.List;
import java.util.Set;

public record ProductResponse(
        Long id,
        String name,
        boolean active,
        Set<Unit> allowedUnits,
        List<CurrentPriceResponse> currentPrices
) {}
