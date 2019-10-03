package com.stijaktech.devnews.configuration;

import com.stijaktech.devnews.features.authentication.jwt.JwtAuthenticationFilter;
import com.stijaktech.devnews.features.authentication.jwt.JwtAwareAuthenticationFailureHandler;
import com.stijaktech.devnews.features.authentication.jwt.JwtAwareAuthenticationSuccessHandler;
import com.stijaktech.devnews.features.authentication.login.LoginAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.logout.LogoutFilter;

import java.util.List;

@Order(1)
@Configuration
public class ApiSecurityConfiguration extends WebSecurityConfigurerAdapter {

    private JwtAwareAuthenticationSuccessHandler successHandler;
    private JwtAwareAuthenticationFailureHandler failureHandler;
    private List<AuthenticationProvider> authenticationProviders;

    public ApiSecurityConfiguration(
            JwtAwareAuthenticationSuccessHandler successHandler,
            JwtAwareAuthenticationFailureHandler failureHandler,
            List<AuthenticationProvider> authenticationProviders) {

        this.successHandler = successHandler;
        this.failureHandler = failureHandler;
        this.authenticationProviders = authenticationProviders;
    }

    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder authenticationManagerBuilder) {
        authenticationProviders.forEach(authenticationManagerBuilder::authenticationProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.antMatcher("/api/**")
                .cors()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .csrf()
                .disable()
                .formLogin()
                .disable()
                .httpBasic()
                .disable()
                .exceptionHandling()
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                .and()
                .authorizeRequests()
                .antMatchers(HttpMethod.GET)
                .permitAll()
                .and()
                .authorizeRequests()
                .antMatchers("/api/sign-up/**")
                .permitAll()
                .and()
                .authorizeRequests()
                .anyRequest()
                .authenticated()
                .and()
                .addFilterAfter(jwtAuthenticationFilter(), LogoutFilter.class)
                .addFilterAfter(loginAuthenticationFilter(), LogoutFilter.class);
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() throws Exception {
        return new JwtAuthenticationFilter(authenticationManager(), failureHandler);
    }

    @Bean
    public LoginAuthenticationFilter loginAuthenticationFilter() throws Exception {
        return new LoginAuthenticationFilter(authenticationManager(), successHandler);
    }

}
