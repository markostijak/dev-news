package com.stijaktech.devnews.controllers;

import com.stijaktech.devnews.services.FileService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;

@RestController
@RequestMapping({"/files", "f"})
public class FileController {

    private FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/image")
    public URI upload(@RequestParam("file") MultipartFile image) {
        return fileService.storeImage(image);
    }

    @PostMapping("/video")
    public URI video(@RequestParam("file") MultipartFile video) {
        return fileService.storeVideo(video);
    }

    @PostMapping("/document")
    public URI document(@RequestParam("file") MultipartFile document) {
        return fileService.storeDocument(document);
    }

}
