package mk.mandm.dto.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import mk.mandm.model.enums.Unit;

import java.util.Set;

public record ProductCreateRequest(
        @NotBlank String name,
        boolean active,
        @NotEmpty Set<Unit> allowedUnits
) {}
