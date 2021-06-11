package com.stijaktech.devnews.features.authentication.jwt;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Data
@Component
@ConfigurationProperties(prefix = "dev-news.jwt")
public class JwtProperties {

    /**
     * Issuer string to be stored in JWT tokens
     */
    private String issuer = "dev-news";

    /**
     * JWT access token validity period
     */
    private Duration accessTokenValidity = Duration.ofMinutes(10);

    /**
     * JWT refresh token validity period
     */
    private Duration refreshTokenValidity = Duration.ofDays(7);

}
