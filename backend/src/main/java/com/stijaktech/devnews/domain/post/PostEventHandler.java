package com.stijaktech.devnews.domain.post;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.HandleBeforeSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler
public class PostEventHandler {

    private final PostRepository postRepository;

    @Autowired
    public PostEventHandler(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @HandleBeforeCreate
    public void beforeSave(Post post) {
        String alias = post.getAlias();

        if (alias != null) {
            return;
        }

        alias = post.getTitle().toLowerCase();
        alias = alias.replaceAll("[^\\p{IsAlphabetic}\\p{IsDigit}\\- ]", "");
        alias = alias.replace(" ", "-");

        String original = alias;
        for (int i = 1; postRepository.existsByAlias(alias); i++) {
            alias = original + "-" + i;
        }

        post.setAlias(alias);
    }

}
