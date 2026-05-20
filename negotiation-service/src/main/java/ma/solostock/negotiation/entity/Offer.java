package ma.solostock.negotiation.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="offers")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Offer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long productId;
    private String productName;
    private Long buyerId;
    private Long supplierId;
    private Double proposedPrice;
    private Double originalPrice;
    private Integer quantity;
    private String message;

    @Enumerated(EnumType.STRING)
    @Builder.Default private OfferStatus status = OfferStatus.PENDING;

    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}