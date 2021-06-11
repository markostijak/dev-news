package com.stijaktech.devnews.features.authentication.oauth2;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Map;

@Data
@Component
@Validated
@ConfigurationProperties(prefix = "dev-news.oauth2")
public class ProviderProperties {

    @NotNull
    @NotBlank
    private String preEstablishedRedirectUri;

    @NotEmpty
    private Map<String, ProviderDetails> providers = new HashMap<>();

    public ProviderProperties build() {
        providers.forEach((k, provider) -> {
            if (provider.getPreEstablishedRedirectUri() == null) {
                provider.setPreEstablishedRedirectUri(preEstablishedRedirectUri);
            }
        });

        return this;
    }

}
