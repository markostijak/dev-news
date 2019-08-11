package com.stijaktech.devnews.security.jwt;

import com.stijaktech.devnews.models.User;
import com.stijaktech.devnews.repositories.UserRepository;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwt;
import io.undertow.util.Headers;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private JwtProvider jwtProvider;
    private UserRepository userRepository;
    private AuthenticationSuccessHandler successHandler;

    public JwtAuthenticationFilter(JwtProvider jwtProvider, UserRepository userRepository, AuthenticationSuccessHandler successHandler) {
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
        this.successHandler = successHandler;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String jwtString = request.getParameter("jwt");

        if (jwtString == null) {
            String bearer = request.getHeader(Headers.AUTHORIZATION_STRING);
            if (bearer != null && bearer.startsWith("Bearer ")) {
                jwtString = bearer.substring(7);
            }
        }

        if (jwtString != null) {
            if (jwtProvider.validate(jwtString)) {
                Jwt<Header, String> jwt = jwtProvider.parse(jwtString);
                User user = userRepository.findById(jwt.getBody()).orElseThrow(() -> new IllegalStateException("Invalid user " + jwt.getBody()));
                Authentication authentication = new JwtAuthenticationToken(jwt, user);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    protected void authenticate(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = request.getHeader(JwtProvider.ACCESS_TOKEN_HEADER);
        if (accessToken != null && jwtProvider.validate(accessToken)) {
            Jwt<Header, String> jwt = jwtProvider.parse(accessToken);
            userRepository.findById(jwt.getBody()).ifPresent(user -> {
                Authentication authentication = new JwtAuthenticationToken(jwt, user);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            });
        }
    }

    protected void refresh(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        String refreshToken = request.getHeader(JwtProvider.REFRESH_TOKEN_HEADER);
        if (refreshToken != null && jwtProvider.validate(refreshToken)) {
            Jwt<Header, String> jwt = jwtProvider.parse(refreshToken);
            User user = userRepository.findById(jwt.getBody()).orElseThrow(() -> new JwtAuthenticationException("Invalid refresh token!"));
            if (refreshToken.equals(user.getRefreshToken())) {
                successHandler.onAuthenticationSuccess(request, response, new JwtAuthenticationToken(jwt, user));
            }
        }
    }

    protected void validate(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = request.getHeader(JwtProvider.ACCESS_TOKEN_HEADER);
        if (accessToken != null && jwtProvider.validate(accessToken)) {
            Jwt<Header, String> jwt = jwtProvider.parse(accessToken);
            userRepository.findById(jwt.getBody()).ifPresent(user -> {

            });
        }
    }

}
