package ma.solostock.negotiation.controller;
import lombok.RequiredArgsConstructor;
import ma.solostock.negotiation.dto.*;
import ma.solostock.negotiation.entity.*;
import ma.solostock.negotiation.service.NegotiationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/negotiation")
@RequiredArgsConstructor
public class NegotiationController {
    private final NegotiationService negotiationService;

    @PostMapping("/offers")
    public ResponseEntity<Offer> createOffer(@RequestBody OfferRequest req) {
        return ResponseEntity.ok(negotiationService.createOffer(req));
    }

    @PutMapping("/offers/{id}/accept")
    public ResponseEntity<Offer> accept(@PathVariable Long id) {
        return ResponseEntity.ok(negotiationService.acceptOffer(id));
    }

    @PutMapping("/offers/{id}/reject")
    public ResponseEntity<Offer> reject(@PathVariable Long id) {
        return ResponseEntity.ok(negotiationService.rejectOffer(id));
    }

    @PutMapping("/offers/{id}/counter")
    public ResponseEntity<Offer> counter(@PathVariable Long id, @RequestParam Double newPrice) {
        return ResponseEntity.ok(negotiationService.counterOffer(id, newPrice));
    }

    @GetMapping("/offers")
    public ResponseEntity<List<Offer>> getAllOffers() {
        return ResponseEntity.ok(negotiationService.getAllOffers());
    }

    @GetMapping("/offers/buyer/{buyerId}")
    public ResponseEntity<List<Offer>> byBuyer(@PathVariable Long buyerId) {
        return ResponseEntity.ok(negotiationService.getOffersByBuyer(buyerId));
    }

    @GetMapping("/offers/supplier/{supplierId}")
    public ResponseEntity<List<Offer>> bySupplier(@PathVariable Long supplierId) {
        return ResponseEntity.ok(negotiationService.getOffersBySupplier(supplierId));
    }

    @PostMapping("/contracts")
    public ResponseEntity<Contract> signContract(@RequestBody ContractRequest req) {
        return ResponseEntity.ok(negotiationService.signContract(req));
    }

    @GetMapping("/contracts")
    public ResponseEntity<List<Contract>> getAllContracts() {
        return ResponseEntity.ok(negotiationService.getAllContracts());
    }

    @GetMapping("/offers/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(negotiationService.countOffers());
    }
}