package ma.solostock.auth.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtService {
    private static final String SECRET = "solostock-b2b-secret-key-2024-very-long-secure-key!!";
    private static final long EXPIRATION = 86400000L;

    public String generateToken(String email, String role) {
        Map<String,Object> claims = new HashMap<>();
        claims.put("role", role);
        return Jwts.builder().setClaims(claims).setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getKey(), SignatureAlgorithm.HS256).compact();
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails ud) {
        return extractEmail(token).equals(ud.getUsername()) && !isExpired(token);
    }

    private boolean isExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims,T> fn) {
        return fn.apply(Jwts.parserBuilder().setSigningKey(getKey()).build()
                .parseClaimsJws(token).getBody());
    }

    private Key getKey() { return Keys.hmacShaKeyFor(SECRET.getBytes()); }
}