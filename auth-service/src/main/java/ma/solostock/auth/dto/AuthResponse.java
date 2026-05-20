package ma.solostock.auth.dto;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String token;
    private String email;
    private String role;
    private String fullName;
}