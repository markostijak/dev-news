package com.stijaktech.devnews.features.authentication.login;

import com.stijaktech.devnews.domain.user.Provider;
import com.stijaktech.devnews.domain.user.User;
import com.stijaktech.devnews.domain.user.UserRepository;
import com.stijaktech.devnews.domain.user.device.Device;
import com.stijaktech.devnews.domain.user.device.DeviceService;
import com.stijaktech.devnews.features.authentication.AuthenticatedUser;
import com.stijaktech.devnews.features.authentication.WebDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class EmailOrUsernamePasswordAuthenticationProvider implements AuthenticationProvider {

    private final DeviceService deviceService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public EmailOrUsernamePasswordAuthenticationProvider(
            DeviceService deviceService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.deviceService = deviceService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Authentication authenticate(Authentication authentication) {
        String principal = (String) authentication.getPrincipal();
        String credentials = (String) authentication.getCredentials();
        WebDetails webDetails = (WebDetails) authentication.getDetails();

        User model = userRepository.findByEmailOrUsername(principal, principal)
                .filter(u -> u.getProvider() == Provider.LOCAL)
                .filter(u -> passwordEncoder.matches(credentials, u.getPassword()))
                .orElseThrow(() -> new BadCredentialsException("User not found " + principal));

        Device device = deviceService.findOrCreate(model, webDetails);
        AuthenticatedUser user = new AuthenticatedUser(model, device.getToken());
        deviceService.updateLastUsedTime(model, device);

        return new EmailOrUsernamePasswordAuthenticationToken(user, credentials, user.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return EmailOrUsernamePasswordAuthenticationToken.class.equals(authentication);
    }

}
