package com.stijaktech.devnews.configuration.security;

import com.stijaktech.devnews.features.authentication.jwt.JwtAwareAuthenticationSuccessHandler;
import com.stijaktech.devnews.features.authentication.login.LoginAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.web.filter.CorsFilter;

import java.util.List;
import java.util.function.Supplier;

@Order(10)
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class ApplicationSecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final JwtAwareAuthenticationSuccessHandler successHandler;
    private final List<AuthenticationProvider> authenticationProviders;

    public ApplicationSecurityConfiguration(
            JwtAwareAuthenticationSuccessHandler successHandler,
            List<AuthenticationProvider> authenticationProviders) {

        this.successHandler = successHandler;
        this.authenticationProviders = authenticationProviders;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder authenticationManagerBuilder) {
        authenticationProviders.forEach(authenticationManagerBuilder::authenticationProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.antMatcher("/**")
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .cors()
                .and()
                .csrf()
                .disable()
                .formLogin()
                .disable()
                .httpBasic()
                .disable()
                .logout()
                .disable()
                .authorizeRequests()
                .antMatchers(HttpMethod.POST, "/login", "/login/oauth", "/refresh")
                .permitAll()
                .anyRequest()
                .denyAll()
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                .and()
                .addFilterAfter(new LoginAuthenticationFilter(authenticationManager(), successHandler), CorsFilter.class);
    }

    @Bean
    public Supplier<Authentication> authenticationSupplier() {
        return () -> SecurityContextHolder.getContext().getAuthentication();
    }

}
