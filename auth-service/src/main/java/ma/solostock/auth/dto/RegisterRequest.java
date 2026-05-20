package ma.solostock.auth.dto;
import lombok.Data;
import ma.solostock.auth.entity.Role;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private String company;
    private String phone;
    private Role role;
}