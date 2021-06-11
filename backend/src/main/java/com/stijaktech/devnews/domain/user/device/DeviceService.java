package com.stijaktech.devnews.domain.user.device;

import com.stijaktech.devnews.domain.user.User;
import com.stijaktech.devnews.domain.user.UserRepository;
import com.stijaktech.devnews.features.authentication.WebDetails;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.security.crypto.keygen.StringKeyGenerator;
import org.springframework.stereotype.Component;
import ua_parser.Client;
import ua_parser.Parser;

import java.time.Clock;
import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import static java.util.Collections.emptySet;
import static java.util.Objects.requireNonNullElse;

@Component
public class DeviceService {

    @Setter(onMethod_ = @Autowired(required = false))
    private Clock clock = Clock.systemDefaultZone();

    private final Parser userAgentParser;
    private final UserRepository userRepository;
    private final StringKeyGenerator keyGenerator;

    public DeviceService(Parser userAgentParser, UserRepository userRepository) {
        this.userAgentParser = userAgentParser;
        this.userRepository = userRepository;
        this.keyGenerator = KeyGenerators.string();
    }

    public void updateLastUsedTime(User user, Device device) {
        if (user.getDevices() == null) {
            user.setDevices(new HashSet<>());
        }

        device.setLastUsedOn(clock.instant());
        user.getDevices().add(device);
        userRepository.save(user);
    }

    public Device findOrCreate(User user, WebDetails webDetails) {
        String ua = webDetails.getUserAgent();
        Client clientDetails = userAgentParser.parse(ua);

        Device device = findForUser(user, webDetails, clientDetails);

        if (device == null) {
            return createNew(webDetails, clientDetails);
        }

        return device;
    }

    public Device createNew(WebDetails webDetails, Client clientDetails) {
        Instant now = clock.instant();

        Device device = new Device();
        device.setIp(webDetails.getIpAddress());
        device.setToken(keyGenerator.generateKey());
        device.setOs(clientDetails.os.family);
        device.setOsVersion(clientDetails.os.major);
        device.setAgent(clientDetails.userAgent.family);
        device.setCreatedAt(now);
        device.setLastUsedOn(now);
        return device;
    }

    private Device findForUser(User user, WebDetails webDetails, Client clientDetails) {
        Set<Device> devices = requireNonNullElse(user.getDevices(), emptySet());

        for (Device device : devices) {
            if (!Objects.equals(device.getIp(), webDetails.getIpAddress())) {
                continue;
            }

            if (!Objects.equals(device.getOs(), clientDetails.os.family)) {
                continue;
            }

            if (!Objects.equals(device.getOsVersion(), clientDetails.os.major)) {
                continue;
            }

            if (!Objects.equals(device.getAgent(), clientDetails.userAgent.family)) {
                continue;
            }

            return device;
        }

        return null;
    }

}
