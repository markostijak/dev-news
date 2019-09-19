package com.stijaktech.devnews.features.authentication.jwt;

import com.stijaktech.devnews.domain.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class JwtAuthenticationProvider implements AuthenticationProvider {

    private JwtProvider jwtProvider;
    private UserRepository userRepository;

    @Autowired
    public JwtAuthenticationProvider(JwtProvider jwtProvider, UserRepository userRepository) {
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String jwt = (String) authentication.getCredentials();

        return jwtProvider.parse(jwt)
                .flatMap(jws -> userRepository.findById(jws.getBody().getSubject()))
                .map(user -> new JwtAuthenticationToken(user, jwt, user.getAuthorities()))
                .orElseThrow(() -> new JwtAuthenticationException("Invalid access token", jwt));
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return JwtAuthenticationToken.class.equals(authentication);
    }

}
