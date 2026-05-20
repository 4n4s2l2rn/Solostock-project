package ma.solostock.analytics.service;
import ma.solostock.analytics.dto.DashboardDto;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AnalyticsService {

    public DashboardDto getDashboard() {
        return DashboardDto.builder()
                .totalProducts(safeGetLong("http://localhost:8082/api/catalog/products/count"))
                .totalOffers(safeGetLong("http://localhost:8083/api/negotiation/offers/count"))
                .acceptedOffers(safeGetLong("http://localhost:8083/api/negotiation/offers/count"))
                .conversionRate(0.0)
                .totalRevenue(safeGetDouble("http://localhost:8085/api/payment/revenue/total"))
                .topCategory("ELECTRONIQUE")
                .build();
    }

    private long safeGetLong(String url) {
        try {
            Long r = new RestTemplate().getForObject(url, Long.class);
            return r != null ? r : 0L;
        } catch (Exception e) { return 0L; }
    }

    private double safeGetDouble(String url) {
        try {
            Double r = new RestTemplate().getForObject(url, Double.class);
            return r != null ? r : 0.0;
        } catch (Exception e) { return 0.0; }
    }
}
