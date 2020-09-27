package com.stijaktech.devnews.features.authentication.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stijaktech.devnews.domain.user.Device;
import com.stijaktech.devnews.domain.user.User;
import com.stijaktech.devnews.domain.user.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.security.crypto.keygen.StringKeyGenerator;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.function.Supplier;

import static com.stijaktech.devnews.features.authentication.jwt.JwtProvider.DEVICE_KEY;
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

        Device device = extractDevice(authentication, user, () -> createDevice(now, request));

        String accessToken = jwtProvider.generateAccessToken(user, now);
        String refreshToken = jwtProvider.generateRefreshToken(user, device, now);

        user.getDevices().put(device.getId(), device);
        userRepository.save(user);

        response.setStatus(HttpStatus.OK.value());
        response.setHeader("X-Auth-Token", accessToken);
        response.setHeader("X-Refresh-Token", refreshToken);
        response.setHeader("Access-Control-Expose-Headers", "X-Auth-Token, X-Refresh-Token");
        jackson.writeValue(response.getWriter(), user);
    }

    @SuppressWarnings("unchecked")
    private Device extractDevice(Authentication authentication, User user, Supplier<Device> orElseGet) {
        if (authentication instanceof JwtRefreshAuthenticationToken) {
            Jws<Claims> jws = (Jws<Claims>) authentication.getCredentials();
            Long key = jws.getBody().get(DEVICE_KEY, Long.class);
            Map<Long, Device> devices = user.getDevices();

            if (devices.containsKey(key)) {
                return devices.get(key);
            }
        }

        return orElseGet.get();
    }

    private Device createDevice(Instant time, HttpServletRequest request) {
        return Device.builder()
                .createdAt(time)
                .id(time.getEpochSecond())
                .ip(request.getRemoteAddr())
                .token(keyGenerator.generateKey())
                .name(request.getHeader(USER_AGENT))
                .build();
    }

}
