package com.stijaktech.devnews.features.upload;

import org.springframework.data.rest.webmvc.BasePathAwareController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequestMapping("/files")
@BasePathAwareController
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/image")
    public ResponseEntity<String> image(@RequestParam("file") MultipartFile image) throws IOException {
        return ResponseEntity.ok(fileService.storeImage(image));
    }

    @PostMapping("/video")
    public ResponseEntity<String> video(@RequestParam("file") MultipartFile video) throws IOException {
        return ResponseEntity.ok(fileService.storeVideo(video));
    }

    @PostMapping("/document")
    public ResponseEntity<String> document(@RequestParam("file") MultipartFile document) throws IOException {
        return ResponseEntity.ok(fileService.storeDocument(document));
    }

}
