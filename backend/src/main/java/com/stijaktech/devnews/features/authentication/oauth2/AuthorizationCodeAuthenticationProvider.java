package com.stijaktech.devnews.features.authentication.oauth2;

import com.fasterxml.jackson.databind.JsonNode;
import com.stijaktech.devnews.domain.user.Provider;
import com.stijaktech.devnews.domain.user.User;
import com.stijaktech.devnews.domain.user.UserService;
import com.stijaktech.devnews.domain.user.device.Device;
import com.stijaktech.devnews.domain.user.device.DeviceService;
import com.stijaktech.devnews.features.authentication.AuthenticatedUser;
import com.stijaktech.devnews.features.authentication.WebDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.DefaultOAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.token.AccessTokenRequest;
import org.springframework.security.oauth2.client.token.DefaultAccessTokenRequest;
import org.springframework.security.oauth2.client.token.grant.code.AuthorizationCodeAccessTokenProvider;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.stereotype.Component;

@Component
public class AuthorizationCodeAuthenticationProvider implements AuthenticationProvider {

    private final UserService userService;
    private final DeviceService deviceService;
    private final ProviderRepository providerRepository;
    private final AuthorizationCodeAccessTokenProvider accessTokenProvider;

    @Autowired
    public AuthorizationCodeAuthenticationProvider(
            UserService userService,
            DeviceService deviceService,
            ProviderRepository providerRepository,
            AuthorizationCodeAccessTokenProvider accessTokenProvider) {

        this.deviceService = deviceService;
        this.userService = userService;
        this.providerRepository = providerRepository;
        this.accessTokenProvider = accessTokenProvider;
    }

    @Override
    public Authentication authenticate(Authentication authentication) {
        String providerString = (String) authentication.getPrincipal();
        String authorizationCode = (String) authentication.getCredentials();
        WebDetails webDetails = (WebDetails) authentication.getDetails();

        ProviderDetails providerDetails = providerRepository.findByName(providerString.toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Unsupported provider " + providerString));

        AccessTokenRequest accessTokenRequest = new DefaultAccessTokenRequest();
        accessTokenRequest.setAuthorizationCode(authorizationCode);

        OAuth2AccessToken accessToken = accessTokenProvider.obtainAccessToken(providerDetails, accessTokenRequest);

        OAuth2RestTemplate restTemplate = new OAuth2RestTemplate(providerDetails, new DefaultOAuth2ClientContext(accessToken));
        JsonNode userInfo = restTemplate.getForObject(providerDetails.getUserInfoUri(), JsonNode.class);

        Provider provider = Provider.valueOf(providerString);
        User model = extract(provider, userInfo);
        model = userService.createFromOAuthProvider(model, authorizationCode);

        Device device = deviceService.findOrCreate(model, webDetails);
        AuthenticatedUser user = new AuthenticatedUser(model, device.getToken());
        deviceService.updateLastUsedTime(model, device);

        return new AuthorizationCodeAuthenticationToken(user, authorizationCode, user.getAuthorities());
    }

    private User extract(Provider provider, JsonNode userInfo) {
        return switch (provider) {
            case FACEBOOK -> UserInfoExtractor.extractFacebookUserInfo(userInfo);
            case GOOGLE -> UserInfoExtractor.extractGoogleUserInfo(userInfo);
            case GITHUB -> UserInfoExtractor.extractGitHubUserInfo(userInfo);
            default -> throw new IllegalArgumentException("Unsupported provider: " + provider.getName());
        };
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return AuthorizationCodeAuthenticationToken.class.equals(authentication);
    }

}
