package com.stijaktech.devnews.configuration.security;

import com.stijaktech.devnews.features.authentication.jwt.JwtAuthenticationFilter;
import com.stijaktech.devnews.features.authentication.jwt.JwtAuthenticationProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.web.filter.CorsFilter;

@Order(9)
@Configuration
public class ApiSecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final JwtAuthenticationProvider jwtAuthenticationProvider;

    @Autowired
    public ApiSecurityConfiguration(JwtAuthenticationProvider jwtAuthenticationProvider) {
        this.jwtAuthenticationProvider = jwtAuthenticationProvider;
    }

    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder authenticationManagerBuilder) {
        authenticationManagerBuilder.authenticationProvider(jwtAuthenticationProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.antMatcher("/api/**")
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
                .antMatchers(HttpMethod.GET)
                .permitAll()
                .antMatchers(HttpMethod.POST, "/api/v1/users", "/api/v1/users/*/activate**")
                .permitAll()
                .and()
                .authorizeRequests()
                .anyRequest()
                .authenticated()
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                .and()
                .addFilterAfter(new JwtAuthenticationFilter(authenticationManager()), CorsFilter.class);
    }

}
