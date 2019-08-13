package com.stijaktech.devnews.configuration.security.authentication.filters;

import com.stijaktech.devnews.configuration.security.authentication.tokens.EmailPasswordAuthenticationToken;
import com.stijaktech.devnews.configuration.security.authentication.tokens.AuthorizationCodeAuthenticationToken;
import com.stijaktech.devnews.configuration.security.authentication.tokens.JwtRefreshAuthenticationToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
public class LoginAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    @Autowired
    public LoginAuthenticationFilter(AuthenticationManager authenticationManager, JwtAwareAuthenticationSuccessHandler successHandler) {
        super(new OrRequestMatcher(
                new AntPathRequestMatcher("/auth/login"),
                new AntPathRequestMatcher("/auth/social-login"),
                new AntPathRequestMatcher("/auth/jwt-refresh")
        ));
        setAuthenticationManager(authenticationManager);
        setAuthenticationSuccessHandler(successHandler);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header == null || !header.toLowerCase().startsWith("basic ")) {
            throw new BadCredentialsException("Credentials are missing!");
        }

        String[] tokens = extractAndDecodeHeader(header, request);
        assert tokens.length == 2;

        Authentication authentication;
        switch (request.getServletPath()) {
            case "/auth/login":
                authentication = new EmailPasswordAuthenticationToken(tokens[0], tokens[1]);
                break;
            case "/auth/social-login":
                authentication = new AuthorizationCodeAuthenticationToken(tokens[0], tokens[1]);
                break;
            case "/auth/jwt-refresh":
                authentication = new JwtRefreshAuthenticationToken(tokens[0], tokens[1]);
                break;
            default:
                throw new IllegalStateException("Unsupported path");
        }

        return getAuthenticationManager().authenticate(authentication);
    }

    private String[] extractAndDecodeHeader(String header, HttpServletRequest request) throws IOException {
        byte[] base64Token = header.substring(6).getBytes(StandardCharsets.UTF_8);
        byte[] decoded;

        try {
            decoded = Base64.getDecoder().decode(base64Token);
        } catch (IllegalArgumentException e) {
            throw new BadCredentialsException("Failed to decode basic authentication token");
        }

        String token = new String(decoded, StandardCharsets.UTF_8);

        int delimiter = token.indexOf(":");

        if (delimiter == -1) {
            throw new BadCredentialsException("Invalid basic authentication token");
        }

        return new String[]{token.substring(0, delimiter), token.substring(delimiter + 1)};
    }

}
