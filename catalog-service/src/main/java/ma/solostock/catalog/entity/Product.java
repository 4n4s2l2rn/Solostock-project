package ma.solostock.catalog.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="products")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false) private String name;
    private String description;
    private String imageUrl;

    @Column(nullable=false) private Double wholesalePrice;
    private Double retailPrice;
    private Integer stockQuantity;
    private Integer minOrderQuantity;

    @Enumerated(EnumType.STRING) private Category category;
    @Enumerated(EnumType.STRING) @Builder.Default
    private ProductStatus status = ProductStatus.AVAILABLE;

    private Long supplierId;
    private String supplierName;

    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}