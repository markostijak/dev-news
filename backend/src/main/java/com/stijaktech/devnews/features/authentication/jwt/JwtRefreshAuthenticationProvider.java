package com.stijaktech.devnews.features.authentication.jwt;

import com.stijaktech.devnews.domain.user.User;
import com.stijaktech.devnews.domain.user.UserRepository;
import com.stijaktech.devnews.domain.user.device.Device;
import com.stijaktech.devnews.domain.user.device.DeviceService;
import com.stijaktech.devnews.features.authentication.AuthenticatedUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class JwtRefreshAuthenticationProvider implements AuthenticationProvider {

    private final JwtProvider jwtProvider;
    private final DeviceService deviceService;
    private final UserRepository userRepository;

    @Autowired
    public JwtRefreshAuthenticationProvider(
            JwtProvider jwtProvider,
            DeviceService deviceService,
            UserRepository userRepository) {

        this.jwtProvider = jwtProvider;
        this.deviceService = deviceService;
        this.userRepository = userRepository;
    }

    @Override
    public Authentication authenticate(Authentication authentication) {
        String jwt = (String) authentication.getCredentials();

        AuthenticatedUser user = jwtProvider.parse(jwt)
                .filter(jwtProvider::isRefreshToken).map(jwtProvider::parseUserDetails)
                .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));

        User model = userRepository.findById(user.getId())
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        Device device = model.getDevices().stream()
                .filter(d -> d.getToken().equals(user.getDevice())).findFirst()
                .orElseThrow(() -> new BadCredentialsException("Refresh token has been revoked"));

        deviceService.updateLastUsedTime(model, device);

        return new JwtRefreshAuthenticationToken(user, jwt, user.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return JwtRefreshAuthenticationToken.class.equals(authentication);
    }

}
