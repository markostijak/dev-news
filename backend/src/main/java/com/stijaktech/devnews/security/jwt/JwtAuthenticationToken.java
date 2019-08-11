package com.stijaktech.devnews.security.jwt;

import org.springframework.security.authentication.AbstractAuthenticationToken;

import java.util.List;

public class JwtAuthenticationToken extends AbstractAuthenticationToken {

    private Object principal;
    private Object credentials;

    public JwtAuthenticationToken(Object credentials, Object principal) {
        super(List.of());
        this.principal = principal;
        this.credentials = credentials;
    }

    @Override
    public Object getCredentials() {
        return credentials;
    }

    @Override
    public Object getPrincipal() {
        return principal;
    }

}
