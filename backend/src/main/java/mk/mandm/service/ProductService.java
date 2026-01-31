package mk.mandm.service;

import mk.mandm.dto.product.*;
import mk.mandm.model.Product;
import mk.mandm.model.ProductPrice;
import mk.mandm.model.enums.Unit;
import mk.mandm.repository.ProductPriceRepository;
import mk.mandm.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductPriceRepository productPriceRepository;

    public ProductService(ProductRepository productRepository, ProductPriceRepository productPriceRepository) {
        this.productRepository = productRepository;
        this.productPriceRepository = productPriceRepository;
    }

    @Transactional
    public ProductResponse create(ProductCreateRequest req) {
        if (productRepository.existsByName(req.name())) {
            throw new IllegalArgumentException("Product name already exists.");
        }
        Product p = new Product();
        p.setName(req.name().trim());
        p.setActive(req.active());
        p.getAllowedUnits().clear();
        p.getAllowedUnits().addAll(req.allowedUnits());
        Product saved = productRepository.save(p);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> listAllForAdmin() {
        return productRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse get(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found."));
        return toResponse(p);
    }

    @Transactional
    public ProductResponse update(Long id, ProductUpdateRequest req) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found."));

        String newName = req.name().trim();
        if (!p.getName().equalsIgnoreCase(newName) && productRepository.existsByName(newName)) {
            throw new IllegalArgumentException("Product name already exists.");
        }

        p.setName(newName);
        p.setActive(req.active());

        if (req.allowedUnits() != null && !req.allowedUnits().isEmpty()) {
            p.getAllowedUnits().clear();
            p.getAllowedUnits().addAll(req.allowedUnits());
        }

        return toResponse(p);
    }

    @Transactional
    public void setCurrentPrice(Long productId, SetProductPriceRequest req) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found."));

        Unit unit = req.unit();
        if (!p.getAllowedUnits().contains(unit)) {
            throw new IllegalArgumentException("Unit " + unit + " is not allowed for this product.");
        }

        Instant now = Instant.now();

        // close existing current price if present
        productPriceRepository.findFirstByProductAndUnitAndValidToIsNull(p, unit)
                .ifPresent(curr -> {
                    curr.setValidTo(now);
                    productPriceRepository.save(curr);
                });

        // insert new current price
        ProductPrice np = new ProductPrice();
        np.setProduct(p);
        np.setUnit(unit);
        np.setPriceMkd(req.priceMkd());
        np.setValidFrom(now);
        np.setValidTo(null);

        productPriceRepository.save(np);
    }

    private ProductResponse toResponse(Product p) {
        List<CurrentPriceResponse> current = new ArrayList<>();
        for (Unit u : p.getAllowedUnits()) {
            productPriceRepository.findFirstByProductAndUnitAndValidToIsNull(p, u)
                    .ifPresent(pp -> current.add(new CurrentPriceResponse(u, pp.getPriceMkd())));
        }

        return new ProductResponse(
                p.getId(),
                p.getName(),
                p.isActive(),
                p.getAllowedUnits(),
                current
        );
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> listActive() {
        return productRepository.findByActiveTrue()
                .stream()
                .map(this::toResponse)
                .toList();
    }


}
