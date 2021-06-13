package com.stijaktech.devnews.features.authentication.login;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

import static com.stijaktech.devnews.features.authentication.login.LoginAuthenticationFilter.LoginDetails;

public class EmailOrUsernamePasswordAuthenticationToken extends UsernamePasswordAuthenticationToken {

    public EmailOrUsernamePasswordAuthenticationToken(LoginDetails loginDetails) {
        super(loginDetails.principal(), loginDetails.credentials());
    }

    public EmailOrUsernamePasswordAuthenticationToken(Object principal, Object credentials) {
        super(principal, credentials);
    }

    public EmailOrUsernamePasswordAuthenticationToken(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities) {
        super(principal, credentials, authorities);
    }

}
