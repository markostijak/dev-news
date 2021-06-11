package com.stijaktech.devnews.features.upload;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.nio.file.Path;

@Data
@Validated
@Component
@ConfigurationProperties(prefix = "dev-news.file-upload")
public class FileProperties {

    @NotNull
    @NotBlank
    private String host;

    @NotNull
    private Path storeLocation;

}
