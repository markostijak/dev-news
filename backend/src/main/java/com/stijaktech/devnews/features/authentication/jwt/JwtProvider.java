package com.stijaktech.devnews.features.authentication.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stijaktech.devnews.features.authentication.AuthenticatedUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Clock;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwsHeader;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SigningKeyResolver;
import io.jsonwebtoken.impl.DefaultClock;
import io.jsonwebtoken.jackson.io.JacksonDeserializer;
import io.jsonwebtoken.jackson.io.JacksonSerializer;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.time.Duration;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Component
public class JwtProvider {

    enum Type {
        ACCESS,
        REFRESH
    }

    public static String TYPE = "type";
    public static String PRINCIPAL = "principal";

    private final Random random;
    private final JwtProperties properties;
    private final JwtSecretRepository jwtSecretRepository;
    private final JacksonSerializer<Map<String, ?>> jacksonSerializer;
    private final JacksonDeserializer<Map<String, ?>> jacksonDeserializer;

    @Setter(onMethod_ = @Autowired(required = false))
    private Clock clock = new DefaultClock();

    @Autowired
    public JwtProvider(JwtProperties properties, JwtSecretRepository jwtSecretRepository, ObjectMapper objectMapper) {
        this.random = new Random();
        this.properties = properties;
        this.jwtSecretRepository = jwtSecretRepository;
        this.jacksonSerializer = new JacksonSerializer<>(objectMapper);
        this.jacksonDeserializer = new JacksonDeserializer<>(Map.of(PRINCIPAL, AuthenticatedUser.class));
    }

    public String generateAccessToken(AuthenticatedUser user) {
        return generateToken(user, properties.getAccessTokenValidity())
                .claim(TYPE, Type.ACCESS.ordinal())
                .compact();
    }

    public String generateRefreshToken(AuthenticatedUser user) {
        return generateToken(user, properties.getRefreshTokenValidity())
                .claim(TYPE, Type.REFRESH.ordinal())
                .compact();
    }

    private JwtBuilder generateToken(AuthenticatedUser user, Duration validity) {
        JwtSecret secret = random(jwtSecretRepository.findAll());
        return Jwts.builder()
                .signWith(parseKey(secret))
                .setSubject(user.getUsername())
                .setIssuedAt(clock.now())
                .setExpiration(new java.util.Date(clock.now().getTime() + validity.toMillis()))
                .setIssuer(properties.getIssuer())
                .setHeaderParam(JwsHeader.KEY_ID, secret.getId())
                .claim(PRINCIPAL, user)
                .serializeToJsonWith(jacksonSerializer);
    }

    public boolean isAccessToken(Jws<Claims> jws) {
        return jws.getBody().get(TYPE, Integer.class) == Type.ACCESS.ordinal();
    }

    public boolean isRefreshToken(Jws<Claims> jws) {
        return jws.getBody().get(TYPE, Integer.class) == Type.REFRESH.ordinal();
    }

    public AuthenticatedUser parseUserDetails(Jws<Claims> jws) {
        return jws.getBody().get(PRINCIPAL, AuthenticatedUser.class);
    }

    public Optional<Jws<Claims>> parse(@NonNull String jwsString) {
        try {
            Jws<Claims> jws = Jwts.parserBuilder().setSigningKeyResolver(new SigningKeyResolver() {
                @Override
                public Key resolveSigningKey(JwsHeader header, Claims claims) {
                    return resolveSigningKey(header, "");
                }

                @Override
                public Key resolveSigningKey(JwsHeader header, String plaintext) {
                    return jwtSecretRepository.findById(header.getKeyId())
                            .map(jwtSecret -> parseKey(jwtSecret))
                            .orElseThrow(() -> new JwtException("Invalid jwt secret id"));
                }
            }).setClock(clock).deserializeJsonWith(jacksonDeserializer).build().parseClaimsJws(jwsString);

            return Optional.of(jws);
        } catch (JwtException e) {
            return Optional.empty();
        }
    }

    private JwtSecret random(List<JwtSecret> jwtSecrets) {
        return jwtSecrets.get(random.nextInt(jwtSecrets.size()));
    }

    private Key parseKey(JwtSecret jwtSecret) {
        return new SecretKeySpec(Base64.getDecoder().decode(jwtSecret.getValue()), SignatureAlgorithm.HS512.getJcaName());
    }

}
