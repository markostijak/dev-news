package com.stijaktech.devnews.features.upload;

import org.springframework.data.rest.webmvc.BasePathAwareController;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@BasePathAwareController
public class FileController {

    private FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/files/image")
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile image) {
        return ResponseEntity.ok(fileService.storeImage(image));
    }

    @PostMapping("/files/video")
    public ResponseEntity<String> video(@RequestParam("file") MultipartFile video) {
        return ResponseEntity.ok(fileService.storeVideo(video));
    }

    @PostMapping("/files/document")
    public ResponseEntity<String> document(@RequestParam("file") MultipartFile document) {
        return ResponseEntity.ok(fileService.storeDocument(document));
    }

}
