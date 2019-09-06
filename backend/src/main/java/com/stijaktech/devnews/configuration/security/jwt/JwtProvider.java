package com.stijaktech.devnews.configuration.security.jwt;

import com.stijaktech.devnews.models.User;
import io.jsonwebtoken.*;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.sql.Date;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Component
public class JwtProvider {

    private static final int TEN_MINUTES = 600000;
    private static final int ONE_MONTH = 2592000;

    private Random random;
    private JwtSecretRepository jwtSecretRepository;

    public JwtProvider(JwtSecretRepository jwtSecretRepository) {
        this.random = new Random();
        this.jwtSecretRepository = jwtSecretRepository;
    }

    public String generateAccessToken(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return generateToken(user, TEN_MINUTES);
    }

    public String generateRefreshToken(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return generateToken(user, ONE_MONTH);
    }

    private String generateToken(User user, int expireAfter) {
        JwtSecret secret = random(jwtSecretRepository.findAll());
        return Jwts.builder()
                .signWith(SignatureAlgorithm.HS256, secret.getValue())
                .setSubject(user.getId())
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(Instant.now().plusSeconds(expireAfter)))
                .setIssuer("dev-news")
                .setHeaderParam(JwsHeader.KEY_ID, secret.getId())
                .compact();
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
