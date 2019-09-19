package com.stijaktech.devnews.features.authentication.oauth2;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@ConfigurationProperties(prefix = "oauth2")
public class ProviderProperties {

    private Map<String, ProviderDetails> providers = new HashMap<>();

    public Map<String, ProviderDetails> getProviders() {
        return providers;
    }

    public void setProviders(Map<String, ProviderDetails> providers) {
        this.providers = providers;
    }

}
