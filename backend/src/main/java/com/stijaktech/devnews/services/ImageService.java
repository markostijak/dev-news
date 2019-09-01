package com.stijaktech.devnews.services;

import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;

@Service
public class ImageService {

    public static final Path STATIC_LOCATION = Path.of("/public/");

    private String cdnUrl;
    private RestTemplate restTemplate;

    public ImageService(@Value("${cdn.url}") String cdnUrl, RestTemplate restTemplate) {
        this.cdnUrl = cdnUrl;
        this.restTemplate = restTemplate;
    }

    @SneakyThrows
    public String storeImage(@NonNull String name, @NonNull MultipartFile image, String orDefault) {
        String filename = orDefault;
        if (image != null && !StringUtils.isEmpty(image.getOriginalFilename())) {
            filename = image.getOriginalFilename();
            filename = name.toLowerCase() + filename.substring(filename.lastIndexOf("."));
            image.transferTo(STATIC_LOCATION.resolve(filename));
        }

        return cdnUrl + filename;
    }

    @SneakyThrows
    public String storeImage(@NonNull String name, @NonNull MultipartFile image) {
        if (image == null || StringUtils.isEmpty(image.getOriginalFilename())) {
            throw new IllegalArgumentException("File is missing.");
        }

        String filename = image.getOriginalFilename();
        filename = name.toLowerCase() + filename.substring(filename.lastIndexOf("."));
        image.transferTo(STATIC_LOCATION.resolve(filename));

        return cdnUrl + filename;
    }

}
