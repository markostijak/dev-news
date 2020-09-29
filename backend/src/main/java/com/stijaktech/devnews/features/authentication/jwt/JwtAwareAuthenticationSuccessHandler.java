package com.stijaktech.devnews.features.authentication.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stijaktech.devnews.domain.user.Device;
import com.stijaktech.devnews.domain.user.User;
import com.stijaktech.devnews.domain.user.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.security.crypto.keygen.StringKeyGenerator;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static com.stijaktech.devnews.features.authentication.jwt.JwtProvider.DEVICE;
import static org.checkerframework.checker.nullness.Opt.orElseGet;
import static org.springframework.http.HttpHeaders.USER_AGENT;

@Component
public class JwtAwareAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final ObjectMapper jackson;
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final StringKeyGenerator keyGenerator;

    @Autowired
    public JwtAwareAuthenticationSuccessHandler(ObjectMapper jackson, JwtProvider jwtProvider, UserRepository userRepository) {
        this.jackson = jackson;
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
        this.keyGenerator = KeyGenerators.string();
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        Instant now = Instant.now();
        User user = (User) authentication.getPrincipal();

        Set<Device> devices = orElseGet(user.getDevices(), HashSet::new);
        Device device = findDevice(authentication, devices).orElseGet(() -> createDevice(now, request));
        devices.add(device);

        String accessToken = jwtProvider.generateAccessToken(user, now);
        String refreshToken = jwtProvider.generateRefreshToken(user, device, now);

        user.setDevices(devices);
        userRepository.save(user);

        response.setStatus(HttpStatus.OK.value());
        response.setHeader("X-Auth-Token", accessToken);
        response.setHeader("X-Refresh-Token", refreshToken);
        response.setHeader("Access-Control-Expose-Headers", "X-Auth-Token, X-Refresh-Token");
        jackson.writeValue(response.getWriter(), user);
    }

    private Optional<Device> findDevice(Authentication authentication, @NonNull Set<Device> devices) {
        if (authentication instanceof JwtRefreshAuthenticationToken) {
            Claims claims = (Claims) authentication.getDetails();
            String key = claims.get(DEVICE, String.class);

            return devices.stream().filter(device -> key.equals(device.getToken())).findFirst();
        }

        return Optional.empty();
    }

    private Device createDevice(Instant time, HttpServletRequest request) {
        return Device.builder()
                .createdAt(time)
                .ip(request.getRemoteAddr())
                .token(keyGenerator.generateKey())
                .name(request.getHeader(USER_AGENT))
                .build();
    }

}
