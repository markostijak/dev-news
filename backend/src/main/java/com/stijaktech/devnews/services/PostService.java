package com.stijaktech.devnews.services;

import com.stijaktech.devnews.models.Post;
import org.springframework.stereotype.Service;

@Service
public class PostService {

    public Post create(Post post) {
        return Post.builder().build();
    }

}
