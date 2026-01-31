package mk.mandm.dto.product;

import jakarta.validation.constraints.NotBlank;
import mk.mandm.model.enums.Unit;

import java.util.Set;

public record ProductUpdateRequest(
        @NotBlank String name,
        boolean active,
        Set<Unit> allowedUnits
) {}
