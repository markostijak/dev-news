package com.stijaktech.devnews.features.authentication.jwt;

import com.stijaktech.devnews.domain.user.Device;
import com.stijaktech.devnews.domain.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwsHeader;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SigningKeyResolver;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.sql.Date;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Component
public class JwtProvider {

    public static final String DEVICE = "device";
    private static final Duration ONE_MONTH = Duration.ofDays(30);
    private static final Duration TEN_MINUTES = Duration.ofMinutes(10);

    private final Random random;
    private final JwtSecretRepository jwtSecretRepository;

    public JwtProvider(JwtSecretRepository jwtSecretRepository) {
        this.random = new Random();
        this.jwtSecretRepository = jwtSecretRepository;
    }

    public String generateAccessToken(User user, Instant issuedAt) {
        return generateToken(user, issuedAt, issuedAt.plus(TEN_MINUTES))
                .compact();
    }

    public String generateRefreshToken(User user, Device device, Instant issuedAt) {
        return generateToken(user, issuedAt, issuedAt.plus(ONE_MONTH))
                .claim(DEVICE, device.getToken())
                .compact();
    }

    private JwtBuilder generateToken(User user, Instant issuedAt, Instant expiration) {
        JwtSecret secret = random(jwtSecretRepository.findAll());
        return Jwts.builder()
                .signWith(SignatureAlgorithm.HS256, secret.getValue())
                .setSubject(user.getId())
                .setIssuedAt(Date.from(issuedAt))
                .setExpiration(Date.from(expiration))
                .setIssuer("stijaktech")
                .setHeaderParam(JwsHeader.KEY_ID, secret.getId());
    }

    public Optional<Jws<Claims>> parse(@NonNull String jwsString) {
        try {
            Jws<Claims> jws = Jwts.parser().setSigningKeyResolver(new SigningKeyResolver() {
                @Override
                public Key resolveSigningKey(JwsHeader header, Claims claims) {
                    return resolveSigningKey(header, "");
                }

                @Override
                public Key resolveSigningKey(JwsHeader header, String plaintext) {
                    return jwtSecretRepository.findById(header.getKeyId())
                            .map(jwtSecret -> new SecretKeySpec(Base64.getDecoder().decode(jwtSecret.getValue()), "AES"))
                            .orElseThrow(() -> new JwtException("Invalid jwt secret id"));
                }
            }).parseClaimsJws(jwsString);

            return Optional.of(jws);
        } catch (JwtException e) {
            return Optional.empty();
        }
    }

    private JwtSecret random(List<JwtSecret> jwtSecrets) {
        return jwtSecrets.get(random.nextInt(jwtSecrets.size()));
    }

}
