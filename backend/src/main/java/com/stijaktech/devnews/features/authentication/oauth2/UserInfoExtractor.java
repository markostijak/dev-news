package com.stijaktech.devnews.features.authentication.oauth2;

import com.fasterxml.jackson.databind.JsonNode;
import com.stijaktech.devnews.domain.user.User;
import com.stijaktech.devnews.domain.user.Provider;

public class UserInfoExtractor {

    public static User extractGoogleUserInfo(JsonNode jsonNode) {
        User user = new User();
        user.setProvider(Provider.GOOGLE);
        user.setEmail(jsonNode.get("email").asText());
        user.setPicture(jsonNode.get("picture").asText());
        user.setFirstName(jsonNode.get("given_name").asText());
        user.setLastName(jsonNode.get("family_name").asText());
        return user;
    }

    public static User extractFacebookUserInfo(JsonNode jsonNode) {
        User user = new User();
        user.setProvider(Provider.FACEBOOK);
        user.setEmail(jsonNode.get("email").asText());
        user.setPicture(jsonNode.get("picture").asText());
        user.setFirstName(jsonNode.get("given_name").asText());
        user.setLastName(jsonNode.get("family_name").asText());
        return user;
    }

    public static User extractGitHubUserInfo(JsonNode jsonNode) {
        User user = new User();
        user.setProvider(Provider.GITHUB);
        user.setEmail(jsonNode.get("email").asText());
        user.setPicture(jsonNode.get("picture").asText());
        user.setFirstName(jsonNode.get("given_name").asText());
        user.setLastName(jsonNode.get("family_name").asText());
        return user;
    }

}
