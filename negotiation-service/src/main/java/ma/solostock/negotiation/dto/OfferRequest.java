package ma.solostock.negotiation.dto;
import lombok.Data;

@Data
public class OfferRequest {
    private Long productId;
    private String productName;
    private Long buyerId;
    private Long supplierId;
    private Double proposedPrice;
    private Double originalPrice;
    private Integer quantity;
    private String message;
}