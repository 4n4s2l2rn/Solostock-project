package ma.solostock.catalog.service;
import lombok.RequiredArgsConstructor;
import ma.solostock.catalog.dto.*;
import ma.solostock.catalog.entity.*;
import ma.solostock.catalog.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public ProductResponse create(ProductRequest req) {
        Product p = Product.builder()
                .name(req.getName()).description(req.getDescription())
                .imageUrl(req.getImageUrl()).wholesalePrice(req.getWholesalePrice())
                .retailPrice(req.getRetailPrice()).stockQuantity(req.getStockQuantity())
                .minOrderQuantity(req.getMinOrderQuantity()).category(req.getCategory())
                .supplierId(req.getSupplierId()).supplierName(req.getSupplierName()).build();
        return toResponse(productRepository.save(p));
    }

    public List<ProductResponse> getAll() {
        return productRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProductResponse getById(Long id) {
        return toResponse(productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé: " + id)));
    }

    public List<ProductResponse> search(String keyword) {
        return productRepository.search(keyword).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getByCategory(Category category) {
        return productRepository.findByCategory(category).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getBySupplier(Long supplierId) {
        return productRepository.findBySupplierId(supplierId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProductResponse update(Long id, ProductRequest req) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé: " + id));
        p.setName(req.getName()); p.setDescription(req.getDescription());
        p.setWholesalePrice(req.getWholesalePrice()); p.setRetailPrice(req.getRetailPrice());
        p.setStockQuantity(req.getStockQuantity()); p.setCategory(req.getCategory());
        p.setUpdatedAt(LocalDateTime.now());
        return toResponse(productRepository.save(p));
    }

    public void delete(Long id) { productRepository.deleteById(id); }

    public long count() { return productRepository.count(); }

    private ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId()).name(p.getName()).description(p.getDescription())
                .imageUrl(p.getImageUrl()).wholesalePrice(p.getWholesalePrice())
                .retailPrice(p.getRetailPrice()).stockQuantity(p.getStockQuantity())
                .minOrderQuantity(p.getMinOrderQuantity()).category(p.getCategory())
                .status(p.getStatus()).supplierId(p.getSupplierId())
                .supplierName(p.getSupplierName()).createdAt(p.getCreatedAt()).build();
    }
}