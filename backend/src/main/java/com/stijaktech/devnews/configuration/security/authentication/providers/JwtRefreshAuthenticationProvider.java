package com.stijaktech.devnews.configuration.security.authentication.providers;

import com.stijaktech.devnews.configuration.security.authentication.tokens.JwtAuthenticationException;
import com.stijaktech.devnews.configuration.security.authentication.tokens.JwtAuthenticationToken;
import com.stijaktech.devnews.configuration.security.authentication.tokens.JwtRefreshAuthenticationToken;
import com.stijaktech.devnews.configuration.security.jwt.JwtProvider;
import com.stijaktech.devnews.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class JwtRefreshAuthenticationProvider implements AuthenticationProvider {

    private JwtProvider jwtProvider;
    private UserRepository userRepository;

    @Autowired
    public JwtRefreshAuthenticationProvider(JwtProvider jwtProvider, UserRepository userRepository) {
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String accessToken = (String) authentication.getPrincipal();
        String refreshToken = (String) authentication.getCredentials();

        return jwtProvider.parse(refreshToken)
                .flatMap(jws -> userRepository.findById(jws.getBody().getSubject()))
                .map(user -> new JwtAuthenticationToken(user, refreshToken, user.getAuthorities()))
                .orElseThrow(() -> new JwtAuthenticationException("Invalid refresh token", refreshToken));
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return JwtRefreshAuthenticationToken.class.equals(authentication);
    }

}