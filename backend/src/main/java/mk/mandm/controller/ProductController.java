package mk.mandm.controller;

import mk.mandm.dto.product.ProductResponse;
import mk.mandm.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // For partners / public catalogue (active only)
    @GetMapping
    public ResponseEntity<List<ProductResponse>> listActive() {
        return ResponseEntity.ok(productService.listActive());
    }
}
