package ma.solostock.negotiation.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name="contracts")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Contract {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long offerId;
    private Long buyerId;
    private Long supplierId;
    private Double finalPrice;
    private Integer quantity;
    private String terms;
    private LocalDate startDate;
    private LocalDate endDate;
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
}