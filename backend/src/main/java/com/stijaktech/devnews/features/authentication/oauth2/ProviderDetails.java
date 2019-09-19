package com.stijaktech.devnews.features.authentication.oauth2;

import org.springframework.security.oauth2.client.token.grant.code.AuthorizationCodeResourceDetails;

public class ProviderDetails extends AuthorizationCodeResourceDetails {

    private String userInfoUri;

    public String getUserInfoUri() {
        return userInfoUri;
    }

    public void setUserInfoUri(String userInfoUri) {
        this.userInfoUri = userInfoUri;
    }
}
