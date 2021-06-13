package com.stijaktech.devnews.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.stijaktech.devnews.domain.user.User;
import com.stijaktech.devnews.features.authentication.AuthenticatedUser;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.task.TaskExecutor;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.core.event.ValidatingRepositoryEventListener;
import org.springframework.data.rest.core.projection.ProjectionDefinitions;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.hateoas.mediatype.MessageResolver;
import org.springframework.hateoas.mediatype.hal.CurieProvider;
import org.springframework.hateoas.mediatype.hal.Jackson2HalModule;
import org.springframework.hateoas.mediatype.hal.Jackson2HalModule.HalHandlerInstantiator;
import org.springframework.hateoas.server.LinkRelationProvider;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.security.oauth2.client.filter.state.DefaultStateKeyGenerator;
import org.springframework.security.oauth2.client.token.grant.code.AuthorizationCodeAccessTokenProvider;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import ua_parser.Parser;

import java.time.Clock;
import java.time.Duration;
import java.util.Optional;

@Configuration
@EnableMongoAuditing
public class ApplicationConfiguration {

    @Bean
    public CorsConfigurationSource corsConfigurationSource(@Value("${dev-news.cors.origin}") String origin) {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(false);
        config.addAllowedOrigin(origin);
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return source;
    }

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
    public RepositoryRestConfigurer repositoryRestConfigurer(LocalValidatorFactoryBean validator) {
        return new RepositoryRestConfigurer() {
            @Override
            public void configureValidatingRepositoryEventListener(ValidatingRepositoryEventListener validatingListener) {
                validatingListener.addValidator("beforeCreate", validator);
                validatingListener.addValidator("beforeSave", validator);
            }

            @Override
            public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
                config.setReturnBodyOnUpdate(true);
                config.setReturnBodyForPutAndPost(true);
            }
        };
    }

    @Bean
    public AuditorAware<User> auditorProvider() {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext())
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getPrincipal)
                .filter(p -> p instanceof AuthenticatedUser)
                .map(AuthenticatedUser.class::cast)
                .map(AuthenticatedUser::toUser);
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

    @Bean
    @Primary
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        return builder.createXmlMapper(false).build();
    }

    @Autowired
    @Bean("halMapper")
    public ObjectMapper halObjectMapper(Jackson2ObjectMapperBuilder builder,
                                        LinkRelationProvider provider, MessageResolver resolver) {
        return builder.modulesToInstall(new Jackson2HalModule())
                .handlerInstantiator(new HalHandlerInstantiator(provider, CurieProvider.NONE, resolver))
                .createXmlMapper(false)
                .build();
    }

    @Bean
    public Parser userAgentParser() {
        return new Parser();
    }

    @Bean
    public Clock clock() {
        return Clock.systemDefaultZone();
    }

    @Configuration
    public static class CacheConfiguration extends CachingConfigurerSupport {

        @Bean
        public CacheManager cacheManager() {
            return new ConcurrentMapCacheManager();
        }

        @Autowired
        @Bean("ttlCache")
        public CacheManager ttlCacheManager(TaskExecutor taskExecutor) {
            CaffeineCacheManager cacheManager = new CaffeineCacheManager();
            cacheManager.setCaffeine(Caffeine.newBuilder()
                    .initialCapacity(100)
                    .maximumSize(1000)
                    .executor(taskExecutor)
                    .expireAfterWrite(Duration.ofMinutes(5))
                    .recordStats()
            );

            return cacheManager;
        }

    }

}
