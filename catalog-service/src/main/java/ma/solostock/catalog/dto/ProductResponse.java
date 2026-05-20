package ma.solostock.catalog.dto;
import lombok.*;
import ma.solostock.catalog.entity.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private Double wholesalePrice;
    private Double retailPrice;
    private Integer stockQuantity;
    private Integer minOrderQuantity;
    private Category category;
    private ProductStatus status;
    private Long supplierId;
    private String supplierName;
    private LocalDateTime createdAt;
}