package ma.solostock.analytics.controller;
import lombok.RequiredArgsConstructor;
import ma.solostock.analytics.dto.DashboardDto;
import ma.solostock.analytics.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDto> getDashboard() {
        return ResponseEntity.ok(analyticsService.getDashboard());
    }
}