package com.stijaktech.devnews.features.upload;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.codec.Hex;
import org.springframework.security.crypto.keygen.BytesKeyGenerator;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.PosixFilePermission;
import java.util.Set;

@Service
@SuppressWarnings("ResultOfMethodCallIgnored")
public class FileService implements InitializingBean {

    private final FileProperties properties;
    private final BytesKeyGenerator keyGenerator;

    public FileService(FileProperties fileProperties) {
        this.properties = fileProperties;
        this.keyGenerator = KeyGenerators.secureRandom(16);
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        createIfNotExists(properties.getStoreLocation());
    }

    public String storeImage(@NonNull MultipartFile image) throws IOException {
        assertThatFileIsPresent(image);

        String filename = generateFileName("image_", extractExtension(image));
        File destination = properties.getStoreLocation().resolve(filename).toFile();

        BufferedImage bufferedImage = ImageIO.read(image.getInputStream());

        if (bufferedImage.getWidth() < 1280 && bufferedImage.getHeight() < 720) {
            image.transferTo(destination);
        } else {
            Thumbnails.of(bufferedImage).size(1280, 720).keepAspectRatio(true).toFile(destination);
        }

        destination.setReadable(true, false);

        return properties.getHost() + filename;
    }

    public String storeVideo(@NonNull MultipartFile video) throws IOException {
        return store("video_", video);
    }

    public String storeDocument(@NonNull MultipartFile document) throws IOException {
        return store("doc_", document);
    }

    private String store(String prefix, MultipartFile file) throws IOException {
        assertThatFileIsPresent(file);

        String filename = generateFileName(prefix, extractExtension(file));
        Path destination = properties.getStoreLocation().resolve(filename);
        Files.setPosixFilePermissions(destination, Set.of(PosixFilePermission.OTHERS_READ));
        file.transferTo(destination);

        return properties.getHost() + filename;
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
