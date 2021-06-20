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
    private final GeoIpService geoIpService;

    public DeviceService(Parser userAgentParser, UserRepository userRepository, GeoIpService geoIpService) {
        this.userAgentParser = userAgentParser;
        this.userRepository = userRepository;
        this.geoIpService = geoIpService;
        this.keyGenerator = KeyGenerators.string();
    }

    public void updateLastUsedTime(User user, Device device) {
        Set<Device> devices = user.getDevices();
        if (devices == null) {
            devices = new HashSet<>();
        }

        device.setLastUsedOn(clock.instant());
        devices.removeIf(d -> d.getToken().equals(device.getToken()));
        devices.add(device);
        user.setDevices(devices);
        userRepository.save(user);
    }

    public void updateLastUsedTime(User user, Device device, WebDetails webDetails) {
        String userAgent = webDetails.userAgent();
        Client clientDetails = userAgentParser.parse(userAgent);
        GeoData geoData = geoIpService.findByIp(webDetails.ipAddress())
                .orElseGet(device::getGeoData);

        device.setIp(webDetails.ipAddress());
        device.setOs(clientDetails.os.family);
        device.setOsVersion(clientDetails.os.major);
        device.setAgent(clientDetails.userAgent.family);
        device.setGeoData(geoData);

        updateLastUsedTime(user, device);
    }

    public Device findOrCreate(User user, WebDetails webDetails) {
        String userAgent = webDetails.userAgent();
        Client clientDetails = userAgentParser.parse(userAgent);
        GeoData geoData = geoIpService.findByIp(webDetails.ipAddress())
                .orElse(null);

        Device device = findForUser(user, webDetails, clientDetails);

        if (device == null) {
            return createNew(webDetails, clientDetails, geoData);
        }

        return device;
    }

    public Device createNew(WebDetails webDetails, Client clientDetails, GeoData geoData) {
        Instant now = clock.instant();

        Device device = new Device();
        device.setIp(webDetails.ipAddress());
        device.setToken(keyGenerator.generateKey());
        device.setOs(clientDetails.os.family);
        device.setOsVersion(clientDetails.os.major);
        device.setAgent(clientDetails.userAgent.family);
        device.setGeoData(geoData);
        device.setCreatedAt(now);
        device.setLastUsedOn(now);
        return device;
    }

    private Device findForUser(User user, WebDetails webDetails, Client clientDetails) {
        Set<Device> devices = requireNonNullElse(user.getDevices(), emptySet());

        for (Device device : devices) {
            if (!Objects.equals(device.getIp(), webDetails.ipAddress())) {
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

            if (!Objects.equals(device.getAgent(), "Android")) {
                continue;
            }

            return device;
        }

        return null;
    }

}
