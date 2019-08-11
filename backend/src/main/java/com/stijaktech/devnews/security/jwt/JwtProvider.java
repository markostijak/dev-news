package com.stijaktech.devnews.security.jwt;

import com.stijaktech.devnews.models.User;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwt;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class JwtProvider {

    static final String ACCESS_TOKEN_HEADER = "Jwt-Access-Token";
    static final String REFRESH_TOKEN_HEADER = "Jwt-Refresh-Token";

    private JwtSecretRepository jwtSecretRepository;

    public JwtProvider(JwtSecretRepository jwtSecretRepository) {
        this.jwtSecretRepository = jwtSecretRepository;
    }

    public String generateAccessToken(Authentication authentication) {
        return null;
    }

    public String generateRefreshToken(User user) {
        return null;
    }

    public Jwt<Header, String> parse(String jwtString) {
        return null;
    }

    public boolean validate(String jwtString) {
        return false;
    }

}
