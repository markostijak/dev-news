package com.stijaktech.devnews.features.authentication.login;

import com.stijaktech.devnews.features.authentication.WebDetails;
import com.stijaktech.devnews.features.authentication.jwt.JwtRefreshAuthenticationToken;
import com.stijaktech.devnews.features.authentication.oauth2.AuthorizationCodeAuthenticationToken;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.springframework.util.StringUtils.hasText;

public class LoginAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    public record LoginDetails(String principal, String credentials) {
    }

    private static final String LOGIN = "/login";
    private static final String OAUTH_LOGIN = "/login/oauth";
    private static final String REFRESH = "/refresh";

    public LoginAuthenticationFilter(
            AuthenticationManager authenticationManager, AuthenticationSuccessHandler successHandler) {
        super(new OrRequestMatcher(new AntPathRequestMatcher(LOGIN),
                new AntPathRequestMatcher(OAUTH_LOGIN), new AntPathRequestMatcher(REFRESH)));
        setAuthenticationManager(authenticationManager);
        setAuthenticationSuccessHandler(successHandler);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header == null || !header.toLowerCase().startsWith("basic ")) {
            throw new BadCredentialsException("Credentials are missing!");
        }

        LoginDetails loginDetails = extractFromHeader(header);
        assert hasText(loginDetails.principal) && hasText(loginDetails.credentials);

        var authentication = switch (request.getServletPath()) {
            case LOGIN -> new EmailOrUsernamePasswordAuthenticationToken(loginDetails);
            case OAUTH_LOGIN -> new AuthorizationCodeAuthenticationToken(loginDetails);
            case REFRESH -> new JwtRefreshAuthenticationToken(loginDetails);
            default -> throw new IllegalStateException("Unsupported path");
        };

        authentication.setDetails(new WebDetails(request));

        return getAuthenticationManager().authenticate(authentication);
    }

    private LoginDetails extractFromHeader(String header) {
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

        return new LoginDetails(token.substring(0, delimiter), token.substring(delimiter + 1));
    }

}
