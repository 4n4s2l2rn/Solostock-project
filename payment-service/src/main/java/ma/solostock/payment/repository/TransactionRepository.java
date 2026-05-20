package ma.solostock.payment.repository;
import ma.solostock.payment.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByPayerId(Long payerId);
    List<Transaction> findByReceiverId(Long receiverId);
    List<Transaction> findByStatus(PaymentStatus status);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.status = 'COMPLETED'")
    Double sumCompleted();
}