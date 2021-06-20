package com.stijaktech.devnews.domain.user.device;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Slf4j
@Component
public class GeoIpService {

    private final String endpoint;
    private final RestTemplate restTemplate;

    @Autowired
    public GeoIpService(@Value("${dev-news.geo-ip.endpoint}") String endpoint, RestTemplate restTemplate) {
        this.endpoint = endpoint;
        this.restTemplate = restTemplate;
    }

    public Optional<GeoData> findByIp(String ip) {
        try {
            GeoData geoData = findByIpInternal(ip);
            return Optional.ofNullable(geoData);
        } catch (RestClientException e) {
            log.error("Unable to retrieve geo data", e);
            return Optional.empty();
        }
    }

    private GeoData findByIpInternal(String ip) {
        ObjectNode response = restTemplate.getForObject(endpoint + ip, ObjectNode.class);

        if (response == null) {
            return null;
        }

        return new GeoData(
                response.get("geoplugin_countryName").asText(null),
                response.get("geoplugin_city").asText(null)
        );
    }

}
