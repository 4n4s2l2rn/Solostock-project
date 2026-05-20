package ma.solostock.auth.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="users")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique=true, nullable=false) private String email;
    @Column(nullable=false) private String password;
    private String fullName;
    private String company;
    private String phone;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private Role role;
    @Builder.Default private Boolean active = true;
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
}