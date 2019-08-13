package com.stijaktech.devnews.configuration.security.authentication.tokens;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class JwtRefreshAuthenticationToken extends UsernamePasswordAuthenticationToken {

    public JwtRefreshAuthenticationToken(Object principal, Object credentials) {
        super(principal, credentials);
    }

    public JwtRefreshAuthenticationToken(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities) {
        super(principal, credentials, authorities);
    }

}
