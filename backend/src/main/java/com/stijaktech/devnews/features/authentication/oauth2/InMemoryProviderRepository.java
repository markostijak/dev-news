package com.stijaktech.devnews.features.authentication.oauth2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import java.util.Map;
import java.util.Optional;

@Primary
@Component
class InMemoryProviderRepository implements ProviderRepository {

    private Map<String, ProviderDetails> providers;

    @Autowired
    public InMemoryProviderRepository(@NonNull ProviderProperties providerProperties) {
        Assert.notNull(providerProperties, "OAuth2ProviderProperties can't be null.");
        this.providers = providerProperties.getProviders();
    }

    @Override
    public Optional<ProviderDetails> findByName(String name) {
        return Optional.ofNullable(providers.get(name));
    }

}
