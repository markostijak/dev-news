package com.stijaktech.devnews.controllers;

import com.stijaktech.devnews.models.Post;
import com.stijaktech.devnews.models.User;
import com.stijaktech.devnews.repositories.PostRepository;
import com.stijaktech.devnews.services.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/posts", "/p"})
public class PostController {

    private PostService postService;
    private PostRepository postRepository;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("/{id}")
    public Post view(@PathVariable("id") String id) {
        return null;
    }

    @PostMapping(path = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Post create(Post post) {
        return postService.create(post);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PatchMapping("/up-vote/{id}")
    public ResponseEntity join(@PathVariable("id") String postId, @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PatchMapping("/down-vote/{id}")
    public ResponseEntity leave(@PathVariable("id") String postId, @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
