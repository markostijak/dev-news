package com.stijaktech.devnews.features.authentication.login;

import org.springframework.security.core.AuthenticationException;

public class EmailNotFoundException extends AuthenticationException {

    public EmailNotFoundException(String msg, Throwable t) {
        super(msg, t);
    }

    public EmailNotFoundException(String msg) {
        super(msg);
    }

}
