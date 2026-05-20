package ma.solostock.payment.controller;
import lombok.RequiredArgsConstructor;
import ma.solostock.payment.dto.PaymentRequest;
import ma.solostock.payment.entity.Transaction;
import ma.solostock.payment.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/pay")
    public ResponseEntity<Transaction> pay(@RequestBody PaymentRequest req) {
        return ResponseEntity.ok(paymentService.processPayment(req));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAll() {
        return ResponseEntity.ok(paymentService.getAll());
    }

    @GetMapping("/transactions/{id}")
    public ResponseEntity<Transaction> getById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getById(id));
    }

    @GetMapping("/transactions/payer/{payerId}")
    public ResponseEntity<List<Transaction>> byPayer(@PathVariable Long payerId) {
        return ResponseEntity.ok(paymentService.getByPayer(payerId));
    }

    @GetMapping("/revenue/total")
    public ResponseEntity<Double> totalRevenue() {
        return ResponseEntity.ok(paymentService.getTotalRevenue());
    }
}