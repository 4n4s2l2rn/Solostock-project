package ma.solostock.negotiation.dto;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ContractRequest {
    private Long offerId;
    private Long buyerId;
    private Long supplierId;
    private Double finalPrice;
    private Integer quantity;
    private String terms;
    private LocalDate startDate;
    private LocalDate endDate;
}