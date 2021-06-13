package com.stijaktech.devnews.features.authentication.oauth2;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

import static com.stijaktech.devnews.features.authentication.login.LoginAuthenticationFilter.LoginDetails;

public class AuthorizationCodeAuthenticationToken extends UsernamePasswordAuthenticationToken {

    public AuthorizationCodeAuthenticationToken(LoginDetails loginDetails) {
        super(loginDetails.principal(), loginDetails.credentials());
    }


    public AuthorizationCodeAuthenticationToken(Object principal, Object credentials) {
        super(principal, credentials);
    }

    public AuthorizationCodeAuthenticationToken(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities) {
        super(principal, credentials, authorities);
    }

}
