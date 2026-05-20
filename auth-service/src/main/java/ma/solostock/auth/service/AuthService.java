package ma.solostock.auth.service;
import lombok.RequiredArgsConstructor;
import ma.solostock.auth.dto.*;
import ma.solostock.auth.entity.User;
import ma.solostock.auth.repository.UserRepository;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ma.solostock.auth.security.JwtService;

@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email déjà utilisé");
        User user = User.builder()
                .email(req.getEmail()).password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName()).company(req.getCompany())
                .phone(req.getPhone()).role(req.getRole()).build();
        userRepository.save(user);
        return buildResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return buildResponse(user);
    }

    private AuthResponse buildResponse(User user) {
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return AuthResponse.builder().id(user.getId()).token(token).email(user.getEmail())
                .role(user.getRole().name()).fullName(user.getFullName()).build();
    }
}