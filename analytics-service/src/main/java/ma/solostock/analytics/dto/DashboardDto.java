package ma.solostock.analytics.dto;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardDto {
    private long totalProducts;
    private long totalOffers;
    private long acceptedOffers;
    private double conversionRate;
    private double totalRevenue;
    private String topCategory;
}