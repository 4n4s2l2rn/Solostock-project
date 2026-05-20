package ma.solostock.negotiation.repository;
import ma.solostock.negotiation.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByBuyerId(Long buyerId);
    List<Offer> findBySupplierId(Long supplierId);
    List<Offer> findByStatus(OfferStatus status);
    long countByStatus(OfferStatus status);
    long count();
}