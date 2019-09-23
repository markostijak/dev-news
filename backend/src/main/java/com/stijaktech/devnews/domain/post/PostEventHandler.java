package com.stijaktech.devnews.domain.post;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler
public class PostEventHandler {

    private PostRepository postRepository;

    @Autowired
    public PostEventHandler(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @HandleBeforeCreate
    public void beforeCreate(Post post) {
        String original = post.getTitle().toLowerCase();
        original = original.replaceAll("[^\\p{IsAlphabetic}\\p{IsDigit}\\- ]", "");
        original = original.replace(" ", "-");

        String alias = original;
        for (int i = 1; postRepository.existsByAlias(alias); i++) {
            alias = original + "-" + i;
        }

        post.setAlias(alias);
    }

}
