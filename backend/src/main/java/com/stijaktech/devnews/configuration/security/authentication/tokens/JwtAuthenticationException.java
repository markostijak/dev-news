package com.stijaktech.devnews.configuration.security.authentication.tokens;

import org.springframework.security.core.AuthenticationException;

public class JwtAuthenticationException extends AuthenticationException {

    private String jwt;

    public JwtAuthenticationException(String message, Throwable throwable, String jwt) {
        super(message + " (" + jwt + ")", throwable);
        this.jwt = jwt;
    }

    public JwtAuthenticationException(String message, String jwt) {
        super(message + " (" + jwt + ")");
        this.jwt = jwt;
    }

}
