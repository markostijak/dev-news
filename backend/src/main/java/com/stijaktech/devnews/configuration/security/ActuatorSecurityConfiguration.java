package com.stijaktech.devnews.configuration.security;

import com.stijaktech.devnews.domain.user.Role;
import com.stijaktech.devnews.domain.user.User;
import com.stijaktech.devnews.domain.user.UserRepository;
import com.stijaktech.devnews.features.authentication.AuthenticatedUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.util.matcher.IpAddressMatcher;

@Order(2)
@Configuration
public class ActuatorSecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final UserRepository userRepository;

    @Autowired
    public ActuatorSecurityConfiguration(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.antMatcher("/actuator/**")
                .userDetailsService(new AuthenticationService(userRepository))
                .httpBasic()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .csrf()
                .disable()
                .exceptionHandling()
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.FORBIDDEN))
                .and()
                .authorizeRequests()
                .requestMatchers(new IpAddressMatcher("127.0.0.1"))
                .permitAll()
                .anyRequest()
                .hasRole(Role.WEBMASTER.name());
    }

    record AuthenticationService(UserRepository userRepository) implements UserDetailsService {
        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
            User user = userRepository.findByEmailOrUsername(username, username)
                    .orElseThrow(() -> new UsernameNotFoundException(username));

            return new AuthenticatedUser(user, null) {
                @Override
                public String getPassword() {
                    return user.getPassword();
                }
            };
        }
    }

}
