package mk.mandm.controller;

import jakarta.validation.Valid;
import mk.mandm.dto.product.*;
import mk.mandm.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductCreateRequest req) {
        return ResponseEntity.ok(productService.create(req));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> list() {
        return ResponseEntity.ok(productService.listAllForAdmin());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(productService.get(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id, @Valid @RequestBody ProductUpdateRequest req) {
        return ResponseEntity.ok(productService.update(id, req));
    }

    @PostMapping("/{id}/prices")
    public ResponseEntity<Void> setPrice(@PathVariable Long id, @Valid @RequestBody SetProductPriceRequest req) {
        productService.setCurrentPrice(id, req);
        return ResponseEntity.ok().build();
    }
}
