package com.stijaktech.devnews.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stijaktech.devnews.models.User;
import com.stijaktech.devnews.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAwareAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private JwtProvider jwtProvider;
    private ObjectMapper objectMapper;

    @Autowired
    public JwtAwareAuthenticationSuccessHandler(JwtProvider jwtProvider, ObjectMapper objectMapper) {
        this.jwtProvider = jwtProvider;
        this.objectMapper = objectMapper;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        User user = (User) authentication.getPrincipal();

        String refreshToken = user.getRefreshToken();
        String accessToken = jwtProvider.generateAccessToken(authentication);

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setHeader(JwtProvider.ACCESS_TOKEN_HEADER, accessToken);
        response.setHeader(JwtProvider.REFRESH_TOKEN_HEADER, refreshToken);
        response.setStatus(HttpStatus.OK.value());

        objectMapper.writeValue(response.getOutputStream(), user);
    }

}
