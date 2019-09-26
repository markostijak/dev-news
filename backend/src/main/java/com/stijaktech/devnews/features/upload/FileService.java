package com.stijaktech.devnews.features.upload;

import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.codec.Hex;
import org.springframework.security.crypto.keygen.BytesKeyGenerator;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
        return store("image_", image);
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
        if (file == null || file.getOriginalFilename() == null) {
            throw new FileNotPresentException();
        }

        String original = file.getOriginalFilename();
        String filename = generateFileName(prefix, original.substring(original.lastIndexOf(".")));
        file.transferTo(storeLocation.resolve(filename));
        return host + filename;
    }

    private String generateFileName(String prefix, String fileType) {
        return prefix + new String(Hex.encode(keyGenerator.generateKey())) + fileType;
    }

    private void createIfNotExists(Path... paths) throws IOException {
        for (Path path : paths) {
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
        }
    }

}
