package com.stijaktech.devnews.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stijaktech.devnews.models.User;
import io.jsonwebtoken.Jwts;
import io.undertow.util.Headers;
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

    private ObjectMapper objectMapper;

    @Autowired
    public JwtAwareAuthenticationSuccessHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        User user = (User) authentication.getPrincipal();
        String jwt = Jwts.builder().setPayload(user.getEmail()).compact();

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setHeader(Headers.AUTHORIZATION_STRING, String.format("Bearer %s", jwt));
        response.setStatus(HttpStatus.OK.value());

        objectMapper.writeValue(response.getOutputStream(), user);
    }

}
