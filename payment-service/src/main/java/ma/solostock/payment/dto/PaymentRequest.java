package ma.solostock.payment.dto;
import lombok.Data;
import ma.solostock.payment.entity.PaymentMethod;

@Data
public class PaymentRequest {
    private Long contractId;
    private Long payerId;
    private Long receiverId;
    private Double amount;
    private PaymentMethod method;
}