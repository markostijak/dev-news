package com.stijaktech.devnews.features.upload;

import lombok.SneakyThrows;
import net.coobird.thumbnailator.Thumbnailator;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.builders.BufferedImageBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.codec.Hex;
import org.springframework.security.crypto.keygen.BytesKeyGenerator;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class FileService {

    private String host;
    private Path storeLocation;
    private BytesKeyGenerator keyGenerator;

    public FileService(
            @Value("${file-upload.host}") String host,
            @Value("${file-upload.store-location}") Path storeLocation) throws IOException {

        this.host = host;
        this.storeLocation = storeLocation;
        this.keyGenerator = KeyGenerators.secureRandom(16);
        createIfNotExists(storeLocation);
    }

    @SneakyThrows
    public String storeImage(@NonNull MultipartFile image) {
        assertThatFileIsPresent(image);

        String filename = generateFileName("image_", extractExtension(image));
        File destination = storeLocation.resolve(filename).toFile();

        Thumbnails.of(image.getInputStream())
                .size(1280, 720)
                .keepAspectRatio(true)
                .toFile(destination);

        return host + filename;
    }

    @SneakyThrows
    public String storeVideo(@NonNull MultipartFile video) {
        return store("video_", video);
    }

    @SneakyThrows
    public String storeDocument(@NonNull MultipartFile document) {
        return store("doc_", document);
    }

    private String store(String prefix, MultipartFile file) throws IOException {
        assertThatFileIsPresent(file);

        String filename = generateFileName(prefix, extractExtension(file));
        file.transferTo(storeLocation.resolve(filename));

        return host + filename;
    }

    private void assertThatFileIsPresent(MultipartFile file) {
        if (file == null || file.getOriginalFilename() == null) {
            throw new FileNotPresentException();
        }
    }

    private String generateFileName(String prefix, String fileType) {
        return prefix + new String(Hex.encode(keyGenerator.generateKey())) + fileType;
    }

    private String extractExtension(MultipartFile file) {
        String original = file.getOriginalFilename();
        if (original != null && original.contains(".")) {
            return original.substring(original.lastIndexOf("."));
        }

        String contentType = file.getContentType();
        if (contentType != null && contentType.contains("/")) {
            return "." + contentType.split("/")[1];
        }

        return ".unknown";
    }

    private void createIfNotExists(Path... paths) throws IOException {
        for (Path path : paths) {
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
        }
    }

}
