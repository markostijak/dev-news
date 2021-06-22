package com.stijaktech.devnews.features.authentication.oauth2;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.stijaktech.devnews.domain.user.Provider;
import com.stijaktech.devnews.domain.user.User;
import org.springframework.lang.NonNull;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;

public record UserInfoExtractor(OAuth2RestTemplate restTemplate, ProviderDetails providerDetails) {

    public User extract(@NonNull Provider provider) {
        JsonNode userInfo = fetchUserInfo();
        return switch (provider) {
            case FACEBOOK -> extractFacebookUserInfo(userInfo);
            case GOOGLE -> extractGoogleUserInfo(userInfo);
            case GITHUB -> extractGitHubUserInfo(userInfo);
            default -> throw new IllegalArgumentException("Unsupported provider: " + provider.getName());
        };
    }

    public User extractFacebookUserInfo(@NonNull JsonNode userInfo) {
        throw new UnsupportedOperationException();
    }

    public User extractGoogleUserInfo(@NonNull JsonNode userInfo) {
        User user = new User();
        user.setProvider(Provider.GOOGLE);
        user.setEmail(userInfo.get("email").asText());
        user.setFirstName(userInfo.get("given_name").asText());
        user.setLastName(userInfo.get("family_name").asText());
        return user;
    }

    public User extractGitHubUserInfo(@NonNull JsonNode userInfo) {
        String email = userInfo.get("email").asText(null);

        if (email == null) {
            String emailEndpoint = providerDetails.getUserInfoUri() + "/emails";
            ArrayNode emailInfo = restTemplate.getForObject(emailEndpoint, ArrayNode.class);
            for (int i = 0; emailInfo != null && i < emailInfo.size(); i++) {
                JsonNode node = emailInfo.get(i);
                if (node.get("primary").asBoolean()) {
                    email = node.get("email").asText();
                    break;
                }
            }
        }

        if (email == null) {
            throw new IllegalStateException("Missing email in OAuth response");
        }

        User user = new User();
        user.setEmail(email);
        user.setProvider(Provider.GITHUB);
        String[] name = userInfo.get("name").asText().split(" ");
        user.setFirstName(name[0]);
        user.setLastName(name[1]);
        return user;
    }

    @NonNull
    private JsonNode fetchUserInfo() {
        JsonNode remoteUser = restTemplate.getForObject(providerDetails.getUserInfoUri(), JsonNode.class);

        if (remoteUser == null) {
            throw new IllegalStateException("OAuth User details can't be null");
        }

        return remoteUser;
    }

}
