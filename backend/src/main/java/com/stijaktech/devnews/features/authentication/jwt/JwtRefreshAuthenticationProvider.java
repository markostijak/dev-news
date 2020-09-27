package com.stijaktech.devnews.features.authentication.jwt;

import com.stijaktech.devnews.domain.user.Device;
import com.stijaktech.devnews.domain.user.User;
import com.stijaktech.devnews.domain.user.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import java.util.Map;

import static com.stijaktech.devnews.features.authentication.jwt.JwtProvider.DEVICE_KEY;
import static com.stijaktech.devnews.features.authentication.jwt.JwtProvider.DEVICE_TOKEN;

@Component
public class JwtRefreshAuthenticationProvider implements AuthenticationProvider {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    @Autowired
    public JwtRefreshAuthenticationProvider(JwtProvider jwtProvider, UserRepository userRepository) {
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String jwt = (String) authentication.getCredentials();

        return jwtProvider.parse(jwt)
                .flatMap(jws -> userRepository.findById(jws.getBody().getSubject())
                        .filter(user -> validate(jws, user))
                        .map(user -> new JwtRefreshAuthenticationToken(user, jws, user.getAuthorities())))
                .orElseThrow(() -> new JwtAuthenticationException("Invalid refresh token", jwt));
    }

    private boolean validate(Jws<Claims> jws, User user) {
        Claims claims = jws.getBody();
        Map<Long, Device> devices = user.getDevices();

        Long key = claims.get(DEVICE_KEY, Long.class);
        String token = claims.get(DEVICE_TOKEN, String.class);

        Device device = devices.get(key);

        return device != null && device.getToken().equals(token);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return JwtRefreshAuthenticationToken.class.equals(authentication);
    }

}
