package ma.solostock.payment.service;
import lombok.RequiredArgsConstructor;
import ma.solostock.payment.dto.PaymentRequest;
import ma.solostock.payment.entity.*;
import ma.solostock.payment.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class PaymentService {
    private final TransactionRepository transactionRepository;

    public Transaction processPayment(PaymentRequest req) {
        Transaction t = Transaction.builder()
                .contractId(req.getContractId()).payerId(req.getPayerId())
                .receiverId(req.getReceiverId()).amount(req.getAmount())
                .method(req.getMethod()).reference(UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .status(PaymentStatus.COMPLETED).completedAt(LocalDateTime.now()).build();
        return transactionRepository.save(t);
    }

    public List<Transaction> getByPayer(Long payerId) { return transactionRepository.findByPayerId(payerId); }
    public List<Transaction> getAll() { return transactionRepository.findAll(); }
    public Transaction getById(Long id) {
        return transactionRepository.findById(id).orElseThrow(() -> new RuntimeException("Transaction non trouvée"));
    }
    public Double getTotalRevenue() {
        Double total = transactionRepository.sumCompleted();
        return total != null ? total : 0.0;
    }
}