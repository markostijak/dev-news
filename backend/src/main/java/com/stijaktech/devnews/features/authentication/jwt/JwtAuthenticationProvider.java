package com.stijaktech.devnews.features.authentication.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class JwtAuthenticationProvider implements AuthenticationProvider {

    private final JwtProvider jwtProvider;

    @Autowired
    public JwtAuthenticationProvider(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String jwt = (String) authentication.getCredentials();

        return jwtProvider.parse(jwt)
                .filter(jwtProvider::isAccessToken)
                .map(jwtProvider::parseUserDetails)
                .map(user -> new JwtAuthenticationToken(user, jwt, user.getAuthorities()))
                .orElseThrow(() -> new BadCredentialsException("Invalid access token!"));
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return JwtAuthenticationToken.class.equals(authentication);
    }

}
