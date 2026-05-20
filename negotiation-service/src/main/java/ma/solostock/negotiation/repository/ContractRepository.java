package ma.solostock.negotiation.repository;
import ma.solostock.negotiation.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContractRepository extends JpaRepository<Contract, Long> {
    List<Contract> findByBuyerId(Long buyerId);
    List<Contract> findBySupplierId(Long supplierId);
}