package com.stijaktech.devnews.features.authentication.jwt;

import com.stijaktech.devnews.domain.user.UserRepository;
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
        String refreshToken = (String) authentication.getCredentials();

        return jwtProvider.parse(refreshToken)
                .flatMap(jws -> userRepository.findById(jws.getBody().getSubject()))
                .filter(user -> user.getRefreshToken().equals(refreshToken)) // active token
                .map(user -> new JwtRefreshAuthenticationToken(user, refreshToken, user.getAuthorities()))
                .orElseThrow(() -> new JwtAuthenticationException("Invalid refresh token", refreshToken));
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return JwtRefreshAuthenticationToken.class.equals(authentication);
    }

}
