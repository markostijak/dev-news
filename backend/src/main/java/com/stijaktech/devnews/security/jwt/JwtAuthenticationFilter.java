package com.stijaktech.devnews.security.jwt;

import com.stijaktech.devnews.models.User;
import com.stijaktech.devnews.repositories.UserRepository;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwt;
import io.jsonwebtoken.Jwts;
import io.undertow.util.Headers;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private UserRepository userRepository;

    public JwtAuthenticationFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
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
            Jwt<Header, String> jwt = Jwts.parser().parsePlaintextJwt(jwtString);
            User user = userRepository.findById(jwt.getBody()).orElseThrow(() -> new IllegalStateException("Invalid user "));
            Authentication authentication = new JwtAuthenticationToken(jwt, user);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

}
