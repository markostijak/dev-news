package com.stijaktech.devnews.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stijaktech.devnews.models.Login;
import com.stijaktech.devnews.models.User;
import com.stijaktech.devnews.repositories.UserRepository;
import com.stijaktech.devnews.security.jwt.JwtAwareAuthenticationSuccessHandler;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Component
public class EmailAndPasswordAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    private ObjectMapper objectMapper;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    public EmailAndPasswordAuthenticationFilter(
            ObjectMapper objectMapper,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtAwareAuthenticationSuccessHandler successHandler) {

        super(new AntPathRequestMatcher("/login", HttpMethod.POST.name()));
        this.objectMapper = objectMapper;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        setAuthenticationManager(authenticationManager);
        setAuthenticationSuccessHandler(successHandler);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        Login login = objectMapper.readValue(request.getInputStream(), Login.class);

        User user = userRepository.findByEmail(login.getEmail()).orElseThrow(() -> {
            throw new IllegalStateException("User not found: " + login.getEmail());
        });

        if (passwordEncoder.matches(login.getPassword(), user.getPassword())) {
            Authentication authentication = new AbstractAuthenticationToken(List.of()) {
                @Override
                public Object getCredentials() {
                    return login.getPassword();
                }

                @Override
                public Object getPrincipal() {
                    return user;
                }
            };
            authentication.setAuthenticated(true);
            return authentication;
        }

        return null;
    }

}
