package com.stijaktech.devnews.features.authentication.login;

import com.stijaktech.devnews.features.authentication.jwt.JwtRefreshAuthenticationToken;
import com.stijaktech.devnews.features.authentication.oauth2.AuthorizationCodeAuthenticationToken;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class LoginAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    private static final String AUTH_LOGIN = "/api/v1/auth/login";
    private static final String AUTH_SOCIAL_LOGIN = "/api/v1/auth/social-login";
    private static final String AUTH_REFRESH = "/api/v1/auth/refresh";

    public LoginAuthenticationFilter(AuthenticationManager authenticationManager, AuthenticationSuccessHandler successHandler) {
        super(new OrRequestMatcher(
                new AntPathRequestMatcher(AUTH_LOGIN),
                new AntPathRequestMatcher(AUTH_SOCIAL_LOGIN),
                new AntPathRequestMatcher(AUTH_REFRESH)
        ));
        setAuthenticationManager(authenticationManager);
        setAuthenticationSuccessHandler(successHandler);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header == null || !header.toLowerCase().startsWith("basic ")) {
            throw new BadCredentialsException("Credentials are missing!");
        }

        String[] tokens = extractAndDecodeHeader(header);
        assert tokens.length == 2;

        Authentication authentication;
        switch (request.getServletPath()) {
            case AUTH_LOGIN:
                authentication = new EmailPasswordAuthenticationToken(tokens[0], tokens[1]);
                break;
            case AUTH_SOCIAL_LOGIN:
                authentication = new AuthorizationCodeAuthenticationToken(tokens[0], tokens[1]);
                break;
            case AUTH_REFRESH:
                authentication = new JwtRefreshAuthenticationToken(tokens[0], tokens[1]);
                break;
            default:
                throw new IllegalStateException("Unsupported path");
        }

        return getAuthenticationManager().authenticate(authentication);
    }

    private String[] extractAndDecodeHeader(String header) {
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
