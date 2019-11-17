package com.stijaktech.devnews.features.authentication.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stijaktech.devnews.features.authentication.jwt.JwtProvider;
import com.stijaktech.devnews.domain.user.User;
import com.stijaktech.devnews.domain.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;

@Component
public class JwtAwareAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private ObjectMapper jackson;
    private JwtProvider jwtProvider;
    private UserRepository userRepository;

    @Autowired
    public JwtAwareAuthenticationSuccessHandler(ObjectMapper jackson, JwtProvider jwtProvider, UserRepository userRepository) {
        this.jackson = jackson;
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        Instant now = Instant.now();

        String accessToken = jwtProvider.generateAccessToken(authentication, now);
        String refreshToken = jwtProvider.generateRefreshToken(authentication, now);

        User user = (User) authentication.getPrincipal();
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        response.setStatus(HttpStatus.OK.value());
        response.setHeader("X-Auth-Token", accessToken);
        response.setHeader("X-Refresh-Token", refreshToken);
        jackson.writeValue(response.getWriter(), user);
    }

}
