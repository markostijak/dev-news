package com.stijaktech.devnews.configuration.security.authentication.providers;

import com.stijaktech.devnews.configuration.security.authentication.tokens.JwtAuthenticationToken;
import com.stijaktech.devnews.configuration.security.authentication.tokens.JwtRefreshAuthenticationToken;
import com.stijaktech.devnews.configuration.security.jwt.JwtProvider;
import com.stijaktech.devnews.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class JwtRefreshAuthenticationProvider implements AuthenticationProvider {

    private JwtProvider jwtProvider;

    @Autowired
    public JwtRefreshAuthenticationProvider(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String refreshToken = (String) authentication.getCredentials();
        User user = new User();

        return new JwtAuthenticationToken(user, refreshToken, user.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return JwtRefreshAuthenticationToken.class.equals(authentication);
    }
}
