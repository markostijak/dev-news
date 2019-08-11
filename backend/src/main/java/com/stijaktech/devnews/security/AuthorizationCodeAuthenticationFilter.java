package com.stijaktech.devnews.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stijaktech.devnews.models.Provider;
import com.stijaktech.devnews.models.SocialLogin;
import com.stijaktech.devnews.models.User;
import com.stijaktech.devnews.repositories.UserRepository;
import com.stijaktech.devnews.security.jwt.JwtAwareAuthenticationSuccessHandler;
import com.stijaktech.devnews.security.oauth2.ProviderDetails;
import com.stijaktech.devnews.security.oauth2.ProviderRepository;
import com.stijaktech.devnews.security.oauth2.UserInfoExtractor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.DefaultOAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.token.AccessTokenRequest;
import org.springframework.security.oauth2.client.token.DefaultAccessTokenRequest;
import org.springframework.security.oauth2.client.token.grant.code.AuthorizationCodeAccessTokenProvider;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Slf4j
@Component
public class AuthorizationCodeAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    private ObjectMapper objectMapper;
    private UserRepository userRepository;
    private UserInfoExtractor userInfoExtractor;
    private ProviderRepository providerRepository;
    private AuthorizationCodeAccessTokenProvider accessTokenProvider;

    protected AuthorizationCodeAuthenticationFilter(
            ObjectMapper objectMapper,
            UserRepository userRepository,
            UserInfoExtractor userInfoExtractor,
            ProviderRepository providerRepository,
            AuthenticationManager authenticationManager,
            JwtAwareAuthenticationSuccessHandler successHandler,
            AuthorizationCodeAccessTokenProvider accessTokenProvider) {

        super(new AntPathRequestMatcher("/social-login", HttpMethod.POST.name()));
        this.objectMapper = objectMapper;
        this.userRepository = userRepository;
        this.userInfoExtractor = userInfoExtractor;
        this.providerRepository = providerRepository;
        this.accessTokenProvider = accessTokenProvider;
        setAuthenticationManager(authenticationManager);
        setAuthenticationSuccessHandler(successHandler);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        SocialLogin login = objectMapper.readValue(request.getInputStream(), SocialLogin.class);

        Provider provider = login.getProvider();
        ProviderDetails providerDetails = providerRepository.findByName(provider.getName()).orElseThrow(() -> {
            throw new IllegalStateException("Unsupported OAuth2 provider " + provider);
        });

        try {
            AccessTokenRequest accessTokenRequest = new DefaultAccessTokenRequest();
            accessTokenRequest.setAuthorizationCode(login.getCode());

            OAuth2AccessToken accessToken = accessTokenProvider.obtainAccessToken(providerDetails, accessTokenRequest);

            OAuth2RestTemplate restTemplate = new OAuth2RestTemplate(providerDetails, new DefaultOAuth2ClientContext(accessToken));
            String userInfo = restTemplate.getForObject(providerDetails.getUserInfoUri(), String.class);

            User user = userInfoExtractor.extract(provider, userInfo);
            userRepository.findByEmail(user.getEmail()).ifPresent(existing -> {
                user.setId(existing.getId());
                user.setPassword(existing.getPassword());
            });
            userRepository.save(user);

            Authentication authentication = new AbstractAuthenticationToken(List.of()) {
                @Override
                public Object getCredentials() {
                    return login.getCode();
                }

                @Override
                public Object getPrincipal() {
                    return user;
                }
            };

            authentication.setAuthenticated(true);
            return authentication;
        } catch (Exception e) {
            return null;
        }
    }

}
