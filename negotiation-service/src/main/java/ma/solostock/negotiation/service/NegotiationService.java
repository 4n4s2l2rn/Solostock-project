package ma.solostock.negotiation.service;
import lombok.RequiredArgsConstructor;
import ma.solostock.negotiation.dto.*;
import ma.solostock.negotiation.entity.*;
import ma.solostock.negotiation.repository.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service @RequiredArgsConstructor
public class NegotiationService {
    private final OfferRepository offerRepository;
    private final ContractRepository contractRepository;

    public Offer createOffer(OfferRequest req) {
        Offer offer = Offer.builder()
                .productId(req.getProductId()).productName(req.getProductName())
                .buyerId(req.getBuyerId()).supplierId(req.getSupplierId())
                .proposedPrice(req.getProposedPrice()).originalPrice(req.getOriginalPrice())
                .quantity(req.getQuantity()).message(req.getMessage()).build();
        return offerRepository.save(offer);
    }

    public Offer acceptOffer(Long id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
        offer.setStatus(OfferStatus.ACCEPTED);
        offer.setUpdatedAt(LocalDateTime.now());
        return offerRepository.save(offer);
    }

    public Offer rejectOffer(Long id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
        offer.setStatus(OfferStatus.REJECTED);
        offer.setUpdatedAt(LocalDateTime.now());
        return offerRepository.save(offer);
    }

    public Offer counterOffer(Long id, Double newPrice) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
        offer.setProposedPrice(newPrice);
        offer.setStatus(OfferStatus.COUNTER_OFFERED);
        offer.setUpdatedAt(LocalDateTime.now());
        return offerRepository.save(offer);
    }

    public Contract signContract(ContractRequest req) {
        Contract contract = Contract.builder()
                .offerId(req.getOfferId()).buyerId(req.getBuyerId())
                .supplierId(req.getSupplierId()).finalPrice(req.getFinalPrice())
                .quantity(req.getQuantity()).terms(req.getTerms())
                .startDate(req.getStartDate()).endDate(req.getEndDate()).build();
        return contractRepository.save(contract);
    }

    public List<Offer> getAllOffers() { return offerRepository.findAll(); }
    public List<Offer> getOffersByBuyer(Long buyerId) { return offerRepository.findByBuyerId(buyerId); }
    public List<Offer> getOffersBySupplier(Long supplierId) { return offerRepository.findBySupplierId(supplierId); }
    public List<Contract> getAllContracts() { return contractRepository.findAll(); }
    public long countOffers() { return offerRepository.count(); }
    public long countAccepted() { return offerRepository.countByStatus(OfferStatus.ACCEPTED); }
}