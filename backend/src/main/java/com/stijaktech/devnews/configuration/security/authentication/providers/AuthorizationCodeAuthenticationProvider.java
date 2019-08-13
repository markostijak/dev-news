package com.stijaktech.devnews.configuration.security.authentication.providers;

import com.fasterxml.jackson.databind.JsonNode;
import com.stijaktech.devnews.configuration.security.authentication.tokens.AuthorizationCodeAuthenticationToken;
import com.stijaktech.devnews.configuration.security.oauth2.ProviderDetails;
import com.stijaktech.devnews.configuration.security.oauth2.ProviderRepository;
import com.stijaktech.devnews.configuration.security.oauth2.UserInfoExtractor;
import com.stijaktech.devnews.models.Provider;
import com.stijaktech.devnews.models.User;
import com.stijaktech.devnews.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.DefaultOAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.token.AccessTokenRequest;
import org.springframework.security.oauth2.client.token.DefaultAccessTokenRequest;
import org.springframework.security.oauth2.client.token.grant.code.AuthorizationCodeAccessTokenProvider;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.stereotype.Component;

@Component
public class AuthorizationCodeAuthenticationProvider implements AuthenticationProvider {

    private UserService userService;
    private UserInfoExtractor userInfoExtractor;
    private ProviderRepository providerRepository;
    private AuthorizationCodeAccessTokenProvider accessTokenProvider;

    @Autowired
    public AuthorizationCodeAuthenticationProvider(
            UserService userService,
            UserInfoExtractor userInfoExtractor,
            ProviderRepository providerRepository,
            AuthorizationCodeAccessTokenProvider accessTokenProvider) {

        this.userService = userService;
        this.userInfoExtractor = userInfoExtractor;
        this.providerRepository = providerRepository;
        this.accessTokenProvider = accessTokenProvider;
    }

    @Override
    @SuppressWarnings("CodeBlock2Expr")
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String providerString = (String) authentication.getPrincipal();
        String authorizationCode = (String) authentication.getCredentials();

        ProviderDetails providerDetails = providerRepository.findByName(providerString.toLowerCase()).orElseThrow(() -> {
            return new BadCredentialsException("Unsupported provider " + providerString.toLowerCase());
        });

        AccessTokenRequest accessTokenRequest = new DefaultAccessTokenRequest();
        accessTokenRequest.setAuthorizationCode(authorizationCode);

        OAuth2AccessToken accessToken = accessTokenProvider.obtainAccessToken(providerDetails, accessTokenRequest);

        OAuth2RestTemplate restTemplate = new OAuth2RestTemplate(providerDetails, new DefaultOAuth2ClientContext(accessToken));
        JsonNode userInfo = restTemplate.getForObject(providerDetails.getUserInfoUri(), JsonNode.class);

        Provider provider = Provider.valueOf(providerString);
        User user = userInfoExtractor.extract(provider, userInfo);
        user = userService.createOrUpdate(user, authorizationCode);

        return new AuthorizationCodeAuthenticationToken(user, authorizationCode, user.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return AuthorizationCodeAuthenticationToken.class.equals(authentication);
    }

}
