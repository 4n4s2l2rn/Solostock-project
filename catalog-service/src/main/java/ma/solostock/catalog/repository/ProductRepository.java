package ma.solostock.catalog.repository;
import ma.solostock.catalog.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(Category category);
    List<Product> findBySupplierId(Long supplierId);
    List<Product> findByStatus(ProductStatus status);

    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%',:kw,'%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%',:kw,'%'))")
    List<Product> search(@Param("kw") String keyword);

    long count();
}