package com.stijaktech.devnews.features.authentication.login;

import com.stijaktech.devnews.domain.user.UserRepository;
import com.stijaktech.devnews.features.authentication.Provider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class EmailPasswordAuthenticationProvider implements AuthenticationProvider {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public EmailPasswordAuthenticationProvider(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String email = (String) authentication.getPrincipal();
        String password = (String) authentication.getCredentials();

        return userRepository.findByEmail(email)
                .filter(user -> user.getProvider() == Provider.LOCAL)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .map(user -> new EmailPasswordAuthenticationToken(user, password, user.getAuthorities()))
                .orElseThrow(() -> new EmailNotFoundException("Email not found " + email));
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return EmailPasswordAuthenticationToken.class.equals(authentication);
    }

}
