package com.stijaktech.devnews.features.upload;

import org.springframework.data.rest.webmvc.BasePathAwareController;
import org.springframework.hateoas.Link;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;

@BasePathAwareController
public class FileController {

    private FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/files/image")
    public String upload(@RequestParam("file") MultipartFile image) {
        return fileService.storeImage(image);
    }

    @PostMapping("/files/video")
    public String video(@RequestParam("file") MultipartFile video) {
        return fileService.storeVideo(video);
    }

    @PostMapping("/files/document")
    public String document(@RequestParam("file") MultipartFile document) {
        return fileService.storeDocument(document);
    }

}
