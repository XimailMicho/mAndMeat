package mk.mandm.repository;

import mk.mandm.model.Product;
import mk.mandm.model.ProductPrice;
import mk.mandm.model.enums.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductPriceRepository extends JpaRepository<ProductPrice, Long> {

    // current price
    Optional<ProductPrice> findFirstByProductAndUnitAndValidToIsNull(Product product, Unit unit);

    // full history newest first
    List<ProductPrice> findByProductAndUnitOrderByValidFromDesc(Product product, Unit unit);
}
