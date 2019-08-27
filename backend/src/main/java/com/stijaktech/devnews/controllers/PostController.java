package com.stijaktech.devnews.controllers;

import com.stijaktech.devnews.models.Post;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/posts", "/p"})
public class PostController {

    @GetMapping("/{id}")
    public Post view(@PathVariable("id") String id) {
        return null;
    }

}
