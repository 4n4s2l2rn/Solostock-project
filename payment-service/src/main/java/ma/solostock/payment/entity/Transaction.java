package ma.solostock.payment.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="transactions")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Transaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long contractId;
    private Long payerId;
    private Long receiverId;
    private Double amount;
    @Builder.Default private String currency = "MAD";

    @Enumerated(EnumType.STRING) private PaymentMethod method;
    @Enumerated(EnumType.STRING) @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    private String reference;
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime completedAt;
}