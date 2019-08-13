package com.stijaktech.devnews.configuration.security.oauth2;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stijaktech.devnews.models.Provider;
import com.stijaktech.devnews.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserInfoExtractor {

    private ObjectMapper objectMapper;

    @Autowired
    public UserInfoExtractor(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public User extract(Provider provider, JsonNode userInfo) {
        switch (provider) {
            case FACEBOOK:
                return extractFacebookUserInfo(userInfo);
            case GOOGLE:
                return extractGoogleUserInfo(userInfo);
            case GITHUB:
                return extractGitHubUserInfo(userInfo);
            default:
                throw new IllegalStateException("Unsupported provider: " + provider.getName());
        }
    }

    private User extractGoogleUserInfo(JsonNode jsonNode) {
        User user = new User();
        user.setProvider(Provider.GOOGLE);
        user.setEmail(jsonNode.get("email").asText());
        user.setPicture(jsonNode.get("picture").asText());
        user.setFirstName(jsonNode.get("given_name").asText());
        user.setLastName(jsonNode.get("family_name").asText());
        return user;
    }

    private User extractFacebookUserInfo(JsonNode jsonNode) {
        User user = new User();
        user.setProvider(Provider.FACEBOOK);
        user.setEmail(jsonNode.get("email").asText());
        user.setPicture(jsonNode.get("picture").asText());
        user.setFirstName(jsonNode.get("given_name").asText());
        user.setLastName(jsonNode.get("family_name").asText());
        return user;
    }

    private User extractGitHubUserInfo(JsonNode jsonNode) {
        User user = new User();
        user.setProvider(Provider.GITHUB);
        user.setEmail(jsonNode.get("email").asText());
        user.setPicture(jsonNode.get("picture").asText());
        user.setFirstName(jsonNode.get("given_name").asText());
        user.setLastName(jsonNode.get("family_name").asText());
        return user;
    }

}
