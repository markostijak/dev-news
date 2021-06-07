package com.stijaktech.devnews.features.authentication.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stijaktech.devnews.domain.user.User;
import com.stijaktech.devnews.features.authentication.AuthenticatedUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.rest.webmvc.support.RepositoryEntityLinks;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.MediaTypes;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAwareAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;
    private final ObjectMapper objectMapper;
    private final RepositoryEntityLinks links;

    @Autowired
    public JwtAwareAuthenticationSuccessHandler(@Qualifier("halMapper") ObjectMapper objectMapper,
                                                JwtProvider jwtProvider, RepositoryEntityLinks links) {
        this.objectMapper = objectMapper;
        this.jwtProvider = jwtProvider;
        this.links = links;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();

        String accessToken = jwtProvider.generateAccessToken(user);
        String refreshToken = jwtProvider.generateRefreshToken(user);

        response.setStatus(HttpStatus.OK.value());
        response.setContentType(MediaTypes.HAL_JSON_VALUE);
        response.setHeader("X-Auth-Token", accessToken);
        response.setHeader("X-Refresh-Token", refreshToken);
        response.setHeader("Access-Control-Expose-Headers", "X-Auth-Token, X-Refresh-Token");
        objectMapper.writeValue(response.getWriter(), createRepresentationModel(user));
    }

    private EntityModel<AuthenticatedUser> createRepresentationModel(AuthenticatedUser user) {
        return EntityModel.of(user, links.linkForItemResource(User.class, user.getId()).withSelfRel());
    }

}
