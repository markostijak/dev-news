package com.stijaktech.devnews.configuration;

import com.stijaktech.devnews.domain.community.Community;
import com.stijaktech.devnews.domain.comment.Comment;
import com.stijaktech.devnews.domain.post.Post;
import com.stijaktech.devnews.domain.user.User;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.core.projection.ProjectionDefinitions;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.security.oauth2.client.filter.state.DefaultStateKeyGenerator;
import org.springframework.security.oauth2.client.token.grant.code.AuthorizationCodeAccessTokenProvider;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Configuration
@EnableMongoAuditing
public class ApplicationConfiguration {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new Pbkdf2PasswordEncoder("wyk3gp5sr");
    }

    @Bean
    public AuthorizationCodeAccessTokenProvider authorizationCodeAccessTokenProvider() {
        AuthorizationCodeAccessTokenProvider accessTokenProvider = new AuthorizationCodeAccessTokenProvider();
        accessTokenProvider.setStateKeyGenerator(new DefaultStateKeyGenerator());
        accessTokenProvider.setStateMandatory(false);
        return accessTokenProvider;
    }

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }

    @Bean
    public RepositoryRestConfigurer repositoryRestConfigurer() {
        return new RepositoryRestConfigurer() {
            @Override
            public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
                config.exposeIdsFor(User.class, Community.class, Post.class, Comment.class);
            }
        };
    }

    @Bean
    public AuditorAware<User> auditorProvider() {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext())
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getPrincipal)
                .map(User.class::cast);
    }

    @Bean
    public ProjectionFactory projectionFactory(BeanFactory beanFactory) {
        SpelAwareProxyProjectionFactory spel = new SpelAwareProxyProjectionFactory();
        spel.setBeanFactory(beanFactory);
        return spel;
    }

    @Bean
    public ProjectionDefinitions projectionDefinitions(RepositoryRestConfiguration configuration) {
        return configuration.getProjectionConfiguration();
    }

}
