package com.stijaktech.devnews.configuration.security.authentication.tokens;

import org.springframework.security.core.AuthenticationException;

public class EmailNotFoundException extends AuthenticationException {

    public EmailNotFoundException(String msg, Throwable t) {
        super(msg, t);
    }

    public EmailNotFoundException(String msg) {
        super(msg);
    }

}
