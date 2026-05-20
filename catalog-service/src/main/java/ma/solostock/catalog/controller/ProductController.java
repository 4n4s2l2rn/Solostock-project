package ma.solostock.catalog.controller;
import lombok.RequiredArgsConstructor;
import ma.solostock.catalog.dto.*;
import ma.solostock.catalog.entity.Category;
import ma.solostock.catalog.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/catalog")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PostMapping("/products")
    public ResponseEntity<ProductResponse> create(@RequestBody ProductRequest req) {
        return ResponseEntity.ok(productService.create(req));
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> getAll() {
        return ResponseEntity.ok(productService.getAll());
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @GetMapping("/products/search")
    public ResponseEntity<List<ProductResponse>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(productService.search(keyword));
    }

    @GetMapping("/products/category/{category}")
    public ResponseEntity<List<ProductResponse>> byCategory(@PathVariable Category category) {
        return ResponseEntity.ok(productService.getByCategory(category));
    }

    @GetMapping("/products/supplier/{supplierId}")
    public ResponseEntity<List<ProductResponse>> bySupplier(@PathVariable Long supplierId) {
        return ResponseEntity.ok(productService.getBySupplier(supplierId));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id, @RequestBody ProductRequest req) {
        return ResponseEntity.ok(productService.update(id, req));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/products/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(productService.count());
    }
}