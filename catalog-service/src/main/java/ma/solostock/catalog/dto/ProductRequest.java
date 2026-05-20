package ma.solostock.catalog.dto;
import lombok.Data;
import ma.solostock.catalog.entity.Category;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private String imageUrl;
    private Double wholesalePrice;
    private Double retailPrice;
    private Integer stockQuantity;
    private Integer minOrderQuantity;
    private Category category;
    private Long supplierId;
    private String supplierName;
}